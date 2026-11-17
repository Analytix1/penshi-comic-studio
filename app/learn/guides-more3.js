/* ============================================================
   learn/guides-more3.js — deep-dive pages, third batch:
   composition, worldbuilding and weapons.
   ============================================================ */
"use strict";

(() => {
  const { K, LW, cam, draw, fig, frac, cap, leader, reg, handLevels } = GuideKit;
  const B = G3.box, C = G3.cyl;
  const RX = [[0, 1, 0], [1, 0, 0], [0, 0, -1]], RXn = [[0, -1, 0], [-1, 0, 0], [0, 0, -1]];
  const ghost = items => items.map(it => ({ ...it, noStroke: true, rings: null, decals: null, tone: 0, fill: 0 }));
  const notes = (ctx, y, list, dy = 0.035) => list.forEach((t, i) => K.note(ctx, y + i * dy, t));
  const thin = (ctx, fn) => { K.style(ctx, { lw: LW() * 0.5, dash: true }); fn(); K.style(ctx); };
  const bold = (ctx, fn, k = 2.2) => { K.style(ctx, { lw: LW() * k }); fn(); K.style(ctx); };
  const horizonY = c => { const v = G3.vanish(c, [0, 0, -1]); return v ? v[1] / K.page().h : null; };
  const trace = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => ctx[i ? "lineTo" : "moveTo"](K.X(x), K.Y(y))); ctx.closePath(); };
  const fill = (ctx, pts, a) => { K.style(ctx); ctx.save(); ctx.globalAlpha = a; trace(ctx, pts); ctx.fill(); ctx.restore(); };
  const cut = (ctx, pts) => { ctx.save(); ctx.globalCompositeOperation = "destination-out"; trace(ctx, pts); ctx.fill(); ctx.restore(); };
  /* a picture frame with its own 0..1 coordinates */
  const frame = (x, y, w, h) => {
    const p = (u, v) => [x + u * w, y + v * h], P = pts => pts.map(([u, v]) => p(u, v));
    return { x, y, w, h, p, P,
      box: ctx => K.poly(ctx, P([[0, 0], [1, 0], [1, 1], [0, 1]])),
      line: (ctx, a, b, c, d) => { const s = p(a, b), e = p(c, d); K.line(ctx, s[0], s[1], e[0], e[1]); },
      arrow: (ctx, a, b, c, d) => { const s = p(a, b), e = p(c, d); K.arrow(ctx, s[0], s[1], e[0], e[1]); },
      poly: (ctx, pts, close = true) => K.poly(ctx, P(pts), close),
      fill: (ctx, pts, a) => fill(ctx, P(pts), a),
      name: (ctx, t, sub) => { cap(ctx, x, y + h + 0.022, t, { bold: true }); if (sub) cap(ctx, x, y + h + 0.046, sub, { fs: 0.088 }); } };
  };
  const quad = (u0, v0, u1, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
  const four = () => [0, 1, 2, 3].map(i => frame(0.08 + (i % 2) * 0.44, 0.13 + Math.floor(i / 2) * 0.34, 0.4, 0.24));

  /* ============================================================
     Composition
     ============================================================ */
  {
    const names = [["ON A THIRD", "off-centre, with room to look into"], ["LEADING LINES", "edges that point at the subject"],
                   ["A FRAME INSIDE THE FRAME", "dark near shapes surround a light opening"], ["THE ODD ONE OUT", "the one shape that differs wins"]];
    const focus = [[0.66, 0.3], [0.355, 0.33], [0.575, 0.6], [0.7, 0.52]];
    reg("focalPoint", [
      ["frames and thirds", ctx => {
        K.title(ctx, "One focal point per picture: four ways to send the eye there");
        four().forEach((f, i) => {
          f.box(ctx); f.name(ctx, ...names[i]);
          thin(ctx, () => { for (const t of [1 / 3, 2 / 3]) { f.line(ctx, t, 0, t, 1); f.line(ctx, 0, t, 1, t); } });
        });
        notes(ctx, 0.86, ["Level 1: four empty frames, each split in thirds. The four crossings are the strong places for a subject.",
                          "Level 2: the big shapes only. Level 3: where the eye lands, and the route it takes to get there.",
                          "These four are tools, not subjects. Use two at once and the focal point becomes hard to miss.",
                          "A picture with two equal focal points has none. Decide which one is second, and weaken it."]);
      }],
      ["the big shapes", ctx => {
        const [a, b, c, d] = four();
        a.line(ctx, 0, 0.62, 1, 0.62); a.poly(ctx, quad(0.62, 0.25, 0.7, 0.62)); a.poly(ctx, [[0, 0.62], [0.16, 0.5], [0.3, 0.58], [0.44, 0.53], [0.62, 0.62]], false);
        b.line(ctx, 0, 0.38, 1, 0.38); b.line(ctx, 0.12, 1, 0.34, 0.38); b.line(ctx, 0.62, 1, 0.37, 0.38); b.line(ctx, 1, 0.8, 0.4, 0.4); b.line(ctx, 1, 0.08, 0.4, 0.33);
        b.poly(ctx, quad(0.33, 0.28, 0.38, 0.38));
        c.fill(ctx, [[0, 0], [0.22, 0], [0.18, 1], [0, 1]], 0.8); c.fill(ctx, [[0.22, 0], [1, 0], [1, 0.1], [0.6, 0.2], [0.21, 0.13]], 0.8); c.fill(ctx, [[0.87, 0.14], [1, 0.1], [1, 1], [0.9, 1]], 0.8);
        c.line(ctx, 0.18, 0.7, 0.9, 0.7); c.poly(ctx, quad(0.55, 0.5, 0.6, 0.7));
        [0.1, 0.22, 0.34, 0.46, 0.58, 0.82].forEach(u => d.poly(ctx, quad(u, 0.48, u + 0.07, 0.6)));
        d.fill(ctx, quad(0.68, 0.44, 0.77, 0.6), 0.85);
      }],
      ["where the eye lands", ctx => {
        const fs = four();
        bold(ctx, () => fs.forEach((f, i) => { const [x, y] = f.p(...focus[i]); K.circle(ctx, x, y, 0.028); }), 1.6);
        fs[0].arrow(ctx, 0.1, 0.85, 0.56, 0.42);
        fs[1].arrow(ctx, 0.2, 0.92, 0.33, 0.48); fs[1].arrow(ctx, 0.9, 0.72, 0.46, 0.42);
        fs[2].arrow(ctx, 0.3, 0.3, 0.5, 0.52);
        fs[3].arrow(ctx, 0.12, 0.38, 0.6, 0.38);
      }],
    ]);
  }
  {
    const far = [[0, 0.5], [0.2, 0.36], [0.38, 0.47], [0.6, 0.3], [0.82, 0.44], [1, 0.38], [1, 0.62], [0, 0.62]];
    const sky = [[0, 0], [1, 0], [1, 0.38], [0.82, 0.44], [0.6, 0.3], [0.38, 0.47], [0.2, 0.36], [0, 0.5]];
    const mid = [[0, 0.62], [1, 0.62], [1, 0.8], [0.7, 0.84], [0, 0.78]];
    const fg = [[0, 0.78], [0.7, 0.84], [1, 0.8], [1, 1], [0, 1]];
    const tree = [[0, 0.08], [0.13, 0.06], [0.16, 0.84], [0, 0.84]];
    const subj = quad(0.56, 0.4, 0.68, 0.62);
    const L = 0.1, M = 0.42, D = 0.88;
    /* sky, far, mid, foreground, subject */
    const sets = [[[L, L, M, D, D], "DARK NEAR, LIGHT FAR", "the default for daylight and depth"],
                  [[D, D, M, D, L], "LIGHT SUBJECT IN THE DARK", "night, interiors, a single lamp"],
                  [[M, D, L, L, D], "LIGHT NEAR, DARK FAR", "snow, sand, a storm coming"],
                  [[M, M, D, D, L], "LIGHT ON MID-GREY", "overcast: only the subject is bright"]];
    reg("valueGroups", [
      ["five shapes", ctx => {
        K.title(ctx, "Three values: the same five shapes, grouped four ways");
        four().forEach((f, i) => { f.box(ctx); for (const s of [far, mid, tree, subj]) f.poly(ctx, s); f.name(ctx, sets[i][1], sets[i][2]); });
        notes(ctx, 0.86, ["Level 1: sky, far hills, middle ground, foreground and one subject. Identical in all four frames.",
                          "Level 2: each shape gets ONE of three values — light, middle, dark. No blending, no fourth value.",
                          "The subject always sits against the value most unlike it. That contrast is the focal point.",
                          "Squint: neighbours of the same value join into one big shape. Three or four big shapes is a strong picture."]);
      }],
      ["three values", ctx => four().forEach((f, i) => {
        const v = sets[i][0];
        f.fill(ctx, sky, v[0]); f.fill(ctx, far, v[1]); f.fill(ctx, mid, v[2]); f.fill(ctx, fg, v[3]);
        cut(ctx, f.P(tree)); f.fill(ctx, tree, v[3]);
        cut(ctx, f.P(subj)); f.fill(ctx, subj, v[4]);
      })],
    ]);
  }
  {
    const fr = () => [0, 1, 2, 3, 4, 5].map(i => frame(0.07 + (i % 3) * 0.3, 0.13 + Math.floor(i / 3) * 0.31, 0.26, 0.2));
    const names = [["THIRDS", "calm, balanced"], ["DIAGONAL", "movement, instability"], ["TRIANGLE", "solid, monumental"],
                   ["L-SHAPE", "a frame with an open corner"], ["S-CURVE", "a slow path into depth"], ["RADIAL", "everything aims at one point"]];
    const edge = [[0, 0], [0.5, 0], [1, 0], [1, 0.5], [1, 1], [0.5, 1], [0, 1], [0, 0.5]];
    reg("compArmatures", [
      ["six frames", ctx => {
        K.title(ctx, "Armatures: six skeletons a composition can hang on");
        fr().forEach((f, i) => { f.box(ctx); f.name(ctx, ...names[i]); });
        notes(ctx, 0.8, ["Level 1: the frames. Level 2: the armature — the few lines the big shapes will follow.",
                         "Level 3: grey masses placed on each armature. They are blocks, not things: any subject can sit on any armature.",
                         "The armature is chosen for the FEELING of the moment, before you know what the objects look like.",
                         "Test: can you draw the picture's armature in three strokes? If it takes ten, there isn't one yet.",
                         "Look for these in film stills and paintings you admire, and trace the armature over them."]);
      }],
      ["the armature", ctx => {
        const f = fr();
        bold(ctx, () => {
          for (const t of [1 / 3, 2 / 3]) { f[0].line(ctx, t, 0, t, 1); f[0].line(ctx, 0, t, 1, t); }
          f[1].line(ctx, 0, 1, 1, 0);
          f[2].poly(ctx, [[0.5, 0.12], [0.1, 0.9], [0.9, 0.9]]);
          f[3].line(ctx, 0.22, 0, 0.22, 1); f[3].line(ctx, 0, 0.78, 1, 0.78);
          const s = (a, b) => f[4].p(a, b), q = (a, b, c) => K.curve(ctx, ...a, ...b, ...c);
          q(s(0.1, 0.95), s(0.95, 0.82), s(0.5, 0.56)); q(s(0.5, 0.56), s(0.08, 0.32), s(0.72, 0.18));
          edge.forEach(([u, v]) => f[5].line(ctx, 0.5, 0.45, u, v));
        }, 1.5);
      }],
      ["masses on the armature", ctx => {
        const f = fr(), g = 0.4;
        f[0].fill(ctx, quad(0, 0.667, 1, 1), 0.16); f[0].fill(ctx, quad(0.6, 0.2, 0.73, 0.667), g);
        f[1].fill(ctx, [[0.2, 1], [1, 1], [1, 0.2]], g);
        f[2].fill(ctx, [[0.5, 0.2], [0.2, 0.88], [0.8, 0.88]], g);
        f[3].fill(ctx, [[0, 0], [0.22, 0], [0.22, 0.78], [1, 0.78], [1, 1], [0, 1]], g);
        f[4].fill(ctx, quad(0.66, 0.1, 0.8, 0.26), g); f[4].fill(ctx, [[0, 0.7], [0.3, 0.86], [0.3, 1], [0, 1]], 0.16);
        for (const t of [[[0, 0], [0.36, 0], [0, 0.3]], [[1, 0], [0.64, 0], [1, 0.3]], [[0, 1], [0.36, 1], [0, 0.66]], [[1, 1], [0.64, 1], [1, 0.66]]]) f[5].fill(ctx, t, g);
      }],
    ]);
  }
  {
    const blocks = () => [B([-11, 7.5, -4], [9, 15, 9]), B([3, 9, -16], [9, 18, 9]), B([15, 4.5, 4], [7.5, 9, 7.5])];
    const person = () => Rigs.figure({ root: [2, 0, 8] }).solids.map(s => ({ ...s, rings: null, decals: null }));
    const rows = [["FROM ABOVE", "camera high, looking down", 35, "The ground fills the frame; roofs show.", "Figures look small and watched."],
                  ["EYE LEVEL", "camera at a standing person's eyes", -0.7, "The horizon crosses every standing", "figure at the eyes. Neutral, present."],
                  ["FROM BELOW", "camera near the ground", -5, "Everything rises above the horizon.", "Figures and buildings loom."]];
    const cy = i => 0.285 + i * 0.23;
    const cc = i => cam(0.66, cy(i), 0.0135, { yaw: 24, pitch: rows[i][2], dist: 80, target: [2, 8, 0] });
    reg("cameraHeights", [
      ["three horizons", ctx => {
        K.title(ctx, "Camera height: one scene from three eye levels");
        rows.forEach(([n, how, , a, b], i) => {
          cap(ctx, 0.05, cy(i) - 0.05, n, { bold: true }); cap(ctx, 0.05, cy(i) - 0.026, how, { fs: 0.09 });
          cap(ctx, 0.05, cy(i) + 0.008, a, { fs: 0.09 }); cap(ctx, 0.05, cy(i) + 0.03, b, { fs: 0.09 });
          const c = cc(i), h = horizonY(c);
          draw(ctx, c, blocks().map(b => G3.path([0, 1, 5, 4].map(k => b.verts[k]), { close: true, lw: 0.8 })));
          if (h !== null && Math.abs(h - cy(i)) < 0.12) { thin(ctx, () => K.line(ctx, 0.36, h, 0.95, h)); cap(ctx, 0.37, h - 0.012, "horizon", { fs: 0.085 }); }
          else cap(ctx, 0.05, cy(i) + 0.056, "The horizon is above the frame.", { fs: 0.09 });
        });
        notes(ctx, 0.9, ["Level 1: the horizon and the footprints on the ground. Level 2: the same three boxes. Level 3: one person.",
                         "Nothing in the scene moved. Only the camera's height changed — and with it who has the power in the picture."]);
      }],
      ["the same three boxes", ctx => rows.forEach((_, i) => draw(ctx, cc(i), blocks()))],
      ["one person", ctx => rows.forEach((_, i) => draw(ctx, cc(i), [...ghost(blocks()), ...person()]))],
    ]);
  }

  /* ============================================================
     Worldbuilding
     ============================================================ */
  {
    const house = y => [B([0.4, y + 1.3, 0], [3, 2.6, 2.6]), G3.prism([0.4, y + 2.6, 0], [[-1.75, 0], [1.75, 0], [0, 1.2]], 2.9)];
    const slab = y => B([0.4, y - 0.1, 0], [3.5, 0.2, 3.1]);
    const posts = (xs, y0, y1) => xs.flatMap(([x, a]) => [-1.3, 1.3].map(z => C([x, a ?? y0, z], [x, y1, z], 0.1, 0.1)));
    const water = () => [G3.path([[-3.6, 0, -2.6], [3.6, 0, -2.6], [3.6, 0, 2.6], [-3.6, 0, 2.6]], { close: true, lw: 0.8 }),
                         ...[-1.4, 0.2, 1.8].map(z => G3.path(Rigs.smooth([-3, -1.5, 0, 1.5, 3].map((x, i) => [x, 0, z + (i % 2 ? 0.18 : -0.18)]), 5), { lw: 0.6 }))];
    const sites = [
      ["A SLOPE", "cut in uphill, posts downhill", { ground: () => [G3.prism([0, 0, 0], [[-3.6, 0], [3.6, 0], [3.6, 2.5]], 5)],
        foot: () => [slab(1.75), ...posts([[-1.1, 0.87]], 0, 1.65)], y: 1.75 }],
      ["WATER", "a deck on posts, above the high-water line", { ground: water,
        foot: () => [slab(1.5), ...posts([[-1.1], [1.9]], -0.02, 1.4)], y: 1.5 }],
      ["ROCK", "a plinth that levels the top", { ground: () => [G3.tbox([0, 0.5, 0], { w0: 7, w1: 5.6, h: 1, d0: 5, d1: 4 })],
        foot: () => [B([0.4, 1.25, 0], [3.6, 0.5, 3.2])], y: 1.5 }]];
    const at = i => 0.2 + i * 0.3;
    const cf = i => cam(at(i), 0.36, 0.037, { yaw: 30, pitch: 16, dist: 22, target: [0, 1.8, 0] });
    reg("landToBuilding", [
      ["three grounds", ctx => {
        K.title(ctx, "Footings: the same building meets three different grounds");
        sites.forEach(([n, how, s], i) => { draw(ctx, cf(i), s.ground()); cap(ctx, at(i) - 0.12, 0.52, n, { bold: true }); cap(ctx, at(i) - 0.12, 0.545, how, { fs: 0.086 }); });
        notes(ctx, 0.63, ["Level 1: the ground alone — a slope, open water, a rock outcrop. Draw the ground before anything stands on it.",
                          "Level 2: the footing. This is the part that answers the ground: posts, a cut terrace, a deck, a plinth.",
                          "Level 3: the building. It is the SAME box and roof each time. Only the footing changed.",
                          "The footing is where a place's character shows first. Look at how real buildings on your",
                          "reference landform meet the ground, and copy that logic — not the look — onto your own.",
                          "Every floor is level, whatever the ground does. Check each floor line against the horizon."], 0.034);
      }],
      ["the footing", ctx => sites.forEach(([, , s], i) => draw(ctx, cf(i), [...ghost(s.ground()), ...s.foot()]))],
      ["the same building", ctx => sites.forEach(([, , s], i) => draw(ctx, cf(i), [...ghost([...s.ground(), ...s.foot()]), ...house(s.y)]))],
    ]);
  }
  {
    const plots = [[-5, 2, 3, 3, 2.6], [-4.5, -3, 3.5, 3, 3.4], [-1.6, -7.5, 3, 3, 2.6], [3.6, -6, 4, 3, 4.2], [5, -1, 3, 3.5, 2.6], [4.5, 4, 3, 3, 3], [0.5, -12.5, 5, 4, 5.5]]
      .map(([x, z, w, d, h]) => [x * 3, z * 3, w * 3, d * 3, h * 4]);
    const way = [[0, 8], [0.5, 4], [0, 0], [1, -4], [0.6, -9.5]].map(([x, z]) => [x * 3, 0, z * 3]);
    const k = 0.0055, px = x => 0.5 + x * k, py = z => 0.265 + K.V(k * (z + 8));
    const cs = () => cam(0.5, 0.66, 0.0105, { yaw: 0, pitch: 17, dist: 95, target: [0, 4, -8] });
    const foot = ([x, z, w, d]) => G3.path([[x - w / 2, 0, z - d / 2], [x + w / 2, 0, z - d / 2], [x + w / 2, 0, z + d / 2], [x - w / 2, 0, z + d / 2]], { close: true, lw: 0.8 });
    const boxes = () => plots.map(([x, z, w, d, h]) => B([x, h / 2, z], [w, h, d]));
    const roofs = () => plots.map(([x, z, w, d, h]) => G3.prism([x, h, z], [[-w / 2 - 0.5, 0], [w / 2 + 0.5, 0], [0, w * 0.36]], d + 0.8));
    const folk = () => [[3, 12], [-2.5, -4]].flatMap(([x, z]) => Rigs.figure({ root: [x, 0, z] }).solids.map(s => ({ ...s, rings: null, decals: null })));
    reg("settlementPlan", [
      ["plan and footprints", ctx => {
        K.title(ctx, "From map to view: plan the place from above, then stand in it");
        cap(ctx, 0.07, 0.13, "THE PLAN", { bold: true }); cap(ctx, 0.07, 0.155, "seen from straight above", { fs: 0.09 });
        plots.forEach(([x, z, w, d], i) => { K.poly(ctx, [[px(x - w / 2), py(z - d / 2)], [px(x + w / 2), py(z - d / 2)], [px(x + w / 2), py(z + d / 2)], [px(x - w / 2), py(z + d / 2)]]); K.label(ctx, px(x) - 0.008, py(z), String(i + 1), { fs: 0.09, bold: true }); });
        bold(ctx, () => K.poly(ctx, Rigs.smooth(way, 6).map(p => [px(p[0]), py(p[2])]), false), 1.4);
        K.arrow(ctx, 0.5, py(31), 0.5, py(26)); cap(ctx, 0.525, py(29.5), "you stand here, looking this way", { fs: 0.09 });
        cap(ctx, 0.07, 0.5, "THE VIEW", { bold: true }); cap(ctx, 0.07, 0.525, "the same footprints on the ground", { fs: 0.09 });
        draw(ctx, cs(), [G3.path(Rigs.smooth(way, 6), { lw: 1.3 }), ...plots.map(foot)]);
        plots.forEach(([x, z], i) => { const [a, b] = frac(cs(), [x, 0, z]); K.label(ctx, a - 0.008, b, String(i + 1), { fs: 0.09, bold: true }); });
        notes(ctx, 0.86, ["Level 1: a path and seven numbered plots, as a plan and then as footprints seen from where the arrow stands.",
                          "Level 2: each footprint raised into a box. Heights vary — decide which building matters most and make it tallest.",
                          "Level 3: roofs, and two people for scale. The plan stays simple; the view is where it becomes a place.",
                          "A bending path hides what is ahead and turns every building to a different angle."]);
      }],
      ["boxes on the footprints", ctx => draw(ctx, cs(), boxes())],
      ["roofs and people", ctx => draw(ctx, cs(), [...ghost(boxes()), ...roofs(), ...folk()])],
    ]);
  }
  {
    const H = 7.47;
    const cl = () => cam(0.5, 0.5, 0.0162, { yaw: 8, pitch: 3, dist: 130, target: [1, 14, 0] });
    const door = (x, z) => G3.path([[x - 1.9, 0, z], [x - 1.9, 8.5, z], [x + 1.9, 8.5, z], [x + 1.9, 0, z]], { lw: 1 });
    const person = () => Rigs.figure({ root: [-21.5, 0, 0] }).solids.map(s => ({ ...s, rings: null, decals: null }));
    const one = () => [B([-15.5, 4.25, 0], [3.8, 8.5, 0.5]), B([-5.5, 5, 0], [12, 10, 9]), G3.prism([-5.5, 10, 0], [[-6.7, 0], [6.7, 0], [0, 4.2]], 9.8), door(-5.5, 4.51)];
    const two = () => [B([8.5, 10.5, 0], [12, 21, 9]), G3.prism([8.5, 21, 0], [[-6.7, 0], [6.7, 0], [0, 4.2]], 9.8), door(8.5, 4.51),
                       G3.path([[2.5, 10.5, 4.51], [14.5, 10.5, 4.51]], { lw: 0.7 }), C([21, 0, 0], [21, 13, 0], 0.9, 0.6), G3.ball([21, 19.5, 0], 6.8, { rings: ["xz"] })];
    reg("scaleLadder", [
      ["a person and a ruler", ctx => {
        K.title(ctx, "Scale: measure the world in people");
        const c = cl();
        draw(ctx, c, [G3.seg([-25, 0, 0], [29, 0, 0], { lw: 0.7, hide: false }), ...person()]);
        thin(ctx, () => [1, 2, 3, 4].forEach(n => { const a = frac(c, [-25, n * H, 0]), b = frac(c, [29, n * H, 0]); K.line(ctx, a[0], a[1], b[0], b[1]); }));
        [1, 2, 3, 4].forEach(n => { const a = frac(c, [-25, n * H, 0]); K.label(ctx, a[0] - 0.045, a[1], "×" + n, { fs: 0.1, bold: true }); });
        [["person", -21.5, "1"], ["door", -15.5, "just over 1"], ["one storey", -5.5, "wall ≈ 1⅓"], ["two storeys", 8.5, "wall ≈ 2¾"], ["a grown tree", 21, "3 to 5"]]
          .forEach(([n, x, m]) => { const a = frac(c, [x, 0, 5]); cap(ctx, a[0] - 0.05, a[1] + 0.03, n, { bold: true, fs: 0.095 }); cap(ctx, a[0] - 0.05, a[1] + 0.053, m, { fs: 0.088 }); });
        notes(ctx, 0.8, ["Level 1: one standing person and a ruler marked in person-heights. Every size in your world is read against this.",
                         "Level 2: a door and a one-storey house. A door is a little taller than a person; a storey is about a person and a third.",
                         "Level 3: two storeys and a tree. Count storeys, not metres — a storey is the unit buildings are made of.",
                         "If your world's people are larger or smaller than us, the DOORS change first, then everything a hand touches.",
                         "Put a figure in every environment drawing, even a tiny one. Without it nobody can tell a hut from a hall."]);
      }],
      ["door and one storey", ctx => draw(ctx, cl(), one())],
      ["two storeys and a tree", ctx => draw(ctx, cl(), two())],
    ]);
  }

  /* ============================================================
     Weapons
     ============================================================ */
  const sword = () => [G3.tbox([1.5, 0, 0], { w0: 0.22, w1: 0.05, h: 2.6, d0: 0.05, d1: 0.02 }, RX), B([0.16, 0, 0], [0.12, 0.74, 0.1]),
                       C([-0.5, 0, 0], [0.1, 0, 0], 0.065, 0.065, { rings: [0.25, 0.5, 0.75] }), G3.ball([-0.6, 0, 0], 0.11)];
  const axe = () => [C([-1.3, 0, 0], [1.05, 0, 0], 0.055, 0.05), G3.prism([0, 0, 0], [[0.7, 0.07], [0.6, -0.72], [1.1, -0.6], [1.0, 0.07]].reverse(), 0.07)];
  {
    const views = [["FLAT", "the face of the blade", 0.23, { yaw: 0, pitch: 0 }], ["EDGE", "turned a quarter: how thin it is", 0.4, { yaw: 0, pitch: 86 }],
                   ["THREE-QUARTER", "turned and tipped, as you will usually draw it", 0.555, { yaw: 48, pitch: 16 }]];
    const cv = i => cam(0.5, views[i][2], i === 2 ? 0.17 : 0.2, { ...views[i][3], dist: 18, target: [1.1, 0, 0] });
    const section = (ctx, cx, cy, kind) => {
      const w = 0.085, t = 0.012, p = (u, v) => [cx + u * w, cy + K.V(v * t)];
      const pts = kind === 0 ? [[-1, 0], [0, -1], [1, 0], [0, 1]]
                : kind === 1 ? [[-1, 0], [-0.6, -0.62], [0, -0.85], [0.6, -0.62], [1, 0], [0.6, 0.62], [0, 0.85], [-0.6, 0.62]]
                : [[-1, 0], [-0.4, -0.9], [-0.25, -0.35], [0.25, -0.35], [0.4, -0.9], [1, 0], [0.4, 0.9], [0.25, 0.35], [-0.25, 0.35], [-0.4, 0.9]];
      K.poly(ctx, pts.map(([u, v]) => p(u, v)));
    };
    reg("swordAnatomy", [
      ["axis and stations", ctx => {
        K.title(ctx, "A sword in depth: one axis, five stations, three views");
        views.forEach(([n, how, y], i) => {
          const cy0 = y - (i === 2 ? 0.1 : i ? 0.05 : 0.075); cap(ctx, 0.05, cy0, n, { bold: true }); cap(ctx, 0.23, cy0, how, { fs: 0.09 });
          const c = cv(i);
          draw(ctx, c, [G3.seg([-0.71, 0, 0], [2.8, 0, 0], { lw: 0.7, hide: false })]);
          bold(ctx, () => { const a = frac(c, [-0.5, 0, 0]), b = frac(c, [0.1, 0, 0]); K.line(ctx, a[0], a[1], b[0], b[1]); }, 2.6);
        });
        const c = cv(0), ly = 0.295;
        [[-0.6, "pommel", 0.1], [-0.2, "grip", 0.22], [0.16, "guard", 0.33], [0.62, "balance point", 0.45], [1.7, "blade", 0.68], [2.8, "point", 0.86]]
          .forEach(([x, t, tx]) => leader(ctx, c, [x, 0, 0], tx, ly, t, { fs: 0.09 }));
        cap(ctx, 0.05, 0.665, "CROSS-SECTIONS", { bold: true }); cap(ctx, 0.3, 0.665, "cut straight through the blade — this decides the highlight", { fs: 0.09 });
        [["diamond: one ridge", 0.2], ["lens: no ridge", 0.5], ["fullered: a groove", 0.8]].forEach(([t, x]) => cap(ctx, x - 0.09, 0.745, t, { fs: 0.09 }));
        notes(ctx, 0.82, ["Level 1: the axis, with the grip marked thick, in all three views. The stations are measured along it.",
                          "Level 2: the forms on that axis. The guard is always square to the axis; the blade tapers in BOTH width and thickness.",
                          "Level 3: the ridge line and three cross-sections. A ridge splits the blade into a light plane and a dark plane.",
                          "The balance point sits a hand's width in front of the guard. A sword that looks tip-heavy looks like a club."]);
      }],
      ["forms", ctx => views.forEach((_, i) => draw(ctx, cv(i), sword()))],
      ["ridge and cross-sections", ctx => {
        [0, 2].forEach(i => { const a = frac(cv(i), [0.24, 0, 0.026]), b = frac(cv(i), [2.8, 0, 0.011]); thin(ctx, () => K.line(ctx, a[0], a[1], b[0], b[1])); });
        [0.2, 0.5, 0.8].forEach((x, i) => section(ctx, x, 0.71, i));
      }],
    ]);
  }
  {
    const yaws = [0, 30, 55, 75, 88], at = i => 0.13 + i * 0.185;
    const cs = i => cam(at(i), 0.28, 0.048, { yaw: yaws[i], pitch: 9, dist: 14, target: [1.05, 0, 0] });
    const ca = i => cam(at(i), 0.56, 0.062, { yaw: yaws[i], pitch: 9, dist: 14, target: [-0.1, -0.2, 0] });
    const sAxis = () => [G3.seg([-0.71, 0, 0], [2.8, 0, 0], { lw: 0.8, hide: false }), G3.seg([0.16, -0.37, 0], [0.16, 0.37, 0], { lw: 0.8, hide: false })];
    const aAxis = () => [G3.seg([-1.3, 0, 0], [1.05, 0, 0], { lw: 0.8, hide: false }), G3.seg([0.85, 0.07, 0], [0.85, -0.7, 0], { lw: 0.8, hide: false })];
    reg("weaponTurn", [
      ["axis and cross-piece", ctx => {
        K.title(ctx, "Turning a weapon toward you: the axis shortens, the widths do not");
        yaws.forEach((y, i) => { draw(ctx, cs(i), sAxis()); draw(ctx, ca(i), aAxis()); cap(ctx, at(i) - 0.02, 0.42, y + "°", { bold: true }); });
        cap(ctx, 0.05, 0.14, "A SWORD, SWUNG ROUND TO POINT AT YOU", { bold: true }); cap(ctx, 0.05, 0.47, "AN AXE, THE SAME FIVE TURNS", { bold: true });
        notes(ctx, 0.72, ["Level 1: the axis and one cross-piece (the guard; the axe's cutting edge). Draw these two lines first, every time.",
                          "As the weapon turns toward you the axis gets SHORTER on the page. The cross-piece keeps its full length.",
                          "Level 2: the forms. Near parts overlap far parts: the point covers the blade, the blade covers the guard.",
                          "At 88° the sword is almost a dot with a guard across it. That is correct — do not lengthen it to make it 'read'.",
                          "The near end is drawn larger than the far end. On a long weapon held toward the viewer that difference is large.",
                          "Practise with a ruler or a wooden spoon held at arm's length: turn it, and draw only the axis and its ends."], 0.034);
      }],
      ["forms", ctx => yaws.forEach((_, i) => { draw(ctx, cs(i), sword()); draw(ctx, ca(i), axe()); })],
    ]);
  }
  {
    const A = x => [x, 0.3, -0.5];
    const hilt = () => [C(A(0.7), A(-0.7), 0.17, 0.17, { rings: [0.25, 0.5, 0.75] }), G3.ball(A(0.88), 0.25), B(A(-1.02), [0.16, 1.4, 0.26]),
                        G3.tbox(A(-2.3), { w0: 0.44, w1: 0.32, h: 2.4, d0: 0.08, d1: 0.06 }, RXn)];
    const list = [["grip", 22, 12, -1.1, "a sword — knuckles toward you", hilt],
                  ["grip", 205, 18, -1.1, "the same grip from the palm side", hilt],
                  ["grip", 22, 12, -1.0, "an axe — the hand sits near the END of the haft",
                    () => [C(A(1.0), A(-3.0), 0.17, 0.15), G3.prism([0, 0, -0.5], [[-2.85, 0.25], [-2.25, 0.25], [-2.1, 1.4], [-3.0, 1.3]].reverse(), 0.1)]],
                  ["grip", 22, 12, 0.7, "a knife reversed — blade from the little-finger side",
                    () => [C(A(-0.75), A(0.75), 0.17, 0.17), G3.tbox(A(1.8), { w0: 0.34, w1: 0.04, h: 2.1, d0: 0.06, d1: 0.02 }, RX)]]];
    const at = i => [0.27 + (i % 2) * 0.46, 0.3 + Math.floor(i / 2) * 0.33];
    const set = () => list.map(([pose, yaw, pitch, tx, , props], i) => {
      const h = Rigs.hand(pose); h.props = props();
      return [h, cam(at(i)[0], at(i)[1], 0.082, { yaw, pitch, dist: 14, target: [tx, 0.2, -0.3] })];
    });
    reg("weaponInHand", handLevels(set, {
      title: ctx => {
        K.title(ctx, "In the hand: draw the weapon first, then close the hand round it");
        list.forEach(([, , , , n], i) => cap(ctx, at(i)[0] - 0.19, at(i)[1] + 0.175, n, { bold: true }));
        notes(ctx, 0.9, ["Level 1 includes the weapon. The grip is a cylinder as thick as the gap inside a closed hand, and four fingers long.",
                         "The blade's EDGE lines up with the knuckles. Forearm, wrist and weapon make one bent line.",
                         "Sword blades are cut short here. Measure the full length against the figure on the next page."], 0.032);
      },
      props: h => h.props,
    }));
  }
  {
    const cw = () => cam(0.5, 0.47, 0.042, { yaw: 0, pitch: 3, dist: 44, target: [0, 4.4, 0] });
    const swordV = (x, L, g) => [G3.ball([x, 0.12, 0], 0.12), C([x, 0.24, 0], [x, 0.24 + g, 0], 0.07, 0.07), B([x, 0.3 + g, 0], [0.8, 0.12, 0.12]),
                                 G3.tbox([x, (0.36 + g + L) / 2, 0], { w0: 0.24, w1: 0.05, h: L - 0.36 - g, d0: 0.05, d1: 0.02 })];
    const list = [
      ["dagger", "under 2", -8.6, 1.7, [0.24, 0.69], x => swordV(x, 1.7, 0.45)],
      ["one-hand sword", "about 4", -6.4, 4.2, [0.24, 0.69], x => swordV(x, 4.2, 0.45)],
      ["long sword", "about 5", -4, 5.3, [0.24, 1.14], x => swordV(x, 5.3, 0.9)],
      ["hand axe", "about 3", 3.4, 3.1, [0.1, 0.6], x => [C([x, 0, 0], [x, 3.1, 0], 0.07, 0.06), G3.prism([x, 0, 0], [[0.05, 2.3], [0.8, 2.1], [0.8, 3.15], [0.05, 2.95]], 0.08)]],
      ["bow", "about 7", 5.8, 7.2, [3.3, 3.9], x => [G3.path(Rigs.smooth([[x - 0.35, 0, 0], [x + 0.45, 1.9, 0], [x + 0.65, 3.6, 0], [x + 0.45, 5.3, 0], [x - 0.35, 7.2, 0]], 8), { lw: 1.8 }),
                                                G3.path([[x - 0.35, 0, 0], [x - 0.35, 7.2, 0]], { lw: 0.6 })]],
      ["spear", "9 or more", 8.4, 9, [3.6, 5.2], x => [C([x, 0, 0], [x, 8.2, 0], 0.06, 0.06), G3.tbox([x, 8.6, 0], { w0: 0.28, w1: 0.02, h: 0.8, d0: 0.06, d1: 0.01 })]]];
    reg("weaponScale", [
      ["the figure", ctx => {
        K.title(ctx, "Against the body: how long each weapon really is");
        const c = cw(), f = Rigs.figure("stand");
        draw(ctx, c, [G3.seg([-10, 0, 0], [10, 0, 0], { lw: 0.7, hide: false })]);
        fig(ctx, c, f, "mannequin");
        [["top of head", f.J.crown[1]], ["shoulder", f.J.shR[1]], ["hip", f.J.hipR[1]], ["knee", f.J.knR[1]]].forEach(([n, y]) => {
          const a = frac(c, [-10, y, 0]), b = frac(c, [10, y, 0]);
          thin(ctx, () => K.line(ctx, a[0], a[1], b[0], b[1])); K.label(ctx, a[0] - 0.005, a[1] - 0.012, n, { fs: 0.085 });
        });
        list.forEach(([n, m, x], i) => { const a = frac(c, [x, 0, 0]); cap(ctx, a[0] - 0.045, a[1] + 0.028 + (i % 2) * 0.046, n, { bold: true, fs: 0.09 }); cap(ctx, a[0] - 0.045, a[1] + 0.05 + (i % 2) * 0.046, m + " heads", { fs: 0.085 }); });
        notes(ctx, 0.83, ["Level 1: a standing figure with four body heights ruled across. Lengths below are in HEADS of that figure.",
                          "Level 2: each weapon as a single line of the right length, with the grip marked thick where the hand goes.",
                          "Level 3: the forms. A one-hand sword reaches from the ground to about the hip; a spear stands well above the head.",
                          "These are common historical sizes, not rules — check museum pieces. A weapon far outside them needs a reason."]);
      }],
      ["length and grip", ctx => {
        const c = cw();
        list.forEach(([, , x, L, g]) => {
          const a = frac(c, [x, 0, 0]), b = frac(c, [x, L, 0]), g0 = frac(c, [x, g[0], 0]), g1 = frac(c, [x, g[1], 0]);
          K.line(ctx, a[0], a[1], b[0], b[1]); bold(ctx, () => K.line(ctx, g0[0], g0[1], g1[0], g1[1]), 2.8);
        });
      }],
      ["forms", ctx => draw(ctx, cw(), list.flatMap(([, , x, , , make]) => make(x)))],
    ]);
  }
})();
