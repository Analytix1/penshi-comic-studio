/* ============================================================
   panels.js — comic panel objects & page templates
   Panels are vector objects on the "Panels" object layer:
   a white fill with a solid border, exactly like inked panel
   borders on a real art board. Templates reproduce classic
   layouts (grid, 9-panel, 4-koma, widescreen, splash).
   ============================================================ */
"use strict";

const Panels = (() => {
  let preview = null;

  const BORDER = () => Math.max(2, Math.round(App.page.dpi * 0.018)); // ~2.7px @150dpi

  /* ---------- rendering ---------- */
  function drawPanel(ctx, o) {
    ctx.fillStyle = "#ffffff";
    ctx.strokeStyle = "#111111";
    ctx.lineWidth = o.lineW || BORDER();
    ctx.beginPath();
    if (o.shape === "borderless") {
      ctx.rect(o.x, o.y, o.w, o.h); ctx.fill();
    } else {
      ctx.rect(o.x, o.y, o.w, o.h); ctx.fill(); ctx.stroke();
    }
  }
  function render(ctx, layer) {
    for (const o of layer.objects) drawPanel(ctx, o);
    if (preview) {
      ctx.save(); ctx.globalAlpha = 0.6; drawPanel(ctx, preview);
      ctx.strokeStyle = "#6db3f2"; ctx.setLineDash([8, 6]);
      ctx.strokeRect(preview.x, preview.y, preview.w, preview.h);
      ctx.restore();
    }
  }

  /* ---------- drag-to-create ---------- */
  function norm(a, b) {
    return { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y),
             w: Math.abs(b.x - a.x), h: Math.abs(b.y - a.y) };
  }
  function previewStart(p) { preview = { x: p.x, y: p.y, w: 1, h: 1 }; }
  function previewDrag(a, b) { preview = norm(a, b); App.dirty = true; }
  function commit(a, b) {
    preview = null;
    const r = norm(a, b);
    if (r.w < 40 || r.h < 40) { App.dirty = true; return; }  // accidental tap
    const layer = layerByRole("panels");
    const before = JSON.stringify(layer.objects);
    layer.objects.push(r);
    commitObjectChange(layer, before);
    App.dirty = true;
  }

  /* ---------- hit testing (for the select tool) ---------- */
  function hitTest(p) {
    const layer = layerByRole("panels");
    if (!layer || !layer.visible) return null;
    for (let i = layer.objects.length - 1; i >= 0; i--) {
      const o = layer.objects[i];
      if (p.x >= o.x && p.x <= o.x + o.w && p.y >= o.y && p.y <= o.y + o.h)
        return { layer, obj: o };
    }
    return null;
  }
  function bounds(o) { return { x: o.x, y: o.y, w: o.w, h: o.h }; }

  /* ============================================================
     Templates — rows of weighted cells inside the safe area.
     Each entry: rows: [[w,...], ...] where weights split the row.
     rowH optionally weights row heights.
     ============================================================ */
  const TEMPLATES = {
    "splash":   { label: "Splash", rows: [[1]] },
    "2x2":      { label: "4-grid", rows: [[1, 1], [1, 1]] },
    "2x3":      { label: "6-grid", rows: [[1, 1], [1, 1], [1, 1]] },
    "3x3":      { label: "9-panel (Watchmen)", rows: [[1, 1, 1], [1, 1, 1], [1, 1, 1]] },
    "wide-top": { label: "Establish + act", rows: [[1], [1, 1], [1, 1, 1]] },
    "widescreen": { label: "Widescreen", rows: [[1], [1], [1], [1]] },
    "4koma":    { label: "4-koma", rows: [[1], [1], [1], [1]], narrow: true },
    "action":   { label: "Action tier", rows: [[1, 1, 1], [1], [1, 1]] },
    "manga":    { label: "Manga mix", rows: [[2, 1], [1], [1, 2]] },
  };

  function applyTemplate(key, gutter) {
    const t = TEMPLATES[key];
    if (!t) return;
    const s = App.page.safe;
    let live = { x: s, y: s, w: App.page.w - 2 * s, h: App.page.h - 2 * s };
    if (t.narrow) {  // 4-koma runs as a centered narrow column
      const colW = live.w * 0.62;
      live = { x: live.x + (live.w - colW) / 2, y: live.y, w: colW, h: live.h };
    }
    const rows = t.rows;
    const rowH = (live.h - gutter * (rows.length - 1)) / rows.length;
    const objects = [];
    rows.forEach((weights, ri) => {
      const total = weights.reduce((a, b) => a + b, 0);
      const innerW = live.w - gutter * (weights.length - 1);
      let x = live.x;
      const y = live.y + ri * (rowH + gutter);
      for (const w of weights) {
        const cellW = innerW * (w / total);
        objects.push({ x: Math.round(x), y: Math.round(y),
                       w: Math.round(cellW), h: Math.round(rowH) });
        x += cellW + gutter;
      }
    });
    const layer = layerByRole("panels");
    const before = JSON.stringify(layer.objects);
    layer.objects = objects;
    commitObjectChange(layer, before);
    App.dirty = true;
    UI.flash(`Template: ${t.label}`);
  }

  /* thumbnails in the Guides tab */
  function buildTemplateList() {
    const host = document.getElementById("template-list");
    host.innerHTML = "";
    for (const [key, t] of Object.entries(TEMPLATES)) {
      const el = document.createElement("div");
      el.className = "tmpl";
      el.title = t.label;
      el.style.gridTemplateRows = `repeat(${t.rows.length}, 1fr)`;
      for (const weights of t.rows) {
        const row = document.createElement("div");
        row.style.cssText = `display:grid;gap:6%;background:none;
          grid-template-columns:${weights.map(w => w + "fr").join(" ")}`;
        for (let i = 0; i < weights.length; i++)
          row.appendChild(document.createElement("div"));
        el.appendChild(row);
      }
      el.addEventListener("click", () => applyTemplate(key, Tools.state.gutter));
      host.appendChild(el);
    }
  }

  return { render, previewStart, previewDrag, commit,
           hitTest, bounds, applyTemplate, buildTemplateList };
})();
