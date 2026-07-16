# Penshi — architecture handoff & delegation prompts

This file exists so smaller Claude models (Opus, Sonnet) can extend Penshi without
breaking its architecture. **Paste the "context block" first, then one task prompt.**

---

## Context block (paste this at the top of EVERY delegated prompt)

> You are extending **Penshi**, a local comic-creation app (repo root = this folder).
> Backend: `server.py`, pure Python stdlib `ThreadingHTTPServer` on port 8321 — static
> files from `app/`, project JSON persistence under `/api/projects/<name>`, and a
> read-only resource file server under `/resources/`. No pip dependencies allowed.
> Frontend: vanilla JS (no frameworks, no build step), loaded in this order:
> `state.js → engine.js → tools.js → panels.js → lettering.js → guides.js → reference.js → main.js`.
> Core invariants you must NOT violate:
> 1. `App` (state.js) is the single source of truth; layers are bottom→top; raster
>    layers own an offscreen `<canvas>` at full page resolution, object layers
>    (`role: "panels" | "lettering"`) own JSON-serializable `objects` arrays.
> 2. Every mutation goes through the undo system: wrap raster edits with
>    `snapshotRaster()` + `commitRasterChange()`, object edits with
>    `commitObjectChange(layer, beforeJson)`.
> 3. After ANY visual change set `App.dirty = true`; engine.js re-composites on rAF.
>    After changing a raster layer's pixels also bump `layer._stamp++` (tint cache).
> 4. Drawing input is Pointer Events only: pen/mouse draw, touch pans, and
>    `pointerType === "pen" && (buttons & 32 || buttons & 2)` means eraser.
> 5. Guides/overlays never appear in `Engine.exportPNG` output.
> 6. NO image generation features of any kind — the app enhances artists, never
>    replaces them. NO external CDNs; everything works offline.
> 7. Raster layers keep an op log (`layer.ops`: strokes/shapes/fills drawn this
>    session) used by the stroke eraser, which rebuilds pixels as
>    `layer.baseImg` + replayed ops. ANY new code path that mutates raster
>    pixels must either push an op (and pass `{add: op}` to
>    `commitRasterChange`) or accept that a later rebuild will erase its
>    pixels. Ops are not serialized; on load the PNG becomes baseImg.
> Serialization must round-trip: if you add fields to objects/layers, update
> `serializeProject()` / `loadProjectData()` in state.js and keep old saves loading.
> Test by running `python server.py` and exercising the feature in the browser.

---

## Tasks sized for SONNET (contained, single-module)

**S1 — More page templates**
"Add 6 more panel templates to `TEMPLATES` in panels.js: 2-row widescreen, 5-panel
staircase, splash-with-inset, 3x2 grid, double-page-spread marker, and a 'Sunday strip'
3-tier. Follow the existing rows/weights format so thumbnails auto-render."

**S2 — More swatches & recent colors**
"In main.js, make the swatch panel remember the last 8 used colors (localStorage),
shown in a 'Recent' row above the fixed swatches."

**S3 — Balloon styles**
"In lettering.js add per-object style options (select an object → show controls in the
Tool tab): font size slider, bold toggle, and for balloons a 'double outline' (radio
scream) and 'dashed outline' (whisper) border style. Persist in the object JSON."

**S4 — More Learn content**
"Append 4 lessons to `LESSONS` in reference.js: inking tools & techniques (nibs vs
brush), color theory for comics (flats, limited palettes), character design basics
(shape language), and thumbnailing/scripting workflow. Match the existing tone:
short, practical, comics-specific."

**S5 — Autosave**
"Add autosave: every 3 minutes, if `App.projectName !== 'untitled'` and something
changed since last save, POST to the existing save endpoint and flash 'autosaved'.
Add a checkbox in the top bar; persist the preference in localStorage."

**S6 — Zoom/rotate HUD polish**
"Add zoom presets (25/50/100/200%) as a dropdown next to the zoom HUD, plus a
'mirror view' toggle (flip the viewport horizontally — classic art-check trick;
must not affect export)."

## Tasks sized for OPUS (multi-module, but architecture already decided)

**O1 — Volume polish** (multi-page core is DONE: `App.pages` snapshots + live page,
page tabs, v2 saves with v1 migration, export-all)
"Remaining polish: page thumbnails instead of numbers in the tabs, drag-to-reorder
pages, and a 'duplicate page' button. Pages are serialized snapshots — thumbnails
can be decoded from each page's layer PNGs at small size, cached, refreshed on
switchPage()."

**O2 — Panel-clipped drawing**
"Add optional 'clip to panel' mode: when enabled and a panel is selected, brush
strokes commit clipped to that panel's rect (use ctx.save/clip/restore at the
endStroke composite in tools.js). Show a subtle highlight on the active clip panel.
Escape clears it."

**O3 — Custom brush engine**
"Extend BRUSHES in tools.js into a data-driven brush editor: jitter, angle-follow
(use tiltX/tiltY), texture stamp from a small procedural canvas, spacing, and a
'brush' tab UI to edit/save custom brushes to localStorage. Keep the stamp-on-
scratch architecture; per-stamp transforms only."

**O4 — Selection transforms on raster layers**
"Add a rectangular marquee for raster layers: cut/copy/paste/move/scale a pixel
region (floating buffer canvas until committed), with undo integration. This is the
biggest missing Illustrator-ism." (Note: for op-logged strokes, the LASSO tool in
tools.js already covers select/move/delete — this task is for flat pixels.)

**O6 — Stretch & rotate for lasso selections**
"tools.js has a lasso tool that selects op-log entries (`lasso.indices` into
`layer.ops`) with move + delete. Add STRETCH and ROTATE: draw 8 scale handles +
one rotation handle on `lasso.bbox` (render in Tools.renderScratch, hit-test in
the lasso branch of onDown). Transform math per op kind, around the bbox center
or dragged anchor: stroke → transform every point in op.points (and multiply
op.cfg.size by the mean scale factor); shape line → transform endpoints; rect
under rotation must be CONVERTED to a 4-point 'poly' shape kind you add
(axis-aligned rects can't rotate) — add poly to drawShapeOp, hitShapeOp and
opTestPoints; ellipse → transform cx/cy, scale rx/ry, and add a rotation field
(drawShapeOp already uses ctx.ellipse which takes a rotation arg); image →
transform x/y/w/h, and add a rotation field drawn via save/translate/rotate.
Live preview: draw the transformed bbox ghost only; apply on pointerup via the
existing applyLassoMove pattern (snapshot → mutate ops → rebuildLayer →
commitRasterOpsSnapshot). Shift = uniform scale / 15° rotation snap."

**O5 — Reference image import**
"Allow dropping an image file onto the canvas to create a locked 'Reference' raster
layer at 50% opacity (drawImage scaled to fit), plus a POST /api/upload endpoint in
server.py that stores images under projects/assets/ and serves them back. Update
serialization so reference layers reload."

---

## Known rough edges (fair game for either model)

- `Undo.clear()` is called when a layer is deleted (snapshot closures hold dead layers).
  A nicer fix: make undo commands layer-id based and skip missing layers.
- Balloon tail seam can show a faint line at extreme zoom.
- No .kra/.psd interchange; export is flattened PNG only.
- Flood fill has fixed tolerance 48; could be a slider.
- The old first-run tour flag lives in localStorage under `penshi-toured`
  (migrated from `inkwell-toured`; see the migration block atop state.js).
