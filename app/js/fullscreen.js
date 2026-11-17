/* ============================================================
   fullscreen.js — full-screen drawing mode.
   The page fills the window; the tool rail and the sidebar become
   floating widgets you can drag, collapse, hide and (for the tools)
   re-flow as a column, a row or a grid. A small floating bar holds
   Undo / Redo / Save and brings hidden widgets back. Positions are
   remembered in Settings ("fsWidgets").
   ============================================================ */
"use strict";

(() => {
  const $ = s => document.querySelector(s);
  const rail = $("#toolrail"), side = $("#sidebar");
  const LAYOUTS = ["col", "grid", "row"];
  const LAYOUT_NAME = { col: "column", grid: "grid", row: "row" };
  const DEF = { tools: { x: 12, y: 64, layout: "col", collapsed: false, hidden: false },
                side:  { x: null, y: 64, w: 292, h: null, collapsed: false, hidden: false },
                bar:   { x: null, y: 10, collapsed: false } };
  let on = false, native = false;

  const state = () => {
    const s = Settings.get("fsWidgets") || {};
    return { tools: { ...DEF.tools, ...s.tools }, side: { ...DEF.side, ...s.side }, bar: { ...DEF.bar, ...s.bar } };
  };
  const save = patch => { const s = state(); for (const k in patch) Object.assign(s[k], patch[k]); Settings.set("fsWidgets", s); };

  /* ---------- the floating bar ---------- */
  const bar = document.createElement("div");
  bar.id = "fs-bar";
  bar.innerHTML = `
    <div class="fs-handle" title="Drag to move"><span class="fs-grip">⠿</span></div>
    <button data-do="undo" title="Undo (Ctrl+Z)">↩</button>
    <button data-do="redo" title="Redo (Ctrl+Y)">↪</button>
    <button data-do="save" title="Save (Ctrl+S)">Save</button>
    <button data-do="tools" title="Show or hide the tools widget">Tools</button>
    <button data-do="side" title="Show or hide the panels widget">Panels</button>
    <button data-do="fit" title="Fit the page to the screen (Ctrl+0)">Fit</button>
    <button data-do="exit" title="Leave full screen (F)">Exit</button>`;
  document.body.appendChild(bar);

  const handle = (title, extra = "") => {
    const h = document.createElement("div");
    h.className = "fs-handle"; h.title = "Drag to move";
    h.innerHTML = `<span class="fs-grip">⠿</span><span class="fs-title">${title}</span>${extra}
      <button class="fs-btn" data-do="collapse" title="Collapse or expand">▾</button>
      <button class="fs-btn" data-do="hide" title="Hide (bring it back from the floating bar)">✕</button>`;
    return h;
  };
  const railHandle = handle("", `<button class="fs-btn" data-do="layout" title="Change layout: column, grid, row">▦</button>`);
  const sideHandle = handle("Panels");
  rail.prepend(railHandle); side.prepend(sideHandle);

  const WIDGETS = { tools: [rail, railHandle], side: [side, sideHandle], bar: [bar, bar.querySelector(".fs-handle")] };

  /* ---------- placement ---------- */
  const clamp = (el, x, y) => {
    const r = el.getBoundingClientRect(), W = innerWidth, H = innerHeight;
    return [Math.max(4, Math.min(W - Math.min(r.width, W) - 4, x)), Math.max(4, Math.min(H - 34, y))];
  };
  function place() {
    if (!on) return;
    const s = state();
    rail.classList.remove("fs-col", "fs-grid", "fs-row"); rail.classList.add("fs-" + s.tools.layout);
    rail.classList.toggle("fs-collapsed", s.tools.collapsed); side.classList.toggle("fs-collapsed", s.side.collapsed);
    side.style.width = s.side.w + "px";
    side.style.height = s.side.collapsed ? "" : (s.side.h ? s.side.h + "px" : "");
    for (const k of ["tools", "side", "bar"]) {
      const el = WIDGETS[k][0], w = s[k];
      const r = el.getBoundingClientRect();
      const x0 = w.x ?? (k === "side" ? innerWidth - r.width - 12 : (innerWidth - r.width) / 2);
      const [x, y] = clamp(el, x0, w.y);
      el.style.left = x + "px"; el.style.top = y + "px";
      if (k !== "bar") el.style.maxHeight = Math.max(60, innerHeight - y - 6) + "px";
    }
    for (const b of bar.querySelectorAll("[data-do=tools],[data-do=side]"))
      b.classList.toggle("on", !s[b.dataset.do].hidden);
  }
  function unplace() {
    for (const el of [rail, side, bar]) { el.style.left = el.style.top = el.style.maxHeight = ""; }
    side.style.width = side.style.height = "";
    rail.classList.remove("fs-col", "fs-grid", "fs-row", "fs-collapsed"); side.classList.remove("fs-collapsed");
  }

  /* ---------- dragging ---------- */
  for (const [key, [el, h]] of Object.entries(WIDGETS)) {
    let drag = null;
    h.addEventListener("pointerdown", e => {
      if (!on || e.target.closest("button")) return;
      const r = el.getBoundingClientRect();
      drag = { dx: e.clientX - r.left, dy: e.clientY - r.top };
      h.setPointerCapture(e.pointerId); h.classList.add("dragging"); e.preventDefault();
    });
    h.addEventListener("pointermove", e => {
      if (!drag) return;
      const [x, y] = clamp(el, e.clientX - drag.dx, e.clientY - drag.dy);
      el.style.left = x + "px"; el.style.top = y + "px";
    });
    const end = () => {
      if (!drag) return;
      drag = null; h.classList.remove("dragging");
      save({ [key]: { x: parseFloat(el.style.left), y: parseFloat(el.style.top) } });
    };
    h.addEventListener("pointerup", end); h.addEventListener("pointercancel", end);
    h.addEventListener("click", e => {
      const b = e.target.closest("[data-do]"); if (!b || !on) return;
      const s = state()[key];
      if (b.dataset.do === "collapse") save({ [key]: { collapsed: !s.collapsed } });
      else if (b.dataset.do === "hide") { save({ [key]: { hidden: true } }); UI.flash("Hidden. Bring it back from the floating bar."); }
      else if (b.dataset.do === "layout") {
        const next = LAYOUTS[(LAYOUTS.indexOf(s.layout) + 1) % LAYOUTS.length];
        save({ tools: { layout: next } }); UI.flash("Tools: " + LAYOUT_NAME[next]);
      }
    });
  }
  /* remember a hand-resized panels widget. Only a resize made while the
     pointer is held on the widget counts: the widget also changes size when
     full screen starts or the window changes, and those must not be saved. */
  let held = false, resized = false;
  side.addEventListener("pointerdown", () => { held = true; resized = false; }, true);
  new ResizeObserver(() => { if (on && held && !side.classList.contains("fs-collapsed")) resized = true; }).observe(side);
  const release = () => {
    if (held && resized && on) { const r = side.getBoundingClientRect(); save({ side: { w: Math.round(r.width), h: Math.round(r.height) } }); }
    held = resized = false;
  };
  window.addEventListener("pointerup", release, true); window.addEventListener("pointercancel", release, true);

  bar.addEventListener("click", e => {
    const b = e.target.closest("button[data-do]"); if (!b) return;
    const d = b.dataset.do;
    if (d === "undo") $("#btn-undo").click();
    else if (d === "redo") $("#btn-redo").click();
    else if (d === "save") $("#btn-save").click();
    else if (d === "fit") Engine.fitPage();
    else if (d === "exit") UI.setFullscreen(false);
    else save({ [d]: { hidden: !state()[d].hidden } });
  });

  /* ---------- on / off ---------- */
  UI.fsVisible = which => on ? !state()[which].hidden : null;   // null = not in full screen
  UI.fsRefresh = place;
  UI.resetFsWidgets = () => { Settings.set("fsWidgets", {}); };
  UI.setFullscreen = async want => {
    if (want === on) return;
    on = want;
    document.body.classList.toggle("fs", on);
    if (on) {
      UI.applySettings();        // float the widgets at their saved places straight away
      try { await document.documentElement.requestFullscreen(); native = true; } catch { native = false; }
      /* switched off again while the browser was still granting it */
      if (!on) { if (document.fullscreenElement) { try { await document.exitFullscreen(); } catch {} } native = false; return; }
    } else {
      unplace();
      if (native && document.fullscreenElement) { try { await document.exitFullscreen(); } catch {} }
      native = false;
    }
    UI.applySettings();
    requestAnimationFrame(() => { place(); Engine.resize(); Engine.fitPage(); });
    $("#btn-fullscreen")?.classList.toggle("on", on);
    if (on) UI.flash("Full screen. Drag the widgets by their top strip; F or Exit leaves.");
  };
  UI.toggleFullscreen = () => UI.setFullscreen(!on);
  document.addEventListener("fullscreenchange", () => {
    if (on && native && !document.fullscreenElement) UI.setFullscreen(false);   // Esc left the browser's full screen
    else requestAnimationFrame(() => { place(); Engine.resize(); });
  });
  window.addEventListener("resize", () => on && place());

  $("#btn-fullscreen")?.addEventListener("click", UI.toggleFullscreen);
  $("#btn-rail")?.addEventListener("click", () => {
    Settings.set("showToolRail", !Settings.get("showToolRail"));
    UI.flash(Settings.get("showToolRail") ? "Tools shown" : "Tools hidden — Shift+Tab or this button brings them back");
  });
  UI.applySettings();
})();
