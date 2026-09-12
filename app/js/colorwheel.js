/* ============================================================
   colorwheel.js — an HSV color wheel with harmony modes
   Lives in the Tool tab so it works everywhere (Studio and Learn).
   Outer ring = hue. Inner square = saturation (→) and value (↓).
   Harmony mode overlays the partner hues on the ring and offers
   them as swatches below the wheel.
   ============================================================ */
"use strict";

const ColorWheel = (() => {
  const SIZE = 196, R_OUT = 96, R_IN = 74, SQ = 96;   // px, square side
  let canvas, ctx, host;
  let h = 0, s = 0.8, v = 0.15;                       // current color
  let harmony = "none";
  let dragging = null;                                 // "ring" | "square"
  let ringCache = null;

  const HARMONIES = {
    none: [], monochromatic: [0, 0, 0],   // special: value/sat steps
    complementary: [180], analogous: [-30, 30], triadic: [120, 240],
    split: [150, 210], tetradic: [90, 180, 270],
  };

  /* ---------- color math ---------- */
  function hsvToRgb(h, s, v) {
    const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
    let r = 0, g = 0, b = 0;
    if (h < 60) [r, g, b] = [c, x, 0]; else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x]; else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x];
    return [r + m, g + m, b + m].map(u => Math.round(u * 255));
  }
  const toHex = ([r, g, b]) => "#" + [r, g, b].map(u => u.toString(16).padStart(2, "0")).join("");
  const hsvHex = (h, s, v) => toHex(hsvToRgb(((h % 360) + 360) % 360, s, v));
  function hexToHsv(hex) {
    const n = parseInt(hex.slice(1), 16);
    const r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    let hh = 0;
    if (d) {
      if (max === r) hh = 60 * (((g - b) / d) % 6);
      else if (max === g) hh = 60 * ((b - r) / d + 2);
      else hh = 60 * ((r - g) / d + 4);
    }
    return { h: (hh + 360) % 360, s: max ? d / max : 0, v: max };
  }

  function harmonyColors() {
    if (harmony === "monochromatic")
      return [[h, s, Math.min(1, v + 0.35)], [h, s * 0.5, v], [h, s, Math.max(0, v - 0.3)]].map(c => hsvHex(...c));
    return (HARMONIES[harmony] || []).map(off => hsvHex(h + off, s, v));
  }

  /* ---------- drawing ---------- */
  function drawRing() {
    ringCache = document.createElement("canvas");
    ringCache.width = ringCache.height = SIZE;
    const c = ringCache.getContext("2d"), cx = SIZE / 2, cy = SIZE / 2;
    for (let a = 0; a < 360; a += 1) {
      c.beginPath();
      c.arc(cx, cy, R_OUT, (a - 90.6) * Math.PI / 180, (a - 89) * Math.PI / 180);
      c.arc(cx, cy, R_IN, (a - 89) * Math.PI / 180, (a - 90.6) * Math.PI / 180, true);
      c.closePath();
      c.fillStyle = `hsl(${a},100%,50%)`; c.fill();
    }
  }

  function render() {
    if (!ctx) return;
    if (!ringCache) drawRing();
    const cx = SIZE / 2, cy = SIZE / 2;
    ctx.clearRect(0, 0, SIZE, SIZE);
    ctx.drawImage(ringCache, 0, 0);
    // saturation/value square for the current hue
    const x0 = cx - SQ / 2, y0 = cy - SQ / 2;
    const gh = ctx.createLinearGradient(x0, 0, x0 + SQ, 0);
    gh.addColorStop(0, "#fff"); gh.addColorStop(1, `hsl(${h},100%,50%)`);
    ctx.fillStyle = gh; ctx.fillRect(x0, y0, SQ, SQ);
    const gv = ctx.createLinearGradient(0, y0, 0, y0 + SQ);
    gv.addColorStop(0, "rgba(0,0,0,0)"); gv.addColorStop(1, "#000");
    ctx.fillStyle = gv; ctx.fillRect(x0, y0, SQ, SQ);
    ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1; ctx.strokeRect(x0 + .5, y0 + .5, SQ - 1, SQ - 1);
    // harmony partners on the ring
    for (const hex of harmonyColors()) {
      const hh = hexToHsv(hex).h, a = (hh - 90) * Math.PI / 180, rr = (R_OUT + R_IN) / 2;
      ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 5, 0, Math.PI * 2);
      ctx.fillStyle = hex; ctx.fill(); ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
    }
    // hue marker
    const a = (h - 90) * Math.PI / 180, rr = (R_OUT + R_IN) / 2;
    ctx.beginPath(); ctx.arc(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr, 7, 0, Math.PI * 2);
    ctx.strokeStyle = "#fff"; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.strokeStyle = "#000"; ctx.lineWidth = 1; ctx.stroke();
    // s/v marker
    const mx = x0 + s * SQ, my = y0 + (1 - v) * SQ;
    ctx.beginPath(); ctx.arc(mx, my, 6, 0, Math.PI * 2);
    ctx.strokeStyle = v > 0.5 ? "#000" : "#fff"; ctx.lineWidth = 2; ctx.stroke();
    renderSwatches();
  }

  function renderSwatches() {
    const row = host.querySelector(".cw-harmony");
    const cols = harmonyColors();
    row.innerHTML = cols.length
      ? cols.map(c => `<div class="swatch" style="background:${c}" title="${c}"></div>`).join("")
      : `<span class="muted" style="font-size:11px">pick a harmony to see partner colors</span>`;
    row.querySelectorAll(".swatch").forEach(el => el.addEventListener("click", () => UI.setColor(el.title, true)));
  }

  /* ---------- input ---------- */
  function pick(e, commit = true) {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) * (SIZE / r.width) - SIZE / 2;
    const y = (e.clientY - r.top) * (SIZE / r.height) - SIZE / 2;
    const d = Math.hypot(x, y);
    if (dragging === null) dragging = (d >= R_IN - 4 && d <= R_OUT + 4) ? "ring" : "square";
    if (dragging === "ring") {
      h = ((Math.atan2(y, x) * 180 / Math.PI) + 90 + 360) % 360;
    } else {
      s = Math.max(0, Math.min(1, (x + SQ / 2) / SQ));
      v = Math.max(0, Math.min(1, 1 - (y + SQ / 2) / SQ));
    }
    if (commit) UI.setColor(hsvHex(h, s, v), true);
    render();
  }

  function init(container) {
    host = container;
    host.innerHTML = `
      <div class="cw-head"><span class="muted">Color wheel</span>
        <select class="cw-mode" title="Harmony rule">
          <option value="none">no harmony</option>
          <option value="complementary">complementary</option>
          <option value="analogous">analogous</option>
          <option value="triadic">triadic</option>
          <option value="split">split-complementary</option>
          <option value="tetradic">tetradic</option>
          <option value="monochromatic">monochromatic</option>
        </select></div>
      <canvas class="cw-canvas" width="${SIZE}" height="${SIZE}"></canvas>
      <div class="swatch-row cw-harmony"></div>`;
    canvas = host.querySelector(".cw-canvas");
    ctx = canvas.getContext("2d");
    canvas.addEventListener("pointerdown", e => { canvas.setPointerCapture(e.pointerId); dragging = null; pick(e); });
    canvas.addEventListener("pointermove", e => { if (e.buttons & 1) pick(e); });
    canvas.addEventListener("pointerup", () => { dragging = null; });
    host.querySelector(".cw-mode").addEventListener("change", e => { harmony = e.target.value; render(); });
    setHex(Tools.state.color);
  }

  function setHex(hex) {
    if (!/^#[0-9a-f]{6}$/i.test(hex)) return;
    const c = hexToHsv(hex);
    if (c.s > 0.02 && c.v > 0.02) h = c.h;   // keep hue when the color is grey/black
    s = c.s; v = c.v;
    render();
  }

  return { init, setHex, harmonyColors, hsvHex, hexToHsv, setHarmony(m) { harmony = m; render(); } };
})();
