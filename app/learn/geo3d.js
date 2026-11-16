/* ============================================================
   learn/geo3d.js — a tiny 3-D construction-drawing kit
   The Learn guides are construction drawings: boxes, cylinders,
   balls and planes seen from a chosen camera. Drawing those by
   hand-placed 2-D coordinates gets every angle subtly wrong, so
   this kit builds them from real 3-D solids and projects them.

   World space: x right, y up, z toward the viewer. A camera
   orbits its target: yaw > 0 swings it to the right, pitch > 0
   lifts it to look down.

   Rendering is a painter's algorithm with ERASING instead of
   white fill: nearer solids punch a hole in whatever is behind
   them, so the result stays transparent line art (which is what
   a tinted Guide layer needs). Semi-transparent "tone" fills
   survive the tint as lighter and darker blue.
   Nothing here is an image generator — it draws geometry.
   ============================================================ */
"use strict";

const G3 = (() => {
  /* ---------- vectors ---------- */
  const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const mul = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const len = a => Math.hypot(a[0], a[1], a[2]);
  const norm = a => { const l = len(a) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
  const lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  const mid = (a, b) => lerp(a, b, 0.5);

  /* ---------- 3×3 matrices, stored as three COLUMN vectors ---------- */
  const I = () => [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
  const ap = (M, v) => [
    M[0][0] * v[0] + M[1][0] * v[1] + M[2][0] * v[2],
    M[0][1] * v[0] + M[1][1] * v[1] + M[2][1] * v[2],
    M[0][2] * v[0] + M[1][2] * v[1] + M[2][2] * v[2]];
  const mm = (A, B) => [ap(A, B[0]), ap(A, B[1]), ap(A, B[2])];
  const rad = d => d * Math.PI / 180;
  const rx = d => { const c = Math.cos(rad(d)), s = Math.sin(rad(d)); return [[1, 0, 0], [0, c, s], [0, -s, c]]; };
  const ry = d => { const c = Math.cos(rad(d)), s = Math.sin(rad(d)); return [[c, 0, -s], [0, 1, 0], [s, 0, c]]; };
  const rz = d => { const c = Math.cos(rad(d)), s = Math.sin(rad(d)); return [[c, s, 0], [-s, c, 0], [0, 0, 1]]; };
  /* turn (about y), then tip (about x), then roll (about z) — degrees */
  const euler = (yaw = 0, pitch = 0, roll = 0) => mm(ry(yaw), mm(rx(pitch), rz(roll)));
  const tr = M => [[M[0][0], M[1][0], M[2][0]], [M[0][1], M[1][1], M[2][1]], [M[0][2], M[1][2], M[2][2]]];
  function inv(M) {
    const [a, b, c] = M;                       // columns
    const r0 = cross(b, c), r1 = cross(c, a), r2 = cross(a, b);
    const det = dot(a, r0) || 1e-9;
    // rows of the inverse are r0,r1,r2 / det  ->  as columns:
    return tr([mul(r0, 1 / det), mul(r1, 1 / det), mul(r2, 1 / det)]);
  }
  const scaleM = r => [[r[0], 0, 0], [0, r[1], 0], [0, 0, r[2]]];
  /* a frame whose Y axis runs along `yAxis` (for bones and cylinders) */
  function frame(yAxis, xHint = [1, 0, 0]) {
    const y = norm(yAxis);
    let z = cross(xHint, y);
    if (len(z) < 1e-5) z = cross([0, 0, 1], y);
    z = norm(z);
    return [cross(y, z), y, z];
  }

  /* ---------- camera ---------- */
  function camera(o = {}) {
    const c = { yaw: 0, pitch: 0, dist: 16, scale: 100, cx: 0, cy: 0, target: [0, 0, 0], ...o };
    c.R = mm(rx(c.pitch), ry(-c.yaw));
    c.persp = isFinite(c.dist);
    return c;
  }
  const toView = (c, p) => ap(c.R, sub(p, c.target));
  function toScreen(c, v) {
    const f = c.persp ? c.dist / Math.max(0.05, c.dist - v[2]) : 1;
    return [c.cx + v[0] * f * c.scale, c.cy - v[1] * f * c.scale];
  }
  const project = (c, p) => toScreen(c, toView(c, p));
  const toCam = (c, v) => c.persp ? [-v[0], -v[1], c.dist - v[2]] : [0, 0, 1];

  /* ============================================================
     Solids — plain descriptors; nothing is drawn until render()
     ============================================================ */
  /* faces wind counter-clockwise seen from OUTSIDE */
  const BOX_F = [[0, 1, 2, 3], [5, 4, 7, 6], [4, 0, 3, 7], [1, 5, 6, 2], [3, 2, 6, 7], [4, 5, 1, 0]];
  /* a box whose top (y+) and bottom (y−) can differ in width/depth */
  function tbox(center, s, R = I(), o = {}) {
    const { w0, w1 = w0, h, d0, d1 = d0 } = s;
    const L = [[-w0 / 2, -h / 2, d0 / 2], [w0 / 2, -h / 2, d0 / 2], [w1 / 2, h / 2, d1 / 2], [-w1 / 2, h / 2, d1 / 2],
               [-w0 / 2, -h / 2, -d0 / 2], [w0 / 2, -h / 2, -d0 / 2], [w1 / 2, h / 2, -d1 / 2], [-w1 / 2, h / 2, -d1 / 2]];
    return { type: "mesh", verts: L.map(p => add(center, ap(R, p))),
             faces: BOX_F.map((v, i) => ({ v, sg: 100 + i })), R, center, ...o };
  }
  const box = (center, size, R = I(), o = {}) =>
    tbox(center, { w0: size[0], h: size[1], d0: size[2] }, R, o);
  /* extrude a 2-D profile (local x,y; counter-clockwise) along local z */
  function prism(center, profile, depth, R = I(), o = {}) {
    const n = profile.length, verts = [], faces = [];
    for (const zz of [depth / 2, -depth / 2])
      for (const [x, y] of profile) verts.push(add(center, ap(R, [x, y, zz])));
    faces.push({ v: profile.map((_, i) => i), sg: 1 });                       // front cap
    faces.push({ v: profile.map((_, i) => n + (n - 1 - i)), sg: 2 });         // back cap
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      faces.push({ v: [i, n + i, n + j, j], sg: o.smoothSides ? 3 : 10 + i });
    }
    return { type: "mesh", verts, faces, R, center, ...o };
  }
  const mesh = (verts, faces, o = {}) =>
    ({ type: "mesh", verts, faces: faces.map((f, i) => Array.isArray(f) ? { v: f, sg: 100 + i } : f), ...o });
  /* a (tapered) cylinder between two points */
  const cyl = (a, b, ra, rb = ra, o = {}) => ({ type: "cyl", a, b, ra, rb, ...o });
  const ell = (center, r, R = I(), o = {}) => ({ type: "ell", c: center, r, R, ...o });
  const ball = (center, r, o = {}) => ell(center, [r, r, r], I(), o);
  const seg = (a, b, o = {}) => ({ type: "path", pts: [a, b], ...o });
  const path = (pts, o = {}) => ({ type: "path", pts, ...o });
  const pt = (p, o = {}) => ({ type: "dot", p, ...o });
  const text = (p, str, o = {}) => ({ type: "text", p, str, ...o });

  /* ---------- helpers ---------- */
  function hull(points) {                       // monotone chain, screen space
    const p = points.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (p.length < 3) return p;
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (let i = p.length - 1; i >= 0; i--) {
      const q = p[i];
      while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop();
      up.push(q);
    }
    lo.pop(); up.pop();
    return lo.concat(up);
  }
  const trace = (ctx, pts, close = true) => {
    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    if (close) ctx.closePath();
  };
  function ringOf(c, cam, center, r, U, W, n = 40) {
    const world = [], nrm = [];
    for (let i = 0; i < n; i++) {
      const t = (i / n) * Math.PI * 2;
      const dir = add(mul(U, Math.cos(t)), mul(W, Math.sin(t)));
      world.push(add(center, mul(dir, r))); nrm.push(dir);
    }
    const view = world.map(p => toView(cam, p));
    return { view, scr: view.map(v => toScreen(cam, v)), nrm: nrm.map(d => ap(cam.R, d)) };
  }
  /* stroke a closed ring: the part facing the camera solid, the rest dashed */
  function strokeRing(ctx, cam, ring, st, showBack) {
    const n = ring.scr.length;
    const vis = ring.view.map((v, i) => dot(ring.nrm[i], toCam(cam, v)) > 0);
    for (const want of [true, false]) {
      if (!want && !showBack) continue;
      ctx.save();
      if (!want) { ctx.globalAlpha *= 0.4; ctx.setLineDash(st.dashPat); }
      ctx.beginPath();
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        if (vis[i] === want || vis[j] === want) {
          if (vis[i] !== want && vis[j] !== want) continue;
          ctx.moveTo(ring.scr[i][0], ring.scr[i][1]); ctx.lineTo(ring.scr[j][0], ring.scr[j][1]);
        }
      }
      ctx.stroke();
      ctx.restore();
    }
  }

  /* ============================================================
     Preparing a solid: project it and work out its outline region
     ============================================================ */
  function prep(cam, it) {
    if (it.type === "mesh") {
      const view = it.verts.map(p => toView(cam, p));
      const scr = view.map(v => toScreen(cam, v));
      const faces = it.faces.map(f => {
        const p = f.v.map(i => view[i]);
        let n = [0, 0, 0];                      // Newell normal: safe for any polygon
        for (let i = 0; i < p.length; i++) {
          const a = p[i], b = p[(i + 1) % p.length];
          n[0] += (a[1] - b[1]) * (a[2] + b[2]); n[1] += (a[2] - b[2]) * (a[0] + b[0]); n[2] += (a[0] - b[0]) * (a[1] + b[1]);
        }
        n = norm(n);
        const c = mul(p.reduce(add, [0, 0, 0]), 1 / p.length);
        return { ...f, n, c, front: f.two ? true : dot(n, toCam(cam, c)) > 0, pts: f.v.map(i => scr[i]) };
      });
      const edges = new Map();
      faces.forEach((f, fi) => f.v.forEach((a, k) => {
        const b = f.v[(k + 1) % f.v.length], key = a < b ? a + "_" + b : b + "_" + a;
        if (!edges.has(key)) edges.set(key, { a, b, f: [] });
        edges.get(key).f.push(fi);
      }));
      const z = view.reduce((s, v) => s + v[2], 0) / view.length;
      return { it, view, scr, faces, edges: [...edges.values()], z, regions: faces.filter(f => f.front).map(f => f.pts) };
    }
    if (it.type === "cyl") {
      const axis = norm(sub(it.b, it.a)), [U, , W] = frame(axis);
      const A = ringOf(null, cam, it.a, it.ra, U, W), B = ringOf(null, cam, it.b, it.rb, U, W);
      const av = toView(cam, it.a), bv = toView(cam, it.b), axv = ap(cam.R, axis);
      return { it, A, B, U, W, axis,
               capA: dot(mul(axv, -1), toCam(cam, av)) > 0, capB: dot(axv, toCam(cam, bv)) > 0,
               z: (av[2] + bv[2]) / 2, regions: [hull(A.scr.concat(B.scr))] };
    }
    if (it.type === "ell") {
      const Bm = mm(cam.R, mm(it.R, scaleM(it.r)));       // unit sphere -> view space
      const cv = toView(cam, it.c);
      const d = norm(toCam(cam, cv));
      const Bi = inv(Bm), BiT = tr(Bi);
      const w = norm(ap(Bi, d));                          // silhouette great circle ⟂ w
      const [e1, , e2] = frame(w);
      const sil = [];
      for (let i = 0; i < 56; i++) {
        const t = (i / 56) * Math.PI * 2;
        const u = add(mul(e1, Math.cos(t)), mul(e2, Math.sin(t)));
        sil.push(toScreen(cam, add(cv, ap(Bm, u))));
      }
      return { it, Bm, BiT, cv, z: cv[2], regions: [sil] };
    }
    if (it.type === "path") {
      const view = it.pts.map(p => toView(cam, p));
      return { it, view, scr: view.map(v => toScreen(cam, v)), z: view.reduce((s, v) => s + v[2], 0) / view.length, regions: [] };
    }
    const v = toView(cam, it.p);
    return { it, scr: toScreen(cam, v), z: v[2], regions: [] };
  }

  /* ============================================================
     render(ctx, cam, items, opts)
       opts.lw      base line width in px          (default 2)
       opts.color   stroke/fill color              (default dark slate)
       opts.light   world-space direction TO the light (for tone)
       opts.font    px size for text items
     Per-item options:
       hide:false   wireframe — do not erase what is behind
       through      draw hidden edges dashed and faint ("draw through")
       tone         0..1  shade faces by the light
       fill         0..1  flat fill alpha
       lw           line-width multiplier,  dash: true,  alpha
       rings        cyl: [t…] cross-contours;  ell: ["xy","xz","yz"]
       decals       mesh: [{face, lines:[[p,p]…]}] lines printed on a face
       top          draw after everything else (annotations)
     ============================================================ */
  function render(ctx, cam, items, opts = {}) {
    const o = { lw: 2, color: "#1b2a3a", light: [-0.45, 0.75, 0.55], font: 14, ...opts };
    const L = norm(ap(cam.R, norm(o.light)));
    const prepped = items.filter(Boolean).map(it => prep(cam, it));
    prepped.sort((a, b) => (a.it.under ? -1 : a.it.top ? 1 : 0) - (b.it.under ? -1 : b.it.top ? 1 : 0) || a.z - b.z);
    /* work in a buffer no bigger than the drawing: a page of twelve small
       figures would otherwise allocate twelve page-sized canvases */
    const box = bounds(prepped, o.lw * 8 + 6, ctx.canvas);
    if (!box) return;
    const tmp = document.createElement("canvas");
    tmp.width = box.w; tmp.height = box.h;
    const t = tmp.getContext("2d");
    t.translate(-box.x, -box.y);
    t.lineJoin = "round"; t.lineCap = "round";
    const toneAlpha = (n, k) => k * (0.06 + 0.62 * (1 - Math.max(0, dot(n, L))));

    for (const p of prepped) {
      const it = p.it;
      const st = { dashPat: [o.lw * 3.2, o.lw * 2.6] };
      t.save();
      t.strokeStyle = t.fillStyle = it.color || o.color;
      t.lineWidth = o.lw * (it.lw || 1);
      t.globalAlpha = it.alpha ?? 1;
      if (it.dash) t.setLineDash(st.dashPat);

      if (p.regions.length && it.hide !== false) {          // punch the hole
        t.save(); t.globalCompositeOperation = "destination-out"; t.globalAlpha = 1;
        for (const r of p.regions) { trace(t, r); t.fill(); }
        t.restore();
      }

      if (it.type === "mesh" && it.sortFaces) {
        /* a NON-convex mesh (a head): paint its own faces far-to-near, each
           one erasing what it covers, so the nose hides the far cheek */
        const order = p.faces.filter(f => f.front).sort((a, b) => a.c[2] - b.c[2]);
        for (const f of order) {
          t.save(); t.globalCompositeOperation = "destination-out"; t.globalAlpha = 1;
          trace(t, f.pts); t.fill(); t.restore();
          if (it.fill || it.tone) {
            t.save();
            t.globalAlpha = Math.min(1, (it.fill || 0) + (it.tone ? toneAlpha(f.n, it.tone) : 0));
            trace(t, f.pts); t.fill(); t.restore();
          }
          if (!it.noStroke) { trace(t, f.pts); t.stroke(); }
        }
      } else if (it.type === "mesh") {
        if (it.fill || it.tone) for (const f of p.faces) {
          if (!f.front) continue;
          t.save();
          t.globalAlpha = (it.fill || 0) + (it.tone ? toneAlpha(f.n, it.tone) : 0);
          trace(t, f.pts); t.fill(); t.restore();
        }
        if (!it.noStroke) for (const pass of ["back", "front"]) {
          if (pass === "back" && !it.through) continue;
          t.save();
          if (pass === "back") { t.globalAlpha *= 0.4; t.setLineDash(st.dashPat); }
          t.beginPath();
          for (const e of p.edges) {
            const fr = e.f.filter(i => p.faces[i].front).length;
            const crease = e.f.length < 2 || p.faces[e.f[0]].sg !== p.faces[e.f[1]].sg;
            const visible = crease ? fr > 0 : (fr === 1 && e.f.length === 2);
            if ((pass === "front") !== visible) continue;
            if (pass === "back" && !crease) continue;
            t.moveTo(p.scr[e.a][0], p.scr[e.a][1]); t.lineTo(p.scr[e.b][0], p.scr[e.b][1]);
          }
          t.stroke(); t.restore();
        }
        for (const d of it.decals || []) {
          if (!p.faces[d.face] || !p.faces[d.face].front) continue;
          t.save();
          t.lineWidth = o.lw * (d.lw || 0.7);
          if (d.dash) t.setLineDash(st.dashPat);
          t.beginPath();
          for (const ln of d.lines) {
            const s = ln.map(q => project(cam, q));
            t.moveTo(s[0][0], s[0][1]);
            for (let i = 1; i < s.length; i++) t.lineTo(s[i][0], s[i][1]);
          }
          t.stroke(); t.restore();
        }
      } else if (it.type === "cyl") {
        if (it.fill || it.tone) {
          const n = p.A.scr.length;
          for (let i = 0; i < n; i++) {
            const j = (i + 1) % n;
            if (dot(p.A.nrm[i], toCam(cam, p.A.view[i])) <= 0) continue;
            t.save();
            t.globalAlpha = (it.fill || 0) + (it.tone ? toneAlpha(p.A.nrm[i], it.tone) : 0);
            trace(t, [p.A.scr[i], p.A.scr[j], p.B.scr[j], p.B.scr[i]]); t.fill(); t.restore();
          }
        }
        if (!it.noStroke) {
          if (!it.ringsOnly) { trace(t, p.regions[0]); t.stroke(); }
          if (it.ringsOnly) { /* cross-contours only */ }
          else if (it.ra > 0.001) {
            if (p.capA) { trace(t, p.A.scr); t.stroke(); }
            else if (it.through) strokeRing(t, cam, p.A, st, true);
          }
          if (!it.ringsOnly && it.rb > 0.001) {
            if (p.capB) { trace(t, p.B.scr); t.stroke(); }
            else if (it.through) strokeRing(t, cam, p.B, st, true);
          }
          t.save(); t.lineWidth *= 0.6;
          for (const f of it.rings || []) {
            const ring = ringOf(null, cam, lerp(it.a, it.b, f), it.ra + (it.rb - it.ra) * f, p.U, p.W);
            strokeRing(t, cam, ring, st, it.through);
          }
          t.restore();
        }
      } else if (it.type === "ell") {
        if (it.fill || it.tone) {
          t.save(); t.globalAlpha = (it.fill || 0) + (it.tone ? it.tone * 0.22 : 0);
          trace(t, p.regions[0]); t.fill(); t.restore();
        }
        if (!it.noStroke) {
          trace(t, p.regions[0]); t.stroke();
          t.save(); t.lineWidth *= 0.6;
          for (const plane of it.rings || []) {
            const view = [], scr = [], nrm = [];
            for (let i = 0; i < 48; i++) {
              const a = (i / 48) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
              const u = Array.isArray(plane)
                ? add(mul(plane[0], c), mul(plane[1], s))
                : plane === "xy" ? [c, s, 0] : plane === "xz" ? [c, 0, s] : [0, c, s];
              const v = add(p.cv, ap(p.Bm, u));
              view.push(v); scr.push(toScreen(cam, v)); nrm.push(ap(p.BiT, u));
            }
            strokeRing(t, cam, { view, scr, nrm }, st, it.through);
          }
          t.restore();
        }
      } else if (it.type === "path") {
        if (it.facing) {                       // a line ON a rounded form: hide its far side
          const c = toView(cam, it.facing), n = p.scr.length;
          t.beginPath();
          for (let i = 0; i < n - (it.close ? 0 : 1); i++) {
            const j = (i + 1) % n;
            if (dot(sub(p.view[i], c), toCam(cam, p.view[i])) <= 0 || dot(sub(p.view[j], c), toCam(cam, p.view[j])) <= 0) continue;
            t.moveTo(p.scr[i][0], p.scr[i][1]); t.lineTo(p.scr[j][0], p.scr[j][1]);
          }
          t.stroke();
        } else {
          trace(t, p.scr, !!it.close);
          if (it.fill) { t.save(); t.globalAlpha = it.fill; t.fill(); t.restore(); }
          if (!it.noStroke) t.stroke();
        }
      } else if (it.type === "dot") {
        t.beginPath(); t.arc(p.scr[0], p.scr[1], (it.r || 2.2) * o.lw, 0, Math.PI * 2);
        if (it.open) { t.stroke(); } else t.fill();
      } else if (it.type === "text") {
        t.font = `${it.bold ? "600 " : ""}${(it.size || 1) * o.font}px "Segoe UI", system-ui, sans-serif`;
        t.textBaseline = "middle"; t.textAlign = it.align || "left";
        t.fillText(it.str, p.scr[0] + (it.dx || 0) * o.font, p.scr[1] + (it.dy || 0) * o.font);
      }
      t.restore();
    }
    ctx.drawImage(tmp, box.x, box.y);
  }

  /* screen-space bounding box of everything prepped, clamped to the canvas */
  function bounds(prepped, pad, canvas) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, text = false;
    const eat = q => { if (q[0] < x0) x0 = q[0]; if (q[1] < y0) y0 = q[1]; if (q[0] > x1) x1 = q[0]; if (q[1] > y1) y1 = q[1]; };
    for (const p of prepped) {
      if (p.it.type === "text") { text = true; continue; }
      for (const r of p.regions) r.forEach(eat);
      if (p.it.type === "mesh" || p.it.type === "path") p.scr.forEach(eat);
      else if (p.it.type === "dot") eat(p.scr);
      else if (p.it.type === "cyl") { p.A.scr.forEach(eat); p.B.scr.forEach(eat); }
    }
    if (text) return { x: 0, y: 0, w: canvas.width, h: canvas.height };   // labels can run anywhere
    if (x1 < x0) return null;
    const x = Math.max(0, Math.floor(x0 - pad)), y = Math.max(0, Math.floor(y0 - pad));
    const w = Math.min(canvas.width, Math.ceil(x1 + pad)) - x, h = Math.min(canvas.height, Math.ceil(y1 + pad)) - y;
    return w > 0 && h > 0 ? { x, y, w, h } : null;
  }

  /* where lines running along world direction `dir` appear to meet */
  function vanish(cam, dir) {
    const v = ap(cam.R, norm(dir));
    if (!cam.persp || Math.abs(v[2]) < 1e-6) return null;      // parallel to the picture plane
    const k = -cam.dist / v[2];                                 // limit of the projection
    return [cam.cx + v[0] * k * cam.scale, cam.cy - v[1] * k * cam.scale];
  }

  /* ============================================================
     outline(ctx, cam, items, {lw, grow})
     The contour of the WHOLE assembly as one line: every solid is
     filled into a mask (optionally fattened by `grow` px — flesh
     over a mannequin), and the mask's outer rim is what gets drawn.
     ============================================================ */
  function outline(ctx, cam, items, opts = {}) {
    const o = { lw: 3, grow: 0, color: "#1b2a3a", ...opts };
    const W = ctx.canvas.width, H = ctx.canvas.height;
    const A = document.createElement("canvas"); A.width = W; A.height = H;
    const a = A.getContext("2d");
    a.fillStyle = a.strokeStyle = o.color; a.lineJoin = "round"; a.lineWidth = o.grow * 2;
    for (const it of items.filter(Boolean)) {
      if (!["mesh", "cyl", "ell"].includes(it.type) || it.noOutline) continue;
      for (const r of prep(cam, it).regions) { trace(a, r); a.fill(); if (o.grow) a.stroke(); }
    }
    if (o.fill) {                               // the silhouette itself, as a flat shape
      ctx.save(); ctx.globalAlpha = o.fill; ctx.drawImage(A, 0, 0); ctx.restore();
      if (o.fillOnly) return;
    }
    const B = document.createElement("canvas"); B.width = W; B.height = H;
    const b = B.getContext("2d");
    for (let i = 0; i < 16; i++) {
      const t = (i / 16) * Math.PI * 2;
      b.drawImage(A, Math.cos(t) * o.lw, Math.sin(t) * o.lw);
    }
    b.globalCompositeOperation = "destination-out";
    b.drawImage(A, 0, 0);
    ctx.drawImage(B, 0, 0);
  }

  return { add, sub, mul, dot, cross, len, norm, lerp, mid, I, ap, mm, rx, ry, rz, euler, tr, inv, frame,
           camera, toView, toScreen, project,
           box, tbox, prism, mesh, cyl, ell, ball, seg, path, pt, text,
           render, outline, hull, vanish };
})();
