/* Curriculum · deep-dive pages
   Extra pages for lessons whose subject did not fit on two. They are
   appended to the END of each lesson, so step progress already saved
   for the earlier pages keeps its place. */
"use strict";

(() => {
  const find = id => { for (const s of PENSHI_CURRICULUM) for (const c of s.chapters) for (const l of c.lessons) if (l.id === id) return l; };
  const extend = (id, minutes, pages) => { const l = find(id); if (!l) return; l.pages.push(...pages); l.minutes = (l.minutes || 0) + minutes; };
  const pencil = { tool: "pencil", layer: "Pencils" }, ink = { tool: "ink", layer: "Inks" };

  /* ---------------- Section 3: heads and the mannequin ---------------- */
  extend("head-2", 30, [
    { title: "All the way round", exemplar: "headTurnaround",
      hints: ["Six views of ONE head. If the jaw gets longer between views, it is a different person.", "Rule a line across the page at brow, nose and chin and keep all six on it."],
      steps: [
        { h: "Six balls, six centre lines", level: 1, t: "Trace the six balls, then on a clean part of the page draw six of your own. On each, draw the centre line and the brow line as they wrap the ball. Front: a straight cross. Three-quarter: the vertical bows toward the far side. Profile: the centre line IS the front edge. Behind the ear and back: the cross is on the far side, so you draw only the brow line wrapping away.", ...pencil },
        { h: "Slice and hang the jaw", level: 2, t: "Add the side plane and jaw to each. Watch the side plane: a thin sliver at the front, a full circle in profile, still visible from behind the ear. From the back the jaw shows as two small corners below the ears and the neck enters high, level with the ears.", tool: "pencil" },
        { h: "Features only where they show", level: 3, t: "Place the thirds and features. From behind the ear you draw only the far cheekbone, the tip of the nose past the cheek, and the ear from behind. From the back: ears, hairline, neck. Resist drawing a face that could not be seen.", tool: "pencil" },
        { h: "Your character, six times", level: 3, t: "Hide the guides. Draw the six views again as a character of your own — change the jaw length and face width first (as in the five-heads page), then keep those two numbers fixed across all six. Ink the two views you find hardest.", ...ink },
      ] },
  ]);

  extend("body-2", 50, [
    { title: "The mannequin turnaround", exemplar: "mannequinTurn",
      hints: ["Eight views of one pose. Pick one corner of the ribcage box and follow it round.", "Shoulder tilt and hip tilt stay opposed in every view."],
      steps: [
        { h: "Eight gestures", level: 1, t: "Trace the eight gesture lines. Notice that from the side the line of action is almost straight while from the front it is a clear S: the same pose has a different gesture from every side, and you choose the camera that shows it best.", ...pencil },
        { h: "Turn the two boxes", level: 2, t: "Add the ribcage and pelvis boxes to all eight. Work across the row, turning each box 45° from the last. At the side view each box shows one face only; at the back view you see the same faces as the front, mirrored, with the spine down the middle.", tool: "pencil" },
        { h: "Limbs: which is nearer?", level: 3, t: "Add limbs and joints. In every view say which arm and which leg is nearer the camera and draw that one first, complete; the far limb is partly hidden behind the torso. In the three-quarter back views the near shoulder blade side of the ribcage box faces you.", tool: "pencil" },
        { h: "Turn a pose of your own", level: 3, t: "Hide the guides. Take any pose from your gesture drills and draw it from three sides: front, three-quarter, back. Build boxes first. If you cannot turn it, the first drawing was a flat outline — rebuild that one as boxes and try again.", tool: "pencil" },
      ] },
    { title: "Mannequins in action", exemplar: "mannequinAction",
      hints: ["Six actions. One line of action each, drawn before anything else.", "The plumb line tells you whether the figure is balanced or falling — both are useful."],
      steps: [
        { h: "Six lines of action", level: 1, t: "Trace the six gestures and their plumb lines. Three of these figures are balanced (plumb line inside the feet) and three are falling on purpose. Mark which is which beside each one.", ...pencil },
        { h: "Boxes and tubes on the line", level: 2, t: "Build each mannequin on its gesture. Start with the ribcage and pelvis: in the run and the punch they TWIST against each other, in the crouch they fold toward each other, in the leap they pull apart. Then the limbs, nearest first.", tool: "pencil" },
        { h: "Contour last", level: 3, t: "Turn on the contour level and compare it with your mannequins: the outline is only the outside edge of forms you have already drawn. Trace the contour of two figures over your own construction.", tool: "pencil" },
        { h: "Two actions of your own", level: 3, t: "Hide the guides. From Line of Action or Posemaniacs, draw two action poses not on this page — five minutes each, gesture then mannequin. Ink the better one with heavier line on the overlapping limbs.", ...ink },
      ] },
  ]);

  /* ---------------- Section 4: figure drawing ---------------- */
  extend("fig-1", 45, [
    { title: "Second long pose: seated", exemplar: "longPoseSeated",
      hints: ["Same stages and timings: 2, 5, 5, 8 minutes.", "A seated figure folds: the thighs come toward you and overlap the torso.", "Find a seated reference pose and draw it beside the guide, stage for stage."],
      steps: [
        { h: "Gesture of a seated figure", level: 1, t: "The line of action still runs through the spine, but the weight now rests on the seat, not the feet. Draw the spine line, the tilt of the shoulders and hips, and one line for each thigh. Then do the same from your own seated reference beside the guide.", ...pencil },
        { h: "Tip the pelvis, bring the thighs forward", level: 2, t: "The pelvis box tips BACK when someone sits, and the ribcage stacks over it or slumps. The thighs are tubes coming toward the viewer: draw them with clear overlap and round cross-contours — this is foreshortening inside an ordinary pose.", tool: "pencil" },
        { h: "Landmarks that survive the fold", level: 3, t: "Pit of the neck, sternum, navel, iliac crests, kneecaps, ankle bones. In a seated pose the kneecaps are your most useful landmark: they sit at the END of the thigh tubes, nearer to you than the hips.", tool: "pencil" },
        { h: "Contour, and the chair", level: 4, t: "Draw the contour as the edge of the forms. Where a thigh passes in front of the belly its line is unbroken and the belly line stops against it. Add the seat as a simple box under the figure, in the same perspective, so the weight has somewhere to go.", ...ink },
      ] },
    { title: "Third long pose: off balance", exemplar: "longPoseAction",
      hints: ["Same stages and timings again. This one leans.", "Compare this page with your first long pose when you finish."],
      steps: [
        { h: "A gesture that leans", level: 1, t: "One sweeping line from head to supporting foot. The dashed plumb line shows how far the head sits from the support: that distance is the energy of the pose. Draw it from your own reference of a leaning or reaching figure beside the guide.", ...pencil },
        { h: "Opposed boxes", level: 2, t: "The ribcage and pelvis tilt against each other: one side of the torso stretches while the other pinches. Build both boxes, check their tilt against the gesture, then the limbs. The supporting leg is nearly straight under the load; the free leg is relaxed.", tool: "pencil" },
        { h: "Landmarks show the twist", level: 3, t: "Mark both shoulder points and both hip points and join each pair with a line. The two lines are not parallel — the angle between them is the twist. Then the remaining landmarks.", tool: "pencil" },
        { h: "Contour: stretch and pinch", level: 4, t: "On the stretched side the contour is one long, smooth line. On the pinched side it breaks into short overlapping curves. Ink it that way, then lay your three long poses side by side and write what changed.", ...ink },
      ] },
  ]);

  extend("fig-2", 30, [
    { title: "The whole torso, five camera heights", exemplar: "foreshortTorso",
      hints: ["One pose, seen from far below up to far above.", "Whatever is nearest the camera is drawn bigger and overlaps what is behind it."],
      steps: [
        { h: "Two boxes and a head, five times", level: 1, t: "Trace the ribcage box, pelvis box and head at all five heights, then draw the row again yourself. From below you see the UNDERSIDE of the pelvis box and the jaw; from above, the top of the head and the tops of the shoulders. At eye level you see neither.", ...pencil },
        { h: "Hang the limbs on the boxes", level: 2, t: "Add the limbs. From far above the legs taper away to small feet; from far below the feet are the biggest thing on the figure and the head is small. Draw each limb as overlapping tubes with contour ellipses that open up as the limb points at the camera.", tool: "pencil" },
        { h: "Contour, heaviest nearest", level: 3, t: "Turn on the contour and trace it over your construction for the two extreme views. Put your heaviest line on whatever is nearest the camera: the feet from below, the head and shoulders from above.", tool: "pencil" },
        { h: "Your own extreme view", level: 3, t: "Hide the guides. On Posemaniacs, tilt the camera well above or below a pose and draw it: boxes, limbs, contour. Ink it. This is the comics hero shot (from below) or the lost-in-the-city shot (from above).", ...ink },
      ] },
  ]);

  extend("fig-4", 75, [
    { title: "The walk, position by position", exemplar: "walkCycle",
      hints: ["Top row: side view. Bottom row: the same four positions seen three-quarter.", "The hips rise at passing and dip at contact. Arms oppose legs."],
      steps: [
        { h: "Ground line, hip path, plumb", level: 1, t: "Before any figure: the ground line, then the wavy path the hips follow (up at passing, down at contact). Trace the four gestures on that path. In every one the plumb line from the neck lands on or between the feet — a walk is balanced.", ...pencil },
        { h: "Contact and passing as mannequins", level: 2, t: "Build the mannequins. Contact: legs at their widest, front heel down, back toe down, pelvis rotated toward the front leg, shoulders rotated the other way. Passing: the weight is on one straight leg, that hip is HIGH, and the free leg swings through bent.", tool: "pencil" },
        { h: "The three-quarter row", level: 2, t: "Now the lower row. The same four positions, but the far arm and far leg are partly hidden and smaller. Draw the near leg first. This is the view you will actually use in a comic panel; the side view is the diagram.", tool: "pencil" },
        { h: "A walk with character", level: 3, t: "Hide the guides. Draw the four positions again for a specific person: tired (hips barely rise, head forward), proud (chest up, long stride), sneaking (deep bend at passing). Only the amounts change, never the order. Ink one position.", ...ink },
      ] },
    { title: "The run", exemplar: "runCycle",
      hints: ["Push-off, flight, landing.", "The plumb line falls ahead of the feet: a run is a controlled fall."],
      steps: [
        { h: "Lean first", level: 1, t: "Trace the three gestures. The whole spine leans forward and the plumb line lands AHEAD of the supporting foot. In the flight position nothing touches the ground line. Draw the ground line and the leaning spines before anything else.", ...pencil },
        { h: "Mannequins: drive and reach", level: 2, t: "Push-off: the back leg is straight and long, driving; the front knee is high. Flight: both legs bent, the body at its highest. Landing: the front leg reaches and bends to take the weight. Elbows stay bent near a right angle and swing opposite the legs.", tool: "pencil" },
        { h: "Three-quarter, coming at you", level: 2, t: "The lower row shows the runner coming toward the camera. The lead knee and the near fist are now the nearest forms: draw them bigger, with overlap. This is foreshortening doing the work of speed.", tool: "pencil" },
        { h: "Push it", level: 3, t: "Hide the guides. Redraw the push-off with 50% more lean and a longer stride than the guide — too far, then pull back until it still reads as possible. Ink it with a broken, lighter line on the trailing limbs.", ...ink },
      ] },
    { title: "The jump", exemplar: "jumpArc",
      hints: ["Crouch, launch, apex, land — one arc through the hips.", "Squash and stretch: closed C, then a long open line, then a C again."],
      steps: [
        { h: "The arc before the figures", level: 1, t: "Draw the arc the hips travel first, from the crouch up to the apex and down to the landing. Then hang the four gestures on it. Crouch and landing are tight C curves; launch and apex are long, open lines.", ...pencil },
        { h: "Compress and stretch the mannequin", level: 2, t: "Crouch: every joint bent, ribcage folded toward the pelvis, arms back. Launch: everything extends at once and the arms are thrown up ahead of the body. Apex: the body is longest. Landing: feet arrive first, then the knees absorb. Build all four.", tool: "pencil" },
        { h: "The same jump, three-quarter", level: 2, t: "The lower row. The arc now travels toward the viewer as well as up, so the apex figure is slightly larger than the crouch behind it. Draw the nearest limb first on each.", tool: "pencil" },
        { h: "One panel, one moment", level: 3, t: "Hide the guides. A comic shows ONE of these four moments. Choose the launch or the apex, redraw it large as a full mannequin from a low camera, and ink it. Add the ground far below to say how high.", ...ink },
      ] },
  ]);

  /* ---------------- Section 5: anatomy and animals ---------------- */
  extend("anat-1", 30, [
    { title: "The skeleton from three sides", exemplar: "skeletonTurn",
      hints: ["Front, side and back of the same standing figure.", "The side view is where most people's skeletons go wrong: the spine is not a rod."],
      steps: [
        { h: "Three outlines", level: 1, t: "Trace the three outlines lightly — they are only containers. Mark on each where bone comes to the surface: collarbones and kneecaps at the front, the spine and shoulder-blade edges at the back, the hip crest from the side.", ...pencil },
        { h: "The side view: a double S", level: 2, t: "Turn on the skeleton and draw the side view first. The neck curves forward, the ribcage hangs in front of the spine, the lower back curves forward again, and the pelvis tips. The ear, shoulder, hip and ankle fall near one vertical line.", tool: "pencil" },
        { h: "Front and back share one cage", level: 2, t: "Draw the front and back skeletons. They are the same ribcage egg and the same pelvis; what changes is what lies on top: collarbones and sternum in front, shoulder blades and spine behind. The shoulder blades float on the ribs — they are not fixed.", tool: "pencil" },
        { h: "From memory", level: 2, t: "Hide the skeleton level and draw a simplified skeleton inside the three outlines from memory: skull, spine, ribcage egg, pelvis, one bone above each elbow and knee, two below. Then switch the level back on and correct in a different colour.", tool: "pencil" },
      ] },
  ]);

  extend("anat-2", 55, [
    { title: "The masses from the side and behind", exemplar: "muscleSide",
      hints: ["Side view: the masses alternate front and back all the way down.", "Back view: trapezius kite, the V of the lats, two squared glutes."],
      steps: [
        { h: "Two mannequins", level: 1, t: "Trace both mannequins. On the side view, draw a zig-zag down the body touching the front of the chest, the back of the shoulder blades, the front of the belly, the back of the buttocks, the front of the thigh, the back of the calf. That zig-zag is the rhythm of a standing figure.", ...pencil },
        { h: "Lay on the masses", level: 2, t: "Add each mass as one simple form. From the side: the deltoid caps the shoulder, the triceps is behind the arm, the glute is a squared block behind the hip, the calf bulges high on the shin. From behind: the trapezius, the lats sweeping to the armpits, glutes, hamstrings, calves.", tool: "pencil" },
        { h: "Overlap decides the order", level: 2, t: "Where two masses meet, one passes over the other: the deltoid over the top of the biceps and triceps, the glute over the top of the hamstrings, the calf over the Achilles tendon. Go over your drawing and make each overlap a clear T-junction.", tool: "pencil" },
        { h: "Simplify for your style", level: 2, t: "Hide the guides and redraw the back view with only FIVE masses of your choosing. Which five still say 'a back'? That choice is a style decision, and it should be the same five on every page of your comic.", ...ink },
      ] },
    { title: "Close-up: arm and leg", exemplar: "limbMuscles",
      hints: ["Muscles work in pairs on opposite sides of a bone.", "The one doing the work is short and round; its partner is long and flat."],
      steps: [
        { h: "The limbs as tubes", level: 1, t: "Trace the arm and the leg as tubes and ball joints. Note the taper: the upper arm and thigh are thick at the top, the forearm and shin thick just below the joint and thin at the wrist and ankle.", ...pencil },
        { h: "One egg per mass", level: 2, t: "Add the masses: deltoid, biceps, triceps and the forearm wedge on the arm; glute, quadriceps, hamstrings and calf on the leg. Each is an egg lying along its tube. Their widest points are at DIFFERENT heights on the two sides of the limb — never draw them level.", tool: "pencil" },
        { h: "Name them and what they do", level: 3, t: "Turn on the labels and write each name beside your own drawing with one word for its job: bends, straightens, lifts, points. Knowing the job tells you which mass to bulge in any pose.", tool: "pencil" },
        { h: "Bend it", level: 3, t: "Hide the guides. Draw the arm bent to a right angle and the leg bent at the knee. On each, the mass on the INSIDE of the bend is working: draw it shorter and rounder, and its partner longer and flatter. Check against your own arm in a mirror.", tool: "pencil" },
      ] },
  ]);

  extend("anim-1", 30, [
    { title: "The dog from four sides", exemplar: "dogTurn",
      hints: ["Side, three-quarter front, front, three-quarter back.", "From the front the ribcage is a tall egg and the legs hang inside its width."],
      steps: [
        { h: "Four sets of lines", level: 1, t: "Trace the spine and leg lines in all four views. From the side the spine is a long curve; from the front it shrinks to almost a point behind the skull. The leg lines keep their zig-zag in every view.", ...pencil },
        { h: "Volumes: side, then three-quarter", level: 2, t: "Build the side view, then the three-quarter front. The ribcage egg overlaps the pelvis; the near legs are complete and the far legs partly hidden. Keep the feet of the far legs slightly HIGHER on the page than the near ones — they are further away.", tool: "pencil" },
        { h: "Front and back", level: 2, t: "The front view: skull, chest and front legs hide almost everything else. The back three-quarter: pelvis, hind legs and tail lead, and the head is small beyond the shoulders. These are the views beginners avoid; draw each twice.", tool: "pencil" },
        { h: "A real dog, turned", level: 2, t: "Hide the guides. From photo reference of one dog breed, draw it from two different sides using the mannequin. Change the proportions to fit the breed (leg length, chest depth, muzzle length) but keep the construction.", tool: "pencil" },
      ] },
  ]);

  extend("anim-2", 75, [
    { title: "The horse, built", exemplar: "horseBuild",
      hints: ["Deep chest, long legs, joints set high.", "The 'knee' of the front leg is its wrist; the hock is its ankle."],
      steps: [
        { h: "Spine and leg lines", level: 1, t: "Trace the lines in all three views. The neck rises steeply from the withers; the back is nearly level; the legs are long and mostly straight with the bends set high. Mark the hock on each hind leg.", ...pencil },
        { h: "The volumes", level: 2, t: "Build the big side view: a deep ribcage egg, a smaller pelvis, a long wedge of neck, a long skull. The upper legs are muscular and close to the body; below the knee and hock the legs are thin, almost only bone and tendon.", tool: "pencil" },
        { h: "Name the joints", level: 3, t: "Turn on the names and copy them onto your drawing. Then build the two smaller views, front and back. From the front the chest is narrow and deep; from behind the hindquarters are the widest part of the animal.", tool: "pencil" },
        { h: "From reference", level: 3, t: "Hide the guides. Draw two horses from photo reference with this construction, one standing and one moving. Ink the better one, keeping the line light on the lower legs.", ...ink },
      ] },
    { title: "The cat, built", exemplar: "catBuild",
      hints: ["Low, long and loose: the spine does the acting.", "Small round skull, short muzzle."],
      steps: [
        { h: "Spine and leg lines", level: 1, t: "Trace the lines. The cat's spine line is the most expressive of the four animals — arched, stretched, or sagging — so draw it as one confident curve from the nose through to the tip of the tail.", ...pencil },
        { h: "The volumes", level: 2, t: "Build the side view: a narrow ribcage, a loose belly line, pelvis, and legs that fold under the body. The shoulder blades sit high and can rise above the line of the back. The skull is nearly a ball with a short muzzle box.", tool: "pencil" },
        { h: "Name the joints, then the other views", level: 3, t: "Copy the joint names, then build the front and back views. From the front the chest is narrow and the front paws land close together, almost on one line.", tool: "pencil" },
        { h: "Three spines", level: 3, t: "Hide the guides. Draw the same cat three times changing mainly the spine: stretched long, arched high, curled round. Rebuild the volumes on each new spine line.", tool: "pencil" },
      ] },
    { title: "The bear, built", exemplar: "bearBuild",
      hints: ["Plantigrade: heel on the ground, like you.", "Weight low and forward, a hump at the shoulders."],
      steps: [
        { h: "Spine and leg lines", level: 1, t: "Trace the lines. The hind leg has no high hock: the heel is on the ground, so the leg reads thigh, shin, flat foot — a human leg. The back rises to a hump over the shoulders.", ...pencil },
        { h: "The volumes", level: 2, t: "Build the side view: a barrel ribcage, a heavy neck barely narrower than the head, thick limbs with little taper, and big flat feet. Draw the belly line low. Everything is wider than you expect.", tool: "pencil" },
        { h: "Name the joints, then the other views", level: 3, t: "Copy the joint names and compare them with your horse page: the same joints, in very different places. Then build the front and back views — the bear is wide from both.", tool: "pencil" },
        { h: "Standing up", level: 3, t: "Hide the guides. A bear can stand on its hind legs because it is plantigrade. Draw it upright using the HUMAN mannequin with the bear's proportions: short legs, long heavy torso, no visible neck. This is the bridge to designing creatures.", ...ink },
      ] },
  ]);
})();
