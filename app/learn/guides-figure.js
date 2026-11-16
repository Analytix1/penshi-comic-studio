/* ============================================================
   learn/guides-figure.js — leveled guides built on the figure rig
   Every guide here is a stack of LEVELS (gesture → mannequin →
   landmarks → contour). Each level lands on its own locked layer,
   so a lesson reveals the construction a stage at a time and the
   student can trace any stage on its own.
   ============================================================ */
"use strict";

/* shared helpers for all guides-*.js files */
const GuideKit = (() => {
  const K = Exemplars.kit;
  const LW = () => Math.max(2, K.S(0.014));
  /* a camera placed in page fractions: (x, y) is where the world origin
     lands, s is page-WIDTH fractions per world unit */
  const cam = (x, y, s, o = {}) => G3.camera({ cx: K.X(x), cy: K.Y(y), scale: K.X(s), dist: 28, ...o });
  const draw = (ctx, c, items, o = {}) => G3.render(ctx, c, items, { lw: LW(), font: K.S(0.095), ...o });
  const fig = (ctx, c, f, what, o = {}) => Rigs.drawFigure(ctx, c, f, what, { lw: LW(), ...o });
  /* a world point as page fractions (for labels and leader lines) */
  const frac = (c, p) => { const s = G3.project(c, p), P = K.page(); return [s[0] / P.w, s[1] / P.h]; };
  const tag = (ctx, c, p, text, o = {}) => {
    const [x, y] = frac(c, p);
    K.label(ctx, x + (o.dx || 0), y + (o.dy || 0), text, { fs: 0.1, ...o });
  };
  const leader = (ctx, c, p, tx, ty, text, o = {}) => {
    const [x, y] = frac(c, p);
    K.style(ctx, { lw: LW() * 0.55 }); K.line(ctx, x, y, tx, ty); K.style(ctx);
    K.dot(ctx, x, y, 0.017);
    K.label(ctx, tx + (o.align === "right" ? -0.006 : 0.006), ty, text, { fs: 0.1, ...o });
  };
  const cap = (ctx, x, y, text, o = {}) => K.label(ctx, x, y, text, { fs: 0.11, ...o });
  /* a line on the ground plane (y = 0) under a figure */
  const floor = (half = 2.2, z = 0) => G3.seg([-half, 0, z], [half, 0, z], { lw: 0.7, hide: false });
  const plumb = f => [
    G3.seg(f.J.neck, [f.J.neck[0], 0, f.J.neck[2]], { dash: true, lw: 0.9 }),
    G3.pt(f.J.neck, { r: 2.6 }),
    G3.path([f.J.heelL, f.J.toeL, f.J.toeR, f.J.heelR], { close: true, fill: 0.16, lw: 0.6 }),
  ];
  const reg = (key, levels, o = {}) =>
    Exemplars.register(key, { levels: levels.map(([name, draw]) => ({ name, draw })), ...o });
  const only = (f, parts) => f.solids.filter(s => parts.includes(s.part));
  return { K, LW, cam, draw, fig, frac, tag, leader, cap, floor, plumb, reg, only };
})();

(() => {
  const { K, LW, cam, draw, fig, frac, tag, leader, cap, floor, plumb, reg, only } = GuideKit;
  const F = (pose, build) => Rigs.figure(typeof pose === "string" ? Rigs.POSES[pose] : pose, build);
  const TORSO = ["chest", "pelvis", "waist", "belly"];
  const LIMBS = ["upperArm", "foreArm", "hand", "thigh", "shin", "foot", "joint"];

  /* ---------- gesture: C, S and I ---------- */
  {
    const C = { pelvis: [0, 12, 0], chest: [0, 40, 0], head: [0, 12, 0],
      legL: [[0, -1, 0.1], [0, -1, -0.1]], legR: [[0, -1, -0.12], [0, -1, -0.14]],
      armL: [[0, -0.5, 0.86], [0, -0.3, 0.95]], armR: [[0, -0.6, 0.8], [0, -0.45, 0.9]] };
    const set = () => [
      [F(C), cam(0.13, 0.74, 0.076, { yaw: -90, pitch: 3 }), "C  —  bending, reaching"],
      [F("contrapposto"), cam(0.57, 0.74, 0.076, { yaw: 12, pitch: 3 }), "S  —  weight on one leg"],
      [F("stand"), cam(0.87, 0.74, 0.076, { yaw: 0, pitch: 3 }), "I  —  rigid, still"]];
    reg("gestureLines", [
      ["line of action", ctx => {
        K.title(ctx, "The line of action — the whole pose in ONE line");
        for (const [f, c, name] of set()) {
          draw(ctx, c, f.gesture.filter(g => g.role === "action").concat(floor(1.6)), { lw: LW() * 1.5 });
          cap(ctx, c.cx / K.page().w - 0.11, 0.78, name, { bold: true });
        }
        K.note(ctx, 0.84, "Level 1 is the only line that matters at first: draw it in one stroke, from the shoulder.");
        K.note(ctx, 0.89, "Straight against curve — where the body pushes, draw straight; where it stretches, draw a curve.");
        K.note(ctx, 0.94, "30 seconds per pose. If it's pretty, you went too slow.");
      }],
      ["limbs and tilts", ctx => { for (const [f, c] of set()) draw(ctx, c, f.gesture.filter(g => g.role !== "action")); }],
      ["mannequin", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "mannequin"); }],
    ]);
  }

  /* ---------- the bean ---------- */
  {
    const bean = f => [
      G3.ell(f.J.chest, [f.b.chestW * 0.46, f.b.chestH * 0.56, f.b.chestD * 0.56], f.R.Rc, { rings: ["xz", "yz"] }),
      G3.ell(f.J.pelvis, [f.b.pelvisW * 0.5, f.b.pelvisH * 0.6, f.b.pelvisD * 0.56], f.R.Rp, { rings: ["xz", "yz"] }),
      G3.ell(f.J.head, [0.37, 0.5, 0.45], f.R.Rh, {}),
    ];
    const set = () => [
      [F("lean"), cam(0.27, 0.76, 0.08, { yaw: -20, pitch: 6 })],
      [F("contrapposto"), cam(0.57, 0.76, 0.08, { yaw: 28, pitch: 6 })],
      [F("walkContact"), cam(0.85, 0.76, 0.08, { yaw: -62, pitch: 6 })]];
    reg("beanFigure", [
      ["line of action", ctx => {
        K.title(ctx, "The bean: ribcage and pelvis, tilting against each other");
        for (const [f, c] of set()) draw(ctx, c, f.gesture.filter(g => g.role === "action").concat(floor(1.6)), { lw: LW() * 1.5 });
        K.note(ctx, 0.84, "Level 2 hangs two masses on the line: a big egg for the ribcage, a smaller one for the pelvis.");
        K.note(ctx, 0.89, "They TILT AGAINST each other — that counter-tilt is the difference between a mannequin and a person.");
        K.note(ctx, 0.94, "One side of the waist pinches, the other stretches. Find which before you draw a limb.");
      }],
      ["the bean", ctx => { for (const [f, c] of set()) draw(ctx, c, bean(f)); }],
      ["limbs", ctx => { for (const [f, c] of set()) draw(ctx, c, f.gesture.filter(g => g.role === "limb" || g.role === "tilt")); }],
    ]);
  }

  /* ---------- balance ---------- */
  {
    const set = () => [
      [F("contrapposto"), cam(0.18, 0.74, 0.074, { yaw: 14, pitch: 8 }), ["weight on ONE leg:", "the line lands on that foot"]],
      [F("stand"), cam(0.5, 0.74, 0.074, { yaw: 30, pitch: 8 }), ["standing on two:", "it lands between them"]],
      [F("run"), cam(0.77, 0.74, 0.068, { yaw: -90, pitch: 8 }), ["running: the line falls", "AHEAD of the support"]]];
    reg("balancePlumb", [
      ["gesture and plumb line", ctx => {
        K.title(ctx, "Balance: the plumb line from the pit of the neck lands on the support");
        for (const [f, c, lines] of set()) {
          draw(ctx, c, f.gesture.concat(plumb(f), floor(1.8)));
          lines.forEach((t, i) => cap(ctx, c.cx / K.page().w - 0.12, 0.79 + i * 0.03, t));
        }
        K.note(ctx, 0.9, "The shaded patch on the floor is the SUPPORT — the area between the feet. Inside it: balanced. Outside: falling.");
        K.note(ctx, 0.95, "Shoulders and hips tilt opposite ways in a relaxed stand. Ahead of the feet reads as motion; behind, as recoil.");
      }],
      ["mannequin", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "mannequin"); }],
    ]);
  }

  /* ---------- rhythm through the limbs ---------- */
  {
    const set = () => [
      [F("reach"), cam(0.29, 0.8, 0.088, { yaw: 18, pitch: 6 })],
      [F("punch"), cam(0.72, 0.8, 0.088, { yaw: -20, pitch: 6 })]];
    reg("limbRhythm", [
      ["rhythm lines", ctx => {
        K.title(ctx, "Rhythm: one flowing line through each limb, before any tube");
        for (const [f, c] of set()) draw(ctx, c, f.gesture.concat(floor(2)));
        K.note(ctx, 0.86, "Level 1: the arm's rhythm continues the twist of the torso. Follow each line from shoulder to fingertip.");
        K.note(ctx, 0.91, "Level 2 hangs tapered tubes ON those lines. If the tubes stiffen the flow, you drew tubes and forgot the line.");
        K.note(ctx, 0.96, "Level 3 adds the torso boxes. Overlap at every joint: decide which segment is in front.");
      }],
      ["tubes on the rhythm", ctx => { for (const [f, c] of set()) draw(ctx, c, only(f, LIMBS)); }],
      ["torso boxes", ctx => { for (const [f, c] of set()) draw(ctx, c, only(f, TORSO.concat(["head", "jaw", "neck"]))); }],
    ]);
  }

  /* ---------- proportions: 7.5 heads ---------- */
  {
    const U = 0.098, G = 0.88;                        // head unit (page widths), ground line
    const yOf = h => G - K.V(h * U);
    const set = () => [
      [F("stand"), cam(0.33, G, U, { yaw: 0, dist: Infinity }), "front"],
      [F("stand"), cam(0.62, G, U, { yaw: 90, dist: Infinity }), "side"],
      [F("stand"), cam(0.86, G, U, { yaw: 180, dist: Infinity }), "back"]];
    reg("mannequin", [
      ["ruler and landmarks", ctx => {
        K.title(ctx, "7½ heads: the proportion ruler");
        for (let i = 0; i <= 8; i++) {
          const h = Math.min(i, 7.5), y = yOf(7.5 - h);
          K.style(ctx, { dash: true, lw: LW() * 0.5 }); K.line(ctx, 0.07, y, 0.97, y); K.style(ctx);
          if (i < 8) K.label(ctx, 0.035, yOf(7.5 - Math.min(i + 0.5, 7.25)), i < 7 ? String(i + 1) : "½", { fs: 0.1, bold: true });
        }
        [[1, "chin"], [2, "nipples"], [3, "navel · elbows"], [4, "crotch · wrists — the HALFWAY point"],
         [5.5, "knees"], [7.5, "soles"]].forEach(([h, t]) => K.label(ctx, 0.075, yOf(7.5 - h) - 0.011, t, { fs: 0.075 }));
        for (const [f, c, name] of set()) {
          draw(ctx, c, f.gesture.filter(g => g.role !== "head"));
          cap(ctx, c.cx / K.page().w - 0.02, G + 0.022, name, { bold: true });
        }
        K.note(ctx, 0.945, "Level 1 is the stick figure on the ruler: place every joint on its line before any form.");
        K.note(ctx, 0.975, "The landmarks are at the same HEIGHTS from every side. That is what makes them landmarks.");
      }],
      ["mannequin", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "mannequin"); }],
    ]);
  }

  /* ---------- proportion is a choice ---------- */
  {
    const FIVE = { thigh: 1.0, shin: 0.95, chestH: 1.05, waist: 0.22, pelvisH: 0.62, upperArm: 0.95, foreArm: 0.8, hand: 0.55,
                   neck: 0.12, chestW: 1.3, chestW0: 1.1, shoulder: 0.7, pelvisW: 1.15, footL: 0.8, footH: 0.22 };
    const THREE = { thigh: 0.42, shin: 0.4, chestH: 0.62, waist: 0.06, pelvisH: 0.42, upperArm: 0.42, foreArm: 0.38, hand: 0.3,
                    neck: 0.03, chestW: 0.95, chestW0: 0.9, chestD: 0.75, shoulder: 0.5, pelvisW: 0.9, pelvisW0: 0.8,
                    pelvisD: 0.7, hip: 0.26, footL: 0.5, footH: 0.15, limb: 0.8 };
    const G = 0.84, H = 0.56;                        // ground, drawn height (page widths)
    const set = () => [["7½ heads — realistic", {}], ["8½ — heroic", Rigs.BUILDS.heroic], ["5 — cartoon", FIVE], ["3 — chibi", THREE]]
      .map(([name, build], i) => {
        const f = F("stand", build), heads = f.J.crown[1];
        return [f, cam([0.13, 0.35, 0.58, 0.85][i], G, H / heads, { dist: Infinity }), name, heads];
      });
    reg("proportionCompare", [
      ["head counts", ctx => {
        K.title(ctx, "Proportion is a choice: the same landmarks, different head counts");
        for (const [f, c, name, heads] of set()) {
          const x = c.cx / K.page().w, u = H / heads;
          for (let i = 0; i <= Math.floor(heads); i++) {
            const y = G - K.V(u * (heads - i));
            K.style(ctx, { lw: LW() * 0.5 }); K.line(ctx, x - 0.105, y, x - 0.085, y); K.style(ctx);
          }
          K.line(ctx, x - 0.095, G, x - 0.095, G - K.V(H));
          draw(ctx, c, f.gesture.filter(g => g.role !== "head"));
          cap(ctx, x - 0.1, G + 0.03, name, { bold: true });
        }
        K.note(ctx, 0.9, "Every figure here is the same height on the page. Only the size of the HEAD changes — and with it, the age and tone.");
        K.note(ctx, 0.95, "The landmark ORDER never changes: chin, chest, waist, crotch, knee. Pick a system and hold it for the whole comic.");
      }],
      ["mannequins", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "mannequin"); }],
    ]);
  }

  /* ---------- boxes, not blobs ---------- */
  {
    const torso = f => only(f, TORSO).map(s => ({ ...s, through: true }));
    const twist = { pelvis: [-18, 0, 6], chest: [22, 8, -8] };
    const tops = () => [
      [F("stand"), cam(0.2, 0.36, 0.1, { yaw: 30, pitch: 14, target: [0, 4.9, 0] })],
      [F(twist), cam(0.5, 0.36, 0.1, { yaw: -24, pitch: 10, target: [0, 4.9, 0] })],
      [F({ pelvis: [0, -8, 0], chest: [0, 26, 0] }), cam(0.8, 0.36, 0.1, { yaw: 70, pitch: 12, target: [0, 4.9, 0] })]];
    const full = () => [
      [F("contrapposto"), cam(0.2, 0.93, 0.06, { yaw: 32, pitch: 8 }), "three-quarter"],
      [F("contrapposto"), cam(0.5, 0.9, 0.06, { yaw: 20, pitch: 46, dist: 20 }), "from above"],
      [F("hero"), cam(0.8, 0.93, 0.06, { yaw: -22, pitch: -22, dist: 13 }), "from below"]];
    reg("mannequinBoxes", [
      ["ribcage and pelvis boxes", ctx => {
        K.title(ctx, "Boxes, not blobs: the ribcage and pelvis as solid forms");
        for (const [f, c] of tops()) draw(ctx, c, torso(f));
        cap(ctx, 0.08, 0.13, "top row: only the ribcage box and the pelvis box, at three turns", { bold: true });
        for (const [f, c, name] of full()) { draw(ctx, c, only(f, TORSO)); cap(ctx, c.cx / K.page().w - 0.06, 0.955, name); }
        K.note(ctx, 0.535, "Dashed edges are the far side: draw THROUGH the box. The line down the front is the sternum, then the belly.");
        K.note(ctx, 0.985, "Boxes can be turned. Blobs can't. Between the two boxes is the waist — the only part that bends.");
      }],
      ["limbs, head and joints", ctx => {
        for (const [f, c] of full()) draw(ctx, c, only(f, LIMBS.concat(["head", "jaw", "neck"])));
      }],
    ]);
  }

  /* ---------- gesture to mannequin ---------- */
  {
    const set = () => [
      [F("reach"), cam(0.2, 0.8, 0.078, { yaw: 12, pitch: 8 })],
      [F("sit", {}), cam(0.52, 0.8, 0.078, { yaw: -40, pitch: 10 })],
      [F("punch"), cam(0.82, 0.8, 0.078, { yaw: -12, pitch: 8 })]];
    const seat = c => [G3.box([0, 1.02, -0.5], [1.7, 2.04, 1.5], G3.I(), { through: true })];
    reg("gestureToMannequin", [
      ["gesture", ctx => {
        K.title(ctx, "Gesture → boxes → tubes. In that order, every time.");
        set().forEach(([f, c], i) => draw(ctx, c, f.gesture.concat(floor(2))));
        K.note(ctx, 0.88, "Level 1 (20 seconds): line of action, head, the two tilt bars. Level 2: hang the ribcage and pelvis boxes on it.");
        K.note(ctx, 0.93, "Level 3: tubes on the rhythm lines, ball joints, mitten hands, wedge feet. Never start at level 3.");
      }],
      ["torso boxes", ctx => { set().forEach(([f, c], i) => draw(ctx, c, only(f, TORSO).concat(i === 1 ? seat(c) : []))); }],
      ["tubes and joints", ctx => { for (const [f, c] of set()) draw(ctx, c, only(f, LIMBS.concat(["head", "jaw", "neck"]))); }],
    ]);
  }

  /* ---------- age ---------- */
  {
    const OLD = { pelvis: [0, 6, 0], chest: [0, 20, 0], head: [0, -14, 0],
      legL: [[0.06, -1, 0.16], [0, -1, -0.16]], legR: [[-0.06, -1, 0.16], [0, -1, -0.16]],
      armL: [[0.12, -1, 0.1], [0, -1, 0.3]], armR: [[-0.12, -1, 0.1], [0, -1, 0.3]] };
    const G = 0.82, A = 0.6;                         // ground; the adult's drawn height
    const rows = [["toddler", "toddler", "stand", 0.48, "4 heads"], ["child (6)", "child", "stand", 0.66, "5½"],
                  ["teen", "teen", "stand", 0.9, "6½"], ["adult", "adult", "stand", 1, "7½"], ["elder", "elder", OLD, 0.95, "7"]];
    const set = () => rows.map(([name, build, pose, rel, heads], i) => {
      const f = F(pose, Rigs.BUILDS[build]);
      return [f, cam([0.09, 0.26, 0.46, 0.68, 0.89][i], G, (A * rel) / f.J.crown[1], { yaw: 24, dist: Infinity }), name, heads, A * rel];
    });
    reg("ageProportions", [
      ["heights and halfway marks", ctx => {
        K.title(ctx, "Age is proportion: head count, and where the halfway point falls");
        K.style(ctx, { dash: true, lw: LW() * 0.5 }); K.line(ctx, 0.04, G, 0.97, G); K.style(ctx);
        for (const [f, c, name, heads, h] of set()) {
          const x = c.cx / K.page().w;
          K.style(ctx, { dash: true, lw: LW() * 0.6 }); K.line(ctx, x - 0.075, G - K.V(h / 2), x + 0.075, G - K.V(h / 2)); K.style(ctx);
          draw(ctx, c, f.gesture);
          cap(ctx, x - 0.07, G + 0.03, name, { bold: true }); cap(ctx, x - 0.07, G + 0.055, heads + " heads", { fs: 0.08 });
        }
        K.note(ctx, 0.9, "Dashed line = half the height. Toddler: at the navel. Adult: at the crotch. The legs do most of the growing.");
        K.note(ctx, 0.95, "The elder has the adult's skeleton with every curve increased: head forward, shoulders round, knees soft.");
      }],
      ["mannequins", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "mannequin"); }],
    ]);
  }

  /* ---------- builds ---------- */
  {
    const set = () => ["heavy", "lean", "muscular", "stocky"].map((b, i) =>
      [F("stand", Rigs.BUILDS[b]), cam(0.15 + i * 0.235, 0.82, 0.072, { yaw: 28, pitch: 4, dist: Infinity }), b]);
    reg("bodyBuilds", [
      ["the same skeleton", ctx => {
        K.title(ctx, "Four builds on one skeleton: only the masses change");
        for (const [f, c, name] of set()) {
          draw(ctx, c, f.gesture.concat(f.landmarks.map(([, p]) => G3.pt(p, { r: 2 }))));
          cap(ctx, c.cx / K.page().w - 0.05, 0.855, name, { bold: true });
        }
        K.note(ctx, 0.91, "Level 1: gesture and landmarks. Notice they barely move between builds — bone is bone.");
        K.note(ctx, 0.96, "Level 2: the surface moves OUT from the landmarks. Weight sits low; muscle sits high; lean shows the joints.");
      }],
      ["masses", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "mannequin"); }],
    ]);
  }

  /* ---------- the long pose ---------- */
  {
    const one = () => [F("contrapposto"), cam(0.32, 0.87, 0.1, { yaw: 24, pitch: 6 })];
    reg("figureStages", [
      ["1 · gesture", ctx => {
        K.title(ctx, "The long pose, one stage per level — never skip one");
        const [f, c] = one();
        draw(ctx, c, f.gesture.concat(plumb(f), floor(3)));
        [["1 · gesture (2 min)", "line of action, head, tilt bars — what is the pose DOING?"],
         ["2 · mannequin (5 min)", "ribcage and pelvis boxes, tubes on the rhythm lines, ball joints"],
         ["3 · landmarks (5 min)", "the bones you can find: pit of neck, iliac crests, kneecaps…"],
         ["4 · contour (8 min)", "the outline, drawn as the EDGE of the forms you built"]]
          .forEach(([h, t], i) => { K.label(ctx, 0.62, 0.2 + i * 0.1, h, { fs: 0.105, bold: true }); K.label(ctx, 0.62, 0.228 + i * 0.1, t, { fs: 0.078 }); });
        K.note(ctx, 0.93, "Switch the levels on one at a time in the Lesson panel and draw each stage over the last.");
        K.note(ctx, 0.97, "The dashed vertical is the plumb line: fix balance at stage 1, when it costs nothing.");
      }],
      ["2 · mannequin", ctx => { const [f, c] = one(); fig(ctx, c, f, "mannequin"); }],
      ["3 · landmarks", ctx => { const [f, c] = one(); fig(ctx, c, f, "landmarks", { r: 3 }); }],
      ["4 · contour", ctx => { const [f, c] = one(); fig(ctx, c, f, "contour"); }],
    ]);
  }

  /* ---------- foreshortening ---------- */
  {
    /* one arm, built once, turned toward the viewer in three steps */
    const arm = (deg, o = {}) => {
      const a = deg * Math.PI / 180, d = [Math.cos(a), -0.12, Math.sin(a)];
      const sh = [0, 0, 0], el = G3.mul(G3.norm(d), 1.5), wr = G3.add(el, G3.mul(G3.norm([d[0], d[1] + 0.1, d[2]]), 1.25));
      const hd = G3.norm(G3.sub(wr, el));
      return [G3.ball(sh, 0.27, o), G3.cyl(sh, el, 0.23, 0.17, { rings: [0.3, 0.7], ...o }), G3.ball(el, 0.175, o),
              G3.cyl(el, wr, 0.185, 0.12, { rings: [0.3, 0.7], ...o }),
              G3.box(Rigs.along(wr, hd, 0.4), [0.36, 0.8, 0.14], G3.frame(hd, [0, 1, 0]), o)];
    };
    const set = () => [[8, 0.07, "seen from the side"], [50, 0.49, "turning toward you"], [84, 0.85, "pointing AT you"]]
      .map(([deg, x, name]) => [deg, cam(x, 0.4, 0.095, { yaw: 0, pitch: 10, dist: 9 }), name, x + 0.08]);
    const strip = o => it => ({ ...it, ...o });
    reg("foreshorten", [
      ["overlapping tubes", ctx => {
        K.title(ctx, "Foreshortening: the same arm, turning toward you");
        for (const [deg, c, name, x] of set()) {
          draw(ctx, c, arm(deg).map(strip({ rings: null })));
          cap(ctx, x - 0.08, 0.56, name, { bold: true });
        }
        K.note(ctx, 0.66, "CUE 1 — OVERLAP. Each segment sits in front of the one behind it; the near outline is never broken.");
        K.note(ctx, 0.71, "CUE 2 — CONTOURS (level 2). Sideways the cross-contours are thin ellipses; aimed at you they are nearly circles.");
        K.note(ctx, 0.76, "CUE 3 — SIZE. The near end is drawn bigger: the hand at the end of a reaching arm is larger than the shoulder behind it.");
        K.note(ctx, 0.84, "Your brain knows the arm is long and refuses to draw it short. Build the tubes and the brain loses the argument.");
      }],
      ["cross-contours", ctx => {
        for (const [deg, c] of set()) draw(ctx, c, arm(deg).filter(it => it.type === "cyl").map(strip({ ringsOnly: true, hide: false })));
      }],
    ]);

    const figs = () => [
      [F("reach"), cam(0.2, 0.31, 0.058, { yaw: -18, pitch: 4, dist: 11, target: [0, 3.9, 0] }), "reaching at the viewer"],
      [F("punch"), cam(0.54, 0.31, 0.058, { yaw: 200, pitch: 4, dist: 11, target: [0, 3.9, 0] }), "the same idea, going AWAY"],
      [F("contrapposto"), cam(0.84, 0.31, 0.058, { yaw: 20, pitch: 58, dist: 12, target: [0, 3.6, 0] }), "bird's-eye"],
      [F("hero"), cam(0.3, 0.93, 0.062, { yaw: 22, pitch: -34, dist: 9.5 }), "worm's-eye"],
      [F("run"), cam(0.72, 0.76, 0.062, { yaw: -26, pitch: 6, dist: 11, target: [0, 3.7, 0] }), "running at the viewer"]];
    reg("foreshortFigures", [
      ["gesture", ctx => {
        K.title(ctx, "Foreshortened figures: say which segment is NEAREST before you draw");
        for (const [f, c, name] of figs()) { draw(ctx, c, f.gesture); }
        [[0.07, 0.53], [0.4, 0.53], [0.76, 0.53], [0.1, 0.965], [0.55, 0.965]].forEach(([x, y], i) => cap(ctx, x, y, figs()[i][2], { bold: true }));
      }],
      ["mannequin", ctx => { for (const [f, c] of figs()) fig(ctx, c, f, "mannequin"); }],
      ["contour", ctx => { for (const [f, c] of figs()) fig(ctx, c, f, "contour"); }],
    ]);
  }

  /* ---------- walk, run, jump ---------- */
  {
    const flip = p => {                                   // the same pose with left and right swapped
      const m = v => v && [-v[0], v[1], v[2]], pr = a => a && a.map(m);
      return { ...p, pelvis: p.pelvis && [-p.pelvis[0], p.pelvis[1], -p.pelvis[2]], chest: p.chest && [-p.chest[0], p.chest[1], -p.chest[2]],
               legL: pr(p.legR), legR: pr(p.legL), armL: pr(p.armR), armR: pr(p.armL),
               footL: m(p.footR), footR: m(p.footL), support: p.support === "L" ? "R" : "L" };
    };
    const P = Rigs.POSES;
    const rows = [
      [0.33, 0.036, [["contact", P.walkContact], ["passing", P.walkPass], ["contact", flip(P.walkContact)], ["passing", flip(P.walkPass)]], "WALK — one foot always on the ground"],
      [0.61, 0.036, [["push-off", flip(P.run)], ["flight", { ...P.run, ground: false, root: [0, 4.05, 0] }], ["landing", P.run]], "RUN — the body falls forward; both feet leave the ground"],
      [0.925, 0.033, [["crouch", P.crouch], ["launch", P.launch], ["apex", P.apex], ["land", P.crouch]], "JUMP — compress, stretch, stretch, compress"]];
    const set = () => rows.flatMap(([g, s, list, head]) => list.map(([name, pose], i) =>
      [F(pose), cam(0.14 + i * (0.8 / list.length) + (list.length === 3 ? 0.04 : 0), g, s, { yaw: -90, pitch: 2, dist: Infinity }), name, g]));
    reg("walkRunJump", [
      ["gesture and ground", ctx => {
        K.title(ctx, "Walk, run, jump: motion is balance lost on purpose");
        rows.forEach(([g, , , head]) => { K.label(ctx, 0.06, g - (g > 0.9 ? 0.285 : 0.235), head, { fs: 0.105, bold: true }); K.line(ctx, 0.05, g, 0.96, g); });
        for (const [f, c, name, g] of set()) {
          draw(ctx, c, f.gesture.concat([G3.seg(f.J.neck, [f.J.neck[0], 0, f.J.neck[2]], { dash: true, lw: 0.8 })]));
          cap(ctx, c.cx / K.page().w - 0.04, g + 0.018, name);
        }
        K.note(ctx, 0.975, "Dashed = plumb line. Over the support in a walk; ahead of it in a run. Level 2 builds the mannequin on each gesture.");
      }],
      ["mannequin", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "mannequin"); }],
    ]);
  }

  /* ---------- model sheet ---------- */
  {
    const U = 0.072, G = 0.82;
    const set = () => [[0, "front"], [40, "three-quarter"], [90, "side"], [180, "back"]].map(([yaw, name], i) =>
      [F("stand"), cam(0.15 + i * 0.235, G, U, { yaw, dist: Infinity }), name]);
    reg("modelSheet", [
      ["alignment lines", ctx => {
        K.title(ctx, "The turnaround: one character, four views, everything level");
        [7.5, 6.5, 6.05, 4.45, 3.65, 2.0, 0].forEach(h => {
          const y = G - K.V(h * U);
          K.style(ctx, { dash: true, lw: LW() * 0.5 }); K.line(ctx, 0.04, y, 0.97, y); K.style(ctx);
        });
        for (const [f, c, name] of set()) { draw(ctx, c, f.gesture); cap(ctx, c.cx / K.page().w - 0.05, G + 0.03, name, { bold: true }); }
        K.note(ctx, 0.9, "Dashed lines run through crown, chin, shoulders, waist, crotch, knees and soles. Every view must hit all seven.");
        K.note(ctx, 0.95, "Design ON the mannequin (level 2), then check the silhouette of each view (level 3). Costume details must match across views.");
      }],
      ["mannequin", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "mannequin"); }],
      ["silhouette", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "contour"); }],
    ]);
  }
})();
