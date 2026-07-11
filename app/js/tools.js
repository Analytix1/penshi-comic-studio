/* ============================================================
   tools.js — input pipeline & drawing tools
   Pointer Events give us everything the Surface Slim Pen 2
   reports: pressure (0..1), tiltX/tiltY, the barrel button and
   the tail eraser. getCoalescedEvents() recovers the full
   240Hz-ish sample stream so fast strokes stay smooth.

   Brush strokes are stamped onto a SCRATCH canvas at full page
   resolution, previewed live, then committed to the active layer
   in one composite on pointerup — so translucent tools (marker,
   pencil) never self-overlap into stripes mid-stroke.
   ============================================================ */
"use strict";

const Tools = (() => {
  const view = document.getElementById("view");

  const state = {
    current: "ink",
    size: 6, opacity: 1, smoothing: 0.4,
    pressureSize: true, pressureOpacity: false,
    color: "#1a1a1a",
    gutter: 14,
  };

  /* Per-brush personalities */
  const BRUSHES = {
    ink:    { minW: 0.10, alphaP: false, spacing: 0.18 },  // crisp, whip-thin to fat
    pencil: { minW: 0.45, alphaP: true,  spacing: 0.30, baseAlpha: 0.55 },
    marker: { minW: 0.85, alphaP: false, spacing: 0.22, baseAlpha: 0.45 },
    eraser: { minW: 0.60, alphaP: false, spacing: 0.18 },
  };

  /* ---------- scratch buffer ---------- */
  const scratch = document.createElement("canvas");
  let sctx = null;
  function resetScratch() {
    scratch.width = App.page.w; scratch.height = App.page.h;
    sctx = scratch.getContext("2d");
  }

  const stroke = {
    active: false, tool: null, layer: null, before: null,
    last: null,           // smoothed last point {x,y,w}
    alpha: 1, erase: false,
  };

  let shapeStart = null;      // for line/rect/ellipse/panel/balloons
  let panGrab = null;
  let dragSel = null;         // select-tool drag session
  const touches = new Map();  // active touch pointers for pan/pinch

  /* ============================================================
     Stroke mechanics
     ============================================================ */
  function pointFrom(e) {
    const r = view.getBoundingClientRect();
    const p = Engine.toPage(e.clientX - r.left, e.clientY - r.top);
    // Mice report pressure 0.5 while pressed; treat that as "full".
    const pressure = (e.pointerType === "pen") ? (e.pressure || 0) : 1;
    return { x: p.x, y: p.y, pressure };
  }

  function strokeWidth(pressure, brush) {
    const base = stroke.active ? stroke.size : state.size;
    if (!state.pressureSize) return base;
    return base * (brush.minW + (1 - brush.minW) * pressure);
  }

  function stampSegment(ctx2, a, b, brush, pressure) {
    // hard cap: a glitched pressure/coordinate sample must never be able
    // to stamp a page-sized blob
    const cap = (stroke.active ? stroke.size : state.size) * 2 + 4;
    const w = Math.min(cap, Math.max(0.4, strokeWidth(pressure, brush)));
    const alpha = (state.pressureOpacity || brush.alphaP)
      ? Math.min(1, 0.15 + 0.85 * pressure) : 1;
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const step = Math.max(0.75, w * brush.spacing);
    ctx2.fillStyle = state.color;
    ctx2.globalAlpha = alpha;
    for (let d = 0; d <= dist; d += step) {
      const t = dist === 0 ? 0 : d / dist;
      const wi = Math.min(cap, a.w + (w - a.w) * t);   // lerp width along segment
      ctx2.beginPath();
      ctx2.arc(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, wi / 2, 0, Math.PI * 2);
      ctx2.fill();
    }
    ctx2.globalAlpha = 1;
    return w;
  }

  function beginStroke(e, toolName, sizeOverride) {
    const layer = activeLayer();
    if (layer.kind !== "raster") {
      UI.flash("This layer holds objects — pick a raster layer (e.g. Inks) to draw.");
      return false;
    }
    if (layer.locked) { UI.flash("Layer is locked 🔒"); return false; }
    stroke.active = true;
    stroke.size = sizeOverride || state.size;
    stroke.tool = toolName;
    stroke.layer = layer;
    stroke.before = snapshotRaster(layer);
    stroke.erase = toolName === "eraser";
    const brush = BRUSHES[toolName];
    stroke.alpha = (brush.baseAlpha ?? 1) * state.opacity;
    resetScratch();
    const p = pointFrom(e);
    p.w = strokeWidth(p.pressure, brush);
    stroke.last = p;
    if (stroke.erase) {
      // erase live, directly on the layer (destination-out)
      const lctx = layer.canvas.getContext("2d");
      lctx.save(); lctx.globalCompositeOperation = "destination-out";
      stampSegment(lctx, p, p, brush, p.pressure);
      lctx.restore();
      layer._stamp = (layer._stamp || 0) + 1;
    } else {
      stampSegment(sctx, p, p, brush, p.pressure);
    }
    App.dirty = true;
    return true;
  }

  function moveStroke(e) {
    const brush = BRUSHES[stroke.tool];
    // coalesced samples give full stylus resolution; some browsers/events
    // return an empty list, so always fall back to the event itself
    const coalesced = e.getCoalescedEvents?.();
    const events = coalesced && coalesced.length ? coalesced : [e];
    const lctx = stroke.erase ? stroke.layer.canvas.getContext("2d") : sctx;
    if (stroke.erase) {
      lctx.save(); lctx.globalCompositeOperation = "destination-out";
    }
    for (const ev of events) {
      const raw = pointFrom(ev);
      // exponential smoothing — steadies wobble, "stabilizer" in art apps
      const s = state.smoothing;
      const p = {
        x: stroke.last.x * s + raw.x * (1 - s),
        y: stroke.last.y * s + raw.y * (1 - s),
        pressure: raw.pressure,
      };
      p.w = stampSegment(lctx, stroke.last, p, brush, p.pressure);
      stroke.last = p;
    }
    if (stroke.erase) { lctx.restore(); stroke.layer._stamp = (stroke.layer._stamp || 0) + 1; }
    App.dirty = true;
  }

  function endStroke() {
    if (!stroke.active) return;
    if (!stroke.erase) {
      const lctx = stroke.layer.canvas.getContext("2d");
      lctx.save();
      lctx.globalAlpha = stroke.alpha;
      lctx.drawImage(scratch, 0, 0);
      lctx.restore();
      resetScratch();
    }
    stroke.layer._stamp = (stroke.layer._stamp || 0) + 1;
    commitRasterChange(stroke.layer, stroke.before);
    if (!stroke.erase) UI.noteColor(state.color);
    stroke.active = false;
    App.dirty = true;
  }

  /* live preview: engine calls this inside the page transform.
     Covers both brush strokes and shape-tool rubber-banding. */
  function renderScratch(ctx) {
    const brushLive = stroke.active && !stroke.erase;
    const shapeLive = !!shapeStart &&
      ["line", "rect", "ellipse"].includes(state.current);
    if (!brushLive && !shapeLive) return;
    ctx.save(); ctx.globalAlpha = brushLive ? stroke.alpha : 1;
    ctx.drawImage(scratch, 0, 0);
    ctx.restore();
  }

  /* ============================================================
     Shape tools (line / rect / ellipse) — preview on scratch
     ============================================================ */
  function drawShapePreview(a, b, shiftKey) {
    resetScratch();
    sctx.strokeStyle = state.color;
    sctx.lineWidth = state.size;
    sctx.lineCap = "round";
    sctx.beginPath();
    if (state.current === "line") {
      let { x, y } = b;
      if (shiftKey) {   // snap to 15° increments — perspective-friendly
        const ang = Math.round(Math.atan2(y - a.y, x - a.x) / (Math.PI / 12)) * (Math.PI / 12);
        const d = Math.hypot(x - a.x, y - a.y);
        x = a.x + Math.cos(ang) * d; y = a.y + Math.sin(ang) * d;
      }
      sctx.moveTo(a.x, a.y); sctx.lineTo(x, y);
    } else {
      let w = b.x - a.x, h = b.y - a.y;
      if (shiftKey) { const m = Math.max(Math.abs(w), Math.abs(h)); w = Math.sign(w) * m; h = Math.sign(h) * m; }
      if (state.current === "rect") sctx.rect(a.x, a.y, w, h);
      else sctx.ellipse(a.x + w / 2, a.y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
    }
    sctx.stroke();
    App.dirty = true;
  }

  /* ============================================================
     Flood fill (scanline, tolerance)
     ============================================================ */
  function floodFill(px, py) {
    const layer = activeLayer();
    if (layer.kind !== "raster" || layer.locked) { UI.flash("Pick an unlocked raster layer to fill."); return; }
    const x0 = Math.floor(px), y0 = Math.floor(py);
    const { w, h } = App.page;
    if (x0 < 0 || y0 < 0 || x0 >= w || y0 >= h) return;
    const before = snapshotRaster(layer);
    const ctx2 = layer.canvas.getContext("2d");
    const img = ctx2.getImageData(0, 0, w, h);
    const d = img.data;
    const idx = (y0 * w + x0) * 4;
    const target = [d[idx], d[idx + 1], d[idx + 2], d[idx + 3]];
    const col = hexToRgb(state.color);
    const TOL = 48;
    if (Math.abs(target[0] - col.r) + Math.abs(target[1] - col.g) +
        Math.abs(target[2] - col.b) + Math.abs(target[3] - 255) === 0) return;
    const match = i =>
      Math.abs(d[i] - target[0]) <= TOL && Math.abs(d[i + 1] - target[1]) <= TOL &&
      Math.abs(d[i + 2] - target[2]) <= TOL && Math.abs(d[i + 3] - target[3]) <= TOL;
    const stack = [[x0, y0]];
    const seen = new Uint8Array(w * h);
    while (stack.length) {
      const [x, y] = stack.pop();
      let xl = x;
      while (xl >= 0 && !seen[y * w + xl] && match((y * w + xl) * 4)) xl--;
      let xr = x;
      while (xr < w && !seen[y * w + xr] && match((y * w + xr) * 4)) xr++;
      for (let xi = xl + 1; xi < xr; xi++) {
        const o = y * w + xi;
        seen[o] = 1;
        const i4 = o * 4;
        d[i4] = col.r; d[i4 + 1] = col.g; d[i4 + 2] = col.b; d[i4 + 3] = 255;
        if (y > 0 && !seen[o - w] && match((o - w) * 4)) stack.push([xi, y - 1]);
        if (y < h - 1 && !seen[o + w] && match((o + w) * 4)) stack.push([xi, y + 1]);
      }
    }
    ctx2.putImageData(img, 0, 0);
    layer._stamp = (layer._stamp || 0) + 1;
    commitRasterChange(layer, before);
    UI.noteColor(state.color);
    App.dirty = true;
  }
  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  /* ============================================================
     Select tool — move / resize / retail objects
     ============================================================ */
  function selectDown(p) {
    const hit = Lettering.hitTest(p) || Panels.hitTest(p);
    App.selection = hit;
    if (!hit) { App.dirty = true; return; }
    const layer = hit.layer;
    if (layer.locked) { UI.flash("Layer is locked 🔒"); return; }
    const b = hit.obj.type ? Lettering.bounds(hit.obj) : Panels.bounds(hit.obj);
    const hs = 10 / App.view.zoom;
    let mode = "move";
    if (hit.obj.tail &&
        Math.hypot(p.x - hit.obj.tail.x, p.y - hit.obj.tail.y) < hs) mode = "tail";
    else if (Math.abs(p.x - (b.x + b.w)) < hs && Math.abs(p.y - (b.y + b.h)) < hs) mode = "resize";
    dragSel = { mode, start: p, before: JSON.stringify(layer.objects),
                orig: JSON.parse(JSON.stringify(hit.obj)), layer };
    App.dirty = true;
  }
  function selectMove(p) {
    if (!dragSel || !App.selection) return;
    const o = App.selection.obj, g = dragSel.orig;
    const dx = p.x - dragSel.start.x, dy = p.y - dragSel.start.y;
    if (dragSel.mode === "tail") { o.tail.x = p.x; o.tail.y = p.y; }
    else if (dragSel.mode === "resize") {
      o.w = Math.max(30, g.w + dx); o.h = Math.max(24, g.h + dy);
    } else {
      o.x = g.x + dx; o.y = g.y + dy;
      if (o.tail) { o.tail.x = g.tail.x + dx; o.tail.y = g.tail.y + dy; }
    }
    App.dirty = true;
  }
  function selectUp() {
    if (!dragSel) return;
    if (JSON.stringify(dragSel.layer.objects) !== dragSel.before)
      commitObjectChange(dragSel.layer, dragSel.before);
    dragSel = null;
  }
  function deleteSelection() {
    const sel = App.selection;
    if (!sel || sel.layer.locked) return;
    const before = JSON.stringify(sel.layer.objects);
    sel.layer.objects = sel.layer.objects.filter(o => o !== sel.obj);
    commitObjectChange(sel.layer, before);
    App.selection = null;
    App.dirty = true;
  }

  /* ============================================================
     Pointer routing
     ============================================================ */
  let spacePan = false;   // main.js sets this while Space is held

  function onDown(e) {
    try { view.setPointerCapture(e.pointerId); }
    catch { /* pen already out of range, or synthetic event */ }

    if (e.pointerType === "touch") {          // touch = navigate, never draw
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      return;
    }
    if (App.penOnly && e.pointerType === "mouse") return;
    UI.penTelemetry(e);

    const r = view.getBoundingClientRect();
    const sx = e.clientX - r.left, sy = e.clientY - r.top;
    const p = Engine.toPage(sx, sy);

    // grab a perspective guide handle regardless of tool
    if (Guides.tryGrab(p)) return;

    if (spacePan || state.current === "pan" || e.buttons & 4) {   // middle button pans
      panGrab = { sx: e.clientX, sy: e.clientY,
                  panX: App.view.panX, panY: App.view.panY };
      return;
    }

    // Alt+click = eyedropper: sample the visible color under the cursor
    if (e.altKey && !["select", "pan"].includes(state.current)) {
      const hex = Engine.sampleColor(p.x, p.y);
      if (hex) UI.setColor(hex);
      return;
    }

    // Slim Pen 2: tail eraser reports button 32, barrel button reports 2 —
    // both flip to the eraser for the duration of the stroke. When that
    // happens mid-tool, use a chunky physical-eraser size instead of the
    // current brush's width.
    let tool = state.current;
    let sizeOverride = null;
    if (e.pointerType === "pen" && (e.buttons & 32 || e.buttons & 2)) {
      if (tool !== "eraser") sizeOverride = Math.max(26, state.size * 2);
      tool = "eraser";
    }

    switch (tool) {
      case "ink": case "pencil": case "marker": case "eraser":
        beginStroke(e, tool, sizeOverride); break;
      case "fill":
        floodFill(p.x, p.y); break;
      case "line": case "rect": case "ellipse":
        shapeStart = p; resetScratch(); break;
      case "panel":
        shapeStart = p; Panels.previewStart(p); break;
      case "balloon": case "thought": case "caption": case "burst":
        shapeStart = p; Lettering.previewStart(tool, p); break;
      case "select":
        selectDown(p); break;
    }
  }

  function onMove(e) {
    if (e.pointerType === "touch") { touchNav(e); return; }
    UI.penTelemetry(e);
    UI.cursorPos(e);

    if (panGrab) {
      App.view.panX = panGrab.panX + (e.clientX - panGrab.sx);
      App.view.panY = panGrab.panY + (e.clientY - panGrab.sy);
      App.dirty = true; return;
    }
    if (Guides.drag(pointFrom(e))) return;
    if (stroke.active) { moveStroke(e); return; }

    const p = pointFrom(e);
    if (shapeStart) {
      if (state.current === "panel") Panels.previewDrag(shapeStart, p, state.gutter);
      else if (["balloon", "thought", "caption", "burst"].includes(state.current))
        Lettering.previewDrag(shapeStart, p);
      else drawShapePreview(shapeStart, p, e.shiftKey);
      return;
    }
    if (state.current === "select") selectMove(p);
  }

  function onUp(e) {
    if (e.pointerType === "touch") { touches.delete(e.pointerId); return; }
    if (panGrab) { panGrab = null; return; }
    if (Guides.release()) return;
    if (stroke.active) { endStroke(); return; }

    if (shapeStart) {
      const p = pointFrom(e);
      if (state.current === "panel") Panels.commit(shapeStart, p);
      else if (["balloon", "thought", "caption", "burst"].includes(state.current))
        Lettering.commit(state.current, shapeStart, p);
      else stampShape();
      shapeStart = null;
      return;
    }
    if (state.current === "select") selectUp();
  }

  function stampShape() {
    const layer = activeLayer();
    if (layer.kind !== "raster" || layer.locked) { resetScratch(); App.dirty = true; return; }
    const before = snapshotRaster(layer);
    layer.canvas.getContext("2d").drawImage(scratch, 0, 0);
    layer._stamp = (layer._stamp || 0) + 1;
    resetScratch();
    commitRasterChange(layer, before);
    App.dirty = true;
  }

  /* touch navigation: 1 finger pans, 2 fingers pinch-zoom */
  function touchNav(e) {
    if (!touches.has(e.pointerId)) return;
    const prev = touches.get(e.pointerId);
    if (touches.size === 1) {
      App.view.panX += e.clientX - prev.x;
      App.view.panY += e.clientY - prev.y;
      App.dirty = true;
    } else if (touches.size === 2) {
      const pts = [...touches.entries()];
      const other = pts.find(([id]) => id !== e.pointerId)[1];
      const dPrev = Math.hypot(prev.x - other.x, prev.y - other.y);
      const dNow = Math.hypot(e.clientX - other.x, e.clientY - other.y);
      const r = view.getBoundingClientRect();
      Engine.zoomAt((e.clientX + other.x) / 2 - r.left,
                    (e.clientY + other.y) / 2 - r.top, dNow / Math.max(1, dPrev));
    }
    touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
  }

  function onWheel(e) {
    e.preventDefault();
    const r = view.getBoundingClientRect();
    Engine.zoomAt(e.clientX - r.left, e.clientY - r.top, e.deltaY < 0 ? 1.12 : 1 / 1.12);
  }

  function bind() {
    view.addEventListener("pointerdown", onDown);
    view.addEventListener("pointermove", onMove);
    view.addEventListener("pointerup", onUp);
    view.addEventListener("pointercancel", onUp);
    view.addEventListener("wheel", onWheel, { passive: false });
    view.addEventListener("contextmenu", e => e.preventDefault()); // barrel button ≠ menu
    // double-click / pen double-tap on text: edit it
    view.addEventListener("dblclick", e => {
      const r = view.getBoundingClientRect();
      const p = Engine.toPage(e.clientX - r.left, e.clientY - r.top);
      const hit = Lettering.hitTest(p);
      if (hit) Lettering.editText(hit);
    });
  }

  return { state, bind, renderScratch, deleteSelection,
           setSpacePan(v) { spacePan = v; } };
})();
