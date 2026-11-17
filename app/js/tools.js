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
    mix: "off",              // how a new stroke combines with paint under it: "off" | "light" | "pigment"
    oilLoad: 0.7, oilWet: 0.5, // oil brush: how far the paint lasts, how much it smears what it crosses
    // what the Slim Pen's flip-end eraser does: "eraser" | "strokeeraser"
    tailMode: localStorage.getItem("penshi-tail-mode") || "eraser",
  };

  /* Per-brush personalities */
  const BRUSHES = {
    ink:    { minW: 0.10, alphaP: false, spacing: 0.18 },  // crisp, whip-thin to fat
    pencil: { minW: 0.45, alphaP: true,  spacing: 0.30, baseAlpha: 0.55 },
    marker: { minW: 0.85, alphaP: false, spacing: 0.22, baseAlpha: 0.45 },
    eraser: { minW: 0.60, alphaP: false, spacing: 0.18 },
    oil:    { minW: 0.50, alphaP: false, spacing: 0.20 },  // bristles; painted by oilTo(), not stamped
  };

  /* ---------- scratch buffer ---------- */
  const scratch = document.createElement("canvas");
  const previewTint = document.createElement("canvas");  // tinted-layer preview pass
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


  /* ============================================================
     Oil brush
     A row of bristles, each carrying its own colour. Every bristle
     drags a line; as the paint runs out the weaker bristles stop
     and the stroke breaks into dry streaks. Bristles pick up the
     colour they pass over, so wet colours smear into each other.
     It paints straight onto the layer (it has to read what is
     under it), and everything random comes from a seed stored with
     the stroke, so a replay from the op log paints the same thing.
     ============================================================ */
  const rng = seed => () => { let t = seed += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const css = c => `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
  function oilStart(cfg) {
    const rnd = rng(cfg.seed | 0);
    const n = Math.max(5, Math.min(28, Math.round(cfg.size / 2.2)));
    const base = Mix.rgb(cfg.color);
    const bristles = Array.from({ length: n }, (_, j) => {
      const shade = 1 + (rnd() - 0.5) * 0.26;        // each bristle a touch lighter or darker: the streaks
      const own = base.map(v => Math.min(255, v * shade));
      return { off: (j / (n - 1)) * 2 - 1 + (rnd() - 0.5) * (1.2 / n), w: 0.6 + rnd() * 0.7, hold: 0.5 + rnd() * 0.5,
               own, col: own.slice(), pick: 0, x: 0, y: 0 };
    });
    return { rnd, bristles, n, dist: 0, since: 1e9, nx: 0, ny: 1, has: false, last: null };
  }
  /* paint from the last point to p = {x, y, k}; returns false if p was too close to act on */
  function oilTo(lctx, o, p, cfg) {
    const brush = BRUSHES.oil;
    if (!o.last) { o.last = p; return true; }
    const a = o.last, dx = p.x - a.x, dy = p.y - a.y, d = Math.hypot(dx, dy);
    if (d < 0.6) return false;
    let nx = -dy / d, ny = dx / d;
    const w = Math.min(cfg.size * 2 + 4, Math.max(1.5, widthFor(p.k, brush, cfg)));
    if (!o.has) {
      for (const b of o.bristles) { b.x = a.x + nx * b.off * w / 2; b.y = a.y + ny * b.off * w / 2; }
      o.has = true;
    } else {
      /* a flat brush keeps its sides when you scrub back and forth: never let
         the row of bristles flip over, or every bristle would cross the stroke */
      if (o.nx * nx + o.ny * ny < 0) { nx = -nx; ny = -ny; }
      nx = o.nx * 0.45 + nx * 0.55; ny = o.ny * 0.45 + ny * 0.55;   // ease the turn
      const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    }
    o.nx = nx; o.ny = ny; o.last = p;
    /* how much paint is left on the brush. A full load (100%) never runs out;
       below that the brush runs dry after roughly 3 + 40·load brush-widths,
       breaking into streaks from about halfway */
    o.dist += d;
    const left = cfg.load >= 0.99 ? 1 : Math.max(0, 1 - o.dist / (cfg.size * (3 + cfg.load * 40)));
    const strength = left * (0.55 + 0.45 * p.k);
    /* paint a bristle picks up is laid down again within a brush-width or two */
    const fade = Math.exp(-d / Math.max(4, w * 1.5));
    /* read what is under the brush, every third of a brush-width */
    let img = null, ox = 0, oy = 0, iw = 0;
    o.since += d;
    if (cfg.wet > 0 && o.since >= Math.max(2, w * 0.3)) {
      o.since = 0;
      const r = Math.ceil(w / 2) + 2; ox = Math.floor(p.x) - r; oy = Math.floor(p.y) - r; iw = 2 * r + 1;
      /* pixel reads ignore the context's transform; an off-page render of a
         lasso selection translates it, so read where the paint really is */
      const T = lctx.getTransform();
      img = lctx.getImageData(ox + Math.round(T.e), oy + Math.round(T.f), iw, iw).data;
    }
    const mode = cfg.mix || "off", opacity = cfg.opacity ?? 1;
    /* opaque paint: round ends close every joint. Thinned paint (opacity
       below 100%): square ends, so the ends of neighbouring segments don't
       overlap and darken into a row of beads */
    lctx.lineCap = opacity < 1 ? "butt" : "round";
    lctx.globalAlpha = opacity;
    for (const b of o.bristles) {
      const x = p.x + nx * b.off * w / 2, y = p.y + ny * b.off * w / 2;
      if (img) {
        const i = ((Math.floor(y) - oy) * iw + (Math.floor(x) - ox)) * 4, ua = img[i + 3];
        if (ua > 10) {
          b.col = Mix.mix(mode, b.col, [img[i], img[i + 1], img[i + 2]], cfg.wet * 0.55 * ua / 255);
          b.pick = Math.max(b.pick, cfg.wet * ua / 255);
        }
      }
      b.pick *= fade;
      /* fresh paint keeps feeding the bristle while there is any left */
      const feed = Math.min(1, 0.22 * left * d / Math.max(2, w * 0.3));
      if (feed > 0) for (let c = 0; c < 3; c++) b.col[c] += (b.own[c] - b.col[c]) * feed;
      /* a bristle draws while it carries paint: its own load, or wet paint it
         has picked up. Weak bristles (low hold) give out first: dry streaks.
         With nothing on it, it stops — a dry brush leaves no mark on bare canvas. */
      const amount = Math.max(strength, b.pick);
      /* running low shows as thinner bristles, not fainter ones (fainter
         segments would bead where their ends overlap) */
      if (amount > 0.06 + (1 - b.hold) * 0.9 + (o.rnd() - 0.5) * 0.1) {
        lctx.strokeStyle = css(b.col);
        lctx.lineWidth = Math.max(0.8, (w / o.n) * 1.75 * b.w * (0.45 + 0.55 * Math.min(1, amount * 1.5)));
        lctx.beginPath(); lctx.moveTo(b.x, b.y); lctx.lineTo(x, y); lctx.stroke();
      }
      b.x = x; b.y = y;
    }
    lctx.globalAlpha = 1;
    return true;
  }
  /* a tap with no travel: one round dab */
  function oilDab(lctx, p, cfg) {
    lctx.save(); lctx.globalAlpha = cfg.opacity ?? 1; lctx.fillStyle = cfg.color;
    lctx.beginPath(); lctx.arc(p.x, p.y, Math.max(1, widthFor(p.k, BRUSHES.oil, cfg) / 2), 0, Math.PI * 2); lctx.fill(); lctx.restore();
  }
  function oilReplay(lctx, op) {
    const o = oilStart(op.cfg);
    lctx.save();
    for (const p of op.points) oilTo(lctx, o, p, op.cfg);
    lctx.restore();
    if (!o.has) oilDab(lctx, op.points[0], op.cfg);
  }

  /* the page box a stroke can have touched */
  function strokeBox(points, size) {
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const p of points) { if (p.x < x0) x0 = p.x; if (p.x > x1) x1 = p.x; if (p.y < y0) y0 = p.y; if (p.y > y1) y1 = p.y; }
    const m = size * 2 + 6;
    return { x0: x0 - m, y0: y0 - m, x1: x1 + m, y1: y1 + m };
  }
  /* Committing a stroke: it is stamped again from its LOGGED points onto a
     software canvas and landed on the layer from there — the same steps a
     replay from the op log takes, so a rebuilt layer is pixel-identical to
     what was painted. Two reasons for the software canvas:
       · the live preview canvas is drawn by the graphics card, and copying a
         graphics-card canvas onto a layer quietly moves the LAYER onto the
         graphics card too, which smooths edges a little differently from then
         on (strokes painted before and after the move would no longer replay
         the same — and the oil brush and colour mixing read those pixels);
       · mixing reads the stroke's pixels back, which is cheap in software. */
  const stampCanvas = document.createElement("canvas");
  let stampCtx = null;
  const isMixed = op => op.cfg.mix === "light" || op.cfg.mix === "pigment";
  function commitStroke(lctx, op) {
    if (!stampCtx) stampCtx = stampCanvas.getContext("2d", { willReadFrequently: true });
    if (stampCanvas.width !== App.page.w || stampCanvas.height !== App.page.h) {
      stampCanvas.width = App.page.w; stampCanvas.height = App.page.h;
    }
    const b = strokeBox(op.points, op.cfg.size);   // holds every stamp of the stroke
    const x0 = Math.max(0, Math.floor(b.x0)), y0 = Math.max(0, Math.floor(b.y0));
    const x1 = Math.min(stampCanvas.width, Math.ceil(b.x1)), y1 = Math.min(stampCanvas.height, Math.ceil(b.y1));
    if (x1 <= x0 || y1 <= y0) return;               // entirely off the page
    replayStamps(stampCtx, op, BRUSHES[op.tool]);
    if (isMixed(op)) Mix.composite(lctx, stampCtx, op.alpha, op.cfg.mix, { x0, y0, x1, y1 });
    else {
      lctx.save(); lctx.globalAlpha = op.alpha;
      lctx.drawImage(stampCanvas, x0, y0, x1 - x0, y1 - y0, x0, y0, x1 - x0, y1 - y0);
      lctx.restore();
    }
    stampCtx.clearRect(x0, y0, x1 - x0, y1 - y0);
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
    if (state.mix !== "off" && !stroke.erase) stroke.cfg.mix = state.mix;
    stroke.oil = null;
    if (toolName === "oil") {
      Object.assign(stroke.cfg, { seed: (Math.random() * 2 ** 31) | 0, load: state.oilLoad, wet: state.oilWet, opacity: state.opacity });
      stroke.oil = oilStart(stroke.cfg);
    }
    const brush = BRUSHES[toolName];
    stroke.alpha = (brush.baseAlpha ?? 1) * state.opacity;
    resetScratch();
    const p = pointFrom(e);
    p.w = widthFor(p.pressure, brush, stroke.cfg);
    stroke.last = p;
    stroke.points = [{ x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10,
                       k: Math.round(p.pressure * 100) / 100 }];
    if (stroke.oil) {
      oilTo(layer.canvas.getContext("2d"), stroke.oil, stroke.points[0], stroke.cfg);   // just plants the brush
    } else if (stroke.erase) {
      // erase live, directly on the layer (destination-out), along the LOGGED
      // points — exactly what a replay erases, so a rebuild matches the page
      const lctx = layer.canvas.getContext("2d"), q = stroke.points[0];
      stroke.lastLogged = { x: q.x, y: q.y, w: widthFor(q.k, brush, stroke.cfg) };
      lctx.save(); lctx.globalCompositeOperation = "destination-out";
      stampSegment(lctx, stroke.lastLogged, stroke.lastLogged, brush, q.k, stroke.cfg);
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
    const lctx = (stroke.erase || stroke.oil) ? stroke.layer.canvas.getContext("2d") : sctx;
    if (stroke.erase) {
      lctx.save(); lctx.globalCompositeOperation = "destination-out";
    }
    if (stroke.oil) lctx.save();
    for (const ev of events) {
      const raw = pointFrom(ev);
      // exponential smoothing — steadies wobble, "stabilizer" in art apps
      const s = state.smoothing;
      const p = {
        x: stroke.last.x * s + raw.x * (1 - s),
        y: stroke.last.y * s + raw.y * (1 - s),
        pressure: raw.pressure,
      };
      const logged = { x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10,
                       k: Math.round(p.pressure * 100) / 100 };
      if (stroke.oil) {
        /* paint from the LOGGED point, so a replay retraces it exactly;
           a sample too close to act on is not logged at all */
        stroke.last = p;
        if (!oilTo(lctx, stroke.oil, logged, stroke.cfg)) continue;
        stroke.points.push(logged);
        continue;
      }
      if (stroke.erase) {                       // as in beginStroke: follow the log
        stroke.last = p;
        const cur = { x: logged.x, y: logged.y };
        cur.w = stampSegment(lctx, stroke.lastLogged, cur, brush, logged.k, stroke.cfg);
        stroke.lastLogged = cur;
        stroke.points.push(logged);
        continue;
      }
      p.w = stampSegment(lctx, stroke.last, p, brush, p.pressure, stroke.cfg);
      stroke.last = p;
      stroke.points.push(logged);
    }
    if (stroke.erase || stroke.oil) { lctx.restore(); stroke.layer._stamp = (stroke.layer._stamp || 0) + 1; }
    App.dirty = true;
  }

  function endStroke() {
    if (!stroke.active) return;
    const op = { kind: "stroke", tool: stroke.tool, erase: stroke.erase,
                 alpha: stroke.alpha, cfg: stroke.cfg, points: stroke.points };
    if (stroke.oil) {
      if (!stroke.oil.has) oilDab(stroke.layer.canvas.getContext("2d"), stroke.points[0], stroke.cfg);
      stroke.oil = null;
    } else if (!stroke.erase) {
      const lctx = stroke.layer.canvas.getContext("2d");
      resetScratch();                 // the live preview is done with
      commitStroke(lctx, op);         // exactly what a replay will paint
    }
    stroke.layer._stamp = (stroke.layer._stamp || 0) + 1;
    if (stroke.erase) {
      // an eraser pass may sever logged strokes into pieces — restructure
      // the log so each visual fragment becomes its own stroke, then
      // snapshot the whole ops array (many entries may have changed)
      const beforeOps = JSON.stringify(stroke.layer.ops);
      stroke.layer.ops.push(op);
      splitStrokesByEraser(stroke.layer, op);
      commitRasterOpsSnapshot(stroke.layer, stroke.before, beforeOps);
    } else {
      stroke.layer.ops.push(op);
      commitRasterChange(stroke.layer, stroke.before, { add: op });
      UI.noteColor(state.color);
    }
    stroke.active = false;
    App.dirty = true;
  }

  /* When the pixel eraser's path crosses a logged stroke's centerline, the
     stroke is visually cut — so cut it in the LOG too. Each surviving run
     of points becomes its own stroke op, meaning the stroke eraser and
     lasso treat the two halves as separate strokes from then on.
     Pixels don't change here (the erase already happened); this is pure
     bookkeeping so the log matches what's on the page. */
  function splitStrokesByEraser(layer, eraseOp) {
    const ePts = eraseOp.points;
    if (!ePts.length) return;
    const eBrush = BRUSHES.eraser;
    // eraser bounding box, inflated by its max radius, for a cheap precheck
    const eMaxR = eraseOp.cfg.size / 2 + 2;
    let ex0 = 1e9, ey0 = 1e9, ex1 = -1e9, ey1 = -1e9;
    for (const q of ePts) {
      ex0 = Math.min(ex0, q.x); ey0 = Math.min(ey0, q.y);
      ex1 = Math.max(ex1, q.x); ey1 = Math.max(ey1, q.y);
    }
    ex0 -= eMaxR; ey0 -= eMaxR; ex1 += eMaxR; ey1 += eMaxR;

    const out = [];
    for (const op of layer.ops) {
      /* Strokes that read the paint under them stay whole: an oil stroke's
         piece replayed alone would start with a fresh load of paint and
         different bristles, and a colour-mixed stroke's pieces would mix with
         each other where they meet — either way the replay would no longer
         match the page. The eraser op that follows still removes the same
         pixels on replay; the stroke eraser removes such a stroke whole. */
      if (op === eraseOp || op.kind !== "stroke" || op.erase || op.tool === "oil" || op.cfg.mix) { out.push(op); continue; }
      const oR = op.cfg.size / 2;
      if (!op.points.some(q => q.x >= ex0 - oR && q.x <= ex1 + oR &&
                                q.y >= ey0 - oR && q.y <= ey1 + oR)) {
        out.push(op); continue;
      }
      // a point is "cut" when the eraser's swept disc covers its centerline
      const cut = op.points.map(q => {
        if (ePts.length === 1) {
          const re = widthFor(ePts[0].k, eBrush, eraseOp.cfg) / 2;
          return Math.hypot(q.x - ePts[0].x, q.y - ePts[0].y) <= re;
        }
        for (let i = 1; i < ePts.length; i++) {
          const re = widthFor(Math.max(ePts[i - 1].k, ePts[i].k), eBrush, eraseOp.cfg) / 2;
          if (distSeg(q, ePts[i - 1], ePts[i]) <= re) return true;
        }
        return false;
      });
      if (!cut.some(v => v)) { out.push(op); continue; }
      // split into runs of surviving points; each run ≥2 points lives on
      let run = [];
      const flush = () => {
        if (run.length >= 2)
          out.push({ ...op, cfg: { ...op.cfg }, points: run });
        run = [];
      };
      op.points.forEach((q, i) => { if (!cut[i]) run.push(q); else flush(); });
      flush();
    }
    layer.ops = out;
  }

  /* live preview: engine calls this inside the page transform.
     Brush strokes, shape rubber-banding, lasso visuals, asset stamp. */
  function renderScratch(ctx) {
    const brushLive = stroke.active && !stroke.erase;
    const shapeLive = !!shapeStart &&
      ["line", "rect", "ellipse"].includes(state.current);
    if (brushLive || shapeLive) {
      // preview must look like the COMMITTED result: respect the target
      // layer's tint (non-photo-blue Pencils) and opacity, or the stroke
      // appears to change color the moment you lift the pen
      const layer = brushLive ? stroke.layer : activeLayer();
      const onRaster = layer && layer.kind === "raster";
      ctx.save();
      ctx.globalAlpha = (brushLive ? stroke.alpha : 1) *
                        (onRaster ? layer.opacity : 1);
      const fcss = onRaster ? filterCss(layer.filter) : "none";
      if (fcss !== "none") ctx.filter = fcss;   // same reason: match the committed look
      if (onRaster && layer.tint) {
        if (previewTint.width !== scratch.width || previewTint.height !== scratch.height) {
          previewTint.width = scratch.width; previewTint.height = scratch.height;
        }
        const tctx = previewTint.getContext("2d");
        tctx.clearRect(0, 0, previewTint.width, previewTint.height);
        tctx.drawImage(scratch, 0, 0);
        tctx.globalCompositeOperation = "source-in";
        tctx.fillStyle = layer.tint;
        tctx.fillRect(0, 0, previewTint.width, previewTint.height);
        tctx.globalCompositeOperation = "source-over";
        ctx.drawImage(previewTint, 0, 0);
      } else {
        ctx.drawImage(scratch, 0, 0);
      }
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
      const z = App.view.zoom;
      const dx = lassoMove ? lassoMove.dx : 0, dy = lassoMove ? lassoMove.dy : 0;
      ctx.save();

      // live ghost: the ACTUAL selected strokes drawn through the pending
      // move/stretch/rotate, so you see the art land before you commit
      if ((lassoMove || lassoXform) && lassoGhost) {
        ctx.save();
        ctx.globalAlpha = 0.55;
        if (lassoMove) {
          ctx.translate(dx, dy);
        } else if (lassoXform.mode === "rotate") {
          const c0 = lassoXform.center;
          ctx.translate(c0.x, c0.y);
          ctx.rotate(lassoXform.angle);
          ctx.translate(-c0.x, -c0.y);
        } else {
          const a0 = lassoXform.anchor;
          ctx.translate(a0.x, a0.y);
          ctx.scale(lassoXform.sx, lassoXform.sy);
          ctx.translate(-a0.x, -a0.y);
        }
        ctx.drawImage(lassoGhost, 0, 0);
        ctx.restore();
      }

      ctx.strokeStyle = "#e8b04b"; ctx.lineWidth = lw;
      ctx.setLineDash([8 / z, 6 / z]);
      if (lassoXform) {
        // frame outline: where the bbox lands if you release now
        const corners = [{ x: b.x, y: b.y }, { x: b.x + b.w, y: b.y },
                         { x: b.x + b.w, y: b.y + b.h }, { x: b.x, y: b.y + b.h }]
          .map(pt => xformPoint(lassoXform, pt));
        ctx.beginPath();
        ctx.moveTo(corners[0].x, corners[0].y);
        for (let i = 1; i < 4; i++) ctx.lineTo(corners[i].x, corners[i].y);
        ctx.closePath();
        ctx.stroke();
      } else {
        ctx.strokeRect(b.x + dx, b.y + dy, b.w, b.h);
        if (lassoMove) {
          /* strokes ghost above is the preview — no fill needed */
        } else {
          // 8 stretch handles + the rotation knob
          ctx.setLineDash([]);
          ctx.fillStyle = "#e8b04b";
          const hs = 7 / z;
          for (const h of lassoHandles())
            ctx.fillRect(h.x - hs / 2, h.y - hs / 2, hs, hs);
          const rh = rotHandlePos();
          ctx.beginPath();
          ctx.moveTo(b.x + b.w / 2, b.y);
          ctx.lineTo(rh.x, rh.y);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(rh.x, rh.y, 5.5 / z, 0, Math.PI * 2);
          ctx.fill();
        }
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
    else if (op.shape === "poly") {
      ctx2.moveTo(op.pts[0].x, op.pts[0].y);
      for (let i = 1; i < op.pts.length; i++) ctx2.lineTo(op.pts[i].x, op.pts[i].y);
      ctx2.closePath();
    }
    else ctx2.ellipse(op.cx, op.cy, op.rx, op.ry, op.rot || 0, 0, Math.PI * 2);
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
    if (op.shape === "poly")
      return op.pts.some((v, i) => distSeg(p, v, op.pts[(i + 1) % op.pts.length]) <= r);
    if (op.rx < 1 || op.ry < 1) return false;
    // rotated ellipses: test in the ellipse's own frame
    let px = p.x - op.cx, py = p.y - op.cy;
    if (op.rot) {
      const cos = Math.cos(-op.rot), sin = Math.sin(-op.rot);
      const rx2 = px * cos - py * sin, ry2 = px * sin + py * cos;
      px = rx2; py = ry2;
    }
    const v = Math.sqrt((px / op.rx) ** 2 + (py / op.ry) ** 2);
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
      if (op.tool === "oil") {
        oilReplay(lctx, op);
      } else if (op.erase) {
        lctx.save(); lctx.globalCompositeOperation = "destination-out";
        replayStamps(lctx, op, brush);
        lctx.restore();
      } else {
        commitStroke(lctx, op);
      }
    } else if (op.kind === "shape") {
      drawShapeOp(lctx, op);
    } else if (op.kind === "fill") {
      fillPixels(lctx.canvas, op.x, op.y, op.color);
    } else if (op.kind === "image") {
      const img = cachedImg(op.src);
      if (img.complete) {
        if (op.rot) {
          lctx.save();
          lctx.translate(op.x + op.w / 2, op.y + op.h / 2);
          lctx.rotate(op.rot);
          lctx.drawImage(img, -op.w / 2, -op.h / 2, op.w, op.h);
          lctx.restore();
        } else {
          lctx.drawImage(img, op.x, op.y, op.w, op.h);
        }
      }
    }
  }

  function rebuildLayer(layer) {
    const lctx = layer.canvas.getContext("2d");
    lctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
    if (layer.baseImg) {
      if (layer.baseImg.complete) {
        lctx.drawImage(layer.baseImg, 0, 0);
      } else {
        // base still decoding (e.g. right after a page switch): draw what we
        // can now, and re-run the rebuild the moment the base is ready
        layer.baseImg.addEventListener("load",
          () => { rebuildLayer(layer); App.dirty = true; }, { once: true });
      }
    }
    for (const op of layer.ops)
      if (op.kind === "image") cachedImg(op.src, layer);   // warm the cache
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
    if (!quiet) UI.flash("No stroke found here — flat pixels need the normal eraser. (⚙ Settings → stroke history keeps saved art stroke-editable.)");
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
  let lassoXform = null;  // { mode:"scale"|"rotate", ... } — handle drag in progress
  let lassoGhost = null;  // pre-rendered bitmap of the selected ops, for live preview
  let tailErase = false;  // pen tail held in stroke-eraser mode

  /* render the selected ops once at drag start; every preview frame then
     just draws this bitmap through the live transform — cheap and smooth */
  function buildLassoGhost() {
    const g = document.createElement("canvas");
    g.width = App.page.w; g.height = App.page.h;
    const gctx = g.getContext("2d");
    for (const i of lasso.indices) replayOp(gctx, lasso.layer.ops[i]);
    lassoGhost = g;
  }

  const rotPt = (pt, c, ang) => {
    const cos = Math.cos(ang), sin = Math.sin(ang);
    const dx = pt.x - c.x, dy = pt.y - c.y;
    return { x: c.x + dx * cos - dy * sin, y: c.y + dx * sin + dy * cos };
  };

  /* where a live handle-drag maps a page point */
  function xformPoint(t, pt) {
    if (t.mode === "rotate") return rotPt(pt, t.center, t.angle);
    return { x: t.anchor.x + (pt.x - t.anchor.x) * t.sx,
             y: t.anchor.y + (pt.y - t.anchor.y) * t.sy };
  }

  /* 8 scale handles on the bbox edge midpoints + corners */
  function lassoHandles() {
    const b = lasso.bbox, hs = [];
    for (const hy of [-1, 0, 1]) for (const hx of [-1, 0, 1]) {
      if (hx === 0 && hy === 0) continue;
      hs.push({ hx, hy, x: b.x + (hx + 1) / 2 * b.w, y: b.y + (hy + 1) / 2 * b.h });
    }
    return hs;
  }
  function rotHandlePos() {
    const b = lasso.bbox;
    return { x: b.x + b.w / 2, y: b.y - 30 / App.view.zoom };
  }

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
    if (op.kind === "image") {
      const c = [{ x: op.x, y: op.y }, { x: op.x + op.w, y: op.y },
                 { x: op.x, y: op.y + op.h }, { x: op.x + op.w, y: op.y + op.h }];
      if (!op.rot) return c;
      const ctr = { x: op.x + op.w / 2, y: op.y + op.h / 2 };
      return c.map(q => rotPt(q, ctr, op.rot));
    }
    if (op.shape === "line")
      return [{ x: op.x1, y: op.y1 }, { x: op.x2, y: op.y2 },
              { x: (op.x1 + op.x2) / 2, y: (op.y1 + op.y2) / 2 }];
    if (op.shape === "rect")
      return [{ x: op.x, y: op.y }, { x: op.x + op.w, y: op.y },
              { x: op.x, y: op.y + op.h }, { x: op.x + op.w, y: op.y + op.h }];
    if (op.shape === "poly") return op.pts;
    const ext = [{ x: op.cx - op.rx, y: op.cy }, { x: op.cx + op.rx, y: op.cy },
                 { x: op.cx, y: op.cy - op.ry }, { x: op.cx, y: op.cy + op.ry }];
    if (!op.rot) return ext;
    return ext.map(q => rotPt(q, { x: op.cx, y: op.cy }, op.rot));
  }

  function computeLassoBbox(layer, indices) {
    let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
    for (const i of indices) {
      const op = layer.ops[i];
      const r = op.kind === "stroke" ? op.cfg.size / 2 : (op.size || 0) / 2;
      for (const q of opTestPoints(op)) {
        minX = Math.min(minX, q.x - r); minY = Math.min(minY, q.y - r);
        maxX = Math.max(maxX, q.x + r); maxY = Math.max(maxY, q.y + r);
      }
    }
    return { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
  }

  function finishLasso(path) {
    const layer = activeLayer();
    if (layer.kind !== "raster") { UI.flash("Lasso works on raster layers — pick Inks/Pencils/Colors."); return; }
    const indices = [];
    layer.ops.forEach((op, i) => {
      if (op.kind === "fill") return;                 // fills aren't portable
      const pts = opTestPoints(op);
      const inside = pts.filter(q => pointInPoly(q, path)).length;
      if (inside / pts.length < 0.6) return;          // mostly inside = selected
      indices.push(i);
    });
    if (!indices.length) {
      lasso = null;
      UI.hideLassoActions();
      UI.flash("Nothing lassoed — circle strokes drawn this session on the active layer.");
      return;
    }
    lasso = { layer, indices, bbox: computeLassoBbox(layer, indices) };
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
    lassoGhost = null;   // ops changed — next drag re-renders it
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
    // A tracing reference is unlocked only while you are positioning it.
    if (lasso && lasso.layer.ref && !lasso.layer.locked) {
      lasso.layer.locked = true;
      UI.refreshLayers?.();
    }
    lasso = null; lassoDraw = null; lassoMove = null; lassoXform = null;
    lassoGhost = null;
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
    const name = await UI.prompt("Asset name (e.g. 'hero eyes', 'title logo'):", "my asset",
                                 { okLabel: "Save asset" });
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
    if (isPageLoading()) return;          // a page is still decoding its layers (see loadPage)
    try { view.setPointerCapture(e.pointerId); }
    catch { /* pen already out of range, or synthetic event */ }

    if (e.pointerType === "touch") {          // touch = navigate, never draw
      touches.set(e.pointerId, { x: e.clientX, y: e.clientY });
      tapTrack(e, "down");
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

    // an active lasso selection owns its handles/knob/box from ANY tool
    if (lasso && lassoGrab(p)) return;

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
      case "ink": case "pencil": case "marker": case "oil": case "eraser":
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

  /* try to grab the active selection at p: rotation knob, stretch handle,
     or inside-the-box move. Returns true if it started an interaction.
     Called from ANY tool — once a selection exists, its handles own the
     pointer, so you can't accidentally draw across your own selection. */
  function lassoGrab(p) {
    if (!lasso) return false;
    const grabR = 11 / App.view.zoom;
    const b = lasso.bbox;
    const rh = rotHandlePos();
    if (Math.hypot(p.x - rh.x, p.y - rh.y) < grabR) {
      const center = { x: b.x + b.w / 2, y: b.y + b.h / 2 };
      lassoXform = { mode: "rotate", center,
                     a0: Math.atan2(p.y - center.y, p.x - center.x), angle: 0 };
      buildLassoGhost();
      return true;
    }
    // nearest stretch handle — but when the pointer is INSIDE the box, the
    // handle only wins if it's closer than the box center. Otherwise thin
    // selections (a single horizontal stroke) become impossible to MOVE,
    // because the edge handles' grab radius blankets the whole interior.
    let best = null;
    for (const h of lassoHandles()) {
      const d = Math.hypot(p.x - h.x, p.y - h.y);
      if (d < grabR && (!best || d < best.d)) best = { h, d };
    }
    const inside = p.x >= b.x && p.x <= b.x + b.w &&
                   p.y >= b.y && p.y <= b.y + b.h;
    const centerDist = Math.hypot(p.x - (b.x + b.w / 2), p.y - (b.y + b.h / 2));
    if (best && (!inside || best.d < centerDist)) {
      const h = best.h;
      // anchor = the opposite corner/edge; it stays put while you pull
      const anchor = { x: b.x + (1 - h.hx) / 2 * b.w,
                       y: b.y + (1 - h.hy) / 2 * b.h };
      lassoXform = { mode: "scale", h, anchor, start: p, sx: 1, sy: 1 };
      buildLassoGhost();
      return true;
    }
    if (inside) {
      lassoMove = { start: p, dx: 0, dy: 0 };
      buildLassoGhost();
      return true;
    }
    return false;
  }

  /* lasso-tool click: grab the selection, or start a new polygon */
  function lassoDown(p) {
    if (lassoGrab(p)) return;
    lassoClear();
    lassoDraw = [p];
  }

  /* tap-to-select: pick the topmost logged stroke/shape/image under the
     point, searching visible unlocked raster layers top-down */
  function tapSelect(p) {
    const tol = 6 / App.view.zoom;
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
        lasso = { layer, indices: [i], bbox: computeLassoBbox(layer, [i]) };
        UI.showLassoActions(lasso.bbox, 1);
        App.dirty = true;
        return;
      }
    }
  }

  /* select specific ops on a layer programmatically (used right after an
     image import, so the new reference arrives with its handles showing) */
  function selectOps(layer, indices) {
    lassoClear();
    if (!indices.length) return;
    lasso = { layer, indices, bbox: computeLassoBbox(layer, indices) };
    UI.showLassoActions(lasso.bbox, indices.length);
    App.dirty = true;
  }

  /* mutate one op through the transform; may return a REPLACEMENT op
     (axis-aligned rects become 4-point polygons under rotation) */
  function transformOp(op, t, fn) {
    const rotate = t.mode === "rotate";
    const meanS = rotate ? 1 : (Math.abs(t.sx) + Math.abs(t.sy)) / 2;
    if (op.kind === "stroke") {
      for (const q of op.points) { const n = fn(q); q.x = n.x; q.y = n.y; }
      op.cfg.size = Math.max(0.5, op.cfg.size * meanS);
      return op;
    }
    if (op.kind === "image") {
      if (rotate) {
        const c = fn({ x: op.x + op.w / 2, y: op.y + op.h / 2 });
        op.x = c.x - op.w / 2; op.y = c.y - op.h / 2;
        op.rot = (op.rot || 0) + t.angle;
      } else {
        const a = fn({ x: op.x, y: op.y }), b = fn({ x: op.x + op.w, y: op.y + op.h });
        op.x = Math.min(a.x, b.x); op.y = Math.min(a.y, b.y);
        op.w = Math.abs(b.x - a.x); op.h = Math.abs(b.y - a.y);
      }
      return op;
    }
    op.size = Math.max(0.5, (op.size || 1) * meanS);
    if (op.shape === "line") {
      const a = fn({ x: op.x1, y: op.y1 }), b = fn({ x: op.x2, y: op.y2 });
      op.x1 = a.x; op.y1 = a.y; op.x2 = b.x; op.y2 = b.y;
      return op;
    }
    if (op.shape === "poly") {
      op.pts = op.pts.map(fn);
      return op;
    }
    if (op.shape === "rect") {
      if (rotate) {
        const c = [{ x: op.x, y: op.y }, { x: op.x + op.w, y: op.y },
                   { x: op.x + op.w, y: op.y + op.h }, { x: op.x, y: op.y + op.h }];
        return { kind: "shape", shape: "poly", size: op.size, color: op.color,
                 pts: c.map(fn) };
      }
      const a = fn({ x: op.x, y: op.y }), b = fn({ x: op.x + op.w, y: op.y + op.h });
      op.x = Math.min(a.x, b.x); op.y = Math.min(a.y, b.y);
      op.w = Math.abs(b.x - a.x); op.h = Math.abs(b.y - a.y);
      return op;
    }
    // ellipse
    const c = fn({ x: op.cx, y: op.cy });
    op.cx = c.x; op.cy = c.y;
    if (rotate) op.rot = (op.rot || 0) + t.angle;
    else { op.rx = Math.max(0.5, op.rx * Math.abs(t.sx));
           op.ry = Math.max(0.5, op.ry * Math.abs(t.sy)); }
    return op;
  }

  function applyLassoTransform(t) {
    const layer = lasso.layer;
    const before = snapshotRaster(layer);
    const beforeOps = JSON.stringify(layer.ops);
    const fn = pt => xformPoint(t, pt);
    for (const i of lasso.indices)
      layer.ops[i] = transformOp(layer.ops[i], t, fn);
    rebuildLayer(layer);
    commitRasterOpsSnapshot(layer, before, beforeOps);
    lasso.bbox = computeLassoBbox(layer, lasso.indices);
    lassoGhost = null;   // ops changed — next drag re-renders it
    UI.showLassoActions(lasso.bbox, lasso.indices.length);
    App.dirty = true;
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
    if (lassoXform) {
      const q = pointFrom(e);
      if (lassoXform.mode === "rotate") {
        let ang = Math.atan2(q.y - lassoXform.center.y, q.x - lassoXform.center.x)
                  - lassoXform.a0;
        if (e.shiftKey) ang = Math.round(ang / (Math.PI / 12)) * (Math.PI / 12);
        lassoXform.angle = ang;
      } else {
        const { h, anchor, start } = lassoXform;
        const dX = start.x - anchor.x, dY = start.y - anchor.y;
        let sx = (h.hx === 0 || Math.abs(dX) < 1) ? 1 : (q.x - anchor.x) / dX;
        let sy = (h.hy === 0 || Math.abs(dY) < 1) ? 1 : (q.y - anchor.y) / dY;
        sx = Math.max(0.05, sx); sy = Math.max(0.05, sy);   // no flips (yet)
        if (e.shiftKey && h.hx !== 0 && h.hy !== 0) sx = sy = (sx + sy) / 2;
        lassoXform.sx = sx; lassoXform.sy = sy;
      }
      App.dirty = true;
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

  /* Finger double-tap = a configurable shortcut (⚙ Settings). A tap is one
     finger, down and up within 280 ms without travelling; two taps within
     380 ms and 44 px of each other make a double-tap. A resting palm is a
     long contact, and a pinch is two fingers, so neither can trigger it. */
  const tap = { downT: 0, x: 0, y: 0, moved: false, multi: false, lastT: 0, lastX: 0, lastY: 0 };
  function tapTrack(e, phase) {
    if (phase === "down") {
      tap.multi = touches.size > 1;
      tap.downT = performance.now(); tap.x = e.clientX; tap.y = e.clientY; tap.moved = false;
      return;
    }
    if (phase === "move") {
      if (Math.hypot(e.clientX - tap.x, e.clientY - tap.y) > 14) tap.moved = true;
      return;
    }
    const now = performance.now();
    const isTap = !tap.multi && !tap.moved && now - tap.downT < 280;
    if (!isTap) { tap.lastT = 0; return; }
    if (now - tap.lastT < 380 && Math.hypot(e.clientX - tap.lastX, e.clientY - tap.lastY) < 44) {
      tap.lastT = 0;
      UI.doubleTap?.();
    } else {
      tap.lastT = now; tap.lastX = e.clientX; tap.lastY = e.clientY;
    }
  }

  function onUp(e) {
    if (e.pointerType === "touch") {
      touches.delete(e.pointerId);
      if (e.type === "pointerup") tapTrack(e, "up");
      return;
    }
    if (panGrab) { panGrab = null; return; }
    if (Guides.release()) return;
    if (tailErase) { tailErase = false; return; }
    if (stroke.active) { endStroke(); return; }
    if (lassoXform) {
      const t = lassoXform; lassoXform = null;
      const changed = t.mode === "rotate"
        ? Math.abs(t.angle) > 0.002
        : Math.abs(t.sx - 1) > 0.002 || Math.abs(t.sy - 1) > 0.002;
      if (changed) applyLassoTransform(t);
      App.dirty = true;
      return;
    }
    if (lassoDraw) {
      const path = lassoDraw; lassoDraw = null;
      // a tiny path is a TAP: select the single stroke under the pointer
      let spanX = 0, spanY = 0;
      for (const q of path) {
        spanX = Math.max(spanX, Math.abs(q.x - path[0].x));
        spanY = Math.max(spanY, Math.abs(q.y - path[0].y));
      }
      if (Math.max(spanX, spanY) < 8 / App.view.zoom) tapSelect(path[0]);
      else if (path.length >= 3) finishLasso(path);
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
    const op = lastShape; lastShape = null;
    /* draw the shape straight onto the layer, as a replay does (copying the
       preview canvas would move the layer onto the graphics card — see
       commitStroke) */
    const lctx = layer.canvas.getContext("2d");
    lctx.save(); drawShapeOp(lctx, op); lctx.restore();
    layer._stamp = (layer._stamp || 0) + 1;
    resetScratch();
    layer.ops.push(op);
    commitRasterChange(layer, before, { add: op });
    UI.noteColor(op.color);
    App.dirty = true;
  }

  /* touch navigation: 1 finger pans, 2 fingers pinch-zoom */
  function touchNav(e) {
    if (!touches.has(e.pointerId)) return;
    tapTrack(e, "move");
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

  /* Drop every piece of in-flight, page-specific interaction state.
     state.js calls this whenever the live page is rebuilt (page switch, new
     page, project open, entering/leaving a lesson): a lasso or a floating
     asset held across that boundary keeps pointing at the DISCARDED layer
     objects, so its edits land on art you can no longer see. */
  function resetTransient() {
    lassoClear();
    placing = null;
    stroke.active = false;
    shapeStart = null;
    lastShape = null;
    dragSel = null;
    panGrab = null;
    tailErase = false;
    touches.clear();
    if (App.page) resetScratch();
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

  return { state, bind, renderScratch, deleteSelection, resetTransient, selectOps,
           startPlacing, cancelPlacing, scalePlacing,
           lassoSaveAsset, lassoDelete, lassoClear,
           hasLasso: () => !!lasso,
           isPlacing: () => !!placing,
           setSpacePan(v) { spacePan = v; } };
})();
