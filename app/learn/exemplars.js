/* ============================================================
   learn/exemplars.js — guide drawings painted onto a lesson page
   Each exemplar is a function(ctx, P) drawing in PAGE pixel space
   using page-fraction helpers. Lessons paint them onto a locked
   "Guide" layer, so they stay on the page permanently (and save
   with the attempt). Most are line diagrams tinted blue by the
   layer; exemplars flagged `color: true` draw real colors and get
   an untinted guide layer.
   ============================================================ */
"use strict";

const Exemplars = (() => {
  let P = null;                       // current page {w,h,dpi}
  const X = f => P.w * f, Y = f => P.h * f;
  const S = f => P.dpi * f;           // size in inches -> px

  function style(ctx, o = {}) {
    ctx.strokeStyle = o.stroke || "#1b2a3a";
    ctx.fillStyle = o.fill || "#1b2a3a";
    ctx.lineWidth = o.lw || Math.max(2, S(0.014));
    ctx.setLineDash(o.dash ? [S(0.05), S(0.04)] : []);
    ctx.font = `${o.bold ? "600 " : ""}${S(o.fs || 0.13)}px "Segoe UI", system-ui, sans-serif`;
    ctx.textAlign = o.align || "left";
    ctx.textBaseline = "middle";
  }
  const line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath(); ctx.moveTo(X(x1), Y(y1)); ctx.lineTo(X(x2), Y(y2)); ctx.stroke();
  };
  const poly = (ctx, pts, close = true) => {
    ctx.beginPath(); ctx.moveTo(X(pts[0][0]), Y(pts[0][1]));
    for (const [x, y] of pts.slice(1)) ctx.lineTo(X(x), Y(y));
    if (close) ctx.closePath();
    ctx.stroke();
  };
  const ellipse = (ctx, cx, cy, rx, ry, rot = 0) => {
    ctx.beginPath(); ctx.ellipse(X(cx), Y(cy), X(rx), X(ry), rot, 0, Math.PI * 2); ctx.stroke();
  };
  const arc = (ctx, cx, cy, rx, ry, a0, a1, rot = 0) => {
    ctx.beginPath(); ctx.ellipse(X(cx), Y(cy), X(rx), X(ry), rot, a0, a1); ctx.stroke();
  };
  const circle = (ctx, cx, cy, r) => ellipse(ctx, cx, cy, r, r);
  const rect = (ctx, x, y, w, h) => ctx.strokeRect(X(x), Y(y), X(w), X(h));
  const dot = (ctx, x, y, r = 0.02) => {
    ctx.beginPath(); ctx.arc(X(x), Y(y), S(r), 0, Math.PI * 2); ctx.fill();
  };
  const label = (ctx, x, y, t, o = {}) => { style(ctx, o); ctx.fillText(t, X(x), Y(y)); style(ctx); };
  const curve = (ctx, x1, y1, cx, cy, x2, y2) => {
    ctx.beginPath(); ctx.moveTo(X(x1), Y(y1));
    ctx.quadraticCurveTo(X(cx), Y(cy), X(x2), Y(y2)); ctx.stroke();
  };
  const arrow = (ctx, x1, y1, x2, y2) => {
    line(ctx, x1, y1, x2, y2);
    const a = Math.atan2(Y(y2) - Y(y1), X(x2) - X(x1)), h = S(0.09);
    ctx.beginPath();
    ctx.moveTo(X(x2), Y(y2));
    ctx.lineTo(X(x2) - h * Math.cos(a - 0.4), Y(y2) - h * Math.sin(a - 0.4));
    ctx.moveTo(X(x2), Y(y2));
    ctx.lineTo(X(x2) - h * Math.cos(a + 0.4), Y(y2) - h * Math.sin(a + 0.4));
    ctx.stroke();
  };
  const title = (ctx, t) => label(ctx, 0.08, 0.06, t, { fs: 0.2, bold: true });
  const note = (ctx, y, t) => label(ctx, 0.08, y, t, { fs: 0.12 });
  /* a Y-method cube at (cx,cy) with half-size s */
  function cube(ctx, cx, cy, s) {
    line(ctx, cx, cy, cx, cy + s * 1.3);
    line(ctx, cx, cy, cx - s, cy - s * 0.6);
    line(ctx, cx, cy, cx + s, cy - s * 0.6);
    line(ctx, cx - s, cy - s * 0.6, cx - s, cy + s * 0.7);
    line(ctx, cx + s, cy - s * 0.6, cx + s, cy + s * 0.7);
    line(ctx, cx - s, cy + s * 0.7, cx, cy + s * 1.3);
    line(ctx, cx + s, cy + s * 0.7, cx, cy + s * 1.3);
    line(ctx, cx - s, cy - s * 0.6, cx, cy - s * 1.2);
    line(ctx, cx + s, cy - s * 0.6, cx, cy - s * 1.2);
  }
  function cylinder(ctx, cx, cy, rx, h, ry) {
    ellipse(ctx, cx, cy, rx, ry);
    line(ctx, cx - rx, cy, cx - rx, cy + h); line(ctx, cx + rx, cy, cx + rx, cy + h);
    arc(ctx, cx, cy + h, rx, ry, 0, Math.PI);
    style(ctx, { dash: true }); arc(ctx, cx, cy + h, rx, ry, Math.PI, Math.PI * 2); style(ctx);
  }
  function mannequin(ctx, mx, top, unit) {
    ellipse(ctx, mx, top + unit * 0.5, 0.033, unit * 0.5);
    ellipse(ctx, mx, top + unit * 1.75, 0.075, unit * 0.85);
    ellipse(ctx, mx, top + unit * 3.15, 0.065, unit * 0.55);
    line(ctx, mx, top + unit, mx, top + unit * 2.6);
    line(ctx, mx - 0.07, top + unit * 1.25, mx - 0.095, top + unit * 2.5);
    line(ctx, mx - 0.095, top + unit * 2.5, mx - 0.10, top + unit * 3.6);
    line(ctx, mx + 0.07, top + unit * 1.25, mx + 0.095, top + unit * 2.5);
    line(ctx, mx + 0.095, top + unit * 2.5, mx + 0.10, top + unit * 3.6);
    line(ctx, mx - 0.03, top + unit * 3.6, mx - 0.045, top + unit * 5.5);
    line(ctx, mx - 0.045, top + unit * 5.5, mx - 0.04, top + unit * 7.3);
    line(ctx, mx + 0.03, top + unit * 3.6, mx + 0.045, top + unit * 5.5);
    line(ctx, mx + 0.045, top + unit * 5.5, mx + 0.04, top + unit * 7.3);
    for (const [x, y] of [[mx - 0.095, 2.5], [mx + 0.095, 2.5], [mx - 0.045, 5.5], [mx + 0.045, 5.5]])
      dot(ctx, x, top + unit * y, 0.03);
  }
  function loomisHead(ctx, cx, cy, r, turn) {   // turn: 0 front, ±1 three-quarter
    circle(ctx, cx, cy, r);
    ellipse(ctx, cx + turn * r * 0.62, cy, r * 0.34, r * 0.78, -0.15 * turn);
    const jx = cx + turn * r * 0.12;
    curve(ctx, cx - r * 0.7, cy + r * 0.35, jx - r * 0.2, cy + r * 1.75, jx + r * 0.25, cy + r * 1.78);
    curve(ctx, jx + r * 0.25, cy + r * 1.78, cx + r * 0.75, cy + r * 1.55, cx + r * 0.78, cy + r * 0.5);
    line(ctx, cx - r * 0.95, cy + r * 0.28, cx + r * 0.95, cy + r * 0.28);   // brow
    line(ctx, cx - r * 0.9, cy + r * 0.95, cx + r * 0.9, cy + r * 0.95);     // nose
    line(ctx, cx - r * 0.55, cy + r * 1.33, cx + r * 0.55, cy + r * 1.33);   // mouth
    curve(ctx, cx + turn * r * 0.12, cy - r * 0.98, cx + turn * r * 0.3, cy + r * 0.4, cx + turn * r * 0.12, cy + r * 1.78);
  }

  const D = {
    /* ---------------- Foundations: forms ---------------- */
    primitives(ctx) {
      title(ctx, "The four primitives — copy each 3×, then combine");
      cube(ctx, 0.22, 0.26, 0.08); label(ctx, 0.15, 0.42, "cube (start with a Y)");
      cylinder(ctx, 0.5, 0.18, 0.06, 0.2, 0.022); label(ctx, 0.43, 0.42, "cylinder");
      circle(ctx, 0.78, 0.26, 0.075); ellipse(ctx, 0.78, 0.26, 0.075, 0.025); ellipse(ctx, 0.78, 0.26, 0.025, 0.075);
      label(ctx, 0.72, 0.42, "sphere + contours");
      poly(ctx, [[0.22, 0.52], [0.13, 0.7], [0.31, 0.7]]); ellipse(ctx, 0.22, 0.7, 0.09, 0.03);
      label(ctx, 0.17, 0.78, "cone");
      note(ctx, 0.88, "Contour lines wrap AROUND the form — they're what make a circle become a ball.");
    },
    boxRotations(ctx) {
      title(ctx, "Boxes in space — a row of 12, each rotated a little more");
      style(ctx, { dash: true }); line(ctx, 0.08, 0.3, 0.92, 0.3); line(ctx, 0.08, 0.55, 0.92, 0.55); line(ctx, 0.08, 0.8, 0.92, 0.8); style(ctx);
      cube(ctx, 0.16, 0.22, 0.045);
      note(ctx, 0.9, "Rule: every set of parallel edges converges toward ONE point far away. Check each box after drawing it.");
    },
    combineVolumes(ctx) {
      title(ctx, "Everything is primitives wearing a costume");
      rect(ctx, 0.12, 0.28, 0.14, 0.11); poly(ctx, [[0.1, 0.28], [0.19, 0.2], [0.28, 0.28]], false);
      label(ctx, 0.11, 0.46, "house = box + wedge");
      cylinder(ctx, 0.5, 0.24, 0.05, 0.14, 0.017); curve(ctx, 0.55, 0.28, 0.61, 0.31, 0.55, 0.35);
      label(ctx, 0.42, 0.46, "mug = cylinder + torus");
      circle(ctx, 0.8, 0.22, 0.03); circle(ctx, 0.8, 0.29, 0.045); circle(ctx, 0.8, 0.385, 0.06);
      label(ctx, 0.71, 0.46, "snowman = 3 spheres");
      cylinder(ctx, 0.25, 0.6, 0.02, 0.18, 0.008); poly(ctx, [[0.16, 0.6], [0.34, 0.6], [0.31, 0.53], [0.19, 0.53]]);
      label(ctx, 0.12, 0.85, "lamp = cone + thin cylinder");
      cube(ctx, 0.62, 0.66, 0.07); circle(ctx, 0.57, 0.8, 0.028); circle(ctx, 0.69, 0.8, 0.028);
      label(ctx, 0.5, 0.88, "cart = box + 2 cylinders");
    },
    ellipseDegrees(ctx) {
      title(ctx, "Ellipses: one circle, many angles");
      for (let i = 0; i < 6; i++) ellipse(ctx, 0.15 + i * 0.14, 0.3, 0.06, 0.01 + i * 0.011);
      label(ctx, 0.1, 0.4, "10°"); label(ctx, 0.84, 0.4, "90°");
      ellipse(ctx, 0.5, 0.65, 0.16, 0.07);
      style(ctx, { dash: true }); line(ctx, 0.5, 0.52, 0.5, 0.78); line(ctx, 0.3, 0.65, 0.7, 0.65); style(ctx);
      label(ctx, 0.52, 0.5, "minor axis", { fs: 0.11 }); label(ctx, 0.66, 0.68, "major", { fs: 0.11 });
      note(ctx, 0.9, "The minor axis always points along the cylinder's core. Draw through it 2–3 times.");
    },
    formIntersections(ctx) {
      title(ctx, "Forms that intersect — where do the surfaces meet?");
      cube(ctx, 0.3, 0.4, 0.13);
      cylinder(ctx, 0.36, 0.28, 0.05, 0.3, 0.018);
      circle(ctx, 0.7, 0.5, 0.11); cube(ctx, 0.66, 0.5, 0.09);
      note(ctx, 0.85, "Draw the seam where each pair meets. If you can't, you don't yet believe the forms are solid.");
    },
    organicForms(ctx) {
      title(ctx, "Organic forms = two spheres + a tube (the sausage)");
      for (let i = 0; i < 3; i++) {
        const y = 0.25 + i * 0.22, rot = (i - 1) * 0.5;
        ctx.save(); ctx.translate(X(0.5), Y(y)); ctx.rotate(rot); ctx.translate(-X(0.5), -Y(y));
        circle(ctx, 0.32, y, 0.06); circle(ctx, 0.68, y, 0.06);
        line(ctx, 0.32, y - 0.06, 0.68, y - 0.06); line(ctx, 0.32, y + 0.06, 0.68, y + 0.06);
        for (let k = 0; k < 4; k++) ellipse(ctx, 0.38 + k * 0.08, y, 0.012 + k * 0.004, 0.06);
        ctx.restore();
      }
      note(ctx, 0.92, "Contour ellipses get rounder as the tube turns toward you — same rule as the cylinder.");
    },

    /* ---------------- Foundations: observation ---------------- */
    obsFrame(ctx) {
      title(ctx, "Observation study — the reference is on your other screen");
      rect(ctx, 0.1, 0.16, 0.8, 0.62);
      style(ctx, { dash: true });
      line(ctx, 0.367, 0.16, 0.367, 0.78); line(ctx, 0.633, 0.16, 0.633, 0.78);
      line(ctx, 0.1, 0.367, 0.9, 0.367); line(ctx, 0.1, 0.573, 0.9, 0.573);
      style(ctx);
      note(ctx, 0.84, "1  Big shapes first (5 min).  2  Compare angles to vertical/horizontal.  3  Details LAST.");
      note(ctx, 0.9, "Use the thirds grid to place things: 'the cup sits on the lower-left crossing.'");
    },
    negativeSpace(ctx) {
      title(ctx, "Negative space: draw the holes, not the thing");
      rect(ctx, 0.12, 0.18, 0.36, 0.5);
      ctx.save(); style(ctx, { fill: "#1b2a3a" }); ctx.globalAlpha = 0.22;
      ctx.fillRect(X(0.12), Y(0.18), X(0.36), X(0.5));
      ctx.globalCompositeOperation = "destination-out"; ctx.globalAlpha = 1;
      ctx.fillRect(X(0.17), Y(0.22), X(0.07), X(0.4)); ctx.fillRect(X(0.36), Y(0.22), X(0.07), X(0.4));
      ctx.fillRect(X(0.17), Y(0.22), X(0.26), X(0.06)); ctx.fillRect(X(0.17), Y(0.5), X(0.26), X(0.05));
      ctx.restore(); style(ctx);
      label(ctx, 0.14, 0.75, "the shapes AROUND a chair", { fs: 0.11 });
      rect(ctx, 0.55, 0.18, 0.36, 0.5);
      note(ctx, 0.84, "Your brain names objects and lies about their shape. Empty space has no name — so it can't lie.");
    },
    sightMeasure(ctx) {
      title(ctx, "Sight-measuring: everything relative to one unit");
      rect(ctx, 0.15, 0.2, 0.3, 0.5);
      style(ctx, { dash: true }); line(ctx, 0.15, 0.14, 0.45, 0.14); line(ctx, 0.5, 0.2, 0.5, 0.7); style(ctx);
      label(ctx, 0.2, 0.1, "1 unit wide", { fs: 0.11 }); label(ctx, 0.52, 0.45, "1.7 units tall", { fs: 0.11 });
      line(ctx, 0.65, 0.65, 0.88, 0.32); style(ctx, { dash: true }); line(ctx, 0.65, 0.65, 0.88, 0.65); style(ctx);
      label(ctx, 0.75, 0.7, "angle vs horizontal ≈ 55°", { fs: 0.11 });
      note(ctx, 0.85, "Hold the pen at arm's length. Everything is 'about 1.5 of these' — never 'about 3 inches'.");
    },

    /* ---------------- Perspective ---------------- */
    persp1pt(ctx) {
      title(ctx, "One-point: the box faces you square-on");
      const hy = 0.32; style(ctx, { dash: true }); line(ctx, 0.05, hy, 0.95, hy); style(ctx);
      dot(ctx, 0.5, hy, 0.03); label(ctx, 0.52, 0.28, "VP", { fs: 0.11 });
      rect(ctx, 0.2, 0.45, 0.14, 0.12);
      style(ctx, { dash: true }); line(ctx, 0.2, 0.45, 0.5, hy); line(ctx, 0.34, 0.45, 0.5, hy); line(ctx, 0.34, 0.57, 0.5, hy); style(ctx);
      const t = 0.35, L = (a, b) => a + (b - a) * t;
      line(ctx, L(0.2, 0.5), L(0.45, hy), L(0.34, 0.5), L(0.45, hy));
      line(ctx, L(0.34, 0.5), L(0.45, hy), L(0.34, 0.5), L(0.57, hy));
      note(ctx, 0.75, "Horizon = your eye level. Above it you see undersides; below it, tops.");
      note(ctx, 0.82, "Turn on Guides → Perspective (1-point) and drag the VP to match.");
    },
    persp2ptBox(ctx) {
      title(ctx, "Two-point: standing at the corner");
      const hy = 0.3; style(ctx, { dash: true }); line(ctx, 0.02, hy, 0.98, hy); style(ctx);
      dot(ctx, 0.06, hy, 0.028); dot(ctx, 0.94, hy, 0.028);
      label(ctx, 0.08, 0.26, "VP1", { fs: 0.1 }); label(ctx, 0.86, 0.26, "VP2", { fs: 0.1 });
      const cx = 0.5;
      line(ctx, cx, 0.42, cx, 0.66);
      style(ctx, { dash: true });
      line(ctx, cx, 0.42, 0.06, hy); line(ctx, cx, 0.66, 0.06, hy); line(ctx, cx, 0.42, 0.94, hy); line(ctx, cx, 0.66, 0.94, hy);
      style(ctx);
      const l = 0.36, r = 0.65;
      const yOn = (x, y0, vx) => y0 + (hy - y0) * ((x - cx) / (vx - cx));
      line(ctx, l, yOn(l, 0.42, 0.06), l, yOn(l, 0.66, 0.06)); line(ctx, r, yOn(r, 0.42, 0.94), r, yOn(r, 0.66, 0.94));
      line(ctx, cx, 0.42, l, yOn(l, 0.42, 0.06)); line(ctx, cx, 0.66, l, yOn(l, 0.66, 0.06));
      line(ctx, cx, 0.42, r, yOn(r, 0.42, 0.94)); line(ctx, cx, 0.66, r, yOn(r, 0.66, 0.94));
      note(ctx, 0.8, "Keep VPs FAR apart (even off-page) or the box looks fish-eyed. Verticals stay vertical.");
    },
    perspRoom(ctx) {
      title(ctx, "A room in one-point: back wall, floor, one prop");
      rect(ctx, 0.3, 0.3, 0.4, 0.3);
      const vx = 0.5, vy = 0.45;
      line(ctx, 0.05, 0.05, 0.3, 0.3); line(ctx, 0.95, 0.05, 0.7, 0.3); line(ctx, 0.05, 0.9, 0.3, 0.6); line(ctx, 0.95, 0.9, 0.7, 0.6);
      dot(ctx, vx, vy, 0.02);
      style(ctx, { dash: true }); for (let i = 1; i < 4; i++) line(ctx, 0.05 + i * 0.06, 0.9 - i * 0.075, vx, vy); style(ctx);
      note(ctx, 0.95, "Floor lines aim at the VP. Put a box on the floor: its front face is flat, its depth aims at the VP.");
    },
    persp3pt(ctx) {
      title(ctx, "Three-point: looking UP (or down) at a tower");
      style(ctx, { dash: true }); line(ctx, 0.02, 0.62, 0.98, 0.62); style(ctx);
      dot(ctx, 0.05, 0.62, 0.025); dot(ctx, 0.95, 0.62, 0.025); dot(ctx, 0.5, 0.06, 0.025);
      label(ctx, 0.46, 0.11, "VP3 (up)", { fs: 0.1 });
      const bl = [0.38, 0.85], br = [0.62, 0.88], bm = [0.5, 0.92];
      line(ctx, ...bm, ...bl); line(ctx, ...bm, ...br);
      line(ctx, bm[0], bm[1], 0.5, 0.06); line(ctx, bl[0], bl[1], 0.5, 0.06); line(ctx, br[0], br[1], 0.5, 0.06);
      line(ctx, 0.41, 0.4, 0.5, 0.42); line(ctx, 0.5, 0.42, 0.59, 0.4);
      note(ctx, 0.97, "The third VP pulls verticals together: low & far = heroic, high & far = vertigo.");
    },
    circleInPersp(ctx) {
      title(ctx, "A perfect circle in perspective = an ellipse in a perspective square");
      const hy = 0.25; style(ctx, { dash: true }); line(ctx, 0.05, hy, 0.95, hy); style(ctx); dot(ctx, 0.5, hy, 0.02);
      poly(ctx, [[0.25, 0.7], [0.75, 0.7], [0.65, 0.48], [0.35, 0.48]]);
      line(ctx, 0.25, 0.7, 0.65, 0.48); line(ctx, 0.75, 0.7, 0.35, 0.48);
      style(ctx, { dash: true }); line(ctx, 0.5, 0.48, 0.5, 0.7); line(ctx, 0.3, 0.6, 0.7, 0.6); style(ctx);
      ellipse(ctx, 0.5, 0.595, 0.235, 0.105);
      note(ctx, 0.85, "Diagonals find the TRUE center (further back than halfway). The ellipse touches all four edges.");
    },
    atmospheric(ctx) {
      title(ctx, "Atmospheric perspective: distance = lighter, bluer, softer, less contrast");
      const bands = [[0.7, 0.12], [0.55, 0.32], [0.42, 0.55], [0.3, 0.8]];
      bands.forEach(([y, a], i) => {
        ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = "#1b2a3a";
        ctx.beginPath(); ctx.moveTo(X(0.05), Y(0.95));
        for (let x = 0; x <= 1; x += 0.05) ctx.lineTo(X(0.05 + x * 0.9), Y(y - Math.abs(Math.sin(x * 9 + i)) * 0.12));
        ctx.lineTo(X(0.95), Y(0.95)); ctx.closePath(); ctx.fill(); ctx.restore();
      });
      style(ctx);
      label(ctx, 0.08, 0.2, "far: pale, cool, soft edges", { fs: 0.11 });
      label(ctx, 0.08, 0.9, "near: dark, warm, crisp", { fs: 0.11, stroke: "#fff", fill: "#fff" });
    },

    /* ---------------- Shading ---------------- */
    valueScale(ctx) {
      title(ctx, "Value scale: 9 steps from white to black — fill each square");
      for (let i = 0; i < 9; i++) {
        rect(ctx, 0.08 + i * 0.094, 0.25, 0.086, 0.12);
        ctx.save(); ctx.globalAlpha = i / 8; ctx.fillStyle = "#000";
        ctx.fillRect(X(0.08 + i * 0.094), Y(0.42), X(0.086), X(0.05)); ctx.restore();
        style(ctx);
      }
      note(ctx, 0.58, "Top row: yours (pencil, then marker, then ink hatching). Bottom row: target.");
      note(ctx, 0.66, "Comics compress this to ~3 values. Squint: if your drawing turns to mud, restate it.");
    },
    sphereShade(ctx) {
      title(ctx, "One light, five zones");
      arrow(ctx, 0.22, 0.2, 0.34, 0.3); label(ctx, 0.14, 0.18, "light", { fs: 0.11 });
      circle(ctx, 0.5, 0.42, 0.14);
      arc(ctx, 0.5, 0.42, 0.14, 0.06, Math.PI * 0.15, Math.PI * 1.05, -0.7);
      for (let i = 0; i < 7; i++) curve(ctx, 0.55 + i * 0.013, 0.5 - i * 0.015, 0.575 + i * 0.012, 0.53 - i * 0.013, 0.605 + i * 0.011, 0.5 - i * 0.011);
      ellipse(ctx, 0.57, 0.6, 0.17, 0.035);
      label(ctx, 0.7, 0.3, "1 highlight", { fs: 0.11 }); label(ctx, 0.7, 0.36, "2 light (half-tone)", { fs: 0.11 });
      label(ctx, 0.7, 0.42, "3 core shadow (darkest)", { fs: 0.11 }); label(ctx, 0.7, 0.48, "4 reflected light", { fs: 0.11 });
      label(ctx, 0.7, 0.54, "5 cast shadow", { fs: 0.11 });
      note(ctx, 0.75, "Cube and cylinder below: same light. The cylinder's core shadow is a soft BAND, the cube's is a hard EDGE.");
      cube(ctx, 0.25, 0.82, 0.07); cylinder(ctx, 0.62, 0.76, 0.05, 0.15, 0.018);
    },
    hatchTypes(ctx) {
      title(ctx, "Mark-making: same value, different textures");
      const rows = ["hatching", "cross-hatching", "contour hatching", "stippling", "scumbling"];
      rows.forEach((name, r) => {
        const y = 0.2 + r * 0.14;
        rect(ctx, 0.08, y, 0.3, 0.09);
        label(ctx, 0.42, y + 0.045, name, { fs: 0.12 });
        ctx.save(); ctx.beginPath(); ctx.rect(X(0.08), Y(y), X(0.3), X(0.09)); ctx.clip();
        if (r === 0 || r === 1) for (let i = 0; i < 18; i++) line(ctx, 0.08 + i * 0.018, y, 0.08 + i * 0.018 + 0.03, y + 0.09);
        if (r === 1) for (let i = 0; i < 18; i++) line(ctx, 0.08 + i * 0.018 + 0.03, y, 0.08 + i * 0.018, y + 0.09);
        if (r === 2) for (let i = 0; i < 14; i++) curve(ctx, 0.08 + i * 0.023, y, 0.1 + i * 0.023, y + 0.05, 0.08 + i * 0.023, y + 0.09);
        if (r === 3) for (let i = 0; i < 260; i++) dot(ctx, 0.08 + Math.random() * 0.3, y + Math.random() * 0.09 * (P.w / P.h) * (P.h / P.w), 0.006);
        if (r === 4) for (let i = 0; i < 40; i++) { const x0 = 0.08 + Math.random() * 0.28, y0 = y + Math.random() * 0.08; curve(ctx, x0, y0, x0 + 0.02, y0 + 0.02, x0 + 0.015, y0 - 0.01); }
        ctx.restore(); style(ctx);
      });
      note(ctx, 0.92, "Comics inkers use hatching + feathering for tone because print has no grey. Fill each box with the technique named.");
    },
    lightScenarios(ctx) {
      title(ctx, "Four lighting setups on the same head");
      const setups = ["front", "3/4 (Rembrandt)", "side (split)", "rim / back"];
      setups.forEach((s, i) => {
        const cx = 0.17 + i * 0.22, cy = 0.4;
        loomisHead(ctx, cx, cy, 0.06, 0);
        label(ctx, cx - 0.09, 0.62, s, { fs: 0.1 });
        const ang = [-Math.PI / 2, -Math.PI / 4, 0, Math.PI * 0.9][i];
        arrow(ctx, cx + Math.cos(ang) * 0.16, cy + Math.sin(ang) * 0.16, cx + Math.cos(ang) * 0.09, cy + Math.sin(ang) * 0.09);
      });
      note(ctx, 0.78, "Spot the blacks for each. Rim light = character in silhouette with one bright edge — a comics staple.");
    },

    /* ---------------- Gesture ---------------- */
    gestureLines(ctx) {
      title(ctx, "The line of action — the whole pose in one line");
      curve(ctx, 0.2, 0.2, 0.1, 0.4, 0.22, 0.6); label(ctx, 0.18, 0.66, "C", { fs: 0.14, bold: true });
      curve(ctx, 0.48, 0.2, 0.6, 0.32, 0.48, 0.42); curve(ctx, 0.48, 0.42, 0.38, 0.5, 0.5, 0.6); label(ctx, 0.46, 0.66, "S", { fs: 0.14, bold: true });
      line(ctx, 0.78, 0.2, 0.75, 0.6); label(ctx, 0.74, 0.66, "I", { fs: 0.14, bold: true });
      note(ctx, 0.76, "Straight against curve. Where the body pushes, draw straight; where it stretches, draw curve.");
      note(ctx, 0.83, "30 seconds per pose. If it's pretty, you went too slow.");
    },
    beanFigure(ctx) {
      title(ctx, "The bean: ribcage and pelvis pinched at the waist");
      curve(ctx, 0.38, 0.22, 0.52, 0.42, 0.4, 0.66);
      ellipse(ctx, 0.4, 0.22, 0.03, 0.04);
      ellipse(ctx, 0.44, 0.34, 0.065, 0.085, 0.4);
      ellipse(ctx, 0.42, 0.55, 0.055, 0.065, -0.3);
      label(ctx, 0.55, 0.34, "ribcage tilts one way", { fs: 0.11 }); label(ctx, 0.55, 0.55, "pelvis tilts the other", { fs: 0.11 });
      note(ctx, 0.8, "That counter-tilt (contrapposto) is the difference between a mannequin and a person.");
    },

    /* ---------------- Head ---------------- */
    loomisFront(ctx) {
      title(ctx, "Loomis head, front: ball → side planes → jaw → thirds");
      loomisHead(ctx, 0.5, 0.36, 0.14, 0);
      label(ctx, 0.7, 0.4, "brow line", { fs: 0.1 }); label(ctx, 0.7, 0.49, "nose", { fs: 0.1 }); label(ctx, 0.7, 0.55, "mouth", { fs: 0.1 });
      note(ctx, 0.78, "Hairline→brow→nose→chin are EQUAL thirds. Eyes sit halfway down the whole skull.");
      note(ctx, 0.85, "Eye width = the gap between the eyes = the nose width. Ears run brow-to-nose.");
    },
    loomisAngles(ctx) {
      title(ctx, "The same head, turned: the centerline curves, the far side compresses");
      loomisHead(ctx, 0.2, 0.36, 0.1, 0); label(ctx, 0.13, 0.6, "front", { fs: 0.11 });
      loomisHead(ctx, 0.5, 0.36, 0.1, 1); label(ctx, 0.4, 0.6, "three-quarter", { fs: 0.11 });
      circle(ctx, 0.8, 0.36, 0.1); circle(ctx, 0.85, 0.36, 0.06);
      curve(ctx, 0.72, 0.4, 0.68, 0.55, 0.78, 0.56); line(ctx, 0.78, 0.56, 0.88, 0.5);
      label(ctx, 0.73, 0.6, "profile", { fs: 0.11 });
      note(ctx, 0.75, "The ear sits on the side-plane circle. Tilt the head: the thirds curve with the ball, they don't stay straight.");
    },
    expressionGrid(ctx) {
      title(ctx, "Expressions come from brows + eyelids + mouth corners");
      const faces = ["neutral", "joy", "surprise", "anger", "sadness", "fear"];
      faces.forEach((f, i) => {
        const cx = 0.17 + (i % 3) * 0.33, cy = 0.28 + Math.floor(i / 3) * 0.3;
        ellipse(ctx, cx, cy, 0.075, 0.095);
        const b = [0, -0.01, -0.03, 0.015, 0.01, -0.025][i], bAng = [0, 0, 0, 0.35, -0.3, 0.1][i];
        line(ctx, cx - 0.05, cy - 0.035 + b + bAng * 0.03, cx - 0.015, cy - 0.035 + b - bAng * 0.03);
        line(ctx, cx + 0.015, cy - 0.035 + b - bAng * 0.03, cx + 0.05, cy - 0.035 + b + bAng * 0.03);
        const eyeR = [0.008, 0.007, 0.014, 0.008, 0.007, 0.013][i];
        circle(ctx, cx - 0.03, cy - 0.01, eyeR); circle(ctx, cx + 0.03, cy - 0.01, eyeR);
        const m = [0, 0.02, 0, -0.012, -0.018, -0.004][i];
        curve(ctx, cx - 0.03, cy + 0.045, cx, cy + 0.045 + m * 2, cx + 0.03, cy + 0.045);
        if (i === 2 || i === 5) ellipse(ctx, cx, cy + 0.05, 0.015, 0.02);
        label(ctx, cx - 0.06, cy + 0.14, f, { fs: 0.1 });
      });
      note(ctx, 0.92, "Copy each, then push one 2× further. Then draw the same emotion on a head turned three-quarter.");
    },

    /* ---------------- Body ---------------- */
    mannequin(ctx) {
      title(ctx, "7.5 heads: the proportion ruler and the mannequin");
      const top = 0.14, unit = 0.088;
      for (let i = 0; i <= 7; i++) { line(ctx, 0.14, top + i * unit, 0.18, top + i * unit); if (i < 7) label(ctx, 0.09, top + (i + 0.6) * unit, String(i + 1), { fs: 0.1 }); }
      mannequin(ctx, 0.55, top, unit);
      label(ctx, 0.68, 0.3, "elbows at waist", { fs: 0.1 }); label(ctx, 0.68, 0.36, "wrists at crotch", { fs: 0.1 });
      label(ctx, 0.68, 0.62, "knees ≈ 5.5 heads", { fs: 0.1 });
    },
    mannequinBoxes(ctx) {
      title(ctx, "Boxes, not blobs: the ribcage and pelvis as solid forms");
      cube(ctx, 0.35, 0.3, 0.09); label(ctx, 0.26, 0.5, "ribcage box (tilted)", { fs: 0.11 });
      cube(ctx, 0.36, 0.6, 0.07); label(ctx, 0.28, 0.76, "pelvis box", { fs: 0.11 });
      line(ctx, 0.35, 0.42, 0.36, 0.6);
      cylinder(ctx, 0.7, 0.28, 0.03, 0.2, 0.011); cylinder(ctx, 0.7, 0.55, 0.035, 0.22, 0.012);
      label(ctx, 0.62, 0.84, "limbs = tapered cylinders", { fs: 0.11 });
      note(ctx, 0.93, "Boxes can be turned. Blobs can't. This is why the mannequin survives any camera angle.");
    },
    proportionCompare(ctx) {
      title(ctx, "Proportion is a choice: realistic vs heroic vs stylized");
      const tops = [[0.2, 0.088, "7.5 heads"], [0.5, 0.078, "8.5 heads (heroic)"], [0.8, 0.13, "5 heads (chibi)"]];
      tops.forEach(([mx, u, name]) => { mannequin(ctx, mx, 0.15, u); label(ctx, mx - 0.1, 0.9, name, { fs: 0.1 }); });
    },

    /* ---------------- Fabric ---------------- */
    foldTypes(ctx) {
      title(ctx, "The seven fold families (Hogarth)");
      const names = ["pipe", "zigzag", "spiral", "half-lock", "diaper", "drop", "inert"];
      names.forEach((n, i) => {
        const cx = 0.12 + (i % 4) * 0.23, cy = 0.22 + Math.floor(i / 4) * 0.3;
        rect(ctx, cx - 0.08, cy - 0.08, 0.16, 0.17);
        if (n === "pipe") for (let k = 0; k < 4; k++) line(ctx, cx - 0.05 + k * 0.033, cy - 0.07, cx - 0.05 + k * 0.033, cy + 0.08);
        if (n === "zigzag") poly(ctx, [[cx - 0.06, cy - 0.06], [cx + 0.02, cy - 0.02], [cx - 0.04, cy + 0.02], [cx + 0.04, cy + 0.07]], false);
        if (n === "spiral") for (let k = 0; k < 4; k++) arc(ctx, cx, cy - 0.06 + k * 0.04, 0.05, 0.015, 0, Math.PI);
        if (n === "half-lock") { line(ctx, cx - 0.06, cy - 0.06, cx, cy); line(ctx, cx, cy, cx + 0.05, cy + 0.07); curve(ctx, cx - 0.03, cy, cx, cy + 0.01, cx + 0.02, cy - 0.02); }
        if (n === "diaper") { dot(ctx, cx - 0.05, cy - 0.06); dot(ctx, cx + 0.05, cy - 0.06); for (let k = 0; k < 3; k++) curve(ctx, cx - 0.05, cy - 0.06, cx, cy + 0.02 + k * 0.03, cx + 0.05, cy - 0.06); }
        if (n === "drop") { dot(ctx, cx, cy - 0.07); for (let k = -2; k <= 2; k++) curve(ctx, cx, cy - 0.07, cx + k * 0.02, cy, cx + k * 0.035, cy + 0.08); }
        if (n === "inert") for (let k = 0; k < 3; k++) curve(ctx, cx - 0.06, cy + 0.02 + k * 0.025, cx - 0.02 + k * 0.01, cy - 0.01 + k * 0.025, cx + 0.06, cy + 0.03 + k * 0.025);
        label(ctx, cx - 0.07, cy + 0.14, n, { fs: 0.1 });
      });
      note(ctx, 0.9, "Every fold is cloth being PULLED between points or DROPPED from one. Find the tension points first.");
    },
    tensionPoints(ctx) {
      title(ctx, "Where cloth is pinned, folds radiate — draw the pins first");
      mannequin(ctx, 0.35, 0.15, 0.085);
      for (const [x, y] of [[0.28, 0.25], [0.42, 0.25], [0.35, 0.46], [0.31, 0.62], [0.39, 0.62]]) dot(ctx, x, y, 0.028);
      for (let k = 0; k < 4; k++) curve(ctx, 0.28, 0.25, 0.32 + k * 0.01, 0.36, 0.3 + k * 0.03, 0.46);
      label(ctx, 0.55, 0.25, "shoulders: pins", { fs: 0.11 }); label(ctx, 0.55, 0.46, "belt/waist: pin", { fs: 0.11 });
      label(ctx, 0.55, 0.62, "knees: pins when bent", { fs: 0.11 });
      note(ctx, 0.85, "A cape hangs from two pins (shoulders) — drop folds. A hood is a tube crumpled at the neck — spiral + inert.");
    },

    /* ---------------- Color (real colors, untinted guide) ---------------- */
    colorWheel12(ctx) {
      title(ctx, "The 12-hue wheel — primaries, secondaries, tertiaries");
      const cx = X(0.5), cy = Y(0.45), R = X(0.3), r = X(0.17);
      for (let i = 0; i < 12; i++) {
        const a0 = (i / 12) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / 12) * Math.PI * 2 - Math.PI / 2;
        ctx.beginPath(); ctx.arc(cx, cy, R, a0, a1); ctx.arc(cx, cy, r, a1, a0, true); ctx.closePath();
        ctx.fillStyle = `hsl(${i * 30},85%,55%)`; ctx.fill();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.stroke();
      }
      style(ctx);
      label(ctx, 0.44, 0.1, "yellow", { fs: 0.1 }); label(ctx, 0.78, 0.6, "red", { fs: 0.1 }); label(ctx, 0.12, 0.6, "blue", { fs: 0.1 });
      note(ctx, 0.84, "Opposite = complementary. Neighbors = analogous. Every 4th = triad. The Tool tab's wheel does this live.");
    },
    hsvBars(ctx) {
      title(ctx, "Three properties: hue, saturation, value");
      const w = 0.7 / 8;
      for (let i = 0; i < 8; i++) {
        ctx.fillStyle = `hsl(${i * 45},80%,55%)`; ctx.fillRect(X(0.15 + i * w), Y(0.22), X(w), X(0.07));
        ctx.fillStyle = `hsl(210,${100 - i * 13}%,55%)`; ctx.fillRect(X(0.15 + i * w), Y(0.4), X(w), X(0.07));
        ctx.fillStyle = `hsl(210,80%,${92 - i * 11}%)`; ctx.fillRect(X(0.15 + i * w), Y(0.58), X(w), X(0.07));
      }
      style(ctx);
      label(ctx, 0.03, 0.26, "hue", { fs: 0.11 }); label(ctx, 0.03, 0.44, "saturation", { fs: 0.11 }); label(ctx, 0.03, 0.62, "value", { fs: 0.11 });
      note(ctx, 0.8, "Value does the storytelling; hue does the mood; saturation does the emphasis. Fill the rows below with your own.");
    },
    harmonies(ctx) {
      title(ctx, "Simple harmonies — swatch each one from the Tool tab wheel");
      const sets = [["monochromatic", [210, 210, 210], [40, 60, 80]], ["complementary", [30, 210], [55, 55]],
                    ["analogous", [190, 210, 230], [55, 55, 55]], ["triadic", [0, 120, 240], [55, 55, 55]]];
      sets.forEach(([n, hs, ls], row) => {
        const y = 0.2 + row * 0.16;
        label(ctx, 0.06, y + 0.04, n, { fs: 0.11 });
        hs.forEach((h, i) => { ctx.fillStyle = `hsl(${h},70%,${ls[i]}%)`; ctx.fillRect(X(0.36 + i * 0.13), Y(y), X(0.12), X(0.08)); });
      });
      style(ctx);
      note(ctx, 0.88, "A harmony is a promise: the palette stays inside it. Add ONE accent outside it and that's your focal point.");
    },
    temperature(ctx) {
      title(ctx, "Temperature is relative: the same grey reads warm or cool by its neighbors");
      ctx.fillStyle = "hsl(20,70%,55%)"; ctx.fillRect(X(0.1), Y(0.22), X(0.35), X(0.3));
      ctx.fillStyle = "hsl(210,70%,55%)"; ctx.fillRect(X(0.55), Y(0.22), X(0.35), X(0.3));
      ctx.fillStyle = "#8c8c8c"; ctx.fillRect(X(0.22), Y(0.3), X(0.11), X(0.14)); ctx.fillRect(X(0.67), Y(0.3), X(0.11), X(0.14));
      style(ctx);
      label(ctx, 0.1, 0.58, "same grey → looks cool here", { fs: 0.1 }); label(ctx, 0.55, 0.58, "→ looks warm here", { fs: 0.1 });
      note(ctx, 0.75, "Shadows aren't 'darker'. Warm light → cool shadows; cool light → warm shadows. Paint the grey box below twice.");
    },

    /* ---------------- Figure (advanced) ---------------- */
    foreshorten(ctx) {
      title(ctx, "Foreshortening: overlap + ellipses tell the eye what comes forward");
      cylinder(ctx, 0.25, 0.2, 0.05, 0.45, 0.018); label(ctx, 0.17, 0.72, "arm sideways", { fs: 0.1 });
      ellipse(ctx, 0.6, 0.45, 0.09, 0.09); ellipse(ctx, 0.6, 0.45, 0.06, 0.06); ellipse(ctx, 0.6, 0.45, 0.035, 0.035);
      circle(ctx, 0.6, 0.45, 0.02);
      label(ctx, 0.5, 0.72, "same arm pointing at you", { fs: 0.1 });
      note(ctx, 0.85, "Each section OVERLAPS the one behind it. The near end is drawn bigger. Contour ellipses go nearly round.");
    },
    handBlock(ctx) {
      title(ctx, "The hand: a mitten box + a thumb wedge + tapered tubes");
      poly(ctx, [[0.3, 0.42], [0.5, 0.38], [0.53, 0.62], [0.32, 0.66]]);
      poly(ctx, [[0.3, 0.5], [0.22, 0.56], [0.24, 0.64], [0.32, 0.62]]);
      for (let i = 0; i < 4; i++) { const bx = 0.34 + i * 0.05, by = 0.4 - i * 0.008; cylinder(ctx, bx, by - 0.16 + i * 0.015, 0.018, 0.16 - i * 0.015, 0.007); }
      label(ctx, 0.58, 0.45, "palm = box", { fs: 0.11 }); label(ctx, 0.58, 0.51, "thumb = wedge from the side", { fs: 0.11 });
      label(ctx, 0.58, 0.57, "fingers = 3 tapered cylinders each", { fs: 0.11 });
      note(ctx, 0.8, "Fingers fan from a curve, not a straight edge. The middle finger is the longest; the palm ≈ the middle finger.");
    },
    footWedge(ctx) {
      title(ctx, "The foot: a wedge with a heel block and a toe box");
      poly(ctx, [[0.2, 0.55], [0.6, 0.62], [0.62, 0.7], [0.18, 0.7]]);
      poly(ctx, [[0.18, 0.4], [0.3, 0.4], [0.32, 0.56], [0.2, 0.55]]);
      poly(ctx, [[0.6, 0.62], [0.75, 0.66], [0.74, 0.71], [0.62, 0.7]]);
      label(ctx, 0.18, 0.35, "ankle/heel block", { fs: 0.1 }); label(ctx, 0.62, 0.58, "toe box", { fs: 0.1 });
      note(ctx, 0.85, "The inner arch lifts; the outer edge sits flat. From the front the foot is a wedge pointing at you.");
    },

    /* ---------------- Anatomy ---------------- */
    skeletonLandmarks(ctx) {
      title(ctx, "Landmarks: the bones you can find on the surface");
      mannequin(ctx, 0.45, 0.14, 0.088);
      const marks = [[0.45, 0.24, "clavicles"], [0.45, 0.33, "sternum"], [0.38, 0.42, "ribcage edge"], [0.45, 0.46, "iliac crest"],
                     [0.47, 0.62, "greater trochanter"], [0.405, 0.63, "kneecap"], [0.41, 0.78, "ankle bones"], [0.355, 0.36, "elbow point"]];
      marks.forEach(([x, y, n]) => { dot(ctx, x, y, 0.022); label(ctx, 0.6, y, n, { fs: 0.1 }); style(ctx, { dash: true }); line(ctx, x, y, 0.59, y); style(ctx); });
      note(ctx, 0.93, "Anatomy for artists = landmarks + the big muscle masses between them. Not every muscle name.");
    },
    muscleGroups(ctx) {
      title(ctx, "The big masses: draw them as simple shapes that pull between landmarks");
      mannequin(ctx, 0.35, 0.14, 0.088);
      ellipse(ctx, 0.35, 0.29, 0.06, 0.035); label(ctx, 0.55, 0.29, "pectorals (fan from arm)", { fs: 0.1 });
      ellipse(ctx, 0.28, 0.23, 0.025, 0.035, 0.5); label(ctx, 0.55, 0.23, "deltoid (cap)", { fs: 0.1 });
      ellipse(ctx, 0.35, 0.4, 0.035, 0.06); label(ctx, 0.55, 0.4, "abdominals (block)", { fs: 0.1 });
      ellipse(ctx, 0.325, 0.53, 0.03, 0.09, 0.05); label(ctx, 0.55, 0.53, "quadriceps (teardrop)", { fs: 0.1 });
      ellipse(ctx, 0.325, 0.72, 0.02, 0.06); label(ctx, 0.55, 0.72, "calf (high inside, low outside)", { fs: 0.1 });
      note(ctx, 0.93, "Each mass has an origin and an insertion. Where it inserts is where it moves the limb.");
    },

    /* ---------------- Animals ---------------- */
    quadruped(ctx) {
      title(ctx, "The quadruped mannequin: same parts as us, rotated 90°");
      ellipse(ctx, 0.38, 0.45, 0.13, 0.085); ellipse(ctx, 0.66, 0.44, 0.08, 0.07);
      line(ctx, 0.5, 0.38, 0.6, 0.38);
      ellipse(ctx, 0.22, 0.32, 0.05, 0.04); line(ctx, 0.27, 0.35, 0.3, 0.4);
      for (const x of [0.32, 0.4]) { line(ctx, x, 0.52, x - 0.02, 0.63); line(ctx, x - 0.02, 0.63, x + 0.01, 0.72); line(ctx, x + 0.01, 0.72, x + 0.02, 0.78); dot(ctx, x - 0.02, 0.63, 0.016); dot(ctx, x + 0.01, 0.72, 0.016); }
      for (const x of [0.64, 0.7]) { line(ctx, x, 0.5, x + 0.03, 0.6); line(ctx, x + 0.03, 0.6, x, 0.7); line(ctx, x, 0.7, x, 0.78); dot(ctx, x + 0.03, 0.6, 0.016); dot(ctx, x, 0.7, 0.016); }
      label(ctx, 0.3, 0.86, "front leg: elbow → wrist", { fs: 0.1 }); label(ctx, 0.6, 0.86, "hind leg: knee → ankle (hock)", { fs: 0.1 });
      note(ctx, 0.95, "The 'backwards knee' on a dog is its ANKLE. Animals stand on their toes.");
    },
    legCompare(ctx) {
      title(ctx, "Three ways to stand: plantigrade, digitigrade, unguligrade");
      const legs = [["human/bear (plantigrade)", 0.2, 0.0], ["dog/cat (digitigrade)", 0.5, 0.06], ["horse/deer (unguligrade)", 0.8, 0.12]];
      legs.forEach(([n, cx, lift]) => {
        line(ctx, cx, 0.25, cx + 0.02, 0.45); dot(ctx, cx + 0.02, 0.45, 0.016);
        line(ctx, cx + 0.02, 0.45, cx - 0.01, 0.62 - lift); dot(ctx, cx - 0.01, 0.62 - lift, 0.016);
        line(ctx, cx - 0.01, 0.62 - lift, cx + 0.05, 0.7 - lift * 0.6); line(ctx, cx + 0.05, 0.7 - lift * 0.6, cx + 0.06, 0.72);
        style(ctx, { dash: true }); line(ctx, cx - 0.1, 0.72, cx + 0.12, 0.72); style(ctx);
        label(ctx, cx - 0.12, 0.8, n, { fs: 0.095 });
      });
      note(ctx, 0.92, "Same bones, different amount of foot on the ground. Longer foot bones = faster runner.");
    },
    birdMannequin(ctx) {
      title(ctx, "Birds: an egg body, a ball head, a wing that folds like your arm");
      ellipse(ctx, 0.45, 0.5, 0.15, 0.1, 0.3); circle(ctx, 0.66, 0.34, 0.05);
      line(ctx, 0.71, 0.33, 0.78, 0.35); line(ctx, 0.71, 0.36, 0.78, 0.35);
      poly(ctx, [[0.4, 0.42], [0.3, 0.32], [0.18, 0.4], [0.32, 0.48]]);
      line(ctx, 0.3, 0.58, 0.32, 0.7); line(ctx, 0.32, 0.7, 0.28, 0.76); line(ctx, 0.32, 0.7, 0.36, 0.76);
      poly(ctx, [[0.3, 0.55], [0.14, 0.62], [0.16, 0.56]], false);
      label(ctx, 0.15, 0.3, "wing: upper arm, forearm, hand", { fs: 0.1 });
      note(ctx, 0.9, "The wing's wrist is the bend you see mid-wing. Feathers are groups (coverts, primaries), not individual quills.");
    },

    /* ---------------- Objects ---------------- */
    vehicleBoxes(ctx) {
      title(ctx, "A car is two boxes on four cylinders — in perspective first");
      const hy = 0.25; style(ctx, { dash: true }); line(ctx, 0.02, hy, 0.98, hy); style(ctx); dot(ctx, 0.08, hy, 0.02); dot(ctx, 0.92, hy, 0.02);
      poly(ctx, [[0.25, 0.7], [0.5, 0.76], [0.8, 0.62], [0.58, 0.58]]);
      poly(ctx, [[0.25, 0.7], [0.25, 0.55], [0.58, 0.44], [0.58, 0.58]]); poly(ctx, [[0.58, 0.44], [0.8, 0.5], [0.8, 0.62], [0.58, 0.58]], false);
      poly(ctx, [[0.33, 0.55], [0.33, 0.45], [0.52, 0.4], [0.52, 0.47]]);
      ellipse(ctx, 0.32, 0.72, 0.03, 0.055, 0.15); ellipse(ctx, 0.66, 0.65, 0.028, 0.05, 0.15);
      note(ctx, 0.88, "Wheels are ellipses whose minor axis points along the axle. Get the boxes right and the car draws itself.");
    },
    weaponProportions(ctx) {
      title(ctx, "Weapons are tools: draw the GRIP first, then what the grip controls");
      line(ctx, 0.1, 0.3, 0.9, 0.3); line(ctx, 0.1, 0.3, 0.12, 0.27); line(ctx, 0.1, 0.3, 0.12, 0.33);
      rect(ctx, 0.62, 0.27, 0.12, 0.06); line(ctx, 0.62, 0.22, 0.62, 0.38); circle(ctx, 0.77, 0.3, 0.02);
      label(ctx, 0.3, 0.38, "blade", { fs: 0.1 }); label(ctx, 0.6, 0.42, "guard · grip (one hand ≈ 4 fingers) · pommel", { fs: 0.1 });
      poly(ctx, [[0.15, 0.6], [0.5, 0.6], [0.52, 0.66], [0.3, 0.66], [0.28, 0.74], [0.2, 0.74], [0.18, 0.66], [0.15, 0.66]]);
      line(ctx, 0.5, 0.63, 0.62, 0.63);
      label(ctx, 0.15, 0.8, "firearm: box receiver + tube barrel + grip angled for a hand", { fs: 0.1 });
      note(ctx, 0.92, "Reference real museum objects (links in the lesson). Invented weapons still obey hands and physics.");
    },
    mechanicalJoints(ctx) {
      title(ctx, "Machines = primitives + joints: hinge, pivot, slider, ball");
      cube(ctx, 0.18, 0.3, 0.05); cube(ctx, 0.3, 0.38, 0.05); circle(ctx, 0.245, 0.34, 0.02); label(ctx, 0.14, 0.52, "hinge", { fs: 0.1 });
      cylinder(ctx, 0.55, 0.24, 0.05, 0.08, 0.018); cylinder(ctx, 0.55, 0.3, 0.02, 0.15, 0.007); label(ctx, 0.5, 0.52, "pivot / axle", { fs: 0.1 });
      rect(ctx, 0.72, 0.28, 0.2, 0.06); rect(ctx, 0.76, 0.3, 0.08, 0.02); label(ctx, 0.75, 0.52, "slider / piston", { fs: 0.1 });
      circle(ctx, 0.3, 0.72, 0.045); cylinder(ctx, 0.3, 0.7, 0.02, 0.15, 0.007); label(ctx, 0.24, 0.9, "ball joint", { fs: 0.1 });
      note(ctx, 0.62, "Every moving part needs a joint; every joint needs a housing. Draw what holds the joint, and it looks real.");
    },

    /* ---------------- Environment ---------------- */
    thumbnailFrames(ctx) {
      title(ctx, "Thumbnail the shot before the scene: 3 horizons, 3 moods");
      const hs = [0.25, 0.5, 0.78], names = ["low horizon: sky, awe", "middle: neutral, documentary", "high horizon: ground, intimacy"];
      hs.forEach((h, i) => {
        const x = 0.08 + i * 0.31;
        rect(ctx, x, 0.2, 0.26, 0.3);
        line(ctx, x, 0.2 + 0.3 * h * (P.h / P.w) * (P.w / P.h), x + 0.26, 0.2 + 0.3 * h * (P.h / P.w) * (P.w / P.h));
        label(ctx, x, 0.56, names[i], { fs: 0.09 });
      });
      note(ctx, 0.7, "Postage-stamp size. Only three values. Where does the eye go? Fix it here, not at full size.");
    },
    depthLayers(ctx) {
      title(ctx, "Foreground · midground · background — overlap sells the depth");
      rect(ctx, 0.08, 0.15, 0.84, 0.55);
      ctx.save(); ctx.globalAlpha = 0.18; ctx.fillStyle = "#1b2a3a";
      ctx.beginPath(); ctx.moveTo(X(0.08), Y(0.5)); ctx.lineTo(X(0.3), Y(0.32)); ctx.lineTo(X(0.55), Y(0.45)); ctx.lineTo(X(0.75), Y(0.3)); ctx.lineTo(X(0.92), Y(0.42)); ctx.lineTo(X(0.92), Y(0.7)); ctx.lineTo(X(0.08), Y(0.7)); ctx.fill();
      ctx.globalAlpha = 0.4; ctx.beginPath(); ctx.moveTo(X(0.08), Y(0.7)); ctx.lineTo(X(0.2), Y(0.55)); ctx.lineTo(X(0.4), Y(0.62)); ctx.lineTo(X(0.5), Y(0.55)); ctx.lineTo(X(0.7), Y(0.7)); ctx.fill();
      ctx.globalAlpha = 0.85; ctx.fillRect(X(0.08), Y(0.6), X(0.14), X(0.1)); ctx.fillRect(X(0.78), Y(0.55), X(0.14), X(0.15));
      ctx.restore(); style(ctx);
      label(ctx, 0.1, 0.78, "FG: dark, detailed, frames the shot", { fs: 0.1 }); label(ctx, 0.1, 0.84, "MG: the subject lives here", { fs: 0.1 });
      label(ctx, 0.1, 0.9, "BG: light, simple, atmospheric", { fs: 0.1 });
    },
    landforms(ctx) {
      title(ctx, "Land is made by forces: read the cause, and the shapes draw themselves");
      poly(ctx, [[0.08, 0.4], [0.2, 0.22], [0.28, 0.3], [0.36, 0.18], [0.46, 0.4]], false); label(ctx, 0.1, 0.46, "fold mountains: jagged, young", { fs: 0.09 });
      curve(ctx, 0.55, 0.4, 0.72, 0.15, 0.9, 0.4); label(ctx, 0.56, 0.46, "old hills: rounded, eroded", { fs: 0.09 });
      curve(ctx, 0.08, 0.72, 0.18, 0.62, 0.28, 0.72); curve(ctx, 0.28, 0.72, 0.38, 0.82, 0.48, 0.72); label(ctx, 0.1, 0.88, "river: meanders, cuts the outside bend", { fs: 0.09 });
      line(ctx, 0.55, 0.66, 0.68, 0.6); line(ctx, 0.68, 0.6, 0.72, 0.74); line(ctx, 0.72, 0.74, 0.9, 0.7); label(ctx, 0.56, 0.88, "glacial valley: U-shape; river valley: V", { fs: 0.09 });
    },

    /* ---------------- Design sections ---------------- */
    shapeLanguage(ctx) {
      title(ctx, "Shape language: the silhouette is the first thing read");
      circle(ctx, 0.2, 0.4, 0.1); rect(ctx, 0.42, 0.3, 0.18, 0.2); poly(ctx, [[0.8, 0.28], [0.7, 0.5], [0.9, 0.5]]);
      label(ctx, 0.11, 0.58, "round: friendly, soft", { fs: 0.1 }); label(ctx, 0.4, 0.58, "square: stable, strong", { fs: 0.1 }); label(ctx, 0.68, 0.58, "triangle: dynamic, danger", { fs: 0.1 });
      note(ctx, 0.75, "Fill a silhouette solid black. If you can't tell who it is, the design isn't done yet.");
      note(ctx, 0.82, "Mash-up rule: take the STRUCTURE from one reference, the SURFACE from another, the PROPORTION from a third.");
    },
    mashupGrid(ctx) {
      title(ctx, "The recombination grid — three sources, one new thing");
      const cols = ["structure from…", "surface / texture from…", "proportion / attitude from…"];
      cols.forEach((c, i) => { rect(ctx, 0.08 + i * 0.3, 0.16, 0.26, 0.22); label(ctx, 0.09 + i * 0.3, 0.13, c, { fs: 0.09 }); });
      arrow(ctx, 0.5, 0.42, 0.5, 0.5);
      rect(ctx, 0.2, 0.52, 0.6, 0.4); label(ctx, 0.22, 0.49, "the new design (yours — nothing here is invented FOR you)", { fs: 0.09 });
    },
    panelFlow(ctx) {
      title(ctx, "Reading flow: the eye sweeps a Z — compose to help it");
      rect(ctx, 0.08, 0.15, 0.84, 0.6);
      style(ctx, { lw: S(0.03) }); poly(ctx, [[0.14, 0.22], [0.86, 0.22], [0.14, 0.68], [0.86, 0.68]], false); style(ctx);
      note(ctx, 0.84, "Faces, gestures, balloon tails and lighting all push the eye. Fight the Z only on purpose.");
    },
    lineWeights(ctx) {
      title(ctx, "Line weight is information: near/heavy, far/light, shadow-side/thick");
      const ws = [0.006, 0.012, 0.02, 0.032];
      ws.forEach((w, i) => { style(ctx, { lw: S(w) }); curve(ctx, 0.12, 0.25 + i * 0.12, 0.5, 0.18 + i * 0.12, 0.88, 0.25 + i * 0.12); });
      style(ctx);
      cube(ctx, 0.3, 0.72, 0.08); style(ctx, { lw: S(0.028) }); line(ctx, 0.3, 0.72, 0.3, 0.824); line(ctx, 0.3, 0.824, 0.22, 0.776); style(ctx);
      label(ctx, 0.45, 0.78, "thicken the edges that face AWAY from the light", { fs: 0.1 });
      label(ctx, 0.45, 0.84, "and the outline where the form meets air, not another form", { fs: 0.1 });
    },
  };

  /* which exemplars draw real colors (guide layer must be untinted) */
  const COLORFUL = new Set(["colorWheel12", "hsvBars", "harmonies", "temperature"]);

  function paint(ctx, key, page) {
    const fn = D[key];
    if (!fn) return false;
    P = page;
    ctx.save(); style(ctx); fn(ctx); ctx.restore();
    return true;
  }

  return { paint, has: k => !!D[k], isColorful: k => COLORFUL.has(k), keys: () => Object.keys(D) };
})();
