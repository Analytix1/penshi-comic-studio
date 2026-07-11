/* ============================================================
   guides.js — non-printing drafting overlays
   • Print guides: bleed / trim / safe-area, like a printed
     art board's blue lines
   • Composition: rule of thirds, golden ratio, center cross
   • Perspective: 1/2/3-point grid with vanishing points and a
     horizon line you drag directly on the canvas
   None of this ever exports — it's a light table, not ink.
   ============================================================ */
"use strict";

const Guides = (() => {
  let grabbed = null;   // "vp0" | "vp1" | "vp2" | "horizon"

  /* vp coords are stored as fractions of page size so they survive
     page-size changes; convert on the fly */
  const vpPx = i => ({ x: App.guides.vp[i].x * App.page.w,
                       y: App.guides.vp[i].y * App.page.h });

  function render(ctx) {
    const g = App.guides, P = App.page;
    const lw = 1 / App.view.zoom;

    if (g.printGuides && P.bleed > 0) {
      ctx.save();
      ctx.lineWidth = lw;
      ctx.strokeStyle = "rgba(224,96,96,.9)";              // trim — red
      ctx.strokeRect(P.bleed, P.bleed, P.w - 2 * P.bleed, P.h - 2 * P.bleed);
      ctx.strokeStyle = "rgba(109,179,242,.8)";            // safe — blue
      ctx.setLineDash([8 * lw, 6 * lw]);
      ctx.strokeRect(P.safe, P.safe, P.w - 2 * P.safe, P.h - 2 * P.safe);
      ctx.restore();
    }

    ctx.save();
    ctx.lineWidth = lw;
    ctx.strokeStyle = "rgba(232,176,75,.55)";
    if (g.thirds) gridLines(ctx, [1 / 3, 2 / 3], [1 / 3, 2 / 3]);
    if (g.golden) gridLines(ctx, [0.382, 0.618], [0.382, 0.618]);
    if (g.center) gridLines(ctx, [0.5], [0.5]);
    ctx.restore();

    if (g.persp) renderPerspective(ctx, lw);
  }

  function gridLines(ctx, xs, ys) {
    const P = App.page;
    ctx.beginPath();
    for (const fx of xs) { ctx.moveTo(P.w * fx, 0); ctx.lineTo(P.w * fx, P.h); }
    for (const fy of ys) { ctx.moveTo(0, P.h * fy); ctx.lineTo(P.w, P.h * fy); }
    ctx.stroke();
  }

  function renderPerspective(ctx, lw) {
    const g = App.guides, P = App.page;
    ctx.save();

    // horizon
    const hy = g.horizonY * P.h;
    ctx.strokeStyle = "rgba(109,179,242,.9)";
    ctx.lineWidth = lw * 1.5;
    ctx.beginPath(); ctx.moveTo(-P.w, hy); ctx.lineTo(P.w * 2, hy); ctx.stroke();

    const colors = ["rgba(232,96,96,.34)", "rgba(96,180,96,.34)", "rgba(109,140,242,.34)"];
    const n = g.vps;
    for (let i = 0; i < n; i++) {
      const vp = vpPx(i);
      if (i < 2) vp.y = hy;          // VP1 & VP2 ride the horizon; VP3 is free
      ctx.strokeStyle = colors[i];
      ctx.lineWidth = lw;
      ctx.beginPath();
      const RAYS = 28, R = Math.hypot(P.w, P.h) * 1.6;
      for (let r = 0; r < RAYS; r++) {
        const a = (r / RAYS) * Math.PI * 2;
        ctx.moveTo(vp.x, vp.y);
        ctx.lineTo(vp.x + Math.cos(a) * R, vp.y + Math.sin(a) * R);
      }
      ctx.stroke();
      // handle
      ctx.fillStyle = colors[i].replace(".34", "1");
      ctx.beginPath();
      ctx.arc(vp.x, vp.y, 9 / App.view.zoom, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = `${12 / App.view.zoom}px sans-serif`;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(String(i + 1), vp.x, vp.y);
    }
    ctx.restore();
  }

  /* ---------- direct manipulation ---------- */
  function tryGrab(p) {
    const g = App.guides;
    if (!g.persp) return false;
    const P = App.page;
    const grabR = 14 / App.view.zoom;
    for (let i = 0; i < g.vps; i++) {
      const vp = vpPx(i);
      if (i < 2) vp.y = g.horizonY * P.h;
      if (Math.hypot(p.x - vp.x, p.y - vp.y) < grabR) { grabbed = "vp" + i; return true; }
    }
    if (Math.abs(p.y - g.horizonY * P.h) < grabR / 1.5) { grabbed = "horizon"; return true; }
    return false;
  }
  function drag(p) {
    if (!grabbed) return false;
    const g = App.guides, P = App.page;
    if (grabbed === "horizon") g.horizonY = p.y / P.h;
    else {
      const i = +grabbed.slice(2);
      g.vp[i] = { x: p.x / P.w, y: p.y / P.h };
      if (i < 2) g.horizonY = p.y / P.h;   // dragging VP1/VP2 moves the horizon
    }
    App.dirty = true;
    return true;
  }
  function release() {
    const was = !!grabbed;
    grabbed = null;
    return was;
  }

  return { render, tryGrab, drag, release };
})();
