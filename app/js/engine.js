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

  function tinted(layer) {
    let e = tintCache.get(layer.id);
    if (!e) {
      e = { canvas: document.createElement("canvas"), stamp: -1 };
      tintCache.set(layer.id, e);
    }
    if (e.stamp !== layer._stamp) {
      e.canvas.width = layer.canvas.width; e.canvas.height = layer.canvas.height;
      const tctx = e.canvas.getContext("2d");
      tctx.clearRect(0, 0, e.canvas.width, e.canvas.height);
      tctx.drawImage(layer.canvas, 0, 0);
      tctx.globalCompositeOperation = "source-in";
      tctx.fillStyle = layer.tint;
      tctx.fillRect(0, 0, e.canvas.width, e.canvas.height);
      e.stamp = layer._stamp;
    }
    return e.canvas;
  }

  /* ---------- main composite ---------- */
  function render() {
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
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, App.page.w, App.page.h);
      ctx.restore();

      for (const layer of App.layers) {
        if (!layer.visible) continue;
        ctx.globalAlpha = layer.opacity;
        if (layer.kind === "raster") {
          ctx.drawImage(layer.tint ? tinted(layer) : layer.canvas, 0, 0);
        } else if (layer.role === "panels") {
          Panels.render(ctx, layer);
        } else if (layer.role === "lettering") {
          Lettering.render(ctx, layer);
        }
        ctx.globalAlpha = 1;
      }

      // live stroke preview (scratch buffer from tools.js)
      Tools.renderScratch(ctx);

      // non-printing overlays
      Guides.render(ctx);
      Tutorial.renderOverlay(ctx);   // Draw School exemplars (light table)
      renderSelection(ctx);

      ctx.restore();

      document.getElementById("zoom-hud").textContent =
        Math.round(v.zoom * 100) + "%";
    }
    requestAnimationFrame(render);
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
  function exportPNG(includeBleed = true) {
    const out = document.createElement("canvas");
    const crop = includeBleed ? { x: 0, y: 0, w: App.page.w, h: App.page.h }
      : { x: App.page.bleed, y: App.page.bleed,
          w: App.page.w - 2 * App.page.bleed, h: App.page.h - 2 * App.page.bleed };
    out.width = crop.w; out.height = crop.h;
    const octx = out.getContext("2d");
    octx.fillStyle = "#ffffff";
    octx.fillRect(0, 0, crop.w, crop.h);
    octx.translate(-crop.x, -crop.y);
    for (const layer of App.layers) {
      if (!layer.visible) continue;
      octx.globalAlpha = layer.opacity;
      if (layer.kind === "raster") {
        octx.drawImage(layer.tint ? tinted(layer) : layer.canvas, 0, 0);
      } else if (layer.role === "panels") {
        Panels.render(octx, layer);
      } else if (layer.role === "lettering") {
        Lettering.render(octx, layer);
      }
      octx.globalAlpha = 1;
    }
    out.toBlob(blob => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = App.projectName.replace(/\s+/g, "_") + ".png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }, "image/png");
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
    sctx.fillStyle = "#ffffff";
    sctx.fillRect(x, y, 1, 1);
    for (const layer of App.layers) {
      if (!layer.visible) continue;
      sctx.globalAlpha = layer.opacity;
      if (layer.kind === "raster") {
        sctx.drawImage(layer.tint ? tinted(layer) : layer.canvas, 0, 0);
      } else if (layer.role === "panels") {
        Panels.render(sctx, layer);
      } else if (layer.role === "lettering") {
        Lettering.render(sctx, layer);
      }
      sctx.globalAlpha = 1;
    }
    const d = sctx.getImageData(0, 0, 1, 1).data;
    return "#" + [d[0], d[1], d[2]].map(v => v.toString(16).padStart(2, "0")).join("");
  }

  return { resize, fitPage, toPage, toScreen, zoomAt, exportPNG, sampleColor,
           start() { resize(); fitPage(); render(); } };
})();
