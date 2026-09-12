/* ============================================================
   learn/drill.js — the timed gesture drill
   A countdown that runs on the live page: when it hits zero the
   drawing layers are captured as a thumbnail and CLEARED, and the
   next pose starts. When the drill ends, the captured poses are
   handed back (Learn lays them out as a contact-sheet page so the
   whole session lands in the Portfolio).
   The student draws from a reference site in another window —
   Penshi never supplies or generates the poses.
   ============================================================ */
"use strict";

const Drill = (() => {
  const $ = s => document.querySelector(s);
  let hud = null, timer = null, st = null, audio = null;

  /* ---------- tiny beep (offline, no assets) ---------- */
  function beep(freq, dur) {
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const o = audio.createOscillator(), g = audio.createGain();
      o.frequency.value = freq; o.type = "sine";
      g.gain.setValueAtTime(0.0001, audio.currentTime);
      g.gain.exponentialRampToValueAtTime(0.18, audio.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + dur);
      o.connect(g).connect(audio.destination);
      o.start(); o.stop(audio.currentTime + dur);
    } catch { /* no audio: the HUD flash is enough */ }
  }

  /* ---------- HUD ---------- */
  function ensureHud() {
    if (hud) return hud;
    hud = document.createElement("div");
    hud.id = "drill-hud";
    hud.hidden = true;
    $("#stage").appendChild(hud);
    return hud;
  }

  function render() {
    if (!st) { hud.hidden = true; return; }
    hud.hidden = false;
    hud.classList.toggle("warn", st.left <= 3 && !st.paused);
    hud.classList.toggle("paused", st.paused);
    const mm = Math.floor(st.left / 60), ss = String(st.left % 60).padStart(2, "0");
    hud.innerHTML = `
      <div class="dh-time">${mm ? mm + ":" : ""}${mm ? ss : st.left}<small>${mm ? "" : " s"}</small></div>
      <div class="dh-meta">pose <b>${st.pose + 1}</b> / ${st.poses}${st.paused ? " · paused" : ""}</div>
      <div class="dh-row">
        <button id="dh-pause" title="Pause / resume (P)">${st.paused ? "Resume" : "Pause"}</button>
        <button id="dh-skip" title="Capture this pose now and move on (N)">Next ›</button>
        <button id="dh-stop" class="danger" title="End the drill and build the contact sheet">Finish</button>
      </div>`;
    $("#dh-pause").addEventListener("click", togglePause);
    $("#dh-skip").addEventListener("click", () => endPose());
    $("#dh-stop").addEventListener("click", () => finish());
  }

  /* ---------- the drawing layers ---------- */
  const drawLayers = () => App.layers.filter(l => l.kind === "raster" && !l.locked && l.name !== "Guide");

  function capture() {
    // hide the Guide layer so the thumbnail is the pose alone
    const g = App.layers.find(l => l.name === "Guide");
    const was = g ? g.visible : true;
    if (g) g.visible = false;
    const url = Engine.renderThumbnail(320);
    if (g) g.visible = was;
    return url;
  }

  function clearDrawing() {
    for (const layer of drawLayers()) {
      if (!layer.ops.length && !layer.baseImg) continue;
      const before = snapshotRaster(layer);
      const beforeOps = JSON.stringify(layer.ops);
      const beforeBase = layer.basePng;
      layer.canvas.getContext("2d").clearRect(0, 0, layer.canvas.width, layer.canvas.height);
      layer.ops = []; layer.baseImg = null; layer.basePng = null;
      layer._stamp = (layer._stamp || 0) + 1;
      const restoreBase = png => {
        layer.basePng = png;
        layer.baseImg = png ? Object.assign(new Image(), { src: png }) : null;
      };
      Undo.push({
        undo: () => { restoreRaster(layer, before); layer.ops = JSON.parse(beforeOps); restoreBase(beforeBase); },
        redo: () => {
          layer.canvas.getContext("2d").clearRect(0, 0, layer.canvas.width, layer.canvas.height);
          layer.ops = []; restoreBase(null); layer._stamp++;
        },
      });
    }
    App.dirty = true;
  }

  /* ---------- lifecycle ---------- */
  function start(opts = {}) {
    if (st) stop();
    ensureHud();
    st = {
      seconds: Math.max(5, opts.seconds || 30), poses: Math.max(1, opts.poses || 20),
      pose: 0, left: 0, thumbs: [], paused: false, onDone: opts.onDone || null,
    };
    st.left = st.seconds;
    timer = setInterval(tick, 1000);
    document.addEventListener("keydown", onKey);
    beep(660, 0.12);
    render();
    UI.flash?.(`Drill: ${st.poses} poses × ${st.seconds} s. Go.`);
  }

  function tick() {
    if (!st || st.paused) return;
    st.left--;
    if (st.left > 0 && st.left <= 3) beep(660, 0.08);
    if (st.left <= 0) endPose(); else render();
  }

  function endPose() {
    if (!st) return;
    st.thumbs.push(capture());
    clearDrawing();
    beep(880, 0.25);
    st.pose++;
    if (st.pose >= st.poses) { finish(); return; }
    st.left = st.seconds;
    render();
  }

  function togglePause() {
    if (!st) return;
    st.paused = !st.paused;
    render();
  }

  function onKey(e) {
    if (!st || e.target.matches("input, textarea, select")) return;
    if (e.key === "p" || e.key === "P") { togglePause(); e.preventDefault(); }
    else if (e.key === "n" || e.key === "N") { endPose(); e.preventDefault(); }
  }

  async function finish() {
    if (!st) return;
    const s = st;
    // an unfinished pose with marks on it still counts
    if (drawLayers().some(l => l.ops.length)) { s.thumbs.push(capture()); clearDrawing(); }
    stop();
    if (s.thumbs.length && s.onDone) await s.onDone(s.thumbs, s);
    else UI.flash?.("Drill ended — nothing was drawn.");
  }

  function stop() {
    clearInterval(timer); timer = null;
    document.removeEventListener("keydown", onKey);
    st = null;
    if (hud) hud.hidden = true;
  }

  return { start, stop, finish, isActive: () => !!st };
})();
