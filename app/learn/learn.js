/* ============================================================
   learn/learn.js — Learn mode
   A second top-level mode beside Studio. Owns:
     • the curriculum home (sections → chapters → lessons, progress)
     • the Portfolio (every practice attempt, thumbnails, timeline)
     • the lesson runner (attempt volume with Guide layers, the
       step panel in the sidebar, tool/layer/guide automation)
     • progress persistence (/api/learn/progress) and attempt
       persistence (/api/learn/attempts) — separate from projects/
   Entering Learn snapshots the studio document; leaving restores it.
   ============================================================ */
"use strict";

const Learn = (() => {
  const $ = s => document.querySelector(s);
  const CUR = window.PENSHI_CURRICULUM || [];
  const GUIDE_TINT = "#3b6ea8";
  const PAGE_PRESET = "us-letter";

  let progress = { lessons: {} };
  let attempts = [];
  let active = null;         // { s, c, l, attemptId, page, step }
  let studioSnap = null;
  let home = null;
  let view = "curriculum";
  let portfolioFilter = null;

  /* ---------- curriculum helpers ---------- */
  const allLessons = () => CUR.flatMap(s => s.chapters.flatMap(c => c.lessons.map(l => ({ s, c, l }))));
  const findLesson = id => allLessons().find(x => x.l.id === id);
  const stepKey = (p, i) => `${p}-${i}`;
  const lessonSteps = l => l.pages.reduce((n, pg) => n + pg.steps.length, 0);
  const lp = id => (progress.lessons[id] ||= { steps: [], done: false, attempts: 0 });
  const lessonPct = l => {
    const p = progress.lessons[l.id];
    return p ? Math.min(100, Math.round(p.steps.length / lessonSteps(l) * 100)) : 0;
  };
  const chapterPct = c => Math.round(c.lessons.reduce((n, l) => n + lessonPct(l), 0) / c.lessons.length);
  const sectionPct = s => Math.round(s.chapters.reduce((n, c) => n + chapterPct(c), 0) / s.chapters.length);
  const fmtDate = t => new Date(t).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });

  /* ---------- persistence ---------- */
  async function loadProgress() {
    try { progress = await (await fetch("/api/learn/progress")).json(); progress.lessons ||= {}; }
    catch { progress = { lessons: {} }; }
  }
  let saveTimer = null;
  function saveProgress() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => fetch("/api/learn/progress",
      { method: "POST", body: JSON.stringify(progress) }).catch(() => {}), 400);
  }
  async function loadAttempts() {
    try { attempts = (await (await fetch("/api/learn/attempts")).json()).attempts || []; }
    catch { attempts = []; }
  }

  /* ============================================================
     Mode switching
     ============================================================ */
  function setModeTabs() {
    document.querySelectorAll(".mtab").forEach(b =>
      b.classList.toggle("on", b.dataset.mode === App.mode));
  }

  async function enter() {
    if (App.mode === "learn") return;
    syncCurrentPage();
    studioSnap = {
      pages: JSON.parse(JSON.stringify(App.pages)), current: App.pageIndex,
      name: App.projectName, view: { ...App.view },
      guides: JSON.parse(JSON.stringify(App.guides)), activeLayer: App.activeLayer,
    };
    App.mode = "learn";
    document.body.classList.add("learn-mode");
    setModeTabs();
    $("#stab-learn").textContent = "Lesson";
    await Promise.all([loadProgress(), loadAttempts()]);
    showHome();
    renderLessonPanel();   // "pick a lesson" state
  }

  async function exit() {
    if (App.mode !== "learn") return;
    if (active) await closeLesson(true, false);
    App.mode = "studio";
    document.body.classList.remove("learn-mode");
    home.hidden = true;
    if (studioSnap) {
      App.pages = studioSnap.pages; App.pageIndex = studioSnap.current;
      App.projectName = studioSnap.name;
      await loadPage(App.pages[App.pageIndex]);
      Object.assign(App.guides, studioSnap.guides);
      App.view = studioSnap.view;
      App.activeLayer = Math.min(studioSnap.activeLayer, App.layers.length - 1);
      Undo.clear();
      UI.refreshLayers(); UI.refreshPageTabs(); UI.updatePageStatus?.();
      App.dirty = true;
    }
    setModeTabs();
    $("#stab-learn").textContent = "Craft";
    Reference.buildLearn();
  }

  /* ============================================================
     Home: curriculum + portfolio
     ============================================================ */
  function showHome() {
    home.hidden = false;
    renderHome();
  }

  function renderHome() {
    const lessons = allLessons();
    const doneN = lessons.filter(x => progress.lessons[x.l.id]?.done).length;
    const overall = Math.round(lessons.reduce((n, x) => n + lessonPct(x.l), 0) / lessons.length);
    home.innerHTML = `
      <div class="lh-head">
        <div class="lh-title">
          <b>Learn</b>
          <span class="muted">${doneN} / ${lessons.length} lessons complete · ${attempts.length} practice pages</span>
          <div class="lh-bar"><i style="width:${overall}%"></i></div>
        </div>
        <div class="lh-nav">
          <button class="${view === "curriculum" ? "on" : ""}" data-v="curriculum">Curriculum</button>
          <button class="${view === "portfolio" ? "on" : ""}" data-v="portfolio">Portfolio</button>
          <button id="lh-drill" title="Timed gesture drill: 30-second poses, the page clears itself">⏱ Drill</button>
          <button id="lh-studio" title="Back to drawing comics">◀ Studio</button>
        </div>
      </div>
      <div class="lh-body">${view === "curriculum" ? curriculumHtml() : portfolioHtml()}</div>`;
    home.querySelectorAll("[data-v]").forEach(b => b.addEventListener("click", () => {
      view = b.dataset.v; if (view === "curriculum") portfolioFilter = null; renderHome();
    }));
    $("#lh-studio").addEventListener("click", exit);
    $("#lh-drill").addEventListener("click", () => startLesson("gest-drill"));
    home.querySelectorAll("[data-start]").forEach(b => b.addEventListener("click", () => startLesson(b.dataset.start)));
    home.querySelectorAll("[data-continue]").forEach(b => b.addEventListener("click", () => {
      const a = attempts.find(x => x.lessonId === b.dataset.continue);
      if (a) startLesson(a.lessonId, a.id);
    }));
    home.querySelectorAll("[data-attempts]").forEach(b => b.addEventListener("click", () => {
      portfolioFilter = b.dataset.attempts; view = "portfolio"; renderHome();
    }));
    home.querySelectorAll("[data-open]").forEach(el => el.addEventListener("click", e => {
      if (e.target.classList.contains("pf-del")) return;
      const a = attempts.find(x => x.id === el.dataset.open);
      if (a) startLesson(a.lessonId, a.id);
    }));
    home.querySelectorAll(".pf-del").forEach(b => b.addEventListener("click", async e => {
      e.stopPropagation();
      if (!await UI.confirm("Delete this practice page from your Portfolio? This can't be undone.")) return;
      await fetch(`/api/learn/attempts/${b.dataset.id}`, { method: "DELETE" });
      await loadAttempts(); renderHome();
    }));
    const clr = $("#pf-clear"); if (clr) clr.addEventListener("click", () => { portfolioFilter = null; renderHome(); });
  }

  function curriculumHtml() {
    return CUR.map((s, si) => `
      <details class="lh-sec" ${si === firstOpenSection() ? "open" : ""}>
        <summary>
          <span class="lh-num">${s.num}</span>
          <span class="lh-sectitle"><b>${s.title}</b><span class="muted">${s.tagline}</span></span>
          <span class="lh-pct">${sectionPct(s)}%</span>
        </summary>
        ${s.chapters.map(c => `
          <div class="lh-chap">
            <div class="lh-chaphead"><b>${c.title}</b><span class="lh-pct">${chapterPct(c)}%</span></div>
            <p class="lh-summary">${c.summary}</p>
            ${c.lessons.map(l => {
              const p = progress.lessons[l.id], pct = lessonPct(l);
              const n = attempts.filter(a => a.lessonId === l.id).length;
              const icon = p?.done ? "✓" : pct > 0 ? "◐" : "○";
              return `<div class="lh-lesson ${p?.done ? "done" : ""}">
                <span class="lh-icon">${icon}</span>
                <span class="lh-ltitle"><b>${l.title}</b>
                  <span class="muted">${l.minutes} min · ${lessonSteps(l)} steps · ${l.pages.length} page${l.pages.length > 1 ? "s" : ""}</span>
                  <div class="lh-bar sm"><i style="width:${pct}%"></i></div></span>
                <span class="lh-actions">
                  ${n ? `<button data-attempts="${l.id}" title="See your practice pages">${n} page${n > 1 ? "s" : ""}</button>
                         <button data-continue="${l.id}" title="Reopen your latest practice">Continue</button>` : ""}
                  <button class="primary" data-start="${l.id}">${n ? "New attempt" : "Start"}</button>
                </span></div>`; }).join("")}
          </div>`).join("")}
      </details>`).join("");
  }
  function firstOpenSection() {
    const i = CUR.findIndex(s => sectionPct(s) < 100);
    return i < 0 ? 0 : i;
  }

  function portfolioHtml() {
    const list = portfolioFilter ? attempts.filter(a => a.lessonId === portfolioFilter) : attempts;
    const filt = portfolioFilter ? findLesson(portfolioFilter)?.l.title : null;
    if (!list.length) return `<div class="lh-empty">No practice pages yet${filt ? ` for “${filt}”` : ""}.
      Every lesson you work on is saved here automatically as you move between pages —
      come back in a month and scroll through your progress.
      ${filt ? `<div><button id="pf-clear">Show all</button></div>` : ""}</div>`;
    return `${filt ? `<div class="pf-filter">Showing <b>${filt}</b> <button id="pf-clear">Show all</button></div>` : ""}
      <div class="pf-grid">${list.map(a => `
        <div class="pf-card" data-open="${a.id}" title="Open this practice page">
          <img src="${a.thumb || ""}" alt="">
          <div class="pf-meta"><b>${a.lessonTitle}</b>
            <span class="muted">${a.sectionTitle ? a.sectionTitle + " · " : ""}${fmtDate(a.savedAt)} · ${a.pageCount || 1} pg</span></div>
          <button class="pf-del" data-id="${a.id}" title="Delete">✕</button>
        </div>`).join("")}</div>`;
  }

  /* ============================================================
     Attempts: building a lesson's pages
     ============================================================ */
  function wrapText(ctx, text, x, y, maxW, lh) {
    let line = "";
    for (const word of text.split(" ")) {
      const t = line ? line + " " + word : word;
      if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); line = word; y += lh; }
      else line = t;
    }
    ctx.fillText(line, x, y);
    return y + lh;
  }
  function paintHints(ctx, pg) {
    const P = App.page;
    ctx.fillStyle = "#1b2a3a"; ctx.textBaseline = "middle";
    ctx.font = `600 ${P.dpi * 0.2}px "Segoe UI", system-ui, sans-serif`;
    ctx.fillText(pg.title, P.w * 0.08, P.h * 0.06);
    ctx.font = `${P.dpi * 0.12}px "Segoe UI", system-ui, sans-serif`;
    let y = P.h * 0.11;
    (pg.hints || []).forEach((h, i) => { y = wrapText(ctx, `${i + 1}.  ${h}`, P.w * 0.08, y, P.w * 0.84, P.dpi * 0.17) + P.dpi * 0.06; });
  }

  function buildAttemptPages(lesson) {
    App.pages = [];
    lesson.pages.forEach(pg => {
      buildFreshPage(PAGE_PRESET);
      const colorful = pg.exemplar && Exemplars.isColorful(pg.exemplar);
      const g = makeRasterLayer("Guide", { tint: colorful ? null : GUIDE_TINT, opacity: 0.85 });
      g.locked = true;
      App.layers.splice(1, 0, g);
      const ctx = g.canvas.getContext("2d");
      if (pg.exemplar) Exemplars.paint(ctx, pg.exemplar, App.page);
      else paintHints(ctx, pg);
      g._stamp = 1;
      App.pages.push(serializePage(true));
    });
    App.pageIndex = 0;
  }

  async function startLesson(id, attemptId) {
    const found = findLesson(id);
    if (!found) return;
    if (active) await closeLesson(true, false);
    if (attemptId) {
      try {
        const data = await (await fetch(`/api/learn/attempts/${attemptId}`)).json();
        App.pages = data.project.pages; App.pageIndex = Math.min(data.project.current || 0, App.pages.length - 1);
      } catch { UI.flash("Couldn't open that practice page."); return; }
    } else {
      buildAttemptPages(found.l);
      attemptId = `${id}-${Date.now()}`;
      lp(id).attempts++;
    }
    await loadPage(App.pages[App.pageIndex]);
    App.projectName = attemptId;
    Undo.clear();
    active = { ...found, attemptId, page: App.pageIndex, step: 0 };
    lp(id).lastAt = Date.now(); saveProgress();
    home.hidden = true;
    UI.refreshLayers(); UI.refreshPageTabs(); Engine.fitPage(); App.dirty = true;
    $("#stab-learn").click();
    applyStep(); renderLessonPanel();
  }

  async function closeLesson(save, goHome = true) {
    if (!active) return;
    if (Drill.isActive()) await Drill.finish();   // lands the contact sheet before we leave
    if (save) await saveAttempt(true);
    active = null;
    if (goHome && App.mode === "learn") { showHome(); renderLessonPanel(); }
  }

  async function saveAttempt(quiet = false) {
    if (!active) return;
    syncCurrentPage();
    const body = {
      lessonId: active.l.id, lessonTitle: active.l.title,
      chapterTitle: active.c.title, sectionTitle: active.s.title,
      savedAt: Date.now(), pageCount: App.pages.length,
      thumb: Engine.renderThumbnail(240),
      project: { version: 2, name: active.attemptId, pages: App.pages, current: App.pageIndex },
    };
    try {
      await fetch(`/api/learn/attempts/${active.attemptId}`, { method: "POST", body: JSON.stringify(body) });
      if (!quiet) UI.flash("Saved to your Portfolio ✓");
    } catch { UI.flash("Couldn't save practice — is server.py running?"); }
    await loadAttempts();
  }

  /* ============================================================
     Timed gesture drill → contact-sheet page
     ============================================================ */
  function startDrill(seconds, poses) {
    if (!active) return;
    Drill.start({ seconds, poses, onDone: buildContactSheet });
  }

  async function buildContactSheet(thumbs, drill) {
    // a new page in the attempt: a locked Guide layer carries the caption,
    // the poses go on Inks as image ops (so they survive rebuilds and can be
    // lasso-moved like anything else)
    await addPage();
    const g = makeRasterLayer("Guide", { tint: GUIDE_TINT, opacity: 0.85 });
    g.locked = true;
    App.layers.splice(1, 0, g);
    const P = App.page, gctx = g.canvas.getContext("2d");
    gctx.fillStyle = "#1b2a3a"; gctx.textBaseline = "middle";
    gctx.font = `600 ${P.dpi * 0.2}px "Segoe UI", system-ui, sans-serif`;
    gctx.fillText(`Gesture drill — ${thumbs.length} pose${thumbs.length > 1 ? "s" : ""} × ${drill.seconds} s`, P.w * 0.08, P.h * 0.05);
    gctx.font = `${P.dpi * 0.11}px "Segoe UI", system-ui, sans-serif`;
    gctx.fillText(fmtDate(Date.now()) + " · which three are the most alive? Circle them, then ask why.", P.w * 0.08, P.h * 0.085);
    g._stamp = 1;

    const inks = App.layers.find(l => l.name === "Inks") || App.layers.find(l => l.kind === "raster" && !l.locked);
    const ictx = inks.canvas.getContext("2d");
    const cols = Math.ceil(Math.sqrt(thumbs.length)), rows = Math.ceil(thumbs.length / cols);
    const x0 = P.w * 0.06, y0 = P.h * 0.12, gw = P.w * 0.88, gh = P.h * 0.84, gap = P.dpi * 0.08;
    const cw = (gw - gap * (cols - 1)) / cols, ch = (gh - gap * (rows - 1)) / rows;
    for (let i = 0; i < thumbs.length; i++) {
      const img = new Image(); img.src = thumbs[i];
      try { await img.decode(); } catch { continue; }
      const s = Math.min(cw / img.width, ch / img.height);
      const w = img.width * s, h = img.height * s;
      const x = x0 + (i % cols) * (cw + gap) + (cw - w) / 2, y = y0 + Math.floor(i / cols) * (ch + gap) + (ch - h) / 2;
      const op = { kind: "image", src: thumbs[i], x, y, w, h };
      ictx.drawImage(img, x, y, w, h);
      inks.ops.push(op);
    }
    inks._stamp = (inks._stamp || 0) + 1;
    App.activeLayer = App.layers.indexOf(inks);
    App.dirty = true;
    UI.refreshLayers(); UI.refreshPageTabs(); Engine.fitPage();
    await saveAttempt(true);
    UI.flash(`Drill done: ${thumbs.length} poses on a contact sheet (page ${App.pageIndex + 1}) ✓`);
  }

  /* ============================================================
     Step runner
     ============================================================ */
  const curPage = () => active.l.pages[active.page];

  function applyStep() {
    const st = curPage().steps[active.step];
    if (!st) return;
    if (st.layer) {
      const i = App.layers.findIndex(l => l.name === st.layer);
      if (i >= 0) App.activeLayer = i;
      UI.refreshLayers();
    }
    if (st.tool) UI.setTool(st.tool);
    if (st.guide) {
      Object.assign(App.guides, st.guide);
      const cb = $("#g-persp"); if (cb) cb.checked = !!App.guides.persp;
      const sel = $("#g-vps"); if (sel && st.guide.vps) sel.value = String(st.guide.vps);
    }
    App.dirty = true;
  }

  function setStepDone(page, idx, done) {
    const p = lp(active.l.id), k = stepKey(page, idx), i = p.steps.indexOf(k);
    if (done && i < 0) p.steps.push(k);
    if (!done && i >= 0) p.steps.splice(i, 1);
    const was = p.done;
    p.done = p.steps.length >= lessonSteps(active.l);
    if (p.done && !was) p.doneAt = Date.now();
    p.lastAt = Date.now();
    saveProgress();
  }
  const isStepDone = (page, idx) => !!progress.lessons[active.l.id]?.steps.includes(stepKey(page, idx));

  async function next() {
    setStepDone(active.page, active.step, true);
    const pg = curPage();
    if (active.step < pg.steps.length - 1) {
      active.step++;
    } else if (active.page < active.l.pages.length - 1) {
      await saveAttempt(true);
      active.page++; active.step = 0;
      await switchPage(active.page);
      Engine.fitPage();
    } else {
      await saveAttempt(true);
      UI.flash(`Lesson complete: ${active.l.title} ✓`);
      await closeLesson(false);
      return;
    }
    applyStep(); renderLessonPanel();
  }
  async function prev() {
    if (active.step > 0) active.step--;
    else if (active.page > 0) {
      await saveAttempt(true);
      active.page--; active.step = curPage().steps.length - 1;
      await switchPage(active.page);
      Engine.fitPage();
    } else return;
    applyStep(); renderLessonPanel();
  }

  /* someone clicked a page tab directly */
  function onPagesRefreshed() {
    if (!active || App.mode !== "learn") return;
    if (App.pageIndex !== active.page && App.pageIndex < active.l.pages.length) {
      active.page = App.pageIndex; active.step = 0;
      applyStep(); renderLessonPanel();
    }
  }

  function renderLessonPanel() {
    const host = $("#learn-content");
    if (!host || App.mode !== "learn") return;
    if (!active) {
      host.innerHTML = `<div class="hint" style="margin-top:0">Pick a lesson from the curriculum
        to open it here. Lessons paint guide drawings onto a locked <b>Guide</b> layer of a fresh
        practice page; your work is saved to the Portfolio as you go.</div>
        <div class="row"><button id="ls-home">Open curriculum</button></div>`;
      $("#ls-home").addEventListener("click", showHome);
      return;
    }
    const pg = curPage();
    const lastPage = active.page === active.l.pages.length - 1;
    const lastStep = active.step === pg.steps.length - 1;
    const doneCount = progress.lessons[active.l.id]?.steps.length || 0;
    host.innerHTML = `
      <div class="ls-head">
        <button id="ls-back" title="Back to the curriculum (saves your page)">◀ Curriculum</button>
        <span class="muted">${active.s.num} · ${active.c.title}</span>
      </div>
      <h3 class="ls-title">${active.l.title}</h3>
      <div class="lh-bar sm"><i style="width:${Math.round(doneCount / lessonSteps(active.l) * 100)}%"></i></div>
      <div class="ls-goal"><b>Goal:</b> ${active.l.goal}</div>
      <div class="ls-page">Page ${active.page + 1} of ${active.l.pages.length} — <b>${pg.title}</b></div>
      <ol class="ls-steps">${pg.steps.map((st, i) => `
        <li class="${isStepDone(active.page, i) ? "done" : ""} ${i === active.step ? "cur" : ""}" data-i="${i}">
          <label class="ls-check"><input type="checkbox" data-chk="${i}" ${isStepDone(active.page, i) ? "checked" : ""}></label>
          <div class="ls-body"><b>${st.h}</b>${i === active.step ? `<p>${st.t}</p>
            ${st.drill ? `<div class="ls-drill">
              <select id="ls-drill-sec" title="Seconds per pose">${[15, 30, 45, 60, 90, 120].map(s =>
                `<option value="${s}" ${s === (st.drill.seconds || 30) ? "selected" : ""}>${s} s</option>`).join("")}</select>
              <select id="ls-drill-n" title="Number of poses">${[5, 10, 15, 20, 30, 40].map(n =>
                `<option value="${n}" ${n === (st.drill.poses || 20) ? "selected" : ""}>${n} poses</option>`).join("")}</select>
              <button id="ls-drill-go" class="primary">⏱ Start drill</button></div>` : ""}
            ${st.tool || st.layer ? `<span class="ls-auto">${st.tool ? "tool: " + st.tool : ""}${st.tool && st.layer ? " · " : ""}${st.layer ? "layer: " + st.layer : ""}</span>` : ""}` : ""}</div>
        </li>`).join("")}</ol>
      <div class="row">
        <button id="ls-prev" ${active.step === 0 && active.page === 0 ? "disabled" : ""}>‹ Back</button>
        <span class="spacer"></span>
        <button id="ls-next" class="primary">${lastPage && lastStep ? "Finish lesson ✓" : lastStep ? "Next page ›" : "Next ›"}</button>
      </div>
      ${pg.hints ? `<details class="learn" open><summary>Page hints</summary><div class="body"><ul>${pg.hints.map(h => `<li>${h}</li>`).join("")}</ul></div></details>` : ""}
      <details class="learn"><summary>Why this matters</summary><div class="body">${active.l.why}</div></details>
      <details class="learn" open><summary>References (${active.l.refs.length})</summary>
        <div class="body">${active.l.refs.map(resourceLink).join("")}</div></details>
      ${lastPage ? `<details class="learn"><summary>Reflect</summary><div class="body"><ul>${active.l.reflect.map(r => `<li>${r}</li>`).join("")}</ul></div></details>` : ""}
      <div class="row" style="margin-top:10px">
        <button id="ls-save">Save to Portfolio</button>
        <button id="ls-guide" title="Show/hide the blue guide drawing">Guide layer</button>
      </div>`;
    $("#ls-back").addEventListener("click", () => closeLesson(true));
    $("#ls-prev").addEventListener("click", prev);
    $("#ls-next").addEventListener("click", next);
    $("#ls-save").addEventListener("click", () => saveAttempt(false));
    $("#ls-guide").addEventListener("click", () => {
      const g = App.layers.find(l => l.name === "Guide");
      if (g) { g.visible = !g.visible; App.dirty = true; UI.refreshLayers(); }
    });
    const go = $("#ls-drill-go");
    if (go) go.addEventListener("click", e => {
      e.stopPropagation();
      startDrill(+$("#ls-drill-sec").value, +$("#ls-drill-n").value);
    });
    host.querySelectorAll(".ls-steps li").forEach(li => li.addEventListener("click", e => {
      if (e.target.tagName === "INPUT" || e.target.closest(".ls-drill")) return;
      active.step = +li.dataset.i; applyStep(); renderLessonPanel();
    }));
    host.querySelectorAll("[data-chk]").forEach(cb => cb.addEventListener("change", () => {
      setStepDone(active.page, +cb.dataset.chk, cb.checked); renderLessonPanel();
    }));
  }

  /* ============================================================ */
  function init() {
    home = $("#learn-home");
    App.mode = "studio";
    document.querySelectorAll(".mtab").forEach(b => b.addEventListener("click", () =>
      b.dataset.mode === "learn" ? enter() : exit()));
    UI.onPagesRefreshed = onPagesRefreshed;
  }

  return { init, enter, exit, startLesson, saveAttempt, startDrill,
           isActive: () => App.mode === "learn", hasLesson: () => !!active,
           lessonCount: () => allLessons().length };
})();
