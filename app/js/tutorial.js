/* ============================================================
   tutorial.js — Draw School: a hands-on beginner drawing course
   Each lesson step can project a faint EXEMPLAR drawing onto the
   canvas (a light-table overlay, never exported) and configure
   the right tool, so total beginners practice ON the page, not
   by reading. Progress persists in localStorage.
   ============================================================ */
"use strict";

const Tutorial = (() => {
  const DONE_KEY = "inkwell-drawschool";
  let active = null;        // { lesson, step }

  /* -------- drawing helpers (page-fraction coordinates) -------- */
  const X = f => App.page.w * f;
  const Y = f => App.page.h * f;
  function style(ctx, dash) {
    ctx.strokeStyle = "rgba(109,179,242,.65)";
    ctx.fillStyle = "rgba(109,179,242,.65)";
    ctx.lineWidth = Math.max(2, App.page.dpi * 0.014);
    ctx.setLineDash(dash ? [8, 7] : []);
    ctx.font = `${App.page.dpi * 0.09}px "Segoe UI", sans-serif`;
  }
  const line = (ctx, x1, y1, x2, y2) => {
    ctx.beginPath(); ctx.moveTo(X(x1), Y(y1)); ctx.lineTo(X(x2), Y(y2)); ctx.stroke();
  };
  const ellipse = (ctx, cx, cy, rx, ry, rot = 0) => {
    ctx.beginPath();
    ctx.ellipse(X(cx), Y(cy), X(rx), X(ry), rot, 0, Math.PI * 2); ctx.stroke();
  };
  const dot = (ctx, x, y) => {
    ctx.beginPath(); ctx.arc(X(x), Y(y), App.page.dpi * 0.02, 0, Math.PI * 2); ctx.fill();
  };
  const label = (ctx, x, y, t) => ctx.fillText(t, X(x), Y(y));
  const curve = (ctx, x1, y1, cx, cy, x2, y2) => {
    ctx.beginPath(); ctx.moveTo(X(x1), Y(y1));
    ctx.quadraticCurveTo(X(cx), Y(cy), X(x2), Y(y2)); ctx.stroke();
  };

  /* -------- exemplar drawings, one per demo key -------- */
  const DEMOS = {
    ghostLines(ctx) {
      style(ctx);
      label(ctx, 0.14, 0.12, "Connect each pair of dots with ONE confident stroke:");
      for (let r = 0; r < 3; r++) {
        const y = 0.17 + r * 0.06;
        dot(ctx, 0.15, y); dot(ctx, 0.85, y - (r === 2 ? 0.03 : 0));
      }
      label(ctx, 0.14, 0.42, "Then trace these curve families:");
      for (let i = 0; i < 4; i++)
        curve(ctx, 0.15, 0.48 + i * 0.02, 0.5, 0.44 + i * 0.05, 0.85, 0.48 + i * 0.02);
      label(ctx, 0.14, 0.62, "Ellipses: round and round 2–3 times per ellipse, lightly:");
      for (let i = 0; i < 4; i++)
        ellipse(ctx, 0.22 + i * 0.19, 0.70, 0.075, 0.028 + i * 0.012);
    },
    shapes(ctx) {
      style(ctx);
      label(ctx, 0.14, 0.12, "Copy each shape 5 times — accuracy beats speed:");
      ellipse(ctx, 0.25, 0.24, 0.075, 0.075);
      ctx.strokeRect(X(0.42), Y(0.165), X(0.15), X(0.15));
      ctx.beginPath(); ctx.moveTo(X(0.75), Y(0.165));
      ctx.lineTo(X(0.67), Y(0.315)); ctx.lineTo(X(0.83), Y(0.315));
      ctx.closePath(); ctx.stroke();
      label(ctx, 0.14, 0.44, "Everything is shapes. Copy these combos:");
      // house
      ctx.strokeRect(X(0.18), Y(0.55), X(0.16), X(0.13));
      ctx.beginPath(); ctx.moveTo(X(0.16), Y(0.55)); ctx.lineTo(X(0.26), Y(0.47));
      ctx.lineTo(X(0.36), Y(0.55)); ctx.stroke();
      // snowman
      ellipse(ctx, 0.55, 0.52, 0.035, 0.035);
      ellipse(ctx, 0.55, 0.585, 0.05, 0.05);
      ellipse(ctx, 0.55, 0.68, 0.065, 0.065);
      // mug = cylinder + hook
      ellipse(ctx, 0.78, 0.52, 0.05, 0.017);
      line(ctx, 0.73, 0.52, 0.73, 0.63); line(ctx, 0.83, 0.52, 0.83, 0.63);
      ellipse(ctx, 0.78, 0.63, 0.05, 0.017);
      curve(ctx, 0.83, 0.545, 0.89, 0.575, 0.83, 0.61);
    },
    forms(ctx) {
      style(ctx);
      label(ctx, 0.14, 0.12, "Turn shapes into FORMS — copy each one:");
      // cube from the Y method
      const cx = 0.25, cy = 0.25, s = 0.07;
      line(ctx, cx, cy, cx, cy + 0.09);                       // Y stem
      line(ctx, cx, cy, cx - s, cy - 0.045);
      line(ctx, cx, cy, cx + s, cy - 0.045);
      line(ctx, cx - s, cy - 0.045, cx - s, cy + 0.05);
      line(ctx, cx + s, cy - 0.045, cx + s, cy + 0.05);
      line(ctx, cx - s, cy + 0.05, cx, cy + 0.09);
      line(ctx, cx + s, cy + 0.05, cx, cy + 0.09);
      line(ctx, cx - s, cy - 0.045, cx, cy - 0.09);
      line(ctx, cx + s, cy - 0.045, cx, cy - 0.09);
      label(ctx, 0.19, 0.38, "cube");
      // cylinder
      ellipse(ctx, 0.55, 0.17, 0.055, 0.02);
      line(ctx, 0.495, 0.17, 0.495, 0.31); line(ctx, 0.605, 0.17, 0.605, 0.31);
      ctx.beginPath(); ctx.ellipse(X(0.55), Y(0.31), X(0.055), X(0.02), 0, 0, Math.PI); ctx.stroke();
      label(ctx, 0.50, 0.38, "cylinder");
      // sphere with contour lines
      ellipse(ctx, 0.82, 0.24, 0.07, 0.07);
      ellipse(ctx, 0.82, 0.24, 0.07, 0.022);
      ellipse(ctx, 0.82, 0.24, 0.022, 0.07);
      label(ctx, 0.77, 0.38, "sphere");
      label(ctx, 0.14, 0.48, "The contour lines are what make it feel 3-D.");
      label(ctx, 0.14, 0.55, "Draw a row of cubes, each rotated a little differently:");
      ctx.setLineDash([6, 6]); line(ctx, 0.15, 0.68, 0.85, 0.68); ctx.setLineDash([]);
    },
    shading(ctx) {
      style(ctx);
      label(ctx, 0.14, 0.12, "One light source. Copy this shaded sphere:");
      // light arrow
      line(ctx, 0.24, 0.18, 0.33, 0.25); line(ctx, 0.33, 0.25, 0.315, 0.20);
      line(ctx, 0.33, 0.25, 0.28, 0.245);
      label(ctx, 0.15, 0.17, "light");
      ellipse(ctx, 0.5, 0.35, 0.11, 0.11);
      // terminator (core shadow boundary)
      ctx.beginPath();
      ctx.ellipse(X(0.5), Y(0.35), X(0.11), X(0.045), -0.7, Math.PI * 0.15, Math.PI * 1.05);
      ctx.stroke();
      // hatching in the core shadow
      for (let i = 0; i < 6; i++)
        curve(ctx, 0.545 + i * 0.012, 0.415 - i * 0.014,
              0.56 + i * 0.012, 0.44 - i * 0.012,
              0.585 + i * 0.010, 0.415 - i * 0.010);
      // cast shadow
      ellipse(ctx, 0.56, 0.485, 0.13, 0.028);
      label(ctx, 0.14, 0.58, "5 zones: highlight · light · core shadow ·");
      label(ctx, 0.14, 0.63, "reflected light · cast shadow.");
      label(ctx, 0.14, 0.70, "Comics shortcut: pick ONE shadow shape, fill it solid black.");
    },
    perspective(ctx) {
      style(ctx);
      label(ctx, 0.14, 0.10, "Boxes in 1-point perspective — copy, then invent your own:");
      const hy = 0.30, vpx = 0.5;
      ctx.setLineDash([6, 6]); line(ctx, 0.08, hy, 0.92, hy); ctx.setLineDash([]);
      dot(ctx, vpx, hy); label(ctx, 0.515, 0.285, "VP");
      // box below-left of VP
      const bx = 0.20, by = 0.45, bw = 0.14, bh = 0.12;
      ctx.strokeRect(X(bx), Y(by), X(bw), Y(bh));
      ctx.setLineDash([6, 6]);
      line(ctx, bx, by, vpx, hy); line(ctx, bx + bw, by, vpx, hy);
      line(ctx, bx + bw, by + bh, vpx, hy);
      ctx.setLineDash([]);
      const t = 0.35;   // depth cut
      const lerp = (a, b) => a + (b - a) * t;
      line(ctx, lerp(bx, vpx), lerp(by, hy), lerp(bx + bw, vpx), lerp(by, hy));
      line(ctx, lerp(bx + bw, vpx), lerp(by, hy), lerp(bx + bw, vpx), lerp(by + bh, hy));
      label(ctx, 0.14, 0.68, "Front face flat → edges aim at the VP → cut the depth.");
      label(ctx, 0.14, 0.74, "Above the horizon you see a box's bottom; below it, its top.");
    },
    gesture(ctx) {
      style(ctx);
      label(ctx, 0.14, 0.10, "The LINE OF ACTION — one flowing line is the whole pose:");
      curve(ctx, 0.22, 0.18, 0.14, 0.32, 0.24, 0.45); label(ctx, 0.20, 0.50, "C");
      curve(ctx, 0.48, 0.18, 0.58, 0.28, 0.48, 0.36);
      curve(ctx, 0.48, 0.36, 0.40, 0.42, 0.50, 0.45); label(ctx, 0.47, 0.50, "S");
      line(ctx, 0.76, 0.18, 0.72, 0.45); label(ctx, 0.72, 0.50, "I  (rigid = calm)");
      // bean figure on an S
      label(ctx, 0.14, 0.58, "Build a 'bean' on the line — head, ribs, hips:");
      curve(ctx, 0.42, 0.62, 0.52, 0.72, 0.42, 0.84);
      ellipse(ctx, 0.42, 0.615, 0.025, 0.03);                 // head
      ellipse(ctx, 0.455, 0.685, 0.045, 0.055, 0.4);          // ribcage
      ellipse(ctx, 0.435, 0.80, 0.04, 0.045, -0.3);           // pelvis
      label(ctx, 0.55, 0.80, "30 seconds max per pose!");
    },
    head(ctx) {
      style(ctx);
      label(ctx, 0.14, 0.10, "The Loomis-lite head — copy the construction order:");
      // 1. ball
      ellipse(ctx, 0.5, 0.32, 0.13, 0.13);
      // 2. side plane
      ellipse(ctx, 0.585, 0.32, 0.045, 0.10, -0.15);
      // 3. jaw
      curve(ctx, 0.415, 0.40, 0.44, 0.53, 0.53, 0.535);
      curve(ctx, 0.53, 0.535, 0.585, 0.52, 0.60, 0.42);
      // 4. feature lines
      line(ctx, 0.37, 0.345, 0.63, 0.345); label(ctx, 0.645, 0.355, "brow");
      line(ctx, 0.39, 0.435, 0.62, 0.435); label(ctx, 0.645, 0.445, "nose");
      line(ctx, 0.435, 0.49, 0.585, 0.49); label(ctx, 0.645, 0.50, "mouth");
      line(ctx, 0.5, 0.19, 0.5, 0.535);
      label(ctx, 0.14, 0.62, "Ball → cut the side plane → hang the jaw → thirds:");
      label(ctx, 0.14, 0.68, "hairline→brow→nose→chin are equal thirds.");
      label(ctx, 0.14, 0.75, "Draw 6 heads: 3 facing you, 3 in 3/4 view.");
    },
    figure(ctx) {
      style(ctx);
      label(ctx, 0.13, 0.09, "Proportions: an adult is ~7.5 heads tall.");
      // head ruler
      const top = 0.14, unit = 0.088;
      for (let i = 0; i <= 7; i++) {
        line(ctx, 0.16, top + i * unit, 0.20, top + i * unit);
        if (i < 7) label(ctx, 0.105, top + (i + 0.6) * unit, String(i + 1));
      }
      // mannequin
      const mx = 0.55;
      ellipse(ctx, mx, top + unit * 0.5, 0.033, unit * 0.5);          // head
      ellipse(ctx, mx, top + unit * 1.75, 0.075, unit * 0.85, 0);     // ribcage
      ellipse(ctx, mx, top + unit * 3.15, 0.065, unit * 0.55, 0);     // pelvis
      line(ctx, mx, top + unit * 1.0, mx, top + unit * 2.6);          // spine
      // arms: shoulder→elbow at waist→wrist at crotch
      line(ctx, mx - 0.07, top + unit * 1.25, mx - 0.095, top + unit * 2.5);
      line(ctx, mx - 0.095, top + unit * 2.5, mx - 0.10, top + unit * 3.6);
      line(ctx, mx + 0.07, top + unit * 1.25, mx + 0.095, top + unit * 2.5);
      line(ctx, mx + 0.095, top + unit * 2.5, mx + 0.10, top + unit * 3.6);
      // legs: knee ~5.5 heads, ankle ~7.25
      line(ctx, mx - 0.03, top + unit * 3.6, mx - 0.045, top + unit * 5.5);
      line(ctx, mx - 0.045, top + unit * 5.5, mx - 0.04, top + unit * 7.3);
      line(ctx, mx + 0.03, top + unit * 3.6, mx + 0.045, top + unit * 5.5);
      line(ctx, mx + 0.045, top + unit * 5.5, mx + 0.04, top + unit * 7.3);
      dot(ctx, mx - 0.095, top + unit * 2.5); dot(ctx, mx + 0.095, top + unit * 2.5);
      dot(ctx, mx - 0.045, top + unit * 5.5); dot(ctx, mx + 0.045, top + unit * 5.5);
      label(ctx, 0.68, 0.30, "elbows = waist");
      label(ctx, 0.68, 0.35, "wrists = crotch");
      label(ctx, 0.68, 0.62, "knees ≈ 5.5 heads");
    },
    thumbnails(ctx) {
      style(ctx);
      label(ctx, 0.14, 0.12, "Plan tiny, draw big — thumbnail 3 versions of one panel:");
      for (let i = 0; i < 3; i++)
        ctx.strokeRect(X(0.16 + i * 0.24), Y(0.17), X(0.18), Y(0.13));
      label(ctx, 0.14, 0.38, "Then build the real page in this order:");
      label(ctx, 0.17, 0.45, "1. Guides tab → pick a panel template");
      label(ctx, 0.17, 0.51, "2. Pencils layer → gesture your figures (blue = fearless)");
      label(ctx, 0.17, 0.57, "3. Inks layer → confident lines over the blue");
      label(ctx, 0.17, 0.63, "4. Balloon tool → dialogue, tails at mouths");
      label(ctx, 0.17, 0.69, "5. Hide Pencils 👁 → Export PNG. You made a comic.");
    },
  };

  /* -------- the curriculum -------- */
  const pencils = () => {
    const i = App.layers.findIndex(l => l.name === "Pencils");
    if (i >= 0) App.activeLayer = i;
    UI.refreshLayers();
  };
  const COURSE = [
    { title: "1 · Lines before art", demo: "ghostLines",
      steps: [
        { t: "Drawing is a motor skill first. Hold the pen loosely, and move from your SHOULDER for long lines, not your wrist. Wrist = wobble.", setup: () => { pencils(); UI.setTool("pencil"); } },
        { t: "GHOSTING: hover the stroke 2–3 times in the air along the faint blue line, then commit in one motion. Never sketch a line in hairy little pieces. Do each dotted pair 5 times." },
        { t: "Ellipses are the hardest and most useful shape in comics (wheels, heads, balloons, perspective circles). Draw THROUGH each one 2–3 rotations, lightly. Fill the row." },
        { t: "Speed check: confident-but-wrong beats timid-but-accurate — accuracy catches up with mileage. 5 minutes of this every session before drawing anything. That's the whole warmup habit." },
      ] },
    { title: "2 · Everything is shapes", demo: "shapes",
      steps: [
        { t: "Any drawing you admire is circles, boxes and triangles wearing a costume. Copy each basic shape 5 times.", setup: () => { pencils(); UI.setTool("pencil"); } },
        { t: "Now the combos — house, snowman, mug. Don't draw 'a mug'; draw a cylinder, THEN hang a hook on it. Naming the shape first is the trick your brain needs." },
        { t: "Look around the room. Pick 3 objects and draw each as 2–4 shapes only. No details allowed — details are a reward for later." },
      ] },
    { title: "3 · Shapes become forms", demo: "forms",
      steps: [
        { t: "A circle is flat; a sphere takes up space. Comics need forms because characters turn, and only forms can turn. Copy the cube (start with the Y!), cylinder, and sphere.", setup: () => { pencils(); UI.setTool("pencil"); } },
        { t: "The contour lines wrapping the sphere are what sell the 3-D. Add them to every form you draw this week — they feel silly, they work." },
        { t: "On the dotted line, draw a row of 6 boxes, each rotated a bit differently. This one exercise (from Drawabox) builds more drawing skill than any tutorial video." },
      ] },
    { title: "4 · Light & shadow", demo: "shading",
      steps: [
        { t: "Pick where the light is BEFORE you shade — everything follows from that one decision. Copy the sphere: terminator line, hatched core shadow, cast shadow.", setup: () => { pencils(); UI.setTool("pencil"); } },
        { t: "Now the comics version: switch to Ink, and instead of gradients, choose one shadow SHAPE and fill it solid black. Squint at your sphere — if it still reads, it works.", setup: () => UI.setTool("ink") },
        { t: "Shade a cube and a cylinder from the same light direction. Three forms shaded correctly = you can shade anything, because everything is built from them." },
      ] },
    { title: "5 · Perspective without tears", demo: "perspective",
      steps: [
        { t: "The horizon is your reader's eye level — that's all it is. Copy the 1-point box: flat front face, edges aiming at the VP, cut the depth.", setup: () => { pencils(); UI.setTool("pencil"); } },
        { t: "Now I've turned on the app's perspective grid (Guides tab). Drag the ⊕ point around and draw 3 boxes that obey it — one above the horizon, two below.",
          setup: () => { App.guides.persp = true; App.guides.vps = 1; App.dirty = true;
                         const cb = document.getElementById("g-persp"); if (cb) cb.checked = true; } },
        { t: "Use the Line tool with Shift held — it snaps to 15°, perfect for aiming construction lines at your VP. Draw a simple room: back wall, floor, one box of furniture.",
          setup: () => UI.setTool("line") },
      ] },
    { title: "6 · Gesture — drawing life", demo: "gesture",
      steps: [
        { t: "Stick figures are stiff because they start with the outline. Pros start with ONE line that captures what the pose is DOING. Copy the C, S and I action lines.", setup: () => { pencils(); UI.setTool("pencil"); } },
        { t: "Build the bean on the S-line: head, ribcage, pelvis — tilted AGAINST each other. That counter-tilt is the difference between a mannequin and a character." },
        { t: "Your FORCE book (Library tab) is the bible for this — open it beside the app. Do ten 30-second gestures from any photos of people. Timer on. Ugly is correct." },
      ] },
    { title: "7 · Heads that turn", demo: "head",
      steps: [
        { t: "Copy the construction IN ORDER: ball → side-plane ellipse → jaw → feature thirds. The order is the method; never start with the eyes.", setup: () => { pencils(); UI.setTool("pencil"); } },
        { t: "Equal thirds: hairline→brow, brow→nose, nose→chin. Eyes sit HALFWAY down the whole head (everyone draws them too high). Draw 3 heads facing you." },
        { t: "Now 3 heads in 3/4 view — move the center line toward one side and let the far eye compress. The ball-and-jaw method is why it still works when the head turns." },
      ] },
    { title: "8 · The figure", demo: "figure",
      steps: [
        { t: "7.5 heads tall, elbows at the waist, wrists at the crotch, knees just past halfway. Copy the mannequin next to the head-ruler.", setup: () => { pencils(); UI.setTool("pencil"); } },
        { t: "Your Sycra anatomy sheet (Library tab) shows the same mannequin from 5 angles — copy the front and side versions at this size." },
        { t: "Combine lessons 6+8: gesture line FIRST, then hang this mannequin on it. Ten poses. This is the drill that eventually becomes 'I can draw people'." },
      ] },
    { title: "9 · Your first comic page", demo: "thumbnails",
      steps: [
        { t: "You know enough. Seriously — comics run on storytelling, not rendering. Thumbnail 3 tiny versions of ONE moment: someone opens a door and reacts.", setup: () => { pencils(); UI.setTool("pencil"); } },
        { t: "Follow the checklist on the canvas: template → blue gesture → ink → balloon → export. Panel borders and balloons are doing half the work for you — that's why comics is the friendliest medium for a new artist.",
          setup: () => { } },
        { t: "Done? You've completed Draw School. The real course is repetition: warmup (L1) + ten gestures (L6) + one panel, every session. Come back to any lesson from the Learn tab. 🖋" },
      ] },
  ];

  /* -------- progress -------- */
  const doneSet = () => new Set(JSON.parse(localStorage.getItem(DONE_KEY) || "[]"));
  function markDone(i) {
    const s = doneSet(); s.add(i);
    localStorage.setItem(DONE_KEY, JSON.stringify([...s]));
    buildUI();
  }

  /* -------- overlay hook (engine calls inside page transform) -------- */
  function renderOverlay(ctx) {
    if (!active) return;
    const demo = DEMOS[COURSE[active.lesson].demo];
    if (!demo || !active.showDemo) return;
    ctx.save();
    demo(ctx);
    ctx.restore();
  }

  /* -------- lesson panel UI -------- */
  function open(lessonIdx) {
    active = { lesson: lessonIdx, step: 0, showDemo: true };
    const step = COURSE[lessonIdx].steps[0];
    if (step.setup) step.setup();
    renderPanel();
    App.dirty = true;
  }
  function close() {
    active = null;
    document.getElementById("lesson-panel").hidden = true;
    App.dirty = true;
  }
  function renderPanel() {
    const el = document.getElementById("lesson-panel");
    const L = COURSE[active.lesson];
    const last = active.step === L.steps.length - 1;
    el.hidden = false;
    el.innerHTML = `
      <div class="lp-head"><b>🎓 ${L.title}</b>
        <span class="muted">${active.step + 1}/${L.steps.length}</span>
        <button class="lp-x" title="Close lesson">✕</button></div>
      <div class="lp-body">${L.steps[active.step].t}</div>
      <div class="row">
        <button class="lp-prev" ${active.step === 0 ? "disabled" : ""}>‹ Back</button>
        <button class="lp-demo">${active.showDemo ? "Hide" : "Show"} example</button>
        <span class="spacer"></span>
        <button class="lp-next">${last ? "Finish ✓" : "Next ›"}</button>
      </div>`;
    el.querySelector(".lp-x").onclick = close;
    el.querySelector(".lp-demo").onclick = () => {
      active.showDemo = !active.showDemo; renderPanel(); App.dirty = true;
    };
    el.querySelector(".lp-prev").onclick = () => {
      active.step = Math.max(0, active.step - 1); renderPanel(); App.dirty = true;
    };
    el.querySelector(".lp-next").onclick = () => {
      if (last) { markDone(active.lesson); close(); UI.flash(`Lesson complete: ${L.title} ✓`); return; }
      active.step++;
      const s = COURSE[active.lesson].steps[active.step];
      if (s.setup) s.setup();
      renderPanel(); App.dirty = true;
    };
  }

  /* -------- entry card in the Learn tab -------- */
  function buildUI() {
    let host = document.getElementById("drawschool");
    if (!host) {
      host = document.createElement("div");
      host.id = "drawschool";
      const learn = document.getElementById("learn-content");
      learn.insertBefore(host, learn.firstChild);
    }
    const done = doneSet();
    host.innerHTML = `
      <div class="ds-card">
        <b>🎓 Draw School</b>
        <div class="muted" style="font-size:12px;margin:2px 0 8px">
          Never drawn before? 9 hands-on lessons, practiced right on the canvas.
          ${done.size}/${COURSE.length} complete.</div>
        ${COURSE.map((L, i) => `
          <button class="ds-lesson ${done.has(i) ? "ds-done" : ""}" data-i="${i}">
            ${done.has(i) ? "✓" : "○"} ${L.title}</button>`).join("")}
      </div>`;
    host.querySelectorAll(".ds-lesson").forEach(b =>
      b.addEventListener("click", () => open(+b.dataset.i)));
  }

  return { buildUI, renderOverlay, open, close };
})();
