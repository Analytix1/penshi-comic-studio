/* ============================================================
   learn/rigs.js — posable construction models for the guides
   Each rig turns a small pose description into G3 solids:
     figure()     the human mannequin (boxes, tubes, ball joints)
     head()       the Loomis ball-and-plane head
     planarHead() a plane-by-plane head for lighting studies
     hand()       palm box, thumb wedge, three-segment fingers
     quadruped()  dog / cat / horse / bear from one skeleton plan
     bird(), tube(), and friends
   A pose is plain data — world-space directions for each bone —
   so a lesson can show the SAME model from any camera, which is
   the whole point of learning construction.
   World: x right, y up, z toward the viewer. A figure faces +z;
   its Right side is therefore at −x.
   ============================================================ */
"use strict";

const Rigs = (() => {
  const { add, sub, mul, dot, cross, norm, lerp, mid, euler, ap, mm, frame, I } = G3;
  const UP = [0, 1, 0];
  const along = (p, dir, d) => add(p, mul(norm(dir), d));

  /* Catmull-Rom through 3-D points (gesture lines, tails, spines) */
  function smooth(pts, per = 10) {
    if (pts.length < 3) return pts.slice();
    const out = [], P = i => pts[Math.max(0, Math.min(pts.length - 1, i))];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      for (let k = 0; k < per; k++) {
        const t = k / per, t2 = t * t, t3 = t2 * t;
        out.push([0, 1, 2].map(a => 0.5 * ((2 * p1[a]) + (-p0[a] + p2[a]) * t +
          (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3)));
      }
    }
    out.push(pts[pts.length - 1]);
    return out;
  }
  /* a tube along a path: short cylinders with ball joints hiding the seams */
  function tube(pts, radii, o = {}) {
    const r = i => Array.isArray(radii) ? radii[Math.min(i, radii.length - 1)] : radii;
    const out = [];
    for (let i = 0; i < pts.length - 1; i++) {
      out.push(G3.cyl(pts[i], pts[i + 1], r(i), r(i + 1), { rings: o.rings ? [0.5] : null, ...o }));
      if (i > 0) out.push(G3.ball(pts[i], r(i) * 0.985, { noStroke: true }));
    }
    return out;
  }

  /* ============================================================
     The human figure. Units are HEADS; an adult stands 7.5 tall.
     ============================================================ */
  const BUILDS = {
    adult:    {},
    heroic:   { thigh: 2.1, shin: 2.0, upperArm: 1.6, foreArm: 1.35, shoulder: 1.05, chestW: 1.8, head: 0.94 },
    teen:     { thigh: 1.6, shin: 1.5, chestH: 1.2, chestW: 1.3, chestW0: 1.05, shoulder: 0.74, pelvisW: 1.1, upperArm: 1.3, foreArm: 1.1, limb: 0.82 },
    child:    { thigh: 1.15, shin: 1.05, chestH: 1.05, chestW: 1.15, chestW0: 1.0, shoulder: 0.62, pelvisW: 1.05, pelvisH: 0.65,
                upperArm: 0.95, foreArm: 0.8, hand: 0.55, waist: 0.25, limb: 0.8, footL: 0.8 },
    toddler:  { thigh: 0.6, shin: 0.55, chestH: 0.85, chestW: 1.05, chestW0: 1.05, chestD: 0.9, shoulder: 0.55, pelvisW: 1.0, pelvisH: 0.55,
                upperArm: 0.62, foreArm: 0.52, hand: 0.4, waist: 0.12, neck: 0.1, limb: 0.95, footL: 0.6, footH: 0.2, belly: 0.5 },
    elder:    { thigh: 1.7, shin: 1.6, chestH: 1.3, limb: 0.85, belly: 0.42 },
    heavy:    { limb: 1.45, chestW: 1.85, chestW0: 1.75, chestD: 1.25, pelvisW: 1.75, pelvisW0: 1.5, pelvisD: 1.2, belly: 0.82, neckR: 1.4 },
    lean:     { limb: 0.74, chestW: 1.42, chestW0: 1.05, chestD: 0.78, pelvisW: 1.15, pelvisW0: 0.95, pelvisD: 0.7 },
    muscular: { limb: 1.3, chestW: 2.0, chestW0: 1.25, chestD: 1.15, shoulder: 1.12, pelvisW: 1.25, neckR: 1.35 },
    stocky:   { thigh: 1.45, shin: 1.35, upperArm: 1.3, foreArm: 1.1, limb: 1.3, chestW: 1.85, chestW0: 1.6, chestD: 1.15,
                pelvisW: 1.55, pelvisD: 1.05, neck: 0.16, neckR: 1.35 },
  };
  const BODY = { head: 1, neck: 0.27, neckR: 1, chestH: 1.4, chestW: 1.6, chestW0: 1.25, chestD: 0.95, waist: 0.38,
                 pelvisH: 0.8, pelvisW: 1.35, pelvisW0: 1.05, pelvisD: 0.85, shoulder: 0.92, hip: 0.42,
                 upperArm: 1.5, foreArm: 1.25, hand: 0.8, thigh: 1.8, shin: 1.7, footH: 0.28, footL: 1.1,
                 limb: 1, belly: 0 };

  const POSES = {
    stand: {},
    contrapposto: { pelvis: [0, 0, 8], chest: [6, 2, -6], head: [-8, 0, 3],
      legL: [[-0.1, -1, 0], [0.02, -1, 0]], legR: [[-0.16, -1, 0.2], [0.03, -1, -0.28]],
      armR: [[-0.2, -1, -0.05], [-0.05, -1, 0.25]], armL: [[0.3, -1, -0.1], [0.05, -1, 0.3]], support: "L" },
    walkContact: { pelvis: [-8, 3, 0], chest: [8, 5, 0],
      legL: [[0, -1, 0.42], [0, -1, 0.26]], legR: [[0, -1, -0.36], [0, -1, -0.62]],
      footL: [0, 0.28, 1], footR: [0, -0.62, 0.78],
      armR: [[-0.08, -1, 0.34], [0, -0.9, 0.5]], armL: [[0.08, -1, -0.3], [0, -1, -0.12]], support: "L" },
    walkPass: { pelvis: [0, 2, 3], chest: [0, 4, -2],
      legL: [[0, -1, 0.03], [0, -1, -0.03]], legR: [[0, -1, 0.28], [0, -0.8, -0.62]], footR: [0, -0.5, 0.86],
      armR: [[-0.08, -1, -0.06], [0, -1, 0.12]], armL: [[0.08, -1, 0.06], [0, -1, 0.14]], support: "L" },
    run: { pelvis: [-10, 14, 0], chest: [12, 24, 0], head: [0, 6, 0],
      legL: [[0, -0.42, 1], [0, -1, -0.18]], legR: [[0, -0.8, -0.66], [0, 0.12, -1]],
      footL: [0, -0.1, 1], footR: [0, -0.9, -0.42],
      armR: [[-0.1, -0.55, 0.85], [0.1, 0.72, 0.68]], armL: [[0.1, -0.5, -0.86], [0, -0.82, 0.58]], support: "L" },
    crouch: { pelvis: [0, 34, 0], chest: [0, 50, 0], head: [0, 18, 0],
      legL: [[0.2, -0.3, 1], [0, -1, -0.6]], legR: [[-0.2, -0.3, 1], [0, -1, -0.6]],
      armR: [[-0.15, -0.5, -0.86], [0, -0.92, -0.36]], armL: [[0.15, -0.5, -0.86], [0, -0.92, -0.36]] },
    launch: { pelvis: [0, 14, 0], chest: [0, 6, 0], head: [0, -10, 0],
      legL: [[0.05, -1, -0.16], [0, -1, -0.26]], legR: [[-0.05, -1, -0.1], [0, -1, -0.3]],
      footL: [0, -0.92, 0.38], footR: [0, -0.92, 0.38],
      armR: [[-0.12, 0.82, 0.56], [0, 1, 0.26]], armL: [[0.12, 0.82, 0.56], [0, 1, 0.26]] },
    apex: { pelvis: [0, -6, 0], chest: [0, -14, 0], head: [0, -12, 0], ground: false, root: [0, 5.6, 0],
      legL: [[0.08, -0.5, 0.88], [0, -1, -0.32]], legR: [[-0.06, -1, -0.42], [0, -0.28, -1]],
      footL: [0, -0.7, 0.7], footR: [0, -0.6, -0.8],
      armR: [[-0.62, 0.78, 0], [-0.3, 1, 0.12]], armL: [[0.62, 0.78, 0], [0.3, 1, 0.12]] },
    reach: { pelvis: [14, 4, 0], chest: [22, 10, 0], head: [8, 4, 0],
      legL: [[0.1, -1, 0.3], [0, -1, 0.05]], legR: [[-0.14, -1, -0.26], [0, -1, -0.3]], footR: [-0.2, -0.3, 0.9],
      armR: [[-0.12, -0.06, 1], [0.02, 0.06, 1]], handR: [0, 0.05, 1],
      armL: [[0.3, -0.9, -0.3], [0.1, -0.9, 0.25]], support: "L" },
    sit: { pelvis: [0, -6, 0], chest: [0, 2, 0],
      legL: [[0.14, -0.04, 1], [0, -1, 0.06]], legR: [[-0.14, -0.04, 1], [0, -1, 0.06]],
      armR: [[-0.1, -0.95, 0.3], [0.1, -0.5, 0.86]], armL: [[0.1, -0.95, 0.3], [-0.1, -0.5, 0.86]] },
    hero: { chest: [0, -4, 0], head: [0, -4, 0],
      legL: [[0.24, -1, 0], [0.02, -1, 0]], legR: [[-0.24, -1, 0], [-0.02, -1, 0]],
      armR: [[-0.62, -0.78, -0.12], [0.62, -0.5, 0.38]], armL: [[0.62, -0.78, -0.12], [-0.62, -0.5, 0.38]] },
    lean: { pelvis: [0, 0, -4], chest: [0, 10, 10], head: [0, 0, 6],
      legL: [[0.05, -1, 0], [0, -1, 0]], legR: [[-0.3, -1, 0.1], [-0.05, -1, 0]],
      armR: [[-0.9, -0.4, 0.1], [-1, 0.1, 0.1]], armL: [[0.2, -1, 0], [0, -1, 0.2]], support: "L" },
    punch: { pelvis: [-24, 6, 0], chest: [-40, 12, 0], head: [-10, 6, 0],
      legL: [[0.12, -1, 0.5], [0, -1, -0.12]], legR: [[-0.1, -1, -0.5], [0, -1, -0.34]], footR: [-0.2, -0.5, 0.82],
      armL: [[0.1, -0.1, 1], [0, 0.02, 1]], handL: [0, 0, 1],
      armR: [[-0.5, -0.8, -0.3], [0.3, 0.3, 0.9]], support: "L" },
  };

  function figure(pose = {}, build = {}) {
    const b = { ...BODY, ...build };
    const q = { root: [0, 0, 0], pelvis: [0, 0, 0], chest: [0, 0, 0], head: [0, 0, 0], ground: true, ...pose };
    const Rp = euler(...q.pelvis), Rc = euler(...q.chest), Rh = mm(Rc, euler(...q.head));
    const m = b.limb;

    /* ---- skeleton ---- */
    const J = {};
    J.pelvis = [0, 0, 0];
    J.waist = add(J.pelvis, mul(Rp[1], b.pelvisH / 2));
    J.chestBase = add(J.waist, mul(norm(add(Rp[1], Rc[1])), b.waist));
    J.chest = add(J.chestBase, mul(Rc[1], b.chestH / 2));
    J.neck = add(J.chest, mul(Rc[1], b.chestH / 2));
    J.head = add(add(J.neck, mul(Rc[1], b.neck * 0.5)), mul(Rh[1], b.neck * 0.5 + b.head * 0.5));
    J.crown = add(J.head, mul(Rh[1], b.head * 0.5));
    for (const [s, sx] of [["L", 1], ["R", -1]]) {
      const arm = q["arm" + s] || [[sx * 0.14, -1, 0.02], [sx * 0.05, -1, 0.14]];
      const leg = q["leg" + s] || [[sx * 0.05, -1, 0], [0, -1, -0.02]];
      J["sh" + s] = add(add(J.chest, mul(Rc[0], sx * b.shoulder)), mul(Rc[1], b.chestH * 0.36));
      J["el" + s] = along(J["sh" + s], arm[0], b.upperArm);
      J["wr" + s] = along(J["el" + s], arm[1], b.foreArm);
      J["hd" + s] = norm(q["hand" + s] || arm[1]);
      J["ft" + s] = along(J["wr" + s], J["hd" + s], b.hand);
      J["hip" + s] = add(add(J.pelvis, mul(Rp[0], sx * b.hip)), mul(Rp[1], -b.pelvisH * 0.3));
      J["kn" + s] = along(J["hip" + s], leg[0], b.thigh);
      J["an" + s] = along(J["kn" + s], leg[1], b.shin);
      const fwd = norm(q["foot" + s] || [Rp[2][0] + sx * 0.12, 0, Rp[2][2]]);
      let side = cross(fwd, UP);
      if (G3.len(side) < 1e-4) side = Rp[0];
      side = norm(side);
      J["fd" + s] = fwd; J["fu" + s] = norm(cross(side, fwd)); J["fs" + s] = side;
      J["sole" + s] = add(J["an" + s], mul(J["fu" + s], -b.footH));
      J["toe" + s] = add(J["sole" + s], mul(fwd, b.footL * 0.75));
      J["heel" + s] = add(J["sole" + s], mul(fwd, -b.footL * 0.25));
    }
    /* stand it on the ground (y = 0) unless the pose is airborne */
    let lift = q.root[1];
    if (q.ground) lift = -Math.min(J.toeL[1], J.toeR[1], J.heelL[1], J.heelR[1]);
    const off = [q.root[0], lift, q.root[2]];
    for (const k in J) if (!/^(hd|fd|fu|fs)/.test(k)) J[k] = add(J[k], off);

    /* ---- mannequin solids ---- */
    const S = [];
    const faceZ = (h, d0, d1, y) => (d0 + (d1 - d0) * (y + h / 2) / h) / 2 + 0.002;
    const onChest = (x, y) => add(J.chest, ap(Rc, [x, y, faceZ(b.chestH, b.chestD * 0.9, b.chestD, y)]));
    const onPelvis = (x, y) => add(J.pelvis, ap(Rp, [x, y, faceZ(b.pelvisH, b.pelvisD * 0.94, b.pelvisD, y)]));
    S.push(G3.tbox(J.chest, { w0: b.chestW0, w1: b.chestW, h: b.chestH, d0: b.chestD * 0.9, d1: b.chestD }, Rc, {
      part: "chest", decals: [{ face: 0, lines: [
        [onChest(0, b.chestH / 2), onChest(0, -b.chestH / 2)],
        [onChest(-b.chestW0 * 0.32, -b.chestH / 2), onChest(0, -b.chestH * 0.16), onChest(b.chestW0 * 0.32, -b.chestH / 2)]] }] }));
    S.push(G3.tbox(J.pelvis, { w0: b.pelvisW0, w1: b.pelvisW, h: b.pelvisH, d0: b.pelvisD * 0.94, d1: b.pelvisD }, Rp, {
      part: "pelvis", decals: [{ face: 0, lines: [[onPelvis(0, b.pelvisH / 2), onPelvis(0, -b.pelvisH / 2)]] }] }));
    S.push(G3.cyl(add(J.waist, mul(Rp[1], -0.06)), add(J.chestBase, mul(Rc[1], 0.06)),
                  b.pelvisD * 0.47, b.chestD * 0.44, { part: "waist" }));
    if (b.belly) S.push(G3.ell(add(mid(J.waist, J.chestBase), mul(Rp[2], b.belly * 0.42)),
                               [b.belly * 0.95, b.belly * 0.9, b.belly * 0.8], Rp, { part: "belly", rings: ["xy"] }));
    S.push(G3.cyl(add(J.neck, mul(Rc[1], -0.08)), add(J.head, add(mul(Rh[1], -0.26), mul(Rh[2], -0.08))),
                  0.21 * b.neckR, 0.19 * b.neckR, { part: "neck" }));
    const hs = b.head;
    S.push(G3.ell(add(J.head, mul(Rh[1], 0.1 * hs)), [0.37 * hs, 0.4 * hs, 0.45 * hs], Rh,
                  { part: "head", rings: ["xz", "yz"] }));
    S.push(G3.tbox(add(J.head, add(mul(Rh[1], -0.27 * hs), mul(Rh[2], 0.1 * hs))),
                   { w0: 0.3 * hs, w1: 0.6 * hs, h: 0.47 * hs, d0: 0.4 * hs, d1: 0.64 * hs }, Rh, { part: "jaw" }));
    for (const [s, sx] of [["L", 1], ["R", -1]]) {
      const sh = J["sh" + s], el = J["el" + s], wr = J["wr" + s];
      const hip = J["hip" + s], kn = J["kn" + s], an = J["an" + s];
      S.push(G3.ball(sh, 0.27 * m, { part: "joint" }));
      S.push(G3.cyl(sh, el, 0.23 * m, 0.17 * m, { part: "upperArm", rings: [0.5] }));
      S.push(G3.ball(el, 0.175 * m, { part: "joint" }));
      S.push(G3.cyl(el, wr, 0.185 * m, 0.12 * m, { part: "foreArm", rings: [0.5] }));
      S.push(G3.box(along(wr, J["hd" + s], b.hand / 2), [0.36, b.hand, 0.14],
                    frame(J["hd" + s], Rc[2]), { part: "hand" }));
      S.push(G3.ball(hip, 0.27 * m, { part: "joint" }));
      S.push(G3.cyl(hip, kn, 0.34 * m, 0.21 * m, { part: "thigh", rings: [0.5] }));
      S.push(G3.ball(kn, 0.215 * m, { part: "joint" }));
      S.push(G3.cyl(kn, an, 0.21 * m, 0.125 * m, { part: "shin", rings: [0.5] }));
      const fl = b.footL, fh = b.footH;
      S.push(G3.prism(J["sole" + s], [[-fl * 0.25, 0], [fl * 0.75, 0], [fl * 0.75, fh * 0.34], [fl * 0.1, fh], [-fl * 0.25, fh]],
                      0.38, [J["fd" + s], J["fu" + s], J["fs" + s]], { part: "foot" }));
      const tags = ["sh", null, "el", null, null, "hip", null, "kn", null, null];
      S.slice(-10).forEach((it, i) => { it.side = s; if (tags[i]) it.jt = tags[i]; });
    }

    /* ---- gesture: the pose before any form ---- */
    const sup = q.support || "R";
    const G = [];
    G.push(G3.path(smooth([J.crown, J.neck, J.chest, J.pelvis, J["kn" + sup], J["an" + sup]], 12), { lw: 1.7, role: "action" }));
    for (const s of ["L", "R"]) {
      G.push(G3.path(smooth([J["sh" + s], J["el" + s], J["wr" + s], J["ft" + s]], 8), { role: "limb" }));
      if (s !== sup) G.push(G3.path(smooth([J["hip" + s], J["kn" + s], J["an" + s], J["toe" + s]], 8), { role: "limb" }));
    }
    G.push(G3.path([J["an" + sup], J["toe" + sup]], { role: "limb" }));
    G.push(G3.seg(J.shL, J.shR, { lw: 1.3, role: "tilt" }), G3.seg(J.hipL, J.hipR, { lw: 1.3, role: "tilt" }));
    G.push(G3.ell(J.head, [0.37 * hs, 0.5 * hs, 0.45 * hs], Rh, { hide: false, role: "head" }));

    /* ---- landmarks: the bones you can find on the surface ---- */
    const front = (p, R, d) => add(p, mul(R[2], d));
    const LM = [
      ["pit of the neck", onChest(0, b.chestH / 2 - 0.04)],
      ["sternum", onChest(0, -b.chestH * 0.14)],
      ["navel", front(J.waist, Rp, b.pelvisD * 0.48)],
      ["iliac crest", add(J.pelvis, ap(Rp, [b.pelvisW * 0.46, b.pelvisH * 0.42, b.pelvisD * 0.3]))],
      ["iliac crest", add(J.pelvis, ap(Rp, [-b.pelvisW * 0.46, b.pelvisH * 0.42, b.pelvisD * 0.3]))],
      ["collarbone end", add(J.shL, mul(Rc[1], 0.2))], ["collarbone end", add(J.shR, mul(Rc[1], 0.2))],
      ["great trochanter", add(J.hipL, mul(Rp[0], 0.3 * m))], ["great trochanter", add(J.hipR, mul(Rp[0], -0.3 * m))],
      ["kneecap", front(J.knL, Rp, 0.2 * m)], ["kneecap", front(J.knR, Rp, 0.2 * m)],
      ["ankle bone", J.anL], ["ankle bone", J.anR],
      ["elbow point", J.elL], ["elbow point", J.elR], ["wrist bone", J.wrL], ["wrist bone", J.wrR],
    ];
    return { J, solids: S, gesture: G, landmarks: LM, b, R: { Rp, Rc, Rh }, pose: q };
  }

  /* ============================================================
     The simplified skeleton, built on a figure's joints: the ribcage
     egg with its ribs, the pelvis's two wings, an S-curved spine,
     single bones above the elbow and knee, paired bones below.
     ============================================================ */
  function skeleton(f) {
    const { J, b } = f, { Rp, Rc, Rh } = f.R, S = [];
    const rel = (p, R, v) => add(p, ap(R, v));
    S.push(G3.ell(add(J.head, mul(Rh[1], 0.1)), [0.36, 0.4, 0.44], Rh, { part: "skull", rings: ["xz"] }));
    S.push(G3.tbox(rel(J.head, Rh, [0, -0.28, 0.12]), { w0: 0.26, w1: 0.52, h: 0.42, d0: 0.34, d1: 0.56 }, Rh, { part: "skull" }));
    S.push(...tube(smooth([rel(J.head, Rh, [0, -0.36, -0.06]), rel(J.neck, Rc, [0, 0, -0.14]), rel(J.chest, Rc, [0, 0, -0.42]),
      rel(J.chestBase, Rc, [0, 0, -0.3]), rel(J.waist, Rp, [0, 0, -0.18]), rel(J.pelvis, Rp, [0, 0.05, -0.34]), rel(J.pelvis, Rp, [0, -0.45, -0.3])], 4),
      0.075, { part: "spine" }));
    /* ribcage: an egg, open at the bottom front, with ribs that slope DOWN toward the front */
    const rr = [b.chestW * 0.43, b.chestH * 0.56, b.chestD * 0.52];
    S.push(G3.ell(J.chest, rr, Rc, { part: "ribcage", rings: ["yz"] }));
    for (const t of [-0.62, -0.34, -0.06, 0.22, 0.5, 0.74]) {
      const fq = Math.sqrt(1 - t * t), ctr = rel(J.chest, Rc, [0, rr[1] * t, 0]);
      S.push(G3.path(Array.from({ length: 30 }, (_, i) => {
        const a = i / 30 * 6.2832;
        return rel(J.chest, Rc, [rr[0] * fq * Math.cos(a) * 1.01, rr[1] * (t - 0.16 * Math.sin(a)), rr[2] * fq * Math.sin(a) * 1.01]);
      }), { close: true, facing: ctr, part: "ribs", lw: 0.7 }));
    }
    /* pelvis: two wings and the line that joins them in front */
    for (const k of [1, -1])
      S.push(G3.ell(rel(J.pelvis, Rp, [k * 0.34, 0.1, -0.04]), [0.33, 0.37, 0.09], mm(Rp, euler(k * -40, -12, k * 8)), { part: "pelvisBone" }));
    S.push(G3.path([J.hipL, rel(J.pelvis, Rp, [0, -0.36, 0.3]), J.hipR], { part: "pelvisBone", lw: 1.4 }));
    const pit = rel(J.chest, Rc, [0, b.chestH / 2 - 0.04, b.chestD * 0.42]);
    for (const [s, k] of [["L", 1], ["R", -1]]) {
      const sh = J["sh" + s], el = J["el" + s], wr = J["wr" + s], hip = J["hip" + s], kn = J["kn" + s], an = J["an" + s];
      S.push(G3.cyl(pit, add(sh, mul(Rc[1], 0.16)), 0.05, 0.05, { part: "clavicle" }));
      S.push(G3.mesh([rel(sh, Rc, [-k * 0.1, 0.12, -0.24]), rel(sh, Rc, [-k * 0.62, 0.0, -0.3]), rel(sh, Rc, [-k * 0.5, -0.85, -0.3])],
                     [{ v: [0, 1, 2], two: true, sg: 1 }], { part: "scapula" }));
      S.push(G3.ball(sh, 0.12, { part: "bone" }), G3.cyl(sh, el, 0.075, 0.065, { part: "bone" }), G3.ball(el, 0.1, { part: "bone" }));
      const side = norm(cross(sub(wr, el), Rc[2]));
      for (const d of [0.055, -0.055]) S.push(G3.cyl(add(el, mul(side, d)), add(wr, mul(side, d * 0.8)), 0.042, 0.036, { part: "bone" }));
      S.push(G3.box(along(wr, J["hd" + s], b.hand * 0.42), [0.3, b.hand * 0.84, 0.08], frame(J["hd" + s], Rc[2]), { part: "bone" }));
      S.push(G3.ball(hip, 0.14, { part: "bone" }), G3.cyl(hip, kn, 0.09, 0.075, { part: "bone" }), G3.ball(kn, 0.12, { part: "bone" }));
      S.push(G3.ball(add(kn, mul(Rp[2], 0.14)), 0.07, { part: "bone" }));
      const out = mul(Rp[0], k * 0.085);
      S.push(G3.cyl(kn, an, 0.07, 0.055, { part: "bone" }), G3.cyl(add(kn, out), add(an, out), 0.035, 0.03, { part: "bone" }));
      S.push(G3.prism(J["sole" + s], [[-b.footL * 0.22, 0], [b.footL * 0.72, 0], [b.footL * 0.72, 0.07], [b.footL * 0.08, b.footH * 0.9], [-b.footL * 0.22, b.footH * 0.9]],
                      0.26, [J["fd" + s], J["fu" + s], J["fs" + s]], { part: "bone" }));
    }
    return S;
  }

  /* ============================================================
     The big muscle masses as simple forms between landmarks.
     `flex` scales a named mass (e.g. { bicepsR: 1.35 }) so a study
     can show the same arm bent and straight.
     ============================================================ */
  function muscles(f, flex = {}) {
    const { J, b } = f, { Rp, Rc } = f.R, m = b.limb, M = [];
    const rel = (p, R, v) => add(p, ap(R, v));
    const k1 = n => flex[n] || 1;
    const belly = (name, a, c, t, off, r) => {             // a mass lying along the bone a→c
      const fr = frame(sub(c, a), Rc[2]), g = k1(name);
      M.push(G3.ell(add(lerp(a, c, t), ap(fr, off)), [r[0] * m * g, r[1], r[2] * m * g], fr, { part: "muscle", name, fill: 0.1 }));
    };
    for (const [s, k] of [["L", 1], ["R", -1]]) {
      const sh = J["sh" + s], el = J["el" + s], wr = J["wr" + s], hip = J["hip" + s], kn = J["kn" + s], an = J["an" + s];
      belly("deltoid" + s, sh, el, 0.14, [0, 0, 0], [0.31, 0.4, 0.31]);
      belly("biceps" + s, sh, el, 0.56, [0, 0, 0.1], [0.17, 0.5, 0.19]);
      belly("triceps" + s, sh, el, 0.5, [0, 0, -0.11], [0.18, 0.56, 0.18]);
      belly("forearm" + s, el, wr, 0.3, [0, 0, 0.02], [0.2, 0.5, 0.17]);
      belly("quads" + s, hip, kn, 0.5, [0, 0, 0.1], [0.3, 0.84, 0.27]);
      belly("hams" + s, hip, kn, 0.52, [0, 0, -0.13], [0.26, 0.76, 0.22]);
      belly("calf" + s, kn, an, 0.3, [0, 0, -0.1], [0.2, 0.52, 0.2]);
      M.push(G3.ell(rel(J.chest, Rc, [k * 0.37, b.chestH * 0.22, b.chestD * 0.44]), [0.4, 0.3, 0.13], mm(Rc, euler(0, 0, k * -8)), { part: "muscle", name: "pec" + s, fill: 0.1 }));
      M.push(G3.ell(rel(J.chest, Rc, [k * 0.5, -b.chestH * 0.1, -b.chestD * 0.42]), [0.34, 0.62, 0.13], mm(Rc, euler(0, 0, k * 14)), { part: "muscle", name: "lat" + s, fill: 0.1 }));
      M.push(G3.ell(rel(J.pelvis, Rp, [k * 0.3, -0.12, -b.pelvisD * 0.44]), [0.35, 0.37, 0.25], Rp, { part: "muscle", name: "glute" + s, fill: 0.1 }));
      M.push(G3.ell(rel(J.waist, Rp, [k * b.pelvisW * 0.4, 0.12, 0.02]), [0.16, 0.34, 0.3], Rp, { part: "muscle", name: "oblique" + s, fill: 0.1 }));
    }
    /* abdominals: one block from ribs to pelvis, cut by three lines */
    const top = rel(J.chest, Rc, [0, -b.chestH * 0.34, b.chestD * 0.47]), bot = rel(J.pelvis, Rp, [0, -0.2, b.pelvisD * 0.46]);
    const fr = frame(sub(top, bot), Rc[0]);
    const L = G3.len(sub(top, bot));
    const pt = (x, t) => add(add(lerp(bot, top, t), mul(Rc[0], x)), mul(fr[2], 0.062));
    M.push(G3.tbox(mid(top, bot), { w0: 0.46, w1: 0.6, h: L, d0: 0.1, d1: 0.12 }, [Rc[0], fr[1], cross(Rc[0], fr[1])], { part: "muscle", name: "abs", fill: 0.1 }));
    M.push(G3.path([pt(0, 0.02), pt(0, 0.98)], { part: "muscle", lw: 0.7 }));
    for (const t of [0.42, 0.62, 0.82]) M.push(G3.path([pt(-0.26, t), pt(0.26, t)], { part: "muscle", lw: 0.7 }));
    /* trapezius: a kite on the back, from the skull to mid-back, out to the shoulders */
    M.push(G3.mesh([rel(J.neck, Rc, [0, 0.42, -0.2]), add(J.shL, ap(Rc, [-0.1, 0.16, -0.14])), rel(J.chest, Rc, [0, -0.1, -b.chestD * 0.52]), add(J.shR, ap(Rc, [0.1, 0.16, -0.14]))],
                   [{ v: [0, 1, 2, 3], two: true, sg: 1 }], { part: "muscle", name: "trap", fill: 0.1 }));
    return M;
  }

  /* draw one aspect of a figure; `what` = gesture | mannequin | landmarks | contour */
  function drawFigure(ctx, cam, fig, what, o = {}) {
    const lw = o.lw || 2;
    if (what === "gesture") return G3.render(ctx, cam, fig.gesture, { lw: lw * 1.15, ...o });
    if (what === "mannequin") {
      const items = o.through ? fig.solids.map(s => ({ ...s, through: true })) : fig.solids;
      return G3.render(ctx, cam, o.tone ? items.map(s => ({ ...s, tone: o.tone })) : items, { lw, ...o });
    }
    if (what === "landmarks")
      return G3.render(ctx, cam, fig.landmarks.map(([, p]) => G3.pt(p, { r: o.r || 2.4 })), { lw, ...o });
    if (what === "contour")
      return G3.outline(ctx, cam, fig.solids, { lw: lw * 1.5, grow: (o.grow ?? 0.05) * cam.scale });
  }

  /* ============================================================
     The Loomis head. Unit = the cranium ball's radius.
       brow line   y = 0        (the ball's equator)
       hairline    y = +0.69    (top of the side-plane circle)
       nose base   y = −0.69    (bottom of the side-plane circle)
       chin        y = −1.38·jaw
     Returned in PARTS so a guide can reveal them stage by stage.
     ============================================================ */
  function head(o = {}) {
    const q = { at: [0, 0, 0], R: I(), s: 1, jaw: 1, wide: 1, ...o };
    const T = p => add(q.at, ap(q.R, mul(p, q.s)));
    const W = q.wide, chin = -1.38 * q.jaw, noseY = -0.69, c = q.at;
    const circle = (fn, n = 40) => Array.from({ length: n }, (_, i) => T(fn((i / n) * Math.PI * 2)));
    const part = {};

    part.ball = [G3.ell(c, [q.s, q.s, q.s], q.R, { rings: ["xz", "yz"] })];

    /* the flattened sides: a circle on each side of the ball, quartered */
    const sx = 0.72, sr = Math.sqrt(1 - sx * sx);
    part.sides = [];
    for (const k of [1, -1]) {
      part.sides.push(G3.path(circle(t => [k * sx, Math.cos(t) * sr, Math.sin(t) * sr]), { close: true }));
      part.sides.push(G3.seg(T([k * sx, sr, 0]), T([k * sx, -sr, 0]), { lw: 0.6 }),
                      G3.seg(T([k * sx, 0, -sr]), T([k * sx, 0, sr]), { lw: 0.6 }));
    }

    /* the jaw: hangs from the side planes, narrows to the chin */
    const V = { tfl: [-0.62 * W, -0.1, 0.86], tfr: [0.62 * W, -0.1, 0.86], tbr: [0.7 * W, -0.3, -0.05], tbl: [-0.7 * W, -0.3, -0.05],
                bfl: [-0.24 * W, chin, 0.82], bfr: [0.24 * W, chin, 0.82], bbr: [0.62 * W, chin * 0.72, -0.02], bbl: [-0.62 * W, chin * 0.72, -0.02] };
    const names = Object.keys(V), idx = n => names.indexOf(n);
    const fz = y => 0.86 + (0.82 - 0.86) * ((y + 0.1) / (chin + 0.1));         // z of the face plane at height y
    const fw = y => (0.62 + (0.24 - 0.62) * ((y + 0.1) / (chin + 0.1))) * W;   // its half-width
    const across = y => [T([-fw(y), y, fz(y) + 0.004]), T([fw(y), y, fz(y) + 0.004])];
    const eyeY = (1 + chin) / 2;                                               // halfway down the whole head
    const mouthY = noseY + (chin - noseY) * 0.36;
    part.jaw = [G3.mesh(names.map(n => T(V[n])), [
      ["bfl", "bfr", "tfr", "tfl"], ["bfr", "bbr", "tbr", "tfr"], ["bbl", "bfl", "tfl", "tbl"],
      ["bbl", "bbr", "bfr", "bfl"], ["bbr", "bbl", "tbl", "tbr"], ["tfl", "tfr", "tbr", "tbl"]].map(f => f.map(idx)))];
    part.neck = [G3.cyl(T([0, -0.75, -0.2]), T([0, chin - 0.75, -0.42]), 0.46 * q.s, 0.5 * q.s)];

    /* the thirds, and the lines features sit on */
    part.thirds = [
      G3.path(circle(t => [Math.cos(t) * 0.724, 0.69, Math.sin(t) * 0.724]), { close: true, facing: T([0, 0.69, 0]), lw: 0.8 }),
      G3.path([T([0, -0.1, 0.865]), T([0, chin, 0.825])], { lw: 0.8 }),
      G3.path(across(noseY), { lw: 0.8 }), G3.path(across(eyeY), { lw: 0.8, dash: true }), G3.path(across(mouthY), { lw: 0.6 }),
    ];

    /* features, kept SIMPLE: almonds, a wedge, a line, two blocks */
    const eye = k => {
      const cx = k * 0.3 * W, w = 0.15 * W, z = fz(eyeY) + 0.006;
      return G3.path([[cx - w, eyeY, z], [cx - w * 0.3, eyeY + 0.07, z], [cx + w * 0.4, eyeY + 0.07, z], [cx + w, eyeY + 0.01, z],
                      [cx + w * 0.3, eyeY - 0.055, z], [cx - w * 0.4, eyeY - 0.05, z]].map(T), { close: true });
    };
    const nz = fz(noseY);
    part.features = [
      eye(1), eye(-1),
      G3.mesh([[0, -0.08, 0.88], [0, noseY + 0.08, nz + 0.3], [-0.17 * W, noseY, nz + 0.02], [0.17 * W, noseY, nz + 0.02]].map(T),
              [{ v: [0, 2, 1], sg: 1 }, { v: [0, 1, 3], sg: 2 }, { v: [1, 2, 3], sg: 3 }]),
      G3.path([[-0.27 * W, mouthY + 0.02, fz(mouthY) + 0.006], [0, mouthY - 0.02, fz(mouthY) + 0.02], [0.27 * W, mouthY + 0.02, fz(mouthY) + 0.006]].map(T)),
      G3.path([[-0.13 * W, mouthY - 0.12, fz(mouthY - 0.12) + 0.006], [0.13 * W, mouthY - 0.12, fz(mouthY - 0.12) + 0.006]].map(T), { lw: 0.7 }),
      G3.path([[-0.42 * W, 0.1, 0.9], [-0.14 * W, 0.12, 0.985]].map(T), { lw: 1.3 }),
      G3.path([[0.14 * W, 0.12, 0.985], [0.42 * W, 0.1, 0.9]].map(T), { lw: 1.3 }),
    ];
    for (const k of [1, -1])
      part.features.push(G3.box(T([k * 0.77, -0.35, -0.1]), [0.1 * q.s, 0.68 * q.s, 0.36 * q.s], mm(q.R, euler(k * 12, -8, 0))));
    return { part, T, eyeY, mouthY, noseY, chin, q };
  }

  /* ============================================================
     A plane-by-plane head (after the classic planar study heads):
     no curves at all, so every plane takes one flat value of light.
     ============================================================ */
  const PLANAR = (() => {
    const v = {
      cTop: [0, 1.05, -0.1], cFtop: [0, 0.96, 0.45], cHair: [0, 0.7, 0.82], cBrow: [0, 0.18, 0.96], cNroot: [0, 0.02, 0.86],
      cNtip: [0, -0.52, 1.24], cNbase: [0, -0.66, 0.98], cLipT: [0, -0.84, 1.04], cLipM: [0, -0.94, 1.0], cLipB: [0, -1.06, 0.98],
      cChin: [0, -1.36, 0.9], cUnder: [0, -1.38, 0.5], cBtop: [0, 0.8, -0.86], cBack: [0, 0.1, -1.05], cNape: [0, -0.7, -0.72],
      top: [0.55, 0.92, -0.1], ftop: [0.5, 0.83, 0.42], hair: [0.5, 0.62, 0.7], temple: [0.75, 0.4, 0.25],
      browIn: [0.22, 0.2, 0.93], browOut: [0.63, 0.2, 0.66], eyeIn: [0.17, 0.0, 0.8], eyeLow: [0.36, -0.2, 0.84],
      cheekbone: [0.67, -0.14, 0.58], zyg: [0.79, -0.1, 0.1], nside: [0.1, -0.18, 0.93], nwing: [0.2, -0.62, 0.93],
      cheek: [0.46, -0.62, 0.82], mouth: [0.28, -0.94, 0.9], chinS: [0.24, -1.31, 0.82], jawM: [0.52, -1.12, 0.45],
      jawA: [0.7, -0.86, -0.12], ear: [0.8, -0.1, -0.14], side: [0.8, 0.42, -0.3], bside: [0.62, 0.56, -0.76],
      bsideL: [0.6, -0.1, -0.86], napeS: [0.42, -0.7, -0.55], underS: [0.36, -1.2, 0.28],
    };
    const f = [
      ["cTop", "top", "ftop", "cFtop"], ["cFtop", "ftop", "hair", "cHair"], ["cTop", "cBtop", "bside", "top"],
      ["top", "bside", "side"], ["top", "side", "temple", "ftop"], ["ftop", "temple", "hair"],
      ["cHair", "hair", "browOut", "browIn", "cBrow"], ["hair", "temple", "browOut"],
      ["browIn", "browOut", "cheekbone", "eyeLow", "eyeIn"], ["cBrow", "browIn", "eyeIn", "cNroot"],
      ["cNroot", "eyeIn", "nside"], ["cNroot", "nside", "cNtip"], ["nside", "nwing", "cNtip"], ["cNtip", "nwing", "cNbase"],
      ["eyeIn", "eyeLow", "cheek", "nwing", "nside"], ["eyeLow", "cheekbone", "cheek"], ["cheekbone", "jawM", "cheek"],
      ["cheek", "jawM", "chinS", "mouth"], ["cheekbone", "zyg", "jawA", "jawM"], ["browOut", "temple", "zyg", "cheekbone"],
      ["cNbase", "nwing", "mouth", "cLipT"], ["nwing", "cheek", "mouth"], ["cLipT", "mouth", "cLipM"], ["cLipM", "mouth", "cLipB"],
      ["cLipB", "mouth", "chinS", "cChin"], ["cChin", "chinS", "underS", "cUnder"], ["chinS", "jawM", "underS"],
      ["jawM", "jawA", "underS"], ["temple", "side", "ear", "zyg"], ["zyg", "ear", "jawA"], ["side", "bside", "bsideL", "ear"],
      ["ear", "bsideL", "napeS", "jawA"], ["cBtop", "cBack", "bsideL", "bside"], ["cBack", "cNape", "napeS", "bsideL"],
      ["cNape", "cUnder", "underS", "napeS"], ["napeS", "underS", "jawA"],
    ];
    return { v, f };
  })();
  function planarHead(o = {}) {
    const q = { at: [0, 0, 0], R: I(), s: 1, ...o };
    const names = Object.keys(PLANAR.v), verts = [], index = {};
    for (const n of names) {                         // right half, then its mirror
      const p = PLANAR.v[n];
      index[n + "R"] = verts.length; verts.push(p);
      if (Math.abs(p[0]) < 1e-6) index[n + "L"] = index[n + "R"];
      else { index[n + "L"] = verts.length; verts.push([-p[0], p[1], p[2]]); }
    }
    const faces = [];
    for (const side of ["R", "L"]) for (const fn of PLANAR.f) {
      let ids = fn.map(n => index[n + side]);
      /* wind every plane outward: its normal must point away from the head's centre */
      const a = verts[ids[0]], b = verts[ids[1]], c2 = verts[ids[2]];
      const n = cross(sub(b, a), sub(c2, a));
      const ctr = mul(ids.map(i => verts[i]).reduce(add, [0, 0, 0]), 1 / ids.length);
      if (dot(n, sub(ctr, [0, -0.1, 0])) < 0) ids = ids.slice().reverse();
      faces.push(ids);
    }
    return G3.mesh(verts.map(p => add(q.at, ap(q.R, mul(p, q.s)))), faces, { sortFaces: true, ...o.draw });
  }

  /* ============================================================
     The hand. Unit = the palm's length. Built as a RIGHT hand seen
     from the back: fingers along +y, thumb on −x, palm facing −z.
     A pose is a curl per finger joint (degrees) plus thumb directions.
     ============================================================ */
  const HANDS = {
    open:    { curl: [[4, 4, 4], [3, 3, 3], [4, 4, 4], [6, 6, 6]], thumb: [[-0.8, 0.5, -0.2], [-0.55, 0.8, -0.1], [-0.4, 0.9, -0.05]] },
    relaxed: { curl: [[18, 24, 14], [26, 30, 18], [32, 34, 20], [40, 38, 22]], thumb: [[-0.7, 0.5, -0.5], [-0.3, 0.8, -0.5], [-0.1, 0.9, -0.4]] },
    fist:    { curl: [[82, 98, 66], [84, 100, 68], [86, 100, 68], [88, 100, 66]], thumb: [[-0.35, 0.5, -0.8], [0.7, 0.35, -0.6], [0.95, -0.05, -0.25]] },
    point:   { curl: [[2, 2, 2], [84, 100, 68], [86, 100, 68], [88, 100, 66]], thumb: [[-0.3, 0.45, -0.85], [0.75, 0.3, -0.6], [0.9, 0, -0.4]] },
    grip:    { curl: [[52, 62, 38], [56, 64, 40], [58, 64, 40], [62, 62, 38]], thumb: [[-0.5, 0.35, -0.8], [0.25, 0.5, -0.82], [0.6, 0.25, -0.75]] },
    pinch:   { curl: [[48, 52, 18], [58, 56, 28], [72, 80, 50], [76, 82, 52]], thumb: [[-0.45, 0.5, -0.74], [0.05, 0.8, -0.6], [0.3, 0.82, -0.48]] },
    claw:    { curl: [[28, 62, 46], [30, 64, 48], [30, 64, 48], [32, 62, 46]], thumb: [[-0.75, 0.3, -0.55], [-0.35, 0.6, -0.72], [0.1, 0.55, -0.83]], spread: 1.6 },
    stop:    { curl: [[-4, 2, 2], [-5, 2, 2], [-4, 2, 2], [-2, 4, 4]], thumb: [[-0.95, 0.3, 0.05], [-0.75, 0.66, 0.05], [-0.6, 0.8, 0.05]], spread: 1.7 },
  };
  function hand(pose = "open", o = {}) {
    const p = typeof pose === "string" ? HANDS[pose] : pose;
    const q = { at: [0, 0, 0], R: I(), s: 1, left: false, ...o };
    const k = q.left ? -1 : 1;                                  // mirror in x for a left hand
    const M = v => [v[0] * k, v[1], v[2]];
    const T = v => add(q.at, ap(q.R, mul(M(v), q.s)));
    /* a mirrored frame is left-handed; flipping its x axis back keeps every
       box wound outward (the boxes are symmetric in x, so the shape is the same) */
    const fr = (xa, ya, za) => mm(q.R, [mul(M(xa), k), M(ya), M(za)]);
    const part = { palm: [], thumb: [], fingers: [], wrist: [] };
    part.palm.push(G3.tbox(T([0, 0, 0]), { w0: 0.72 * q.s, w1: 0.92 * q.s, h: 1.0 * q.s, d0: 0.27 * q.s, d1: 0.22 * q.s }, q.R));
    part.wrist.push(G3.tbox(T([0, -0.74, 0]), { w0: 0.58 * q.s, w1: 0.64 * q.s, h: 0.48 * q.s, d0: 0.4 * q.s, d1: 0.3 * q.s }, q.R));
    const bases = [[-0.34, 0.5], [-0.115, 0.55], [0.11, 0.52], [0.33, 0.43]];
    const lens = [0.88, 1.0, 0.92, 0.72], wid = [0.2, 0.21, 0.2, 0.17], fan = [-7, -1.5, 4, 10];
    const tips = [];
    bases.forEach(([bx, by], fi) => {
      const sp = rad(fan[fi] * (p.spread || 1));
      const xa = [Math.cos(sp), -Math.sin(sp), 0], ya = [Math.sin(sp), Math.cos(sp), 0];   // finger's own x and y
      let base = [bx, by, 0], ang = 0;
      [0.45, 0.31, 0.24].forEach((frac, j) => {
        ang += rad(p.curl[fi][j]);
        const dir = add(mul(ya, Math.cos(ang)), [0, 0, -Math.sin(ang)]);
        const L = lens[fi] * frac, w = wid[fi] * (1 - j * 0.08);
        const zAx = cross(xa, dir);
        const ctr = add(base, mul(dir, L / 2));
        part.fingers.push(G3.tbox(T(ctr), { w0: w * q.s, w1: w * 0.93 * q.s, h: L * q.s, d0: w * 0.92 * q.s, d1: w * 0.84 * q.s },
                                  fr(xa, dir, zAx), { finger: fi, seg: j }));
        base = add(base, mul(dir, L));
      });
      tips.push(T(base));
    });
    /* thumb: a wedge of muscle off the side of the palm, then two segments */
    let tb = [-0.4, -0.3, -0.06];
    [0.46, 0.36, 0.3].forEach((L, j) => {
      const d = norm(p.thumb[j]), w = [0.3, 0.23, 0.2][j];
      const ctr = add(tb, mul(d, L / 2));
      const f0 = frame(d, [0, 0, 1]);
      part.thumb.push(G3.tbox(T(ctr), { w0: w * (j ? 1 : 1.25) * q.s, w1: w * 0.9 * q.s, h: L * q.s, d0: w * q.s, d1: w * 0.88 * q.s },
                              fr(f0[0], f0[1], f0[2])));
      tb = add(tb, mul(d, L));
    });
    const knuckles = bases.map(([bx, by]) => T([bx, by, 0.12]));
    return { part, all: [...part.wrist, ...part.palm, ...part.thumb, ...part.fingers], tips, knuckles, T };
  }

  /* the foot: heel block, a wedge for the instep, a box of toes */
  function foot(o = {}) {
    const q = { at: [0, 0, 0], R: I(), s: 1, left: false, ...o };
    const k = q.left ? -1 : 1;
    const T = v => add(q.at, ap(q.R, mul([v[0], v[1], v[2] * k], q.s)));
    const Rz = q.R;
    const s = q.s, part = {};
    /* local: x = toward the toes, y = up, z = toward the outside of the foot */
    part.heel = [G3.tbox(T([-0.62, 0.3, 0]), { w0: 0.52 * s, w1: 0.44 * s, h: 0.6 * s, d0: 0.5 * s, d1: 0.42 * s }, Rz)];
    part.wedge = [G3.prism(T([0, 0, 0]), [[-0.4, 0], [0.75, 0], [0.75, 0.2], [0.05, 0.62], [-0.4, 0.62]].map(([x, y]) => [x * s, y * s]), 0.62 * s, Rz)];
    part.toes = [G3.tbox(T([1.0, 0.1, 0.02 * k]), { w0: 0.5 * s, w1: 0.5 * s, h: 0.2 * s, d0: 0.7 * s, d1: 0.66 * s }, Rz)];
    part.ankle = [G3.cyl(T([-0.3, 0.55, 0]), T([-0.36, 1.5, 0]), 0.26 * s, 0.3 * s, { rings: [0.6] }),
                  G3.ball(T([-0.3, 0.74, -0.27]), 0.11 * s), G3.ball(T([-0.3, 0.62, 0.27]), 0.1 * s)];
    part.sole = [G3.box(T([0.2, -0.07, 0]), [1.95 * s, 0.14 * s, 0.76 * s], Rz)];
    return { part, all: [...part.heel, ...part.wedge, ...part.toes, ...part.ankle], T };
  }
  const rad = d => d * Math.PI / 180;

  /* ============================================================
     Quadrupeds. ONE skeleton plan; a species is a table of where
     its joints sit when it stands (side view: x = toward the head,
     y = up) plus body widths. Every mammal has the same chain —
       front: withers → shoulder → elbow → wrist → knuckle → toe
       hind:  hip → knee → hock (ankle) → knuckle → toe
     — so the lesson's whole point (same parts, different lengths)
     is literally how the model is built.
     ============================================================ */
  const SPECIES = {
    dog: {
      front: [[1.5, 5.0], [2.1, 3.9], [1.5, 3.0], [1.55, 1.3], [1.62, 0.36], [2.1, 0]],
      hind: [[-1.9, 4.25], [-1.3, 2.95], [-2.45, 1.55], [-2.3, 0.36], [-1.82, 0]],
      wF: 0.62, wH: 0.56,
      rib: { c: [0.75, 3.95], r: [1.55, 1.12, 0.8], tilt: -6 }, pelvis: { c: [-1.75, 4.3], r: [0.9, 0.72, 0.62], tilt: 14 },
      neck: [[1.95, 4.65], [3.05, 5.85]], neckR: [0.62, 0.46],
      head: { dir: [1, -0.22], skull: [0.66, 0.58, 0.52], muzzle: [1.05, 0.5, 0.36, 0.5, 0.34] }, ear: [0.5, 0.6, "up"],
      tail: [[-2.65, 4.65], [-3.5, 4.95], [-4.15, 5.7]], tailR: [0.2, 0.06],
      leg: [0.44, 0.3, 0.2, 0.17], thigh: [0.66, 0.36, 0.19, 0.16], paw: [0.62, 0.3, 0.44],
    },
    cat: {
      front: [[1.25, 3.7], [1.7, 2.85], [1.25, 2.2], [1.3, 0.95], [1.36, 0.28], [1.72, 0]],
      hind: [[-1.6, 3.25], [-1.05, 2.2], [-2.05, 1.2], [-1.92, 0.28], [-1.55, 0]],
      wF: 0.46, wH: 0.44,
      rib: { c: [0.55, 2.95], r: [1.3, 0.84, 0.62], tilt: -4 }, pelvis: { c: [-1.45, 3.2], r: [0.78, 0.6, 0.5], tilt: 12 },
      neck: [[1.6, 3.4], [2.3, 4.05]], neckR: [0.5, 0.42],
      head: { dir: [1, -0.12], skull: [0.56, 0.52, 0.5], muzzle: [0.42, 0.36, 0.3, 0.42, 0.34] }, ear: [0.42, 0.5, "up"],
      tail: [[-2.2, 3.4], [-3.2, 3.0], [-4.0, 3.4], [-4.3, 4.3]], tailR: [0.15, 0.09],
      leg: [0.34, 0.22, 0.15, 0.13], thigh: [0.52, 0.27, 0.15, 0.13], paw: [0.46, 0.24, 0.34],
    },
    horse: {
      front: [[1.6, 6.6], [2.3, 5.2], [1.72, 4.25], [1.78, 2.35], [1.78, 0.78], [2.02, 0]],
      hind: [[-2.1, 5.5], [-1.55, 4.1], [-2.62, 2.7], [-2.46, 0.8], [-2.2, 0]],
      wF: 0.7, wH: 0.7,
      rib: { c: [0.55, 5.1], r: [1.95, 1.38, 0.98], tilt: -4 }, pelvis: { c: [-1.9, 5.55], r: [1.05, 0.9, 0.82], tilt: 16 },
      neck: [[1.95, 6.0], [3.55, 8.1]], neckR: [0.82, 0.5],
      head: { dir: [1, -0.72], skull: [0.62, 0.56, 0.44], muzzle: [1.75, 0.56, 0.36, 0.44, 0.3] }, ear: [0.24, 0.5, "up"],
      tail: [[-2.95, 5.95], [-3.5, 5.3], [-3.6, 3.4], [-3.4, 2.2]], tailR: [0.26, 0.2],
      leg: [0.5, 0.32, 0.2, 0.16], thigh: [0.82, 0.4, 0.2, 0.16], paw: [0.5, 0.5, 0.46], hoof: true,
    },
    bear: {
      front: [[1.3, 5.3], [2.0, 4.0], [1.5, 2.9], [1.62, 1.0], [1.7, 0.3], [2.5, 0]],
      hind: [[-1.8, 4.2], [-1.2, 2.75], [-2.2, 1.05], [-2.15, 0.34], [-0.95, 0]],
      wF: 0.82, wH: 0.8,
      rib: { c: [0.55, 3.95], r: [1.75, 1.5, 1.12], tilt: -8 }, pelvis: { c: [-1.6, 3.95], r: [1.15, 1.1, 1.0], tilt: 10 },
      neck: [[1.9, 4.5], [2.9, 4.6]], neckR: [0.92, 0.74],
      head: { dir: [1, -0.3], skull: [0.82, 0.74, 0.72], muzzle: [0.9, 0.52, 0.4, 0.56, 0.42] }, ear: [0.3, 0.32, "round"],
      tail: [[-2.7, 4.3], [-3.0, 4.2]], tailR: [0.2, 0.12],
      leg: [0.62, 0.46, 0.36, 0.32], thigh: [0.9, 0.52, 0.36, 0.3], paw: [0.9, 0.34, 0.62],
    },
  };
  const QNAMES = { front: ["withers", "shoulder", "elbow", "wrist", "knuckle", "toes"],
                   hind: ["hip", "knee", "hock = ANKLE", "knuckle", "toes"] };

  /* pose: { legs: { FR: [dir…], FL, HR, HL }  — new 2-D directions for the
              bones BELOW the root joint (shoulder / hip); lengths are kept
             neck: [dx,dy], headDir: [dx,dy], tail: [[x,y]…], lift: n } */
  function quadruped(kind = "dog", pose = {}) {
    let Q = SPECIES[kind];
    if (pose.pitch) {                               // tip the forequarters about the pelvis (a play bow, a rear)
      const a = pose.pitch * Math.PI / 180, c = Math.cos(a), sn = Math.sin(a), o = Q.pelvis.c;
      const R2 = p => [o[0] + (p[0] - o[0]) * c + (p[1] - o[1]) * sn, o[1] - (p[0] - o[0]) * sn + (p[1] - o[1]) * c];
      Q = { ...Q, front: Q.front.map(R2), rib: { ...Q.rib, c: R2(Q.rib.c), tilt: Q.rib.tilt - pose.pitch }, neck: Q.neck.map(R2) };
    }
    const chain = (ref, dirs, from) => {             // re-aim the bones from joint index `from`
      if (!dirs) return ref.map(p => p.slice());
      const out = ref.slice(0, from + 1).map(p => p.slice());
      for (let i = from; i < ref.length - 1; i++) {
        const L = Math.hypot(ref[i + 1][0] - ref[i][0], ref[i + 1][1] - ref[i][1]);
        const d = dirs[i - from] || [ref[i + 1][0] - ref[i][0], ref[i + 1][1] - ref[i][1]];
        const n2 = Math.hypot(d[0], d[1]) || 1;
        out.push([out[i][0] + d[0] / n2 * L, out[i][1] + d[1] / n2 * L]);
      }
      return out;
    };
    const legs = {};
    for (const [key, ref, w, from] of [["FR", Q.front, Q.wF, 1], ["FL", Q.front, -Q.wF, 1], ["HR", Q.hind, Q.wH, 0], ["HL", Q.hind, -Q.wH, 0]]) {
      const pts = chain(ref, pose.legs && pose.legs[key], from);
      legs[key] = pts.map(([x, y], i) => [x, y, w * (key[0] === "F" && i === 0 ? 0.45 : 1)]);
    }
    let low = 1e9;
    for (const k in legs) for (const p of legs[k]) low = Math.min(low, p[1]);
    const lift = pose.lift ?? 0;
    const up = p => [p[0], p[1] - (pose.air ? 0 : low) + lift, p[2] || 0];
    for (const k in legs) legs[k] = legs[k].map(up);
    const P2 = p => up([p[0], p[1], 0]);

    const S = [], G = [], J = { legs };
    const ribC = P2(Q.rib.c), pelC = P2(Q.pelvis.c);
    S.push(G3.ell(ribC, Q.rib.r, G3.rz(Q.rib.tilt), { part: "rib", rings: ["yz", "xy"] }));
    S.push(G3.ell(pelC, Q.pelvis.r, G3.rz(Q.pelvis.tilt), { part: "pelvis", rings: ["yz"] }));
    S.push(G3.cyl(add(ribC, [-Q.rib.r[0] * 0.45, -0.08, 0]), add(pelC, [Q.pelvis.r[0] * 0.2, -0.05, 0]),
                  Q.rib.r[1] * 0.86, Q.pelvis.r[1] * 0.95, { part: "belly" }));
    /* neck and head */
    const nk0 = P2(Q.neck[0]);
    const nL = Math.hypot(Q.neck[1][0] - Q.neck[0][0], Q.neck[1][1] - Q.neck[0][1]);
    const nd = pose.neck ? norm([pose.neck[0], pose.neck[1], 0]) : norm(sub(P2(Q.neck[1]), nk0));
    const nk1 = add(nk0, mul(nd, nL));
    S.push(G3.cyl(add(nk0, mul(nd, -0.35)), nk1, Q.neckR[0], Q.neckR[1], { part: "neck", rings: [0.5] }));
    const hd = norm([...(pose.headDir || Q.head.dir), 0]);
    const hUp = norm(cross([0, 0, 1], hd));
    const skullC = add(nk1, mul(hd, Q.head.skull[0] * 0.55));
    S.push(G3.ell(skullC, Q.head.skull, [hd, hUp, [0, 0, 1]], { part: "skull", rings: ["yz"] }));
    const [mL, mh0, mh1, mw0, mw1] = Q.head.muzzle;
    const muzC = add(add(skullC, mul(hd, Q.head.skull[0] * 0.7 + mL / 2)), mul(hUp, -Q.head.skull[1] * 0.22));
    /* a box along the head direction: its local y runs toward the nose */
    S.push(G3.tbox(muzC, { w0: mw0 * 1.5, w1: mw1 * 1.5, h: mL, d0: mh0 * 1.5, d1: mh1 * 1.5 }, [[0, 0, 1], hd, mul(hUp, -1)].map((c, i) => i === 2 ? hUp : c), { part: "muzzle" }));
    const nose = add(muzC, mul(hd, mL / 2));
    for (const k of [1, -1]) {
      const eb = add(add(skullC, mul(hUp, Q.head.skull[1] * 0.75)), [0, 0, k * Q.head.skull[2] * 0.62]);
      if (Q.ear[2] === "round") S.push(G3.ball(add(eb, mul(hUp, Q.ear[1] * 0.4)), Q.ear[0], { part: "ear" }));
      else S.push(G3.mesh([add(eb, mul(hd, -Q.ear[0] * 0.5)), add(eb, mul(hd, Q.ear[0] * 0.5)), add(add(eb, mul(hUp, Q.ear[1])), mul(hd, -Q.ear[0] * 0.3))],
                          [{ v: [0, 1, 2], two: true, sg: 1 }], { part: "ear" }));
    }
    /* legs */
    for (const key of ["FL", "HL", "FR", "HR"]) {
      const p = legs[key], F = key[0] === "F";
      const r = F ? Q.leg : Q.thigh, o = F ? 1 : 0, first = S.length;
      if (F) {                                        // the shoulder blade: a flat plate on the ribs
        const d = sub(p[1], p[0]);
        S.push(G3.box(mid(p[0], p[1]), [G3.len(d) * 0.55, G3.len(d), 0.16], frame(d, [1, 0, 0]), { part: "scapula" }));
      }
      S.push(G3.ball(p[o], r[0] * 0.92, { part: "joint" }));
      S.push(G3.cyl(p[o], p[o + 1], r[0], r[1], { part: "upper", rings: [0.5] }));
      S.push(G3.ball(p[o + 1], r[1] * 1.02, { part: "joint" }));
      S.push(G3.cyl(p[o + 1], p[o + 2], r[1], r[2], { part: "lower", rings: [0.5] }));
      S.push(G3.ball(p[o + 2], r[2] * 1.08, { part: "joint" }));
      S.push(G3.cyl(p[o + 2], p[o + 3], r[2], r[3], { part: "cannon" }));
      const a = p[o + 3], b = p[o + 4], fd = norm(sub(b, a));
      const [pl, ph, pw] = Q.paw;
      if (Q.hoof) S.push(G3.prism(add(b, [-0.05, 0, 0]), [[-0.34, 0], [0.26, 0], [0.12, ph], [-0.26, ph]], pw, [[1, 0, 0], [0, 1, 0], [0, 0, 1]], { part: "paw" }),
                         G3.cyl(a, add(b, [-0.1, ph, 0]), r[3], r[3] * 1.15, { part: "cannon" }));
      else S.push(G3.box(add(mid(a, b), [0, ph * 0.15, 0]), [G3.len(sub(b, a)) + pl * 0.5, ph, pw], [fd, norm(cross([0, 0, 1], fd)), [0, 0, 1]], { part: "paw" }));
      for (let i = first; i < S.length; i++) S[i].leg = key;
    }
    /* tail */
    const tailPts = smooth((pose.tail || Q.tail).map(P2), 6);
    const tr = i => Q.tailR[0] + (Q.tailR[1] - Q.tailR[0]) * (i / (tailPts.length - 1));
    S.push(...tube(tailPts, tailPts.map((_, i) => tr(i)), { part: "tail" }));

    /* gesture: the spine first, then one line per leg */
    const withers = [legs.FR[0][0], legs.FR[0][1], 0], hip = [legs.HR[0][0], legs.HR[0][1] + Q.pelvis.r[1] * 0.5, 0];
    G.push(G3.path(smooth([nose, skullC, nk1, withers, add(mid(withers, hip), [0, -0.25, 0]), hip, ...(pose.tail || Q.tail).map(P2)], 10), { lw: 1.7, role: "action" }));
    for (const key in legs) G.push(G3.path(legs[key], { role: "limb" }));
    G.push(G3.ell(skullC, Q.head.skull, [hd, hUp, [0, 0, 1]], { hide: false, role: "head" }));
    G.push(G3.ell(ribC, Q.rib.r, G3.rz(Q.rib.tilt), { hide: false, role: "mass", lw: 0.7 }));
    G.push(G3.ell(pelC, Q.pelvis.r, G3.rz(Q.pelvis.tilt), { hide: false, role: "mass", lw: 0.7 }));
    Object.assign(J, { ribC, pelC, skullC, nose, withers, hip, nk0, nk1 });
    return { solids: S, gesture: G, J, kind, names: QNAMES, Q };
  }

  /* ---------- a bird: egg body, ball head, a wing that folds like an arm ---------- */
  function bird(o = {}) {
    const open = !!o.open;
    const S = [], G = [];
    const body = [0, 2.6, 0];
    S.push(G3.ell(body, [1.55, 1.0, 0.86], G3.rz(20), { part: "body", rings: ["yz", "xy"] }));
    const neck = smooth([[1.0, 3.3, 0], [1.38, 4.1, 0], [1.3, 4.8, 0]], 4);
    S.push(...tube(neck, [0.36, 0.3, 0.27], { part: "neck" }));
    const headC = [1.5, 5.18, 0];
    S.push(G3.ball(headC, 0.44, { part: "head", rings: ["xy"] }));
    S.push(G3.cyl([1.82, 5.14, 0], [2.7, 4.96, 0], 0.17, 0, { part: "beak" }));
    S.push(G3.pt([1.66, 5.3, 0.4], { r: 2.4, part: "eye" }));
    const legs = {};
    for (const k of [1, -1]) {
      const z = k * 0.42;
      const hip = [-0.2, 2.2, z], knee = [0.42, 1.9, z * 1.1], ankle = [-0.12, 0.95, z * 1.1], ft = [0.12, 0.06, z * 1.1];
      legs[k] = [hip, knee, ankle, ft];
      S.push(G3.cyl(knee, ankle, 0.2, 0.09, { part: "leg" }), G3.ball(ankle, 0.1, { part: "leg" }), G3.cyl(ankle, ft, 0.07, 0.06, { part: "leg" }));
      for (const [dx, dz] of [[0.75, 0], [0.62, 0.34], [0.62, -0.34], [-0.4, 0]])
        S.push(G3.seg(ft, [ft[0] + dx, 0.02, ft[2] + dz * k], { part: "toe", lw: 1.2 }));
      /* wing: humerus, forearm, hand — the same three bones as an arm */
      const sh = [0.78, 3.25, k * 0.8];
      const bones = open
        ? [sh, [0.3, 3.5, k * 2.0], [0.72, 3.62, k * 3.3], [0.2, 3.42, k * 5.5]]
        : [sh, [-0.25, 2.92, k * 0.98], [0.5, 2.55, k * 1.02], [-1.95, 2.25, k * 0.9]];
      for (let i = 0; i < 3; i++) S.push(G3.cyl(bones[i], bones[i + 1], 0.12 - i * 0.025, 0.1 - i * 0.025, { part: "wingBone" }));
      const back = (p, d) => [p[0] - d, p[1] - (open ? 0.12 : 0.35), p[2]];
      const quad = (a, b, da, db) => G3.mesh([a, b, back(b, db), back(a, da)], [{ v: [0, 1, 2, 3], two: true, sg: 1 }], { part: "feathers" });
      if (open) S.push(quad(bones[0], bones[1], 0.9, 1.5), quad(bones[1], bones[2], 1.5, 1.7), quad(bones[2], bones[3], 1.7, 0.9));
      else S.push(G3.mesh([bones[0], bones[2], bones[3], [-1.3, 2.75, k * 0.95]], [{ v: [0, 1, 2, 3], two: true, sg: 1 }], { part: "feathers" }));
      J_wing[k] = bones;
    }
    S.push(G3.mesh([[-1.35, 2.62, 0.3], [-1.35, 2.62, -0.3], [-2.75, 2.2, -0.62], [-2.75, 2.2, 0.62]], [{ v: [0, 1, 2, 3], two: true, sg: 1 }], { part: "tail" }));
    G.push(G3.path(smooth([[2.7, 4.96, 0], headC, ...neck, body, [-1.35, 2.62, 0], [-2.75, 2.2, 0]], 8), { lw: 1.7, role: "action" }));
    for (const k of [1, -1]) { G.push(G3.path(legs[k], { role: "limb" })); G.push(G3.path(J_wing[k], { role: "limb" })); }
    G.push(G3.ell(body, [1.55, 1.0, 0.86], G3.rz(20), { hide: false, role: "mass", lw: 0.7 }), G3.ball(headC, 0.44, { hide: false, role: "head" }));
    return { solids: S, gesture: G, J: { legs, wing: { ...J_wing }, body, headC } };
  }
  const J_wing = {};

  /* ---------- lizard, frog, snake, fish, insect ---------- */
  function lizard() {
    const spine = smooth([[2.1, 0.55, 0], [1.1, 0.62, 0.16], [0, 0.62, -0.12], [-1.0, 0.56, 0.1], [-2.2, 0.36, -0.2], [-3.3, 0.2, 0.1], [-4.2, 0.1, -0.15]], 4);
    const n = spine.length, rr = spine.map((_, i) => { const t = i / (n - 1); return t < 0.45 ? 0.36 + 0.08 * Math.sin(t / 0.45 * Math.PI) : 0.36 * Math.pow(1 - (t - 0.45) / 0.55, 0.9) + 0.03; });
    const S = [...tube(spine, rr, { part: "body" })], G = [G3.path(spine, { lw: 1.7, role: "action" })];
    S.push(G3.tbox([2.75, 0.6, 0], { w0: 0.62, w1: 0.3, h: 1.1, d0: 0.5, d1: 0.24 }, [[0, 0, 1], [1, 0, 0], [0, 1, 0]], { part: "head" }));
    for (const [x, len, k] of [[1.25, 0.72, 1], [1.25, 0.72, -1], [-0.95, 0.9, 1], [-0.95, 0.9, -1]]) {
      const sh = [x, 0.6, k * 0.36], el = [x + 0.12 * (x > 0 ? 1 : -1), 0.72, k * (0.36 + len)], wr = [el[0] + 0.25, 0.06, el[2] + k * 0.1];
      S.push(G3.cyl(sh, el, 0.17, 0.13, { part: "leg" }), G3.ball(el, 0.14, { part: "leg" }), G3.cyl(el, wr, 0.13, 0.08, { part: "leg" }));
      for (const a of [-0.5, 0, 0.5, 1.0]) S.push(G3.seg(wr, [wr[0] + Math.cos(a) * 0.42, 0.02, wr[2] + k * Math.sin(a) * 0.42], { part: "toe" }));
      G.push(G3.path([sh, el, wr], { role: "limb" }));
    }
    return { solids: S, gesture: G };
  }
  function frog() {
    const S = [], G = [];
    S.push(G3.ell([0, 0.92, 0], [1.05, 0.68, 0.82], G3.rz(24), { part: "body", rings: ["yz", "xy"] }));
    S.push(G3.tbox([1.05, 1.28, 0], { w0: 1.1, w1: 0.6, h: 0.8, d0: 0.6, d1: 0.34 }, mm(G3.rz(18), [[0, 0, 1], [1, 0, 0], [0, 1, 0]]), { part: "head" }));
    for (const k of [1, -1]) {
      S.push(G3.ball([0.92, 1.68, k * 0.42], 0.23, { part: "eye" }));
      const f = [[0.6, 0.72, k * 0.62], [0.5, 0.3, k * 0.98], [0.95, 0.04, k * 0.72]];
      S.push(G3.cyl(f[0], f[1], 0.16, 0.12, { part: "leg" }), G3.cyl(f[1], f[2], 0.12, 0.08, { part: "leg" }));
      const h = [[-0.8, 0.7, k * 0.5], [0.12, 0.52, k * 1.22], [-0.92, 0.26, k * 1.16], [0.25, 0.04, k * 1.42]];
      S.push(G3.cyl(h[0], h[1], 0.3, 0.19, { part: "leg" }), G3.ball(h[1], 0.2, { part: "leg" }), G3.cyl(h[1], h[2], 0.19, 0.12, { part: "leg" }),
             G3.ball(h[2], 0.13, { part: "leg" }), G3.cyl(h[2], h[3], 0.11, 0.07, { part: "leg" }));
      for (const a of [-0.4, 0.1, 0.6]) S.push(G3.seg(h[3], [h[3][0] + Math.cos(a) * 0.5, 0.02, h[3][2] + k * Math.sin(a) * 0.5], { part: "toe" }));
      G.push(G3.path(f, { role: "limb" }), G3.path(h, { role: "limb" }));
    }
    G.push(G3.path(smooth([[1.5, 1.45, 0], [0.6, 1.2, 0], [-0.4, 0.8, 0], [-1.0, 0.45, 0]], 6), { lw: 1.7, role: "action" }));
    return { solids: S, gesture: G };
  }
  function snake() {
    const raw = [];
    for (let i = 0; i <= 26; i++) {
      const x = 3.6 - i * 0.29, lift = i < 5 ? (5 - i) * 0.24 : 0;
      raw.push([x + (i < 5 ? (5 - i) * 0.05 : 0), 0.26 + lift, 1.05 * Math.sin(x * 1.25) * (i < 4 ? i / 4 : 1)]);
    }
    const n = raw.length, rr = raw.map((_, i) => { const t = i / (n - 1); return 0.26 * (t < 0.12 ? 0.72 + t * 2.3 : t > 0.6 ? Math.pow(1 - (t - 0.6) / 0.4, 0.8) * 0.96 + 0.04 : 1); });
    const S = [...tube(raw, rr, { part: "body" })];
    const h = raw[0], d = norm(sub(raw[0], raw[1]));
    S.push(G3.tbox(add(h, mul(d, 0.3)), { w0: 0.5, w1: 0.26, h: 0.7, d0: 0.34, d1: 0.18 }, frame(d, [0, 0, 1]), { part: "head" }));
    return { solids: S, gesture: [G3.path(raw, { lw: 1.7, role: "action" })] };
  }
  function fish() {
    const S = [], fin = (pts, part = "fin") => G3.mesh(pts, [{ v: pts.map((_, i) => i), two: true, sg: 1 }], { part });
    S.push(G3.ell([0, 0, 0], [1.95, 0.78, 0.4], I(), { part: "body", rings: ["yz", "xz"] }));
    S.push(fin([[-1.7, 0, 0], [-2.95, 0.95, 0], [-2.55, 0, 0], [-2.95, -0.95, 0]], "tail"));
    S.push(fin([[0.5, 0.72, 0], [-0.9, 0.62, 0], [-0.75, 1.3, 0], [0.05, 1.42, 0]]));
    S.push(fin([[-0.5, -0.66, 0], [-1.2, -0.5, 0], [-1.05, -1.1, 0]]));
    for (const k of [1, -1]) S.push(fin([[0.75, -0.2, k * 0.36], [0.2, -0.75, k * 0.8], [-0.05, -0.2, k * 0.5]]));
    S.push(G3.pt([1.38, 0.2, 0.3], { r: 2.6, part: "eye" }));
    S.push(G3.path(Array.from({ length: 12 }, (_, i) => { const a = -1.2 + i * 0.22; return [0.95 + Math.cos(a) * 0.12, Math.sin(a) * 0.56, 0.36]; }), { part: "gill", lw: 0.8 }));
    return { solids: S, gesture: [G3.path([[1.95, 0, 0], [0, 0.06, 0], [-1.7, 0, 0], [-2.6, 0, 0]], { lw: 1.7, role: "action" })] };
  }
  function insect() {
    const S = [], G = [];
    S.push(G3.ball([2.1, 1.0, 0], 0.46, { part: "head" }));
    S.push(G3.ell([1.05, 1.02, 0], [0.74, 0.56, 0.58], I(), { part: "thorax", rings: ["yz"] }));
    S.push(G3.ell([-0.75, 1.02, 0], [1.35, 0.76, 0.84], G3.rz(-4), { part: "abdomen", rings: ["xy"] }));
    for (const x of [-1.5, -1.0, -0.5, 0.0]) {
      const f = Math.sqrt(Math.max(0, 1 - ((x + 0.75) / 1.35) ** 2));
      S.push(G3.path(Array.from({ length: 28 }, (_, i) => { const a = i / 28 * 6.2832; return [x, 1.02 + Math.cos(a) * 0.76 * f, Math.sin(a) * 0.84 * f]; }),
                     { close: true, facing: [x, 1.02, 0], part: "segment", lw: 0.7 }));
    }
    for (const k of [1, -1]) {
      [[1.45, 0.5, 1.2], [1.05, 0, 1.4], [0.65, -0.55, 1.55]].forEach(([x, dx, reach]) => {
        const hip = [x, 0.72, k * 0.4], knee = [x + dx * 0.5, 1.62, k * (0.4 + reach * 0.62)], foot = [x + dx, 0.05, k * (0.4 + reach)], tip = [x + dx * 1.25, 0.02, k * (0.62 + reach)];
        S.push(G3.cyl(hip, knee, 0.1, 0.07, { part: "leg" }), G3.cyl(knee, foot, 0.07, 0.04, { part: "leg" }), G3.seg(foot, tip, { part: "leg" }));
        G.push(G3.path([hip, knee, foot, tip], { role: "limb" }));
      });
      S.push(G3.path(smooth([[2.4, 1.3, k * 0.2], [2.9, 1.8, k * 0.5], [3.5, 1.7, k * 0.9]], 5), { part: "antenna" }));
      S.push(G3.ball([2.3, 1.12, k * 0.34], 0.14, { part: "eye" }));
    }
    G.push(G3.path([[2.56, 1.0, 0], [1.05, 1.02, 0], [-0.75, 1.02, 0], [-2.1, 0.95, 0]], { lw: 1.7, role: "action" }));
    return { solids: S, gesture: G };
  }

  /* ---------- skulls as blocks: what the animal EATS decides the shape ---------- */
  function skull(kind) {
    const pred = kind === "predator";
    const S = [];
    S.push(G3.ell([-0.75, 0.3, 0], pred ? [0.95, 0.6, 0.56] : [0.8, 0.56, 0.5], I(), { part: "cranium", rings: ["yz"] }));
    const mL = pred ? 1.7 : 2.6;
    S.push(G3.tbox([mL / 2, pred ? 0.02 : -0.12, 0], { w0: 0.9, w1: pred ? 0.5 : 0.44, h: mL, d0: pred ? 0.74 : 0.86, d1: pred ? 0.42 : 0.5 },
                   mm(G3.rz(pred ? -4 : -12), [[0, 0, 1], [1, 0, 0], [0, 1, 0]]), { part: "muzzle" }));
    S.push(G3.tbox([mL * 0.42, pred ? -0.62 : -0.86, 0], { w0: 0.78, w1: 0.36, h: mL * 1.05, d0: pred ? 0.3 : 0.5, d1: 0.18 },
                   mm(G3.rz(pred ? -8 : -14), [[0, 0, 1], [1, 0, 0], [0, 1, 0]]), { part: "jaw" }));
    S.push(G3.tbox([-0.55, pred ? -0.35 : -0.5, 0], { w0: 0.84, w1: 0.84, h: pred ? 0.9 : 1.2, d0: 0.34, d1: 0.5 }, G3.rz(12), { part: "jaw" }));
    for (const k of [1, -1]) {
      /* the orbit: facing FORWARD on a hunter, SIDEWAYS on the hunted */
      const c = pred ? [0.12, 0.28, k * 0.4] : [0.05, 0.36, k * 0.47];
      const nrm = norm(pred ? [0.72, 0.12, k * 0.68] : [0.1, 0.08, k * 1]);
      const [u, , w] = frame(nrm);
      S.push(G3.path(Array.from({ length: 22 }, (_, i) => { const a = i / 22 * 6.2832; return add(c, add(mul(u, Math.cos(a) * 0.3), mul(w, Math.sin(a) * 0.3))); }),
                     { close: true, part: "orbit", lw: 1.3 }));
      S.push(G3.path(smooth([[-0.5, 0.05, k * 0.52], [0, -0.12, k * 0.78], [0.5, -0.05, k * 0.56]], 5), { part: "arch" }));
      if (pred) {
        S.push(G3.cyl([mL - 0.22, -0.2, k * 0.2], [mL - 0.2, -0.86, k * 0.21], 0.09, 0, { part: "teeth" }));
        S.push(G3.path([[0.5, -0.3, k * 0.34], [0.68, -0.52, k * 0.34], [0.86, -0.3, k * 0.33], [1.02, -0.5, k * 0.32], [1.18, -0.3, k * 0.3]], { part: "teeth" }));
      } else {
        for (let i = 0; i < 5; i++) S.push(G3.box([0.35 + i * 0.3, -0.42 - i * 0.055, k * 0.33], [0.26, 0.22, 0.2], G3.rz(-12), { part: "teeth" }));
        S.push(G3.box([mL - 0.12, -0.68, k * 0.1], [0.16, 0.3, 0.16], G3.rz(-12), { part: "teeth" }));
      }
    }
    if (pred) S.push(G3.prism([-0.8, 0.84, 0], [[-0.8, 0], [0.7, 0], [0.2, 0.2], [-0.6, 0.24]], 0.07, I(), { part: "crest" }));
    return { solids: S };
  }

  return { smooth, tube, figure, drawFigure, POSES, BUILDS, along, head, planarHead, hand, foot, HANDS,
           quadruped, SPECIES, bird, lizard, frog, snake, fish, insect, skull, skeleton, muscles };
})();
