/* ============================================================
   learn/guides-more4.js — deep-dive pages, fourth batch:
   machines, creature method (real animals only), objects in
   motion, and depth on layers.
   ============================================================ */
"use strict";

(() => {
  const { K, LW, cam, draw, frac, cap, leader, reg } = GuideKit;
  const { add, ap } = G3;
  const B = G3.box, C = G3.cyl;
  const ghost = items => items.map(it => ({ ...it, noStroke: true, rings: null, decals: null, tone: 0, fill: 0 }));
  const notes = (ctx, y, list, dy = 0.035) => list.forEach((t, i) => K.note(ctx, y + i * dy, t));
  const thin = (ctx, fn) => { K.style(ctx, { lw: LW() * 0.5, dash: true }); fn(); K.style(ctx); };
  const bold = (ctx, fn, k = 2.2) => { K.style(ctx, { lw: LW() * k }); fn(); K.style(ctx); };
  const trace = (ctx, pts) => { ctx.beginPath(); pts.forEach(([x, y], i) => ctx[i ? "lineTo" : "moveTo"](K.X(x), K.Y(y))); ctx.closePath(); };
  const fill = (ctx, pts, a) => { K.style(ctx); ctx.save(); ctx.globalAlpha = a; trace(ctx, pts); ctx.fill(); ctx.restore(); };
  const frame = (x, y, w, h) => {
    const p = (u, v) => [x + u * w, y + v * h], P = pts => pts.map(([u, v]) => p(u, v));
    return { x, y, w, h, p, P,
      box: ctx => K.poly(ctx, P([[0, 0], [1, 0], [1, 1], [0, 1]])),
      line: (ctx, a, b, c, d) => { const s = p(a, b), e = p(c, d); K.line(ctx, s[0], s[1], e[0], e[1]); },
      arrow: (ctx, a, b, c, d) => { const s = p(a, b), e = p(c, d); K.arrow(ctx, s[0], s[1], e[0], e[1]); },
      poly: (ctx, pts, close = true) => K.poly(ctx, P(pts), close),
      fill: (ctx, pts, a) => fill(ctx, P(pts), a),
      circle: (ctx, u, v, r) => { const c = p(u, v); K.circle(ctx, c[0], c[1], r); },
      name: (ctx, t, sub) => { cap(ctx, x, y + h + 0.022, t, { bold: true }); if (sub) cap(ctx, x, y + h + 0.046, sub, { fs: 0.088 }); } };
  };
  const quad = (u0, v0, u1, v1) => [[u0, v0], [u1, v0], [u1, v1], [u0, v1]];
  const four = () => [0, 1, 2, 3].map(i => frame(0.08 + (i % 2) * 0.44, 0.13 + Math.floor(i / 2) * 0.34, 0.4, 0.24));
  /* a 3-D path, drawn flat on the page through the camera */
  const sweep = (ctx, c, pts) => K.poly(ctx, pts.map(p => frac(c, p)), false);
  const range = (a, b, n = 16) => Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n);
  const ring = (cx, cy, r, a0, a1, n = 24) => range(a0, a1, n).map(a => [cx + Math.cos(a) * r, cy + K.V(Math.sin(a) * r)]);

  /* ============================================================
     Machines
     ============================================================ */
  {
    const hingeArm = a => { const R = G3.rz(a); return B(ap(R, [0.75, 0, 0]), [1.5, 0.26, 0.9], R); };
    const pivArm = a => { const R = G3.ry(a); return B(add(ap(R, [0.8, 0, 0]), [0, 0.45, 0]), [1.6, 0.24, 0.4], R); };
    const ballRod = ([x, z]) => { const R = G3.mm(G3.rz(z), G3.rx(x)); return C([0, 0, 0], ap(R, [0, 1.5, 0]), 0.13, 0.13); };
    const rows = [
      ["HINGE", "turns about one axis", [0, 50, 105],
        () => [B([-0.75, 0, 0], [1.5, 0.26, 0.9]), C([0, 0, -0.55], [0, 0, 0.55], 0.15, 0.15)], hingeArm,
        () => range(0, 105).map(a => ap(G3.rz(a), [1.5, 0, 0]))],
      ["PIVOT", "swivels on an upright axle", [0, 60, 130],
        () => [C([0, 0, 0], [0, 0.32, 0], 0.62, 0.62), C([0, 0.32, 0], [0, 0.62, 0], 0.16, 0.16)], pivArm,
        () => range(0, 130).map(a => add(ap(G3.ry(a), [1.6, 0, 0]), [0, 0.45, 0]))],
      ["SLIDER", "moves along one line", [0, 0.55, 1.1],
        () => [B([-0.6, 0, 0], [1.5, 0.6, 0.6])], d => C([d - 0.4, 0, 0], [d + 1.2, 0, 0], 0.15, 0.15),
        () => [[1.2, 0.5, 0], [2.3, 0.5, 0]]],
      ["BALL", "tilts any way inside a cone", [[0, 0], [0, 38], [40, -30]],
        () => [G3.ball([0, 0, 0], 0.42), C([0, -0.7, 0], [0, -0.3, 0], 0.5, 0.5)], ballRod,
        () => range(0, 360, 24).map(a => { const t = a * Math.PI / 180; return [Math.sin(t) * 0.92, 1.18, Math.cos(t) * 0.92]; })]];
    const cy = r => 0.2 + r * 0.155, cx = k => 0.36 + k * 0.23;
    const cj = (r, k) => cam(cx(k), cy(r), 0.052, { yaw: r === 1 ? 20 : 28, pitch: r === 1 ? 34 : 16, dist: 16, target: [0.3, 0.3, 0] });
    reg("jointRange", [
      ["the fixed half", ctx => {
        K.title(ctx, "Four joints through their range: start, middle, end");
        rows.forEach(([n, how, , fixed], r) => {
          cap(ctx, 0.05, cy(r) - 0.012, n, { bold: true }); cap(ctx, 0.05, cy(r) + 0.012, how, { fs: 0.088 });
          [0, 1, 2].forEach(k => draw(ctx, cj(r, k), fixed()));
        });
        ["START", "MIDDLE", "END OF TRAVEL"].forEach((t, k) => cap(ctx, cx(k) - 0.05, 0.115, t, { bold: true, fs: 0.095 }));
        notes(ctx, 0.8, ["Level 1: the half that stays still — the plate and pin, the base, the sleeve, the socket. It is the same in all three columns.",
                         "Level 2: the half that moves, in three positions. Draw the fixed half first; the moving half is measured from its axis.",
                         "Level 3: the path the far end travels. A hinge and a pivot sweep an arc; a slider draws a straight line; a ball rod sweeps a cone.",
                         "Every joint STOPS somewhere. Find what it hits at the end of its travel and draw that stop — it is what makes a joint look real.",
                         "A machine is a chain of these. Its reach is the sum of the paths, which is why you draw the paths before the parts."]);
      }],
      ["the moving half", ctx => rows.forEach(([, , pos, fixed, moving], r) => [0, 1, 2].forEach(k => draw(ctx, cj(r, k), [...ghost(fixed()), moving(pos[k])])))],
      ["the path it sweeps", ctx => rows.forEach(([, , , , , path], r) => [0, 1, 2].forEach(k => thin(ctx, () => sweep(ctx, cj(r, k), path()))))],
    ]);
  }
  {
    const L1 = 2.3, L2 = 2.0, L3 = 0.75;
    const dir = a => [Math.sin(a * Math.PI / 180), Math.cos(a * Math.PI / 180), 0];
    const chain = ([a1, a2, a3]) => { const p0 = [0, 0.55, 0], p1 = add(p0, G3.mul(dir(a1), L1)), p2 = add(p1, G3.mul(dir(a1 + a2), L2)), p3 = add(p2, G3.mul(dir(a1 + a2 + a3), L3)); return [p0, p1, p2, p3]; };
    const poses = [[[-18, 62, 60], "folded back"], [[24, 48, 46], "reaching forward"], [[55, 50, 28], "stretched low"]];
    const pin = p => C(add(p, [0, 0, -0.3]), add(p, [0, 0, 0.3]), 0.24, 0.24);
    const base = () => [C([0, 0, 0], [0, 0.22, 0], 1.0, 1.0), C([0, 0.22, 0], [0, 0.55, 0], 0.34, 0.34)];
    const at = i => 0.2 + i * 0.3;
    const ca = i => cam(at(i), 0.4, 0.05, { yaw: 22, pitch: 12, dist: 20, target: [1.2, 2, 0] });
    reg("armLinkage", [
      ["axes and centre lines", ctx => {
        K.title(ctx, "A jointed arm: one pivot, three hinges, three poses");
        poses.forEach(([a, n], i) => {
          const c = ca(i), p = chain(a);
          draw(ctx, c, [...base(), ...[0, 1, 2].map(k => G3.seg(p[k], p[k + 1], { lw: 0.9, hide: false }))]);
          p.slice(0, 3).forEach(q => { const [x, y] = frac(c, q); K.dot(ctx, x, y, 0.026); });
          cap(ctx, at(i) - 0.1, 0.6, n, { bold: true });
        });
        notes(ctx, 0.68, ["Level 1: the base, a dot at each hinge and a centre line for each segment. The segment lengths NEVER change between poses.",
                          "Level 2: a tube on each centre line and a pin housing across each hinge. The pins all point the same way — they are parallel axles.",
                          "Level 3: the arcs. The elbow can only travel on a circle around the shoulder; the wrist on a circle around the elbow.",
                          "To pose a jointed machine, move the dots first and check each one is still on its arc. Then draw the parts.",
                          "The base swivels (a pivot), so the whole arm can also face any direction. That is the fourth joint.",
                          "Step off the segment lengths with a strip of paper when you draw your own poses."], 0.034);
      }],
      ["tubes and pin housings", ctx => poses.forEach(([a], i) => {
        const p = chain(a);
        draw(ctx, ca(i), [...ghost(base()), ...[0, 1].map(k => C(p[k], p[k + 1], 0.15, 0.13)), ...p.slice(0, 3).map(pin), C(p[2], p[3], 0.16, 0.5)]);
      })],
      ["the arcs each joint travels", ctx => poses.forEach(([a], i) => {
        const c = ca(i), p = chain(a);
        thin(ctx, () => {
          sweep(ctx, c, range(-40, 75).map(t => add(p[0], G3.mul(dir(t), L1))));
          sweep(ctx, c, range(a[0] + 5, a[0] + 110).map(t => add(p[1], G3.mul(dir(t), L2))));
        });
      })],
    ]);
  }
  {
    const names = [["GEARS", "two wheels that touch turn OPPOSITE ways"], ["BELT", "two wheels joined by a belt turn the SAME way"],
                   ["CRANK AND SLIDER", "turning becomes back-and-forth"], ["LEVER", "a small push, a long way from the pivot"]];
    const teeth = (ctx, c, r, n) => { for (let i = 0; i < n; i++) { const a = i / n * 6.2832; K.line(ctx, c[0] + Math.cos(a) * r, c[1] + K.V(Math.sin(a) * r), c[0] + Math.cos(a) * (r + 0.008), c[1] + K.V(Math.sin(a) * (r + 0.008))); } };
    const parts = f => ({ g1: f.p(0.34, 0.5), g2: f.p(0.69, 0.5), crank: f.p(0.25, 0.5), piv: f.p(0.62, 0.62) });
    reg("motionTransfer", [
      ["axles and pivots", ctx => {
        K.title(ctx, "Passing motion on: four ways one part drives another");
        four().forEach((f, i) => {
          f.box(ctx); f.name(ctx, ...names[i]);
          const q = parts(f), pts = i < 2 ? [q.g1, q.g2] : i === 2 ? [q.crank] : [q.piv];
          pts.forEach(([x, y]) => { K.dot(ctx, x, y, 0.028); thin(ctx, () => { K.line(ctx, x - 0.02, y, x + 0.02, y); K.line(ctx, x, y - K.V(0.02), x, y + K.V(0.02)); }); });
        });
        notes(ctx, 0.86, ["Level 1: only the fixed points — axles and pivots. Everything else in a mechanism moves around these.",
                          "Level 2: the parts. Level 3: arrows for which way each part moves, and how far.",
                          "A big wheel driving a small one makes it spin faster and weaker; the other way round, slower and stronger.",
                          "When you invent a machine, trace the motion from the power source to the working end. Every step needs one of these."]);
      }],
      ["the parts", ctx => {
        const [a, b, c, d] = four();
        let q = parts(a); K.circle(ctx, ...q.g1, 0.085); teeth(ctx, q.g1, 0.085, 22); K.circle(ctx, ...q.g2, 0.047); teeth(ctx, q.g2, 0.047, 12);
        q = parts(b); K.circle(ctx, ...q.g1, 0.07); K.circle(ctx, ...q.g2, 0.04);
        K.line(ctx, q.g1[0], q.g1[1] - K.V(0.07), q.g2[0], q.g2[1] - K.V(0.04)); K.line(ctx, q.g1[0], q.g1[1] + K.V(0.07), q.g2[0], q.g2[1] + K.V(0.04));
        q = parts(c); K.circle(ctx, ...q.crank, 0.07);
        const pinA = [q.crank[0] + 0.045, q.crank[1] - K.V(0.04)], blk = c.p(0.74, 0.5);
        K.dot(ctx, ...pinA, 0.022); bold(ctx, () => K.line(ctx, ...pinA, blk[0], blk[1]), 1.6);
        c.poly(ctx, quad(0.68, 0.4, 0.8, 0.6)); c.line(ctx, 0.52, 0.38, 0.96, 0.38); c.line(ctx, 0.52, 0.62, 0.96, 0.62);
        q = parts(d); bold(ctx, () => d.line(ctx, 0.12, 0.5, 0.86, 0.68), 1.8);
        d.poly(ctx, [[0.62, 0.64], [0.56, 0.86], [0.68, 0.86]]); d.poly(ctx, quad(0.76, 0.5, 0.9, 0.66));
      }],
      ["which way, how far", ctx => {
        const [a, b, c, d] = four();
        let q = parts(a); K.arrow(ctx, q.g1[0] - 0.05, q.g1[1] - K.V(0.11), q.g1[0] + 0.05, q.g1[1] - K.V(0.11)); K.arrow(ctx, q.g2[0] + 0.04, q.g2[1] - K.V(0.075), q.g2[0] - 0.04, q.g2[1] - K.V(0.075));
        q = parts(b); K.arrow(ctx, q.g1[0] - 0.05, q.g1[1] - K.V(0.1), q.g1[0] + 0.05, q.g1[1] - K.V(0.1)); K.arrow(ctx, q.g2[0] - 0.04, q.g2[1] - K.V(0.07), q.g2[0] + 0.04, q.g2[1] - K.V(0.07));
        q = parts(c); K.arrow(ctx, q.crank[0] - 0.05, q.crank[1] - K.V(0.1), q.crank[0] + 0.05, q.crank[1] - K.V(0.1));
        c.arrow(ctx, 0.74, 0.76, 0.92, 0.76); c.arrow(ctx, 0.74, 0.76, 0.56, 0.76);
        d.arrow(ctx, 0.14, 0.14, 0.14, 0.44); d.arrow(ctx, 0.95, 0.56, 0.95, 0.44);
        thin(ctx, () => d.line(ctx, 0.12, 0.74, 0.86, 0.56));
      }],
    ]);
  }

  /* ============================================================
     Creature method — measured on real animals only
     ============================================================ */
  const Q = k => Rigs.quadruped(k);
  const plain = a => a.solids.map(s => ({ ...s, rings: null, decals: null }));
  {
    const set = () => [[Q("horse"), cam(0.47, 0.37, 0.043, { yaw: 12, pitch: 5, dist: 40, target: [0.6, 4.2, 0] })],
                       [Q("dog"), cam(0.47, 0.7, 0.05, { yaw: 12, pitch: 5, dist: 40, target: [0.8, 2.9, 0] })]];
    reg("girdles", [
      ["spine and leg lines", ctx => {
        K.title(ctx, "Attachment: every limb hangs from a girdle, through the same chain of joints");
        cap(ctx, 0.05, 0.13, "HORSE", { bold: true }); cap(ctx, 0.05, 0.535, "DOG", { bold: true });
        for (const [a, c] of set()) draw(ctx, c, a.gesture);
        notes(ctx, 0.86, ["Level 1: the spine and one line per leg. Level 2: the two girdles circled, and every joint down each leg as a dot.",
                          "Level 3: the volumes. The front leg hangs from the SHOULDER girdle on the ribcage; the hind leg from the HIP girdle on the pelvis.",
                          "The joints come in the same order in both animals. Only the lengths between them differ.",
                          "In a design of your own, any limb you add or move still needs a girdle to hang from, and this same order of joints."]);
      }],
      ["girdles and joints", ctx => {
        for (const [a, c] of set()) {
          const F = a.J.legs.FR, H = a.J.legs.HR, left = c.cy / K.page().h < 0.5;
          bold(ctx, () => { for (const p of [F[1], H[0]]) { const [x, y] = frac(c, p); K.circle(ctx, x, y, 0.035); } }, 1.5);
          for (const L of [F, H]) { sweep(ctx, c, L); L.forEach(p => { const [x, y] = frac(c, p); K.dot(ctx, x, y, 0.022); }); }
          if (left) {
            a.names.front.slice(1).forEach((n, i) => leader(ctx, c, F[i + 1], 0.8, 0.27 + i * 0.045, n, { fs: 0.088 }));
            a.names.hind.forEach((n, i) => leader(ctx, c, H[i], 0.18, 0.27 + i * 0.045, n, { fs: 0.088, align: "right" }));
          }
        }
      }],
      ["volumes", ctx => { for (const [a, c] of set()) draw(ctx, c, plain(a)); }],
    ]);
  }
  {
    const set = () => [[Q("horse"), cam(0.5, 0.35, 0.045, { yaw: 0, pitch: 3, dist: 60, target: [0.6, 4.2, 0] }), "HORSE"],
                       [Q("dog"), cam(0.27, 0.68, 0.042, { yaw: 0, pitch: 3, dist: 60, target: [0.8, 2.9, 0] }), "DOG"],
                       [Q("bear"), cam(0.73, 0.68, 0.042, { yaw: 0, pitch: 3, dist: 60, target: [0.8, 2.6, 0] }), "BEAR"]];
    const com = a => { const J = a.J, x = J.ribC[0] * 0.5 + J.pelC[0] * 0.3 + J.skullC[0] * 0.2, y = J.ribC[1] * 0.55 + J.pelC[1] * 0.3 + J.skullC[1] * 0.15; return [x, y, 0]; };
    reg("creatureBalance", [
      ["spine and leg lines", ctx => {
        K.title(ctx, "Balance: the weight must stand over the feet");
        for (const [a, c, n] of set()) {
          draw(ctx, c, a.gesture);
          const g = frac(c, [0, 0, 0]); cap(ctx, c.cx / K.page().w - 0.2, g[1] + 0.03, n, { bold: true });
          const l = frac(c, [-4.2, 0, 0]), r = frac(c, [5.6, 0, 0]); thin(ctx, () => K.line(ctx, l[0], l[1], r[0], r[1]));
        }
        notes(ctx, 0.85, ["Level 1: spine, legs and the ground. Level 2: the volumes. Level 3: the balance check.",
                          "The thick bar on the ground runs from the hind feet to the front feet: the SUPPORT. The dot is roughly where the weight centres.",
                          "Drop a line from the dot. Inside the bar, the animal stands. Outside it, the animal is falling — or has started to move.",
                          "In all three the dot sits nearer the FRONT feet: head, neck and ribcage outweigh the hindquarters.",
                          "Run this check on anything you design. A heavy head or tail moves the dot, and the feet must move to stay under it."]);
      }],
      ["volumes", ctx => { for (const [a, c] of set()) draw(ctx, c, plain(a)); }],
      ["support and plumb line", ctx => {
        for (const [a, c] of set()) {
          const fx = a.J.legs.FR.at(-1)[0], hx = a.J.legs.HR.at(-1)[0], m = com(a);
          const s0 = frac(c, [hx, 0, 0]), s1 = frac(c, [fx, 0, 0]), p = frac(c, m), g = frac(c, [m[0], 0, 0]);
          bold(ctx, () => K.line(ctx, s0[0], s0[1], s1[0], s1[1]), 3);
          K.dot(ctx, p[0], p[1], 0.04); thin(ctx, () => K.line(ctx, p[0], p[1], g[0], g[1] + 0.02)); K.arrow(ctx, g[0], g[1] - 0.03, g[0], g[1]);
        }
      }],
    ]);
  }
  {
    const kinds = [["cat", "CAT", 0.054], ["dog", "DOG", 0.042], ["horse", "HORSE", 0.032], ["bear", "BEAR", 0.039]];
    const at = i => [0.24 + (i % 2) * 0.46, 0.4 + Math.floor(i / 2) * 0.3];
    const set = () => kinds.map(([k, n, s], i) => { const a = Q(k); return [a, cam(at(i)[0], at(i)[1], s, { yaw: 0, pitch: 3, dist: 60, target: [0.5, a.J.withers[1] / 2, 0] }), n, i]; });
    reg("scaleBuild", [
      ["spine and leg lines", ctx => {
        K.title(ctx, "Size changes the build: four animals drawn to the same width");
        for (const [a, c, n, i] of set()) { draw(ctx, c, a.gesture); cap(ctx, at(i)[0] - 0.19, at(i)[1] - 0.2, n, { bold: true }); }
        notes(ctx, 0.83, ["All four are drawn the same width on the page, so you compare PROPORTION, not size. In life the horse is far larger.",
                          "Level 2: the volumes. Level 3: two brackets — the depth of the body, and the length of leg below it.",
                          "Small and light (cat): thin, bent, springy legs. Large and fast (horse): long, straight legs held under the body.",
                          "Large and heavy (bear): short, thick, upright legs and flat feet. Weight grows faster than leg strength, so big animals need more leg.",
                          "Decide your creature's true size first. Then give it the leg proportions of a real animal of THAT size."]);
      }],
      ["volumes", ctx => { for (const [a, c] of set()) draw(ctx, c, plain(a)); }],
      ["body depth against leg length", ctx => {
        for (const [a, c] of set()) {
          const F = a.J.legs.FR, x = a.J.nose[0] + 0.5, top = frac(c, [x, a.J.withers[1], 0]), el = frac(c, [x, F[2][1], 0]), g = frac(c, [x, 0, 0]);
          bold(ctx, () => { K.line(ctx, top[0], top[1], el[0], el[1]); }, 2.4);
          K.line(ctx, el[0] + 0.012, el[1], g[0] + 0.012, g[1]);
          for (const p of [top, el, g]) K.line(ctx, p[0] - 0.012, p[1], p[0] + 0.024, p[1]);
          K.label(ctx, top[0] + 0.02, (top[1] + el[1]) / 2, "body", { fs: 0.085 }); K.label(ctx, el[0] + 0.03, (el[1] + g[1]) / 2, "leg", { fs: 0.085 });
        }
      }],
    ]);
  }
  {
    const kinds = [["horse", "long neck, long legs, high tail", 0.04], ["bear", "shoulder hump, low head, flat feet", 0.046],
                   ["cat", "small head, long low body", 0.06], ["dog", "deep chest, tucked waist, long muzzle", 0.05]];
    const at = i => [0.27 + (i % 2) * 0.46, 0.31 + Math.floor(i / 2) * 0.27];
    const cs = (a, i, k = 1, x, y) => cam(x ?? at(i)[0], y ?? at(i)[1], kinds[i][2] * k, { yaw: 0, pitch: 3, dist: 60, target: [0.5, a.J.withers[1] / 2, 0] });
    const black = a => a.solids.map(s => ({ ...s, rings: null, decals: null, noStroke: true, fill: 1, tone: 0 }));
    reg("silhouetteTest", [
      ["volumes", ctx => {
        K.title(ctx, "The silhouette test, on four animals you already know");
        kinds.forEach(([k, how], i) => { const a = Q(k); draw(ctx, cs(a, i), plain(a)); cap(ctx, at(i)[0] - 0.19, at(i)[1] + 0.115, k.toUpperCase(), { bold: true }); cap(ctx, at(i)[0] - 0.1, at(i)[1] + 0.115, how, { fs: 0.088 }); });
        cap(ctx, 0.05, 0.745, "AT THUMBNAIL SIZE", { bold: true });
        notes(ctx, 0.86, ["Level 1: the construction. Level 2: the same animals filled solid. Level 3: the fills at thumbnail size.",
                          "You can still name each one from the black shape alone. The words beside each say what the outline is doing to tell you.",
                          "Legs that overlap merge into one lump. Real animals are easiest to read mid-stride, when the legs separate.",
                          "Run your own design through the same three levels. Whatever makes it recognisable has to be on the OUTSIDE edge."]);
      }],
      ["filled solid", ctx => kinds.forEach(([k], i) => { const a = Q(k); draw(ctx, cs(a, i), black(a)); })],
      ["thumbnail size", ctx => kinds.forEach(([k], i) => { const a = Q(k); draw(ctx, cs(a, i, 0.3, 0.18 + i * 0.21, 0.79), black(a)); })],
    ]);
  }

  /* ============================================================
     Objects in motion
     ============================================================ */
  {
    const arc = (x0, x1, base, h) => t => [x0 + (x1 - x0) * t, base - 4 * h * t * (1 - t)];
    const A = arc(0.1, 0.9, 0.44, 0.24), Bx = arc(0.1, 0.9, 0.78, 0.2), N = 10;
    const sq = (c, r, a) => [0, 1, 2, 3].map(k => { const t = a + k * Math.PI / 2 + Math.PI / 4; return [c[0] + Math.cos(t) * r, c[1] + K.V(Math.sin(t) * r)]; });
    reg("throwArc", [
      ["the two arcs", ctx => {
        K.title(ctx, "Thrown things travel on an arc, and slow at the top");
        for (const [f, y] of [[A, 0.44], [Bx, 0.78]]) { K.line(ctx, 0.06, y + 0.022, 0.94, y + 0.022); thin(ctx, () => K.poly(ctx, range(0, 1, 40).map(f), false)); }
        cap(ctx, 0.06, 0.14, "A BALL", { bold: true }); cap(ctx, 0.06, 0.53, "A BOX, TUMBLING AS IT GOES", { bold: true });
        notes(ctx, 0.85, ["Level 1: the path alone. Draw the whole arc lightly before you place anything on it.",
                          "Level 2: the ball at ten equal moments. Sideways the gaps are even; UPWARD they shrink toward the top and grow again coming down.",
                          "Level 3: a box on the same kind of arc. Its centre follows the arc exactly while the box turns by the same amount each step.",
                          "Wide gaps read as fast, close gaps as slow. In a single comic panel, choose ONE moment — the top of the arc holds the longest.",
                          "A heavier object thrown the same way follows the same arc. What changes is how it lands, on the next page."]);
      }],
      ["ten equal moments", ctx => range(0, 1, N).forEach(t => { const p = A(t); K.circle(ctx, p[0], p[1], 0.02); })],
      ["the tumbling box", ctx => range(0, 1, N).forEach((t, i) => { const p = Bx(t); K.poly(ctx, sq(p, 0.03, i * 0.5)); K.dot(ctx, p[0], p[1], 0.012); })],
    ]);
  }
  {
    /* hops: [x, time-samples] for a ball that keeps `keep` of its height */
    const hops = (y, h0, w0, keep, n) => { const out = []; let x = 0.08, h = h0, w = w0; for (let k = 0; k < n; k++) { out.push({ x0: x, x1: x + w, y, h }); x += w; h *= keep; w *= Math.sqrt(keep); } return out; };
    const light = () => hops(0.42, 0.22, 0.27, 0.62, 4), heavy = () => hops(0.74, 0.2, 0.3, 0.16, 3);
    const pos = (hp, t) => [hp.x0 + (hp.x1 - hp.x0) * t, hp.y - 4 * hp.h * t * (1 - t)];
    const each = (list, fn) => list.forEach(hp => { const m = Math.max(2, Math.round(8 * Math.sqrt(hp.h / 0.22))); for (let i = 1; i < m; i++) fn(pos(hp, i / m), hp); });
    const R = 0.021;
    reg("bounceWeight", [
      ["ground and paths", ctx => {
        K.title(ctx, "Bounce and weight: the same drop, a light ball and a heavy one");
        cap(ctx, 0.06, 0.14, "LIGHT AND SPRINGY", { bold: true }); cap(ctx, 0.06, 0.5, "HEAVY AND DEAD", { bold: true });
        for (const list of [light(), heavy()]) {
          K.line(ctx, 0.05, list[0].y + K.V(R), 0.95, list[0].y + K.V(R));
          thin(ctx, () => list.forEach(hp => K.poly(ctx, range(0, 1, 24).map(t => pos(hp, t)), false)));
        }
        notes(ctx, 0.83, ["Level 1: the ground and the path. Each bounce is a smaller copy of the one before — lower AND shorter.",
                          "Level 2: the ball at equal moments. It bunches at the top of each bounce and is spread wide near the ground.",
                          "Level 3: contact. The light ball flattens where it hits and stretches as it leaves. The heavy one keeps its shape and dents the ground.",
                          "Weight is shown by what happens at contact, and by how much height survives: most of it for the light ball, almost none for the heavy.",
                          "Squash and stretch never change the amount of ball. Wider means flatter; longer means thinner."]);
      }],
      ["the ball at equal moments", ctx => { for (const list of [light(), heavy()]) each(list, p => K.circle(ctx, p[0], p[1], R)); }],
      ["contact: squash, stretch, dent", ctx => {
        light().forEach((hp, k) => { if (k > 2) return; const y = hp.y + K.V(R * 0.35);
          K.ellipse(ctx, hp.x1, y, R * 1.35, R * 0.68);
          const a = pos(hp, 0.94); K.ellipse(ctx, a[0], a[1], R * 0.8, R * 1.3, -0.5); });
        heavy().forEach((hp, k) => { const y = hp.y + K.V(R);
          bold(ctx, () => K.curve(ctx, hp.x1 - 0.035, y, hp.x1, y + K.V(0.014 / (k + 1)), hp.x1 + 0.035, y), 1.6);
          if (!k) [-1, 1].forEach(s => K.line(ctx, hp.x1 + s * 0.04, y - 0.004, hp.x1 + s * 0.06, y - 0.016)); });
      }],
    ]);
  }
  {
    const wheels = () => [1.5, -1.4].flatMap(x => [-1, 1].map(k => C([x, 0.42, k * 0.72], [x, 0.42, k * 0.98], 0.42, 0.42)));
    const body = R => { const T = p => add(ap(R, G3.sub(p, [0, 0.5, 0])), [0, 0.5, 0]);
      return [B(T([0, 0.92, 0]), [4.4, 0.72, 1.86], R), G3.tbox(T([-0.3, 1.6, 0]), { w0: 2.5, w1: 1.7, h: 0.64, d0: 1.74, d1: 1.5 }, R)]; };
    const cases = [["STEADY", "level: the body sits square on its wheels", G3.I(), 24, null],
                   ["PULLING AWAY", "the nose lifts, the tail squats", G3.rz(-5), 24, [[-0.5, 0.2], [-0.9, 0.2]]],
                   ["BRAKING", "the nose dives, the tail lifts", G3.rz(5), 24, [[0.5, 0.2], [0.9, 0.2]]],
                   ["CORNERING", "the body rolls to the OUTSIDE of the turn", G3.rx(8), 78, null]];
    const at = i => [0.3 + (i % 2) * 0.44, 0.28 + Math.floor(i / 2) * 0.28];
    const cv = i => cam(at(i)[0], at(i)[1], 0.062, { yaw: cases[i][3], pitch: 9, dist: 22, target: [0, 0.9, 0] });
    reg("vehicleMotion", [
      ["wheels and the level line", ctx => {
        K.title(ctx, "A vehicle under way: the wheels stay down, the body tips");
        cases.forEach(([n, how, , yaw], i) => {
          const c = cv(i);
          draw(ctx, c, wheels());
          const a = frac(c, yaw > 60 ? [0, 1.3, -1.6] : [-2.9, 1.3, 0]), b = frac(c, yaw > 60 ? [0, 1.3, 1.6] : [2.9, 1.3, 0]);
          thin(ctx, () => K.line(ctx, a[0], a[1], b[0], b[1]));
          cap(ctx, at(i)[0] - 0.2, at(i)[1] + 0.105, n, { bold: true }); cap(ctx, at(i)[0] - 0.2, at(i)[1] + 0.128, how, { fs: 0.088 });
        });
        notes(ctx, 0.82, ["Level 1: four wheels on the ground and a dashed LEVEL line. The wheels are the same in all four drawings.",
                          "Level 2: the body, tipped against that line. The tilt is small — a few degrees — and here it is drawn a little stronger than life.",
                          "Level 3: arrows for where the weight goes. Weight moves to the BACK when pulling away, the FRONT when braking, the OUTSIDE in a turn.",
                          "The gap between tyre and wheel arch closes on the loaded side and opens on the other. That gap is the cheapest way to show it.",
                          "A parked car and a braking car are the same boxes. The tilt and the gap are the whole difference."]);
      }],
      ["the body, tipped", ctx => cases.forEach(([, , R], i) => draw(ctx, cv(i), [...ghost(wheels()), ...body(R)]))],
      ["where the weight goes", ctx => {
        const ar = (i, p, q) => { const a = frac(cv(i), p), b = frac(cv(i), q); bold(ctx, () => K.arrow(ctx, a[0], a[1], b[0], b[1]), 1.5); };
        ar(1, [-1.4, 2.6, 0], [-1.4, 2.05, 0]); ar(2, [1.5, 2.3, 0], [1.5, 1.6, 0]); ar(3, [0, 2.6, 1.1], [0, 2.0, 1.1]);
      }],
    ]);
  }
  {
    const names = [["SPEED LINES", "straight streaks trailing BEHIND the object"], ["MULTIPLES", "fainter copies where it has just been"],
                   ["SMEAR", "the shape itself stretched along its path"], ["STREAKED BACKGROUND", "the object sharp, the world blurred past it"]];
    const obj = (ctx, f, u, v, r = 0.03) => f.circle(ctx, u, v, r);
    reg("speedLines", [
      ["the object", ctx => {
        K.title(ctx, "Showing speed on a still page: four conventions");
        four().forEach((f, i) => { f.box(ctx); f.name(ctx, ...names[i]); if (i !== 2) obj(ctx, f, 0.72, 0.5); });
        four()[3].poly(ctx, quad(0.1, 0.72, 0.3, 0.9)); four()[3].line(ctx, 0, 0.9, 1, 0.9);
        notes(ctx, 0.86, ["Level 1: the object, moving left to right in every frame. Level 2: the marks that say so.",
                          "Speed lines run PARALLEL to the path, vary in length, and never cross the object. Longer and more of them means faster.",
                          "Keep the leading edge clean and put every mark behind. The eye reads the clean side as 'front'.",
                          "Pick one convention per panel. A smear with speed lines and multiples together reads as noise, not speed."]);
      }],
      ["the marks", ctx => {
        const [a, b, c, d] = four();
        [[0.3, 0.1, 0.62], [0.38, 0.18, 0.6], [0.46, 0.3, 0.66], [0.54, 0.12, 0.62], [0.62, 0.22, 0.6], [0.7, 0.34, 0.64], [0.5, 0.04, 0.5]].forEach(([v, u0, u1]) => a.line(ctx, u0, v, u1, v));
        [[0.56, 0.5], [0.4, 0.3], [0.24, 0.15]].forEach(([u, al]) => { ctx.save(); ctx.globalAlpha = al; b.circle(ctx, u, 0.5, 0.03); ctx.restore(); });
        { const p = c.p(0.72, 0.5), q = c.p(0.3, 0.5), r = 0.03;
          K.arc(ctx, p[0], p[1], r, r, -Math.PI / 2, Math.PI / 2); K.line(ctx, p[0], p[1] - K.V(r), q[0], q[1] - K.V(r * 0.35)); K.line(ctx, p[0], p[1] + K.V(r), q[0], q[1] + K.V(r * 0.35));
          thin(ctx, () => { c.line(ctx, 0.12, 0.47, 0.28, 0.47); c.line(ctx, 0.16, 0.53, 0.28, 0.53); }); }
        [0.14, 0.24, 0.3, 0.4, 0.62, 0.7, 0.8].forEach((v, k) => d.line(ctx, 0.04 + (k % 3) * 0.05, v, 0.96 - (k % 2) * 0.08, v));
        d.line(ctx, 0.06, 0.76, 0.34, 0.76); d.line(ctx, 0.04, 0.84, 0.36, 0.84);
      }],
    ]);
  }

  /* ============================================================
     Depth on layers
     ============================================================ */
  const wide = () => frame(0.08, 0.13, 0.84, 0.36);
  {
    const sheet = (ctx, x, y, t, sub) => { K.poly(ctx, [[x, y], [x + 0.3, y], [x + 0.36, y - 0.07], [x + 0.06, y - 0.07]]); cap(ctx, x + 0.38, y - 0.045, t, { bold: true }); cap(ctx, x + 0.38, y - 0.02, sub, { fs: 0.088 }); };
    reg("layerPlanes", [
      ["background", ctx => {
        K.title(ctx, "Three planes on three layers: far, middle, near");
        const f = wide(); f.box(ctx);
        f.line(ctx, 0, 0.56, 1, 0.56);
        f.poly(ctx, [[0, 0.56], [0.1, 0.4], [0.2, 0.47], [0.36, 0.3], [0.5, 0.46], [0.62, 0.38], [0.8, 0.5], [0.9, 0.42], [1, 0.52]], false);
        [[0.44, 0.48, 0.47], [0.49, 0.44, 0.52], [0.68, 0.47, 0.72]].forEach(([a, v, b]) => f.poly(ctx, [[a, 0.56], [a, v], [b, v], [b, 0.56]], false));
        sheet(ctx, 0.12, 0.64, "BACKGROUND", "small, pale, simple — drawn first"); sheet(ctx, 0.16, 0.71, "MIDDLE GROUND", "where the subject stands");
        sheet(ctx, 0.2, 0.78, "FOREGROUND", "large, dark, cropped by the frame — drawn last");
        cap(ctx, 0.05, 0.55, "THE STACK", { bold: true }); cap(ctx, 0.19, 0.55, "three sheets, one above the other; you look down through all of them", { fs: 0.088 });
        notes(ctx, 0.86, ["Each guide level here is one plane of the picture. Draw each on its OWN layer: Background, Middle ground, Foreground.",
                          "Level 1: the far plane — a horizon, a far ridge, a few distant blocks. Thin lines, no detail.",
                          "Level 2: the middle plane. It overlaps the far plane and carries the subject. Level 3: the near plane, big and dark at the edges.",
                          "The shapes are blocks on purpose. What matters is that every plane overlaps the one behind it somewhere."]);
      }],
      ["middle ground", ctx => {
        const f = wide();
        f.poly(ctx, [[0, 0.7], [0.3, 0.66], [0.62, 0.72], [1, 0.66]], false);
        f.poly(ctx, [[0.56, 0.7], [0.56, 0.24], [0.74, 0.24], [0.74, 0.69]], false); f.poly(ctx, [[0.74, 0.44], [0.86, 0.44], [0.86, 0.68]], false);
        f.poly(ctx, quad(0.36, 0.52, 0.4, 0.68)); f.circle(ctx, 0.38, 0.475, 0.014);
      }],
      ["foreground", ctx => {
        const f = wide();
        bold(ctx, () => {
          f.poly(ctx, [[0.13, 0], [0.13, 0.84], [0.2, 0.84], [0.2, 0]], false);
          f.poly(ctx, [[0, 0.86], [0.26, 0.82], [0.46, 0.92], [0.46, 1]], false);
          f.poly(ctx, [[0.2, 0.12], [0.5, 0.06], [0.74, 0]], false);
          f.poly(ctx, [[1, 0.6], [0.93, 0.62], [0.9, 1]], false);
        }, 1.9);
      }],
    ]);
  }
  {
    const names = [["TANGENT — avoid", "edges that only touch flatten the space"], ["OVERLAP", "the far shape's lines STOP at the near shape"],
                   ["A GAP OF AIR", "stop the far lines just short; thicken the near line"], ["A STEP IN VALUE", "each layer gets its own grey: near dark, far light"]];
    const far = [quad(0.5, 0.3, 0.82, 0.72), [[0.5, 0.3], [0.82, 0.3], [0.82, 0.72], [0.5, 0.72]], [[0.535, 0.3], [0.82, 0.3], [0.82, 0.72], [0.535, 0.72]], [[0.5, 0.3], [0.82, 0.3], [0.82, 0.72], [0.5, 0.72]]];
    const near = quad(0.3, 0.1, 0.5, 0.95);
    reg("layerOverlap", [
      ["the far shape", ctx => {
        K.title(ctx, "Where layers cross: four ways to treat an overlap");
        four().forEach((f, i) => {
          f.box(ctx); f.name(ctx, ...names[i]); f.line(ctx, 0, 0.72, 1, 0.72);
          f.poly(ctx, far[i], i === 0);
          if (i) thin(ctx, () => f.poly(ctx, [[i === 2 ? 0.535 : 0.5, 0.3], [0.38, 0.3], [0.38, 0.72], [i === 2 ? 0.535 : 0.5, 0.72]], false));
          if (i === 3) f.fill(ctx, quad(0.5, 0.3, 0.82, 0.72), 0.16);
        });
        notes(ctx, 0.86, ["Level 1: the far shape, on the lower layer. The dashed part is hidden behind the near shape — know it is there, do not ink it.",
                          "Level 2: the near shape, on the layer above. In the first frame its edge only TOUCHES the far shape, and the depth disappears.",
                          "Overlap is the strongest depth cue there is. A gap of air and a heavier near line make the same overlap clearer still.",
                          "With one grey per layer, the planes separate even at thumbnail size. Fill each layer flat before adding any detail."]);
      }],
      ["the near shape", ctx => four().forEach((f, i) => {
        if (i === 2) bold(ctx, () => f.poly(ctx, near), 2); else f.poly(ctx, near);
        if (i === 3) f.fill(ctx, near, 0.62);
      })],
    ]);
  }
  {
    const post = (f, ctx, u, base, h, detail) => {
      const w = h * 0.07;
      f.poly(ctx, [[u - w, base], [u - w, base - h], [u + w, base - h], [u + w, base]], false);
      f.poly(ctx, quad(u - w * 1.5, base - h - h * 0.07, u + w * 1.5, base - h));
      if (detail) { f.line(ctx, u - w * 0.3, base, u - w * 0.3, base - h); f.line(ctx, u - w, base - h * 0.5, u + w, base - h * 0.5); f.line(ctx, u - w, base - h * 0.52, u + w, base - h * 0.52); }
    };
    const planes = [[0.5, 0.11, [0.12, 0.3, 0.46, 0.6, 0.78, 0.92], 0.12], [0.66, 0.26, [0.24, 0.52, 0.84], 0.36], [0.98, 0.62, [0.1, 0.7], 0.72]];
    const drawPlane = (ctx, k) => { const f = wide(), [base, h, us, g] = planes[k];
      const go = () => us.forEach(u => { post(f, ctx, u, base, h, k === 2); f.fill(ctx, quad(u - h * 0.07, base - h, u + h * 0.07, base), g); });
      if (k === 2) bold(ctx, go, 1.9); else if (k === 0) { K.style(ctx, { lw: LW() * 0.6 }); go(); K.style(ctx); } else go();
      if (k < 2) f.line(ctx, 0, base, 1, base); };
    reg("layerDepth", [
      ["far", ctx => {
        K.title(ctx, "One object on three layers: size, value, detail and line weight");
        wide().box(ctx); drawPlane(ctx, 0);
        [["", "FAR", "MIDDLE", "NEAR"], ["size", "small", "medium", "large, cropped"], ["value", "pale", "middle grey", "dark"],
         ["detail", "none", "a little", "all of it"], ["line", "thin", "normal", "heavy"]].forEach((row, r) =>
          row.forEach((t, k) => cap(ctx, 0.1 + (k ? 0.1 + k * 0.19 : 0), 0.56 + r * 0.04, t, { bold: !r || !k, fs: 0.095 })));
        notes(ctx, 0.8, ["The same post, repeated on three layers. Level 1 is the far row, level 2 the middle, level 3 the near pair.",
                         "Four things change together from layer to layer — the table above. Change all four and the depth is unmistakable.",
                         "The bases rise toward the horizon as the posts get farther away, and the gaps between them close up.",
                         "Near shapes may leave the frame. A shape cut by the edge always reads as close to the viewer.",
                         "Use this on any repeated thing in your own scene: posts, trees, windows, people in a crowd."]);
      }],
      ["middle", ctx => drawPlane(ctx, 1)],
      ["near", ctx => drawPlane(ctx, 2)],
    ]);
  }
  {
    const two = () => [frame(0.07, 0.13, 0.41, 0.27), frame(0.52, 0.13, 0.41, 0.27)];
    const back = (ctx, f) => { f.box(ctx); f.line(ctx, 0, 0.58, 1, 0.58);
      f.poly(ctx, [[0, 0.58], [0.2, 0.42], [0.4, 0.52], [0.66, 0.36], [1, 0.54]], false);
      f.poly(ctx, quad(0.52, 0.5, 0.57, 0.72)); f.circle(ctx, 0.545, 0.45, 0.012); f.poly(ctx, [[0, 0.74], [0.5, 0.72], [1, 0.76]], false); };
    const fore = (ctx, f, dx) => { const s = pts => pts.map(([u, v]) => [Math.max(0, Math.min(1, u + dx)), v]);
      for (const p of [[[0.06, 0], [0.06, 1], [0.24, 1], [0.2, 0]], [[0.74, 0], [0.7, 0.9], [0.98, 0.9], [0.9, 0]]]) { f.poly(ctx, s(p)); f.fill(ctx, s(p), 0.6); } };
    reg("layerPasses", [
      ["background and middle ground", ctx => {
        K.title(ctx, "Recompose by moving a layer: same scene, foreground shifted");
        const [a, b] = two(); back(ctx, a); back(ctx, b);
        a.name(ctx, "FIRST TRY", "the gap between the near shapes misses the figure"); b.name(ctx, "FOREGROUND MOVED", "the same shapes, slid sideways as one layer");
        cap(ctx, 0.07, 0.52, "THE ORDER OF WORK", { bold: true });
        ["1.  Big shapes only, one layer per plane, far to near.", "2.  Hide the others and look at each layer alone. It should still read.",
         "3.  Show them together. Slide a whole layer until the overlaps help the subject.", "4.  One flat grey per layer: pale far, dark near.",
         "5.  Second-size shapes on each layer.", "6.  Detail last, and only around the focal point."].forEach((t, i) => cap(ctx, 0.09, 0.56 + i * 0.036, t, { fs: 0.1 }));
        notes(ctx, 0.82, ["Level 1: the far and middle planes, identical in both frames. Level 2: the foreground, in two positions.",
                          "Level 3: the figure, circled. Hidden in the first frame; standing in the open window in the second.",
                          "Because the foreground is on its own layer, you can move it without redrawing anything behind it.",
                          "In Penshi: circle the foreground strokes with the Lasso and drag them. Tap the eye beside a layer to hide it.",
                          "Step between layers with the . and , keys while you work, and name each layer for its plane."]);
      }],
      ["foreground, two positions", ctx => { const [a, b] = two(); fore(ctx, a, -0.2); fore(ctx, b, 0); }],
      ["the open window", ctx => { const [a, b] = two();
        bold(ctx, () => b.arrow(ctx, 0.3, -0.07, 0.62, -0.07), 1.4);
        thin(ctx, () => { a.circle(ctx, 0.545, 0.58, 0.035); }); b.circle(ctx, 0.545, 0.58, 0.035); }],
    ]);
  }
})();
