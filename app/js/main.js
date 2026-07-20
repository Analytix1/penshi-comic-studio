/* ============================================================
   main.js — UI wiring: toolbar, sidebar, layers panel, keyboard
   shortcuts, save/open dialogs, pen telemetry, guided tour.
   Exposes the small `UI` facade other modules call into.
   ============================================================ */
"use strict";

const UI = {};

(() => {
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];

  /* ---------- status + telemetry ---------- */
  let flashTimer = null;
  UI.flash = msg => {
    $("#st-msg").textContent = msg;
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => { $("#st-msg").textContent = ""; }, 3500);
  };
  UI.cursorPos = e => {
    const r = $("#view").getBoundingClientRect();
    const p = Engine.toPage(e.clientX - r.left, e.clientY - r.top);
    $("#st-cursor").textContent = `x ${Math.round(p.x)}  y ${Math.round(p.y)} px`;
  };
  UI.penTelemetry = e => {
    if (e.pointerType !== "pen") return;
    const tail = e.buttons & 32
      ? (Tools.state.tailMode === "strokeeraser" ? " · tail ⌫ stroke-erase" : " · tail ◻ erase")
      : e.buttons & 2 ? " · barrel → lasso" : "";
    $("#pen-status").textContent =
      `pen  P ${(e.pressure || 0).toFixed(2)}  tilt ${e.tiltX | 0}°/${e.tiltY | 0}°${tail}`;
  };
  UI.refreshUndoButtons = () => {
    $("#btn-undo").disabled = !Undo.canUndo;
    $("#btn-redo").disabled = !Undo.canRedo;
  };

  /* ---------- tools ---------- */
  const TOOL_HINTS = {
    select: "Click an object to select. Drag to move, corner square to resize, blue dot to re-aim a balloon tail. Del removes it. Double-click text to edit.",
    lasso: "Circle strokes to select them as a group. Drag inside the box to move; corner/edge squares STRETCH (Shift = keep proportions); the knob above ROTATES (Shift = 15° snaps). Del deletes, 📦 saves to your asset library, Esc clears. The Slim Pen's side button lassos from any tool.",
    pan: "Drag to move around the page. Any tool: hold Space, use a finger, or the middle mouse button.",
    ink: "Your finish line. Pressure drives width — light for distant/delicate, heavy for shadow-side and foreground. Vary weight within one stroke.",
    pencil: "Draws in non-photo blue on whatever layer you're on (the Pencils layer tints itself). Rough loose — you'll ink over it, not erase it.",
    marker: "Translucent tone for greys and spotting blacks. Strokes don't self-overlap mid-stroke, so tone stays even.",
    eraser: "Erases pixels on the active layer. The Slim Pen 2's tail does this too when the top-bar Tail toggle is set to ◻.",
    strokeeraser: "Tap (or swipe across) a stroke to remove the WHOLE stroke — shapes too. Works on any visible unlocked layer, topmost first. Set the top-bar Tail toggle to ⌫ to put this on the Slim Pen's flip-end. Works on logged strokes — turn on 'stroke history in saved files' in ⚙ Settings to keep old art stroke-editable too.",
    fill: "Click to flood-fill a region on the active raster layer. Close your ink gaps first or it leaks.",
    line: "Drag for a straight line. Hold Shift to snap to 15° — aim strokes at your vanishing points.",
    rect: "Drag a rectangle. Shift = square.",
    ellipse: "Drag an ellipse. Shift = circle.",
    panel: "Drag a panel border on the Panels layer. Or apply a whole page template from the Guides tab.",
    balloon: "Drag an oval speech balloon, then type. Drag its tail (select tool) to the speaker's mouth.",
    thought: "Cloud-scalloped thought bubble with a dot trail.",
    caption: "Rectangular narration box — time jumps, inner voice, scene labels.",
    burst: "Jagged SFX/shout balloon. Go big.",
  };
  const TOOL_LABELS = {
    select: "Select / Move", lasso: "Lasso select", pan: "Pan", ink: "Ink pen", pencil: "Pencil",
    marker: "Marker", eraser: "Eraser", strokeeraser: "Stroke eraser",
    fill: "Fill", line: "Line",
    rect: "Rectangle", ellipse: "Ellipse", panel: "Panel", balloon: "Speech balloon",
    thought: "Thought balloon", caption: "Caption", burst: "SFX burst",
  };
  const TOOL_DEFAULTS = {   // per-tool size/opacity presets
    ink: { size: 6, opacity: 100 }, pencil: { size: 5, opacity: 80 },
    marker: { size: 34, opacity: 60 }, eraser: { size: 26, opacity: 100 },
    line: { size: 4 }, rect: { size: 4 }, ellipse: { size: 4 }, fill: {},
  };

  function setTool(name) {
    Tools.state.current = name;
    $$(".tool").forEach(b => b.classList.toggle("active", b.dataset.tool === name));
    $("#tool-name").textContent = TOOL_LABELS[name] || name;
    $("#tool-hint").textContent = TOOL_HINTS[name] || "";
    const d = TOOL_DEFAULTS[name];
    if (d) {
      if (d.size) { $("#opt-size").value = d.size; syncSize(); }
      if (d.opacity) { $("#opt-opacity").value = d.opacity; syncOpacity(); }
    }
    $("#view").style.cursor =
      name === "pan" ? "grab" : name === "select" ? "default" : "crosshair";
  }
  $$(".tool").forEach(b => b.addEventListener("click", () => setTool(b.dataset.tool)));
  UI.setTool = setTool;   // Draw School lessons switch tools for the learner

  /* ---------- tool options ---------- */
  function syncSize() {
    Tools.state.size = +$("#opt-size").value;
    $("#lbl-size").textContent = $("#opt-size").value;
  }
  function syncOpacity() {
    Tools.state.opacity = +$("#opt-opacity").value / 100;
    $("#lbl-opacity").textContent = $("#opt-opacity").value;
  }
  $("#opt-size").addEventListener("input", syncSize);
  $("#opt-opacity").addEventListener("input", syncOpacity);
  $("#opt-smooth").addEventListener("input", e => {
    Tools.state.smoothing = +e.target.value / 100;
    $("#lbl-smooth").textContent = e.target.value;
  });
  $("#opt-pressure-size").addEventListener("change", e => Tools.state.pressureSize = e.target.checked);
  $("#opt-pressure-opacity").addEventListener("change", e => Tools.state.pressureOpacity = e.target.checked);
  $("#opt-color").addEventListener("input", e => Tools.state.color = e.target.value);
  $("#opt-gutter").addEventListener("input", e => {
    Tools.state.gutter = +e.target.value;
    $("#lbl-gutter").textContent = e.target.value;
  });

  /* ---------- color palette ---------- */
  const PALETTE = {
    "Inks & tones": ["#000000", "#1a1a1a", "#3d3d3d", "#5c5c5c", "#7d7d7d",
      "#9e9e9e", "#bdbdbd", "#dcdcdc", "#ffffff", "#8fb8e8" /* non-photo blue */],
    "Vivid": ["#d93a3a", "#e8783a", "#f2c14b", "#f2e34b", "#7dc94b", "#3aa66b",
      "#3aa6a6", "#3a6bd9", "#5b4bd9", "#8a4bb8", "#c94b9e", "#e88aa6"],
    "Skin tones": ["#fde4d0", "#f5cba7", "#eab183", "#d29a6a", "#b97f4f",
      "#9c6238", "#7d4a26", "#5c3419", "#3f2312"],
    "Muted / story": ["#2c3e60", "#3c5a3c", "#6e2f3c", "#b8923a", "#5c6b7d",
      "#8c7a5c", "#a6763c", "#d9a6a6", "#c9c2a6", "#f5eeda"],
  };
  UI.setColor = hex => {
    $("#opt-color").value = hex;
    Tools.state.color = hex;
    UI.flash("Color " + hex);
  };
  const RECENT_KEY = "penshi-recent-colors";
  UI.noteColor = hex => {
    let recent = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    recent = [hex, ...recent.filter(c => c !== hex)].slice(0, 10);
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
    renderRecents();
  };
  const swatchEl = c => {
    const el = document.createElement("div");
    el.className = "swatch"; el.style.background = c; el.title = c;
    el.addEventListener("click", () => UI.setColor(c));
    return el;
  };
  function renderRecents() {
    const host = $("#recent-swatches");
    const recent = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    host.parentElement.style.display = recent.length ? "" : "none";
    host.innerHTML = "";
    for (const c of recent) host.appendChild(swatchEl(c));
  }
  {
    const box = $("#swatches");
    box.innerHTML = `<div class="swatch-group"><div class="swatch-label">Recent</div>
      <div class="swatch-row" id="recent-swatches"></div></div>`;
    for (const [label, colors] of Object.entries(PALETTE)) {
      const g = document.createElement("div");
      g.className = "swatch-group";
      g.innerHTML = `<div class="swatch-label">${label}</div>`;
      const row = document.createElement("div");
      row.className = "swatch-row";
      for (const c of colors) row.appendChild(swatchEl(c));
      g.appendChild(row);
      box.appendChild(g);
    }
    // full spectrum grid: 12 hues × 5 shades (pastel → deep shadow)
    const hslHex = (h, s, l) => {
      const a = s * Math.min(l, 1 - l);
      const f = n => {
        const k = (n + h / 30) % 12;
        const v = l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
        return Math.round(v * 255).toString(16).padStart(2, "0");
      };
      return "#" + f(0) + f(8) + f(4);
    };
    const spec = document.createElement("div");
    spec.className = "swatch-group";
    spec.innerHTML = `<div class="swatch-label">Spectrum</div>`;
    for (const [l, s] of [[0.86, 0.75], [0.70, 0.75], [0.54, 0.72], [0.38, 0.68], [0.24, 0.60]]) {
      const row = document.createElement("div");
      row.className = "swatch-row spectrum-row";
      for (let h = 0; h < 360; h += 30) {
        const el = swatchEl(hslHex(h, s, l));
        el.classList.add("swatch-mini");
        row.appendChild(el);
      }
      spec.appendChild(row);
    }
    box.appendChild(spec);
    box.insertAdjacentHTML("beforeend",
      `<div class="hint" style="margin-top:8px"><b>Alt+click</b> the canvas =
       eyedropper — picks up the visible color under the cursor.</div>`);
    renderRecents();
  }

  /* ---------- sidebar tabs ---------- */
  $$(".stab").forEach(t => t.addEventListener("click", () => {
    $$(".stab").forEach(x => x.classList.toggle("active", x === t));
    $$(".side-panel").forEach(p => p.hidden = p.id !== t.dataset.panel);
  }));

  /* ---------- layers panel ---------- */
  UI.refreshLayers = () => {
    const ul = $("#layer-list");
    ul.innerHTML = "";
    // display top layer first (natural for artists)
    [...App.layers].reverse().forEach(layer => {
      const i = App.layers.indexOf(layer);
      const li = document.createElement("li");
      li.className = i === App.activeLayer ? "active" : "";
      li.innerHTML = `
        <span class="l-eye ${layer.visible ? "" : "l-off"}" title="Show/hide">◉</span>
        <span class="l-lock ${layer.locked ? "" : "l-off"}" title="Lock">🔒</span>
        <span class="l-name">${layer.name}</span>
        <span class="l-kind">${layer.kind === "objects" ? layer.role : (layer.tint ? "blue" : "raster")}</span>`;
      li.querySelector(".l-eye").addEventListener("click", e => {
        e.stopPropagation(); layer.visible = !layer.visible;
        App.dirty = true; UI.refreshLayers();
      });
      li.querySelector(".l-lock").addEventListener("click", e => {
        e.stopPropagation(); layer.locked = !layer.locked; UI.refreshLayers();
      });
      li.addEventListener("click", () => {
        App.activeLayer = i;
        $("#opt-layeropacity").value = Math.round(layer.opacity * 100);
        $("#lbl-layeropacity").textContent = Math.round(layer.opacity * 100);
        UI.refreshLayers();
      });
      ul.appendChild(li);
    });
  };
  $("#btn-layer-add").addEventListener("click", () => {
    const layer = makeRasterLayer("Layer " + (App.layers.length + 1));
    App.layers.splice(App.activeLayer + 1, 0, layer);
    App.activeLayer++;
    App.dirty = true; UI.refreshLayers();
  });
  $("#btn-layer-del").addEventListener("click", () => {
    const l = activeLayer();
    if (l.kind === "objects") return UI.flash("Panels/Lettering layers are structural — hide them instead.");
    if (App.layers.filter(x => x.kind === "raster").length <= 1)
      return UI.flash("Keep at least one raster layer.");
    if (!confirm(`Delete layer "${l.name}"?`)) return;
    App.layers.splice(App.activeLayer, 1);
    App.activeLayer = Math.max(0, App.activeLayer - 1);
    Undo.clear();     // snapshot closures reference the dead layer
    App.dirty = true; UI.refreshLayers();
  });
  const moveLayer = dir => {
    const i = App.activeLayer, j = i + dir;
    if (j < 0 || j >= App.layers.length) return;
    [App.layers[i], App.layers[j]] = [App.layers[j], App.layers[i]];
    App.activeLayer = j;
    App.dirty = true; UI.refreshLayers();
  };
  $("#btn-layer-up").addEventListener("click", () => moveLayer(1));
  $("#btn-layer-down").addEventListener("click", () => moveLayer(-1));
  $("#opt-layeropacity").addEventListener("input", e => {
    activeLayer().opacity = +e.target.value / 100;
    $("#lbl-layeropacity").textContent = e.target.value;
    App.dirty = true;
  });

  /* ---------- guides checkboxes ---------- */
  const bindGuide = (id, key) => $(id).addEventListener("change", e => {
    App.guides[key] = e.target.checked; App.dirty = true;
  });
  bindGuide("#g-thirds", "thirds"); bindGuide("#g-golden", "golden");
  bindGuide("#g-center", "center"); bindGuide("#g-persp", "persp");
  $("#g-vps").addEventListener("change", e => { App.guides.vps = +e.target.value; App.dirty = true; });
  $("#chk-printguides").addEventListener("change", e => {
    App.guides.printGuides = e.target.checked; App.dirty = true;
  });
  $("#chk-penonly").addEventListener("change", e => {
    App.penOnly = e.target.checked;
    UI.flash(App.penOnly ? "Pen-only: mouse & touch won't draw" : "Mouse drawing re-enabled");
  });
  $("#pen-tail").value = Tools.state.tailMode;
  $("#pen-tail").addEventListener("change", e => {
    Tools.state.tailMode = e.target.value;
    localStorage.setItem("penshi-tail-mode", e.target.value);
    UI.flash(e.target.value === "strokeeraser"
      ? "Pen tail now erases WHOLE strokes" : "Pen tail now erases pixels");
  });

  /* ---------- top bar ---------- */
  $("#btn-undo").addEventListener("click", () => Undo.undo());
  $("#btn-redo").addEventListener("click", () => Undo.redo());
  $("#btn-export").addEventListener("click", () => {
    Engine.exportPNG(Settings.get("exportBleed"));
    UI.flash(`Exported PNG (${Settings.get("exportBleed") ? "with bleed" : "trimmed"}). ` +
      "Hide the Pencils layer first if you see blue lines!");
  });

  $("#btn-save").addEventListener("click", async () => {
    if (App.projectName === "untitled") {
      const n = prompt("Project name:", "my-comic");
      if (!n) return;
      App.projectName = n.trim();
    }
    try {
      const r = await apiSave();
      UI.flash(r.ok ? `Saved "${App.projectName}" ✓` : "Save failed: " + r.error);
    } catch { UI.flash("Save failed — is server.py running?"); }
    updatePageStatus();
  });

  /* ---------- settings ---------- */
  let panelsHiddenByTab = false;
  UI.applySettings = () => {
    $("#toolrail").style.display =
      (Settings.get("showToolRail") && !panelsHiddenByTab) ? "" : "none";
    $("#sidebar").style.display =
      (Settings.get("showSidebar") && !panelsHiddenByTab) ? "" : "none";
    const hidden = Settings.get("hiddenTools");
    $$(".tool").forEach(b =>
      b.style.display = hidden.includes(b.dataset.tool) ? "none" : "");
  };

  function openSettings() {
    const c = k => Settings.get(k) ? "checked" : "";
    modal.innerHTML = `<h2>⚙ Settings</h2>
      <h3 class="set-h">Stroke history</h3>
      <label class="chk"><input type="checkbox" id="set-pagehist" ${c("pageStrokeHistory")}>
        Keep stroke history when switching pages in a volume</label>
      <label class="chk"><input type="checkbox" id="set-savehist" ${c("saveStrokeHistory")}>
        Include stroke history in saved files</label>
      <div class="hint">History is what lets the stroke eraser ⌫ and lasso ◌ treat
        old art as individual strokes. Saving it makes files noticeably larger
        (every pen path with pressure data is stored).</div>
      <div class="row" style="margin-top:8px">
        <button id="set-compact">Compact history</button>
        <button id="set-finalize">Finalize page</button>
      </div>
      <div class="hint"><b>Compact</b> halves this page's history detail (strokes stay
        editable). <b>Finalize</b> declares this page a final version: pixels are kept
        exactly, but its strokes become permanent — smaller saves, no more
        whole-stroke editing on them.</div>
      <h3 class="set-h">This page</h3>
      <div class="muted" style="font-size:12px;margin-bottom:4px">Paper color</div>
      <div class="swatch-row" id="paper-swatches"></div>
      <div class="hint">Saved with the page and used by exports. Panels stay white
        on top of it.</div>
      <h3 class="set-h">Interface</h3>
      <label class="chk"><input type="checkbox" id="set-rail" ${c("showToolRail")}> Show left tool rail</label>
      <label class="chk"><input type="checkbox" id="set-side" ${c("showSidebar")}> Show right sidebar</label>
      <div class="hint"><b>Tab</b> hides/shows both at once — distraction-free drawing.</div>
      <div class="muted" style="font-size:12px;margin:8px 0 4px">Tools on the rail:</div>
      <div class="set-tools">${Object.entries(TOOL_LABELS).map(([k, lbl]) => `
        <label class="chk"><input type="checkbox" class="set-tool" data-tool="${k}"
          ${Settings.get("hiddenTools").includes(k) ? "" : "checked"}> ${lbl}</label>`).join("")}</div>
      <div class="hint">Hidden tools keep their keyboard shortcuts.</div>
      <h3 class="set-h">Autosave</h3>
      <label class="chk"><input type="checkbox" id="set-autosave" ${c("autosave")}>
        Autosave every <input type="number" id="set-autosavemin" min="1" max="30"
        value="${Settings.get("autosaveMin")}" style="width:56px"> minutes</label>
      <div class="hint">Kicks in once the project has a name (save manually once first).</div>
      <h3 class="set-h">Export</h3>
      <label class="chk"><input type="checkbox" id="set-bleed" ${c("exportBleed")}>
        Include bleed in exported PNGs</label>
      <div class="hint">Off: exports crop to the red trim line — exactly the printed page.</div>
      <div class="row" style="margin-top:14px">
        <button id="set-reset">Reset all settings</button>
        <span class="spacer"></span><button id="set-close">Done</button></div>`;
    backdrop.hidden = false;
    const bind = (sel, key) => modal.querySelector(sel).addEventListener("change",
      e => Settings.set(key, e.target.checked));
    bind("#set-pagehist", "pageStrokeHistory");
    bind("#set-savehist", "saveStrokeHistory");
    bind("#set-rail", "showToolRail");
    bind("#set-side", "showSidebar");
    bind("#set-autosave", "autosave");
    bind("#set-bleed", "exportBleed");
    modal.querySelector("#set-autosavemin").addEventListener("change", e =>
      Settings.set("autosaveMin", Math.max(1, Math.min(30, +e.target.value || 3))));
    modal.querySelectorAll(".set-tool").forEach(cb => cb.addEventListener("change", () =>
      Settings.set("hiddenTools", [...modal.querySelectorAll(".set-tool")]
        .filter(x => !x.checked).map(x => x.dataset.tool))));
    modal.querySelector("#set-reset").addEventListener("click", () => {
      Settings.reset(); openSettings();
    });
    modal.querySelector("#set-close").addEventListener("click", closeModal);

    modal.querySelector("#set-compact").addEventListener("click", () => {
      const r = compactCurrentPageHistory();
      UI.flash(`History compacted: ${r.before} KB → ${r.after} KB on this page`);
    });
    modal.querySelector("#set-finalize").addEventListener("click", () => {
      if (!confirm("Finalize this page? The art keeps its exact pixels, but its " +
        "strokes become permanent — no more whole-stroke erasing or lassoing them. " +
        "This also clears undo history.")) return;
      finalizeCurrentPage();
      UI.flash("Page finalized — history flattened into the art ✓");
    });

    // paper color: a few basics from Inks & Tones + Muted/Story
    const PAPERS = ["#ffffff", "#f5eeda", "#dcdcdc", "#c9c2a6", "#9e9e9e",
      "#8c7a5c", "#5c6b7d", "#3c5a3c", "#2c3e60", "#6e2f3c", "#1a1a1a"];
    const host = modal.querySelector("#paper-swatches");
    for (const col of PAPERS) {
      const el = document.createElement("div");
      el.className = "swatch";
      el.style.background = col;
      el.title = col;
      if ((App.page.paper || "#ffffff") === col) el.style.outline = "2px solid var(--accent)";
      el.addEventListener("click", () => {
        App.page.paper = col;
        App.dirty = true;
        [...host.children].forEach(x => x.style.outline = "");
        el.style.outline = "2px solid var(--accent)";
      });
      host.appendChild(el);
    }
  }
  $("#btn-settings").addEventListener("click", openSettings);

  /* autosave loop */
  let lastAutosave = Date.now(), lastAutosaveUndo = -2;
  setInterval(async () => {
    if (!Settings.get("autosave") || App.projectName === "untitled") return;
    if (Date.now() - lastAutosave < Settings.get("autosaveMin") * 60000) return;
    if (Undo.index === lastAutosaveUndo) return;   // nothing changed
    try {
      const r = await apiSave();
      if (r.ok) {
        lastAutosave = Date.now();
        lastAutosaveUndo = Undo.index;
        UI.flash(`Autosaved "${App.projectName}" ✓`);
      }
    } catch { /* server down — retry next tick */ }
  }, 30000);

  /* ---------- modal: open / new ---------- */
  const backdrop = $("#modal-backdrop"), modal = $("#modal");
  const closeModal = () => backdrop.hidden = true;
  backdrop.addEventListener("click", e => { if (e.target === backdrop) closeModal(); });

  $("#btn-open").addEventListener("click", async () => {
    let list;
    try { list = (await apiList()).projects; }
    catch { return UI.flash("Backend unreachable — is server.py running?"); }
    modal.innerHTML = `<h2>Open project</h2>` + (list.length === 0
      ? `<p class="muted">No saved projects yet. Draw something and hit Save!</p>`
      : list.map(p => `<div class="proj-row" data-name="${p.name}">
          <span>📄</span><b style="flex:1">${p.name}</b>
          <span class="muted">${p.sizeKb} KB · ${new Date(p.modified * 1000).toLocaleDateString()}</span>
          <button class="p-del" data-name="${p.name}" title="Delete">🗑</button></div>`).join(""));
    backdrop.hidden = false;
    modal.querySelectorAll(".proj-row").forEach(row =>
      row.addEventListener("click", async e => {
        if (e.target.classList.contains("p-del")) return;
        const data = await apiLoad(row.dataset.name);
        await loadProjectData(data);
        closeModal(); Engine.fitPage(); UI.refreshLayers(); updatePageStatus();
        UI.flash(`Opened "${data.name}"`);
      }));
    modal.querySelectorAll(".p-del").forEach(btn =>
      btn.addEventListener("click", async e => {
        e.stopPropagation();
        if (!confirm(`Delete project "${btn.dataset.name}" permanently?`)) return;
        await fetch(`/api/projects/${encodeURIComponent(btn.dataset.name)}`, { method: "DELETE" });
        $("#btn-open").click();   // rebuild list
      }));
  });

  function newPageModal(firstRun = false) {
    modal.innerHTML = `<h2>${firstRun ? "Welcome to Penshi 🖋" : "New page"}</h2>
      ${firstRun ? `<p class="muted" style="margin-top:-6px">Pick a page format —
        real print dimensions with proper bleed and safe areas.</p>` : ""}
      <div class="preset-grid">${Object.entries(PAGE_PRESETS)
        .filter(([k]) => k !== "custom").map(([k, p]) =>
        `<div class="preset" data-k="${k}"><b>${p.label}</b>
         <span class="muted">${p.note}</span></div>`).join("")}</div>
      <div class="custom-page"><b>Custom size</b>
        <div class="row">
          <input id="cp-w" type="number" value="8" min="1" max="30" step="0.25"> ×
          <input id="cp-h" type="number" value="10" min="1" max="60" step="0.25"> inches @
          <select id="cp-dpi"><option>150</option><option>300</option></select> dpi
          <button id="cp-go">Create</button>
        </div></div>`;
    backdrop.hidden = false;
    const startWith = presetKey => {
      newPage(presetKey);
      App.projectName = "untitled";
      closeModal(); Engine.fitPage(); UI.refreshLayers(); updatePageStatus();
      if (firstRun) Tour.start();
    };
    modal.querySelectorAll(".preset").forEach(el =>
      el.addEventListener("click", () => startWith(el.dataset.k)));
    modal.querySelector("#cp-go").addEventListener("click", () => {
      const w = Math.min(30, Math.max(1, +modal.querySelector("#cp-w").value || 8));
      const h = Math.min(60, Math.max(1, +modal.querySelector("#cp-h").value || 10));
      const dpi = +modal.querySelector("#cp-dpi").value;
      PAGE_PRESETS["custom"] = { label: `Custom ${w}×${h}\"`, w, h, dpi,
        bleedIn: 0.125, safeIn: 0.25, note: "Your own dimensions." };
      startWith("custom");
    });
  }
  $("#btn-new").addEventListener("click", () => newPageModal(false));

  function updatePageStatus() {
    const p = PAGE_PRESETS[App.page.presetKey] || { label: "Custom" };
    const vol = App.pages.length > 1 ? ` · page ${App.pageIndex + 1}/${App.pages.length}` : "";
    $("#st-page").textContent =
      `${App.projectName}${vol} — ${p.label} @ ${App.page.dpi}dpi (${App.page.w}×${App.page.h}px)`;
  }

  /* ---------- lasso action chip ---------- */
  const lassoChip = $("#lasso-actions");
  UI.showLassoActions = (bbox, count) => {
    // place BELOW the selection — above it would cover the rotation knob
    const s = Engine.toScreen(bbox.x, bbox.y + bbox.h);
    const stage = $("#stage");
    lassoChip.hidden = false;
    lassoChip.style.left = Math.max(8, Math.min(stage.clientWidth - 260, s.x)) + "px";
    lassoChip.style.top = Math.max(8, Math.min(stage.clientHeight - 48, s.y + 14)) + "px";
    $("#lasso-count").textContent = count + (count === 1 ? " stroke" : " strokes");
  };
  UI.hideLassoActions = () => { lassoChip.hidden = true; };
  $("#lasso-save").addEventListener("click", () => Tools.lassoSaveAsset());
  $("#lasso-del").addEventListener("click", () => Tools.lassoDelete());
  $("#lasso-clear").addEventListener("click", () => Tools.lassoClear());

  /* ---------- volume page tabs ---------- */
  UI.refreshPageTabs = () => {
    const host = $("#page-tabs");
    host.innerHTML = "";
    App.pages.forEach((_, i) => {
      const b = document.createElement("button");
      b.className = "ptab" + (i === App.pageIndex ? " on" : "");
      b.textContent = i + 1;
      b.title = `Page ${i + 1}`;
      b.addEventListener("click", async () => { await switchPage(i); updatePageStatus(); });
      host.appendChild(b);
    });
    const add = document.createElement("button");
    add.className = "ptab ptab-add";
    add.textContent = "＋";
    add.title = "Add a page to this volume";
    add.addEventListener("click", async () => { await addPage(); updatePageStatus(); });
    host.appendChild(add);
    if (App.pages.length > 1) {
      const del = document.createElement("button");
      del.className = "ptab ptab-del";
      del.textContent = "✕";
      del.title = "Delete the current page";
      del.addEventListener("click", async () => {
        if (!confirm(`Delete page ${App.pageIndex + 1}? This can't be undone.`)) return;
        await deleteCurrentPage(); updatePageStatus();
      });
      host.appendChild(del);
    }
  };

  $("#btn-export-all").addEventListener("click", async () => {
    syncCurrentPage();
    const cur = App.pageIndex;
    UI.flash(`Exporting ${App.pages.length} page(s)… allow multiple downloads if asked`);
    for (let i = 0; i < App.pages.length; i++) {
      await loadPage(App.pages[i]);
      Engine.exportPNG(Settings.get("exportBleed"), `_p${String(i + 1).padStart(2, "0")}`);
      await new Promise(r => setTimeout(r, 350));   // let each download start
    }
    await loadPage(App.pages[cur]);
    UI.refreshLayers(); App.dirty = true;
  });

  /* ---------- pop-out floating windows (read lessons while drawing) ---------- */
  let floatZ = 60, floatN = 0;
  UI.popout = (title, html) => {
    const win = document.createElement("div");
    win.className = "float-win";
    const off = (floatN++ % 6) * 26;
    win.style.left = 70 + off + "px";
    win.style.top = 16 + off + "px";
    win.style.zIndex = ++floatZ;
    win.innerHTML = `
      <div class="fw-head"><b>${title}</b><button class="fw-x">✕</button></div>
      <div class="fw-body">${html}</div>`;
    win.querySelector(".fw-x").addEventListener("click", () => win.remove());
    win.addEventListener("pointerdown", () => { win.style.zIndex = ++floatZ; });
    const head = win.querySelector(".fw-head");
    head.addEventListener("pointerdown", e => {
      if (e.target.classList.contains("fw-x")) return;
      const startX = e.clientX - win.offsetLeft, startY = e.clientY - win.offsetTop;
      const move = ev => {
        win.style.left = Math.max(0, ev.clientX - startX) + "px";
        win.style.top = Math.max(0, ev.clientY - startY) + "px";
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      e.preventDefault();
    });
    $("#stage").appendChild(win);
  };

  /* ---------- copy/paste (selected panel or lettering object) ---------- */
  let clipboard = null;   // { role, obj }
  function copySelection() {
    const sel = App.selection;
    clipboard = { role: sel.layer.role, obj: JSON.parse(JSON.stringify(sel.obj)) };
    UI.flash(`Copied ${sel.obj.type || "panel"} — Ctrl+V to paste`);
  }
  function pasteClipboard() {
    const layer = layerByRole(clipboard.role);
    if (!layer || layer.locked) return UI.flash("Target layer is locked 🔒");
    const before = JSON.stringify(layer.objects);
    const obj = JSON.parse(JSON.stringify(clipboard.obj));
    const off = Math.round(App.page.dpi * 0.15);   // cascade each paste
    obj.x += off; obj.y += off;
    if (obj.tail) { obj.tail.x += off; obj.tail.y += off; }
    layer.objects.push(obj);
    commitObjectChange(layer, before);
    clipboard.obj = JSON.parse(JSON.stringify(obj));
    App.selection = { layer, obj };
    App.dirty = true;
  }

  /* ---------- keyboard ---------- */
  const KEYMAP = { v: "select", l: "lasso", h: "pan", b: "ink", p: "pencil", m: "marker",
                   e: "eraser", s: "strokeeraser", g: "fill", k: "panel", t: "balloon" };
  window.addEventListener("keydown", e => {
    if (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT") return;
    if (e.code === "Space" && !e.repeat) { Tools.setSpacePan(true); e.preventDefault(); return; }
    if (e.ctrlKey || e.metaKey) {
      const k = e.key.toLowerCase();
      if (k === "z") { e.shiftKey ? Undo.redo() : Undo.undo(); e.preventDefault(); }
      else if (k === "y") { Undo.redo(); e.preventDefault(); }
      else if (k === "s") { $("#btn-save").click(); e.preventDefault(); }
      else if (k === "o") { $("#btn-open").click(); e.preventDefault(); }
      else if (k === "e") { $("#btn-export").click(); e.preventDefault(); }
      else if (k === "n" && e.altKey) { $("#btn-new").click(); e.preventDefault(); }
      else if (k === "0") { Engine.fitPage(); e.preventDefault(); }
      else if (k === "c" && App.selection) { copySelection(); e.preventDefault(); }
      else if (k === "x" && App.selection) {
        copySelection(); Tools.deleteSelection(); e.preventDefault();
      }
      else if (k === "v" && clipboard) { pasteClipboard(); e.preventDefault(); }
      return;
    }
    if (e.key === "Tab") {   // distraction-free: hide both side panels
      panelsHiddenByTab = !panelsHiddenByTab;
      UI.applySettings();
      e.preventDefault();
      return;
    }
    if (e.key === "Escape") { Tools.cancelPlacing(); Tools.lassoClear(); return; }
    const tool = KEYMAP[e.key.toLowerCase()];
    if (tool) return setTool(tool);
    if (e.key === "Delete" || e.key === "Backspace") {
      if (Tools.hasLasso()) Tools.lassoDelete();
      else Tools.deleteSelection();
    }
    if (e.key === "[") {
      if (Tools.scalePlacing(1 / 1.15)) return;
      $("#opt-size").value = Math.max(1, +$("#opt-size").value - 2); syncSize();
    }
    if (e.key === "]") {
      if (Tools.scalePlacing(1.15)) return;
      $("#opt-size").value = Math.min(120, +$("#opt-size").value + 2); syncSize();
    }
  });
  window.addEventListener("keyup", e => {
    if (e.code === "Space") Tools.setSpacePan(false);
  });

  /* ---------- guided tour ---------- */
  const Tour = (() => {
    const STEPS = [
      ["#toolrail", "Your tool rail. Top to bottom: select & pan, then the drawing tools (ink, blue pencil, marker, eraser, fill), geometry tools, and the comic tools — panels and four kinds of balloons. Hover anything for its shortcut."],
      ["#view", "The page. Red line = trim (where the printer cuts), blue dashes = safe area (keep text inside). Draw with your Slim Pen — pressure changes line width, the tail end erases. Fingers pan & pinch-zoom; your palm won't draw."],
      ["#side-tabs", "Five tabs: TOOL options (size, pressure, color) · LAYERS (the pro pipeline: Panels→Pencils→Colors→Inks→Lettering) · GUIDES (perspective grids & page templates) · LEARN (comic-craft mini-lessons) · LIBRARY (your drawing books + free classics)."],
      ["#tab-tool", "Tool options. 'Pressure → size' is what makes ink lines live and breathe. Smoothing steadies shaky lines — crank it for long confident curves."],
      ["[data-panel=tab-guides]", "In GUIDES: one-click page templates (6-grid, 9-panel, 4-koma, widescreen…), rule-of-thirds overlays, and a draggable 1/2/3-point perspective grid."],
      ["[data-panel=tab-learn]", "LEARN is the craft manual: panel transitions, balloon rules, the 180° rule, pacing, spotting blacks. Short enough to read mid-drawing."],
      ["#btn-save", "Save stores the whole layered project on your machine (the projects folder). Export PNG flattens the visible layers — hide Pencils first. That's it: pick a template and make a page! 🖋"],
    ];
    let i = -1, target = null;
    const pop = $("#tour-pop");
    function show() {
      if (target) target.classList.remove("tour-target");
      if (i >= STEPS.length) { pop.hidden = true; return; }
      const [sel, text] = STEPS[i];
      target = $(sel);
      if (!target) { i++; return show(); }
      target.classList.add("tour-target");
      $("#tour-text").textContent = text;
      $("#tour-count").textContent = `${i + 1} / ${STEPS.length}`;
      $("#tour-next").textContent = i === STEPS.length - 1 ? "Done ✓" : "Next ›";
      pop.hidden = false;
      const r = target.getBoundingClientRect();
      const px = Math.min(window.innerWidth - 310, Math.max(10, r.right + 12));
      pop.style.left = (r.right + 310 > window.innerWidth ? Math.max(10, r.left - 310) : px) + "px";
      pop.style.top = Math.min(window.innerHeight - 180, Math.max(10, r.top)) + "px";
    }
    $("#tour-next").addEventListener("click", () => { i++; show(); });
    $("#tour-skip").addEventListener("click", () => { i = STEPS.length; show(); });
    return { start() { i = 0; show(); localStorage.setItem("penshi-toured", "1"); } };
  })();
  $("#btn-tour").addEventListener("click", () => Tour.start());

  /* ---------- boot ---------- */
  newPage("us-comic");
  Tools.bind();
  Panels.buildTemplateList();
  Reference.buildLearn();
  Reference.buildLibrary();
  UI.refreshLibrary = Reference.buildLibrary;
  Tutorial.buildUI();
  UI.refreshLayers();
  UI.refreshUndoButtons();
  setTool("ink");
  UI.applySettings();
  Engine.start();
  updatePageStatus();

  if (!localStorage.getItem("penshi-toured")) newPageModal(true);
  else updatePageStatus();
})();
