/* ============================================================
   engine.js — compositor & viewport
   Layers are painted at full page resolution on offscreen
   canvases; this file composites them onto the visible <canvas>
   through the zoom/pan transform, then draws non-printing
   overlays (print guides, composition guides, perspective grid,
   selection handles) on top. requestAnimationFrame + dirty flag.
   ============================================================ */
"use strict";

const Engine = (() => {
  const view = document.getElementById("view");
  const ctx = view.getContext("2d");
  let stageW = 0, stageH = 0;

  /* tint cache: recolor a raster layer (non-photo-blue pencils)
     without touching its real pixels */
  const tintCache = new Map();   // layer.id -> {canvas, stamp}

  function resize() {
    const r = view.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    stageW = r.width; stageH = r.height;
    view.width = Math.round(r.width * dpr);
    view.height = Math.round(r.height * dpr);
    // Pin the element's CSS size explicitly: an absolutely-positioned canvas
    // takes its INTRINSIC (bitmap) size, so on HiDPI screens (Windows display
    // scaling > 100%) it would render dpr× too large and every stroke would
    // appear offset down-right from the pen.
    view.style.width = r.width + "px";
    view.style.height = r.height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    App.dirty = true;
  }
  window.addEventListener("resize", resize);

  /* ---------- coordinate transforms ---------- */
  function toPage(sx, sy) {           // screen px -> page px
    const v = App.view;
    return { x: (sx - v.panX) / v.zoom, y: (sy - v.panY) / v.zoom };
  }
  function toScreen(px, py) {
    const v = App.view;
    return { x: px * v.zoom + v.panX, y: py * v.zoom + v.panY };
  }
  function fitPage() {
    const m = 40;
    const z = Math.min((stageW - m * 2) / App.page.w, (stageH - m * 2) / App.page.h);
    App.view.zoom = Math.max(0.05, Math.min(z, 4));
    App.view.panX = (stageW - App.page.w * App.view.zoom) / 2;
    App.view.panY = (stageH - App.page.h * App.view.zoom) / 2;
    App.dirty = true;
  }
  function zoomAt(sx, sy, factor) {
    const before = toPage(sx, sy);
    App.view.zoom = Math.min(8, Math.max(0.05, App.view.zoom * factor));
    App.view.panX = sx - before.x * App.view.zoom;
    App.view.panY = sy - before.y * App.view.zoom;
    App.dirty = true;
  }

  /* A raster layer as it should LOOK: its pixels, recolored by the tint
     (non-photo-blue pencils) and passed through its color filter. Baked
     once per change into a cached canvas, so compositing stays a plain
     drawImage however many filtered layers the page has. */
  function composited(layer) {
    const fcss = filterCss(layer.filter);
    if (!layer.tint && fcss === "none") return layer.canvas;
    const key = `${layer._stamp || 0}|${layer.tint || ""}|${fcss}`;
    let e = tintCache.get(layer.id);
    if (!e) {
      e = { canvas: document.createElement("canvas"), key: "" };
      tintCache.set(layer.id, e);
    }
    if (e.key !== key) {
      e.canvas.width = layer.canvas.width; e.canvas.height = layer.canvas.height;
      const tctx = e.canvas.getContext("2d");
      tctx.clearRect(0, 0, e.canvas.width, e.canvas.height);
      if (layer.tint) {
        tctx.drawImage(layer.canvas, 0, 0);
        tctx.globalCompositeOperation = "source-in";
        tctx.fillStyle = layer.tint;
        tctx.fillRect(0, 0, e.canvas.width, e.canvas.height);
        tctx.globalCompositeOperation = "source-over";
        if (fcss !== "none") {            // filter the tinted result in place
          const tmp = document.createElement("canvas");
          tmp.width = e.canvas.width; tmp.height = e.canvas.height;
          tmp.getContext("2d").drawImage(e.canvas, 0, 0);
          tctx.clearRect(0, 0, e.canvas.width, e.canvas.height);
          tctx.filter = fcss; tctx.drawImage(tmp, 0, 0); tctx.filter = "none";
        }
      } else {
        tctx.filter = fcss; tctx.drawImage(layer.canvas, 0, 0); tctx.filter = "none";
      }
      e.key = key;
    }
    return e.canvas;
  }

  /* Paint the layer stack bottom-to-top onto any context that is already in
     page space. One routine for the live view, exports, thumbnails and the
     eyedropper, so they can never disagree about what a page looks like.
     skipRefs: tracing references are a drafting aid and never print. */
  function paintLayers(c, opts = {}) {
    for (const layer of App.layers) {
      if (!layer.visible) continue;
      if (opts.skipRefs && layer.ref) continue;
      c.globalAlpha = layer.opacity;
      if (layer.kind === "raster") {
        c.drawImage(composited(layer), 0, 0);
      } else {
        const fcss = filterCss(layer.filter);
        if (fcss !== "none") c.filter = fcss;
        if (layer.role === "panels") Panels.render(c, layer);
        else if (layer.role === "lettering") Lettering.render(c, layer);
        if (fcss !== "none") c.filter = "none";
      }
      c.globalAlpha = 1;
    }
  }

  /* ---------- main composite ---------- */
  function render() {
    // Recover from layout changes the resize event doesn't catch: booting in
    // a background tab (stage measures 0×0), sidebar/devtools reflows, etc.
    const host = view.parentElement;
    if (host.clientWidth !== Math.round(stageW) || host.clientHeight !== Math.round(stageH)) {
      const wasZero = stageW < 2 || stageH < 2;
      resize();
      if (wasZero && stageW > 2) fitPage();   // first real layout: frame the page
    }
    if (App.dirty && App.page) {
      App.dirty = false;
      ctx.fillStyle = "#17181c";
      ctx.fillRect(0, 0, stageW, stageH);

      const v = App.view;
      ctx.save();
      ctx.translate(v.panX, v.panY);
      ctx.scale(v.zoom, v.zoom);

      // paper + drop shadow
      ctx.save();
      ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 24 / v.zoom;
      ctx.fillStyle = App.page.paper || "#ffffff";
      ctx.fillRect(0, 0, App.page.w, App.page.h);
      ctx.restore();

      paintLayers(ctx);

      // live stroke preview (scratch buffer from tools.js)
      Tools.renderScratch(ctx);

      // non-printing overlays
      Guides.render(ctx);
      if (typeof Learn !== "undefined") Learn.renderMarkers(ctx);   // lesson step pins
      renderSelection(ctx);

      ctx.restore();

      if (Settings.get("showLayerName")) renderLayerBadge();

      document.getElementById("zoom-hud").textContent =
        Math.round(v.zoom * 100) + "%";
    }
    requestAnimationFrame(render);
  }

  /* The active layer's name, pinned to the page's top-right corner (and
     kept on screen when that corner scrolls away). Screen space, so it is
     never part of the art and never exports. */
  function renderLayerBadge() {
    const layer = App.layers[App.activeLayer];
    if (!layer) return;
    const kind = layer.kind === "objects" ? layer.role
      : layer.ref ? "reference" : isGuideLayer(layer) ? "guide"
      : layer.tint ? "tinted" : "raster";
    const flags = (layer.locked ? " · locked" : "") + (layer.visible ? "" : " · hidden");
    const name = layer.name, sub = kind + flags;
    ctx.save();
    ctx.font = '600 12.5px "Segoe UI", system-ui, sans-serif';
    const wName = ctx.measureText(name).width;
    ctx.font = '11px "Segoe UI", system-ui, sans-serif';
    const wSub = ctx.measureText(sub).width;
    const padX = 9, gap = 8, h = 22, w = padX * 2 + wName + gap + wSub;
    const corner = toScreen(App.page.w, 0);
    const x = Math.max(8, Math.min(stageW - w - 8, corner.x - w));
    const y = Math.max(8, Math.min(stageH - h - 8, corner.y - h - 6));
    ctx.fillStyle = "rgba(30,31,36,.88)";
    ctx.strokeStyle = layer.locked || !layer.visible ? "rgba(224,96,96,.9)" : "rgba(232,176,75,.9)";
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.roundRect(x + .5, y + .5, w, h, 6); ctx.fill(); ctx.stroke();
    ctx.textBaseline = "middle"; ctx.textAlign = "left";
    ctx.font = '600 12.5px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = "#e8e6e0"; ctx.fillText(name, x + padX, y + h / 2 + 1);
    ctx.font = '11px "Segoe UI", system-ui, sans-serif';
    ctx.fillStyle = "#8b8d98"; ctx.fillText(sub, x + padX + wName + gap, y + h / 2 + 1);
    ctx.restore();
  }

  function renderSelection(ctx) {
    const sel = App.selection;
    if (!sel) return;
    const b = sel.obj.type ? Lettering.bounds(sel.obj) : Panels.bounds(sel.obj);
    if (!b) return;
    ctx.save();
    ctx.strokeStyle = "#6db3f2";
    ctx.lineWidth = 1.5 / App.view.zoom;
    ctx.setLineDash([6 / App.view.zoom, 4 / App.view.zoom]);
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    ctx.setLineDash([]);
    // corner handle (resize) bottom-right
    const hs = 8 / App.view.zoom;
    ctx.fillStyle = "#6db3f2";
    ctx.fillRect(b.x + b.w - hs / 2, b.y + b.h - hs / 2, hs, hs);
    // tail handle for balloons
    if (sel.obj.tail) {
      ctx.beginPath();
      ctx.arc(sel.obj.tail.x, sel.obj.tail.y, 6 / App.view.zoom, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  /* ---------- export ---------- */
  function exportPNG(includeBleed = true, suffix = "") {
    const out = document.createElement("canvas");
    const crop = includeBleed ? { x: 0, y: 0, w: App.page.w, h: App.page.h }
      : { x: App.page.bleed, y: App.page.bleed,
          w: App.page.w - 2 * App.page.bleed, h: App.page.h - 2 * App.page.bleed };
    out.width = crop.w; out.height = crop.h;
    const octx = out.getContext("2d");
    octx.fillStyle = App.page.paper || "#ffffff";
    octx.fillRect(0, 0, crop.w, crop.h);
    octx.translate(-crop.x, -crop.y);
    paintLayers(octx, { skipRefs: true });
    out.toBlob(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = App.projectName.replace(/\s+/g, "_") + suffix + ".png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }, "image/png");
  }

  /* small flattened snapshot of the live page (portfolio thumbnails) */
  function renderThumbnail(maxW = 260) {
    const s = Math.min(1, maxW / App.page.w);
    const t = document.createElement("canvas");
    t.width = Math.max(1, Math.round(App.page.w * s));
    t.height = Math.max(1, Math.round(App.page.h * s));
    const tctx = t.getContext("2d");
    tctx.fillStyle = App.page.paper || "#ffffff";
    tctx.fillRect(0, 0, t.width, t.height);
    tctx.scale(s, s);
    paintLayers(tctx);
    return t.toDataURL("image/jpeg", 0.72);
  }

  /* eyedropper: what color is actually visible at page pixel (px,py)?
     Composites all visible layers into a 1×1 readback, same order as export. */
  function sampleColor(px, py) {
    const x = Math.floor(px), y = Math.floor(py);
    if (x < 0 || y < 0 || x >= App.page.w || y >= App.page.h) return null;
    const c = document.createElement("canvas");
    c.width = 1; c.height = 1;
    const sctx = c.getContext("2d");
    sctx.translate(-x, -y);
    sctx.fillStyle = App.page.paper || "#ffffff";
    sctx.fillRect(x, y, 1, 1);
    paintLayers(sctx);
    const d = sctx.getImageData(0, 0, 1, 1).data;
    return "#" + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, "0")).join("");
  }

  /* Whole-view check filters (value check, color-blind previews). Applied
     to the canvas ELEMENT, so they cost nothing per frame and can never
     reach an export. */
  const VIEW_FILTERS = {
    none: ["Normal", "none"],
    grey: ["Greyscale — value check", "grayscale(1)"],
    greyhc: ["Greyscale, high contrast", "grayscale(1) contrast(1.6)"],
    invert: ["Inverted", "invert(1)"],
    deut: ["Color-blind: deuteranopia", "url(#vf-deut)"],
    prot: ["Color-blind: protanopia", "url(#vf-prot)"],
    trit: ["Color-blind: tritanopia", "url(#vf-trit)"],
  };
  function setViewFilter(key) {
    App.viewFilter = VIEW_FILTERS[key] ? key : "none";
    view.style.filter = VIEW_FILTERS[App.viewFilter][1];
    App.dirty = true;
  }

  return { resize, fitPage, toPage, toScreen, zoomAt, exportPNG, sampleColor,
           renderThumbnail, setViewFilter, VIEW_FILTERS,
           start() { resize(); fitPage(); render(); } };
})();
