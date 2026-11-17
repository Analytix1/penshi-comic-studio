/* ============================================================
   mix.js — how two colours combine.

   light    colours add, like coloured lamps: red + green = yellow.
   pigment  colours mix like paint: blue + yellow = green,
            complements grey each other out, darks dominate.

   Pigment mixing is a small Kubelka–Munk model. Each RGB colour is
   spread into a few bands of reflectance (three smooth, overlapping
   curves that sum to one, so white is flat). Each band is turned
   into an absorption/scatter ratio, the ratios are mixed in
   proportion, and the result is turned back into reflectance and
   then RGB. Because the curves overlap, blue keeps a little
   reflectance in the middle bands, which is what lets blue and
   yellow leave green behind — a plain RGB average gives grey.
   ============================================================ */
"use strict";

const Mix = (() => {
  const N = 12, EPS = 0.02, WHITE_PULL = 0.35;
  /* sRGB <-> linear, as lookup tables */
  const TO_LIN = new Float32Array(256);
  for (let i = 0; i < 256; i++) { const c = i / 255; TO_LIN[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  /* callers may hand in fractional or slightly out-of-range channels */
  const lin = v => TO_LIN[v <= 0 ? 0 : v >= 255 ? 255 : Math.round(v)];
  const toSrgb = v => { v = v <= 0 ? 0 : v >= 1 ? 1 : v; return Math.round((v <= 0.0031308 ? v * 12.92 : 1.055 * Math.pow(v, 1 / 2.4) - 0.055) * 255); };

  /* three band curves (red, green, blue), normalised per band.
     Blue is broad and spills into the middle bands (as real blues do), red
     has a sharp edge and a small violet bump at the short end; that pairing
     is what makes blue + yellow green and red + blue a dull violet. */
  const BASIS = [new Float32Array(N), new Float32Array(N), new Float32Array(N)];   // r, g, b
  for (let i = 0; i < N; i++) {
    const x = i / (N - 1);
    let b = 1 / (1 + Math.exp((x - 0.42) / 0.09)), r = 1 / (1 + Math.exp(-(x - 0.7) / 0.035));
    const v = 0.2 * Math.exp(-((x / 0.13) ** 2)); r += v * b; b -= v * b;
    const g = Math.max(0, 1 - r - b), sum = r + g + b;
    BASIS[0][i] = r / sum; BASIS[1][i] = g / sum; BASIS[2][i] = b / sum;
  }
  /* least-squares way back: BACK · BASIS = identity, so an unmixed colour returns unchanged */
  const BACK = (() => {
    const A = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) for (let i = 0; i < N; i++) A[a][b] += BASIS[a][i] * BASIS[b][i];
    const [[a, b, c], [d, e, f], [g, h, k]] = A, det = a * (e * k - f * h) - b * (d * k - f * g) + c * (d * h - e * g);
    const inv = [[(e * k - f * h) / det, (c * h - b * k) / det, (b * f - c * e) / det],
                 [(f * g - d * k) / det, (a * k - c * g) / det, (c * d - a * f) / det],
                 [(d * h - e * g) / det, (b * g - a * h) / det, (a * e - b * d) / det]];
    return [0, 1, 2].map(r => Float32Array.from({ length: N }, (_, i) => inv[r][0] * BASIS[0][i] + inv[r][1] * BASIS[1][i] + inv[r][2] * BASIS[2][i]));
  })();

  /* a, b: [r, g, b] 0..255.  t: share of b, 0..1 */
  function pigment(a, b, t) {
    if (t <= 0 || (a[0] === b[0] && a[1] === b[1] && a[2] === b[2])) return [a[0], a[1], a[2]];
    if (t >= 1) return [b[0], b[1], b[2]];
    const A = [lin(a[0]), lin(a[1]), lin(a[2])], B = [lin(b[0]), lin(b[1]), lin(b[2])];
    /* light paints tint more strongly than this simple model gives them
       credit for (white scatters a great deal), so weight by lightness */
    const wa = (1 - t) * (WHITE_PULL + 0.2126 * A[0] + 0.7152 * A[1] + 0.0722 * A[2]);
    const wb = t * (WHITE_PULL + 0.2126 * B[0] + 0.7152 * B[1] + 0.0722 * B[2]);
    const u = wb / (wa + wb);
    const out = [0, 0, 0], ea = [0, 0, 0], eb = [0, 0, 0];
    for (let i = 0; i < N; i++) {
      let ra = A[0] * BASIS[0][i] + A[1] * BASIS[1][i] + A[2] * BASIS[2][i]; ra = ra < EPS ? EPS : ra > 1 ? 1 : ra;
      let rb = B[0] * BASIS[0][i] + B[1] * BASIS[1][i] + B[2] * BASIS[2][i]; rb = rb < EPS ? EPS : rb > 1 ? 1 : rb;
      const k = (1 - u) * ((1 - ra) * (1 - ra) / (2 * ra)) + u * ((1 - rb) * (1 - rb) / (2 * rb));
      const r = 1 + k - Math.sqrt(k * k + 2 * k);
      for (let c = 0; c < 3; c++) { out[c] += BACK[c][i] * r; ea[c] += BACK[c][i] * ra; eb[c] += BACK[c][i] * rb; }
    }
    /* the clamp above bends very dark colours slightly; hand that error back
       in proportion so the ends of a mix are exactly the two colours */
    return [0, 1, 2].map(c => toSrgb(out[c] + (1 - t) * (A[c] - ea[c]) + t * (B[c] - eb[c])));
  }
  /* two lights sharing the same power: an average in linear light */
  function light(a, b, t) {
    if (t <= 0) return [a[0], a[1], a[2]];
    if (t >= 1) return [b[0], b[1], b[2]];
    return [0, 1, 2].map(i => toSrgb(lin(a[i]) * (1 - t) + lin(b[i]) * t));
  }
  const plain = (a, b, t) => [0, 1, 2].map(i => Math.round(a[i] + (b[i] - a[i]) * t));
  const mix = (mode, a, b, t) => mode === "pigment" ? pigment(a, b, t) : mode === "light" ? light(a, b, t) : plain(a, b, t);

  const rgb = hex => { let h = hex.replace("#", ""); if (h.length === 3) h = h.replace(/./g, "$&$&"); const n = parseInt(h, 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
  const hex = c => "#" + c.map(v => Math.max(0, Math.min(255, v | 0)).toString(16).padStart(2, "0")).join("");
  const mixHex = (mode, a, b, t = 0.5) => hex(mix(mode, rgb(a), rgb(b), t));

  /* Composite `src` onto `dst` (both canvases' 2-D contexts) inside a box
     given in src's pixels. alpha: the stroke's overall opacity.
     mode: "light" | "pigment". Where dst is empty the stroke lands as itself;
     where there is paint already, the two colours combine by the chosen rule.
     dst may carry a whole-pixel translation (an off-page render of a lasso
     selection does); pixel reads and writes ignore transforms, so it is
     applied by hand. */
  const STRENGTH = 0.5;      // a fully opaque stroke takes half of the mix
  function composite(dst, src, alpha, mode, box) {
    const T = dst.getTransform(), tx = T.e, ty = T.f;
    if (T.a !== 1 || T.b !== 0 || T.c !== 0 || T.d !== 1 || tx !== Math.round(tx) || ty !== Math.round(ty)) {
      /* never expected; land the stroke unmixed rather than in the wrong place */
      dst.save(); dst.globalAlpha = alpha; dst.globalCompositeOperation = mode === "light" ? "lighter" : "source-over";
      dst.drawImage(src.canvas, 0, 0); dst.restore();
      return;
    }
    const x0 = Math.max(0, -tx, Math.floor(box.x0)), y0 = Math.max(0, -ty, Math.floor(box.y0));
    const x1 = Math.min(src.canvas.width, dst.canvas.width - tx, Math.ceil(box.x1));
    const y1 = Math.min(src.canvas.height, dst.canvas.height - ty, Math.ceil(box.y1));
    if (x1 <= x0 || y1 <= y0) return;
    if (mode === "light") {            // the browser adds for us (and applies the translation)
      dst.save(); dst.globalAlpha = alpha; dst.globalCompositeOperation = "lighter";
      dst.drawImage(src.canvas, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0); dst.restore();
      return;
    }
    const S = src.getImageData(x0, y0, x1 - x0, y1 - y0), D = dst.getImageData(x0 + tx, y0 + ty, x1 - x0, y1 - y0);
    const s = S.data, d = D.data, cache = new Map(), a3 = [0, 0, 0], b3 = [0, 0, 0];
    for (let i = 0; i < s.length; i += 4) {
      const sa = s[i + 3] / 255 * alpha;
      if (sa <= 0) continue;
      const da = d[i + 3] / 255;
      if (da <= 0) { d[i] = s[i]; d[i + 1] = s[i + 1]; d[i + 2] = s[i + 2]; d[i + 3] = Math.round(sa * 255); continue; }
      const eff = sa * STRENGTH, t = eff / (eff + da * (1 - eff));
      const tq = Math.round(t * 32);
      /* 7 bits per channel and 33 mix steps: the low part stays below 2^34, so
         the high part (the stroke's green and blue) can never collide with it */
      const key = ((d[i] >> 1) << 21 | (d[i + 1] >> 1) << 14 | (d[i + 2] >> 1) << 7 | (s[i] >> 1)) * 33 + tq + ((s[i + 1] >> 1) * 128 + (s[i + 2] >> 1)) * 17179869184;
      let c = cache.get(key);
      if (!c) { a3[0] = d[i]; a3[1] = d[i + 1]; a3[2] = d[i + 2]; b3[0] = s[i]; b3[1] = s[i + 1]; b3[2] = s[i + 2]; c = pigment(a3, b3, tq / 32); cache.set(key, c); }
      d[i] = c[0]; d[i + 1] = c[1]; d[i + 2] = c[2];
      d[i + 3] = Math.round((sa + da * (1 - sa)) * 255);
    }
    dst.putImageData(D, x0 + tx, y0 + ty);
  }

  return { pigment, light, mix, mixHex, rgb, hex, composite };
})();
