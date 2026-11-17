/* ============================================================
   learn/guides-head-hand.js — leveled guides for heads, faces,
   hands, feet and light on form. Built on Rigs.head / planarHead /
   hand / foot, so every view of a form is the SAME form turned.
   ============================================================ */
"use strict";

(() => {
  const { K, LW, cam, draw, frac, tag, leader, cap, reg } = GuideKit;
  /* solids that hide what is behind them but draw nothing themselves — so a
     later level keeps correct overlaps with forms drawn on an earlier one */
  const occl = items => items.map(it => ({ ...it, noStroke: true, rings: null, decals: null, tone: 0, fill: 0 }));
  const xOf = c => c.cx / K.page().w;

  /* ============================================================
     The Loomis head
     ============================================================ */
  const headLevels = (set, extras = {}) => [
    ["the ball and its axes", ctx => {
      extras.title && extras.title(ctx);
      for (const [h, c] of set()) draw(ctx, c, h.part.ball);
    }],
    ["side planes and jaw", ctx => {
      for (const [h, c] of set()) draw(ctx, c, [...occl(h.part.ball), ...h.part.sides, ...h.part.neck, ...h.part.jaw]);
      extras.jaw && extras.jaw(ctx);
    }],
    ["thirds and features", ctx => {
      for (const [h, c] of set()) draw(ctx, c, [...occl(h.part.ball), ...occl(h.part.jaw), ...h.part.thirds, ...h.part.features]);
      extras.features && extras.features(ctx);
    }],
  ];

  {
    const set = () => [[Rigs.head(), cam(0.37, 0.4, 0.165, { dist: 16 })]];
    reg("loomisFront", headLevels(set, {
      title: ctx => {
        K.title(ctx, "The Loomis head, front: ball → side planes → jaw → thirds");
        K.note(ctx, 0.84, "Level 1: the cranium is a BALL, with a brow line around its middle and a centre line down the front.");
        K.note(ctx, 0.885, "Level 2: slice a flat plane off each side, then hang the jaw from them. Level 3: features, on measured lines.");
        K.note(ctx, 0.93, "Hairline → brow → nose → chin are EQUAL thirds. The eyes sit halfway down the whole head — lower than you think.");
      },
      features: ctx => {
        const [h, c] = set()[0];
        [["hairline", [0, 0.69, 0.724]], ["brow line", [0, 0, 1]], ["eye line — halfway", [0, h.eyeY, 0.86]],
         ["base of the nose", [0, h.noseY, 0.84]], ["mouth", [0, h.mouthY, 0.83]], ["chin", [0, h.chin, 0.82]]]
          .forEach(([t, p]) => leader(ctx, c, h.T(p), 0.66, frac(c, h.T(p))[1], t));
        const y = v => frac(c, h.T([0, v, 0.85]))[1];
        K.style(ctx, { lw: LW() * 0.7 });
        [[0.69, 0], [0, h.noseY], [h.noseY, h.chin]].forEach(([a, b], i) => {
          K.line(ctx, 0.93, y(a), 0.93, y(b)); K.line(ctx, 0.92, y(a), 0.94, y(a)); K.line(ctx, 0.92, y(b), 0.94, y(b));
          K.label(ctx, 0.945, (y(a) + y(b)) / 2, "⅓", { fs: 0.13, bold: true });
        });
        K.style(ctx);
      },
    }));
  }
  {
    const builds = [[1, 1, 30], [1.16, 0.94, -28], [0.84, 1.08, 34], [1.06, 1.16, -34], [0.94, 0.9, 20]];
    const set = () => builds.map(([jaw, wide, yaw], i) =>
      [Rigs.head({ jaw, wide }), cam(i < 3 ? 0.19 + i * 0.31 : 0.34 + (i - 3) * 0.32, i < 3 ? 0.28 : 0.6, 0.086, { yaw, pitch: 6, dist: 16 })]);
    reg("headRow", headLevels(set, {
      title: ctx => {
        K.title(ctx, "Five heads: the same construction, five different people");
        K.note(ctx, 0.84, "Only two things change between these heads: how LONG the jaw is, and how WIDE the face is.");
        K.note(ctx, 0.885, "Ball, slice, axes, jaw, thirds, features — the same six moves each time. Draw all five in under four minutes each.");
        K.note(ctx, 0.93, "Then draw a sixth from memory, with no guide, and lay the ball and thirds over it to see where instinct lied.");
      },
    }));
  }
  {
    const views = [[0, "front"], [38, "three-quarter"], [90, "profile"]];
    const set = () => views.map(([yaw], i) => [Rigs.head(), cam(0.18 + i * 0.32, 0.4, 0.105, { yaw, pitch: 2, dist: 16 })]);
    reg("loomisAngles", headLevels(set, {
      title: ctx => {
        K.title(ctx, "The same head, turned: the centre line curves, the far side compresses");
        views.forEach(([, name], i) => cap(ctx, 0.13 + i * 0.32, 0.67, name, { bold: true }));
        K.note(ctx, 0.76, "Three-quarter: the near side plane swings toward the middle and opens up; the far one disappears round the ball.");
        K.note(ctx, 0.805, "Everything beyond the centre line narrows — far eye shorter, far cheek a sliver. The nose breaks the far contour.");
        K.note(ctx, 0.85, "Profile: the side plane is a full circle. The ear sits in its lower back quarter, between brow line and nose line.");
        K.note(ctx, 0.895, "This is a model sheet. Same ball, same thirds, same jaw in all three — one person.");
      },
    }));
  }
  {
    const views = [[0, 0, 0, "level"], [0, 30, 0, "looking down"], [0, -30, 0, "looking up"],
                   [36, 26, 0, "three-quarter, down"], [36, -26, 0, "three-quarter, up"], [-30, 4, 14, "turned and tilted"]];
    const set = () => views.map(([yaw, pitch, roll], i) =>
      [Rigs.head({ R: G3.euler(0, 0, roll) }), cam(0.19 + (i % 3) * 0.31, 0.3 + Math.floor(i / 3) * 0.33, 0.092, { yaw, pitch, dist: 16 })]);
    reg("headTilt", headLevels(set, {
      title: ctx => {
        K.title(ctx, "Tilt: the brow line and the thirds curve like lines of latitude");
        views.forEach(([, , , name], i) => cap(ctx, 0.12 + (i % 3) * 0.31, 0.51 + Math.floor(i / 3) * 0.33, name, { bold: true }));
        K.note(ctx, 0.9, "Looking DOWN: more cranium, the lines bow down, features crowd the chin, ears ride high.");
        K.note(ctx, 0.94, "Looking UP: you see under the nose and jaw, the lines bow up, ears drop below the eye line.");
        K.note(ctx, 0.98, "Nothing here is a new face. It is one ball with two axes, rotated — draw the ball and axes first.");
      },
    }));
  }

  /* ---------- three heads to ink (Comics Craft) ---------- */
  {
    const set = () => [0, 1, 2].map(i => [Rigs.head(), cam(0.19 + i * 0.31, 0.4, 0.1, { yaw: 34, pitch: 4, dist: 16 })]);
    reg("inkHeads", headLevels(set, {
      title: ctx => {
        K.title(ctx, "One drawing, three voices: ink the same head three ways");
        ["fineliner — uniform line", "dip nib — thin, thick, thin", "brush — tapered, spotted black"]
          .forEach((t, i) => cap(ctx, 0.08 + i * 0.31, 0.68, t, { bold: true }));
        K.note(ctx, 0.78, "Pencil over the construction once per head (levels 1–3 give you the same head three times), then hide the guides.");
        K.note(ctx, 0.825, "FINELINER: depth comes from line SPACING only. NIB: swell where the form turns from the light.");
        K.note(ctx, 0.87, "BRUSH: heaviest outline, a few interior flicks, the shadow side spotted solid. Fewer lines than the other two.");
      },
    }));
  }

  /* ============================================================
     The eye as a ball in a socket
     ============================================================ */
  {
    const onBall = (phi, eps, r = 1) => {
      const a = phi * Math.PI / 180, b = eps * Math.PI / 180;
      return [Math.sin(a) * Math.cos(b) * r, Math.sin(b) * r, Math.cos(a) * Math.cos(b) * r];
    };
    const sweep = (fn, r) => Array.from({ length: 31 }, (_, i) => { const phi = -62 + i * (124 / 30); return onBall(phi, fn(phi), r); });
    const bow = phi => Math.pow(Math.max(0, Math.cos(phi / 62 * Math.PI / 2)), 0.8);
    const capRing = (ang, n = 32) => Array.from({ length: n }, (_, i) => {
      const t = (i / n) * Math.PI * 2, s = Math.sin(ang * Math.PI / 180), c0 = Math.cos(ang * Math.PI / 180);
      return [Math.cos(t) * s, Math.sin(t) * s, c0];
    });
    const O = [0, 0, 0];
    const eye = {
      ball: () => [G3.ball(O, 1, { rings: ["xz"] })],
      iris: () => [G3.path(capRing(27), { close: true, facing: O }), G3.path(capRing(10).map(p => G3.mul(p, 1.005)), { close: true, facing: O, lw: 1.6 })],
      lids: () => [
        G3.path(sweep(p => 30 * bow(p), 1.05), { facing: O, lw: 1.7 }),      // upper lid edge
        G3.path(sweep(p => 31.5 * bow(p) + 6, 1.1), { facing: O, lw: 0.8 }), // its thickness
        G3.path(sweep(p => 48 * bow(p) + 4, 1.07), { facing: O, lw: 0.7 }),  // the crease above it
        G3.path(sweep(p => -17 * bow(p), 1.04), { facing: O, lw: 1.2 }),     // lower lid
        G3.path(sweep(p => -24 * bow(p) - 3, 1.06), { facing: O, lw: 0.6 }),
      ],
      socket: () => [
        G3.path([[-1.5, 0.95, 0.35], [-0.3, 1.2, 0.75], [1.2, 1.1, 0.55], [1.7, 0.45, 0.05], [1.5, -0.7, 0.2],
                 [0.3, -1.15, 0.6], [-1.1, -0.9, 0.6], [-1.6, 0, 0.45]], { close: true, lw: 0.8 }),
        G3.tbox([0.05, 1.55, 0.72], { w0: 3.5, w1: 3.2, h: 0.5, d0: 0.75, d1: 0.5 }, G3.euler(0, 12, -3)),
      ],
    };
    const views = [[0, "front"], [40, "three-quarter"], [78, "profile"]];
    const cams = () => views.map(([yaw], i) => cam(0.18 + i * 0.32, 0.38, 0.094, { yaw: -yaw, pitch: 2, dist: 12 }));
    reg("eyeForm", [
      ["the eyeball", ctx => {
        K.title(ctx, "The eye is a BALL in a socket — the lids wrap it");
        cams().forEach((c, i) => { draw(ctx, c, [...eye.ball(), ...eye.iris()]); cap(ctx, xOf(c) - 0.05, 0.62, views[i][1], { bold: true }); });
        K.note(ctx, 0.7, "Level 1: a sphere, with the iris as a DISC on its surface — a circle from the front, an ellipse at three-quarter,");
        K.note(ctx, 0.74, "a sliver in profile. The pupil is a smaller disc on the same surface.");
        K.note(ctx, 0.8, "Level 2: the lids. The upper lid is thick and overhangs — it casts a shadow on the ball and covers the top of the iris.");
        K.note(ctx, 0.84, "The lower lid is thin and rarely touches the iris. The 'almond' is only the gap where the two lids part.");
        K.note(ctx, 0.9, "Level 3: the bony socket around the ball and the brow ridge above it. The brow follows the RIDGE, not the eye.");
      }],
      ["the lids", ctx => cams().forEach(c => draw(ctx, c, [...occl(eye.ball()), ...eye.lids()]))],
      ["socket and brow ridge", ctx => cams().forEach(c => draw(ctx, c, [...occl(eye.ball()), ...eye.socket()]))],
    ]);
  }

  /* ============================================================
     Nose, mouth, ear as forms
     ============================================================ */
  {
    const noseBlock = () => {
      const v = [[-0.18, 1.1, 0], [0.18, 1.1, 0], [0.42, -0.05, 0], [-0.42, -0.05, 0],
                 [-0.09, 1.05, 0.18], [0.09, 1.05, 0.18], [0.17, 0.1, 0.92], [-0.17, 0.1, 0.92]];
      return G3.mesh(v, [[4, 7, 6, 5], [0, 3, 7, 4], [1, 5, 6, 2], [3, 2, 6, 7], [0, 4, 5, 1]]);
    };
    const noseSoft = () => [G3.ball([0, 0.13, 0.88], 0.21), G3.ball([-0.33, 0.03, 0.36], 0.18), G3.ball([0.33, 0.03, 0.36], 0.18)];
    const lip = fy => Array.from({ length: 25 }, (_, i) => {
      const th = (-52 + i * (104 / 24)) * Math.PI / 180;
      return [Math.sin(th) * 1.02, fy(th * 180 / Math.PI), Math.cos(th) * 1.02];
    });
    const fall = d => Math.max(0, 1 - (d / 52) ** 2);
    const mouthBarrel = () => [G3.cyl([0, -0.62, 0], [0, 0.62, 0], 1, 1, { rings: [0.5] })];
    const lips = () => [
      G3.path(lip(d => 0.02 - 0.05 * fall(d)), { facing: [0, 0, 0], lw: 1.8 }),
      G3.path(lip(d => 0.24 * fall(d) - 0.07 * Math.exp(-((d / 9) ** 2))), { facing: [0, 0, 0] }),
      G3.path(lip(d => -0.3 * Math.pow(fall(d), 0.8)), { facing: [0, 0, 0] })];
    const E = pts => pts.map(([z, y]) => [0, y, z]);
    const earRim = () => [G3.path(E([[0.1, 0.95], [-0.3, 1.0], [-0.62, 0.75], [-0.72, 0.3], [-0.62, -0.2], [-0.42, -0.55], [-0.25, -0.95],
                                     [0.0, -1.0], [0.12, -0.75], [0.1, -0.45], [0.18, -0.1], [0.12, 0.35]]), { close: true })];
    const earIn = () => [
      G3.path(E([[0.02, 0.75], [-0.25, 0.8], [-0.48, 0.6], [-0.54, 0.25], [-0.44, -0.12]]), { lw: 0.8 }),
      G3.path(E([[-0.3, -0.42], [-0.33, 0.0], [-0.22, 0.3], [-0.05, 0.55]]), { lw: 0.8 }),
      G3.path(E([[-0.22, 0.3], [-0.38, 0.5]]), { lw: 0.8 }),
      G3.path(Array.from({ length: 20 }, (_, i) => { const t = i / 20 * Math.PI * 2; return [0, -0.12 + Math.sin(t) * 0.26, -0.1 + Math.cos(t) * 0.17]; }), { close: true, lw: 0.8 }),
      G3.path(E([[0.12, 0.02], [0.02, -0.08], [0.1, -0.2]]), { lw: 0.8 })];
    const noseCams = () => [[0, 4], [42, 4], [90, 2], [30, -38]].map(([yaw, pitch], i) => cam(0.14 + i * 0.24, 0.3, 0.14, { yaw, pitch, dist: 10, target: [0, 0.5, 0.3] }));
    const mouthCams = () => [[0, 6], [44, 6]].map(([yaw, pitch], i) => cam(0.17 + i * 0.27, 0.6, 0.1, { yaw, pitch, dist: 10 }));
    const earCams = () => [[90, 0], [52, 4], [14, 2]].map(([yaw, pitch], i) => cam(0.66 + i * 0.14, 0.6, 0.1, { yaw, pitch, dist: 12 }));
    reg("featureForms", [
      ["the big forms", ctx => {
        K.title(ctx, "Nose, mouth, ear: forms that turn with the head — not symbols");
        noseCams().forEach(c => draw(ctx, c, [noseBlock()]));
        mouthCams().forEach(c => draw(ctx, c, mouthBarrel()));
        earCams().forEach(c => draw(ctx, c, earRim()));
        cap(ctx, 0.06, 0.14, "NOSE — a wedge from the brow: front, three-quarter, profile, from below", { bold: true });
        cap(ctx, 0.06, 0.48, "MOUTH — the lips lie on a cylinder (the teeth)", { bold: true });
        cap(ctx, 0.6, 0.48, "EAR — a bowl with a rim", { bold: true });
        K.note(ctx, 0.78, "Level 1 is the block: four planes for the nose (top, two sides, underside), a barrel for the mouth, the ear's outline.");
        K.note(ctx, 0.82, "The underside of the nose wedge is what you see when a head looks up. Draw the block before you soften anything.");
        K.note(ctx, 0.86, "Level 2 adds the soft forms: a ball on the tip with a wing each side; lips wrapping the barrel, so the far half is");
        K.note(ctx, 0.9, "shorter at three-quarter; and inside the ear, the Y-shaped ridge and the bowl. The line BETWEEN the lips is the strong one.");
      }],
      ["the soft forms", ctx => {
        noseCams().forEach(c => draw(ctx, c, [...occl([noseBlock()]), ...noseSoft()]));
        mouthCams().forEach(c => draw(ctx, c, [...occl(mouthBarrel()), ...lips()]));
        earCams().forEach(c => draw(ctx, c, earIn()));
      }],
    ]);
  }

  /* ============================================================
     Expressions — a parametric front face (2-D on purpose: an
     expression is a change of SHAPE on a head you already built)
     ============================================================ */
  const NEUTRAL = { bi: 0, bo: 0, pinch: 0, arch: 0.04, eo: 1, ll: 0, mw: 1, mc: 0, mo: 0 };
  const EXPR = {
    neutral: {},
    joy: { bi: 0.03, bo: 0.05, eo: 0.72, ll: 0.75, mw: 1.32, mc: 0.9, mo: 0.28 },
    surprise: { bi: 0.24, bo: 0.2, arch: 0.1, eo: 1.5, mw: 0.78, mo: 1.0 },
    fear: { bi: 0.26, bo: 0.05, pinch: 0.07, arch: 0, eo: 1.45, ll: 0.1, mw: 1.28, mc: -0.22, mo: 0.42 },
    anger: { bi: -0.17, bo: 0.08, pinch: 0.08, arch: -0.02, eo: 0.92, ll: 0.4, mw: 1.05, mc: -0.36, mo: 0.12 },
    sadness: { bi: 0.15, bo: -0.08, pinch: 0.04, arch: 0, eo: 0.7, ll: 0.1, mw: 0.9, mc: -0.7 },
  };
  const expr = (...parts) => Object.assign({}, NEUTRAL, ...parts.map(p => typeof p === "string" ? EXPR[p] : p));
  const pick = (name, keys) => Object.fromEntries(keys.map(k => [k, expr(name)[k]]));
  const BROWS = ["bi", "bo", "pinch", "arch"], EYES = ["eo", "ll"], MOUTH = ["mw", "mc", "mo"];

  function faceBase(ctx, cx, cy, r) {
    const v = K.V;
    K.circle(ctx, cx, cy, r);
    K.poly(ctx, [[cx - 0.9 * r, cy + v(0.42 * r)], [cx - 0.78 * r, cy + v(0.98 * r)], [cx - 0.3 * r, cy + v(1.44 * r)],
                 [cx + 0.3 * r, cy + v(1.44 * r)], [cx + 0.78 * r, cy + v(0.98 * r)], [cx + 0.9 * r, cy + v(0.42 * r)]], false);
    K.style(ctx, { lw: LW() * 0.55 });
    K.line(ctx, cx, cy - v(r), cx, cy + v(1.44 * r));
    K.line(ctx, cx - r, cy, cx + r, cy);
    K.line(ctx, cx - 0.8 * r, cy + v(0.72 * r), cx + 0.8 * r, cy + v(0.72 * r));
    K.style(ctx, { lw: LW() * 0.55, dash: true });
    K.line(ctx, cx - 0.92 * r, cy + v(0.22 * r), cx + 0.92 * r, cy + v(0.22 * r));
    K.style(ctx);
  }
  function faceFeatures(ctx, cx, cy, r, e) {
    const v = K.V, eyeY = cy + v(0.24 * r);
    for (const k of [1, -1]) {
      /* brow: inner end, a mid point that carries the arch, outer end */
      K.style(ctx, { lw: LW() * 2.1 });
      const bx0 = cx + k * (0.17 - e.pinch) * r, by0 = cy - v((0.0 + e.bi) * r);
      const bx1 = cx + k * 0.66 * r, by1 = cy - v((-0.02 + e.bo) * r);
      K.curve(ctx, bx0, by0, cx + k * 0.42 * r, (by0 + by1) / 2 - v((0.05 + e.arch) * r), bx1, by1);
      K.style(ctx);
      /* eye: two lids and an iris, opened by `eo`, squeezed from below by `ll` */
      const ex = cx + k * 0.4 * r, w = 0.2 * r, up = 0.115 * r * e.eo, dn = 0.06 * r * (1 - e.ll * 0.9);
      K.curve(ctx, ex - w, eyeY, ex, eyeY - v(up * 2), ex + w, eyeY);
      K.curve(ctx, ex - w, eyeY, ex, eyeY + v(dn * 2) - v(e.ll * 0.05 * r), ex + w, eyeY);
      const ir = Math.min(0.085 * r, Math.max(0.04 * r, 0.075 * r));
      K.circle(ctx, ex, eyeY - v((up - dn) * 0.25), ir);
      K.dot(ctx, ex, eyeY - v((up - dn) * 0.25), 0.012);
      if (e.ll > 0.5) K.curve(ctx, ex - w * 0.9, eyeY + v(0.13 * r), ex, eyeY + v(0.07 * r), ex + w * 0.9, eyeY + v(0.13 * r));
    }
    /* nose */
    K.poly(ctx, [[cx - 0.1 * r, cy + v(0.68 * r)], [cx, cy + v(0.76 * r)], [cx + 0.1 * r, cy + v(0.68 * r)]], false);
    /* mouth: corners lifted by `mc`, stretched by `mw`, dropped open by `mo` */
    const my = cy + v(1.02 * r), mw = 0.3 * r * e.mw, cyc = my - v(e.mc * 0.13 * r);
    K.style(ctx, { lw: LW() * 1.5 });
    K.curve(ctx, cx - mw, cyc, cx, my + v((e.mc * 0.1 - e.mo * 0.03) * r), cx + mw, cyc);
    K.style(ctx);
    if (e.mo > 0.08) K.curve(ctx, cx - mw, cyc, cx, my + v((e.mc * 0.1 + e.mo * 0.5) * r), cx + mw, cyc);
    else K.curve(ctx, cx - mw * 0.5, my + v(0.11 * r), cx, my + v(0.14 * r), cx + mw * 0.5, my + v(0.11 * r));
  }
  /* which way each part moved from neutral */
  function faceArrows(ctx, cx, cy, r, e) {
    const v = K.V, eyeY = cy + v(0.24 * r);
    const arr = (x, y, dx, dy) => { if (Math.hypot(dx, dy) > 0.04) K.arrow(ctx, x, y, x + dx * r, y + v(dy * r)); };
    for (const k of [1, -1]) {
      arr(cx + k * 0.2 * r, cy - v(0.34 * r), -k * e.pinch * 2.2, -e.bi * 1.1);
      arr(cx + k * 0.66 * r, cy - v(0.3 * r), 0, -e.bo * 1.3);
      arr(cx + k * (0.36 * e.mw + 0.12) * r, cy + v(1.02 * r), k * (e.mw - 1) * 0.5, -e.mc * 0.3);
      if (e.ll > 0.3) arr(cx + k * 0.4 * r, eyeY + v(0.3 * r), 0, -0.16);
      if (e.eo > 1.25) arr(cx + k * 0.4 * r, eyeY - v(0.2 * r), 0, -0.14);
    }
    if (e.mo > 0.3) arr(cx, cy + v(1.3 * r), 0, e.mo * 0.22);
  }
  const faceGrid = (cells, ncol, r, x0, y0, dx, dy) => cells.map(([name, e], i) =>
    [name, e, x0 + (i % ncol) * dx, y0 + Math.floor(i / ncol) * dy, r]);

  {
    const cells = () => faceGrid(["neutral", "joy", "surprise", "fear", "anger", "sadness"].map(n => [n, expr(n)]), 3, 0.118, 0.19, 0.24, 0.31, 0.33);
    reg("expressionGrid", [
      ["the head, six times", ctx => {
        K.title(ctx, "Six expressions: brows + lids + mouth corners, on one constructed head");
        for (const [name, , x, y, r] of cells()) { faceBase(ctx, x, y, r); cap(ctx, x - 0.05, y + K.V(r * 1.7), name, { bold: true }); }
        K.note(ctx, 0.9, "Level 1: the same head six times. Level 2: the features — every expression is a change FROM neutral.");
        K.note(ctx, 0.94, "Level 3: arrows show which way each part moved. Cover the mouths: the brows and lids alone should still read.");
        K.note(ctx, 0.98, "Fear and surprise both raise the brows — fear PINCHES them together. Anger and sadness are opposite brow shapes.");
      }],
      ["the features", ctx => { for (const [, e, x, y, r] of cells()) faceFeatures(ctx, x, y, r, e); }],
      ["what moved", ctx => { for (const [, e, x, y, r] of cells()) faceArrows(ctx, x, y, r, e); }],
    ]);
    const mixes = () => faceGrid([
      ["nervous laugh  =  fear's brows + joy's mouth", expr(pick("fear", BROWS), pick("fear", EYES), pick("joy", MOUTH))],
      ["bitterness  =  anger's brows + sadness's mouth", expr(pick("anger", BROWS), pick("anger", EYES), pick("sadness", MOUTH))],
      ["attention  =  surprise's brows, neutral mouth", expr(pick("surprise", BROWS), { eo: 1.2 })],
      ["a brave face  =  sadness's brows + joy's mouth", expr(pick("sadness", BROWS), pick("sadness", EYES), pick("joy", MOUTH), { mo: 0 })],
    ], 2, 0.125, 0.27, 0.27, 0.46, 0.34);
    reg("expressionMix", [
      ["the heads", ctx => {
        K.title(ctx, "Mixed expressions: take the brows from one, the mouth from another");
        for (const [name, , x, y, r] of mixes()) { faceBase(ctx, x, y, r); cap(ctx, x - 0.2, y + K.V(r * 1.72), name, { bold: true }); }
        K.note(ctx, 0.93, "Real faces rarely show one pure emotion. The eyes and brows tell the truth; the mouth is what the character WANTS to show.");
        K.note(ctx, 0.97, "For the in-between frame of a changing expression, move the brows first, then the eyes, then the mouth.");
      }],
      ["the features", ctx => { for (const [, e, x, y, r] of mixes()) faceFeatures(ctx, x, y, r, e); }],
    ]);
  }

  /* ============================================================
     Light on a head, plane by plane
     ============================================================ */
  {
    const setups = [["front", [0, 0.25, 1]], ["three-quarter (Rembrandt)", [-0.72, 0.72, 0.62]], ["side (split)", [-1, 0.12, 0.08]],
                    ["rim / back", [0.75, 0.35, -1]], ["from below", [0, -1, 0.55]]];
    const at = i => i < 3 ? [0.18 + i * 0.32, 0.3] : [0.33 + (i - 3) * 0.34, 0.66];
    const cams = () => setups.map((_, i) => cam(at(i)[0], at(i)[1], 0.092, { yaw: 14, pitch: 2, dist: 14 }));
    reg("lightScenarios", [
      ["the planes", ctx => {
        K.title(ctx, "Five lights on one head: every plane takes one flat value");
        cams().forEach((c, i) => {
          draw(ctx, c, [Rigs.planarHead()], { lw: LW() * 0.8 });
          const [x, y] = at(i), L = G3.norm(setups[i][1]);
          const sx = x + L[0] * 0.17, sy = y - K.V(L[1] * 0.17);
          K.arrow(ctx, sx, sy, x + L[0] * 0.115, y - K.V(L[1] * 0.115));
          cap(ctx, x - 0.11, y + 0.17, setups[i][0], { bold: true });
        });
        K.note(ctx, 0.9, "Level 1: the head as planes — no curves, so each plane faces the light at ONE angle. Level 2: the value each plane gets.");
        K.note(ctx, 0.94, "Rembrandt: the nose shadow meets the cheek shadow, leaving a lit triangle under the far eye. Split: half and half.");
        K.note(ctx, 0.98, "Light from below is 'wrong' because the sun never does it — which is exactly why horror uses it.");
      }],
      ["the values", ctx => {
        cams().forEach((c, i) => draw(ctx, c, [Rigs.planarHead({ draw: { tone: 1.15, noStroke: true } })], { light: setups[i][1] }));
      }],
    ], { tints: ["#3b6ea8", "#2c3e60"] });
  }

  /* ---------- one light, five zones, on the primitives ---------- */
  {
    const Ld = G3.norm([-0.6, 0.85, 0.45]);
    const forms = () => [
      G3.ball([-2.7, 1, 0], 1, { rings: ["xz"] }),
      G3.box([0.1, 0.85, 0], [1.7, 1.7, 1.7], G3.euler(28, 0, 0)),
      G3.cyl([2.9, 0, 0], [2.9, 2.2, 0], 0.8, 0.8, { rings: [0.5] })];
    /* cast shadow: every point slid along the light until it reaches the floor */
    const shadowOf = pts => G3.path(G3.hull(pts.map(p => [p[0] - Ld[0] * (p[1] / Ld[1]), p[2] - Ld[2] * (p[1] / Ld[1])]))
      .map(([x, z]) => [x, 0.001, z]), { close: true, fill: 0.34, noStroke: true, under: true });
    const ringPts = (c, r, y) => Array.from({ length: 24 }, (_, i) => [c[0] + Math.cos(i / 24 * 6.283) * r, y, c[2] + Math.sin(i / 24 * 6.283) * r]);
    const shadows = () => [
      shadowOf(Array.from({ length: 60 }, (_, i) => { const a = i * 2.399, b = Math.acos(1 - 2 * (i + 0.5) / 60); return [-2.7 + Math.sin(b) * Math.cos(a), 1 + Math.cos(b), Math.sin(b) * Math.sin(a)]; })),
      shadowOf(forms()[1].verts), shadowOf(ringPts([2.9, 0, 0], 0.8, 0).concat(ringPts([2.9, 0, 0], 0.8, 2.2)))];
    const c0 = () => cam(0.5, 0.42, 0.098, { yaw: 0, pitch: 16, dist: 18, target: [0, 0.6, 0] });
    reg("sphereShade", [
      ["forms and light", ctx => {
        K.title(ctx, "One light, five zones — the same on a ball, a box and a cylinder");
        const c = c0();
        draw(ctx, c, forms());
        const tip = frac(c, [-3.4, 2.1, 0.6]), from = frac(c, [-4.5, 3.6, 1.1]);
        K.arrow(ctx, from[0], from[1], tip[0], tip[1]); K.label(ctx, Math.max(0.03, from[0] - 0.02), from[1] - 0.025, "LIGHT", { fs: 0.12, bold: true });
        leader(ctx, c, [-3.25, 1.6, 0.6], 0.06, 0.66, "1 · highlight"); leader(ctx, c, [-2.9, 1.2, 0.95], 0.06, 0.7, "2 · halftone");
        leader(ctx, c, [-2.2, 0.6, 0.7], 0.06, 0.74, "3 · core shadow — the darkest band on the form");
        leader(ctx, c, [-1.95, 0.3, 0.2], 0.06, 0.78, "4 · reflected light (never as bright as any halftone)");
        leader(ctx, c, [-1.4, 0, -0.5], 0.06, 0.82, "5 · cast shadow — darkest where the form touches the floor");
        K.note(ctx, 0.9, "Level 2 lays the values in. The BOX: one flat value per plane, no gradient. The CYLINDER: bands along its length.");
        K.note(ctx, 0.95, "The BALL: a gradient in every direction. The cast shadow falls AWAY from the light and pins each form to the floor.");
      }],
      ["values and cast shadows", ctx => {
        draw(ctx, c0(), shadows().concat(forms().map(f => ({ ...f, tone: 1.1, noStroke: true, rings: null }))), { light: Ld });
      }],
    ], { tints: ["#3b6ea8", "#2c3e60"] });
  }

  /* ============================================================
     Hands
     ============================================================ */
  const handLevels = (set, extras) => [
    ["palm, wrist and thumb", ctx => {
      extras.title(ctx);
      for (const [h, c] of set()) draw(ctx, c, [...h.part.wrist, ...h.part.palm, ...h.part.thumb].concat(extras.props ? extras.props(h) : []));
    }],
    ["fingers", ctx => { for (const [h, c] of set()) draw(ctx, c, [...occl([...h.part.palm, ...h.part.thumb]), ...h.part.fingers]); }],
    ["contour", ctx => { for (const [h, c] of set()) G3.outline(ctx, c, h.all, { lw: LW() * 1.4, grow: 0.035 * c.scale }); }],
  ];
  {
    const views = [[0, 8, "back"], [180, 8, "palm"], [62, 12, "edge-on"], [-34, 34, "tilted"]];
    const set = () => views.map(([yaw, pitch], i) => [Rigs.hand("open"), cam(0.14 + i * 0.245, 0.5, 0.105, { yaw, pitch, dist: 12 })]);
    reg("handBlock", handLevels(set, {
      title: ctx => {
        K.title(ctx, "The hand: a palm box, a thumb wedge, then fingers");
        views.forEach(([, , name], i) => cap(ctx, 0.1 + i * 0.245, 0.69, name, { bold: true }));
        K.note(ctx, 0.78, "Level 1: the palm is a slightly tapered BOX, about as long as it is wide. The thumb grows from a wedge on its SIDE.");
        K.note(ctx, 0.82, "Level 2: four fingers, three boxes each, growing from an ARC — the middle knuckle is highest, the pinky sits low.");
        K.note(ctx, 0.86, "Each finger's segments shorten toward the tip. The middle finger is as long as the palm.");
        K.note(ctx, 0.9, "Level 3: the contour, as the outside edge of the boxes you built. Never start here.");
      },
    }));
  }
  {
    const list = [["fist", 26, 14], ["point", -36, 10], ["grip", 148, 12], ["pinch", 204, 14], ["relaxed", 32, 16], ["stop", 180, 4]];
    const names = ["fist", "pointing", "gripping a handle", "holding a pen", "relaxed", "open palm — 'stop'"];
    const at = i => [0.19 + (i % 3) * 0.31, 0.31 + Math.floor(i / 3) * 0.34];
    const set = () => list.map(([pose, yaw, pitch], i) => {
      const h = Rigs.hand(pose);
      h.props = pose === "grip" ? [G3.cyl(h.T([-1.25, 0.3, -0.5]), h.T([1.25, 0.3, -0.5]), 0.2, 0.2, { rings: [0.5] })]
              : pose === "pinch" ? [G3.cyl(h.T([-0.34, 1.2, -0.62]), h.T([0.2, -0.5, 0.2]), 0.05, 0.05)] : [];
      return [h, cam(at(i)[0], at(i)[1], 0.092, { yaw, pitch, dist: 12 })];
    });
    reg("handPoses", handLevels(set, {
      title: ctx => {
        K.title(ctx, "Hands in use: six poses, one construction");
        names.forEach((n, i) => cap(ctx, at(i)[0] - 0.1, at(i)[1] + 0.165, n, { bold: true }));
        K.note(ctx, 0.92, "The palm box barely changes between poses. Only the angles of the finger boxes do — and the thumb wedge swings across.");
        K.note(ctx, 0.96, "A held object defines the hand: draw the object's form first, then wrap the fingers round it.");
      },
      props: h => h.props,
    }));
  }
  {
    const list = [["point", G3.euler(0, 74, 0), "a finger aimed at you"], ["open", G3.euler(18, 62, 0), "reaching out of the panel"],
                  ["fist", G3.euler(-12, 78, 0), "a fist coming at you"]];
    const set = () => list.map(([pose, R], i) => [Rigs.hand(pose, { R }), cam(0.19 + i * 0.31, 0.44, 0.14, { yaw: 0, pitch: 6, dist: 7 })]);
    reg("foreshortenHands", handLevels(set, {
      title: ctx => {
        K.title(ctx, "Foreshortened hands: the nearest box first, and biggest");
        list.forEach(([, , n], i) => cap(ctx, 0.08 + i * 0.31, 0.68, n, { bold: true }));
        K.note(ctx, 0.77, "A finger aimed at you is three short boxes seen nearly end-on. Each one OVERLAPS the one behind it.");
        K.note(ctx, 0.81, "Draw the nearest segment first. Everything behind it loses its outline wherever it is covered.");
        K.note(ctx, 0.85, "The knuckles sit on an arc — and that arc is now in perspective: the middle knuckle nearest and largest.");
        K.note(ctx, 0.89, "Exaggerate the size drop from fingertip to wrist by a third. Drawn 'correctly', it reads flat.");
      },
    }));
  }
  {
    const list = [["open", G3.euler(-20, 58, 0), 0, "reaching toward the reader"], ["open", G3.euler(20, -62, 0), 0, "reaching AWAY, into the page"],
                  ["stop", G3.euler(0, 6, 0), 180, "the block — palm square-on"], ["claw", G3.euler(10, 64, 0), 0, "the grab"]];
    const at = i => [0.27 + (i % 2) * 0.46, 0.3 + Math.floor(i / 2) * 0.36];
    const set = () => list.map(([pose, R, yaw], i) => [Rigs.hand(pose, { R }), cam(at(i)[0], at(i)[1], 0.118, { yaw, pitch: 6, dist: 7 })]);
    reg("handReach", handLevels(set, {
      title: ctx => {
        K.title(ctx, "Reaching, blocking, grabbing: four hands that break the picture plane");
        list.forEach(([, , , n], i) => cap(ctx, at(i)[0] - 0.14, at(i)[1] + 0.19, n, { bold: true }));
        K.note(ctx, 0.94, "Toward the reader the fingertips are the biggest thing in the drawing; away, the WRIST is. Decide which before a line goes down.");
      },
    }));
  }
  {
    const list = [["relaxed", 24, 12, "relaxed"], ["fist", 30, 14, "fist"], ["pinch", 200, 14, "holding the pen"]];
    const set = () => list.map(([pose, yaw, pitch], i) => [Rigs.hand(pose, { left: true }), cam(0.19 + i * 0.31, 0.46, 0.118, { yaw, pitch, dist: 12 })]);
    reg("handMitten", handLevels(set, {
      title: ctx => {
        K.title(ctx, "Your own hand: a mitten first, then fingers from an arc");
        list.forEach(([, , , n], i) => cap(ctx, 0.14 + i * 0.31, 0.68, n, { bold: true }));
        K.note(ctx, 0.77, "These are LEFT hands — model yours on your non-drawing hand and hold the same three poses.");
        K.note(ctx, 0.81, "Level 1: the mitten. Palm box and thumb wedge only; measure the palm against your middle finger (they match).");
        K.note(ctx, 0.85, "Level 2: finger boxes from the knuckle arc. Level 3: the outline. Then draw YOUR hand, not this one.");
      },
    }));
  }

  /* ============================================================
     The foot
     ============================================================ */
  {
    const views = [[0, 6, "side"], [-90, 8, "front — a wedge pointing at you"], [10, 68, "from above"], [-48, 20, "three-quarter"]];
    const at = i => [0.27 + (i % 2) * 0.46, 0.36 + Math.floor(i / 2) * 0.3];
    const set = () => views.map(([yaw, pitch], i) => [Rigs.foot(), cam(at(i)[0], at(i)[1], 0.115, { yaw, pitch, dist: 12, target: [0.15, 0.4, 0] })]);
    reg("footWedge", [
      ["heel, wedge, toe box", ctx => {
        K.title(ctx, "The foot: a heel block, a wedge for the instep, a box of toes");
        for (const [f, c] of set()) draw(ctx, c, [...f.part.heel, ...f.part.wedge, ...f.part.toes]);
        views.forEach(([, , n], i) => cap(ctx, at(i)[0] - 0.14, at(i)[1] + 0.09, n, { bold: true }));
        K.note(ctx, 0.82, "Level 1: three blocks on the floor. The wedge is high at the ankle and runs down to nothing at the toes.");
        K.note(ctx, 0.86, "Level 2: the ankle is a tube into the top of the wedge, with a bone each side — the INNER one sits higher.");
        K.note(ctx, 0.9, "Level 3: a shoe is the same foot with a sole plate under it and a thicker skin. Draw the foot first, always.");
      }],
      ["ankle and ankle bones", ctx => { for (const [f, c] of set()) draw(ctx, c, [...occl([...f.part.heel, ...f.part.wedge]), ...f.part.ankle]); }],
      ["the sole of a shoe", ctx => { for (const [f, c] of set()) draw(ctx, c, f.part.sole); }],
    ]);
  }
  /* shared with the deep-dive pages */
  Object.assign(GuideKit, { handLevels, face: { faceBase, faceFeatures, faceArrows, faceGrid, expr, pick, EXPR, NEUTRAL, BROWS, EYES, MOUTH } });
})();
