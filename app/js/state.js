/* ============================================================
   state.js — document model, layers, undo/redo, persistence
   The single source of truth. Everything else reads App.*
   ============================================================ */
"use strict";

/* Page presets: real print dimensions -> pixels at working DPI.
   Trim = final printed edge. Bleed = art that runs past trim so the
   cutter never leaves a white sliver. Safe area = keep text inside. */
const PAGE_PRESETS = {
  "us-comic": { label: "US Comic 6.625×10.25\"", w: 6.625, h: 10.25, dpi: 150,
                bleedIn: 0.125, safeIn: 0.25,
                note: "The Marvel/DC/Image standard trim size." },
  "manga-b5": { label: "Manga B5 182×257mm", w: 7.17, h: 10.12, dpi: 150,
                bleedIn: 0.12, safeIn: 0.24,
                note: "Standard tankōbon working size." },
  "webtoon":  { label: "Webtoon strip 800×3000", w: 800 / 150, h: 3000 / 150, dpi: 150,
                bleedIn: 0, safeIn: 0.1,
                note: "Vertical scroll format. Stack episodes as pages." },
  "square":   { label: "Square 8×8\" (zine/insta)", w: 8, h: 8, dpi: 150,
                bleedIn: 0.125, safeIn: 0.25,
                note: "Zines and social-first comics." },
};

const App = {
  projectName: "untitled",
  page: null,          // { presetKey, w, h, dpi, bleed, safe }  (pixels)
  layers: [],          // bottom -> top
  activeLayer: 0,
  selection: null,     // selected object {layer, obj} for select tool
  view: { zoom: 0.5, panX: 0, panY: 0 },
  guides: {
    thirds: false, golden: false, center: false, printGuides: true,
    persp: false, vps: 2,
    horizonY: 0.4,                 // fraction of page height
    vp: [{ x: 0.15, y: 0.4 }, { x: 0.85, y: 0.4 }, { x: 0.5, y: 1.35 }],
  },
  penOnly: false,
  dirty: true,         // needs recomposite
};

let _layerSeq = 0;

/* Two layer kinds:
   raster  — a bitmap canvas you paint on
   objects — a vector list (panels or lettering) hit-testable & editable */
function makeRasterLayer(name, opts = {}) {
  const c = document.createElement("canvas");
  c.width = App.page.w; c.height = App.page.h;
  return { id: ++_layerSeq, kind: "raster", name, canvas: c,
           visible: true, locked: false, opacity: opts.opacity ?? 1,
           tint: opts.tint || null };  // tint: render-time recolor (blue pencils)
}
function makeObjectLayer(name, role) {
  return { id: ++_layerSeq, kind: "objects", role, name, objects: [],
           visible: true, locked: false, opacity: 1 };
}

function newPage(presetKey) {
  const p = PAGE_PRESETS[presetKey] || PAGE_PRESETS["us-comic"];
  const px = v => Math.round(v * p.dpi);
  App.page = {
    presetKey, dpi: p.dpi,
    w: px(p.w + 2 * p.bleedIn), h: px(p.h + 2 * p.bleedIn),
    bleed: px(p.bleedIn), safe: px(p.bleedIn + p.safeIn),
  };
  _layerSeq = 0;
  App.layers = [
    makeObjectLayer("Panels", "panels"),
    makeRasterLayer("Pencils", { tint: "#8fb8e8", opacity: 0.75 }),
    makeRasterLayer("Inks"),
    makeRasterLayer("Colors"),
    makeObjectLayer("Lettering", "lettering"),
  ];
  // Colors sits UNDER Inks in real workflow; order bottom->top:
  App.layers = [App.layers[0], App.layers[1], App.layers[3], App.layers[2], App.layers[4]];
  App.activeLayer = 3;             // start on Inks
  App.selection = null;
  Undo.clear();
  App.dirty = true;
}

function activeLayer() { return App.layers[App.activeLayer]; }
function layerByRole(role) { return App.layers.find(l => l.kind === "objects" && l.role === role); }

/* ============================================================
   Undo/redo — command stack of {undo, redo} closures.
   Raster strokes snapshot the touched layer (before/after PNG).
   Object edits snapshot the object array as JSON. Cap = 40 steps.
   ============================================================ */
const Undo = {
  stack: [], index: -1, MAX: 40,

  push(cmd) {
    this.stack.length = this.index + 1;   // drop redo branch
    this.stack.push(cmd);
    if (this.stack.length > this.MAX) this.stack.shift();
    this.index = this.stack.length - 1;
    UI?.refreshUndoButtons?.();
  },
  undo() {
    if (this.index < 0) return;
    this.stack[this.index--].undo();
    App.dirty = true; UI?.refreshUndoButtons?.(); UI?.refreshLayers?.();
  },
  redo() {
    if (this.index >= this.stack.length - 1) return;
    this.stack[++this.index].redo();
    App.dirty = true; UI?.refreshUndoButtons?.(); UI?.refreshLayers?.();
  },
  clear() { this.stack = []; this.index = -1; UI?.refreshUndoButtons?.(); },
  get canUndo() { return this.index >= 0; },
  get canRedo() { return this.index < this.stack.length - 1; },
};

/* Snapshot helpers */
function snapshotRaster(layer) { return layer.canvas.toDataURL("image/png"); }

function restoreRaster(layer, dataUrl) {
  const img = new Image();
  img.onload = () => {
    const ctx = layer.canvas.getContext("2d");
    ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
    ctx.drawImage(img, 0, 0);
    layer._stamp = (layer._stamp || 0) + 1;   // invalidate tint cache
    App.dirty = true;
  };
  img.src = dataUrl;
}

/* Call around any raster mutation */
function commitRasterChange(layer, beforeUrl) {
  const afterUrl = snapshotRaster(layer);
  Undo.push({
    undo: () => restoreRaster(layer, beforeUrl),
    redo: () => restoreRaster(layer, afterUrl),
  });
}

/* Call around any object-layer mutation */
function commitObjectChange(layer, beforeJson) {
  const afterJson = JSON.stringify(layer.objects);
  Undo.push({
    undo: () => { layer.objects = JSON.parse(beforeJson); App.selection = null; },
    redo: () => { layer.objects = JSON.parse(afterJson); App.selection = null; },
  });
}

/* ============================================================
   Serialization  <->  backend  (/api/projects)
   ============================================================ */
function serializeProject() {
  return JSON.stringify({
    version: 1,
    name: App.projectName,
    page: App.page,
    guides: App.guides,
    layers: App.layers.map(l => l.kind === "raster"
      ? { kind: "raster", name: l.name, visible: l.visible, locked: l.locked,
          opacity: l.opacity, tint: l.tint, png: snapshotRaster(l) }
      : { kind: "objects", role: l.role, name: l.name, visible: l.visible,
          locked: l.locked, opacity: l.opacity, objects: l.objects }),
  });
}

function loadProjectData(data) {
  App.projectName = data.name || "untitled";
  App.page = data.page;
  Object.assign(App.guides, data.guides || {});
  _layerSeq = 0;
  App.layers = data.layers.map(l => {
    if (l.kind === "raster") {
      const layer = makeRasterLayer(l.name, { tint: l.tint, opacity: l.opacity });
      layer.visible = l.visible; layer.locked = l.locked;
      if (l.png) restoreRaster(layer, l.png);
      return layer;
    }
    const layer = makeObjectLayer(l.name, l.role);
    Object.assign(layer, { visible: l.visible, locked: l.locked,
                           opacity: l.opacity, objects: l.objects || [] });
    return layer;
  });
  App.activeLayer = Math.min(3, App.layers.length - 1);
  App.selection = null;
  Undo.clear();
  App.dirty = true;
}

async function apiSave() {
  const res = await fetch(`/api/projects/${encodeURIComponent(App.projectName)}`,
    { method: "POST", body: serializeProject() });
  return res.json();
}
async function apiList() { return (await fetch("/api/projects")).json(); }
async function apiLoad(name) {
  return (await fetch(`/api/projects/${encodeURIComponent(name)}`)).json();
}
