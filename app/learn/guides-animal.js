/* ============================================================
   learn/guides-animal.js — leveled guides for the animal and
   creature chapters. Every animal here is a REAL one, built from
   the shared skeleton plan in rigs.js; nothing is invented for the
   student. The creature pages give scaffolds (scale, sheet layout)
   and leave the creature itself to them.
   ============================================================ */
"use strict";

(() => {
  const { K, LW, cam, draw, frac, leader, cap, reg } = GuideKit;
  const Q = Rigs.quadruped;
  const ground = (x0, x1) => G3.seg([x0, 0, 0], [x1, 0, 0], { lw: 0.7, hide: false });
  const gesture = a => a.gesture;
  const parts = (a, list) => a.solids.filter(s => list.includes(s.part));
  const notParts = (a, list) => a.solids.filter(s => !list.includes(s.part));

  /* ---------- the quadruped mannequin: a dog ---------- */
  {
    const c0 = () => cam(0.47, 0.72, 0.092, { yaw: 18, pitch: 6, dist: 34 });
    reg("quadruped", [
      ["spine and leg lines", ctx => {
        K.title(ctx, "The quadruped mannequin: the same parts as you, rotated 90°");
        draw(ctx, c0(), gesture(Q("dog")).concat(ground(-5, 5.4)));
        K.note(ctx, 0.82, "Level 1: the spine as ONE line from nose to tail tip, then a line per leg. The two ovals are the ribcage and pelvis.");
        K.note(ctx, 0.86, "Level 2: the volumes. Ribcage egg, pelvis, a neck tube, a skull with a muzzle box, tapered tubes for every bone.");
        K.note(ctx, 0.9, "Level 3: the joint names. Read the hind leg from the top: hip, knee, HOCK, knuckle, toes.");
        K.note(ctx, 0.94, "The 'backwards knee' is the animal's ANKLE. A dog stands on its toes, with its heel in the air.");
      }],
      ["volumes", ctx => draw(ctx, c0(), Q("dog").solids)],
      ["joint names", ctx => {
        const a = Q("dog"), c = c0();
        a.J.legs.FR.forEach((p, i) => leader(ctx, c, p, 0.8, 0.22 + i * 0.045, a.names.front[i]));
        a.J.legs.HR.forEach((p, i) => leader(ctx, c, p, 0.06, 0.3 + i * 0.045, a.names.hind[i], {}));
      }],
    ]);
  }

  /* ---------- the same bones in a human and a dog ---------- */
  {
    const man = () => Rigs.figure({ armL: [[0, -1, 0.1], [0, -1, 0.35]], armR: [[0, -1, 0.1], [0, -1, 0.35]] });
    const cm = () => cam(0.2, 0.78, 0.068, { yaw: -90, pitch: 3, dist: Infinity });
    const cd = () => cam(0.63, 0.78, 0.07, { yaw: 0, pitch: 3, dist: Infinity });
    const num = ["1", "2", "3", "4"], let2 = ["A", "B", "C", "D"];
    reg("limbHomology", [
      ["two mannequins", ctx => {
        K.title(ctx, "Skeleton check: the same joints, in the same order, in you and a dog");
        draw(ctx, cm(), man().solids.concat(ground(-2, 2)));
        draw(ctx, cd(), Q("dog").solids.concat(ground(-4.6, 5)));
        K.note(ctx, 0.86, "Level 2 numbers the joints. ARM / FORELEG:  1 shoulder · 2 elbow · 3 wrist · 4 knuckles.");
        K.note(ctx, 0.9, "LEG / HIND LEG:  A hip · B knee · C ankle (the dog's hock) · D ball of the foot.");
        K.note(ctx, 0.94, "Nothing is missing and nothing is extra — the dog's foot bones are simply LONG, and it stands on D.");
      }],
      ["matching joints", ctx => {
        const f = man(), a = Q("dog"), c1 = cm(), c2 = cd();
        const mark = (c, p, t, dx) => { const [x, y] = frac(c, p); K.dot(ctx, x, y, 0.03); K.label(ctx, x + dx, y, t, { fs: 0.13, bold: true }); };
        [f.J.shL, f.J.elL, f.J.wrL, G3.lerp(f.J.wrL, f.J.ftL, 0.5)].forEach((p, i) => mark(c1, p, num[i], 0.03));
        [f.J.hipL, f.J.knL, f.J.anL, f.J.toeL].forEach((p, i) => mark(c1, p, let2[i], -0.05));
        a.J.legs.FR.slice(1, 5).forEach((p, i) => mark(c2, p, num[i], 0.025));
        a.J.legs.HR.slice(0, 4).forEach((p, i) => mark(c2, p, let2[i], -0.045));
      }],
    ]);
  }

  /* ---------- three ways to stand ---------- */
  {
    const list = [["bear", "PLANTIGRADE — bear, human", "the whole foot is on the ground", 0.105],
                  ["dog", "DIGITIGRADE — dog, cat", "on the toes; heel in the air", 0.092],
                  ["horse", "UNGULIGRADE — horse, deer", "on ONE toenail: the hoof", 0.072]];
    const set = () => list.map(([kind, , , s], i) => {
      const a = Q(kind), h = a.J.legs.HR;
      return [a, cam(0.2 + i * 0.3 - h[0][0] * s * 0.6, 0.72, s, { yaw: 0, pitch: 3, dist: Infinity, target: [h[2][0] * 0.5, 0, 0] })];
    });
    const leg = a => a.solids.filter(s => s.leg === "HR" || s.part === "pelvis");
    reg("legCompare", [
      ["the hind leg, three ways", ctx => {
        K.title(ctx, "Three ways to stand: how much of the foot touches the ground");
        K.line(ctx, 0.04, 0.72, 0.96, 0.72);
        set().forEach(([a, c], i) => {
          draw(ctx, c, [G3.path(a.J.legs.HR, { lw: 1.7 })].concat(a.J.legs.HR.map(p => G3.pt(p, { r: 2.6 }))));
          cap(ctx, 0.07 + i * 0.3, 0.77, list[i][1], { bold: true }); cap(ctx, 0.07 + i * 0.3, 0.8, list[i][2]);
        });
        K.note(ctx, 0.87, "The same four bones in each leg. Level 2 puts the volumes on; level 3 marks the HEEL on all three.");
        K.note(ctx, 0.91, "Follow the heel: on the floor in a bear, knee-high in a dog, almost at the belly in a horse.");
        K.note(ctx, 0.95, "Longer foot bones mean a longer stride — which is why the fastest runners stand on the least foot.");
      }],
      ["volumes", ctx => set().forEach(([a, c]) => draw(ctx, c, leg(a)))],
      ["where the heel is", ctx => set().forEach(([a, c]) => {
        const [x, y] = frac(c, a.J.legs.HR[2]);
        K.circle(ctx, x, y, 0.028); K.label(ctx, x - 0.11, y - 0.03, "HEEL", { fs: 0.12, bold: true });
      })],
    ]);
  }

  /* ---------- comparative line-up ---------- */
  {
    const APE = { upperArm: 1.95, foreArm: 1.85, thigh: 1.2, shin: 1.1, chestW: 1.95, chestW0: 1.6, chestD: 1.25, limb: 1.28, neck: 0.1, shoulder: 1.08, pelvisW: 1.5 };
    const apePose = { pelvis: [0, 48, 0], chest: [0, 60, 0], head: [0, -42, 0],
      legL: [[0.18, -0.72, 0.68], [0, -1, -0.5]], legR: [[-0.18, -0.72, 0.68], [0, -1, -0.5]],
      armL: [[0.12, -1, 0.12], [0, -1, 0.04]], armR: [[-0.12, -1, 0.12], [0, -1, 0.04]], handL: [0, -0.4, 1], handR: [0, -0.4, 1] };
    const set = () => [
      [Q("cat"), cam(0.24, 0.43, 0.062, { yaw: 16, pitch: 5, dist: 40 }), "cat — a spring: long back, low head"],
      [Q("horse"), cam(0.7, 0.43, 0.042, { yaw: 16, pitch: 5, dist: 40 }), "horse — a table: stiff back, long legs"],
      [Q("bear"), cam(0.24, 0.76, 0.056, { yaw: 16, pitch: 5, dist: 40 }), "bear — a barrel on flat feet"],
      [Rigs.figure(apePose, APE), cam(0.74, 0.76, 0.06, { yaw: -70, pitch: 5, dist: 40 }), "ape — the bridge to us: on the knuckles"]];
    reg("speciesLineup", [
      ["gesture", ctx => {
        K.title(ctx, "Comparative anatomy: one plan, four proportions");
        for (const [a, c, name] of set()) {
          draw(ctx, c, a.gesture.concat(ground(-4.4, 5)));
          cap(ctx, c.cx / K.page().w - 0.2, c.cy / K.page().h + 0.035, name, { bold: true });
        }
        K.note(ctx, 0.87, "Four variables separate these animals: leg LENGTH against body depth, neck length, how the foot meets the ground,");
        K.note(ctx, 0.91, "and how much the spine bends. Check those four on any mammal you have never drawn and you can build it.");
        K.note(ctx, 0.95, "The ape carries its weight on long arms: the same shoulder as yours, used as a front leg.");
      }],
      ["volumes", ctx => { for (const [a, c] of set()) draw(ctx, c, a.solids); }],
    ]);
  }

  /* ---------- birds ---------- */
  {
    const c1 = () => cam(0.28, 0.66, 0.075, { yaw: 18, pitch: 8, dist: 30 });
    const c2 = () => cam(0.72, 0.5, 0.05, { yaw: 78, pitch: 26, dist: 30, target: [0, 2.6, 0] });
    const core = ["body", "neck", "head", "beak", "eye", "leg", "toe", "wingBone"];
    reg("birdMannequin", [
      ["egg, ball and action line", ctx => {
        K.title(ctx, "Birds: an egg, a ball, and a wing that folds like your arm");
        draw(ctx, c1(), Rigs.bird().gesture.concat(ground(-3, 3.2)));
        draw(ctx, c2(), Rigs.bird({ open: true }).gesture);
        cap(ctx, 0.14, 0.72, "standing, wings folded", { bold: true }); cap(ctx, 0.56, 0.72, "from the front, wings open", { bold: true });
        K.note(ctx, 0.8, "Level 1: a tilted egg for the body, a ball for the head, an S for the neck — and the wing as three lines.");
        K.note(ctx, 0.84, "Level 2: the bones. The wing is an ARM: upper arm, forearm, hand. Folded, it makes a Z against the body.");
        K.note(ctx, 0.88, "The leg's 'backwards knee' is the ANKLE again; the real knee is hidden up inside the body feathers.");
        K.note(ctx, 0.92, "Level 3: feathers as GROUPS — a fan off the hand (primaries), a fan off the forearm (secondaries), the tail.");
      }],
      ["bones and volumes", ctx => { draw(ctx, c1(), parts(Rigs.bird(), core)); draw(ctx, c2(), parts(Rigs.bird({ open: true }), core)); }],
      ["feather groups", ctx => { draw(ctx, c1(), parts(Rigs.bird(), ["feathers", "tail"])); draw(ctx, c2(), parts(Rigs.bird({ open: true }), ["feathers", "tail"])); }],
    ]);
  }

  /* ---------- reptiles and fish ---------- */
  {
    const set = () => [
      [Rigs.lizard(), cam(0.56, 0.3, 0.1, { yaw: 18, pitch: 56, dist: 30, target: [-0.8, 0, 0] }), [0.06, 0.4], "lizard from above — legs out to the SIDES"],
      [Rigs.lizard(), cam(0.56, 0.55, 0.1, { yaw: 12, pitch: 8, dist: 30, target: [-0.8, 0, 0] }), [0.06, 0.6], "…and from the side: the belly nearly on the ground"],
      [Rigs.fish(), cam(0.52, 0.76, 0.115, { yaw: 22, pitch: 10, dist: 30 }), [0.06, 0.88], "fish — one flattened egg; fins are flat planes"]];
    reg("reptileFish", [
      ["action lines", ctx => {
        K.title(ctx, "Reptiles and fish: a tube that bends, and where things attach to it");
        for (const [a, c, at, name] of set()) { draw(ctx, c, a.gesture); cap(ctx, at[0], at[1], name, { bold: true }); }
        K.note(ctx, 0.93, "A lizard's legs go OUT then DOWN — elbows and knees point sideways. A mammal's legs go straight down under it.");
        K.note(ctx, 0.97, "Draw the spine's S-curve first on all three. Level 2 hangs the forms on it.");
      }],
      ["forms", ctx => { for (const [a, c] of set()) draw(ctx, c, a.solids); }],
    ]);
  }

  /* ---------- insects ---------- */
  {
    const c1 = () => cam(0.46, 0.4, 0.105, { yaw: 28, pitch: 22, dist: 30 });
    const c2 = () => cam(0.5, 0.74, 0.085, { yaw: 0, pitch: 86, dist: 30 });
    const masses = ["head", "thorax", "abdomen"];
    reg("insectPlan", [
      ["three masses", ctx => {
        K.title(ctx, "Insects: three masses, and every leg attaches to the MIDDLE one");
        draw(ctx, c1(), parts(Rigs.insect(), masses)); draw(ctx, c2(), parts(Rigs.insect(), masses));
        cap(ctx, 0.06, 0.15, "three-quarter", { bold: true }); cap(ctx, 0.06, 0.62, "from directly above", { bold: true });
        K.note(ctx, 0.89, "Level 1: head, thorax, abdomen — an exoskeleton is armour, so draw hard shells, not soft bodies.");
        K.note(ctx, 0.93, "Level 2: six legs, ALL from the thorax, each one up to a knee and down to the ground; antennae; the abdomen's plates.");
        K.note(ctx, 0.97, "Spiders: two masses and eight legs. Crabs: one shell, ten legs. Count the masses first, then the legs.");
      }],
      ["legs, antennae, plates", ctx => {
        draw(ctx, c1(), Rigs.insect().solids.map(s => masses.includes(s.part) ? { ...s, noStroke: true, rings: null } : s));
        draw(ctx, c2(), Rigs.insect().solids.map(s => masses.includes(s.part) ? { ...s, noStroke: true, rings: null } : s));
      }],
    ]);
  }

  /* ---------- skulls ---------- */
  {
    const blocks = ["cranium", "muzzle", "jaw"];
    const set = () => [
      [Rigs.skull("predator"), cam(0.36, 0.34, 0.16, { yaw: 34, pitch: 10, dist: 30, target: [0.4, -0.1, 0] })],
      [Rigs.skull("prey"), cam(0.36, 0.7, 0.14, { yaw: 34, pitch: 10, dist: 30, target: [0.8, -0.2, 0] })]];
    reg("skullCompare", [
      ["cranium, muzzle, jaw", ctx => {
        K.title(ctx, "Skulls: what the animal eats decides the shape");
        for (const [a, c] of set()) draw(ctx, c, parts(a, blocks));
        cap(ctx, 0.06, 0.14, "THE HUNTER (wolf, cat)", { bold: true }); cap(ctx, 0.06, 0.52, "THE HUNTED (horse, deer)", { bold: true });
        [["eyes face FORWARD — judging distance", 0.2], ["short muzzle = a stronger bite", 0.24], ["a crest on top anchors the jaw muscle", 0.28],
         ["long canines; back teeth like scissors", 0.32]].forEach(([t, y]) => K.label(ctx, 0.64, y, "• " + t, { fs: 0.1 }));
        [["eyes on the SIDES — watching everywhere", 0.58], ["long muzzle: room for grinding teeth", 0.62], ["a gap, then a row of flat molars", 0.66],
         ["deep jaw for chewing sideways", 0.7]].forEach(([t, y]) => K.label(ctx, 0.64, y, "• " + t, { fs: 0.1 }));
        K.note(ctx, 0.9, "Level 1: three blocks — a cranium, a muzzle, a jaw. Level 2: eye sockets, cheek arches, teeth.");
        K.note(ctx, 0.94, "Put a head on any creature and these rules tell the reader what it eats before it opens its mouth.");
      }],
      ["sockets, arches, teeth", ctx => { for (const [a, c] of set()) draw(ctx, c, a.solids.map(s => blocks.includes(s.part) ? { ...s, noStroke: true, rings: null } : s)); }],
    ]);
  }

  /* ---------- gaits ---------- */
  {
    const F = { reach: [[-0.2, -1], [0.5, -1], [0.45, -1], [1, -0.2]], back: [[-0.85, -0.7], [-0.5, -1], [-0.35, -1], [0.8, -0.6]],
                lift: [[-0.5, -0.9], [0.3, -1], [-0.9, -0.5], [-0.5, -0.9]], mid: null };
    const H = { reach: [[0.95, -0.9], [-0.6, -1], [0.5, -1], [1, -0.2]], back: [[0.1, -1], [-1, -0.8], [-0.35, -1], [0.8, -0.6]],
                lift: [[0.6, -1], [-1, -0.5], [0.2, -1], [0.3, -1]], mid: null };
    const pose = (fr, fl, hr, hl, extra = {}) => ({ legs: { FR: F[fr], FL: F[fl], HR: H[hr], HL: H[hl] }, ...extra });
    const walk = [["hind foot lifts", pose("back", "mid", "lift", "reach")], ["then the front foot on that side", pose("lift", "back", "reach", "mid")],
                  ["the other hind", pose("reach", "back", "mid", "lift")], ["the other front", pose("mid", "lift", "back", "reach")]];
    const gallop = [["gathered — all four off the ground", pose("lift", "lift", "reach", "reach", { air: true, lift: 2.0, pitch: -4 })],
                    ["hind legs drive", pose("reach", "reach", "back", "back", { pitch: -8 })],
                    ["stretched — front legs reach", pose("reach", "reach", "back", "back", { air: true, lift: 1.6, pitch: 4 })]];
    const set = () => [
      ...walk.map(([n, p], i) => [Q("dog", p), cam(0.14 + i * 0.24, 0.42, 0.024, { yaw: 0, pitch: 3, dist: Infinity }), n, 0.42]),
      ...gallop.map(([n, p], i) => [Q("horse", p), cam(0.2 + i * 0.31, 0.8, 0.026, { yaw: 0, pitch: 3, dist: Infinity }), n, 0.8])];
    reg("gaits", [
      ["leg lines and footfalls", ctx => {
        K.title(ctx, "Gaits: the order the feet land is the whole animal's rhythm");
        K.label(ctx, 0.06, 0.2, "WALK (dog) — one foot at a time; three are always down", { fs: 0.11, bold: true });
        K.label(ctx, 0.06, 0.52, "GALLOP (horse) — a spring that folds and opens; twice a stride it is airborne", { fs: 0.11, bold: true });
        K.line(ctx, 0.04, 0.42, 0.96, 0.42); K.line(ctx, 0.04, 0.8, 0.96, 0.8);
        for (const [a, c, name, g] of set()) {
          const down = Object.values(a.J.legs).map(l => l[l.length - 1]).filter(p => p[1] < 0.12);
          draw(ctx, c, a.gesture.concat(down.map(p => G3.pt([p[0], 0, p[2]], { r: 3.4 }))));
          cap(ctx, c.cx / K.page().w - 0.1, g + 0.025, name, { fs: 0.092 });
        }
        K.note(ctx, 0.9, "The dots are feet on the ground. In the walk, count three dots in every frame. In the gallop, sometimes none.");
        K.note(ctx, 0.94, "The spine barely moves in a walk and FOLDS in a gallop. Level 2 builds the volumes on each frame.");
      }],
      ["volumes", ctx => { for (const [a, c] of set()) draw(ctx, c, a.solids); }],
    ]);

    /* ---------- attitude ---------- */
    const moods = [
      ["alert — everything lifts", { neck: [0.5, 1], headDir: [1, 0.05], tail: [[-2.65, 4.65], [-3.3, 5.6], [-3.2, 6.6]] }],
      ["play bow — front down, rear up", { pitch: 22, neck: [1, 0.35], headDir: [1, 0.0], tail: [[-2.65, 4.65], [-3.2, 5.7], [-2.9, 6.7]],
        legs: { FR: [[0.2, -1], [1, -0.42], [1, -0.1], [1, -0.05]], FL: [[0.2, -1], [1, -0.42], [1, -0.1], [1, -0.05]] } }],
      ["afraid — everything drops and tucks", { neck: [1, -0.05], headDir: [1, -0.5], tail: [[-2.65, 4.5], [-2.9, 3.4], [-2.2, 2.4]],
        legs: { HR: [[0.9, -0.8], [-1, -0.55], [0.3, -1], [1, -0.2]], HL: [[0.9, -0.8], [-1, -0.55], [0.3, -1], [1, -0.2]],
                FR: [[-0.75, -0.75], [0.3, -1], [0.1, -1], [1, -0.3]], FL: [[-0.75, -0.75], [0.3, -1], [0.1, -1], [1, -0.3]] } }]];
    const mset = () => moods.map(([n, p], i) => [Q("dog", p), cam(0.52, 0.36 + i * 0.25, 0.044, { yaw: 14, pitch: 5, dist: 40 }), n, 0.36 + i * 0.25]);
    reg("animalAttitude", [
      ["the line of each mood", ctx => {
        K.title(ctx, "Animal acting: the spine, the head height and the tail say it");
        for (const [a, c, name, g] of mset()) { draw(ctx, c, a.gesture.concat(ground(-5, 5.4))); cap(ctx, 0.06, g - 0.17, name, { bold: true }); }
        K.note(ctx, 0.9, "Level 1: three action lines. Up and open reads as confidence; a low curve with the weight back reads as fear.");
        K.note(ctx, 0.94, "Caricature pushes exactly these lines — never the detail. Level 2 is the same dog underneath all three.");
      }],
      ["volumes", ctx => { for (const [a, c] of mset()) draw(ctx, c, a.solids); }],
    ]);
  }

  /* ---------- lizard, snake, frog ---------- */
  {
    const set = () => [
      [Rigs.lizard(), cam(0.56, 0.28, 0.092, { yaw: 22, pitch: 38, dist: 30, target: [-0.8, 0, 0] }), [0.06, 0.38], "lizard — the sprawl: out, then down"],
      [Rigs.snake(), cam(0.5, 0.5, 0.105, { yaw: 14, pitch: 42, dist: 30 }), [0.06, 0.6], "snake — one tapering tube on an S; widest in the middle"],
      [Rigs.frog(), cam(0.5, 0.83, 0.11, { yaw: 30, pitch: 18, dist: 30 }), [0.06, 0.9], "frog — a wide bean on folded springs"]];
    reg("lizardSnakeFrog", [
      ["action lines", ctx => {
        K.title(ctx, "Lizard, snake, frog: construction first, surface last");
        for (const [a, c, at, name] of set()) { draw(ctx, c, a.gesture); cap(ctx, at[0], at[1], name, { bold: true }); }
        K.note(ctx, 0.95, "Level 1 is the line of action for each animal — draw it exactly as you would for a figure. Level 2: the forms.");
        K.note(ctx, 0.985, "The rings round each tube are where the scale rows will run. Texture goes on LAST, and only where it earns its place.");
      }],
      ["forms", ctx => { for (const [a, c] of set()) draw(ctx, c, a.solids); }],
    ]);
  }

  /* ---------- scale: your creature beside real ones ---------- */
  {
    const HEAD = 0.233;                                   // metres per head of a 1.75 m person
    const G = 0.8, M = 0.2;                               // ground line; page widths per metre
    const set = () => [
      [Rigs.figure("stand"), cam(0.17, G, M * HEAD, { yaw: 20, dist: Infinity })],
      [Q("dog"), cam(0.4, G, M * 0.12, { yaw: 14, pitch: 4, dist: Infinity })],
      [Q("horse"), cam(0.69, G, M * 0.245, { yaw: 14, pitch: 4, dist: Infinity })]];
    reg("creatureScale", [
      ["the scale wall", ctx => {
        K.title(ctx, "Scale: stand your creature next to things the reader already knows");
        for (let m = 0; m <= 3; m += 0.5) {
          const y = G - K.V(m * M);
          K.style(ctx, { dash: m % 1 !== 0, lw: LW() * 0.5 }); K.line(ctx, 0.07, y, 0.97, y); K.style(ctx);
          if (m % 1 === 0) K.label(ctx, 0.025, y, m + " m", { fs: 0.1, bold: true });
        }
        for (const [a, c] of set()) G3.outline(ctx, c, a.solids, { fill: 0.22, fillOnly: true });
        cap(ctx, 0.1, G + 0.03, "a person — 1.75 m", { bold: true }); cap(ctx, 0.34, G + 0.03, "a dog", { bold: true }); cap(ctx, 0.66, G + 0.03, "a horse", { bold: true });
        K.note(ctx, 0.89, "These three silhouettes are REAL sizes on a metre wall. Draw your own creature's silhouette on the same ground line.");
        K.note(ctx, 0.93, "Size changes design: big animals have thick, straight legs under them; small ones can sprawl, leap and cling.");
        K.note(ctx, 0.97, "Fill your silhouette solid. If it can't be told from the dog or the horse, change its biggest shape.");
      }],
      ["mannequins", ctx => { for (const [a, c] of set()) draw(ctx, c, a.solids); }],
    ]);

    /* ---------- the creature sheet: a layout, not a creature ---------- */
    reg("sheetLayout", [
      ["the layout", ctx => {
        K.title(ctx, "The creature sheet: what a designer hands to the next artist");
        const box = (x, y, w, h, t, sub) => {
          K.style(ctx, { dash: true }); K.rect(ctx, x, y, w, h); K.style(ctx);
          K.label(ctx, x + 0.012, y + 0.022, t, { fs: 0.11, bold: true });
          if (sub) K.label(ctx, x + 0.012, y + 0.046, sub, { fs: 0.09 });
        };
        box(0.06, 0.12, 0.56, 0.48, "1 · MAIN VIEW — three-quarter", "the clearest angle; the pose says what it does");
        box(0.65, 0.12, 0.29, 0.225, "2 · SIDE", "true proportions"); box(0.65, 0.37, 0.29, 0.225, "3 · FRONT", "true width");
        box(0.06, 0.5, 0.27, 0.22, "4 · HEAD", "eyes, teeth: what it eats"); box(0.35, 0.5, 0.27, 0.22, "5 · FEET / HANDS", "how it meets the ground");
        box(0.65, 0.5, 0.29, 0.22, "6 · IN MOTION", "two frames of its gait"); box(0.06, 0.675, 0.88, 0.2, "7 · SCALE — beside a person", "");
        const c = cam(0.13, 0.86, 0.019, { yaw: 20, dist: Infinity });
        G3.outline(ctx, c, Rigs.figure("stand").solids, { fill: 0.25, fillOnly: true });
        K.note(ctx, 0.94, "Seven boxes. Every one answers a question another artist would otherwise have to ask you.");
        K.note(ctx, 0.975, "Nothing here is designed for you — the frames are empty on purpose. Fill them with YOUR creature.");
      }],
    ]);
  }
})();
