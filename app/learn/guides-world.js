/* ============================================================
   learn/guides-world.js — leveled guides for forms, perspective,
   machines, vehicles, weapons, architecture, light and land.
   Everything is real geometry seen through a real camera, so the
   vanishing points drawn on a page are the ones the boxes on that
   page actually converge to.
   ============================================================ */
"use strict";

(() => {
  const { K, LW, cam, draw, fig, frac, leader, cap, reg } = GuideKit;
  const { add, mul, sub, norm } = G3;
  const B = G3.box, C = G3.cyl, I = G3.I();
  const thru = items => items.map(it => ({ ...it, through: true }));
  const ghost = items => items.map(it => ({ ...it, noStroke: true, rings: null, decals: null, tone: 0, fill: 0 }));
  const xOf = c => c.cx / K.page().w, yOf = c => c.cy / K.page().h;
  /* a vanishing point in page fractions (null when the lines stay parallel) */
  const vp = (c, dir) => { const v = G3.vanish(c, dir); return v && [v[0] / K.page().w, v[1] / K.page().h]; };
  const ray = (ctx, c, p, v) => { const [x, y] = frac(c, p); K.line(ctx, x, y, v[0], v[1]); };
  const thin = (ctx, fn, dash = true) => { K.style(ctx, { lw: LW() * 0.5, dash }); fn(); K.style(ctx); };
  /* long axis along world x: local x→world y, local y→world x, local z→world −z */
  const RX = [[0, 1, 0], [1, 0, 0], [0, 0, -1]];

  /* ============================================================
     Section 1 — forms
     ============================================================ */
  {
    const forms = () => [B([-3.3, 1, 0], [2, 2, 2], G3.euler(30, 0, 0)), C([-0.9, 0, 0], [-0.9, 2.4, 0], 0.85, 0.85, { rings: [0.5] }),
                         G3.ball([1.6, 1.05, 0], 1.05, { rings: ["xz", "yz"] }), C([4, 0, 0], [4, 2.5, 0], 1.0, 0, { rings: [0.45] })];
    const c0 = () => cam(0.48, 0.5, 0.088, { yaw: 0, pitch: 18, dist: 20, target: [0.2, 0.6, 0] });
    reg("primitives", [
      ["the four forms", ctx => {
        K.title(ctx, "The four primitives: cube, cylinder, sphere, cone");
        draw(ctx, c0(), forms().map(f => ({ ...f, rings: null })));
        [["cube — start with a Y", 0.1], ["cylinder", 0.36], ["sphere", 0.58], ["cone", 0.82]].forEach(([t, x]) => cap(ctx, x, 0.62, t, { bold: true }));
        K.note(ctx, 0.72, "Level 1: the outside of each form. Copy each three times, changing the angle of the cube's Y every time.");
        K.note(ctx, 0.76, "Level 2: draw THROUGH them — the hidden edges, and a contour line wrapped round each surface.");
        K.note(ctx, 0.8, "A contour line is what turns a circle into a ball. If you cannot place the hidden edge, you do not yet believe the form.");
      }],
      ["drawn through, with contours", ctx => draw(ctx, c0(), thru(forms()).map(f => ({ ...f, hide: false })))],
    ]);

    /* rows of boxes turning */
    const row = (y, fn) => Array.from({ length: 6 }, (_, i) => [B([0, 0, 0], [1.5, 1.5, 1.5], fn(i)), cam(0.13 + i * 0.15, y, 0.052, { pitch: 16, dist: 9 })]);
    const rows = () => [...row(0.27, i => G3.euler(i * 15, 0, 0)), ...row(0.5, i => G3.euler(20, i * 15, 0)), ...row(0.73, i => G3.euler(i * 15, i * 12, i * 8))];
    reg("boxRotations", [
      ["boxes", ctx => {
        K.title(ctx, "Boxes in space: each one turned a little more than the last");
        for (const [b, c] of rows()) draw(ctx, c, [b]);
        cap(ctx, 0.06, 0.17, "turning on a lazy Susan", { bold: true }); cap(ctx, 0.06, 0.4, "tumbling toward you", { bold: true }); cap(ctx, 0.06, 0.63, "both at once", { bold: true });
        K.note(ctx, 0.86, "Level 1: copy a row, then continue it yourself. As a face turns toward you it widens; turning away, it narrows.");
        K.note(ctx, 0.9, "Level 2 shows the far edges. Each set of parallel edges must CONVERGE toward one distant point — never spread.");
        K.note(ctx, 0.94, "Extend the edges of every box you draw. If they diverge, you drew the far face bigger than the near one.");
      }],
      ["the hidden edges", ctx => { for (const [b, c] of rows()) draw(ctx, c, [{ ...b, through: true, hide: false }]); }],
    ]);

    /* objects as recipes, then turned */
    const things = {
      house: () => [B([0, 0.75, 0], [2.2, 1.5, 1.6]), G3.prism([0, 1.5, 0], [[-1.1, 0], [1.1, 0], [0, 0.9]], 1.6)],
      mug: () => [C([0, 0, 0], [0, 1.6, 0], 0.7, 0.7, { rings: [0.5] }), ...Rigs.tube(Rigs.smooth([[0.7, 1.25, 0], [1.25, 1.2, 0], [1.3, 0.6, 0], [0.7, 0.45, 0]], 4), 0.1)],
      snowman: () => [G3.ball([0, 0.8, 0], 0.8), G3.ball([0, 1.95, 0], 0.58), G3.ball([0, 2.8, 0], 0.4)],
      lamp: () => [C([0, 0, 0], [0, 0.12, 0], 0.5, 0.5), C([0, 0.12, 0], [0, 1.7, 0], 0.07, 0.07), C([0, 1.5, 0], [0, 2.4, 0], 0.85, 0.4)],
      cart: () => [B([0, 0.95, 0], [2.4, 0.9, 1.4]), ...[[-0.8, 1], [0.8, 1], [-0.8, -1], [0.8, -1]].map(([x, k]) => C([x, 0.4, k * 0.72], [x, 0.4, k * 0.92], 0.4, 0.4))],
    };
    const names = Object.keys(things), recipe = { house: "box + wedge", mug: "cylinder + bent tube", snowman: "three spheres", lamp: "cone + thin cylinder", cart: "box + four cylinders" };
    const cm = (i, yaw, y) => cam(0.12 + i * 0.19, y, 0.048, { yaw, pitch: 16, dist: 14, target: [0, 1, 0] });
    reg("combineVolumes", [
      ["five recipes", ctx => {
        K.title(ctx, "Everything is primitives wearing a costume");
        names.forEach((n, i) => { draw(ctx, cm(i, 26, 0.36), things[n]()); cap(ctx, 0.04 + i * 0.19, 0.47, n.toUpperCase(), { bold: true }); cap(ctx, 0.04 + i * 0.19, 0.495, recipe[n], { fs: 0.085 }); });
        K.note(ctx, 0.84, "Level 1: say each recipe out loud, then copy it. The naming is the skill; the drawing is the proof.");
        K.note(ctx, 0.88, "Level 2: the SAME five objects, turned. You can draw them because you know the recipe — not the outline.");
        K.note(ctx, 0.92, "Start with the biggest volume at the new angle, then attach the others to its faces.");
      }],
      ["the same five, turned", ctx => {
        names.forEach((n, i) => draw(ctx, cm(i, -52, 0.72), things[n]()));
        cap(ctx, 0.04, 0.56, "…and from a different side:", { bold: true });
      }],
    ]);

    const inter = () => [
      [[B([0, 0, 0], [2.4, 1.6, 1.8]), C([-0.2, -1.6, 0.1], [-0.2, 1.9, 0.1], 0.5, 0.5)], cam(0.2, 0.36, 0.07, { yaw: 28, pitch: 20, dist: 14 }), "a cylinder driven through a box"],
      [[B([0, 0, 0], [2.2, 1.5, 2.0]), G3.ball([0.5, 0.75, 0.6], 0.95, { rings: ["xz"] })], cam(0.52, 0.36, 0.07, { yaw: -24, pitch: 22, dist: 14 }), "a ball half-buried in a box"],
      [[C([-1.7, 0, 0], [1.7, 0, 0], 0.62, 0.62, { rings: [0.5] }), C([0, -1.5, 0], [0, 1.5, 0], 0.5, 0.5, { rings: [0.5] })], cam(0.83, 0.36, 0.07, { yaw: 30, pitch: 18, dist: 14 }), "two pipes crossing"],
      [[B([0, 0, 0], [2.6, 1.4, 1.8], G3.euler(12, 0, 0)), C([0.4, -0.3, -1.6], [0.4, 0.6, 1.8], 0.42, 0.42), G3.ball([-0.9, 0.8, 0.4], 0.8)], cam(0.5, 0.7, 0.085, { yaw: 30, pitch: 22, dist: 14 }), "all three at once"]];
    reg("formIntersections", [
      ["forms that pass through each other", ctx => {
        K.title(ctx, "Form intersections: where exactly do the surfaces meet?");
        for (const [items, c, name] of inter()) { draw(ctx, c, thru(items).map(f => ({ ...f, hide: false }))); cap(ctx, xOf(c) - 0.12, yOf(c) + 0.15, name, { bold: true }); }
        K.note(ctx, 0.9, "These are drawn as glass so you can see every surface. The SEAM — the line where two forms meet — is yours to draw.");
        K.note(ctx, 0.94, "On a flat face the seam of a round form is an ellipse; where it crosses an edge, the seam kinks.");
        K.note(ctx, 0.98, "If you cannot draw the seam, you do not yet believe both forms are solid. That is the whole test.");
      }],
    ]);
  }

  /* ============================================================
     Perspective, with the camera's own vanishing points
     ============================================================ */
  {
    /* three-point */
    const city = () => [B([0, 3, 0], [2.4, 6, 2.4]), B([2.6, 1.6, 0.6], [1.8, 3.2, 1.8]), B([-2.4, 2.2, -0.4], [1.6, 4.4, 1.9]), B([0.2, 0.9, 2.6], [2.2, 1.8, 1.4])];
    const views = () => [[cam(0.27, 0.58, 0.05, { yaw: 30, pitch: -32, dist: 7.5, target: [0, 4.4, 0] }), "WORM'S-EYE — verticals converge UP", [0, 1, 0], city().slice(0, 3)],
                         [cam(0.74, 0.46, 0.05, { yaw: 30, pitch: 46, dist: 9, target: [0, 2.4, 0] }), "BIRD'S-EYE — verticals converge DOWN", [0, -1, 0], city()]];
    reg("persp3pt", [
      ["the towers", ctx => {
        K.title(ctx, "Three-point: when you look up or down, the verticals converge too");
        for (const [c, name, , items] of views()) { draw(ctx, c, items); cap(ctx, xOf(c) - 0.2, 0.85, name, { bold: true }); }
        K.note(ctx, 0.89, "Level 2 extends the vertical edges to the THIRD vanishing point. The closer that point is to the picture, the more extreme the view.");
        K.note(ctx, 0.93, "From below, a tower's base is wide and its top narrow: heroic. From above, the roof is big and the street shrinks: vertigo.");
        K.note(ctx, 0.97, "Use it for one panel in an issue. Used on every panel it stops meaning anything.");
      }],
      ["rays to the third point", ctx => {
        for (const [c, , dir, items] of views()) {
          const v = vp(c, dir);
          /* box corners: 0,1,4,5 are the base and 3,2,7,6 the top — start each ray at the end furthest from the point */
          thin(ctx, () => items.forEach(b => (dir[1] > 0 ? [0, 1, 4, 5] : [3, 2, 7, 6]).forEach(i => ray(ctx, c, b.verts[i], v))));
          K.dot(ctx, v[0], v[1], 0.03);
        }
      }],
    ]);

    /* wheels, barrels, arches */
    const scene = () => {
      const arch = Array.from({ length: 17 }, (_, i) => { const a = Math.PI * (16 - i) / 16; return [3.2 + Math.cos(a) * 1.0, 1.6 + Math.sin(a) * 1.0, -1.999]; });
      return {
        forms: [C([-4.3, 0.8, -1.2], [-4.3, 0.8, -0.9], 0.8, 0.8), C([-4.3, 0.8, 1.5], [-4.3, 0.8, 1.8], 0.8, 0.8),
                C([-0.6, 0.55, -0.4], [-0.6, 0.55, 1.6], 0.55, 0.55, { rings: [0.3, 0.7] }), C([0.6, 0.55, -0.4], [0.6, 0.55, 1.6], 0.55, 0.55, { rings: [0.3, 0.7] }),
                C([0, 1.5, -0.4], [0, 1.5, 1.6], 0.55, 0.55, { rings: [0.3, 0.7] }),
                B([3.2, 1.6, -2.3], [3.6, 3.2, 0.6]), G3.path([[2.2, 0, -1.999], ...arch, [4.2, 0, -1.999]], { top: true })],
        axes: [G3.seg([-4.3, 0.8, -2.4], [-4.3, 0.8, 3], { dash: true, lw: 0.8 }), G3.seg([0, 1.5, -1.4], [0, 1.5, 2.8], { dash: true, lw: 0.8 }),
               G3.seg([2.2, 1.6, -1.998], [4.2, 1.6, -1.998], { lw: 0.6 }), G3.seg([3.2, 0, -1.998], [3.2, 2.6, -1.998], { lw: 0.6 }),
               G3.path([[2.2, 0.6, -1.998], [4.2, 0.6, -1.998], [4.2, 2.6, -1.998], [2.2, 2.6, -1.998]], { close: true, lw: 0.6, dash: true })],
      };
    };
    const c1 = () => cam(0.5, 0.45, 0.07, { yaw: 34, pitch: 14, dist: 14, target: [-0.2, 1, 0] });
    reg("ellipseAxis", [
      ["wheels, barrels, an arch", ctx => {
        K.title(ctx, "Circles in space: the minor axis always runs along the axle");
        draw(ctx, c1(), scene().forms);
        cap(ctx, 0.06, 0.66, "two wheels on one axle", { bold: true }); cap(ctx, 0.4, 0.66, "barrels on their sides", { bold: true }); cap(ctx, 0.74, 0.66, "an arch in a wall", { bold: true });
        K.note(ctx, 0.8, "Level 2 draws the axles. Every ellipse here has its SHORT axis lying on its axle — that is the only rule.");
        K.note(ctx, 0.84, "The far wheel is smaller and a slightly different degree, but it sits on the same line. Get that and a car works.");
        K.note(ctx, 0.88, "An arch is half a circle on a VERTICAL plane: draw the square on the wall first, then fit the curve into it.");
      }],
      ["axles and construction", ctx => {
        const c = c1(), s = scene();
        draw(ctx, c, [...ghost(s.forms.filter(f => f.type !== "path")), ...s.axes]);
        const v = vp(c, [0, 0, -1]);
        if (v) { thin(ctx, () => { ray(ctx, c, [-4.3, 0.8, -1.2], v); ray(ctx, c, [0, 1.5, -0.4], v); }); K.dot(ctx, v[0], v[1], 0.028); K.label(ctx, v[0] + 0.012, v[1] - 0.02, "VP", { fs: 0.1 }); }
      }],
    ]);

    /* mirroring and stacking */
    const chair = () => [B([0, 1.5, 0], [1.6, 0.2, 1.6]), B([0, 2.6, -0.72], [1.6, 2.0, 0.16]),
      ...[[1, 1], [1, -1], [-1, 1], [-1, -1]].map(([x, z]) => B([x * 0.7, 0.7, z * 0.7], [0.18, 1.4, 0.18]))];
    const plane = () => [G3.mesh([[0, 0, -1.1], [0, 0, 1.1], [0, 3.8, 1.1], [0, 3.8, -1.1]], [{ v: [0, 1, 2, 3], two: true, sg: 1 }], { hide: false, dash: true, fill: 0.07, lw: 0.7 })];
    const tower = () => [B([0, 0.6, 0], [3, 1.2, 3]), B([0, 2.0, 0], [2.3, 1.6, 2.3]), B([0, 3.5, 0], [1.6, 1.4, 1.6]), C([0, 4.2, 0], [0, 5.3, 0], 0.62, 0.62, { rings: [0.5] }), C([0, 5.3, 0], [0, 5.8, 0], 0.62, 0)];
    const cc = () => cam(0.27, 0.7, 0.1, { yaw: 34, pitch: 16, dist: 12 }), ct = () => cam(0.74, 0.74, 0.08, { yaw: 34, pitch: 14, dist: 13 });
    reg("mirrorStack", [
      ["a chair and a tower", ctx => {
        K.title(ctx, "Mirroring and stacking: symmetry and height, in perspective");
        draw(ctx, cc(), chair()); draw(ctx, ct(), tower());
        cap(ctx, 0.08, 0.78, "MIRROR — a chair is two halves", { bold: true }); cap(ctx, 0.56, 0.78, "STACK — every box shares one axis", { bold: true });
        K.note(ctx, 0.85, "Level 2 shows the construction: the chair's CENTRE PLANE, and the tower's vertical axis with every box centred on it.");
        K.note(ctx, 0.89, "To mirror a point, measure its distance from the centre plane along a receding line and repeat it on the far side.");
        K.note(ctx, 0.93, "The far half always draws SMALLER. Cars, robots, thrones and faces are all built this way.");
      }],
      ["centre plane and axis", ctx => {
        draw(ctx, cc(), [...ghost(chair()), ...plane()]);
        draw(ctx, ct(), [...thru(tower()).map(t => ({ ...t, hide: false })), G3.seg([0, 0, 0], [0, 6.4, 0], { dash: true, top: true })]);
      }],
    ]);

    /* figures in a scene */
    const street = () => [B([-9, 4.5, -18], [6, 9, 44]), B([10, 6, -6], [7, 12, 14]), B([10.5, 3.5, -26], [8, 7, 20]),
                          ...[-8, -20, -32].map(z => C([-5.2, 0, z], [-5.2, 7.5, z], 0.14, 0.1))];
    const spots = [[3, 6], [-3, -2], [1.2, -12], [-1.2, -26]];
    const sc = () => cam(0.5, 0.42, 0.062, { yaw: 0, pitch: 0, dist: 15, target: [0, 6.9, 8] });
    const folk = () => spots.map(([x, z]) => Rigs.figure({ root: [x, 0, z], pelvis: [x > 0 ? -12 : 14, 0, 0] }));
    reg("figuresInScene", [
      ["the street", ctx => {
        K.title(ctx, "Figures in a scene: everyone your height has their eyes ON the horizon");
        const c = sc();
        draw(ctx, c, street().concat([G3.path([[-6, 0, 10], [-6, 0, -60]], { lw: 0.7 }), G3.path([[6.4, 0, 10], [6.4, 0, -60]], { lw: 0.7 })]));
        thin(ctx, () => K.line(ctx, 0.03, yOf(c), 0.97, yOf(c)));
        K.label(ctx, 0.04, yOf(c) - 0.018, "HORIZON = your eye level", { fs: 0.105, bold: true });
        K.note(ctx, 0.84, "Level 2 drops four people of the same height into the street. Their feet land at four different heights on the page —");
        K.note(ctx, 0.88, "but every pair of eyes sits on the horizon. That single check places a whole crowd without measuring anything.");
        K.note(ctx, 0.92, "Level 3: to give a distant figure the height of a near one, run two rays from the near figure to the vanishing point.");
      }],
      ["four figures", ctx => { const c = sc(); draw(ctx, c, [...ghost(street()), ...folk().flatMap(f => f.solids)]); }],
      ["height-transfer rays", ctx => {
        const c = sc(), f = folk()[0], v = vp(c, [0, 0, -1]);
        thin(ctx, () => { ray(ctx, c, f.J.crown, v); ray(ctx, c, [f.J.crown[0], 0, f.J.crown[2]], v); });
        K.dot(ctx, v[0], v[1], 0.03); K.label(ctx, v[0] + 0.014, v[1] + 0.024, "VP", { fs: 0.105, bold: true });
      }],
    ]);
  }

  /* ============================================================
     Machines, vehicles, weapons, props
     ============================================================ */
  {
    const J = {
      hinge: () => [B([-0.75, 0, 0], [1.4, 0.14, 1.5]), B([0.72, 0.42, 0], [1.4, 0.14, 1.5], G3.euler(0, 0, 32)), C([0, 0.02, -0.85], [0, 0.02, 0.85], 0.13, 0.13, { rings: [0.25, 0.5, 0.75] })],
      pivot: () => [B([0, 0.3, 0], [1.9, 0.6, 1.0]), B([-0.72, 1.1, 0], [0.22, 1.2, 0.8]), B([0.72, 1.1, 0], [0.22, 1.2, 0.8]),
                    C([-1.05, 1.3, 0], [1.05, 1.3, 0], 0.1, 0.1), C([-0.42, 1.3, 0], [0.42, 1.3, 0], 0.62, 0.62, { rings: [0.5] })],
      slider: () => [C([-1.3, 0.6, 0], [0.5, 0.6, 0], 0.46, 0.46, { rings: [0.5] }), C([0.5, 0.6, 0], [1.9, 0.6, 0], 0.16, 0.16), B([2.05, 0.6, 0], [0.3, 0.55, 0.55]), B([-1.45, 0.6, 0], [0.3, 0.8, 0.8])],
      ball: () => [B([0, 0.28, 0], [1.5, 0.56, 1.5]), C([0, 0.56, 0], [0, 0.8, 0], 0.62, 0.5), G3.ball([0, 1.05, 0], 0.48, { rings: ["xz"] }), C([0, 1.05, 0], [0.9, 2.3, 0.2], 0.16, 0.13)],
    };
    const label = { hinge: ["HINGE", "swings in ONE plane — doors, elbows, knees"], pivot: ["AXLE", "spins about a line — wheels, propellers"],
                    slider: ["PISTON", "slides along a line — hydraulics"], ball: ["BALL JOINT", "turns every way — shoulders, hips"] };
    const keys = Object.keys(J), at = i => [0.27 + (i % 2) * 0.46, 0.34 + Math.floor(i / 2) * 0.31];
    const cj = i => cam(at(i)[0], at(i)[1], 0.085, { yaw: 30, pitch: 20, dist: 14, target: [0, 0.6, 0] });
    reg("mechanicalJoints", [
      ["four joints", ctx => {
        K.title(ctx, "Machines are primitives plus joints — and there are only four joints");
        keys.forEach((k, i) => { draw(ctx, cj(i), J[k]()); K.label(ctx, at(i)[0] - 0.2, at(i)[1] + 0.105, label[k][0], { fs: 0.125, bold: true }); K.label(ctx, at(i)[0] - 0.2, at(i)[1] + 0.13, label[k][1], { fs: 0.09 }); });
        K.note(ctx, 0.87, "Every moving part needs a joint, and every joint needs a HOUSING — the bracket, sleeve or socket that holds it.");
        K.note(ctx, 0.91, "Level 2 draws them as glass so you can see how each housing grips its part. Draw the housing and the machine looks real.");
        K.note(ctx, 0.95, "Name the joints in any machine near you. Then design with them: a robot arm is hinge, hinge, ball, slider.");
      }],
      ["drawn through", ctx => keys.forEach((k, i) => draw(ctx, cj(i), thru(J[k]()).map(f => ({ ...f, hide: false }))))],
    ]);

    /* ---------- the car ---------- */
    const wheel = (x, k) => C([x, 0.38, k * 0.78], [x, 0.38, k * 1.02], 0.38, 0.38, { rings: [0.5] });
    const car = {
      body: () => [B([0, 0.66, 0], [4.4, 0.7, 1.84])],
      cabin: () => [G3.tbox([-0.25, 1.31, 0], { w0: 2.7, w1: 1.7, h: 0.6, d0: 1.74, d1: 1.5 })],
      wheels: () => [wheel(1.42, 1), wheel(-1.42, 1), wheel(1.42, -1), wheel(-1.42, -1)],
      detail: () => {
        const z = 0.925, o = [];
        o.push(G3.path([[-0.2, 0.36, z], [-0.2, 1.0, z]]), G3.path([[0.9, 0.36, z], [0.9, 1.0, z]]), G3.path([[-1.0, 0.36, z], [-1.0, 1.0, z]]));
        o.push(G3.path([[2.2, 0.62, 0.9], [2.21, 0.62, 0.45], [2.21, 0.82, 0.45], [2.2, 0.82, 0.9]], { close: true }), G3.path([[2.2, 0.62, -0.9], [2.21, 0.62, -0.45], [2.21, 0.82, -0.45], [2.2, 0.82, -0.9]], { close: true }));
        for (const x of [1.42, -1.42]) o.push(G3.path(Array.from({ length: 13 }, (_, i) => { const a = Math.PI * i / 12; return [x + Math.cos(a) * 0.52, 0.38 + Math.sin(a) * 0.52, z]; })));
        o.push(G3.path([[-1.45, 1.06, 0.88], [-0.95, 1.56, 0.77], [0.45, 1.56, 0.77], [0.95, 1.06, 0.88]], { close: true, lw: 0.8 }));
        return o;
      },
    };
    const ccar = () => cam(0.5, 0.56, 0.115, { yaw: 38, pitch: 12, dist: 9, target: [0, 0.6, 0] });
    reg("vehicleBoxes", [
      ["the big box and its vanishing points", ctx => {
        K.title(ctx, "A car is two boxes on four cylinders — in perspective FIRST");
        const c = ccar(), v1 = vp(c, [1, 0, 0]), v2 = vp(c, [0, 0, 1]);
        draw(ctx, c, thru(car.body()).map(f => ({ ...f, hide: false })));
        thin(ctx, () => {
          K.line(ctx, 0.02, v1[1], 0.98, v1[1]);
          for (const p of [[2.2, 1.01, 0.92], [2.2, 0.31, 0.92]]) { ray(ctx, c, p, v1); ray(ctx, c, p, v2); }
        });
        K.label(ctx, 0.04, v1[1] - 0.018, "horizon — both vanishing points are on it, far off the page", { fs: 0.1 });
        K.note(ctx, 0.8, "Level 1: ONE box, the car's whole length and width, drawn through. Its edges aim at two vanishing points on the horizon.");
        K.note(ctx, 0.84, "Level 2: a smaller, tapered box on top for the cabin, and four cylinders whose axles run to the SAME vanishing point.");
        K.note(ctx, 0.88, "Level 3: wheel arches, doors, lights — each one drawn on a face of a box, following that face's perspective.");
        K.note(ctx, 0.92, "Get level 1 right and the car draws itself. Get it wrong and no amount of detail will save it.");
      }],
      ["cabin and wheels", ctx => draw(ctx, ccar(), [...ghost(car.body()), ...car.cabin(), ...car.wheels()])],
      ["arches, doors, lights", ctx => draw(ctx, ccar(), [...ghost([...car.body(), ...car.cabin(), ...car.wheels()]), ...car.detail()])],
    ]);

    /* ---------- motorcycle and truck ---------- */
    const bike = {
      big: () => [C([1.05, 0.42, -0.07], [1.05, 0.42, 0.07], 0.42, 0.42), C([-1.0, 0.42, -0.09], [-1.0, 0.42, 0.09], 0.42, 0.42),
                  B([0.0, 0.62, 0], [0.75, 0.5, 0.36]), G3.ell([0.2, 1.08, 0], [0.48, 0.2, 0.2], G3.rz(-6))],
      more: () => [G3.seg([1.05, 0.42, 0.1], [0.66, 1.28, 0.1], { lw: 1.4 }), G3.seg([1.05, 0.42, -0.1], [0.66, 1.28, -0.1], { lw: 1.4 }),
                   G3.seg([0.62, 1.34, -0.42], [0.62, 1.34, 0.42], { lw: 1.5 }), B([-0.55, 1.02, 0], [0.8, 0.12, 0.34]),
                   G3.path([[0.66, 1.2, 0], [0.3, 0.42, 0], [-0.35, 0.4, 0], [-1.0, 0.42, 0], [-0.4, 0.95, 0], [0.66, 1.2, 0]], { lw: 1.1 }),
                   C([-0.3, 0.36, 0.2], [-1.35, 0.5, 0.22], 0.07, 0.09)],
    };
    const truck = {
      big: () => [B([2.0, 1.5, 0], [1.7, 2.0, 2.3]), B([-1.25, 1.95, 0], [4.6, 2.7, 2.4]), B([0, 0.55, 0], [6.6, 0.3, 1.9])],
      more: () => [...[2.0, -1.0, -2.6].flatMap(x => [1, -1].map(k => C([x, 0.5, k * 0.85], [x, 0.5, k * 1.18], 0.5, 0.5, { rings: [0.5] }))),
                   G3.path([[2.86, 1.6, 1.0], [2.86, 1.6, -1.0], [2.86, 2.35, -1.0], [2.86, 2.35, 1.0]], { close: true }),
                   G3.path([[1.3, 1.5, 1.155], [2.7, 1.5, 1.155], [2.7, 2.3, 1.155], [1.6, 2.3, 1.155]], { close: true })],
    };
    const cb = () => cam(0.3, 0.42, 0.14, { yaw: 30, pitch: 12, dist: 10, target: [0, 0.7, 0] }), ck = () => cam(0.56, 0.78, 0.082, { yaw: 34, pitch: 12, dist: 14, target: [0, 1.2, 0] });
    reg("bikeTruck", [
      ["the big volumes", ctx => {
        K.title(ctx, "Any vehicle: the big volumes and the wheelbase, before anything else");
        draw(ctx, cb(), bike.big()); draw(ctx, ck(), truck.big());
        cap(ctx, 0.62, 0.3, "MOTORCYCLE", { bold: true }); cap(ctx, 0.62, 0.33, "two wheels, an engine block, a tank"); cap(ctx, 0.62, 0.36, "— everything else is a line between them");
        cap(ctx, 0.06, 0.56, "TRUCK — a cab box, a cargo box, a chassis", { bold: true });
        K.note(ctx, 0.92, "Level 2 adds what joins the volumes: forks, frame, handlebars and seat; the truck's six wheels and its glass.");
        K.note(ctx, 0.96, "A motorcycle's wheels share ONE plane. A truck's axles all point at the same vanishing point as its boxes.");
      }],
      ["frame, wheels, glass", ctx => { draw(ctx, cb(), [...ghost(bike.big()), ...bike.more()]); draw(ctx, ck(), [...ghost(truck.big()), ...truck.more()]); }],
    ]);

    /* ---------- weapons ---------- */
    const W = {
      sword: () => [G3.tbox([1.5, 0, 0], { w0: 0.22, w1: 0.05, h: 2.6, d0: 0.05, d1: 0.02 }, RX), B([0.16, 0, 0], [0.12, 0.74, 0.1]),
                    C([-0.5, 0, 0], [0.1, 0, 0], 0.065, 0.065, { rings: [0.25, 0.5, 0.75] }), G3.ball([-0.6, 0, 0], 0.11)],
      axe: () => [C([-1.3, 0, 0], [1.05, 0, 0], 0.055, 0.05), G3.prism([0, 0, 0], [[0.7, 0.07], [0.6, -0.72], [1.1, -0.6], [1.0, 0.07]].reverse(), 0.07)],
      spear: () => [C([-2.5, 0, 0], [1.5, 0, 0], 0.04, 0.04), G3.tbox([1.86, 0, 0], { w0: 0.24, w1: 0.02, h: 0.72, d0: 0.05, d1: 0.01 }, RX)],
      bow: () => [G3.path(Rigs.smooth([[-0.2, 1.25, 0], [0.34, 0.7, 0], [0.5, 0, 0], [0.34, -0.7, 0], [-0.2, -1.25, 0]], 8), { lw: 1.8 }),
                  G3.path([[-0.2, 1.25, 0], [-0.2, -1.25, 0]], { lw: 0.6 }), C([-0.2, 0, 0], [1.6, 0, 0], 0.02, 0.02), G3.tbox([1.7, 0, 0], { w0: 0.12, w1: 0.01, h: 0.24, d0: 0.03, d1: 0.01 }, RX)],
      pistol: () => [B([0.2, 0.2, 0], [1.3, 0.3, 0.16]), C([0.85, 0.24, 0], [1.75, 0.24, 0], 0.07, 0.07), G3.tbox([-0.3, -0.2, 0], { w0: 0.34, w1: 0.4, h: 0.62, d0: 0.15, d1: 0.15 }, G3.rz(18)),
                     G3.path(Array.from({ length: 10 }, (_, i) => { const a = Math.PI + Math.PI * i / 9; return [0.2 + Math.cos(a) * 0.2, 0.05 + Math.sin(a) * 0.17, 0.081]; }), { lw: 0.8 })],
    };
    const info = { sword: "blade · guard · grip · pommel", axe: "a wedge on a lever", spear: "reach: a point on a pole", bow: "a spring — the arrow is the weapon", pistol: "a tube, a housing, a handle" };
    const keysW = Object.keys(W);
    const cw = i => cam(i === 3 ? 0.2 : 0.44, 0.22 + i * 0.145 + (i === 3 ? 0.03 : 0), i === 3 ? 0.085 : 0.115, { yaw: 14, pitch: 14, dist: 18 });
    reg("weaponProportions", [
      ["axis and grip", ctx => {
        K.title(ctx, "Weapons are tools: draw the GRIP first, then what the grip controls");
        keysW.forEach((k, i) => {
          const c = cw(i), y = yOf(c);
          thin(ctx, () => K.line(ctx, 0.06, y, 0.72, y));
          const g = k === "bow" ? [[0.44, 0.02, 0], [0.56, 0.02, 0]] : k === "pistol" ? [[-0.52, -0.5, 0], [-0.1, 0.1, 0]] : k === "sword" ? [[-0.5, 0, 0], [0.1, 0, 0]] : [[-1.0, 0, 0], [-0.4, 0, 0]];
          const a = frac(c, g[0]), b = frac(c, g[1]);
          K.style(ctx, { lw: LW() * 2.6 }); K.line(ctx, a[0], a[1], b[0], b[1]); K.style(ctx);
          K.label(ctx, 0.75, y - 0.014, k.toUpperCase(), { fs: 0.125, bold: true }); K.label(ctx, 0.75, y + 0.012, info[k], { fs: 0.09 });
        });
        K.note(ctx, 0.93, "The thick mark is the GRIP — one hand is about four finger-widths. Everything else is sized from where the hand goes.");
        K.note(ctx, 0.97, "Level 2 builds each weapon on its axis. Study real ones (the museum links) before inventing: invented weapons still obey hands.");
      }],
      ["forms", ctx => keysW.forEach((k, i) => draw(ctx, cw(i), W[k]()))],
    ]);

    /* ---------- tools and props ---------- */
    const T = {
      hammer: () => [C([0, 0, 0], [0, 2.2, 0], 0.09, 0.07, { rings: [0.2] }), B([0.1, 2.3, 0], [1.1, 0.4, 0.4])],
      lantern: () => [C([0, 0, 0], [0, 0.18, 0], 0.55, 0.55), C([0, 0.18, 0], [0, 1.3, 0], 0.42, 0.42, { rings: [0.5] }), C([0, 1.3, 0], [0, 1.75, 0], 0.55, 0.12),
                      G3.path(Array.from({ length: 13 }, (_, i) => { const a = Math.PI * i / 12; return [Math.cos(a) * 0.46, 1.75 + Math.sin(a) * 0.5, 0]; }))],
      bucket: () => [C([0, 0, 0], [0, 1.2, 0], 0.5, 0.72, { rings: [0.4, 0.8] }), G3.path(Array.from({ length: 13 }, (_, i) => { const a = Math.PI * i / 12; return [Math.cos(a) * 0.72, 1.2 + Math.sin(a) * 0.7, 0]; }))],
      shield: () => [C([0, 1.1, -0.06], [0, 1.1, 0.06], 1.1, 1.1), G3.ball([0, 1.1, 0.1], 0.22), G3.path(Array.from({ length: 30 }, (_, i) => { const a = i / 30 * 6.2832; return [Math.cos(a) * 0.9, 1.1 + Math.sin(a) * 0.9, 0.061]; }), { close: true, lw: 0.7 })],
      satchel: () => [B([0, 0.6, 0], [1.6, 1.2, 0.5]), G3.prism([0, 1.2, 0.26], [[-0.8, 0], [0.8, 0], [0.8, -0.7], [0, -0.92], [-0.8, -0.7]].reverse(), 0.04),
                      G3.path(Rigs.smooth([[-0.8, 1.2, 0], [-0.9, 2.3, 0], [0, 2.8, 0], [0.9, 2.3, 0], [0.8, 1.2, 0]], 6))],
    };
    const keysT = Object.keys(T), recipeT = { hammer: "cylinder + box", lantern: "three cylinders + a ring", bucket: "a tapered cylinder", shield: "a thin disc + a ball", satchel: "a box + a flap" };
    const ctl = i => cam(0.12 + i * 0.19, 0.6, 0.076, { yaw: 28, pitch: 16, dist: 16, target: [0, 1.2, 0] });
    reg("toolsProps", [
      ["volumes", ctx => {
        K.title(ctx, "Tools and props: the same primitives, sized to a hand");
        keysT.forEach((k, i) => { draw(ctx, ctl(i), T[k]().filter(f => f.type !== "path")); cap(ctx, 0.04 + i * 0.19, 0.7, k.toUpperCase(), { bold: true }); cap(ctx, 0.04 + i * 0.19, 0.725, recipeT[k], { fs: 0.082 }); });
        K.note(ctx, 0.82, "Level 1: only the volumes. Level 2: handles, straps, rims — the parts a hand touches, which is where wear shows.");
        K.note(ctx, 0.86, "A prop with history tells a story: a dented bucket, a re-wrapped hammer handle. Draw the object, then one sign of its life.");
        K.note(ctx, 0.9, "The page beside this one is for YOUR invented tool. It must have a grip, a working end, and a reason for its shape.");
      }],
      ["handles, straps, rims", ctx => keysT.forEach((k, i) => draw(ctx, ctl(i), T[k]().map(f => f.type === "path" ? f : { ...f, noStroke: true, rings: null })))],
    ]);
  }

  /* ============================================================
     Architecture, light, land
     ============================================================ */
  {
    const front = (cx, z, pts) => pts.map(([x, y]) => [cx + x, y, z]);
    const cabin = x => ({
      box: [B([x, 1.3, 0], [3.4, 2.6, 2.8])],
      style: [G3.prism([x, 2.6, 0], [[-1.95, 0], [1.95, 0], [0, 1.5]], 3.2),
              ...[0.5, 1.0, 1.5, 2.0].map(y => G3.path(front(x, 1.401, [[-1.7, y], [1.7, y]]), { lw: 0.6 })),
              G3.path(front(x, 1.402, [[-0.35, 0], [-0.35, 1.5], [0.35, 1.5], [0.35, 0]]), { lw: 1.1 }), C([x + 1.0, 3.2, -0.6], [x + 1.0, 4.4, -0.6], 0.24, 0.24)],
    });
    const temple = x => ({
      box: [B([x, 1.9, 0], [3.4, 2.6, 2.8])],
      style: [B([x, 0.15, 0], [4.6, 0.3, 4.0]), B([x, 0.45, 0], [4.0, 0.3, 3.4]), G3.prism([x, 3.5, 0], [[-2.0, 0], [2.0, 0], [0, 0.9]], 3.2), B([x, 3.35, 0], [4.0, 0.3, 3.2]),
              ...[-1.5, -0.5, 0.5, 1.5].map(dx => C([x + dx, 0.6, 1.5], [x + dx, 3.2, 1.5], 0.2, 0.17))],
    });
    const office = x => ({
      box: [B([x, 3.2, 0], [3.4, 6.4, 2.8])],
      style: [B([x, 6.5, 0], [3.6, 0.2, 3.0]),
              ...[1, 2, 3, 4, 5].flatMap(r => [G3.path(front(x, 1.401, [[-1.5, r * 1.05 + 0.2], [1.5, r * 1.05 + 0.2]]), { lw: 0.6 }),
                                             G3.path([[x + 1.701, r * 1.05 + 0.2, 1.2], [x + 1.701, r * 1.05 + 0.2, -1.2]], { lw: 0.6 })]),
              ...[-0.75, 0, 0.75].map(dx => G3.path(front(x, 1.401, [[dx, 1.25], [dx, 6.2]]), { lw: 0.6 })),
              G3.path(front(x, 1.402, [[-0.5, 0], [-0.5, 1.1], [0.5, 1.1], [0.5, 0]]), { lw: 1.1 })],
    });
    const all = () => [cabin(-5.2), temple(0), office(5.2)];
    const ca = () => cam(0.5, 0.66, 0.056, { yaw: 30, pitch: 10, dist: 26, target: [0, 1.6, 0] });
    reg("archStyles", [
      ["three plain boxes", ctx => {
        K.title(ctx, "Architecture: the same box as a cabin, a temple and an office");
        const c = ca(), v = vp(c, [1, 0, 0]);
        draw(ctx, c, all().flatMap(a => a.box));
        thin(ctx, () => K.line(ctx, 0.02, v[1], 0.98, v[1]));
        K.label(ctx, 0.04, v[1] - 0.018, "horizon", { fs: 0.1 });
        ["CABIN", "TEMPLE", "OFFICE"].forEach((t, i) => cap(ctx, 0.12 + i * 0.3, 0.76, t, { bold: true }));
        K.note(ctx, 0.83, "Level 1: three boxes sharing one horizon and one pair of vanishing points. That is ALL a building is at first.");
        K.note(ctx, 0.87, "Level 2: style is proportion + material + ornament. Logs and a pitched roof; a stepped base, columns and a pediment;");
        K.note(ctx, 0.91, "a grid of identical windows. Every added line follows the perspective of the face it sits on.");
        K.note(ctx, 0.95, "Repeat this with a real building tradition from your references: find its box, then list its three style rules.");
      }],
      ["style", ctx => draw(ctx, ca(), [...ghost(all().flatMap(a => a.box)), ...all().flatMap(a => a.style)])],
    ]);

    /* ---------- lighting a scene ---------- */
    const Ld = norm([-0.75, 0.6, 0.28]);
    const room = () => [G3.path([[-5, 0, -4], [5, 0, -4], [5, 0, 4], [-5, 0, 4]], { close: true, lw: 0.8 }), G3.path([[-5, 0, -4], [-5, 5.5, -4], [5, 5.5, -4], [5, 0, -4]], { lw: 0.8 }),
                        G3.path([[-5, 5.5, -4], [-5, 5.5, 4], [-5, 0, 4]], { lw: 0.8 }), G3.path([[-5, 1.6, -2.4], [-5, 4.4, -2.4], [-5, 4.4, 0.6], [-5, 1.6, 0.6]], { close: true, lw: 1.3 })];
    const things = () => [...Rigs.figure({ root: [0.4, 0, 0.2], pelvis: [20, 0, 0], chest: [20, 0, 0] }).solids.map(s => ({ ...s, rings: null, decals: null })),
                          B([3.0, 1.2, -1.6], [2.4, 0.2, 1.4]), ...[[2, -2.1], [4, -2.1], [2, -1.1], [4, -1.1]].map(([x, z]) => B([x, 0.55, z], [0.16, 1.1, 0.16]))];
    const sample = it => it.type === "mesh" ? it.verts
      : it.type === "cyl" ? [0, 1, 2, 3, 4, 5, 6, 7].flatMap(i => { const a = i * 0.785; return [[it.a, it.ra], [it.b, it.rb]].map(([p, r]) => add(p, [Math.cos(a) * r, 0, Math.sin(a) * r])); })
      : Array.from({ length: 26 }, (_, i) => { const a = i * 2.399, b = Math.acos(1 - 2 * (i + 0.5) / 26); return add(it.c, G3.ap(it.R, [it.r[0] * Math.sin(b) * Math.cos(a), it.r[1] * Math.cos(b), it.r[2] * Math.sin(b) * Math.sin(a)])); });
    const shadows = items => items.map(it => G3.path(G3.hull(sample(it).map(p => [p[0] - Ld[0] * (p[1] / Ld[1]), p[2] - Ld[2] * (p[1] / Ld[1])])).map(([x, z]) => [x, 0.002, z]),
      { close: true, fill: 0.3, noStroke: true, under: true }));
    const cr = () => cam(0.5, 0.56, 0.072, { yaw: -16, pitch: 14, dist: 20, target: [0, 2.2, 0] });
    reg("sceneLight", [
      ["the room and what is in it", ctx => {
        K.title(ctx, "Lighting a scene: one KEY light, and every shadow obeys it");
        const c = cr();
        draw(ctx, c, [...room(), ...things()]);
        const a = frac(c, [-5, 3.4, -0.9]), b = frac(c, [-2.2, 1.6, -0.2]);
        K.arrow(ctx, a[0], a[1], b[0], b[1]); K.label(ctx, a[0] - 0.02, a[1] - 0.05, "KEY — the window", { fs: 0.115, bold: true });
        K.note(ctx, 0.82, "Level 1: the room, a figure, a table. Decide the key light before anything is shaded — here it is the window.");
        K.note(ctx, 0.86, "Level 2: every plane takes a value by how squarely it faces the window, and every form throws a shadow AWAY from it.");
        K.note(ctx, 0.9, "The cast shadows are what pin the figure and the table to the floor. All of them point the same way.");
        K.note(ctx, 0.94, "Shadows are never black: the room bounces light back into them (the FILL). Keep every fill darker than every lit plane.");
      }],
      ["values and cast shadows", ctx => draw(ctx, cr(), [...shadows(things()), ...things().map(t => ({ ...t, tone: 1.05, noStroke: true }))], { light: Ld })],
    ], { tints: ["#3b6ea8", "#2c3e60"] });

    /* ---------- landforms as ridgelines ---------- */
    const LAND = {
      "MOUNTAINS — plates pushed up, then cut by ice and water": (u, v) => Math.max(0, 1 - Math.abs(u - 0.36 - 0.05 * Math.sin(v * 7)) * 3.1) * (0.62 + 0.38 * Math.sin(v * 9 + 1)) +
        0.6 * Math.max(0, 1 - Math.abs(u - 0.72) * 4.2) * (0.6 + 0.4 * Math.cos(v * 8)) + 0.05 * Math.sin(u * 40 + v * 13),
      "MESA — hard rock capping soft; the sides fall away": (u, v) => { const d = Math.max(Math.abs(u - 0.5) / 0.24, Math.abs(v - 0.5) / 0.3); return d < 1 ? 0.8 : Math.max(0, 0.8 - (d - 1) * 4.5) + 0.03 * Math.sin(u * 30); },
      "RIVER VALLEY — water cuts a V and wanders": (u, v) => Math.min(0.9, Math.abs(u - 0.5 - 0.11 * Math.sin(v * 9)) * 2.4) + 0.03 * Math.sin(u * 26 + v * 9),
      "DUNES — wind piles sand: gentle upwind, steep downwind": (u, v) => { const p = ((u * 3.2 + v * 0.9 + 0.12 * Math.sin(v * 7)) % 1 + 1) % 1; return 0.5 * (p < 0.75 ? p / 0.75 : (1 - p) / 0.25) + 0.12; },
    };
    function ridges(ctx, x0, y0, w, h, fn, rows, every) {
      const P = K.page(), tmp = document.createElement("canvas");
      tmp.width = P.w; tmp.height = P.h;
      const t = tmp.getContext("2d");
      t.strokeStyle = t.fillStyle = "#1b2a3a"; t.lineWidth = LW() * 0.8; t.lineJoin = "round";
      for (let r = 0; r < rows; r++) {
        if (every && r % every !== 0 && r !== rows - 1) continue;
        const v = r / (rows - 1), base = y0 + v * h, sc = 0.55 + v * 0.45, pts = [];
        for (let i = 0; i <= 90; i++) {
          const u = i / 90, x = x0 + w * (0.5 + (u - 0.5) * sc);
          pts.push([K.X(x), K.Y(base) - K.X(fn(u, 1 - v) * 0.11 * sc)]);
        }
        t.globalCompositeOperation = "destination-out";
        t.beginPath(); t.moveTo(pts[0][0], K.Y(y0 + h + 0.03)); for (const q of pts) t.lineTo(q[0], q[1]); t.lineTo(pts[90][0], K.Y(y0 + h + 0.03)); t.closePath(); t.fill();
        t.globalCompositeOperation = "source-over";
        t.beginPath(); pts.forEach((q, i) => i ? t.lineTo(q[0], q[1]) : t.moveTo(q[0], q[1])); t.stroke();
      }
      ctx.drawImage(tmp, 0, 0);
    }
    const cells = Object.entries(LAND).map(([name, fn], i) => [name, fn, 0.06 + (i % 2) * 0.47, 0.2 + Math.floor(i / 2) * 0.36]);
    reg("landforms", [
      ["the big shapes", ctx => {
        K.title(ctx, "Reading the land: every shape was MADE by something");
        for (const [name, fn, x, y] of cells) { ridges(ctx, x, y, 0.42, 0.2, fn, 20, 5); K.label(ctx, x, y - 0.075, name, { fs: 0.092, bold: true }); }
        K.note(ctx, 0.92, "Level 1: five lines each — the skyline and the big breaks behind it. Level 2: the whole surface, near lines over far.");
        K.note(ctx, 0.96, "Ask what force made each shape. If you can answer, you can draw that land from any angle and invent more of it.");
      }],
      ["the whole surface", ctx => { for (const [, fn, x, y] of cells) ridges(ctx, x, y, 0.42, 0.2, fn, 20, 0); }],
    ]);

    /* ---------- water and plants ---------- */
    const conifer = (x, z, s) => [C([x, 0, z], [x, 1.2 * s, z], 0.18 * s, 0.14 * s), C([x, 0.9 * s, z], [x, 2.7 * s, z], 1.05 * s, 0.3 * s), C([x, 2.2 * s, z], [x, 3.9 * s, z], 0.75 * s, 0)];
    const broad = (x, z, s) => [C([x, 0, z], [x, 1.7 * s, z], 0.22 * s, 0.16 * s), G3.ell([x, 2.7 * s, z], [1.45 * s, 1.2 * s, 1.3 * s], I, { rings: ["xz"] }),
                                G3.ell([x + 0.9 * s, 2.2 * s, z + 0.3 * s], [0.8 * s, 0.7 * s, 0.8 * s], I), G3.ell([x - 0.8 * s, 2.3 * s, z - 0.2 * s], [0.75 * s, 0.65 * s, 0.7 * s], I)];
    const bank = k => Rigs.smooth(Array.from({ length: 9 }, (_, i) => { const z = 6 - i * 4.2; return [Math.sin(z * 0.28) * 3.2 + k * (0.9 + (6 - z) * 0.03), 0, z]; }), 6);
    const trees = () => [...broad(-4.6, 3, 1), ...conifer(4.2, 1.5, 1), ...conifer(5.6, -1, 1), ...broad(-6.5, -8, 1), ...conifer(-3.6, -12, 1), ...conifer(6.5, -16, 1), ...broad(3, -22, 1), ...conifer(-7, -24, 1)];
    const cwp = () => cam(0.5, 0.42, 0.05, { yaw: 0, pitch: 12, dist: 16, target: [0, 1.8, 4] });
    reg("waterPlants", [
      ["flow lines", ctx => {
        K.title(ctx, "Water and plants: flow first, then masses that shrink with distance");
        draw(ctx, cwp(), [G3.path(bank(1)), G3.path(bank(-1)), ...trees().filter(t => t.type === "cyl" && t.ra < 0.3 && t.rb > 0)]);
        K.note(ctx, 0.78, "Level 1: the river's two banks, wandering and NARROWING as they recede, and a trunk line where each tree stands.");
        K.note(ctx, 0.82, "Water always runs downhill and takes the outside of a bend faster — so bends grow. A straight river is a canal.");
        K.note(ctx, 0.86, "Level 2: trees as volumes. A conifer is stacked cones; a broadleaf is a trunk carrying a few big balls of foliage.");
        K.note(ctx, 0.9, "The same tree is drawn three times, smaller and simpler each time. Detail is a depth cue as strong as size.");
      }],
      ["tree volumes", ctx => draw(ctx, cwp(), trees())],
    ]);

    /* ---------- establishing shot and intimate shot ---------- */
    reg("establishIntimate", [
      ["two frames", ctx => {
        K.title(ctx, "One world, two shots: the establishing shot and the intimate shot");
        K.rect(ctx, 0.07, 0.13, 0.86, 0.36); K.rect(ctx, 0.07, 0.56, 0.86, 0.36);
        thin(ctx, () => { K.line(ctx, 0.07, 0.36, 0.93, 0.36); K.line(ctx, 0.07, 0.6, 0.93, 0.6); });
        K.label(ctx, 0.09, 0.345, "LOW horizon — the land towers; the viewer is small", { fs: 0.092 });
        K.label(ctx, 0.09, 0.615, "HIGH horizon — we look down into a small space", { fs: 0.092 });
        K.label(ctx, 0.09, 0.15, "ESTABLISHING — wide", { fs: 0.115, bold: true }); K.label(ctx, 0.09, 0.58, "INTIMATE — close", { fs: 0.115, bold: true });
        [[0.2, 0.44, "foreground: dark, framing"], [0.48, 0.39, "midground: the settlement — the focal point"], [0.72, 0.27, "background: pale, simple"]]
          .forEach(([x, y, t]) => { K.style(ctx, { dash: true }); K.ellipse(ctx, x, y, 0.1, 0.03); K.style(ctx); K.label(ctx, x - 0.09, y + 0.035, t, { fs: 0.085 }); });
        fig(ctx, cam(0.4, 0.9, 0.034, { yaw: -30, pitch: 14 }), Rigs.figure("reach"), "mannequin");
        K.label(ctx, 0.52, 0.72, "a figure, a prop with history, the same", { fs: 0.092 }); K.label(ctx, 0.52, 0.745, "materials and light as the wide shot", { fs: 0.092 });
        K.note(ctx, 0.955, "Both frames are EMPTY of your world on purpose. Same materials, same light, same palette in both — that is what makes them one place.");
      }],
    ]);
  }

  /* ============================================================
     Comics: reading order
     ============================================================ */
  reg("balloonOrder", [
    ["panels and speakers", ctx => {
      K.title(ctx, "Balloons: placed BEFORE the art, read left-to-right, top-to-bottom");
      K.rect(ctx, 0.07, 0.14, 0.5, 0.3); K.rect(ctx, 0.6, 0.14, 0.33, 0.3); K.rect(ctx, 0.07, 0.5, 0.86, 0.3);
      const head = (x, y) => { K.circle(ctx, x, y, 0.035); K.line(ctx, x, y + K.V(0.035), x, y + K.V(0.11)); K.line(ctx, x - 0.05, y + K.V(0.07), x + 0.05, y + K.V(0.07)); };
      head(0.2, 0.33); head(0.44, 0.33); head(0.76, 0.34); head(0.25, 0.68); head(0.72, 0.68);
      K.note(ctx, 0.86, "Level 1: three panels and who is in them. Level 2: the balloons, numbered in the order the eye meets them.");
      K.note(ctx, 0.9, "The first speaker's balloon sits HIGHER and further LEFT. Tails point at the mouth, never across another balloon.");
      K.note(ctx, 0.94, "Under 25 words a balloon. Leave the faces clear — balloons go in the dead space above shoulders.");
    }],
    ["balloons, in reading order", ctx => {
      const bal = (x, y, rx, ry, n, tx, ty) => {
        K.ellipse(ctx, x, y, rx, ry); K.line(ctx, x - 0.012, y + K.V(ry) * 0.9, tx, ty); K.line(ctx, x + 0.018, y + K.V(ry) * 0.9, tx, ty);
        K.label(ctx, x - 0.012, y, String(n), { fs: 0.17, bold: true });
      };
      bal(0.19, 0.2, 0.085, 0.03, 1, 0.2, 0.29); bal(0.42, 0.235, 0.09, 0.03, 2, 0.43, 0.29); bal(0.76, 0.2, 0.1, 0.032, 3, 0.76, 0.3);
      bal(0.26, 0.56, 0.11, 0.032, 4, 0.25, 0.64); bal(0.66, 0.59, 0.1, 0.03, 5, 0.71, 0.64);
      K.style(ctx, { dash: true, lw: LW() * 0.7 });
      K.poly(ctx, [[0.19, 0.2], [0.42, 0.235], [0.76, 0.2], [0.26, 0.56], [0.66, 0.59]], false);
      K.style(ctx);
    }],
  ]);

  /* ============================================================
     Colour pages (drawn in real colour: untinted guide layer)
     ============================================================ */
  const fillR = (ctx, x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(K.X(x), K.Y(y), K.X(w), K.Y(h)); };
  const frame = (ctx, x, y, w, h) => { ctx.strokeStyle = "#1b2a3a"; ctx.lineWidth = LW() * 0.7; ctx.strokeRect(K.X(x), K.Y(y), K.X(w), K.Y(h)); };
  /* a tiny scene as four flat areas: sky/wall, ground, figure, accent */
  const board = (ctx, x, y, w, h, [sky, ground, figure, accent]) => {
    fillR(ctx, x, y, w, h * 0.62, sky); fillR(ctx, x, y + h * 0.62, w, h * 0.38, ground);
    fillR(ctx, x + w * 0.42, y + h * 0.34, w * 0.12, h * 0.5, figure); fillR(ctx, x + w * 0.7, y + h * 0.5, w * 0.07, h * 0.1, accent);
    frame(ctx, x, y, w, h);
  };
  reg("moodBoards", [["six moods", ctx => {
    K.title(ctx, "Mood boards: one scene, six palettes");
    const moods = [["SAFE", "warm, mid-saturation, light", ["#f2d7a6", "#c98f5a", "#7a4b3a", "#e8783a"]], ["DREAD", "cool, drained, one wrong note", ["#3d4a45", "#232b28", "#11181a", "#b8c93a"]],
                   ["ROMANCE", "soft pinks, low contrast", ["#f3c6c9", "#d99aa8", "#a8607a", "#f7e3c8"]], ["ACTION", "complements, high contrast", ["#1f4e8c", "#0f2540", "#f28a2e", "#ffd23f"]],
                   ["MYSTERY", "desaturated cool + one warm light", ["#2c3a4a", "#18202a", "#0c1016", "#e8b04b"]], ["GRIEF", "near-monochrome warm greys", ["#a9a39a", "#7d776f", "#55504a", "#8c8377"]]];
    moods.forEach(([name, how, pal], i) => {
      const x = 0.07 + (i % 2) * 0.45, y = 0.14 + Math.floor(i / 2) * 0.25;
      board(ctx, x, y, 0.4, 0.17, pal); K.label(ctx, x, y + 0.19, name, { fs: 0.115, bold: true }); K.label(ctx, x + 0.14, y + 0.19, how, { fs: 0.09 });
    });
    K.note(ctx, 0.93, "Each board is the same four areas — sky, ground, figure, accent. Only the palette changed. Paint your own six beside them.");
    K.note(ctx, 0.97, "Notice ACTION and a sunset use the same orange and blue: the contrast and the context decide the mood, not the hue.");
  }]], { color: true });

  reg("colorStory", [["three devices", ctx => {
    K.title(ctx, "Colour as a story device");
    const cool = ["#5b7fa6", "#3c5a7d", "#23384f", "#8fb0cc"], warm = ["#f2b46a", "#c9743a", "#5a2e1c", "#ffe08a"];
    K.label(ctx, 0.07, 0.15, "THE PALETTE SHIFT — three panels in one harmony, then a turn", { fs: 0.105, bold: true });
    [cool, cool, cool, warm].forEach((p, i) => board(ctx, 0.07 + i * 0.22, 0.17, 0.2, 0.15, p));
    K.label(ctx, 0.07, 0.4, "THE MOTIF — one character colour that follows them everywhere", { fs: 0.105, bold: true });
    [["#cfd6dc", "#8c979f"], ["#e9d9b0", "#b89a5c"], ["#2c3e60", "#162033"]].forEach(([a, b], i) => board(ctx, 0.07 + i * 0.3, 0.42, 0.27, 0.15, [a, b, "#c0392b", b]));
    K.label(ctx, 0.07, 0.65, "THE ISOLATED SATURATION — everything grey but one thing", { fs: 0.105, bold: true });
    fillR(ctx, 0.07, 0.67, 0.86, 0.17, "#8d9399"); fillR(ctx, 0.07, 0.78, 0.86, 0.06, "#6c7278");
    for (let i = 0; i < 9; i++) fillR(ctx, 0.11 + i * 0.09, 0.71, 0.035, 0.1, i === 5 ? "#d7263d" : "#565c62");
    frame(ctx, 0.07, 0.67, 0.86, 0.17);
    K.note(ctx, 0.9, "A shift in palette IS a story beat — the reader feels it before reading a word. Save it for the turn.");
    K.note(ctx, 0.94, "Thumbnail your own four-panel strip under each example: three panels that agree, and one that breaks.");
  }]], { color: true });

  reg("harmonyStory", [["three moods of one room", ctx => {
    K.title(ctx, "Harmony as story: the same kitchen, three times");
    const rooms = [["MORNING — analogous warm", ["#f6dfae", "#e3b877", "#b9793f", "#f08a3c"]], ["THE ARGUMENT — complementary", ["#2f6690", "#1b3a57", "#16283a", "#f26419"]],
                   ["AFTERMATH — monochrome cool", ["#9fb3c2", "#6f8696", "#44586a", "#c5d2db"]]];
    rooms.forEach(([name, pal], i) => { board(ctx, 0.07, 0.14 + i * 0.25, 0.5, 0.2, pal); K.label(ctx, 0.6, 0.2 + i * 0.25, name, { fs: 0.105, bold: true });
      pal.forEach((c, k) => { fillR(ctx, 0.6 + k * 0.075, 0.23 + i * 0.25, 0.065, 0.04, c); frame(ctx, 0.6 + k * 0.075, 0.23 + i * 0.25, 0.065, 0.04); }); });
    K.note(ctx, 0.92, "Cover the drawings and look only at the colour. You can still tell which is the argument — that is the palette doing the acting.");
    K.note(ctx, 0.96, "Paint your own three thumbnails beside these. One harmony each; the SHIFT between them is the story.");
  }]], { color: true });

  reg("paletteDiagnosis", [["scatter versus hierarchy", ctx => {
    K.title(ctx, "Diagnosing a palette: is there a harmony, a leader, an accent?");
    const wheel = (cx, cy, dots, name) => {
      for (let i = 0; i < 24; i++) { ctx.fillStyle = `hsl(${i * 15},65%,58%)`; ctx.beginPath(); ctx.moveTo(K.X(cx), K.Y(cy));
        ctx.arc(K.X(cx), K.Y(cy), K.X(0.15), (i * 15 - 97.5) * Math.PI / 180, (i * 15 - 82.5) * Math.PI / 180); ctx.closePath(); ctx.fill(); }
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(K.X(cx), K.Y(cy), K.X(0.085), 0, 7); ctx.fill();
      for (const [h, r] of dots) { const a = (h - 90) * Math.PI / 180; ctx.fillStyle = "#1b2a3a"; ctx.beginPath(); ctx.arc(K.X(cx) + Math.cos(a) * K.X(0.12), K.Y(cy) + Math.sin(a) * K.X(0.12), K.S(r), 0, 7); ctx.fill(); }
      K.style(ctx); K.label(ctx, cx - 0.17, cy + 0.15, name, { fs: 0.1, bold: true });
    };
    wheel(0.27, 0.32, [[10, 0.05], [95, 0.05], [160, 0.05], [230, 0.05], [300, 0.05]], "BEFORE — five hues, all shouting");
    wheel(0.73, 0.32, [[215, 0.09], [200, 0.055], [232, 0.055], [30, 0.03]], "AFTER — one family leads, one accent");
    const bars = (y, list) => { let x = 0.07; for (const [c, w] of list) { fillR(ctx, x, y, w * 0.86, 0.05, c); x += w * 0.86; } frame(ctx, 0.07, y, 0.86, 0.05); };
    K.label(ctx, 0.07, 0.56, "how much of the picture each colour gets:", { fs: 0.1, bold: true });
    bars(0.58, [["#d9483b", 0.2], ["#e8c13a", 0.2], ["#4caf6a", 0.2], ["#3b6fd9", 0.2], ["#a04bd0", 0.2]]);
    bars(0.67, [["#2f5f93", 0.62], ["#7fa3c7", 0.2], ["#274766", 0.12], ["#f28a2e", 0.06]]);
    K.label(ctx, 0.07, 0.65, "before: equal shares — nothing leads", { fs: 0.09 }); K.label(ctx, 0.07, 0.74, "after: 60–70% leader, a supporter, an accent under 10%", { fs: 0.09 });
    K.note(ctx, 0.84, "Sample your own image's main colours (Alt+click), mark where each lands on a wheel, and estimate its share.");
    K.note(ctx, 0.88, "The fix is almost never a new hue. It is HIERARCHY: desaturate the supporters and shrink the accent.");
  }]], { color: true });

  reg("timeOfDay", [["noon, dusk, night", ctx => {
    K.title(ctx, "The same room at noon, at dusk, and at night");
    const room = (x, y, wall, floor, patch, shadow, name, how) => {
      fillR(ctx, x, y, 0.4, 0.14, wall); fillR(ctx, x, y + 0.14, 0.4, 0.07, floor);
      ctx.fillStyle = patch.c; ctx.beginPath(); patch.p.forEach(([px, py], i) => ctx[i ? "lineTo" : "moveTo"](K.X(x + px), K.Y(y + py))); ctx.closePath(); ctx.fill();
      fillR(ctx, x + 0.04, y + 0.03, 0.07, 0.07, patch.win);
      fillR(ctx, x + 0.24, y + 0.07, 0.03, 0.1, shadow);
      ctx.fillStyle = shadow; ctx.beginPath(); patch.s.forEach(([px, py], i) => ctx[i ? "lineTo" : "moveTo"](K.X(x + px), K.Y(y + py))); ctx.closePath(); ctx.fill();
      frame(ctx, x, y, 0.4, 0.21); K.label(ctx, x + 0.43, y + 0.05, name, { fs: 0.115, bold: true });
      how.forEach((t, i) => K.label(ctx, x + 0.43, y + 0.085 + i * 0.028, t, { fs: 0.09 }));
    };
    room(0.07, 0.14, "#e9e4d6", "#cdb48a", { c: "#fff6cf", win: "#bfe3ff", p: [[0.06, 0.14], [0.2, 0.14], [0.17, 0.2], [0.02, 0.2]], s: [[0.24, 0.17], [0.27, 0.17], [0.29, 0.19], [0.26, 0.19]] }, "#8c8a7c",
         "NOON", ["key steep and white: short, hard shadows", "fill is cool sky-bounce", "honest, flat, nothing hidden"]);
    room(0.07, 0.4, "#b98a7a", "#7a5560", { c: "#ffb35c", win: "#ff9a4a", p: [[0.11, 0.14], [0.4, 0.14], [0.4, 0.21], [0.2, 0.21]], s: [[0.24, 0.17], [0.27, 0.17], [0.4, 0.2], [0.36, 0.21]] }, "#4a3558",
         "DUSK", ["key low and orange: LONG shadows", "everything it misses goes violet", "warm against cool is the whole mood"]);
    room(0.07, 0.66, "#1d2638", "#151b29", { c: "#f2c66a", win: "#0c111c", p: [[0.3, 0.14], [0.4, 0.14], [0.4, 0.21], [0.27, 0.21]], s: [[0.24, 0.17], [0.27, 0.17], [0.16, 0.2], [0.12, 0.2]] }, "#070a12",
         "NIGHT", ["the key is a LAMP inside the room", "shadows point away from it in every direction", "the corners drop to a deep cool fill"]);
    K.note(ctx, 0.92, "Paint your own room three times beside these. One key each time; chromatic greys for everything the key does not touch.");
    K.note(ctx, 0.96, "Outdoors the sky's fill is far stronger, so shadows are lighter and bluer than they ever are in a room.");
  }]], { color: true });
})();
