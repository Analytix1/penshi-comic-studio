/* ============================================================
   learn/guides-anatomy.js — leveled guides for anatomy, shape
   language and cloth. All of them hang on the SAME figure rig the
   mannequin lessons use, so the skeleton, the muscle masses and a
   coat are visibly three layers over one armature.
   ============================================================ */
"use strict";

(() => {
  const { K, LW, cam, draw, fig, frac, leader, cap, floor, reg } = GuideKit;
  const { add, mul, ap, lerp } = G3;
  const F = (pose, build) => Rigs.figure(typeof pose === "string" ? Rigs.POSES[pose] : pose, build);
  const rel = (p, R, v) => add(p, ap(R, v));
  const ghost = items => items.map(it => ({ ...it, noStroke: true, rings: null, decals: null, tone: 0, fill: 0 }));
  const xOf = c => c.cx / K.page().w;

  /* ---------- landmarks ---------- */
  {
    const front = () => [F("contrapposto"), cam(0.5, 0.86, 0.092, { yaw: 22, pitch: 5 })];
    const back = () => [F("contrapposto"), cam(0.84, 0.86, 0.058, { yaw: 204, pitch: 5 })];
    reg("skeletonLandmarks", [
      ["mannequin", ctx => {
        K.title(ctx, "Landmarks: the bones you can find on the surface");
        for (const [f, c] of [front(), back()]) fig(ctx, c, f, "mannequin");
        cap(ctx, 0.76, 0.89, "…and from behind", { bold: true });
        K.note(ctx, 0.93, "Level 2 marks where bone lies just under the skin. These points never slide: the soft forms hang BETWEEN them.");
        K.note(ctx, 0.97, "Find each one on your own body. The iliac crests are wider and higher than you have been drawing them.");
      }],
      ["landmarks", ctx => {
        const [f, c] = front();
        fig(ctx, c, f, "landmarks", { r: 3 });
        const [fb, cb] = back(); fig(ctx, cb, fb, "landmarks", { r: 2.4 });
        const seen = new Set(), rows = [];
        for (const [name, p] of f.landmarks) {
          if (seen.has(name)) continue;
          seen.add(name);
          rows.push([name, ...frac(c, p)]);
        }
        rows.sort((a, b) => a[2] - b[2]);                    // top to bottom: leaders never cross
        rows.forEach(([name, px, py], i) => {
          const y = 0.2 + i * 0.066;
          K.style(ctx, { lw: LW() * 0.55 }); K.line(ctx, px, py, 0.27, y); K.style(ctx);
          K.label(ctx, 0.262, y, name, { fs: 0.105, align: "right" });
        });
      }],
    ]);
  }

  /* ---------- the simplified skeleton ---------- */
  {
    const set = () => [[F("contrapposto"), cam(0.29, 0.86, 0.092, { yaw: 26, pitch: 5 })],
                       [F("walkPass"), cam(0.76, 0.86, 0.092, { yaw: -78, pitch: 5 })]];
    reg("simpleSkeleton", [
      ["the body's outline", ctx => {
        K.title(ctx, "The simplified skeleton: what is inside the mannequin");
        for (const [f, c] of set()) fig(ctx, c, f, "contour");
        K.note(ctx, 0.92, "Level 1 is only the outline of the mannequin. Level 2 puts the skeleton inside it.");
        K.note(ctx, 0.96, "ONE bone above the elbow and knee, TWO below. The spine is a double S, never a rod. The ribs slope down to the front.");
      }],
      ["the skeleton", ctx => { for (const [f, c] of set()) draw(ctx, c, Rigs.skeleton(f)); }],
    ]);
  }

  /* ---------- the muscle masses ---------- */
  {
    const set = () => [[F("stand"), cam(0.35, 0.86, 0.092, { yaw: 24, pitch: 5 }), true],
                       [F("stand"), cam(0.67, 0.86, 0.092, { yaw: 204, pitch: 5 }), false]];
    const names = { front: [["deltoidR", "deltoid"], ["pecR", "pectoral"], ["bicepsR", "biceps"], ["abs", "abdominals"],
                            ["obliqueR", "oblique"], ["forearmR", "forearm"], ["quadsR", "quadriceps"], ["calfR", "calf"]],
                    back: [["trap", "trapezius"], ["latL", "latissimus"], ["tricepsL", "triceps"], ["gluteL", "gluteus"], ["hamsL", "hamstrings"], ["calfL", "calf"]] };
    reg("muscleGroups", [
      ["mannequin", ctx => {
        K.title(ctx, "The big masses: simple forms that pull between two bones");
        for (const [f, c] of set()) fig(ctx, c, f, "mannequin");
        K.note(ctx, 0.93, "Level 2 lays each mass over the mannequin as ONE simple form. Level 3 names them. Ten groups cover what shows.");
        K.note(ctx, 0.97, "Every mass runs from one bone to another. The one that SHORTENS bulges; the one on the other side goes flat.");
      }],
      ["masses", ctx => { for (const [f, c] of set()) draw(ctx, c, [...ghost(f.solids), ...Rigs.muscles(f)]); }],
      ["names", ctx => {
        set().forEach(([f, c, isFront]) => {
          const M = Rigs.muscles(f), list = isFront ? names.front : names.back;
          const rows = list.map(([key, text]) => {
            const m = M.find(q => q.name === key);
            const p = m.type === "ell" ? m.c : m.type === "mesh" ? m.verts.reduce((a, b) => add(a, b), [0, 0, 0]).map(v => v / m.verts.length) : m.center;
            return [text, ...frac(c, p)];
          }).sort((a, b) => a[2] - b[2]);
          rows.forEach(([text, px, py], i) => {
            const tx = isFront ? 0.15 : 0.85, ty = 0.22 + i * (isFront ? 0.075 : 0.1);
            K.style(ctx, { lw: LW() * 0.55 }); K.line(ctx, px, py, tx, ty); K.style(ctx);
            K.dot(ctx, px, py, 0.016);
            K.label(ctx, tx + (isFront ? -0.006 : 0.006), ty, text, { fs: 0.105, align: isFront ? "right" : "left" });
          });
        });
      }],
    ]);
  }

  /* ---------- flex and extend ---------- */
  {
    const curl = { armR: [[-0.3, -0.92, 0.22], [0.25, 0.9, 0.36]], armL: [[0.16, -1, -0.05], [0.04, -1, 0.14]] };
    const set = () => [
      [F(curl), { bicepsR: 1.38, tricepsR: 0.84 }, cam(0.2, 0.86, 0.074, { yaw: -36, pitch: 5 }), "elbow BENT: biceps bunches, triceps flattens"],
      [F("stand"), { tricepsR: 1.25, bicepsR: 0.86 }, cam(0.5, 0.86, 0.074, { yaw: -36, pitch: 5 }), "elbow STRAIGHT: the reverse"],
      [F("crouch"), { quadsL: 0.86, quadsR: 0.86, gluteL: 1.25, gluteR: 1.25, hamsL: 1.2, hamsR: 1.2, calfL: 1.2, calfR: 1.2 },
       cam(0.77, 0.86, 0.074, { yaw: -70, pitch: 5 }), "crouch: glutes and calves load"]];
    reg("flexExtend", [
      ["mannequins", ctx => {
        K.title(ctx, "Movement: the mass that shortens bulges, its opposite goes flat");
        for (const [f, , c, name] of set()) { fig(ctx, c, f, "mannequin"); cap(ctx, xOf(c) - 0.13, 0.895, name, { fs: 0.092, bold: true }); }
        K.note(ctx, 0.94, "Level 2 adds the masses. Compare the upper arm in the first two figures: same bone, same muscles, opposite shapes.");
        K.note(ctx, 0.975, "Muscles work in PAIRS across a joint. Decide which of the pair is working before you draw either.");
      }],
      ["masses", ctx => { for (const [f, flex, c] of set()) draw(ctx, c, [...ghost(f.solids), ...Rigs.muscles(f, flex)]); }],
    ]);
  }

  /* ---------- shape language ---------- */
  {
    const B = G3.box, C = G3.cyl, I = G3.I();
    const round = () => [G3.ball([0, 6.3, 0], 1.0), G3.ell([0, 3.7, 0], [1.75, 1.9, 1.4], I),
      ...[1, -1].flatMap(k => [C([k * 1.5, 4.5, 0], [k * 2.3, 3.1, 0.2], 0.44, 0.38), G3.ball([k * 2.35, 2.85, 0.22], 0.46),
        C([k * 0.72, 1.95, 0], [k * 0.82, 0.5, 0], 0.52, 0.46), G3.ell([k * 0.86, 0.3, 0.3], [0.58, 0.3, 0.82], I)])];
    const square = () => [B([0, 6.4, 0], [1.6, 1.5, 1.5]), B([0, 4.1, 0], [3.0, 2.8, 1.7]),
      ...[1, -1].flatMap(k => [B([k * 2.0, 4.2, 0], [0.8, 2.4, 0.9]), B([k * 2.0, 2.7, 0], [0.9, 0.7, 1.0]),
        B([k * 0.8, 1.45, 0], [1.0, 2.3, 1.1]), B([k * 0.8, 0.2, 0.3], [1.1, 0.4, 1.7])])];
    const tri = () => [C([0, 6.0, 0], [0, 7.25, 0], 0.14, 0.78), C([0, 3.0, 0], [0, 5.7, 0], 0.34, 1.55),
      ...[1, -1].flatMap(k => [C([k * 1.5, 5.5, 0], [k * 2.3, 3.2, 0.2], 0.2, 0.07), C([k * 0.28, 3.0, 0], [k * 0.62, 0.1, 0], 0.3, 0.07),
        C([k * 0.62, 0.1, 0], [k * 0.7, 0.05, 0.9], 0.1, 0.02)])];
    const set = () => [[round(), 0.19, "ROUND", "soft · friendly · safe"], [square(), 0.5, "SQUARE", "stable · strong · stubborn"],
                       [tri(), 0.81, "TRIANGLE", "sharp · fast · dangerous"]]
      .map(([items, x, name, feel]) => [items, cam(x, 0.74, 0.04, { yaw: 20, pitch: 8, dist: 40 }), name, feel, x]);
    reg("shapeLanguage", [
      ["the three shapes", ctx => {
        K.title(ctx, "Shape language: round, square, triangle — a reader feels them first");
        for (const [, , name, feel, x] of set()) {
          K.label(ctx, x - 0.1, 0.16, name, { fs: 0.15, bold: true }); K.label(ctx, x - 0.1, 0.19, feel, { fs: 0.1 });
        }
        K.circle(ctx, 0.19, 0.3, 0.07); K.rect(ctx, 0.43, 0.3 - K.V(0.07), 0.14, 0.14);
        K.poly(ctx, [[0.81, 0.3 - K.V(0.085)], [0.89, 0.3 + K.V(0.065)], [0.73, 0.3 + K.V(0.065)]]);
        K.note(ctx, 0.84, "Level 2 builds a whole character out of ONE family each. Level 3 fills them in: the silhouette test.");
        K.note(ctx, 0.88, "Real designs mix families with one in charge — a square hero with round eyes; a triangular villain with a round belly.");
        K.note(ctx, 0.92, "These three are NOT characters for you to use. They are the test: fill any design solid black and ask which shape leads.");
      }],
      ["one family each", ctx => { for (const [items, c] of set()) draw(ctx, c, items); }],
      ["the silhouette test", ctx => { for (const [items, c] of set()) G3.outline(ctx, c, items, { fill: 0.5, fillOnly: true }); }],
    ]);
  }

  /* ---------- the seven folds, as forms ---------- */
  {
    const C = G3.cyl, P = G3.path;
    const helix = (r, turns, y0, y1) => Array.from({ length: 60 }, (_, i) => { const t = i / 59, a = t * turns * 6.2832; return [Math.cos(a) * r, y0 + (y1 - y0) * t, Math.sin(a) * r]; });
    const folds = {
      "pipe": () => [C([-1.3, 2.25, 0], [1.3, 2.25, 0], 0.07), ...[-1, -0.5, 0, 0.5, 1].map(x => C([x, 2.2, 0], [x * 1.25, 0, 0], 0.1, 0.3))],
      "zigzag": () => [C([-1.1, 2.1, 0], [0, 1.0, 0], 0.44, 0.44), G3.ball([0, 1.0, 0], 0.44), C([0, 1.0, 0], [1.3, 1.5, 0], 0.44, 0.42),
                       P([[-0.3, 1.5, 0.46], [0.2, 1.42, 0.46], [-0.12, 1.26, 0.46], [0.32, 1.3, 0.46], [0.05, 1.12, 0.46]], { top: true, lw: 1.2 })],
      "spiral": () => [C([0, 0, 0], [0, 2.3, 0], 0.5, 0.5), ...[0, 0.33, 0.66].map(o => P(helix(0.515, 1.6, o * 0.7, 1.3 + o * 0.7), { facing: [0, 1.15, 0], top: true, lw: 1.1 }))],
      "half-lock": () => [C([0, 2.3, 0], [0, 1.15, 0], 0.42, 0.42), G3.ball([0, 1.15, 0], 0.42), C([0, 1.15, 0], [1.25, 0.45, 0], 0.42, 0.4),
                          G3.mesh([[0.0, 1.5, 0.44], [0.5, 1.2, 0.44], [0.22, 0.86, 0.44], [-0.12, 1.12, 0.44]], [{ v: [0, 1, 2, 3], two: true, sg: 1 }], { top: true })],
      "diaper": () => [G3.pt([-1.25, 2.1, 0], { r: 3.4 }), G3.pt([1.25, 2.1, 0], { r: 3.4 }),
                       ...[0.45, 0.95, 1.5].map(sag => P(Array.from({ length: 21 }, (_, i) => { const x = -1.25 + i * 0.125; return [x, 2.1 - sag * (1 - (x / 1.25) ** 2), 0]; }))),
                       P([[-1.25, 2.1, 0], [-1.45, 0.3, 0]]), P([[1.25, 2.1, 0], [1.45, 0.3, 0]])],
      "drop": () => [G3.pt([0, 2.3, 0], { r: 3.4 }), C([0, 2.3, 0], [0, 0, 0], 0, 0.95),
                     ...[-0.7, -0.35, 0, 0.35, 0.7].map(a => P([[0, 2.3, 0], [Math.sin(a) * 0.95, 0, Math.cos(a) * 0.95]], { top: true, lw: 0.8 }))],
      "inert": () => [G3.ell([-0.5, 0.3, 0], [0.9, 0.3, 0.6], G3.rz(8)), G3.ell([0.55, 0.36, 0.1], [0.8, 0.36, 0.55], G3.rz(-10)), G3.ell([0, 0.75, 0], [0.7, 0.28, 0.5], G3.rz(4)),
                      P([[-1.4, 0.05, 0.4], [-0.6, 0.2, 0.7], [0.2, 0.05, 0.75], [1.3, 0.1, 0.5]], { top: true })],
    };
    const info = { "pipe": "hangs from an edge: parallel tubes", "zigzag": "inside of a bend: it buckles", "spiral": "wraps a tube that twists",
                   "half-lock": "a sharp bend locks over itself", "diaper": "slung between TWO pins", "drop": "falls from ONE pin", "inert": "lying down: nothing pulls it" };
    const names = Object.keys(folds);
    const at = i => i < 4 ? [0.14 + i * 0.245, 0.4] : [0.26 + (i - 4) * 0.245, 0.74];
    reg("foldTypes", [
      ["the seven families", ctx => {
        K.title(ctx, "The seven fold families: every wrinkle is one of these");
        names.forEach((n, i) => {
          const [x, y] = at(i);
          draw(ctx, cam(x, y, 0.074, { yaw: 22, pitch: 10, dist: 30 }), folds[n]());
          K.label(ctx, x - 0.1, y + 0.04, n.toUpperCase(), { fs: 0.12, bold: true }); K.label(ctx, x - 0.1, y + 0.066, info[n], { fs: 0.085 });
        });
        K.note(ctx, 0.9, "A fold is a FORM — a tube, a cone, a plane — with a lit side and a shadow side. Draw it as one, not as a line.");
        K.note(ctx, 0.94, "Every fold has a cause: a pin it hangs from, a bend it is squeezed in, or a twist. Only the inert pile is random.");
        K.note(ctx, 0.98, "The black dots are PINS. Find the pins on a clothed figure first and the folds place themselves.");
      }],
    ]);
  }

  /* ---------- cloth on the figure ---------- */
  const is = (...parts) => s => parts.includes(s.part);
  const shirtSel = s => ["chest", "waist", "belly", "upperArm"].includes(s.part) || s.jt === "sh";
  const sleeveSel = s => shirtSel(s) || s.part === "foreArm" || s.jt === "el";
  const trouserSel = s => ["pelvis", "thigh", "shin"].includes(s.part) || s.jt === "hip" || s.jt === "kn";
  const wear = (ctx, c, f, sel, grow, lw = 1.25) => G3.outline(ctx, c, f.solids.filter(sel), { lw: LW() * lw, grow: grow * c.scale });
  /* fold lines live in the figure's own space, so they turn with the camera */
  const shirtFolds = f => {
    const { J, b } = f, { Rc, Rp } = f.R, z = b.chestD * 0.5 + 0.1, out = [];
    for (const k of [1, -1]) {
      const pin = rel(J.chest, Rc, [k * b.shoulder * 0.8, b.chestH * 0.42, z * 0.7]);
      for (const [x, y] of [[0.5, -0.5], [0.2, -0.75], [-0.1, -0.9]])
        out.push(G3.path(Rigs.smooth([pin, rel(J.chest, Rc, [k * (b.shoulder * 0.5 + x * 0.2), b.chestH * 0.05, z]), rel(J.chest, Rc, [k * x, y * b.chestH * 0.6, z])], 6), { lw: 0.9 }));
    }
    out.push(G3.path(Rigs.smooth([rel(J.chest, Rc, [-b.shoulder * 0.7, b.chestH * 0.4, z * 0.8]), rel(J.chest, Rc, [0, b.chestH * 0.14, z]), rel(J.chest, Rc, [b.shoulder * 0.7, b.chestH * 0.4, z * 0.8])], 8), { lw: 0.9 }));
    const w = b.pelvisW * 0.5;
    out.push(G3.path([[-w, 0.1], [-w * 0.55, -0.02], [-w * 0.2, 0.12], [w * 0.15, -0.02], [w * 0.5, 0.1], [w, 0]].map(([x, y]) => rel(J.waist, Rp, [x, y + 0.1, b.pelvisD * 0.58])), { lw: 0.9 }));
    return out;
  };
  const trouserFolds = f => {
    const { J, b } = f, { Rp } = f.R, out = [], crotch = rel(J.pelvis, Rp, [0, -b.pelvisH * 0.5, b.pelvisD * 0.45]);
    for (const s of ["L", "R"]) {
      const kn = J["kn" + s], hip = J["hip" + s], an = J["an" + s], fz = mul(Rp[2], 0.3);
      out.push(G3.path([crotch, add(lerp(hip, kn, 0.45), fz), add(lerp(hip, kn, 0.9), fz)], { lw: 0.9 }));
      out.push(G3.path([add(lerp(hip, kn, 0.2), fz), add(lerp(hip, kn, 0.6), mul(Rp[2], 0.36))], { lw: 0.9 }));
      const sd = mul(Rp[0], 0.2);
      out.push(G3.path([add(add(an, [0, 0.42, 0]), sd), add(an, [0, 0.3, 0.16]), add(add(an, [0, 0.2, 0]), mul(sd, -1)), add(an, [0, 0.08, 0.2])], { lw: 0.9 }));
    }
    return out;
  };
  const pins = f => [f.J.shL, f.J.shR, f.J.elL, f.J.elR, f.J.knL, f.J.knR, rel(f.J.waist, f.R.Rp, [0, 0.05, f.b.pelvisD * 0.5]),
                     rel(f.J.pelvis, f.R.Rp, [0, -f.b.pelvisH * 0.5, f.b.pelvisD * 0.4])].map(p => G3.pt(p, { r: 3.6 }));

  {
    const bent = { pelvis: [0, 0, 4], chest: [8, 4, -4], armL: [[0.55, 0.62, 0.2], [0.2, 0.9, 0.3]], armR: [[-0.2, -1, 0], [-0.05, -1, 0.2]],
                   legL: [[0.05, -1, 0], [0, -1, 0]], legR: [[-0.2, -0.75, 0.62], [0.02, -0.9, -0.5]], footR: [0, -0.5, 0.86], support: "L" };
    const set = () => [[F("stand"), cam(0.25, 0.86, 0.09, { yaw: 20, pitch: 5 }), "standing"],
                       [F(bent), cam(0.72, 0.86, 0.09, { yaw: 20, pitch: 5 }), "arm up, knee bent — the pins move"]];
    reg("tensionPoints", [
      ["mannequin and pins", ctx => {
        K.title(ctx, "Tension points: cloth hangs from pins — find the pins first");
        for (const [f, c, name] of set()) { fig(ctx, c, f, "mannequin"); draw(ctx, c, pins(f)); cap(ctx, xOf(c) - 0.1, 0.895, name, { bold: true }); }
        K.note(ctx, 0.935, "The dots are pins: shoulders, elbows, the belt, the crotch, the knees. Cloth is SMOOTH where it stretches between them.");
        K.note(ctx, 0.97, "Level 2: the garment as a silhouette over the body. Level 3: folds — drawn only from pins, or in a bend.");
      }],
      ["shirt and trousers", ctx => { for (const [f, c] of set()) { wear(ctx, c, f, shirtSel, 0.1); wear(ctx, c, f, trouserSel, 0.1); } }],
      ["folds", ctx => { for (const [f, c] of set()) draw(ctx, c, [...ghost(f.solids), ...shirtFolds(f), ...trouserFolds(f)]); }],
    ]);
  }
  {
    const upper = s => !["thigh", "shin", "foot"].includes(s.part) && s.jt !== "kn";
    const set = () => [[F("stand"), cam(0.26, 0.97, 0.112, { yaw: 22, pitch: 5, dist: 22 }), 0.045, "TIGHT — the cloth IS the body"],
                       [F("stand"), cam(0.73, 0.97, 0.112, { yaw: 22, pitch: 5, dist: 22 }), 0.24, "LOOSE — the cloth is its own, bigger form"]];
    reg("tightLoose", [
      ["the body underneath", ctx => {
        K.title(ctx, "Smooth where stretched: the same torso in a tight shirt and a loose one");
        for (const [f, c, , name] of set()) { draw(ctx, c, f.solids.filter(upper)); cap(ctx, xOf(c) - 0.17, 0.2, name, { bold: true }); }
        K.note(ctx, 0.13, "Level 2 draws each garment's outline. Level 3 its folds. Count them: under ten on the tight shirt, or you drew a symbol.");
      }],
      ["the garment", ctx => { for (const [f, c, grow] of set()) wear(ctx, c, f, sleeveSel, grow); }],
      ["folds", ctx => {
        const [[f1, c1], [f2, c2]] = set();
        draw(ctx, c1, [...ghost(f1.solids), ...shirtFolds(f1).slice(0, 2), ...shirtFolds(f1).slice(3, 5)]);
        draw(ctx, c2, [...ghost(f2.solids), ...shirtFolds(f2)]);
      }],
    ]);
  }
  {
    const one = () => [F("walkPass"), cam(0.3, 0.86, 0.096, { yaw: -32, pitch: 5 })];
    const two = () => [F("contrapposto"), cam(0.75, 0.86, 0.096, { yaw: 24, pitch: 5 })];
    const coatSel = s => sleeveSel(s) || s.part === "pelvis";
    const skirt = f => [G3.tbox(rel(f.J.pelvis, f.R.Rp, [0, -1.25, 0]), { w0: 1.9, w1: 1.5, h: 2.0, d0: 1.25, d1: 1.0 }, f.R.Rp, { part: "skirt" })];
    reg("garments", [
      ["posed mannequins", ctx => {
        K.title(ctx, "Dressing a figure: silhouette of the garment first, folds last");
        for (const [f, c] of [one(), two()]) fig(ctx, c, f, "mannequin");
        cap(ctx, 0.12, 0.895, "shirt and trousers", { bold: true }); cap(ctx, 0.62, 0.895, "a long coat over them", { bold: true });
        K.note(ctx, 0.935, "Level 2: each garment is its own layer of form OVER the mannequin — the body plus slack. Seams follow contour lines.");
        K.note(ctx, 0.97, "Level 3: folds. Thin cloth makes many small ones; a heavy coat makes a few big ones and hangs straight from the shoulders.");
      }],
      ["garment silhouettes", ctx => {
        const [f, c] = one(); wear(ctx, c, f, shirtSel, 0.1); wear(ctx, c, f, trouserSel, 0.1);
        const [g, d] = two();
        G3.outline(ctx, d, g.solids.filter(coatSel).concat(skirt(g)), { lw: LW() * 1.25, grow: 0.2 * d.scale });
      }],
      ["folds", ctx => {
        const [f, c] = one(); draw(ctx, c, [...ghost(f.solids), ...shirtFolds(f), ...trouserFolds(f)]);
        const [g, d] = two(), { Rp } = g.R, w = 0.75;
        draw(ctx, d, [...ghost(g.solids.concat(skirt(g))),
          ...[-0.6, -0.2, 0.25, 0.62].map(x => G3.path([rel(g.J.waist, Rp, [x * w, 0.1, 0.62]), rel(g.J.pelvis, Rp, [x * 1.2, -2.2, 0.66])], { lw: 0.9 })),
          G3.path([rel(g.J.chest, g.R.Rc, [0.12, 0.6, 0.6]), rel(g.J.waist, Rp, [0.04, 0.1, 0.66]), rel(g.J.pelvis, Rp, [0.06, -2.2, 0.68])], { lw: 1.4 })]);
      }],
    ]);
  }
  {
    /* a cape is two drop-fold systems from the shoulder pins; `sweep` is where the hem has gone */
    const cape = (f, sweep) => {
      const { J } = f, { Rc } = f.R, n = 7, top = [], hem = [];
      for (let i = 0; i < n; i++) {
        const t = i / (n - 1), x = (t - 0.5) * 2;
        top.push(rel(J.neck, Rc, [x * 1.05, -0.12 - Math.abs(x) * 0.12, -0.42 - (1 - Math.abs(x)) * 0.14]));
        hem.push(add(rel(J.neck, Rc, [x * 1.7, -4.9 + Math.abs(x) * 0.25, -0.75 - (i % 2) * 0.34]), sweep));
      }
      const panels = [], lines = [];
      for (let i = 0; i < n - 1; i++) panels.push(G3.mesh([top[i], top[i + 1], hem[i + 1], hem[i]], [{ v: [0, 1, 2, 3], two: true, sg: 1 }], { part: "cape", noStroke: true }));
      for (let i = 0; i < n; i++) lines.push(G3.path([top[i], hem[i]], { lw: 0.9 }));
      return { panels, lines, rim: [G3.path(hem, { lw: 1.3 }), G3.path(top, { lw: 1.3 }), G3.path([top[0], hem[0]], { lw: 1.3 }), G3.path([top[n - 1], hem[n - 1]], { lw: 1.3 })] };
    };
    const hood = f => [G3.ell(add(f.J.head, mul(f.R.Rh[2], -0.08)), [0.52, 0.64, 0.6], f.R.Rh, { part: "hood", rings: ["xy"] })];
    const set = () => [[F("stand"), [0, 0, 0], cam(0.19, 0.84, 0.066, { yaw: 148, pitch: 6 }), "standing: two cascades"],
                       [F("walkContact"), [0, 0.5, -1.5], cam(0.52, 0.84, 0.066, { yaw: 118, pitch: 6 }), "walking: it trails"],
                       [F("hero"), [1.9, 1.3, -0.9], cam(0.83, 0.84, 0.066, { yaw: 160, pitch: 6 }), "in wind: the hem lifts"]];
    reg("hoodCape", [
      ["mannequins from behind", ctx => {
        K.title(ctx, "Capes and hoods: two pins at the shoulders, and everything hangs from them");
        for (const [f, , c, name] of set()) { fig(ctx, c, f, "mannequin"); draw(ctx, c, [G3.pt(f.J.shL, { r: 3.6 }), G3.pt(f.J.shR, { r: 3.6 })]); cap(ctx, xOf(c) - 0.12, 0.875, name, { bold: true }); }
        K.note(ctx, 0.92, "Level 2: the cape as a sheet, and the hood as a bowl around the ball of the head. Level 3: the pipe folds running down it.");
        K.note(ctx, 0.96, "Standing still it is two drop-fold cascades meeting behind. Moving, the folds become long pipes pointing where it came from.");
      }],
      ["cape and hood", ctx => { for (const [f, sweep, c] of set()) { const k = cape(f, sweep); draw(ctx, c, [...ghost(f.solids), ...k.panels, ...k.rim, ...hood(f)]); } }],
      ["pipe folds", ctx => { for (const [f, sweep, c] of set()) draw(ctx, c, [...ghost(f.solids), ...cape(f, sweep).panels, ...cape(f, sweep).lines]); }],
    ]);
  }
})();
