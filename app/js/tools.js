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
    // what the Slim Pen's flip-end eraser does: "eraser" | "strokeeraser"
    tailMode: localStorage.getItem("inkwell-tail-mode") || "eraser",
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

  /* cfg carries everything a stamp needs, so strokes can be REPLAYED
     later from the op log with the exact settings they were drawn with */
  function widthFor(pressure, brush, cfg) {
    if (!cfg.pressureSize) return cfg.size;
    return cfg.size * (brush.minW + (1 - brush.minW) * pressure);
  }

  function stampSegment(ctx2, a, b, brush, pressure, cfg) {
    // hard cap: a glitched pressure/coordinate sample must never be able
    // to stamp a page-sized blob
    const cap = cfg.size * 2 + 4;
    const w = Math.min(cap, Math.max(0.4, widthFor(pressure, brush, cfg)));
    const alpha = (cfg.pressureOpacity || brush.alphaP)
      ? Math.min(1, 0.15 + 0.85 * pressure) : 1;
    const dist = Math.hypot(b.x - a.x, b.y - a.y);
    const step = Math.max(0.75, w * brush.spacing);
    ctx2.fillStyle = cfg.color;
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
    stroke.tool = toolName;
    stroke.layer = layer;
    stroke.before = snapshotRaster(layer);
    stroke.erase = toolName === "eraser";
    stroke.cfg = { size: sizeOverride || state.size, color: state.color,
                   pressureSize: state.pressureSize,
                   pressureOpacity: state.pressureOpacity };
    const brush = BRUSHES[toolName];
    stroke.alpha = (brush.baseAlpha ?? 1) * state.opacity;
    resetScratch();
    const p = pointFrom(e);
    p.w = widthFor(p.pressure, brush, stroke.cfg);
    stroke.last = p;
    stroke.points = [{ x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10,
                       k: Math.round(p.pressure * 100) / 100 }];
    if (stroke.erase) {
      // erase live, directly on the layer (destination-out)
      const lctx = layer.canvas.getContext("2d");
      lctx.save(); lctx.globalCompositeOperation = "destination-out";
      stampSegment(lctx, p, p, brush, p.pressure, stroke.cfg);
      lctx.restore();
      layer._stamp = (layer._stamp || 0) + 1;
    } else {
      stampSegment(sctx, p, p, brush, p.pressure, stroke.cfg);
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
      p.w = stampSegment(lctx, stroke.last, p, brush, p.pressure, stroke.cfg);
      stroke.last = p;
      stroke.points.push({ x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10,
                           k: Math.round(p.pressure * 100) / 100 });
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
    const op = { kind: "stroke", tool: stroke.tool, erase: stroke.erase,
                 alpha: stroke.alpha, cfg: stroke.cfg, points: stroke.points };
    stroke.layer.ops.push(op);
    commitRasterChange(stroke.layer, stroke.before, { add: op });
    if (!stroke.erase) UI.noteColor(state.color);
    stroke.active = false;
    App.dirty = true;
  }

  /* live preview: engine calls this inside the page transform.
     Brush strokes, shape rubber-banding, lasso visuals, asset stamp. */
  function renderScratch(ctx) {
    const brushLive = stroke.active && !stroke.erase;
    const shapeLive = !!shapeStart &&
      ["line", "rect", "ellipse"].includes(state.current);
    if (brushLive || shapeLive) {
      ctx.save(); ctx.globalAlpha = brushLive ? stroke.alpha : 1;
      ctx.drawImage(scratch, 0, 0);
      ctx.restore();
    }
    const lw = 1.5 / App.view.zoom;
    if (lassoDraw && lassoDraw.length > 1) {          // polygon in progress
      ctx.save();
      ctx.strokeStyle = "#e8b04b"; ctx.lineWidth = lw;
      ctx.setLineDash([6 / App.view.zoom, 5 / App.view.zoom]);
      ctx.beginPath();
      ctx.moveTo(lassoDraw[0].x, lassoDraw[0].y);
      for (const q of lassoDraw) ctx.lineTo(q.x, q.y);
      ctx.stroke();
      ctx.restore();
    }
    if (lasso) {                                       // committed selection box
      const b = lasso.bbox;
      const dx = lassoMove ? lassoMove.dx : 0, dy = lassoMove ? lassoMove.dy : 0;
      ctx.save();
      ctx.strokeStyle = "#e8b04b"; ctx.lineWidth = lw;
      ctx.setLineDash([8 / App.view.zoom, 6 / App.view.zoom]);
      ctx.strokeRect(b.x + dx, b.y + dy, b.w, b.h);
      if (lassoMove) {
        ctx.globalAlpha = 0.25;
        ctx.fillStyle = "#e8b04b";
        ctx.fillRect(b.x + dx, b.y + dy, b.w, b.h);
      }
      ctx.restore();
    }
    if (placing && placing.img.complete) {             // floating asset stamp
      const w = placing.w * placing.scale, h = placing.h * placing.scale;
      ctx.save();
      ctx.globalAlpha = 0.65;
      ctx.drawImage(placing.img, placing.pos.x - w / 2, placing.pos.y - h / 2, w, h);
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "#6db3f2"; ctx.lineWidth = lw;
      ctx.setLineDash([6 / App.view.zoom, 5 / App.view.zoom]);
      ctx.strokeRect(placing.pos.x - w / 2, placing.pos.y - h / 2, w, h);
      ctx.restore();
    }
  }

  /* ============================================================
     Shape tools (line / rect / ellipse) — preview on scratch
     ============================================================ */
  let lastShape = null;   // resolved geometry of the shape being previewed

  function drawShapeOp(ctx2, op) {
    ctx2.strokeStyle = op.color;
    ctx2.lineWidth = op.size;
    ctx2.lineCap = "round";
    ctx2.beginPath();
    if (op.shape === "line") { ctx2.moveTo(op.x1, op.y1); ctx2.lineTo(op.x2, op.y2); }
    else if (op.shape === "rect") ctx2.rect(op.x, op.y, op.w, op.h);
    else ctx2.ellipse(op.cx, op.cy, op.rx, op.ry, 0, 0, Math.PI * 2);
    ctx2.stroke();
  }

  function drawShapePreview(a, b, shiftKey) {
    resetScratch();
    const base = { kind: "shape", shape: state.current,
                   size: state.size, color: state.color };
    if (state.current === "line") {
      let { x, y } = b;
      if (shiftKey) {   // snap to 15° increments — perspective-friendly
        const ang = Math.round(Math.atan2(y - a.y, x - a.x) / (Math.PI / 12)) * (Math.PI / 12);
        const d = Math.hypot(x - a.x, y - a.y);
        x = a.x + Math.cos(ang) * d; y = a.y + Math.sin(ang) * d;
      }
      lastShape = { ...base, x1: a.x, y1: a.y, x2: x, y2: y };
    } else {
      let w = b.x - a.x, h = b.y - a.y;
      if (shiftKey) { const m = Math.max(Math.abs(w), Math.abs(h)); w = Math.sign(w) * m; h = Math.sign(h) * m; }
      lastShape = state.current === "rect"
        ? { ...base, x: a.x, y: a.y, w, h }
        : { ...base, cx: a.x + w / 2, cy: a.y + h / 2, rx: Math.abs(w / 2), ry: Math.abs(h / 2) };
    }
    drawShapeOp(sctx, lastShape);
    App.dirty = true;
  }

  /* ============================================================
     Flood fill (scanline, tolerance)
     ============================================================ */
  function floodFill(px, py) {
    const layer = activeLayer();
    if (layer.kind !== "raster" || layer.locked) { UI.flash("Pick an unlocked raster layer to fill."); return; }
    const x0 = Math.floor(px), y0 = Math.floor(py);
    if (x0 < 0 || y0 < 0 || x0 >= App.page.w || y0 >= App.page.h) return;
    const before = snapshotRaster(layer);
    if (!fillPixels(layer.canvas, x0, y0, state.color)) return;
    layer._stamp = (layer._stamp || 0) + 1;
    const op = { kind: "fill", x: x0, y: y0, color: state.color };
    layer.ops.push(op);
    commitRasterChange(layer, before, { add: op });
    UI.noteColor(state.color);
    App.dirty = true;
  }

  /* pure scanline fill on a canvas — shared by the live tool and op replay */
  function fillPixels(canvas, x0, y0, colorHex) {
    const w = canvas.width, h = canvas.height;
    const ctx2 = canvas.getContext("2d");
    const img = ctx2.getImageData(0, 0, w, h);
    const d = img.data;
    const idx = (y0 * w + x0) * 4;
    const target = [d[idx], d[idx + 1], d[idx + 2], d[idx + 3]];
    const col = hexToRgb(colorHex);
    const TOL = 48;
    if (Math.abs(target[0] - col.r) + Math.abs(target[1] - col.g) +
        Math.abs(target[2] - col.b) + Math.abs(target[3] - 255) === 0) return false;
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
    return true;
  }
  function hexToRgb(hex) {
    const n = parseInt(hex.slice(1), 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  }

  /* ============================================================
     Stroke eraser — remove a WHOLE stroke/shape in one tap.
     Powered by the per-layer op log: find the topmost op under the
     cursor, drop it, and rebuild the layer by replaying the rest
     over the layer's base pixels.
     ============================================================ */
  function distSeg(p, a, b) {
    const dx = b.x - a.x, dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    const t = len2 ? Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / len2)) : 0;
    return Math.hypot(p.x - (a.x + t * dx), p.y - (a.y + t * dy));
  }

  function hitStrokeOp(op, p, tol) {
    const r = op.cfg.size / 2 + tol;
    const pts = op.points;
    if (pts.length === 1) return Math.hypot(p.x - pts[0].x, p.y - pts[0].y) <= r;
    for (let i = 1; i < pts.length; i++)
      if (distSeg(p, pts[i - 1], pts[i]) <= r) return true;
    return false;
  }

  function hitShapeOp(op, p, tol) {
    const r = op.size / 2 + tol;
    if (op.shape === "line")
      return distSeg(p, { x: op.x1, y: op.y1 }, { x: op.x2, y: op.y2 }) <= r;
    if (op.shape === "rect") {
      const c = [{ x: op.x, y: op.y }, { x: op.x + op.w, y: op.y },
                 { x: op.x + op.w, y: op.y + op.h }, { x: op.x, y: op.y + op.h }];
      return c.some((v, i) => distSeg(p, v, c[(i + 1) % 4]) <= r);
    }
    if (op.rx < 1 || op.ry < 1) return false;
    const v = Math.sqrt(((p.x - op.cx) / op.rx) ** 2 + ((p.y - op.cy) / op.ry) ** 2);
    return Math.abs(v - 1) * Math.min(op.rx, op.ry) <= r;
  }

  function replayStamps(ctx2, op, brush) {
    const pts = op.points;
    let prev = { x: pts[0].x, y: pts[0].y,
                 w: widthFor(pts[0].k, brush, op.cfg) };
    stampSegment(ctx2, prev, prev, brush, pts[0].k, op.cfg);
    for (let i = 1; i < pts.length; i++) {
      const cur = { x: pts[i].x, y: pts[i].y };
      cur.w = stampSegment(ctx2, prev, cur, brush, pts[i].k, op.cfg);
      prev = cur;
    }
  }

  function replayOp(lctx, op) {
    if (op.kind === "stroke") {
      const brush = BRUSHES[op.tool];
      if (op.erase) {
        lctx.save(); lctx.globalCompositeOperation = "destination-out";
        replayStamps(lctx, op, brush);
        lctx.restore();
      } else {
        resetScratch();
        replayStamps(sctx, op, brush);
        lctx.save(); lctx.globalAlpha = op.alpha;
        lctx.drawImage(scratch, 0, 0);
        lctx.restore();
        resetScratch();
      }
    } else if (op.kind === "shape") {
      drawShapeOp(lctx, op);
    } else if (op.kind === "fill") {
      fillPixels(lctx.canvas, op.x, op.y, op.color);
    } else if (op.kind === "image") {
      const img = cachedImg(op.src);
      if (img.complete) lctx.drawImage(img, op.x, op.y, op.w, op.h);
    }
  }

  function rebuildLayer(layer) {
    const lctx = layer.canvas.getContext("2d");
    lctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
    if (layer.baseImg && layer.baseImg.complete) lctx.drawImage(layer.baseImg, 0, 0);
    for (const op of layer.ops) replayOp(lctx, op);
    layer._stamp = (layer._stamp || 0) + 1;
  }

  function strokeEraseAt(p, quiet) {
    const tol = 6 / App.view.zoom;
    // search visible, unlocked raster layers from the top down
    for (let li = App.layers.length - 1; li >= 0; li--) {
      const layer = App.layers[li];
      if (layer.kind !== "raster" || !layer.visible || layer.locked) continue;
      for (let i = layer.ops.length - 1; i >= 0; i--) {
        const op = layer.ops[i];
        const hit = (op.kind === "stroke" && !op.erase && hitStrokeOp(op, p, tol)) ||
                    (op.kind === "shape" && hitShapeOp(op, p, tol)) ||
                    (op.kind === "image" && p.x >= op.x && p.x <= op.x + op.w &&
                     p.y >= op.y && p.y <= op.y + op.h);
        if (!hit) continue;
        const before = snapshotRaster(layer);
        layer.ops.splice(i, 1);
        rebuildLayer(layer);
        commitRasterChange(layer, before, { remove: { op, index: i } });
        App.dirty = true;
        return true;
      }
    }
    if (!quiet) UI.flash("No stroke here — only strokes drawn this session can be stroke-erased.");
    return false;
  }

  /* ============================================================
     Lasso select — circle a group of strokes/shapes to grab them
     as ONE selection: drag inside the box to move, Delete to
     remove, or "Save asset" to capture into the asset library.
     Works on the ACTIVE raster layer's op log.
     ============================================================ */
  let lasso = null;       // { layer, indices, bbox, path } — committed selection
  let lassoDraw = null;   // in-progress polygon
  let lassoMove = null;   // { start, dx, dy } — dragging the selection
  let tailErase = false;  // pen tail held in stroke-eraser mode

  function pointInPoly(p, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a.y > p.y) !== (b.y > p.y) &&
          p.x < ((b.x - a.x) * (p.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  }

  function opTestPoints(op) {
    if (op.kind === "stroke") return op.points;
    if (op.kind === "image")
      return [{ x: op.x, y: op.y }, { x: op.x + op.w, y: op.y },
              { x: op.x, y: op.y + op.h }, { x: op.x + op.w, y: op.y + op.h }];
    if (op.shape === "line")
      return [{ x: op.x1, y: op.y1 }, { x: op.x2, y: op.y2 },
              { x: (op.x1 + op.x2) / 2, y: (op.y1 + op.y2) / 2 }];
    if (op.shape === "rect")
      return [{ x: op.x, y: op.y }, { x: op.x + op.w, y: op.y },
              { x: op.x, y: op.y + op.h }, { x: op.x + op.w, y: op.y + op.h }];
    return [{ x: op.cx - op.rx, y: op.cy }, { x: op.cx + op.rx, y: op.cy },
            { x: op.cx, y: op.cy - op.ry }, { x: op.cx, y: op.cy + op.ry }];
  }

  function finishLasso(path) {
    const layer = activeLayer();
    if (layer.kind !== "raster") { UI.flash("Lasso works on raster layers — pick Inks/Pencils/Colors."); return; }
    const indices = [];
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    layer.ops.forEach((op, i) => {
      if (op.kind === "fill") return;                 // fills aren't portable
      const pts = opTestPoints(op);
      const inside = pts.filter(q => pointInPoly(q, path)).length;
      if (inside / pts.length < 0.6) return;          // mostly inside = selected
      indices.push(i);
      for (const q of pts) {
        const r = op.kind === "stroke" ? op.cfg.size / 2 : (op.size || 0) / 2;
        minX = Math.min(minX, q.x - r); minY = Math.min(minY, q.y - r);
        maxX = Math.max(maxX, q.x + r); maxY = Math.max(maxY, q.y + r);
      }
    });
    if (!indices.length) {
      lasso = null;
      UI.hideLassoActions();
      UI.flash("Nothing lassoed — circle strokes drawn this session on the active layer.");
      return;
    }
    lasso = { layer, indices,
              bbox: { x: minX, y: minY, w: maxX - minX, h: maxY - minY } };
    UI.showLassoActions(lasso.bbox, indices.length);
    App.dirty = true;
  }

  function translateOp(op, dx, dy) {
    if (op.kind === "stroke") for (const q of op.points) { q.x += dx; q.y += dy; }
    else if (op.kind === "image") { op.x += dx; op.y += dy; }
    else if (op.shape === "line") { op.x1 += dx; op.y1 += dy; op.x2 += dx; op.y2 += dy; }
    else if (op.shape === "rect") { op.x += dx; op.y += dy; }
    else { op.cx += dx; op.cy += dy; }
  }

  function applyLassoMove(dx, dy) {
    const layer = lasso.layer;
    const before = snapshotRaster(layer);
    const beforeOps = JSON.stringify(layer.ops);
    for (const i of lasso.indices) translateOp(layer.ops[i], dx, dy);
    rebuildLayer(layer);
    commitRasterOpsSnapshot(layer, before, beforeOps);
    lasso.bbox.x += dx; lasso.bbox.y += dy;
    UI.showLassoActions(lasso.bbox, lasso.indices.length);
    App.dirty = true;
  }

  function lassoDelete() {
    if (!lasso) return;
    const layer = lasso.layer;
    const before = snapshotRaster(layer);
    const beforeOps = JSON.stringify(layer.ops);
    layer.ops = layer.ops.filter((_, i) => !lasso.indices.includes(i));
    rebuildLayer(layer);
    commitRasterOpsSnapshot(layer, before, beforeOps);
    lassoClear();
  }

  function lassoClear() {
    lasso = null; lassoDraw = null; lassoMove = null;
    UI.hideLassoActions();
    App.dirty = true;
  }

  /* render the selection to a tight cropped canvas (the asset bitmap) */
  function renderLassoToCanvas() {
    const pad = 6;
    const b = lasso.bbox;
    const out = document.createElement("canvas");
    out.width = Math.max(1, Math.ceil(b.w + pad * 2));
    out.height = Math.max(1, Math.ceil(b.h + pad * 2));
    const octx = out.getContext("2d");
    octx.translate(-Math.floor(b.x - pad), -Math.floor(b.y - pad));
    for (const i of lasso.indices) replayOp(octx, lasso.layer.ops[i]);
    return out;
  }

  async function lassoSaveAsset() {
    if (!lasso) return;
    const name = prompt("Asset name (e.g. 'hero eyes', 'title logo'):", "my asset");
    if (!name) return;
    const c = renderLassoToCanvas();
    try {
      const res = await fetch("/api/assets", {
        method: "POST",
        body: JSON.stringify({ name: name.trim(), png: c.toDataURL("image/png"),
                               w: c.width, h: c.height }),
      });
      const out = await res.json();
      UI.flash(out.ok ? `Saved asset "${name.trim()}" 📦 — find it in Library` : "Save failed");
      UI.refreshLibrary?.();
    } catch { UI.flash("Asset save failed — is server.py running?"); }
  }

  /* ============================================================
     Asset placement — a stamp that follows the pointer until you
     click to commit it onto the active raster layer as an image op.
     [ and ] resize it, Esc cancels.
     ============================================================ */
  let placing = null;     // { img, w, h, scale, pos }
  const imgCache = new Map();   // src -> Image (image-op replay)
  function cachedImg(src, layer) {
    let img = imgCache.get(src);
    if (!img) {
      img = new Image();
      img.onload = () => { if (layer) rebuildLayer(layer); App.dirty = true; };
      img.src = src;
      imgCache.set(src, img);
    }
    return img;
  }

  function startPlacing(src, w, h) {
    const img = cachedImg(src);
    placing = { src, img, w, h, scale: 1,
                pos: Engine.toPage(0, 0) };
    UI.flash("Click to stamp the asset · [ ] resize · Esc cancel");
    App.dirty = true;
  }
  function cancelPlacing() { placing = null; App.dirty = true; }
  function scalePlacing(f) {
    if (!placing) return false;
    placing.scale = Math.min(6, Math.max(0.1, placing.scale * f));
    App.dirty = true;
    return true;
  }
  async function commitPlacement(p) {
    const layer = activeLayer();
    if (layer.kind !== "raster" || layer.locked) { UI.flash("Pick an unlocked raster layer first."); return; }
    const img = placing.img;
    const w = placing.w * placing.scale, h = placing.h * placing.scale;
    const op = { kind: "image", src: placing.src,
                 x: p.x - w / 2, y: p.y - h / 2, w, h };
    placing = null;
    // drawImage silently no-ops on an image that hasn't finished decoding —
    // wait for it, or a large asset stamps nothing on a fast click
    try { await img.decode(); } catch { /* decode() unsupported -> best effort */ }
    const before = snapshotRaster(layer);
    layer.canvas.getContext("2d").drawImage(img, op.x, op.y, w, h);
    layer._stamp = (layer._stamp || 0) + 1;
    layer.ops.push(op);
    commitRasterChange(layer, before, { add: op });
    App.dirty = true;
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

    if (placing) { commitPlacement(p); return; }   // stamp the floating asset

    // Alt+click = eyedropper: sample the visible color under the cursor
    if (e.altKey && !["select", "pan"].includes(state.current)) {
      const hex = Engine.sampleColor(p.x, p.y);
      if (hex) UI.setColor(hex);
      return;
    }

    // Slim Pen 2 hardware mapping:
    //   barrel (side) button, bit 2  -> lasso gesture
    //   tail eraser, bit 32          -> pixel eraser OR stroke eraser,
    //                                   per the "Tail" toggle in the top bar
    let tool = state.current;
    let sizeOverride = null;
    if (e.pointerType === "pen" && e.buttons & 2) {
      lassoDown(p);
      return;
    }
    if (e.pointerType === "pen" && e.buttons & 32) {
      if (state.tailMode === "strokeeraser") {
        tailErase = true;
        strokeEraseAt(p, false);
        return;
      }
      if (tool !== "eraser") sizeOverride = Math.max(26, state.size * 2);
      tool = "eraser";
    }

    switch (tool) {
      case "ink": case "pencil": case "marker": case "eraser":
        beginStroke(e, tool, sizeOverride); break;
      case "fill":
        floodFill(p.x, p.y); break;
      case "strokeeraser":
        strokeEraseAt(p, false); break;
      case "line": case "rect": case "ellipse":
        shapeStart = p; resetScratch(); break;
      case "panel":
        shapeStart = p; Panels.previewStart(p); break;
      case "balloon": case "thought": case "caption": case "burst":
        shapeStart = p; Lettering.previewStart(tool, p); break;
      case "select":
        selectDown(p); break;
      case "lasso":
        lassoDown(p);
        break;
    }
  }

  /* start a lasso gesture: inside an existing selection = move it,
     anywhere else = begin a new polygon */
  function lassoDown(p) {
    if (lasso && p.x >= lasso.bbox.x && p.x <= lasso.bbox.x + lasso.bbox.w &&
        p.y >= lasso.bbox.y && p.y <= lasso.bbox.y + lasso.bbox.h) {
      lassoMove = { start: p, dx: 0, dy: 0 };
    } else {
      lassoClear();
      lassoDraw = [p];
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
    if (placing) { placing.pos = pointFrom(e); App.dirty = true; return; }
    if (tailErase || (state.current === "strokeeraser" && (e.buttons & 1))) {
      strokeEraseAt(pointFrom(e), true);   // swipe across strokes to clear them
      return;
    }
    if (lassoDraw) {
      const q = pointFrom(e);
      const last = lassoDraw[lassoDraw.length - 1];
      if (Math.hypot(q.x - last.x, q.y - last.y) > 3 / App.view.zoom) lassoDraw.push(q);
      App.dirty = true;
      return;
    }
    if (lassoMove) {
      const q = pointFrom(e);
      lassoMove.dx = q.x - lassoMove.start.x;
      lassoMove.dy = q.y - lassoMove.start.y;
      App.dirty = true;
      return;
    }

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
    if (tailErase) { tailErase = false; return; }
    if (stroke.active) { endStroke(); return; }
    if (lassoDraw) {
      const path = lassoDraw; lassoDraw = null;
      if (path.length >= 3) finishLasso(path);
      App.dirty = true;
      return;
    }
    if (lassoMove) {
      const { dx, dy } = lassoMove; lassoMove = null;
      if (Math.hypot(dx, dy) > 1) applyLassoMove(dx, dy);
      App.dirty = true;
      return;
    }

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
    if (layer.kind !== "raster" || layer.locked || !lastShape) {
      resetScratch(); lastShape = null; App.dirty = true; return;
    }
    const before = snapshotRaster(layer);
    layer.canvas.getContext("2d").drawImage(scratch, 0, 0);
    layer._stamp = (layer._stamp || 0) + 1;
    resetScratch();
    const op = lastShape; lastShape = null;
    layer.ops.push(op);
    commitRasterChange(layer, before, { add: op });
    UI.noteColor(op.color);
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
           startPlacing, cancelPlacing, scalePlacing,
           lassoSaveAsset, lassoDelete, lassoClear,
           hasLasso: () => !!lasso,
           isPlacing: () => !!placing,
           setSpacePan(v) { spacePan = v; } };
})();
