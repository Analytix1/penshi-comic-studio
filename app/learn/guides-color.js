/* ============================================================
   learn/guides-color.js — guides for "Mixing and blending: light,
   paint and edges". Every mixed swatch is computed with Mix (js/mix.js),
   the same code the Light and Pigment painting modes use, so what a
   student paints with those modes lands on these colours.
   ============================================================ */
"use strict";

(() => {
  const { K, reg } = GuideKit;
  const X = f => K.X(f), Y = f => K.Y(f);
  const notes = (ctx, y, list, dy = 0.03) => list.forEach((t, i) => K.note(ctx, y + i * dy, t));
  const lab = (ctx, x, y, t, o = {}) => K.label(ctx, x, y, t, { fs: 0.1, ...o });
  const box = (ctx, x, y, w, h, color) => { ctx.fillStyle = color; ctx.fillRect(X(x), Y(y), X(w), Y(h)); K.style(ctx); };
  const frame = (ctx, x, y, w, h) => { K.style(ctx); ctx.strokeRect(X(x), Y(y), X(w), Y(h)); };
  const pig = (a, b, t = 0.5) => Mix.mixHex("pigment", a, b, t);
  const avg = (a, b, t = 0.5) => Mix.mixHex("off", a, b, t);
  const lightAvg = (a, b, t = 0.5) => Mix.mixHex("light", a, b, t);
  /* a small seeded random, so a guide paints the same every time */
  const rng = seed => () => { let t = seed += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const chroma = hex => { const c = Mix.rgb(hex); return Math.max(...c) - Math.min(...c); };
  const pointer = (ctx, x0, y0, x1, y1, text, o = {}) => {
    K.style(ctx, { lw: Math.max(1.5, K.S(0.008)) }); K.line(ctx, x0, y0, x1, y1); K.style(ctx);
    K.dot(ctx, x0, y0, 0.016);
    lab(ctx, x1 + (o.left ? -0.006 : 0.006), y1, text, { fs: 0.09, align: o.left ? "right" : "left" });
  };

  /* ============================================================
     1 · Light adds, paint subtracts
     ============================================================ */
  {
    const panels = [{ x: 0.07, kind: "light" }, { x: 0.53, kind: "paint" }], PW = 0.4, PY = 0.13;
    const PH = () => PW * K.page().w / K.page().h;               // square panels
    const circles = p => {
      const cx = X(p.x + PW / 2), cy = Y(PY) + X(PW) * 0.5, r = X(PW) * 0.22;
      return [[cx - r * 0.62, cy - r * 0.38], [cx + r * 0.62, cy - r * 0.38], [cx, cy + r * 0.66]].map(([x, y]) => ({ x, y, r }));
    };
    const LIGHTS = ["#ff0000", "#00ff00", "#0000ff"], PAINTS = ["#00a6d6", "#d6247f", "#ffe600"];
    const NAMES = { light: ["red", "green", "blue"], paint: ["cyan", "magenta", "yellow"] };
    const disc = (ctx, c) => { ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2); };
    const names = (ctx, p, color) => circles(p).forEach((c, i) => {
      const dx = i === 2 ? 0 : (i ? 1 : -1) * c.r * 1.05, dy = i === 2 ? c.r * 1.12 : -c.r * 1.08;
      lab(ctx, (c.x + dx) / K.page().w, (c.y + dy) / K.page().h, NAMES[p.kind][i], { fs: 0.095, align: "center", fill: color });
    });
    const pairRow = (ctx, y, a, b, result, how) => {
      const s = 0.07, h = s * K.page().w / K.page().h;
      box(ctx, 0.07, y, s, h, a); lab(ctx, 0.07 + s + 0.012, y + h / 2, "+", { fs: 0.14, bold: true });
      box(ctx, 0.07 + s + 0.035, y, s, h, b); lab(ctx, 0.07 + 2 * s + 0.047, y + h / 2, "=", { fs: 0.14, bold: true });
      box(ctx, 0.07 + 2 * s + 0.07, y, s, h, result);
      [0, s + 0.035, 2 * s + 0.07].forEach(dx => frame(ctx, 0.07 + dx, y, s, h));
      lab(ctx, 0.07 + 3 * s + 0.09, y + h / 2, how, { fs: 0.095 });
    };
    reg("mixLightPigment", [
      ["the circles", ctx => {
        K.title(ctx, "Two kinds of mixing: light adds, paint subtracts");
        for (const p of panels) {
          frame(ctx, p.x, PY, PW, PH());
          K.style(ctx, { lw: Math.max(1.5, K.S(0.008)) });
          circles(p).forEach(c => { disc(ctx, c); ctx.stroke(); });
          K.style(ctx);
          if (p.kind === "paint") names(ctx, p, "#1b2a3a");          // the light set's names go on with its dark wall
        }
        lab(ctx, 0.07, PY + PH() + 0.022, "LIGHT — lamps on a dark wall: colours ADD", { bold: true });
        lab(ctx, 0.53, PY + PH() + 0.022, "PAINT — pigments on white paper: colours SUBTRACT", { bold: true });
        lab(ctx, 0.07, 0.505, "THE SAME PAIR, BOTH WAYS", { bold: true });
        frame(ctx, 0.06, 0.52, 0.88, 0.2);                         // one box round both rows: one part each step
        notes(ctx, 0.75, ["Level 1: two sets of three circles. Level 2: lights on a dark wall. Level 3: paints on white paper.",
                          "Light ADDS: every overlap is brighter, and red, green and blue together make white. Screens make every colour this way.",
                          "Paint SUBTRACTS: each pigment swallows part of the light, so every overlap is darker. Cyan, magenta and yellow",
                          "together make a dark mud. Printers and paint boxes work this way.",
                          "Penshi's Colour mixing setting has a Light and a Pigment mode that follow these two rules; these swatches use the same code.",
                          "Real paints vary by brand and pigment: a real blue and yellow can make a duller or brighter green than this."]);
      }],
      ["light", ctx => {
        const p = panels[0];
        box(ctx, p.x, PY, PW, PH(), "#101114");
        ctx.save(); ctx.globalCompositeOperation = "lighter";
        circles(p).forEach((c, i) => { disc(ctx, c); ctx.fillStyle = LIGHTS[i]; ctx.fill(); });
        ctx.restore();
        names(ctx, p, "#e8e6e0");
        pairRow(ctx, 0.53, "#0000ff", "#ffff00", "#ffffff", "as LIGHT: blue and yellow lamps make white");
      }],
      ["paint", ctx => {
        const p = panels[1], cs = circles(p), C = PAINTS;
        cs.forEach((c, i) => { disc(ctx, c); ctx.fillStyle = C[i]; ctx.fill(); });
        for (const [i, j] of [[0, 1], [0, 2], [1, 2]]) {
          ctx.save(); disc(ctx, cs[i]); ctx.clip(); disc(ctx, cs[j]); ctx.fillStyle = pig(C[i], C[j]); ctx.fill(); ctx.restore();
        }
        ctx.save(); disc(ctx, cs[0]); ctx.clip(); disc(ctx, cs[1]); ctx.clip(); disc(ctx, cs[2]);
        ctx.fillStyle = pig(pig(C[0], C[1]), C[2], 1 / 3); ctx.fill(); ctx.restore();
        K.style(ctx);
        pairRow(ctx, 0.62, "#23409a", "#f2c230", pig("#23409a", "#f2c230"), "as PAINT: blue and yellow make green");
      }],
    ], { color: true });
  }

  /* ============================================================
     2 · A mixing chart
     ============================================================ */
  {
    const PAL = [["red", "#c8282e"], ["yellow", "#f2c230"], ["blue", "#23409a"], ["white", "#ffffff"], ["black", "#1a1a1a"], ["brown", "#8a4a24"]];
    const X0 = 0.19, Y0 = 0.16, CS = 0.118;
    const ch = () => CS * K.page().w / K.page().h;
    const cell = (ctx, i, j, color) => box(ctx, X0 + j * CS, Y0 + i * ch(), CS, ch(), color);
    reg("mixChart", [
      ["grid and the six paints", ctx => {
        K.title(ctx, "A mixing chart: what every pair of six paints makes");
        PAL.forEach(([n], k) => {
          lab(ctx, X0 + k * CS + CS / 2, Y0 - 0.018, n, { fs: 0.095, align: "center", bold: true });
          lab(ctx, X0 - 0.012, Y0 + k * ch() + ch() / 2, n, { fs: 0.095, align: "right", bold: true });
        });
        PAL.forEach(([, c], k) => cell(ctx, k, k, c));
        for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) frame(ctx, X0 + j * CS, Y0 + i * ch(), CS, ch());
        lab(ctx, X0 + 6 * CS - 0.01, Y0 + 6 * ch() + 0.02, "above the diagonal: mixed as PAINT", { fs: 0.09, align: "right" });
        lab(ctx, X0, Y0 + 6 * ch() + 0.045, "below the diagonal: a plain digital average", { fs: 0.09 });
        notes(ctx, 0.83, ["Level 1: the grid and the six pure paints down the diagonal. Level 2: each pair mixed half and half, as paint.",
                          "Level 3: the same pairs as a plain average of their numbers — what a blend gives without a paint model.",
                          "Compare each square with its mirror across the diagonal. Blue and yellow: green as paint, a dull olive as an average.",
                          "Black darkens fast and dirties a colour; brown or blue darkens more gently. Compare the black row with the brown row.",
                          "White lightens and also weakens a colour: red and white make pink, not a lighter red."]);
      }],
      ["mixed as paint", ctx => { for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) cell(ctx, i, j, pig(PAL[i][1], PAL[j][1])); }],
      ["plain average", ctx => { for (let i = 0; i < 6; i++) for (let j = 0; j < i; j++) cell(ctx, i, j, avg(PAL[i][1], PAL[j][1])); }],
    ], { color: true });
  }

  /* ============================================================
     3 · Strings
     ============================================================ */
  {
    const ROWS = [["TINT — red into white", "#c8282e", "#ffffff"], ["SHADE — blue into black", "#23409a", "#1a1a1a"],
                  ["TONE — yellow into grey", "#f2c230", "#8a8a8a"], ["COMPLEMENTS — red into green", "#c8282e", "#2e8b57"],
                  ["COMPLEMENTS — blue into orange", "#23409a", "#e8781e"], ["COMPLEMENTS — violet into yellow", "#6a3d9a", "#f2c230"]];
    const BX = 0.1, BW = 0.085, GAP = 0.0135, RY = i => 0.145 + i * 0.112;
    const bh = () => BW * K.page().w / K.page().h;
    const step = (a, b, k) => pig(a, b, k / 6);
    const greyest = (a, b) => { let best = 1, c = 1e9; for (let k = 1; k <= 5; k++) { const v = chroma(step(a, b, k)); if (v < c) { c = v; best = k; } } return best; };
    reg("mixStrings", [
      ["the ends", ctx => {
        K.title(ctx, "Strings: walking from one colour to another in seven steps");
        ROWS.forEach(([name, a, b], i) => {
          lab(ctx, BX, RY(i) - 0.016, name, { fs: 0.095, bold: true });
          for (let k = 0; k < 7; k++) frame(ctx, BX + k * (BW + GAP), RY(i), BW, bh());
          box(ctx, BX, RY(i), BW, bh(), a); box(ctx, BX + 6 * (BW + GAP), RY(i), BW, bh(), b);
          frame(ctx, BX, RY(i), BW, bh()); frame(ctx, BX + 6 * (BW + GAP), RY(i), BW, bh());
        });
        notes(ctx, 0.835, ["Level 1: the two ends of each string. Level 2: five even steps between, mixed as paint. Level 3: the greyest step",
                           "between each pair of complements. With the ink pen at full opacity in Pigment mode, one pass of a colour over",
                           "another mixes them half and half; at 33% opacity, one part in six. Complements cross through grey on the way,",
                           "never through a brighter colour, and those greys keep a lean. Tint, shade and tone are the three ways to calm",
                           "a colour: add white, add black, or add grey. Each one changes it differently."]);
      }],
      ["five steps between", ctx => ROWS.forEach(([, a, b], i) => {
        for (let k = 1; k <= 5; k++) { box(ctx, BX + k * (BW + GAP), RY(i), BW, bh(), step(a, b, k)); frame(ctx, BX + k * (BW + GAP), RY(i), BW, bh()); }
      })],
      ["the grey between", ctx => ROWS.slice(3).forEach(([, a, b], r) => {
        const i = r + 3, k = greyest(a, b), cx = BX + k * (BW + GAP) + BW / 2, cy = RY(i) + bh() / 2;
        K.style(ctx, { lw: Math.max(2, K.S(0.014)) }); K.ellipse(ctx, cx, cy, BW * 0.68, BW * 0.68 * 0.86); K.style(ctx);
        lab(ctx, BX + 7 * (BW + GAP) - GAP + 0.008, cy, "greyest step", { fs: 0.085 });
      })],
    ], { color: true });
  }

  /* ============================================================
     4 · Edges: hard, soft, lost, broken
     ============================================================ */
  {
    const A = "#e8a25a", B = "#35507a", SX = 0.07, SW = 0.86, SH = 0.055, SY = i => 0.13 + i * 0.095;
    const KINDS = [["HARD", "the colours just meet"], ["SOFT", "blended over a short distance"],
                   ["LOST", "blended so far that the edge disappears"], ["BROKEN", "one colour dragged into the other in streaks"]];
    /* a strip's columns, mixed as paint between A and B over a band `spread` wide */
    const gradient = (ctx, y, spread) => {
      const x0 = X(SX), w = X(SW), mid = x0 + w / 2, half = X(spread) / 2, lut = [];
      for (let k = 0; k <= 32; k++) lut.push(pig(A, B, k / 32));
      for (let px = 0; px < w; px++) {
        const x = x0 + px, t = half <= 0 ? (x < mid ? 0 : 1) : Math.max(0, Math.min(1, (x - (mid - half)) / (2 * half)));
        ctx.fillStyle = lut[Math.round(t * 32)]; ctx.fillRect(x, Y(y), 1.02, Y(SH));
      }
    };
    const broken = (ctx, y) => {
      gradient(ctx, y, 0);
      const rnd = rng(7), x0 = X(SX), mid = x0 + X(SW) / 2, y0 = Y(y), h = Y(SH);
      for (let k = 0; k < 26; k++) {
        const fromA = k % 2 === 0, len = X(0.03 + rnd() * 0.12), yy = y0 + rnd() * h, th = Math.max(2, h * (0.05 + rnd() * 0.07));
        ctx.fillStyle = fromA ? A : B;
        ctx.globalAlpha = 0.75 + rnd() * 0.25;
        ctx.fillRect(fromA ? mid - X(0.01) : mid - len + X(0.01), yy, len, th);
      }
      ctx.globalAlpha = 1;
    };
    /* the ball: lit from the upper left, sitting on a lit floor, a dark wall behind */
    const BL = 0.07, BR = 0.53, BT = 0.52, BB = 0.82;           // the ball's picture; its labels sit to the right, on white
    const ball = () => ({ cx: X(0.29), cy: Y(0.665), r: X(0.11), floorY: Y(0.665) + X(0.11) });
    const LIT = "#e0a36a", SHADOW = "#4f3a36", WALL = "#3f3335", FLOOR = "#a89683", CAST = "#3a2d29";
    reg("blendEdges", [
      ["four strips", ctx => {
        K.title(ctx, "Edges: hard, soft, lost and broken");
        KINDS.forEach(([n, how], i) => { lab(ctx, SX, SY(i) - 0.016, n, { fs: 0.1, bold: true }); lab(ctx, SX + 0.09, SY(i) - 0.016, how, { fs: 0.09 }); frame(ctx, SX, SY(i), SW, SH); });
        frame(ctx, BL, BT, BR - BL, BB - BT);
        lab(ctx, 0.07, 0.505, "ALL FOUR ON ONE BALL", { bold: true });
        notes(ctx, 0.85, ["Level 1: four strips, each two colours meeting. Level 2: the four kinds of edge. Level 3: all four on one ball.",
                          "Edges are where the eye goes. Keep the hardest edge at the focal point; soften or lose the others.",
                          "Oil brush: Wetness 0 for a hard edge; high Wetness and short strokes back and forth for soft; longer strokes",
                          "for lost; a low Paint load dragged across the join for broken. Colour mixing on Pigment for all of them."]);
      }],
      ["the four edges", ctx => { gradient(ctx, SY(0), 0); gradient(ctx, SY(1), 0.07); gradient(ctx, SY(2), 0.5); broken(ctx, SY(3)); }],
      ["the ball", ctx => {
        const b = ball(), P = K.page();
        const left = X(BL), top = Y(BT), right = X(BR), bottom = Y(BB);
        ctx.fillStyle = WALL; ctx.fillRect(left, top, right - left, b.floorY - X(0.02) - top);
        ctx.fillStyle = FLOOR; ctx.fillRect(left, b.floorY - X(0.02), right - left, bottom - b.floorY + X(0.02));
        /* cast shadow: a hard core where the ball touches, softening outward */
        for (let k = 10; k >= 0; k--) {
          ctx.globalAlpha = k === 0 ? 1 : 0.11;
          ctx.fillStyle = CAST; ctx.beginPath();
          ctx.ellipse(b.cx + b.r * (0.55 + k * 0.04), b.floorY - X(0.012), b.r * (0.9 + k * 0.07), b.r * (0.16 + k * 0.012), 0, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
        /* the ball, shaded pixel by pixel: a soft turn from light to shadow */
        const lut = []; for (let k = 0; k <= 32; k++) lut.push(pig(SHADOW, LIT, k / 32));
        const L = [-0.62, -0.62, 0.48], ll = Math.hypot(...L); L.forEach((v, i) => L[i] = v / ll);
        for (let y = -b.r; y <= b.r; y++) for (let x = -b.r; x <= b.r; x++) {
          const d = x * x + y * y; if (d > b.r * b.r) continue;
          const nx = x / b.r, ny = y / b.r, nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
          const lam = nx * L[0] + ny * L[1] + nz * L[2], t = Math.max(0, Math.min(1, (lam + 0.12) / 0.5));
          ctx.fillStyle = lut[Math.round(t * 32)]; ctx.fillRect(b.cx + x, b.cy + y, 1, 1);
        }
        /* broken edge: the lit rim dragged out into the wall */
        const rnd = rng(11);
        for (let k = 0; k < 9; k++) {
          const a = -2.35 + (rnd() - 0.5) * 0.9, sx = b.cx + Math.cos(a) * b.r * 0.97, sy = b.cy + Math.sin(a) * b.r * 0.97;
          ctx.fillStyle = LIT; ctx.globalAlpha = 0.7 + rnd() * 0.3;
          ctx.fillRect(sx - X(0.025 + rnd() * 0.03), sy, X(0.025 + rnd() * 0.03), Math.max(2, X(0.003 + rnd() * 0.004)));
        }
        ctx.globalAlpha = 1; K.style(ctx);
        const f = (px, py) => [px / P.w, py / P.h];
        ctx.strokeStyle = "#1b2a3a"; ctx.lineWidth = Math.max(1.5, K.S(0.01)); ctx.strokeRect(left, top, right - left, bottom - top);
        pointer(ctx, ...f(b.cx - b.r * 0.95, b.cy - b.r * 0.72), 0.56, 0.55, "BROKEN — the lit rim dragged into the wall");
        pointer(ctx, ...f(b.cx + b.r * 0.25, b.cy + b.r * 0.05), 0.56, 0.62, "SOFT — the turn from light into shadow");
        pointer(ctx, ...f(b.cx + b.r * 0.92, b.cy + b.r * 0.2), 0.56, 0.69, "LOST — the shadow side melts into the wall");
        pointer(ctx, ...f(b.cx + b.r * 0.35, b.floorY - X(0.006)), 0.56, 0.78, "HARD — the cast shadow where the ball touches");
      }],
    ], { color: true });
  }

  /* ============================================================
     5 · Layers of paint: glaze, scumble, optical mixing, knocking back
     ============================================================ */
  {
    const PW = 0.4, PH = 0.24, POS = [[0.07, 0.13], [0.53, 0.13], [0.07, 0.48], [0.53, 0.48]];
    const NAMES = [["GLAZE", "a thin see-through layer: the colour changes, the stripes stay"],
                   ["SCUMBLE", "a light, broken, nearly dry layer over dark"],
                   ["OPTICAL MIXING", "dots too small to see apart mix in the eye"],
                   ["KNOCKING BACK", "a thin glaze of the complement greys a colour"]];
    const STRIPE = ["#f2d36b", "#b98a2e"], GLAZE = "#2f5fbf", DARK = "#2b3550", CREAM = "#e8dccb", RED = "#d0312d", YEL = "#f2c230", GRN = "#2e8b57";
    const at = (k, u, v) => [POS[k][0] + u * PW, POS[k][1] + v * PH];
    const KW = PW / 4 - 0.028;                                  // the knocking-back boxes
    const dots = (ctx, k, x1u) => {
      const [x0, y0] = at(k, 0, 0), s = Math.max(6, Math.round(X(0.01)));
      for (let py = Y(y0), r = 0; py < Y(y0 + PH) - 1; py += s, r++)
        for (let px = X(x0), c = 0; px < X(x0 + PW * x1u) - 1; px += s, c++) { ctx.fillStyle = (r + c) % 2 ? RED : YEL; ctx.fillRect(px, py, s, s); }
    };
    reg("glazeScumble", [
      ["the first layers", ctx => {
        K.title(ctx, "Layers of paint: glaze, scumble, optical mixing");
        NAMES.forEach(([n, how], k) => { const [x, y] = POS[k]; lab(ctx, x, y + PH + 0.02, n, { bold: true }); lab(ctx, x, y + PH + 0.042, how, { fs: 0.085 }); });
        /* glaze: stripes */
        for (let s = 0; s < 8; s++) { const [x, y] = at(0, s / 8, 0); box(ctx, x, y, PW / 8, PH, STRIPE[s % 2]); }
        box(ctx, ...at(1, 0, 0), PW, PH, DARK);
        dots(ctx, 2, 0.62);
        for (let s = 0; s < 4; s++) box(ctx, ...at(3, s / 4 + 0.01, 0.15), KW, PH * 0.7, RED);
        POS.forEach(([x, y]) => frame(ctx, x, y, PW, PH));
        notes(ctx, 0.85, ["Level 1: the first layer of each. Level 2: the layer on top. Level 3: what the eye makes of the dots from across a room.",
                          "Glaze: Pigment mode, ink pen at about 60% opacity — one pass mixes in about a third of the new colour.",
                          "Scumble: the oil brush with a low Paint load and a pale colour, kept moving so it breaks and the dark shows through.",
                          "Dots mix in the eye as LIGHT, so they look brighter than the same two colours mixed as paint (level 3, right)."]);
      }],
      ["the layer on top", ctx => {
        /* glaze over the right half of the stripes */
        for (let s = 4; s < 8; s++) { const [x, y] = at(0, s / 8, 0); box(ctx, x, y, PW / 8, PH, pig(STRIPE[s % 2], GLAZE, 0.3)); }
        /* scumble: broken cream strokes over most of the dark block */
        const rnd = rng(3), [x0, y0] = at(1, 0.22, 0.06);
        for (let k = 0; k < 240; k++) {
          ctx.globalAlpha = 0.55 + rnd() * 0.4; ctx.fillStyle = CREAM;
          ctx.fillRect(X(x0 + rnd() * PW * 0.6), Y(y0 + rnd() * PH * 0.86), X(0.012 + rnd() * 0.04), Math.max(2, Y(0.002 + rnd() * 0.004)));
        }
        ctx.globalAlpha = 1;
        /* knocking back: green glazed over the red in rising strengths */
        [0, 0.1, 0.2, 0.3].forEach((t, s) => box(ctx, ...at(3, s / 4 + 0.01, 0.15), KW, PH * 0.7, t ? pig(RED, GRN, t) : RED));
        [["none", 0], ["a little", 1], ["more", 2], ["most", 3]].forEach(([n, s]) => lab(ctx, ...at(3, s / 4 + 0.01, 0.92), n, { fs: 0.08 }));
        K.style(ctx); frame(ctx, POS[0][0], POS[0][1], PW, PH);   // the glaze runs to the panel's edge; redraw just that frame
      }],
      ["seen from across the room", ctx => {
        const far = lightAvg(RED, YEL), paint = pig(RED, YEL);
        box(ctx, ...at(2, 0.68, 0.08), PW * 0.28, PH * 0.38, far); frame(ctx, ...at(2, 0.68, 0.08), PW * 0.28, PH * 0.38);
        box(ctx, ...at(2, 0.68, 0.54), PW * 0.28, PH * 0.38, paint); frame(ctx, ...at(2, 0.68, 0.54), PW * 0.28, PH * 0.38);
        lab(ctx, ...at(2, 0.68, 0.5), "from far away", { fs: 0.08 });
        lab(ctx, ...at(2, 0.68, 0.96), "mixed as paint", { fs: 0.08 });
      }],
    ], { color: true });
  }
})();
