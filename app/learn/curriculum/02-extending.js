/* Curriculum · Section 2 — Extending Beyond Foundations */
"use strict";
window.PENSHI_CURRICULUM = window.PENSHI_CURRICULUM || [];

PENSHI_CURRICULUM.push({
  id: "s2", num: 2, title: "Extending Beyond Foundations",
  tagline: "Make things sit in believable space, carry believable light, and move with believable life.",
  chapters: [

  /* ============================================================ */
  { id: "s2-persp", title: "Perspective Basics",
    summary: "Perspective is the set of rules that turns volumes into a SCENE — objects sharing one space, one eye level, one set of vanishing points. Penshi's Guides tab has a live 1/2/3-point grid with draggable vanishing points; these lessons turn it on for you and teach you to work with it, then without it.",
    lessons: [

    { id: "persp-1", title: "The horizon is your eye level", minutes: 30,
      goal: "Understand and place the horizon line, and predict what you see above and below it.",
      why: "Every perspective mistake traces back to one confusion: the horizon is not 'where the land ends'. It's the height of YOUR eyes. Once that's felt, every other rule follows from it.",
      refs: ["norling", "storey", "loa-env"],
      pages: [
        { title: "Above and below", exemplar: "persp1pt",
          steps: [
            { h: "Turn on the grid", t: "This step switches on Penshi's 1-point perspective guide. The blue horizontal line is the horizon — your eye level. Drag it up: you're standing tall or floating. Drag it down: you're crouching. The scene's whole mood changes with that one line.", guide: { persp: true, vps: 1 } },
            { h: "Boxes above, on, and below", t: "Draw a box whose top is BELOW the horizon: you see its top face. Draw one ABOVE the horizon: you see its underside. One straddling it: you see neither top nor bottom, only sides. Label each. This is the whole rule.", tool: "pencil", layer: "Pencils" },
            { h: "Same box, three horizons", t: "Move the horizon line to three heights and draw the same box each time, keeping it the same size on the page. Notice how a low horizon makes the box loom (heroic) and a high one makes it small and mapped (overview).", tool: "pencil" },
            { h: "People on the horizon", t: "Draw three stick figures of the same height at different distances, all standing on flat ground. Their EYES all sit on the horizon line (because they're your height). A shorter figure's eyes sit below it. This trick places crowds instantly.", tool: "pencil" },
          ] },
      ],
      reflect: ["Describe the horizon in your own words without using 'sky' or 'ground'.", "Look at a photo — can you find the eye level from the boxes in it?"] },

    { id: "persp-2", title: "One-point perspective", minutes: 40,
      goal: "Draw boxes, a room and a street in one-point perspective using the vanishing point.",
      why: "One-point is the view straight down a corridor, a road, a row of buildings. It's the simplest system and it's everywhere in comics — establishing shots, hallways, the classic 'walking toward the camera'.",
      refs: ["norling", "chelsea", "storey"],
      pages: [
        { title: "Boxes to the VP", exemplar: "persp1pt",
          steps: [
            { h: "Front face flat, depth to the VP", t: "In one-point, one face of the box faces you square-on — draw it as a plain rectangle. From each corner, draw a light line toward the vanishing point. Cut those lines with a smaller rectangle to set the depth. Done. Draw five, scattered around the page, all aiming at the same VP.", guide: { persp: true, vps: 1 }, tool: "pencil", layer: "Pencils" },
            { h: "Use the Line tool with Shift", t: "Penshi's Line tool snaps to 15° with Shift, and the guide grid shows the rays. Use it for construction lines toward the VP, then draw the box edges freehand over them. Rulers for setup, hand for the drawing.", tool: "line" },
            { h: "Stack and cut", t: "Put one box on top of another. Cut a doorway into one (the door's top and bottom aim at the VP; its sides stay vertical). Verticals in one- and two-point perspective are ALWAYS vertical.", tool: "pencil" },
          ] },
        { title: "A room and a street", exemplar: "perspRoom",
          steps: [
            { h: "The room", t: "Draw the back wall as a rectangle. Its four corners each send a line toward the VP, and those are your floor, ceiling and side walls. Put the VP off-center for a more natural view. Add a door on the left wall and a window on the right — their horizontal edges aim at the VP.", guide: { persp: true, vps: 1 }, tool: "pencil", layer: "Pencils" },
            { h: "Furniture on the floor", t: "A table is a box on the floor plane: front edge flat, depth to the VP, legs vertical. A rug is a rectangle whose sides aim at the VP. Everything shares the one VP, so everything belongs to the same room.", tool: "pencil" },
            { h: "Turn it into a street", t: "New page area (or page tab ＋): the same construction, but the 'walls' are building fronts and the 'floor' is the road. Windows repeat: divide a wall face with the diagonal trick from Boxes in Space to keep spacing correct as it recedes.", tool: "pencil" },
            { h: "Ink one scene", t: "Ink the room or the street. Line weight: heavy for the nearest edges, tapering into the distance. This is your first believable space.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Did the furniture feel like it sat on the floor, or floated? Floating usually means its base wasn't drawn aiming at the VP."] },

    { id: "persp-3", title: "Two-point perspective", minutes: 45,
      goal: "Draw boxes and a building corner in two-point perspective, with vanishing points far enough apart to avoid distortion.",
      why: "Two-point is how we usually see things — standing near the corner of a building, looking at a box on a table. It's the workhorse of environment drawing. The single most common error is VPs too close together, which produces a fish-eye warp.",
      refs: ["norling", "scott-robertson", "chelsea"],
      pages: [
        { title: "The corner", exemplar: "persp2ptBox",
          steps: [
            { h: "Switch to 2-point", t: "The guide now has two vanishing points on the horizon. Drag them apart — as far as the canvas allows, even past its edges. Draw the nearest vertical edge of a box, then send its top and bottom ends toward BOTH VPs. Cut with two more verticals.", guide: { persp: true, vps: 2 }, tool: "pencil", layer: "Pencils" },
            { h: "Distortion test", t: "Deliberately drag the VPs close together and draw a box. See the warp? That's the 'wide-angle' look — fine for a dramatic panel, wrong for a normal one. Push the VPs back out and draw the same box; it relaxes.", tool: "pencil" },
            { h: "Six boxes, one world", t: "Draw six boxes of different sizes scattered around, all obeying the same two VPs. Some above the horizon, some below. They'll read as objects in one room, because they share one eye level and one pair of VPs.", tool: "pencil" },
          ] },
        { title: "A building on a corner", exemplar: "persp2ptBox",
          steps: [
            { h: "The main block", t: "One big box, nearest corner toward the viewer. Then a smaller box on top (a penthouse) and a step-out at the base (an entrance). All share the VPs.", guide: { persp: true, vps: 2 }, tool: "pencil", layer: "Pencils" },
            { h: "Windows in perspective", t: "Divide each face with diagonals to find perspective-correct halves, quarters, eighths. Windows go in the divisions. Their spacing tightens as the face recedes — that tightening is what makes the building look big.", tool: "pencil" },
            { h: "A figure for scale", t: "Put a person at the door. Their eyes on the horizon if they're your height. Now the building has a size. Ink the whole thing.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["How far apart did the VPs need to be before the boxes stopped warping?", "Did you keep the verticals truly vertical?"] },

    { id: "persp-4", title: "Circles, cylinders and gridding a scene", minutes: 40,
      goal: "Place circles and cylinders correctly in perspective and lay a floor grid to position anything in a scene.",
      why: "Wheels, cups, arches, barrels, tables — circles are everywhere, and a circle in perspective is an ellipse whose center is NOT where you'd guess. The floor grid is the tool that lets you put an object exactly where you want it in a scene.",
      refs: ["norling", "scott-robertson", "drawabox"],
      pages: [
        { title: "Circle in a square", exemplar: "circleInPersp",
          steps: [
            { h: "Square first, then diagonals", t: "Draw a square lying on the floor in one-point perspective (front edge flat, sides to the VP, back edge shorter). Draw its diagonals: where they cross is the TRUE center — noticeably further back than halfway. Draw the midlines through that center.", guide: { persp: true, vps: 1 }, tool: "pencil", layer: "Pencils" },
            { h: "Fit the ellipse", t: "The circle touches the square at the four midpoints. Draw an ellipse through those four points. Its widest part sits slightly in FRONT of the perspective center — correct, not a mistake. Do this three times at different distances from the horizon; the ellipses get thinner as they approach it.", tool: "pencil" },
            { h: "A cylinder standing up", t: "Two such ellipses, one above the other, joined by verticals. The lower one is rounder (further from eye level). Now a cylinder lying DOWN, aimed at the VP: its ellipses' minor axes point at the VP. That's a wheel, a pipe, a cannon.", tool: "pencil" },
          ] },
        { title: "The floor grid", exemplar: "perspRoom",
          steps: [
            { h: "Lay the grid", t: "Draw a row of equal marks along the front edge of the floor. Send each to the VP. Draw one diagonal across the whole floor — wherever it crosses a receding line, draw a horizontal. That's a perspective-correct grid of squares. (The diagonal transfers equal spacing into depth.)", guide: { persp: true, vps: 1 }, tool: "pencil", layer: "Pencils" },
            { h: "Place objects on squares", t: "Now anything sits on a specific square: a chair three squares back and two to the left. Draw four boxes on chosen squares. The grid gives you scale automatically — a box two squares wide near the front is the same 'real' size as a box two squares wide at the back.", tool: "pencil" },
            { h: "Ink the scene", t: "Ink the boxes, not the grid. Keep the grid on the Pencils layer and hide it: the scene should feel measured, not gridded.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Where was the true center of your perspective square — did it surprise you?", "Can you now put a coffee cup exactly 'three tiles back' in a scene?"] },
    ] },

  /* ============================================================ */
  { id: "s2-shading", title: "Shading",
    summary: "Shading is the illusion of light on form. The skill isn't 'making things dark' — it's controlling VALUE (how light or dark) so the eye reads a form turning away from a light source. You'll build a value scale, learn the five zones on a sphere, translate them to cubes and cylinders, then learn the comics-specific tools: hatching, cross-hatching, feathering and spotting blacks.",
    lessons: [

    { id: "shade-1", title: "Value: the scale and the squint", minutes: 30,
      goal: "Build a controlled 9-step value scale with three tools, and learn to see value by squinting.",
      why: "Value does 90% of the work in any image — a drawing with good values and bad color still reads; the reverse doesn't. Before you can put light on a form you need to be able to hit a specific grey on purpose.",
      refs: ["ctrlpaint", "gurney-book", "speed"],
      pages: [
        { title: "The value scale", exemplar: "valueScale",
          steps: [
            { h: "Pencil scale", t: "Fill the nine boxes from white to black using the Pencil tool with pressure. Light pressure, then heavier, then layered strokes. Each step should be a visibly even jump from the last. It will take several passes — that's normal.", tool: "pencil", layer: "Pencils" },
            { h: "Marker scale", t: "Repeat the row just below with the Marker tool: it's translucent, so overlapping passes build value. Count the passes — 'three passes = step 5'. That's control.", tool: "marker", layer: "Colors" },
            { h: "Ink hatching scale", t: "A third row in Ink only: value from LINE DENSITY. Sparse hatching for light, tighter for mid, cross-hatched for dark, solid black at the end. This is how comics get tone on a press that only prints black.", tool: "ink", layer: "Inks" },
            { h: "The squint test", t: "Squint at your three scales until the boxes blur. Where two neighbors merge into one grey, the step is too small; where a jump is obvious, too big. Fix the worst two. Squinting is the value-checking tool you'll use forever.", tool: "pencil" },
          ] },
      ],
      reflect: ["Which tool gave you the most control over value? Which was hardest to keep even?"] },

    { id: "shade-2", title: "One light, five zones", minutes: 40,
      goal: "Shade a sphere, cube and cylinder from a single light source, naming the five zones on each.",
      why: "Every lit form has the same anatomy: highlight, light, core shadow, reflected light, cast shadow. Learn it once on the primitives and you can light a face, a car or a planet — because they're all primitives.",
      refs: ["ctrlpaint", "gurney-book", "gurney-blog"],
      pages: [
        { title: "The sphere", exemplar: "sphereShade",
          steps: [
            { h: "Decide the light first", t: "Draw the arrow. Every decision after this is downstream of it. The light hits from the upper left in the guide — mark on your sphere where the surface faces the light most directly: that's the highlight.", tool: "pencil", layer: "Pencils" },
            { h: "The terminator", t: "Find the line where the surface turns away from the light — the terminator. On a sphere it's a curve (an ellipse through the sphere), not a straight line. Just past it, the CORE SHADOW: the darkest band, because no direct light reaches it and no reflected light has arrived yet.", tool: "pencil" },
            { h: "Halftone and reflected light", t: "Between highlight and terminator, the value gradually darkens: that's the halftone. Beyond the core shadow, the surface lightens slightly again — reflected light bouncing up from the table. Keep reflected light DARKER than any halftone or the form goes flat.", tool: "marker", layer: "Colors" },
            { h: "Cast shadow", t: "The sphere blocks light and casts a shadow on the table, on the side away from the light. It's darkest right under the sphere (the occlusion shadow) and softens at its far edge. Its shape is an ellipse stretched away from the light.", tool: "marker" },
          ] },
        { title: "Cube and cylinder, same light", exemplar: "sphereShade",
          steps: [
            { h: "The cube: planes, not gradients", t: "Each face of a cube faces the light at one angle, so each face is ONE value: the top brightest, the side facing the light medium, the side away dark. No gradient within a face. Three flat values and a cast shadow — that's a lit cube.", tool: "marker", layer: "Colors" },
            { h: "The cylinder: a gradient in one direction", t: "A cylinder curves in one direction, so its shading is a gradient going around it but constant along its length. Highlight stripe, halftone, core shadow stripe, reflected light — all vertical bands. The top ellipse is one flat value (it's a plane).", tool: "marker" },
            { h: "Comics translation", t: "Now redo all three forms in Ink only with a 3-value rule: white, one hatch texture for halftone, solid black for core + cast shadow. Squint. If the forms still read, you've learned how comics are lit.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which zone did you overdo? (Almost everyone makes reflected light too bright.)", "Did the ink version read as well as the marker version when you squinted?"] },

    { id: "shade-3", title: "Mark-making: hatching, blending, texture", minutes: 40,
      goal: "Control value with five different mark-making techniques and choose each for a purpose.",
      why: "In comics you're rarely blending — you're rendering with lines a press can print. Hatching direction can describe form (following the surface) or flatten it (ignoring it). This lesson gives you a vocabulary of marks and the judgment to pick one.",
      refs: ["ctrlpaint", "mccloud", "framed-ink"],
      pages: [
        { title: "Five textures, one value", exemplar: "hatchTypes",
          steps: [
            { h: "Hatching", t: "Fill the first box with parallel lines. Value comes from spacing and line thickness; direction is a choice. Keep every line the same confident stroke — hatching is the ghosted-line drill with a purpose.", tool: "ink", layer: "Inks" },
            { h: "Cross-hatching", t: "A second layer of lines across the first. Two layers = darker; three = darker still. Vary the angle between layers (around 60°) so it doesn't turn into a grid. Cross-hatching is the workhorse for pen-and-ink shadow.", tool: "ink" },
            { h: "Contour hatching", t: "Lines that CURVE with the surface — like the contour ellipses from Foundations, but many, tightly spaced. This is the technique that makes hatched forms look round. Fill the box with curves that bulge as if over a cylinder.", tool: "ink" },
            { h: "Stippling and scumbling", t: "Dots for a soft, grainy value (slow, meditative, great for skin or stone). Scumbling — small looping scribbles — for rough textures like foliage or fur. Fill the last two boxes.", tool: "ink" },
          ] },
        { title: "Smooth blending and feathering",
          hints: ["Marker tool at 40–60% opacity: overlapping passes blend.", "Feathering: hatch lines that TAPER from thick to nothing — the classic comics transition into shadow."],
          steps: [
            { h: "Smooth gradient", t: "With the Marker tool, lay a gradient from black to white across the page width in overlapping passes, each starting a little further right. No hard edges. This is what you'll use for skies, smoke and soft form on the Colors layer.", tool: "marker", layer: "Colors" },
            { h: "Feathering", t: "Feathering is comics' answer to blending: a row of ink strokes that start heavy on the shadow side and taper to hairlines toward the light. Pressure→size on. Draw a sphere and feather its core shadow. Then a cheekbone.", tool: "ink", layer: "Inks" },
            { h: "Pick a texture for each material", t: "Draw four small squares labeled wood, metal, cloth, stone, and render each with the technique that suits it (long parallel hatch for wood grain, hard highlight + smooth gradient for metal, soft cross-hatch for cloth, stipple for stone). Judgment is the skill here.", tool: "ink" },
          ] },
      ],
      reflect: ["Which mark do you reach for by default? Try banning it for one drawing to force range."] },

    { id: "shade-4", title: "Lighting scenarios", minutes: 40,
      goal: "Light the same head four ways and understand what each lighting angle communicates.",
      why: "Light is direction, and direction is meaning. Front light is flat and honest; side light is dramatic; rim light is mystery. Comics artists choose lighting the way film directors do — for the story beat, not for accuracy.",
      refs: ["gurney-book", "gurney-blog", "framed-ink", "ctrlpaint"],
      pages: [
        { title: "Four setups", exemplar: "lightScenarios",
          steps: [
            { h: "Front light", t: "Light from the viewer's direction. Almost no shadow on the face — value flattens, shapes read by outline. Good for clarity and innocence. Shade the first head with only slight shadows under the brow, nose and chin.", tool: "marker", layer: "Colors" },
            { h: "Three-quarter (Rembrandt)", t: "Light from 45° up-left. The nose casts a shadow that just meets the cheek shadow, leaving a lit triangle under the far eye. This is THE portrait light — maximum form with a readable face. Shade the second head.", tool: "marker" },
            { h: "Side (split) light", t: "Light from exactly the side: half the face lit, half in shadow, split down the centerline. Conflict, duality, the villain's reveal. Shade the third head, keeping the shadow side almost solid.", tool: "marker" },
            { h: "Rim / back light", t: "Light from behind. The face is in shadow except a bright edge along one side — a silhouette with a glowing outline. Mystery and menace. Ink the fourth head as solid black with a thin white rim.", tool: "ink", layer: "Inks" },
            { h: "Spot the blacks", t: "Below the four heads, redraw each as a comics inker would: pure black shapes only, no halftone. Which setup gives the most striking black shape? That's the one to use for a dramatic panel.", tool: "ink" },
          ] },
      ],
      reflect: ["For a scene where a character receives bad news, which of the four would you pick, and why?"] },
    ] },

  /* ============================================================ */
  { id: "s2-gesture", title: "Gesture Drawing",
    summary: "Gesture is the pose's ENERGY: what the body is doing, the rhythm of force through it, drawn in seconds before any anatomy. Stiff figures come from starting with outlines; alive figures come from starting with gesture. You will draw from timed photo references (linked, free) — dozens per session, most of them ugly, all of them useful.",
    lessons: [

    { id: "gest-1", title: "The line of action", minutes: 30,
      goal: "Capture a pose in a single line, then a second, then build the bean on it.",
      why: "The line of action is the spine of the drawing — the one curve that says 'reaching', 'slumping', 'lunging'. Every animator, every comics artist starts here. Your FORCE book (in the Library tab) is an entire method built on this idea of directed force.",
      refs: ["force", "proko-gesture", "loa-figure", "quickposes"],
      pages: [
        { title: "C, S and I", exemplar: "gestureLines",
          steps: [
            { h: "Copy the three", t: "C: a body bending or reaching. S: a body twisting with weight on one leg (contrapposto). I: rigid, tense, still. Copy each five times, fast and big, from the shoulder.", tool: "pencil", layer: "Pencils" },
            { h: "Straights against curves", t: "Mattesi's FORCE principle: where the body pushes into something (a planted leg, a braced arm) draw a STRAIGHT; where it stretches away, draw a CURVE. A pose is a rhythm of straight-curve-straight. Draw six poses from imagination as only 3–4 lines each, alternating straights and curves.", tool: "pencil" },
            { h: "Timed references: 30 seconds", t: "Open Line of Action's figure tool (References) and set the timer to 30 seconds. For each pose, draw ONLY the line of action and the second rhythm line. No heads, no hands. Twenty poses. If any drawing looks 'good', you spent too long on it.", tool: "pencil" },
          ] },
        { title: "The bean", exemplar: "beanFigure",
          steps: [
            { h: "Ribcage and pelvis on the line", t: "On a line of action, hang two masses: an egg for the ribcage and a smaller egg for the pelvis, pinched at the waist — the bean. They TILT AGAINST each other in most poses. Copy the guide, then draw the bean on ten different lines of action.", tool: "pencil", layer: "Pencils" },
            { h: "Timed: 60 seconds with the bean", t: "Line of Action, 60-second timer. Line of action, then the bean, then quick lines for limbs — no more. Fifteen poses. Notice how much the pelvis tilt alone communicates weight.", tool: "pencil" },
            { h: "Pick one and push it", t: "Choose your best gesture and redraw it exaggerating the line of action 20% further. Comics figures are pushed; life drawing is measured. Learn to do both on purpose.", tool: "pencil" },
          ] },
      ],
      reflect: ["Which lines were straights and which curves in your favorite pose? Did the choice match where the weight was?"] },

    { id: "gest-2", title: "Weight, balance and rhythm", minutes: 40,
      goal: "Draw figures that stand up — balanced over their support — with rhythm flowing through the limbs.",
      why: "A figure that isn't balanced looks wrong before any anatomy is judged. Balance is a physics question (where is the weight over the feet?) and rhythm is the flow of one form into the next. Both are learned at gesture speed.",
      refs: ["proko-gesture", "force", "loa-figure", "posemaniacs"],
      pages: [
        { title: "Center of gravity", exemplar: "beanFigure",
          steps: [
            { h: "The plumb line from the pit of the neck", t: "Drop a vertical from the pit of the neck (between the collarbones). If the figure stands on one leg, that line lands on that foot. On two legs, between them. Draw six standing poses from Line of Action and mark this plumb line on each — do they balance?", tool: "pencil", layer: "Pencils" },
            { h: "Contrapposto", t: "Weight on one leg: that hip rises, the shoulders tilt the opposite way to compensate, the head tilts back toward level. The spine makes an S. Draw it from the front, then the back — the hip and shoulder lines are the whole story.", tool: "pencil" },
            { h: "Motion: off-balance on purpose", t: "A running figure is falling forward and catching itself. Draw three poses where the plumb line lands AHEAD of the feet — that reads as motion. Behind the feet reads as recoiling.", tool: "pencil" },
          ] },
        { title: "Rhythm through the limbs",
          hints: ["Line of Action, 2-minute timer, 10 poses.", "Trace the rhythm: a curve that flows from the shoulder, down the arm, into the hand — then out the fingertip.", "Limbs are tapered tubes hung on the rhythm line."],
          steps: [
            { h: "Two-minute gestures", t: "Longer timer now: line of action, bean, then limbs as flowing rhythm lines (not tubes yet). The arm's rhythm continues the torso's twist. Ten poses.", tool: "pencil", layer: "Pencils" },
            { h: "Tubes on the rhythms", t: "Take your three best and add tapered tubes on the limb rhythms, keeping the flow. Overlap at the joints (upper arm in front of forearm, or behind). This is the bridge into the Body Construction chapter.", tool: "pencil" },
            { h: "Ink one at speed", t: "Ink your best gesture in under two minutes with the Ink tool. Pressure heavy on the load-bearing lines (the planted leg, the braced arm), light on the stretching ones. Save this page — it's the baseline you'll compare against in the Figure Drawing chapter.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which poses fell over? What was the plumb line doing?", "Try a 10-minute gesture session tomorrow before drawing anything else. That's the habit."] },
    ] },
  ],
});
