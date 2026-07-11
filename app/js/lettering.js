/* ============================================================
   lettering.js — speech balloons, thought bubbles, captions, SFX
   Lettering objects are vectors on the "Lettering" object layer,
   re-rendered every frame, so text stays crisp at any zoom and
   editable forever. Each balloon owns a draggable TAIL that
   should point at the speaker's mouth — comics 101.
   ============================================================ */
"use strict";

const Lettering = (() => {
  let preview = null;

  const FONT = '"Comic Sans MS", "Segoe Print", cursive';

  function make(type, r) {
    return {
      type, x: r.x, y: r.y, w: r.w, h: r.h,
      text: type === "caption" ? "MEANWHILE..." :
            type === "burst" ? "WHAM!" : "YOUR LINE HERE",
      fontSize: Math.max(12, Math.round(App.page.dpi * (type === "burst" ? 0.28 : 0.12))),
      tail: (type === "balloon" || type === "thought")
        ? { x: r.x + r.w * 0.35, y: r.y + r.h + r.h * 0.55 } : null,
    };
  }

  /* ---------- geometry helpers ---------- */
  function center(o) { return { x: o.x + o.w / 2, y: o.y + o.h / 2 }; }

  /* ---------- rendering ---------- */
  function render(ctx, layer) {
    for (const o of layer.objects) drawObj(ctx, o);
    if (preview) { ctx.save(); ctx.globalAlpha = 0.55; drawObj(ctx, preview); ctx.restore(); }
  }

  function drawObj(ctx, o) {
    ctx.save();
    const lw = Math.max(1.5, App.page.dpi * 0.012);
    ctx.lineWidth = lw;
    ctx.strokeStyle = "#111"; ctx.fillStyle = "#fff";

    if (o.type === "balloon") {
      drawTail(ctx, o, false);
      ctx.beginPath();
      ctx.ellipse(o.x + o.w / 2, o.y + o.h / 2, o.w / 2, o.h / 2, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      // fill over the tail seam so tail + balloon read as one shape
      drawTail(ctx, o, true);
    } else if (o.type === "thought") {
      cloudPath(ctx, o); ctx.fill(); ctx.stroke();
      if (o.tail) thoughtDots(ctx, o);
    } else if (o.type === "caption") {
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.strokeRect(o.x, o.y, o.w, o.h);
    } else if (o.type === "burst") {
      burstPath(ctx, o); ctx.fill(); ctx.stroke();
    }
    drawText(ctx, o);
    ctx.restore();
  }

  function drawTail(ctx, o, fillOnly) {
    if (!o.tail) return;
    const c = center(o);
    const ang = Math.atan2(o.tail.y - c.y, o.tail.x - c.x);
    const spread = 0.22;                      // tail base width (radians)
    const rx = o.w / 2, ry = o.h / 2;
    const p1 = { x: c.x + Math.cos(ang - spread) * rx * 0.92,
                 y: c.y + Math.sin(ang - spread) * ry * 0.92 };
    const p2 = { x: c.x + Math.cos(ang + spread) * rx * 0.92,
                 y: c.y + Math.sin(ang + spread) * ry * 0.92 };
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    // slight curve gives the classic swept tail, not a straight dart
    ctx.quadraticCurveTo(
      (p1.x + o.tail.x) / 2 + (p2.x - p1.x) * 0.15,
      (p1.y + o.tail.y) / 2 + (p2.y - p1.y) * 0.15,
      o.tail.x, o.tail.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.closePath();
    if (fillOnly) { ctx.fill(); } else { ctx.fill(); ctx.stroke(); }
  }

  function thoughtDots(ctx, o) {
    const c = center(o);
    for (let i = 1; i <= 3; i++) {
      const t = i / 3.6;
      const x = c.x + (o.tail.x - c.x) * (0.62 + t * 0.38);
      const y = c.y + (o.tail.y - c.y) * (0.62 + t * 0.38);
      const r = Math.max(2, (o.w / 22) * (1 - t * 0.65));
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }
  }

  function cloudPath(ctx, o) {
    // scalloped ellipse: bumps along the perimeter
    const c = center(o);
    const bumps = Math.max(8, Math.round((o.w + o.h) / 60));
    ctx.beginPath();
    for (let i = 0; i <= bumps; i++) {
      const a0 = (i / bumps) * Math.PI * 2;
      const a1 = ((i + 0.5) / bumps) * Math.PI * 2;
      const x0 = c.x + Math.cos(a0) * o.w / 2, y0 = c.y + Math.sin(a0) * o.h / 2;
      const xm = c.x + Math.cos(a1) * o.w / 2 * 1.14, ym = c.y + Math.sin(a1) * o.h / 2 * 1.14;
      if (i === 0) ctx.moveTo(x0, y0);
      else ctx.quadraticCurveTo(
        c.x + Math.cos(a1 - Math.PI / bumps) * o.w / 2 * 1.14,
        c.y + Math.sin(a1 - Math.PI / bumps) * o.h / 2 * 1.14, x0, y0);
      if (i < bumps) ctx.quadraticCurveTo(xm, ym,
        c.x + Math.cos((i + 1) / bumps * Math.PI * 2) * o.w / 2,
        c.y + Math.sin((i + 1) / bumps * Math.PI * 2) * o.h / 2);
    }
    ctx.closePath();
  }

  function burstPath(ctx, o) {
    const c = center(o);
    const spikes = 12;
    ctx.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
      const f = i % 2 === 0 ? 1 : 0.62;
      // deterministic per-vertex jitter so the burst looks hand-cut
      const j = 1 + 0.12 * Math.sin(i * 2.7);
      const x = c.x + Math.cos(a) * (o.w / 2) * f * j;
      const y = c.y + Math.sin(a) * (o.h / 2) * f * j;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.closePath();
  }

  function drawText(ctx, o) {
    ctx.fillStyle = "#111";
    ctx.font = `${o.type === "burst" ? "bold " : ""}${o.fontSize}px ${FONT}`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    const c = center(o);
    const maxW = o.w * (o.type === "caption" ? 0.9 : 0.78);
    const lines = wrap(ctx, (o.text || "").toUpperCase(), maxW);
    const lh = o.fontSize * 1.18;
    const y0 = c.y - ((lines.length - 1) * lh) / 2;
    lines.forEach((ln, i) => ctx.fillText(ln, c.x, y0 + i * lh));
  }

  function wrap(ctx, text, maxW) {
    const out = [];
    for (const rawLine of text.split("\n")) {
      let line = "";
      for (const word of rawLine.split(/\s+/)) {
        const t = line ? line + " " + word : word;
        if (ctx.measureText(t).width > maxW && line) { out.push(line); line = word; }
        else line = t;
      }
      out.push(line);
    }
    return out;
  }

  /* ---------- drag-to-create ---------- */
  function norm(a, b) {
    return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y),
             w: Math.max(60, Math.abs(b.x - a.x)), h: Math.max(40, Math.abs(b.y - a.y)) };
  }
  function previewStart(type, p) { preview = make(type, { x: p.x, y: p.y, w: 60, h: 40 }); }
  function previewDrag(a, b) {
    const r = norm(a, b);
    Object.assign(preview, r);
    if (preview.tail) preview.tail = { x: r.x + r.w * 0.35, y: r.y + r.h + r.h * 0.55 };
    App.dirty = true;
  }
  function commit(type, a, b) {
    preview = null;
    const layer = layerByRole("lettering");
    const before = JSON.stringify(layer.objects);
    const obj = make(type, norm(a, b));
    layer.objects.push(obj);
    commitObjectChange(layer, before);
    App.selection = { layer, obj };
    App.dirty = true;
    editText({ layer, obj });     // straight into typing
  }

  /* ---------- hit testing ---------- */
  function hitTest(p) {
    const layer = layerByRole("lettering");
    if (!layer || !layer.visible) return null;
    for (let i = layer.objects.length - 1; i >= 0; i--) {
      const o = layer.objects[i];
      const pad = 6 / App.view.zoom;
      const inBox = p.x >= o.x - pad && p.x <= o.x + o.w + pad &&
                    p.y >= o.y - pad && p.y <= o.y + o.h + pad;
      const onTail = o.tail && Math.hypot(p.x - o.tail.x, p.y - o.tail.y) < 12 / App.view.zoom;
      if (inBox || onTail) return { layer, obj: o };
    }
    return null;
  }
  function bounds(o) { return { x: o.x, y: o.y, w: o.w, h: o.h }; }

  /* ---------- in-place text editing ---------- */
  function editText(hit) {
    const o = hit.obj;
    const ta = document.getElementById("text-editor");
    const tl = Engine.toScreen(o.x, o.y);
    const z = App.view.zoom;
    ta.style.display = "block";
    ta.style.left = tl.x + "px";
    ta.style.top = tl.y + "px";
    ta.style.width = o.w * z + "px";
    ta.style.height = o.h * z + "px";
    ta.style.fontSize = o.fontSize * z + "px";
    ta.value = o.text;
    ta.focus(); ta.select();
    const before = JSON.stringify(hit.layer.objects);
    const done = () => {
      ta.style.display = "none";
      ta.removeEventListener("blur", done);
      if (o.text !== ta.value) {
        o.text = ta.value;
        commitObjectChange(hit.layer, before);
      }
      App.dirty = true;
    };
    ta.addEventListener("blur", done);
    ta.onkeydown = e => { if (e.key === "Escape") ta.blur(); e.stopPropagation(); };
  }

  return { render, previewStart, previewDrag, commit,
           hitTest, bounds, editText };
})();
