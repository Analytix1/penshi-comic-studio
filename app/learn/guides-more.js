/* ============================================================
   learn/guides-more.js — the deep-dive pages: extra guide pages
   for lessons that were too crowded on two (long poses, motion,
   turnarounds, anatomy close-ups, one page per species).
   ============================================================ */
"use strict";

(() => {
  const { K, LW, cam, draw, fig, frac, leader, cap, floor, plumb, reg, only } = GuideKit;
  const F = (pose, build) => Rigs.figure(typeof pose === "string" ? Rigs.POSES[pose] : pose, build);
  const P = Rigs.POSES, Q = Rigs.quadruped;
  const ghost = items => items.map(it => ({ ...it, noStroke: true, rings: null, decals: null, tone: 0, fill: 0 }));
  const xOf = c => c.cx / K.page().w;
  const TORSO = ["chest", "pelvis", "waist", "belly", "neck", "head", "jaw"];
  const notes = (ctx, y, list, dy = 0.032) => list.forEach((t, i) => K.note(ctx, y + i * dy, t));
  const flip = p => {                                     // the same pose with left and right swapped
    const m = v => v && [-v[0], v[1], v[2]], pr = a => a && a.map(m);
    return { ...p, pelvis: p.pelvis && [-p.pelvis[0], p.pelvis[1], -p.pelvis[2]], chest: p.chest && [-p.chest[0], p.chest[1], -p.chest[2]],
             legL: pr(p.legR), legR: pr(p.legL), armL: pr(p.armR), armR: pr(p.armL),
             footL: m(p.footR), footR: m(p.footL), support: p.support === "L" ? "R" : "L" };
  };

  /* ============================================================
     The long pose, twice more
     ============================================================ */
  const stages = (key, title, pose, c0, tips) => {
    const one = () => [F(pose), c0()];
    reg(key, [
      ["1 · gesture", ctx => {
        K.title(ctx, title);
        const [f, c] = one();
        draw(ctx, c, f.gesture.concat(plumb(f), floor(3)));
        tips.forEach(([h, t], i) => { K.label(ctx, 0.64, 0.2 + i * 0.1, h, { fs: 0.105, bold: true }); K.label(ctx, 0.64, 0.228 + i * 0.1, t, { fs: 0.072 }); });
        notes(ctx, 0.93, ["Same four stages, same timings as the first pose: 2, 5, 5 and 8 minutes. Switch one level on at a time.",
                          "Draw your own version BESIDE the guide from a new reference, stage for stage, then compare the two."], 0.04);
      }],
      ["2 · mannequin", ctx => { const [f, c] = one(); fig(ctx, c, f, "mannequin"); }],
      ["3 · landmarks", ctx => { const [f, c] = one(); fig(ctx, c, f, "landmarks", { r: 3 }); }],
      ["4 · contour", ctx => { const [f, c] = one(); fig(ctx, c, f, "contour"); }],
    ]);
  };
  stages("longPoseSeated", "The long pose again: a seated figure", "sit", () => cam(0.3, 0.8, 0.1, { yaw: 34, pitch: 8 }),
    [["1 · gesture", "the spine still leads; the seat carries the weight now"], ["2 · mannequin", "the pelvis box tips BACK; thighs come toward you"],
     ["3 · landmarks", "knees level with each other; iliac crests tilt with the box"], ["4 · contour", "thighs overlap the torso — near line unbroken"]]);
  stages("longPoseAction", "The long pose again: weight thrown off-centre", "lean", () => cam(0.36, 0.87, 0.095, { yaw: -26, pitch: 6 }),
    [["1 · gesture", "one sweeping line; the plumb line shows the lean"], ["2 · mannequin", "ribcage and pelvis tilt AGAINST each other"],
     ["3 · landmarks", "shoulder line and hip line are not parallel — mark both"], ["4 · contour", "stretch side smooth, pinch side folded"]]);

  /* ============================================================
     Motion, one page each: side view above, three-quarter below
     ============================================================ */
  const motion = (key, title, list, tips, o = {}) => {
    const n = list.length, s = o.s || 0.05, gA = 0.47, gB = 0.87;
    const xs = i => 0.5 + (i - (n - 1) / 2) * (0.86 / n);
    const set = () => list.flatMap(([name, pose], i) => [
      [F(pose), cam(xs(i), gA, s, { yaw: -90, pitch: 2, dist: Infinity }), name, i],
      [F(pose), cam(xs(i), gB, s, { yaw: -52, pitch: 8, dist: 30 }), null, i]]);
    reg(key, [
      ["gesture, ground and plumb", ctx => {
        K.title(ctx, title);
        K.line(ctx, 0.04, gA, 0.96, gA); K.line(ctx, 0.04, gB, 0.96, gB);
        cap(ctx, 0.05, 0.125, "SIDE VIEW", { bold: true }); cap(ctx, 0.05, 0.555, "THE SAME POSES, THREE-QUARTER", { bold: true });
        const arc = [];
        for (const [f, c, name, i] of set()) {
          draw(ctx, c, f.gesture.concat([G3.seg(f.J.neck, [f.J.neck[0], 0, f.J.neck[2]], { dash: true, lw: 0.8 })]));
          if (name) { cap(ctx, xs(i) - 0.045, gA + 0.02, `${i + 1} · ${name}`, { bold: true }); arc.push(frac(c, f.J.pelvis)); }
        }
        K.style(ctx, { dash: true, lw: LW() * 0.6 }); K.poly(ctx, arc, false); K.style(ctx);
        notes(ctx, 0.905, tips, 0.027);
      }],
      ["mannequin", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "mannequin"); }],
      ["contour", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "contour"); }],
    ]);
  };
  motion("walkCycle", "The walk: four positions, then they repeat mirrored",
    [["contact", P.walkContact], ["passing", P.walkPass], ["contact", flip(P.walkContact)], ["passing", flip(P.walkPass)]],
    ["The dashed path through the hips RISES at each passing position and dips at each contact. The dashed vertical is the plumb line.",
     "Arms swing opposite to the legs: left leg forward, right arm forward. The shoulders twist against the hips.",
     "Level 2 builds the mannequin on each gesture; level 3 is the contour. Trace the side view, then draw the three-quarter row yourself."]);
  motion("runCycle", "The run: the body falls forward and both feet leave the ground",
    [["push-off", flip(P.run)], ["flight", { ...P.run, ground: false, root: [0, 4.05, 0] }], ["landing", P.run]],
    ["The plumb line falls AHEAD of the feet — a runner is always catching a fall. Lean the whole spine, not just the head.",
     "Elbows bent near 90° and pumping high; the back leg kicks up behind. In flight nothing touches the ground line.",
     "Push the lean and the stride further than the guide once you can copy it: comics runs are exaggerated."]);
  motion("jumpArc", "The jump: compress, stretch, stretch, compress",
    [["crouch", P.crouch], ["launch", P.launch], ["apex", P.apex], ["land", P.crouch]],
    ["The dashed path through the hips is ONE arc. Every position hangs from that arc — draw it first, before any figure.",
     "Crouch and landing are a closed C; launch and apex are an open, stretched line. The contrast is what reads as power.",
     "Arms lead the launch (thrown up and forward) and trail at the apex. Feet reach for the ground before the landing."], { s: 0.036 });

  /* ============================================================
     Foreshortening the whole torso
     ============================================================ */
  {
    const views = [[-48, "from far below"], [-24, "from below"], [0, "eye level"], [26, "from above"], [50, "from far above"]];
    const set = () => views.map(([pitch, name], i) =>
      [F("contrapposto"), cam(0.12 + i * 0.19, 0.42, 0.043, { yaw: 24, pitch, dist: 12, target: [0, 4, 0] }), name]);
    reg("foreshortTorso", [
      ["ribcage, pelvis and head", ctx => {
        K.title(ctx, "The torso foreshortened: one pose, five camera heights");
        for (const [f, c, name] of set()) { draw(ctx, c, only(f, TORSO)); cap(ctx, xOf(c) - 0.07, 0.68, name, { bold: true }); }
        notes(ctx, 0.76, ["Level 1: only the ribcage box, pelvis box and head. From below, the pelvis is nearest: it is drawn BIGGER and overlaps the ribs.",
                          "From above the order reverses: head and shoulders are biggest and the feet shrink to almost nothing.",
                          "Watch the top and bottom faces of each box: from below you see the UNDERSIDES, from above the tops.",
                          "Level 2 adds the limbs on those boxes; level 3 is the contour. Draw level 1 for all five before adding a single limb."], 0.04);
      }],
      ["limbs", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "mannequin"); }],
      ["contour", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "contour"); }],
    ]);
  }

  /* ============================================================
     Mannequin turnaround and mannequins in action
     ============================================================ */
  {
    const names = ["front", "three-quarter", "side", "back three-quarter", "back", "back three-quarter", "side", "three-quarter"];
    const set = () => names.map((name, i) =>
      [F("contrapposto"), cam(0.14 + (i % 4) * 0.24, i < 4 ? 0.47 : 0.87, 0.05, { yaw: i * 45, pitch: 4 }), name, i]);
    reg("mannequinTurn", [
      ["gesture", ctx => {
        K.title(ctx, "One pose, turned through eight views");
        for (const [f, c, name, i] of set()) { draw(ctx, c, f.gesture); cap(ctx, xOf(c) - 0.07, (i < 4 ? 0.47 : 0.87) + 0.02, name, { bold: true }); }
        notes(ctx, 0.925, ["The pose never changes — only where you stand. Shoulder tilt and hip tilt stay opposed in every view.",
                           "Level 2: ribcage and pelvis boxes. Follow one corner of the ribcage round all eight. Level 3: limbs and joints."], 0.035);
      }],
      ["ribcage and pelvis boxes", ctx => { for (const [f, c] of set()) draw(ctx, c, only(f, TORSO)); }],
      ["limbs and joints", ctx => { for (const [f, c] of set()) fig(ctx, c, f, "mannequin"); }],
    ]);

    const acts = [["run", -30, "running"], ["punch", 28, "punching"], ["reach", -24, "reaching"], ["crouch", 30, "crouching"], ["hero", -22, "standing tall"], ["launch", 34, "leaping"]];
    const aset = () => acts.map(([pose, yaw, name], i) =>
      [F(pose), cam(0.2 + (i % 3) * 0.3, i < 3 ? 0.47 : 0.87, 0.043, { yaw, pitch: 6 }), name, i]);
    reg("mannequinAction", [
      ["gesture", ctx => {
        K.title(ctx, "Six actions: the gesture decides, the mannequin obeys");
        for (const [f, c, name, i] of aset()) { draw(ctx, c, f.gesture.concat(plumb(f))); cap(ctx, xOf(c) - 0.06, (i < 3 ? 0.47 : 0.87) + 0.02, name, { bold: true }); }
        notes(ctx, 0.925, ["Level 1: one line of action per pose, plus the plumb line. If the gesture does not read, the mannequin cannot rescue it.",
                           "Level 2 hangs the boxes and tubes on each line; level 3 is the contour. Copy two, then pose two of your own."], 0.035);
      }],
      ["mannequin", ctx => { for (const [f, c] of aset()) fig(ctx, c, f, "mannequin"); }],
      ["contour", ctx => { for (const [f, c] of aset()) fig(ctx, c, f, "contour"); }],
    ]);
  }

  /* ============================================================
     Anatomy: skeleton turned, muscles from the side, limb close-ups
     ============================================================ */
  {
    const set = () => [[0, "front"], [90, "side"], [180, "back"]].map(([yaw, name], i) => [F("stand"), cam(0.2 + i * 0.3, 0.86, 0.085, { yaw, pitch: 3 }), name]);
    reg("skeletonTurn", [
      ["the body's outline", ctx => {
        K.title(ctx, "The skeleton from the front, the side and the back");
        for (const [f, c, name] of set()) { fig(ctx, c, f, "contour"); cap(ctx, xOf(c) - 0.03, 0.885, name, { bold: true }); }
        notes(ctx, 0.93, ["SIDE: the spine is a double S — neck forward, ribcage back, lower back forward, pelvis tipped. The ribcage hangs in FRONT of it.",
                          "BACK: shoulder blades ride on the ribcage; the spine and the two dimples of the pelvis are your landmarks."], 0.035);
      }],
      ["the skeleton", ctx => { for (const [f, c] of set()) draw(ctx, c, Rigs.skeleton(f)); }],
    ]);

    const mset = () => [[F("stand"), cam(0.27, 0.86, 0.092, { yaw: 90, pitch: 4 }), "side"], [F("hero"), cam(0.71, 0.86, 0.092, { yaw: 148, pitch: 4 }), "back three-quarter"]];
    reg("muscleSide", [
      ["mannequin", ctx => {
        K.title(ctx, "The masses from the side and from behind");
        for (const [f, c, name] of mset()) { fig(ctx, c, f, "mannequin"); cap(ctx, xOf(c) - 0.05, 0.885, name, { bold: true }); }
        notes(ctx, 0.93, ["SIDE: front and back masses alternate down the body — chest forward, shoulder blades back, belly forward, buttocks back, thigh forward, calf back.",
                          "BEHIND: the trapezius is a kite from skull to mid-back; the lats make the V; glutes are two squared masses, not circles."], 0.035);
      }],
      ["masses", ctx => { for (const [f, c] of mset()) draw(ctx, c, [...ghost(f.solids), ...Rigs.muscles(f)]); }],
    ]);

    /* close-ups: one arm and one leg, with only their own masses */
    const pose = "stand";
    const limb = (f, parts, jts) => f.solids.filter(s => s.side === "R" && (parts.includes(s.part) || (s.part === "joint" && jts.includes(s.jt))));
    const mus = (f, list) => Rigs.muscles(f).filter(m => list.includes(m.name));
    const A = ["deltoidR", "bicepsR", "tricepsR", "forearmR"], L = ["gluteR", "quadsR", "hamsR", "calfR"];
    const ca = f => cam(0.2, 0.42, 0.19, { yaw: -32, pitch: 4, dist: 14, target: f.J.elR });
    const cl = f => cam(0.62, 0.48, 0.125, { yaw: -58, pitch: 4, dist: 16, target: f.J.knR });
    const text = { deltoidR: "deltoid — caps the shoulder", bicepsR: "biceps — bends the elbow", tricepsR: "triceps — straightens it", forearmR: "forearm — a twisted wedge",
                   gluteR: "gluteus — extends the hip", quadsR: "quadriceps — straightens the knee", hamsR: "hamstrings — bend it", calfR: "calf — points the foot" };
    reg("limbMuscles", [
      ["the limb as tubes", ctx => {
        K.title(ctx, "Close-up: the arm and the leg, mass by mass");
        const f = F(pose);
        draw(ctx, ca(f), limb(f, ["upperArm", "foreArm", "hand"], ["sh", "el"]));
        draw(ctx, cl(f), limb(f, ["thigh", "shin", "foot"], ["hip", "kn"]));
        cap(ctx, 0.06, 0.13, "THE ARM", { bold: true }); cap(ctx, 0.52, 0.13, "THE LEG, from the side", { bold: true });
        notes(ctx, 0.86, ["Level 1: the tubes from the mannequin. Level 2: each mass as ONE egg lying on its tube. Level 3: what each mass does.",
                          "Muscles work in PAIRS on opposite sides of a bone: biceps and triceps, quadriceps and hamstrings.",
                          "The mass that is working is short and round; its partner is long and flat. Bend the limb and they swap.",
                          "The widest point of each mass is at a different height on each side — that stagger is the rhythm of a limb."], 0.035);
      }],
      ["masses", ctx => {
        const f = F(pose);
        draw(ctx, ca(f), [...ghost(limb(f, ["upperArm", "foreArm", "hand"], ["sh", "el"])), ...mus(f, A)]);
        draw(ctx, cl(f), [...ghost(limb(f, ["thigh", "shin", "foot"], ["hip", "kn"])), ...mus(f, L)]);
      }],
      ["what each mass does", ctx => {
        const f = F(pose), M = Rigs.muscles(f);
        const rows = (list, c, tx, y0) => list.map(k => [k, frac(c, M.find(m => m.name === k).c)]).sort((a, b) => a[1][1] - b[1][1])
          .forEach(([k, p], i) => leader(ctx, c, M.find(m => m.name === k).c, tx, y0 + i * 0.1, text[k]));
        rows(A, ca(f), 0.33, 0.24); rows(L, cl(f), 0.76, 0.26);
      }],
    ]);
  }

  /* ============================================================
     One page per species, and the dog turned
     ============================================================ */
  const species = (key, kind, s, title, tips) => {
    const c0 = () => cam(0.46, 0.6, s, { yaw: 18, pitch: 6, dist: 34 });
    const c1 = () => cam(0.27, 0.9, s * 0.5, { yaw: 62, pitch: 8, dist: 34 });
    const c2 = () => cam(0.73, 0.9, s * 0.5, { yaw: -148, pitch: 8, dist: 34 });
    const cams = () => [c0(), c1(), c2()];
    const ground = G3.seg([-5, 0, 0], [5.6, 0, 0], { lw: 0.7, hide: false });
    reg(key, [
      ["spine and leg lines", ctx => {
        K.title(ctx, title);
        cams().forEach((c, i) => draw(ctx, c, Q(kind).gesture.concat(i ? [] : [ground])));
        cap(ctx, 0.06, 0.92, "from the front", { bold: true }); cap(ctx, 0.84, 0.92, "from behind", { bold: true });
        notes(ctx, 0.937, tips, 0.027);
      }],
      ["volumes", ctx => cams().forEach(c => draw(ctx, c, Q(kind).solids))],
      ["joint names", ctx => {
        const a = Q(kind), c = c0();
        a.J.legs.FR.forEach((p, i) => leader(ctx, c, p, 0.84, 0.36 + i * 0.04, a.names.front[i]));
        a.J.legs.HR.forEach((p, i) => leader(ctx, c, p, 0.04, 0.2 + i * 0.045, a.names.hind[i]));
      }],
    ]);
  };
  species("horseBuild", "horse", 0.066, "The horse: long bones, high joints, one toe",
    ["Deep ribcage, long neck rising from the withers, small pelvis. The legs are mostly BELOW the body: the hock sits very high.",
     "It stands on one fingertip — the hoof. Knee (really the wrist) and hock are the two joints you must place before anything else."]);
  species("catBuild", "cat", 0.094, "The cat: a spring with a loose spine",
    ["Low and long: the spine is the most flexible of the four, so its curve changes more than any limb does.",
     "On its toes like the dog, but the shoulder blades rise above the spine when it crouches. Small skull, short muzzle."]);
  species("bearBuild", "bear", 0.088, "The bear: flat feet and a heavy front",
    ["Plantigrade: the whole foot is on the ground, heel included, so the legs look short and thick — like a person on all fours.",
     "A hump at the shoulders, a big skull on a short neck, and the mass sits low. Draw the weight before the fur."]);

  {
    const views = [[0, "side"], [48, "three-quarter front"], [90, "front"], [-140, "three-quarter back"]];
    const set = () => views.map(([yaw, name], i) => [Q("dog"), cam(0.27 + (i % 2) * 0.47, i < 2 ? 0.45 : 0.84, 0.05, { yaw, pitch: 8, dist: 34 }), name, i]);
    reg("dogTurn", [
      ["spine and leg lines", ctx => {
        K.title(ctx, "The dog, turned: the same mannequin from four sides");
        for (const [a, c, name, i] of set()) { draw(ctx, c, a.gesture); cap(ctx, xOf(c) - 0.1, (i < 2 ? 0.45 : 0.84) + 0.035, name, { bold: true }); }
        notes(ctx, 0.925, ["From the front the ribcage is a tall egg, NOT a circle, and the front legs hang inside its width.",
                           "From behind the pelvis is narrower than the ribs and the hocks point slightly inward. Level 2 adds the volumes."], 0.035);
      }],
      ["volumes", ctx => { for (const [a, c] of set()) draw(ctx, c, a.solids); }],
    ]);
  }

  /* ============================================================
     The head, all the way round
     ============================================================ */
  {
    const views = [[0, "front"], [35, "three-quarter"], [65, "nearly profile"], [90, "profile"], [135, "from behind the ear"], [180, "back"]];
    const set = () => views.map(([yaw], i) => [Rigs.head(), cam(0.19 + (i % 3) * 0.31, 0.3 + Math.floor(i / 3) * 0.33, 0.092, { yaw, pitch: 4, dist: 16 })]);
    reg("headTurnaround", [
      ["the ball and its axes", ctx => {
        K.title(ctx, "The head all the way round: six views of one skull");
        views.forEach(([, name], i) => cap(ctx, 0.1 + (i % 3) * 0.31, 0.46 + Math.floor(i / 3) * 0.33, name, { bold: true }));
        for (const [h, c] of set()) draw(ctx, c, h.part.ball);
        notes(ctx, 0.86, ["Follow the centre line: straight at the front, a curve at three-quarter, the silhouette's edge in profile, gone from behind.",
                          "From behind, the jaw still shows below the ear on both sides and the neck enters the skull HIGH, at ear level.",
                          "Level 2 adds the side planes and jaw; level 3 the thirds and features. All six are one person — keep every proportion fixed."], 0.035);
      }],
      ["side planes and jaw", ctx => { for (const [h, c] of set()) draw(ctx, c, [...ghost(h.part.ball), ...h.part.sides, ...h.part.neck, ...h.part.jaw]); }],
      ["thirds and features", ctx => { for (const [h, c] of set()) draw(ctx, c, [...ghost(h.part.ball), ...ghost(h.part.jaw), ...h.part.thirds, ...h.part.features]); }],
    ]);
  }
})();
