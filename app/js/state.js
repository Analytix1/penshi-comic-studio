/* ============================================================
   state.js — document model, layers, undo/redo, persistence
   The single source of truth. Everything else reads App.*
   ============================================================ */
"use strict";

/* One-time localStorage migration for the Inkwell -> Penshi rename.
   Runs before anything reads a key, so existing users keep their
   settings, palette, tour-seen flag and Draw School progress. */
(() => {
  for (const key of ["settings", "recent-colors", "tail-mode", "drawschool", "toured"]) {
    const oldK = "inkwell-" + key, newK = "penshi-" + key;
    const v = localStorage.getItem(oldK);
    if (v !== null) {
      if (localStorage.getItem(newK) === null) localStorage.setItem(newK, v);
      localStorage.removeItem(oldK);
    }
  }
})();

/* ============================================================
   Settings — persisted to localStorage, edited via the ⚙ panel.
   ============================================================ */
const Settings = {
  DEFAULTS: {
    pageStrokeHistory: true,    // keep stroke logs across page switches
    saveStrokeHistory: false,   // include stroke logs in save files (bigger files)
    showToolRail: true,
    showSidebar: true,
    hiddenTools: [],            // tool names removed from the rail
    autosave: false,
    autosaveMin: 3,
    exportBleed: true,          // false = crop exports to the trim line
    showLayerName: true,        // active-layer badge at the page's top corner
    doubleTap: "layer-up",      // what a two-quick-taps finger gesture does
    fsWidgets: {},              // full-screen floating widgets: position, layout, collapsed, hidden
  },
  data: {},
  load() {
    this.data = Object.assign({}, this.DEFAULTS,
      JSON.parse(localStorage.getItem("penshi-settings") || "{}"));
  },
  get(k) { return this.data[k]; },
  set(k, v) {
    this.data[k] = v;
    localStorage.setItem("penshi-settings", JSON.stringify(this.data));
    UI?.applySettings?.();
  },
  reset() {
    localStorage.removeItem("penshi-settings");
    this.load();
    UI?.applySettings?.();
  },
};
Settings.load();

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
  "golden":   { label: "Golden Age 7.75×10.5\"", w: 7.75, h: 10.5, dpi: 150,
                bleedIn: 0.125, safeIn: 0.25,
                note: "Classic 1940s comic proportions." },
  "digest":   { label: "Digest 5.5×8.5\"", w: 5.5, h: 8.5, dpi: 150,
                bleedIn: 0.125, safeIn: 0.2,
                note: "Indie digests and minicomics." },
  "us-letter": { label: "US Letter 8.5×11\"", w: 8.5, h: 11, dpi: 150,
                bleedIn: 0.125, safeIn: 0.3,
                note: "Prints on any home printer." },
  "a4":       { label: "A4 210×297mm", w: 8.27, h: 11.69, dpi: 150,
                bleedIn: 0.12, safeIn: 0.3,
                note: "European standard paper." },
  "letter-wide": { label: "US Letter sideways 11×8.5\"", w: 11, h: 8.5, dpi: 150,
                bleedIn: 0.125, safeIn: 0.3,
                note: "Landscape: wide scenes and establishing shots." },
  "tabloid-wide": { label: "Tabloid sideways 17×11\"", w: 17, h: 11, dpi: 150,
                bleedIn: 0.125, safeIn: 0.3,
                note: "Two letter pages side by side. Room to spread out; the Learn pages use it." },
};

/* A loaded project may use a page size this install has never seen
   (a custom size made elsewhere) — synthesize a preset so labels and
   "add page" keep working. */
function ensurePresetFor(page) {
  if (PAGE_PRESETS[page.presetKey]) return;
  const inW = (page.w - 2 * page.bleed) / page.dpi;
  const inH = (page.h - 2 * page.bleed) / page.dpi;
  PAGE_PRESETS[page.presetKey] = {
    label: `Custom ${inW.toFixed(2)}×${inH.toFixed(2)}" @${page.dpi}dpi`,
    w: inW, h: inH, dpi: page.dpi,
    bleedIn: page.bleed / page.dpi,
    safeIn: (page.safe - page.bleed) / page.dpi,
    note: "Loaded from a saved project.",
  };
}

const App = {
  mode: "studio",      // "studio" (make comics) | "learn" (the curriculum)
  projectName: "untitled",
  page: null,          // { presetKey, w, h, dpi, bleed, safe }  (pixels)
  layers: [],          // bottom -> top (the LIVE page)
  pages: [],           // volume: serialized snapshots of every page
  pageIndex: 0,        // which snapshot the live page corresponds to
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
  /* Layers are read back all the time (an undo snapshot before and after every
     stroke; the oil brush and colour mixing read what is under them). Ask for a
     software canvas from the start: the browser would move it there after the
     first few read-backs anyway, and strokes drawn before that move would
     rasterise slightly differently from their replays afterwards. */
  c.getContext("2d", { willReadFrequently: true });
  return { id: ++_layerSeq, kind: "raster", name, canvas: c,
           visible: true, locked: false, opacity: opts.opacity ?? 1,
           tint: opts.tint || null,   // tint: render-time recolor (blue pencils)
           filter: null,              // non-destructive color filter (see filterCss)
           ref: !!opts.ref,           // imported tracing reference: never exported
           guide: !!opts.guide,       // Learn-mode guide drawing (one per level)
           ops: [],                   // stroke/shape/fill log for the stroke eraser
           baseImg: null,             // pre-ops pixels (loaded saves), as an Image
           basePng: null };           // ...and the same as a data URL, for saving
}
function makeObjectLayer(name, role) {
  return { id: ++_layerSeq, kind: "objects", role, name, objects: [],
           visible: true, locked: false, opacity: 1, filter: null };
}

/* ---------- per-layer color filters ----------
   A filter is plain data — { hue, sat, bri, con, gray, sepia, invert } —
   turned into a CSS filter string the canvas applies at composite time.
   Pixels are never altered, so a filter can be changed or removed forever. */
const FILTER_PRESETS = {
  none:      { label: "None" },
  grey:      { label: "Greyscale", gray: 100 },
  sepia:     { label: "Sepia", sepia: 100 },
  invert:    { label: "Invert", invert: 100 },
  vivid:     { label: "Vivid", sat: 160, con: 110 },
  muted:     { label: "Muted", sat: 50 },
  contrast:  { label: "High contrast", con: 160 },
  faded:     { label: "Faded (light table)", con: 55, bri: 135 },
  dusk:      { label: "Dusk", hue: -18, sat: 80, bri: 82 },
  night:     { label: "Night", hue: 28, sat: 60, bri: 58, con: 115 },
};
const FILTER_NEUTRAL = { hue: 0, sat: 100, bri: 100, con: 100, gray: 0, sepia: 0, invert: 0 };
function filterCss(f) {
  if (!f) return "none";
  const v = { ...FILTER_NEUTRAL, ...f };
  const parts = [];
  if (v.gray) parts.push(`grayscale(${v.gray}%)`);
  if (v.sepia) parts.push(`sepia(${v.sepia}%)`);
  if (v.invert) parts.push(`invert(${v.invert}%)`);
  if (v.hue) parts.push(`hue-rotate(${v.hue}deg)`);
  if (v.sat !== 100) parts.push(`saturate(${v.sat}%)`);
  if (v.bri !== 100) parts.push(`brightness(${v.bri}%)`);
  if (v.con !== 100) parts.push(`contrast(${v.con}%)`);
  return parts.length ? parts.join(" ") : "none";
}
/* is this a Learn guide layer? (older attempts only have the name) */
const isGuideLayer = l => !!l && l.kind === "raster" && (l.guide || /^Guide\b/.test(l.name));

/* Build a blank live page (canvas + default layer stack) */
function buildFreshPage(presetKey) {
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
  Tools?.resetTransient?.();       // a lasso/placement from the old page would target dead layers
  App.dirty = true;
}

/* Start a brand-new single-page volume */
function newPage(presetKey) {
  buildFreshPage(presetKey);
  App.pages = [serializePage()];
  App.pageIndex = 0;
  Undo.clear();
  UI?.refreshPageTabs?.();
}

/* ============================================================
   Volume (multi-page) management. App.layers is always the ONE
   live page; the others sit serialized in App.pages. Switching
   pages snapshots the live page back into its slot, then rebuilds
   the target from its snapshot.
   ============================================================ */
function serializePage(includeHistory = Settings.get("pageStrokeHistory")) {
  return {
    page: App.page,
    guides: JSON.parse(JSON.stringify(App.guides)),
    layers: App.layers.map(l => l.kind === "raster"
      ? { kind: "raster", name: l.name, visible: l.visible, locked: l.locked,
          opacity: l.opacity, tint: l.tint, png: snapshotRaster(l),
          ...(l.filter ? { filter: l.filter } : {}),
          ...(l.ref ? { ref: true } : {}), ...(l.guide ? { guide: true } : {}),
          // stroke history: the pre-ops base plus the op log lets a future
          // session keep whole-stroke editing on this art
          ...(includeHistory ? { basePng: l.basePng || null, ops: l.ops } : {}) }
      : { kind: "objects", role: l.role, name: l.name, visible: l.visible,
          locked: l.locked, opacity: l.opacity, objects: l.objects,
          ...(l.filter ? { filter: l.filter } : {}) }),
  };
}

/* A page's raster layers are made blank at once and filled as their saved
   images decode. Until that finishes the layers are NOT the page: saving
   them then (a second click on Next or on a page tab mid-load, an autosave)
   would overwrite the page with blank layers. So while any load is in
   progress, syncCurrentPage leaves App.pages alone (it already holds that
   page) and the drawing tools ignore the pen. */
let pageLoads = 0;
const isPageLoading = () => pageLoads > 0;

async function loadPage(data) {
  pageLoads++;
  try { await loadPageNow(data); } finally { pageLoads--; }
}
async function loadPageNow(data) {
  App.page = data.page;
  ensurePresetFor(App.page);
  Object.assign(App.guides, data.guides || {});
  const waits = [];
  App.layers = data.layers.map(l => {
    if (l.kind === "raster") {
      const layer = makeRasterLayer(l.name, { tint: l.tint, opacity: l.opacity,
                                              ref: l.ref, guide: l.guide });
      layer.visible = l.visible; layer.locked = l.locked;
      layer.filter = l.filter || null;
      if (l.png) waits.push(restoreRaster(layer, l.png));
      if (Array.isArray(l.ops)) {
        // stroke history travels with the page: whole-stroke tools keep
        // working on this art
        layer.ops = l.ops;
        layer.basePng = l.basePng || null;
      } else if (l.png) {
        // flat save: pixels become the rebuild base, log starts fresh
        layer.basePng = l.png;
      }
      if (layer.basePng) {
        layer.baseImg = new Image();
        layer.baseImg.src = layer.basePng;
      }
      return layer;
    }
    const layer = makeObjectLayer(l.name, l.role);
    Object.assign(layer, { visible: l.visible, locked: l.locked,
                           opacity: l.opacity, objects: l.objects || [],
                           filter: l.filter || null });
    return layer;
  });
  App.activeLayer = Math.min(3, App.layers.length - 1);
  App.selection = null;
  Tools?.resetTransient?.();       // ditto: the new page gets a clean slate
  await Promise.all(waits);
  App.dirty = true;
}

function syncCurrentPage() {
  if (isPageLoading()) return;            // see loadPage: the layers are still blank
  App.pages[App.pageIndex] = serializePage();
}

/* "Final version": bake the current page's stroke history into flat pixels.
   The art doesn't change — strokes just stop being individually editable,
   and saves of this page shrink back to pixels-only. */
function finalizeCurrentPage() {
  for (const layer of App.layers) {
    if (layer.kind !== "raster") continue;
    layer.basePng = snapshotRaster(layer);
    layer.baseImg = new Image();
    layer.baseImg.src = layer.basePng;
    layer.ops = [];
  }
  Undo.clear();   // old undo entries reference the discarded op log
  App.dirty = true;
}

/* Lossy history diet: halve the point density of every logged stroke and
   round coordinates. Strokes stay whole-stroke editable; replay differs by
   well under a pixel. Returns {before, after} in KB. */
function compactCurrentPageHistory() {
  const size = () => Math.round(App.layers.reduce((n, l) =>
    n + (l.ops ? JSON.stringify(l.ops).length : 0), 0) / 1024);
  const before = size();
  for (const layer of App.layers) {
    if (layer.kind !== "raster") continue;
    for (const op of layer.ops) {
      if (op.kind !== "stroke") continue;
      if (op.points.length > 16) {
        op.points = op.points.filter((_, i) =>
          i === 0 || i === op.points.length - 1 || i % 2 === 0);
      }
      for (const q of op.points) {
        q.x = Math.round(q.x); q.y = Math.round(q.y);
        q.k = Math.round(q.k * 20) / 20;
      }
    }
  }
  return { before, after: size() };
}

async function switchPage(i) {
  if (i === App.pageIndex || i < 0 || i >= App.pages.length) return;
  syncCurrentPage();
  App.pageIndex = i;
  await loadPage(App.pages[i]);
  Undo.clear();                    // undo history is per-visit, not per-page
  UI?.refreshLayers?.(); UI?.refreshPageTabs?.();
}

async function addPage() {
  syncCurrentPage();
  buildFreshPage(App.page.presetKey);   // same format as the current page
  App.pageIndex = App.pages.length;
  App.pages.push(serializePage());
  Undo.clear();
  UI?.refreshLayers?.(); UI?.refreshPageTabs?.();
}

async function deleteCurrentPage() {
  if (App.pages.length <= 1) { UI?.flash?.("A volume needs at least one page."); return; }
  App.pages.splice(App.pageIndex, 1);
  App.pageIndex = Math.min(App.pageIndex, App.pages.length - 1);
  await loadPage(App.pages[App.pageIndex]);
  Undo.clear();
  UI?.refreshLayers?.(); UI?.refreshPageTabs?.();
}

function activeLayer() { return App.layers[App.activeLayer]; }
/* A page can hold several object layers of one role (two Lettering layers
   for two languages, say). New objects go to the ACTIVE layer when it has
   that role; otherwise to the topmost one. */
function layersByRole(role) { return App.layers.filter(l => l.kind === "objects" && l.role === role); }
function layerByRole(role) {
  const a = activeLayer();
  if (a && a.kind === "objects" && a.role === role) return a;
  const all = layersByRole(role);
  return all[all.length - 1];
}

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
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      const ctx = layer.canvas.getContext("2d");
      ctx.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
      ctx.drawImage(img, 0, 0);
      layer._stamp = (layer._stamp || 0) + 1;   // invalidate tint cache
      App.dirty = true;
      resolve();
    };
    img.onerror = () => resolve();
    img.src = dataUrl;
  });
}

/* Call around any raster mutation. opsDelta keeps the layer's op log in
   sync with pixel undo/redo:  {add: op}  after pushing op to layer.ops,
   {remove: {op, index}} after splicing it out. */
function commitRasterChange(layer, beforeUrl, opsDelta = null) {
  const afterUrl = snapshotRaster(layer);
  const applyDelta = isUndo => {
    if (!opsDelta || !layer.ops) return;
    if (opsDelta.add) {
      if (isUndo) {
        const i = layer.ops.lastIndexOf(opsDelta.add);
        if (i >= 0) layer.ops.splice(i, 1);
      } else if (!layer.ops.includes(opsDelta.add)) {
        layer.ops.push(opsDelta.add);
      }
    } else if (opsDelta.remove) {
      if (isUndo) layer.ops.splice(opsDelta.remove.index, 0, opsDelta.remove.op);
      else {
        const i = layer.ops.indexOf(opsDelta.remove.op);
        if (i >= 0) layer.ops.splice(i, 1);
      }
    }
  };
  Undo.push({
    undo: () => { restoreRaster(layer, beforeUrl); applyDelta(true); },
    redo: () => { restoreRaster(layer, afterUrl); applyDelta(false); },
  });
}

/* For bulk op-log mutations (lasso move/delete): snapshot pixels AND the
   whole ops array, because many ops changed at once. */
function commitRasterOpsSnapshot(layer, beforeUrl, beforeOpsJson) {
  const afterUrl = snapshotRaster(layer);
  const afterOpsJson = JSON.stringify(layer.ops);
  Undo.push({
    undo: () => { restoreRaster(layer, beforeUrl); layer.ops = JSON.parse(beforeOpsJson); },
    redo: () => { restoreRaster(layer, afterUrl); layer.ops = JSON.parse(afterOpsJson); },
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
   v2 = multi-page volume {pages: [...], current}.
   v1 (old single-page saves) is migrated on load.
   ============================================================ */
function serializeProject() {
  syncCurrentPage();
  let pages = App.pages;
  if (!Settings.get("saveStrokeHistory")) {
    // strip stroke history from the FILE (page-switch snapshots keep theirs)
    pages = App.pages.map(pg => ({
      ...pg,
      layers: pg.layers.map(l => {
        if (l.kind !== "raster") return l;
        const { basePng, ops, ...flat } = l;
        return flat;
      }),
    }));
  }
  return JSON.stringify({
    version: 2,
    name: App.projectName,
    pages,
    current: App.pageIndex,
  });
}

async function loadProjectData(data) {
  App.projectName = data.name || "untitled";
  if (data.version === 2) {
    App.pages = data.pages;
    App.pageIndex = Math.min(data.current || 0, App.pages.length - 1);
  } else {
    // v1: one page at the top level -> wrap it as a one-page volume
    App.pages = [{ page: data.page, guides: data.guides, layers: data.layers }];
    App.pageIndex = 0;
  }
  _layerSeq = 0;
  await loadPage(App.pages[App.pageIndex]);
  Undo.clear();
  UI?.refreshPageTabs?.();
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
