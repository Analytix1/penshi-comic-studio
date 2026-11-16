/* ============================================================
   learn/guides-more2.js — deep-dive pages, second batch:
   hands, expressions, vehicles and environments.
   ============================================================ */
"use strict";

(() => {
  const { K, LW, cam, draw, frac, cap, reg, handLevels, face } = GuideKit;
  const { add, norm } = G3;
  const B = G3.box, C = G3.cyl;
  const ghost = items => items.map(it => ({ ...it, noStroke: true, rings: null, decals: null, tone: 0, fill: 0 }));
  const xOf = c => c.cx / K.page().w, yOf = c => c.cy / K.page().h;
  const notes = (ctx, y, list, dy = 0.035) => list.forEach((t, i) => K.note(ctx, y + i * dy, t));
  const vp = (c, dir) => { const v = G3.vanish(c, dir); return v && [v[0] / K.page().w, v[1] / K.page().h]; };
  const ray = (ctx, c, p, v) => { const [x, y] = frac(c, p); K.line(ctx, x, y, v[0], v[1]); };
  const thin = (ctx, fn) => { K.style(ctx, { lw: LW() * 0.5, dash: true }); fn(); K.style(ctx); };
  const rect = (pts, o = {}) => G3.path(pts, { close: true, lw: 0.8, ...o });

  /* ============================================================
     Hands
     ============================================================ */
  {
    const names = ["back", "", "thumb edge", "", "palm", "", "little-finger edge", ""];
    const at = i => [0.14 + (i % 4) * 0.24, i < 4 ? 0.3 : 0.62];
    const set = () => names.map((_, i) => [Rigs.hand("relaxed"), cam(at(i)[0], at(i)[1], 0.075, { yaw: i * 45, pitch: 10, dist: 12 })]);
    reg("handTurn", handLevels(set, {
      title: ctx => {
        K.title(ctx, "One relaxed hand, turned through eight views");
        names.forEach((n, i) => n && cap(ctx, at(i)[0] - 0.06, at(i)[1] + 0.135, n, { bold: true }));
        notes(ctx, 0.84, ["The palm box is thin: edge-on it is a narrow wedge, thicker at the wrist than at the knuckles.",
                          "From the thumb edge, the thumb covers the palm; from the little-finger edge the fingers stack behind one another.",
                          "A relaxed hand is never flat. The fingers curl more from index to pinky — keep that in every view."]);
      },
    }));
  }
  {
    const poses = ["open", "relaxed", "claw", "grip", "fist"];
    const at = i => [0.12 + (i % 5) * 0.19, i < 5 ? 0.3 : 0.62];
    const set = () => [...poses, ...poses].map((p, i) => [Rigs.hand(p), cam(at(i)[0], at(i)[1], 0.07, { yaw: i < 5 ? 78 : 24, pitch: 10, dist: 12 })]);
    reg("handCurl", handLevels(set, {
      title: ctx => {
        K.title(ctx, "Closing the hand: five stages from open to fist");
        poses.forEach((n, i) => cap(ctx, at(i)[0] - 0.03, 0.445, n, { bold: true }));
        cap(ctx, 0.05, 0.15, "FROM THE EDGE", { bold: true }); cap(ctx, 0.05, 0.49, "THE SAME FIVE, FROM THE BACK", { bold: true });
        notes(ctx, 0.8, ["Each finger is three boxes that fold at two knuckles and the palm edge. They fold in ORDER: tip, middle, base.",
                         "The fingertips travel on a spiral toward the base of the palm. In a fist, the tips tuck in and the thumb locks across the front.",
                         "From the back, a closing hand gets SHORTER and its knuckle arc becomes the top edge. The palm box hardly changes.",
                         "Draw the edge-on row first — it is the diagram. The back row is how you will usually see it."]);
      },
    }));
  }
  {
    const list = [["grip", 22, 12, "a staff, knuckles toward you"], ["grip", 205, 18, "the same grip from the palm side"],
                  ["claw", 160, 14, "cradling a ball"], ["pinch", 150, 30, "a pen, seen from above"]];
    const at = i => [0.27 + (i % 2) * 0.46, 0.3 + Math.floor(i / 2) * 0.33];
    const set = () => list.map(([pose, yaw, pitch], i) => {
      const h = Rigs.hand(pose);
      h.props = pose === "grip" ? [C(h.T([-1.6, 0.3, -0.5]), h.T([1.6, 0.3, -0.5]), 0.19, 0.19, { rings: [0.2, 0.8] })]
              : pose === "claw" ? [G3.ball(h.T([0, 0.62, -0.78]), 0.56, { rings: ["xz"] })]
              : [C(h.T([-0.34, 1.2, -0.62]), h.T([0.2, -0.5, 0.2]), 0.05, 0.05)];
      return [h, cam(at(i)[0], at(i)[1], 0.1, { yaw, pitch, dist: 12 })];
    });
    reg("handHolding", handLevels(set, {
      title: ctx => {
        K.title(ctx, "Holding things: draw the object first, then wrap the hand round it");
        list.forEach(([, , , n], i) => cap(ctx, at(i)[0] - 0.13, at(i)[1] + 0.175, n, { bold: true }));
        notes(ctx, 0.9, ["Level 1 includes the object. Its form decides the hand: fingers follow a cylinder's contour, or spread to the width of a ball.",
                         "The thumb always OPPOSES the fingers — it presses from the other side of the object. Find where it presses first.",
                         "Where a finger passes in front of the object, the object's outline stops. Where the object is in front, the finger's does."], 0.032);
      },
      props: h => h.props,
    }));
  }
  {
    const tilts = [0, 28, 52, 70, 84];
    const at = i => [0.12 + (i % 5) * 0.19, i < 5 ? 0.3 : 0.63];
    const set = () => [...tilts.map(t => ["open", t]), ...tilts.map(t => ["fist", t])].map(([pose, t], i) =>
      [Rigs.hand(pose, { R: G3.euler(0, t, 0) }), cam(at(i)[0], at(i)[1], 0.082, { yaw: 0, pitch: 6, dist: 7 })]);
    reg("handAimed", handLevels(set, {
      title: ctx => {
        K.title(ctx, "Tipping the hand toward you, a step at a time");
        tilts.forEach((t, i) => cap(ctx, at(i)[0] - 0.02, 0.46, t + "°", { bold: true }));
        cap(ctx, 0.05, 0.14, "AN OPEN HAND", { bold: true }); cap(ctx, 0.05, 0.5, "A FIST", { bold: true });
        notes(ctx, 0.8, ["Left to right the same hand tips from upright to pointing straight at the viewer. Nothing changes but the angle.",
                         "Watch the length collapse while the WIDTH stays the same: by 84° each finger is a stack of three overlapping box-ends.",
                         "The near end grows. At 84° the fingertips (or the knuckles of the fist) are the largest forms and hide the palm.",
                         "Copy one row in order. If a step looks wrong, the step before it was already off — go back one."]);
      },
    }));
  }

  /* ============================================================
     Expressions
     ============================================================ */
  {
    const { faceBase, faceFeatures, faceArrows, faceGrid, expr, NEUTRAL } = face;
    const scale = (name, k) => { const e = expr(name), o = {}; for (const key in NEUTRAL) o[key] = NEUTRAL[key] + (e[key] - NEUTRAL[key]) * k; return o; };
    const emo = ["joy", "anger", "fear", "sadness"], amt = [[0.4, "a hint"], [1, "clear"], [1.55, "pushed"]];
    const cells = () => faceGrid(emo.flatMap(n => amt.map(([k]) => [n, scale(n, k)])), 3, 0.07, 0.34, 0.185, 0.25, 0.185);
    reg("expressionIntensity", [
      ["the heads", ctx => {
        K.title(ctx, "How much? Four emotions at three strengths");
        amt.forEach(([, n], i) => cap(ctx, 0.3 + i * 0.25, 0.105, n, { bold: true }));
        emo.forEach((n, i) => cap(ctx, 0.05, 0.2 + i * 0.185, n.toUpperCase(), { bold: true }));
        for (const [, , x, y, r] of cells()) faceBase(ctx, x, y, r);
        notes(ctx, 0.9, ["Each row is ONE emotion. Only the amount changes: the same parts move the same way, further.",
                         "'A hint' is what most panels need. 'Pushed' is for the one panel per scene where the feeling breaks out.",
                         "Level 2: the features. Level 3: arrows for what moved — they get longer left to right, never change direction."], 0.03);
      }],
      ["the features", ctx => { for (const [, e, x, y, r] of cells()) faceFeatures(ctx, x, y, r, e); }],
      ["what moved", ctx => { for (const [, e, x, y, r] of cells()) faceArrows(ctx, x, y, r, e); }],
    ]);

    const MORE = [
      ["disgust", { bi: -0.1, bo: 0.02, pinch: 0.05, eo: 0.6, ll: 0.8, mw: 0.82, mc: -0.5, mo: 0.1 }],
      ["suspicion", { bi: -0.09, bo: 0, pinch: 0.03, arch: 0, eo: 0.5, ll: 0.6, mw: 0.85, mc: -0.15 }],
      ["exhaustion", { bi: 0.07, bo: -0.07, arch: 0, eo: 0.42, ll: 0.1, mw: 0.9, mc: -0.3, mo: 0.14 }],
      ["delight", { bi: 0.14, bo: 0.16, arch: 0.08, eo: 1.2, ll: 0.7, mw: 1.36, mc: 1, mo: 0.55 }],
      ["rage", { bi: -0.24, bo: 0.12, pinch: 0.1, arch: -0.03, eo: 1.1, ll: 0.55, mw: 1.2, mc: -0.5, mo: 0.7 }],
      ["grief", { bi: 0.22, bo: -0.12, pinch: 0.06, arch: 0, eo: 0.35, ll: 0.3, mw: 1.05, mc: -0.95, mo: 0.4 }]];
    const more = () => faceGrid(MORE.map(([n, e]) => [n, expr(e)]), 3, 0.118, 0.19, 0.24, 0.31, 0.33);
    reg("expressionMore", [
      ["the head, six times", ctx => {
        K.title(ctx, "Six more: the expressions between and beyond the basic six");
        for (const [name, , x, y, r] of more()) { faceBase(ctx, x, y, r); cap(ctx, x - 0.05, y + K.V(r * 1.7), name, { bold: true }); }
        notes(ctx, 0.9, ["Disgust and suspicion both narrow the eyes; disgust also lifts the lower lid hard and drops the mouth corners.",
                         "Rage is anger with the mouth open and the eyes wide; grief is sadness with the eyes closing. Delight is joy plus raised brows.",
                         "Exhaustion is the only one where everything simply DROPS: brows, lids, mouth. Nothing is being held."], 0.03);
      }],
      ["the features", ctx => { for (const [, e, x, y, r] of more()) faceFeatures(ctx, x, y, r, e); }],
      ["what moved", ctx => { for (const [, e, x, y, r] of more()) faceArrows(ctx, x, y, r, e); }],
    ]);
  }

  /* ============================================================
     Vehicles
     ============================================================ */
  const wheels = (xs, r, half) => xs.flatMap(x => [1, -1].map(k => C([x, r, k * (half - 0.14)], [x, r, k * (half + 0.1)], r, r, { rings: [0.5] })));
  {
    const car = {
      body: () => [B([0, 0.66, 0], [4.4, 0.7, 1.84])],
      cabin: () => [G3.tbox([-0.25, 1.31, 0], { w0: 2.7, w1: 1.7, h: 0.6, d0: 1.74, d1: 1.5 })],
      wheels: () => wheels([1.42, -1.42], 0.38, 0.92),
      detail: () => {
        const o = [];
        for (const z of [0.925, -0.925]) {
          o.push(G3.path([[-0.2, 0.36, z], [-0.2, 1.0, z]]), G3.path([[0.9, 0.36, z], [0.9, 1.0, z]]), G3.path([[-1.0, 0.36, z], [-1.0, 1.0, z]]));
          for (const x of [1.42, -1.42]) o.push(G3.path(Array.from({ length: 13 }, (_, i) => { const a = Math.PI * i / 12; return [x + Math.cos(a) * 0.52, 0.38 + Math.sin(a) * 0.52, z]; })));
        }
        for (const x of [2.205, -2.205]) for (const k of [1, -1])
          o.push(rect([[x, 0.62, k * 0.9], [x, 0.62, k * 0.45], [x, 0.82, k * 0.45], [x, 0.82, k * 0.9]]));
        return o;
      },
    };
    const views = [[0, 8, "side"], [40, 12, "front three-quarter"], [-140, 12, "rear three-quarter"], [40, 52, "from above"]];
    const at = i => [0.27 + (i % 2) * 0.47, 0.34 + Math.floor(i / 2) * 0.3];
    const cams = () => views.map(([yaw, pitch], i) => cam(at(i)[0], at(i)[1], 0.085, { yaw, pitch, dist: 10, target: [0, 0.7, 0] }));
    reg("carTurn", [
      ["the big box", ctx => {
        K.title(ctx, "The same car from four sides");
        cams().forEach((c, i) => { draw(ctx, c, car.body().map(b => ({ ...b, through: true, hide: false }))); cap(ctx, at(i)[0] - 0.08, at(i)[1] + 0.105, views[i][2], { bold: true }); });
        notes(ctx, 0.83, ["Level 1: one box, drawn through, in four views. The wheelbase is about 2.5 wheels between the axles, in every view.",
                          "Level 2: the tapered cabin box and four wheels. From behind, the cabin sits toward the BACK of the body, as it does from the front.",
                          "Level 3: arches, door lines, lights. From above you see the roof is narrower than the body — the sides lean in.",
                          "Cars are symmetrical: whatever you draw on the near side has a partner on the far side, smaller."]);
      }],
      ["cabin and wheels", ctx => cams().forEach(c => draw(ctx, c, [...ghost(car.body()), ...car.cabin(), ...car.wheels()]))],
      ["arches, doors, lights", ctx => cams().forEach(c => draw(ctx, c, [...ghost([...car.body(), ...car.cabin(), ...car.wheels()]), ...car.detail()]))],
    ]);

    const side = (z, pts) => rect(pts.map(([x, y]) => [x, y, z]));
    const types = [
      ["VAN", "one tall box and a short nose", 4.8, {
        big: () => [B([-0.3, 1.3, 0], [3.6, 1.9, 1.9]), B([2.0, 0.9, 0], [1.0, 1.1, 1.9])],
        more: () => [...wheels([1.6, -1.4], 0.42, 0.95), side(0.955, [[-1.9, 1.45], [1.3, 1.45], [1.3, 2.05], [-1.9, 2.05]]), rect([[1.505, 1.45, 0.8], [1.505, 1.45, -0.8], [1.505, 2.1, -0.8], [1.505, 2.1, 0.8]])] }],
      ["PICKUP", "nose, cab, open bed", 5.6, {
        big: () => [B([0.4, 1.25, 0], [1.7, 1.7, 1.9]), B([2.0, 0.9, 0], [1.5, 1.0, 1.9]), B([-1.75, 0.85, 0], [2.6, 0.9, 1.9])],
        more: () => [...wheels([2.0, -1.8], 0.46, 0.95), side(0.955, [[-0.3, 1.4], [1.1, 1.4], [0.9, 2.0], [-0.3, 2.0]]), side(0.955, [[-2.9, 1.2], [-0.6, 1.2], [-0.6, 0.55], [-2.9, 0.55]])] }],
      ["BUS", "one long box", 8.4, {
        big: () => [B([0, 1.85, 0], [8, 2.7, 2.3])],
        more: () => [...wheels([2.8, -2.6], 0.5, 1.15), side(1.155, [[-3.6, 1.9], [2.9, 1.9], [2.9, 2.8], [-3.6, 2.8]]), side(1.155, [[3.15, 0.55], [3.8, 0.55], [3.8, 2.8], [3.15, 2.8]]),
                     rect([[4.005, 1.7, 1.0], [4.005, 1.7, -1.0], [4.005, 2.9, -1.0], [4.005, 2.9, 1.0]])] }],
      ["SPORTS CAR", "a low wedge, cabin set back", 4.6, {
        big: () => [B([0, 0.52, 0], [4.4, 0.5, 1.9]), G3.tbox([-0.4, 0.99, 0], { w0: 2.2, w1: 1.1, h: 0.44, d0: 1.7, d1: 1.36 })],
        more: () => [...wheels([1.45, -1.4], 0.36, 0.95), side(0.86, [[-1.3, 0.8], [0.5, 0.8], [0.05, 1.16], [-0.85, 1.16]])] }]];
    const tat = i => [0.27 + (i % 2) * 0.47, 0.36 + Math.floor(i / 2) * 0.3];
    const tcam = i => cam(tat(i)[0], tat(i)[1], 0.36 / types[i][2], { yaw: 36, pitch: 13, dist: 16, target: [0, 1, 0] });
    reg("vehicleTypes", [
      ["the big volumes", ctx => {
        K.title(ctx, "Four vehicles, four recipes — all at the same angle");
        types.forEach(([name, how, , v], i) => { draw(ctx, tcam(i), v.big()); cap(ctx, tat(i)[0] - 0.16, tat(i)[1] + 0.11, name, { bold: true }); cap(ctx, tat(i)[0] - 0.02, tat(i)[1] + 0.11, how, { fs: 0.09 }); });
        notes(ctx, 0.84, ["Level 1: only the big boxes. What separates a van from a sports car is the PROPORTION of the boxes, long before any detail.",
                          "Level 2: wheels and glass. Wheel size against body height is the second tell: big wheels read rugged, small ones read heavy.",
                          "Each is drawn to the same width on the page, so compare shapes, not sizes. A bus is nearly twice a car's length.",
                          "Design your own on the next clean space: decide the boxes and the wheel size first, and write down why."]);
      }],
      ["wheels and glass", ctx => types.forEach(([, , , v], i) => draw(ctx, tcam(i), [...ghost(v.big()), ...v.more()]))],
    ]);
  }

  /* ============================================================
     Environments
     ============================================================ */
  {
    /* ---------- a furnished room ---------- */
    const W = 7, D = 6, H = 10;
    const shell = () => [rect([[-W, 0, -D], [W, 0, -D], [W, 0, D], [-W, 0, D]]), G3.path([[-W, 0, -D], [-W, H, -D], [W, H, -D], [W, 0, -D]], { lw: 0.8 }),
                         G3.path([[-W, H, -D], [-W, H, D], [-W, 0, D]], { lw: 0.8 })];
    const grid = () => [-4, -2, 0, 2, 4].map(z => G3.path([[-W, 0, z], [W, 0, z]], { lw: 0.4 })).concat([-5, -3, -1, 1, 3, 5].map(x => G3.path([[x, 0, -D], [x, 0, D]], { lw: 0.4 })));
    const legs = (cx, cz, w, d, h) => [[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([a, b]) => B([cx + a * (w / 2 - 0.12), h / 2, cz + b * (d / 2 - 0.12)], [0.2, h, 0.2]));
    const furn = () => [B([-4.9, 1, -1.6], [4.2, 2, 8.4]), B([-4.9, 2.4, -5.75], [4.2, 4.8, 0.3]),
                        B([3.6, 3, -4.4], [5, 0.25, 2.6]), ...legs(3.6, -4.4, 5, 2.6, 2.9),
                        B([3.2, 1.8, -1.9], [1.8, 0.2, 1.8]), B([3.2, 3.2, -1.1], [1.8, 2.6, 0.2]), ...legs(3.2, -1.9, 1.8, 1.8, 1.7),
                        B([-0.6, 3.6, -5.55], [3, 7.2, 0.8])];
    const person = () => Rigs.figure({ root: [1, 0, 2.2], pelvis: [-30, 0, 0], chest: [-30, 0, 0] }).solids.map(s => ({ ...s, rings: null, decals: null }));
    const detail = () => [rect([[1.6, 4.2, -5.99], [5.6, 4.2, -5.99], [5.6, 8.4, -5.99], [1.6, 8.4, -5.99]], { lw: 1.2 }), G3.path([[3.6, 4.2, -5.99], [3.6, 8.4, -5.99]], { lw: 0.6 }),
                          rect([[-6.99, 0, 1.6], [-6.99, 7.6, 1.6], [-6.99, 7.6, 4.6], [-6.99, 0, 4.6]], { lw: 1.2 }),
                          ...[1.4, 2.9, 4.4, 5.9].map(y => G3.path([[-2.1, y, -5.14], [0.9, y, -5.14]], { lw: 0.6 })),
                          B([-4.9, 2.25, -4.6], [3.2, 0.5, 1.6]), rect([[-1.6, 0.01, 0.4], [4.6, 0.01, 0.4], [4.6, 0.01, 4.4], [-1.6, 0.01, 4.4]], { lw: 0.6 }),
                          C([5.2, 3.13, -4.8], [5.2, 3.3, -4.8], 0.4, 0.4), C([5.2, 3.3, -4.8], [5.2, 4.4, -4.8], 0.05, 0.05), C([5.2, 4.3, -4.8], [5.2, 5.2, -4.8], 0.6, 0.3)];
    const c0 = () => cam(0.53, 0.5, 0.045, { yaw: 22, pitch: 14, dist: 26, target: [0, 4, 0] });
    reg("interiorRoom", [
      ["the empty room and its floor grid", ctx => {
        K.title(ctx, "An interior: the room first, then boxes, then a life");
        draw(ctx, c0(), [...shell(), ...grid()]);
        notes(ctx, 0.83, ["Level 1: floor, two walls and a floor grid in perspective. The grid is your ruler — every square is the same real size.",
                          "Level 2: furniture as plain boxes standing ON grid squares, and one figure to set the scale. A table top is at hip height;",
                          "a chair seat at the knee; a door a head taller than the figure. If the figure does not fit the furniture, fix the furniture.",
                          "Level 3: window, door, shelves, pillow, lamp, rug. Then add three objects that say WHO lives here."]);
      }],
      ["furniture boxes and a figure", ctx => draw(ctx, c0(), [...furn(), ...person()])],
      ["what makes it a room", ctx => draw(ctx, c0(), [...ghost([...furn(), ...person()]), ...detail()])],
    ]);

    /* ---------- a street in one-point ---------- */
    const rows = [[-1, [[4, -8, 12], [-8, -20, 18], [-20, -34, 10], [-34, -54, 15]]], [1, [[2, -12, 16], [-12, -24, 9], [-24, -40, 20], [-40, -58, 12]]]];
    const blocks = () => rows.flatMap(([k, list]) => list.map(([z0, z1, h]) => B([k * 10.5, h / 2, (z0 + z1) / 2], [8, h, z0 - z1 - 0.3])));
    const fronts = () => rows.flatMap(([k, list]) => list.flatMap(([z0, z1, h]) => {
      const x = k * 6.49, o = [];
      for (let y = 4.4; y + 2 < h; y += 3.5) o.push(rect([[x, y, z0 - 1], [x, y, z1 + 1], [x, y + 1.9, z1 + 1], [x, y + 1.9, z0 - 1]], { lw: 0.6 }));
      o.push(rect([[x, 0, z0 - 2], [x, 3.1, z0 - 2], [x, 3.1, z0 - 3.8], [x, 0, z0 - 3.8]]));
      return o;
    }));
    const road = () => [G3.path([[-6.5, 0, 10], [-6.5, 0, -70]], { lw: 0.7 }), G3.path([[6.5, 0, 10], [6.5, 0, -70]], { lw: 0.7 }),
                        G3.path([[-3.6, 0, 10], [-3.6, 0, -70]], { lw: 0.5 }), G3.path([[3.6, 0, 10], [3.6, 0, -70]], { lw: 0.5 })];
    const posts = () => [-4, -16, -28, -40].flatMap(z => [C([-4.2, 0, z], [-4.2, 6.2, z], 0.12, 0.09), B([-3.8, 6.2, z], [1, 0.16, 0.3])]);
    const folk = () => [[2.6, 5], [-2.2, -6], [4.6, -18]].flatMap(([x, z]) => Rigs.figure({ root: [x, 0, z], pelvis: [x > 0 ? -14 : 16, 0, 0] }).solids.map(s => ({ ...s, rings: null, decals: null })));
    const cs = () => cam(0.5, 0.45, 0.062, { yaw: 0, pitch: 0, dist: 15, target: [0, 6.9, 8] });
    reg("streetScene", [
      ["road, horizon, vanishing point", ctx => {
        K.title(ctx, "A street in one-point: everything aims at one dot on the horizon");
        const c = cs(), v = vp(c, [0, 0, -1]);
        draw(ctx, c, road());
        thin(ctx, () => { K.line(ctx, 0.03, v[1], 0.97, v[1]); for (const [x, y] of [[-6.5, 12], [6.5, 16], [-6.5, 18], [6.5, 9]]) ray(ctx, c, [x, y, 2], v); });
        K.dot(ctx, v[0], v[1], 0.03); K.label(ctx, 0.04, v[1] - 0.018, "horizon = eye level", { fs: 0.1, bold: true });
        notes(ctx, 0.83, ["Level 1: horizon, vanishing point, kerbs and the roof lines that will bound the buildings. Nothing else yet.",
                          "Level 2: each building is a box whose street face runs to the vanishing point. Vary the heights — a flat skyline is dead.",
                          "Level 3: windows in rows that also run to the point and get closer together with distance; doors, lamp posts, three people.",
                          "The people's eyes sit on the horizon however far away they are. Lamp posts shrink on the same two converging lines."]);
      }],
      ["building boxes", ctx => draw(ctx, cs(), blocks())],
      ["windows, doors, posts, people", ctx => draw(ctx, cs(), [...ghost(blocks()), ...fronts(), ...posts(), ...folk()])],
    ]);

    /* ---------- a landscape built in depth ---------- */
    const cone = (x, z, r, h, top = 0, rings = [0.35, 0.68]) => C([x, 0, z], [x, h, z], r, top, { rings });
    const tree = (x, z, s = 1) => [C([x, 0, z], [x, 1.2 * s, z], 0.18 * s, 0.14 * s), C([x, 0.9 * s, z], [x, 2.7 * s, z], 1.05 * s, 0.3 * s), C([x, 2.2 * s, z], [x, 3.9 * s, z], 0.75 * s, 0)];
    const bank = k => Rigs.smooth(Array.from({ length: 10 }, (_, i) => { const z = 8 - i * 7; return [Math.sin(z * 0.12) * 6 + k * (1.6 + (8 - z) * 0.02), 0, z]; }), 6);
    const land = () => [cone(-22, -58, 16, 17), cone(4, -66, 20, 23), cone(26, -56, 14, 13), cone(20, -30, 9, 5.5, 7, [0.5]), cone(-16, -20, 10, 3.2, 0, [0.5]), cone(14, -10, 7, 2.2, 0, [0.5])];
    const near = () => [...tree(-7, 3), ...tree(-9.5, 0.5, 1.2), ...tree(8, 2, 1.1), ...tree(-12, -9), ...tree(-14, -11, 0.9), ...tree(10, -14), ...tree(12.5, -15, 1.1), ...tree(-6, -30), ...tree(16, -34),
                        B([4.5, 0.5, 4.5], [1.6, 1, 1.2], G3.euler(24, 0, 8)), B([5.8, 0.3, 5.2], [0.9, 0.6, 0.8], G3.euler(-30, 6, 0)), B([-3.5, 0.35, 5.5], [1.1, 0.7, 0.9], G3.euler(50, 0, -6))];
    const cl = () => cam(0.5, 0.52, 0.026, { yaw: 0, pitch: 9, dist: 46, target: [0, 4, -8] });
    reg("terrainBuild", [
      ["horizon and river", ctx => {
        K.title(ctx, "A landscape in depth: far, middle and near, built in that order");
        const c = cl(), v = vp(c, [0, 0, -1]);
        draw(ctx, c, [G3.path(bank(1)), G3.path(bank(-1))]);
        thin(ctx, () => K.line(ctx, 0.03, v[1], 0.97, v[1]));
        K.label(ctx, 0.04, v[1] - 0.018, "horizon", { fs: 0.1, bold: true });
        notes(ctx, 0.8, ["Level 1: the horizon and one river that winds from the near edge of the page toward it, narrowing all the way.",
                         "Level 2: the land as simple solids with contour lines — three peaks far off, a flat-topped mesa, two low hills in the middle distance.",
                         "The contour lines are level in the real world, so they wrap each form like the rings on a cone. They show the slope.",
                         "Level 3: trees and rocks. Big and detailed in front, small and plain behind. The same tree, three sizes, is your depth scale."]);
      }],
      ["landforms with contour lines", ctx => draw(ctx, cl(), land())],
      ["trees and rocks", ctx => draw(ctx, cl(), [...ghost(land()), ...near()])],
    ]);

    /* ---------- one set, three lights ---------- */
    const lights = [["HIGH, FROM THE LEFT", norm([-0.7, 0.65, 0.3]), "ordinary daylight: readable, calm"], ["STRAIGHT OVERHEAD", norm([0.05, 1, 0.08]), "eye sockets fill with shadow: harsh, interrogating"],
                    ["LOW, FROM BEHIND", norm([0.55, 0.32, -0.75]), "long shadows toward us: threat, or sunset"]];
    const stuff = () => [...Rigs.figure({ root: [-0.6, 0, 0], pelvis: [24, 0, 0], chest: [24, 0, 0] }).solids.map(s => ({ ...s, rings: null, decals: null })), B([2.6, 1.1, -0.6], [2.2, 2.2, 2.2], G3.euler(20, 0, 0))];
    const sample = it => it.type === "mesh" ? it.verts
      : it.type === "cyl" ? [0, 1, 2, 3, 4, 5, 6, 7].flatMap(i => { const a = i * 0.785; return [[it.a, it.ra], [it.b, it.rb]].map(([p, r]) => add(p, [Math.cos(a) * r, 0, Math.sin(a) * r])); })
      : Array.from({ length: 26 }, (_, i) => { const a = i * 2.399, b = Math.acos(1 - 2 * (i + 0.5) / 26); return add(it.c, G3.ap(it.R, [it.r[0] * Math.sin(b) * Math.cos(a), it.r[1] * Math.cos(b), it.r[2] * Math.sin(b) * Math.sin(a)])); });
    const shadows = (items, Ld) => items.map(it => G3.path(G3.hull(sample(it).map(p => [p[0] - Ld[0] * (p[1] / Ld[1]), p[2] - Ld[2] * (p[1] / Ld[1])])).map(([x, z]) => [x, 0.002, z]),
      { close: true, fill: 0.3, noStroke: true, under: true }));
    const ck = i => cam(0.19 + i * 0.31, 0.6, 0.041, { yaw: -24, pitch: 16, dist: 24, target: [0.6, 0, 0] });
    reg("lightDirections", [
      ["the set, three times", ctx => {
        K.title(ctx, "One figure, one crate, three lights");
        lights.forEach(([name, Ld, how], i) => {
          const c = ck(i); draw(ctx, c, stuff());
          const a = frac(c, add([0.6, 4, 0], G3.mul(Ld, 7))), b = frac(c, add([0.6, 4, 0], G3.mul(Ld, 4.6)));
          K.arrow(ctx, a[0], a[1], b[0], b[1]);
          cap(ctx, 0.05 + i * 0.31, 0.7, name, { bold: true }); cap(ctx, 0.05 + i * 0.31, 0.725, how, { fs: 0.078 });
        });
        notes(ctx, 0.8, ["Level 1: the same set three times, with an arrow for where the light comes from. Decide this before any shading.",
                         "Level 2: values and cast shadows. Planes facing the arrow are light; planes facing away are dark; shadows fall on the far side.",
                         "A high side light explains form. Overhead light hides the eyes. A low back light throws the figure into silhouette.",
                         "Light direction is a story choice. Pick the mood of your scene first, then put the lamp where that mood needs it."]);
      }],
      ["values and cast shadows", ctx => lights.forEach(([, Ld], i) => draw(ctx, ck(i), [...shadows(stuff(), Ld), ...stuff().map(t => ({ ...t, tone: 1.05, noStroke: true }))], { light: Ld }))],
    ], { tints: ["#3b6ea8", "#2c3e60"] });
  }
})();
