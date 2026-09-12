/* ============================================================
   Curriculum · Section 1 — Foundations
   Format (shared by every section file):
     section  { id, num, title, tagline, chapters[] }
     chapter  { id, title, summary, lessons[] }
     lesson   { id, title, minutes, goal, why, refs[], pages[], reflect[] }
     page     { title, exemplar?, hints?[], steps[] }
     step     { h, t, tool?, layer?, guide?, refs? }
   `exemplar` is a key in Exemplars (painted onto the locked Guide
   layer). `tool`/`layer` are applied when the step is opened.
   ============================================================ */
"use strict";
window.PENSHI_CURRICULUM = window.PENSHI_CURRICULUM || [];

PENSHI_CURRICULUM.push({
  id: "s1", num: 1, title: "Foundations",
  tagline: "Shift your brain from 'drawing lines' to 'building volumes' — and learn to actually see.",
  chapters: [

  /* ============================================================ */
  { id: "s1-forms", title: "Drawing in Forms",
    summary: "Everything you will ever draw — a face, a horse, a spaceship — is a handful of simple 3-D volumes wearing a costume. This chapter teaches you to see, build and combine those volumes until you can construct anything from primitives. The real goal isn't the cube: it's the moment your brain stops seeing a flat page and starts seeing SPACE behind it.",
    lessons: [

    { id: "forms-1", title: "Lines you can trust", minutes: 25,
      goal: "Draw straight lines, arcs and ellipses in one confident motion, from the shoulder.",
      why: "Every construction technique in this curriculum assumes you can put a line where you meant to. Hairy, scratchy lines aren't a style — they're the hand outrunning the brain. Ten minutes of this each session is the whole warm-up habit of professional artists.",
      refs: ["drawabox", "proko-basics", "speed"],
      pages: [
        { title: "Ghosted lines", exemplar: "primitives",
          steps: [
            { h: "Hold the pen loosely, move from the shoulder", t: "Grip the pen lightly — if your knuckles are pale, you're strangling it. For any line longer than an inch, lock your wrist and swing from the shoulder; the wrist is a precision joint that wobbles over distance. Draw ten lines across the whole page width from the shoulder before anything else.", tool: "pencil", layer: "Pencils" },
            { h: "Ghost, then commit", t: "Before each line, hover the pen tip along the intended path two or three times without touching (this is 'ghosting'). Your arm learns the motion. Then draw the line in ONE stroke at a steady speed. Never patch a line with little strokes — a slightly-wrong confident line beats a perfect hairy one, because accuracy is trainable and hairiness is a habit.", tool: "pencil" },
            { h: "Connect dot pairs", t: "Place two dots anywhere on the page, then ghost and connect them. Twenty pairs, varying length and angle. Score yourself: does the line START on the first dot and END on the second? Overshooting is fine early; hesitating mid-line is not.", tool: "pencil" },
            { h: "Arcs and curves", t: "Repeat with curves: ghost a C, commit; ghost an S, commit. Curves come from the elbow and shoulder swinging together — feel the pivot. Draw one long serpentine across the whole page in a single motion.", tool: "pencil" },
          ] },
        { title: "Ellipses: drawing through", exemplar: "ellipseDegrees",
          steps: [
            { h: "Draw through the ellipse 2–3 times", t: "An ellipse drawn once is lumpy. Draw it two or three times around in one continuous motion, lightly, and the overlapping passes average into a clean shape. Fill a row of ellipses of increasing 'degree' — from a thin sliver to nearly a circle.", tool: "pencil" },
            { h: "Find the minor axis", t: "Every ellipse has a minor axis (its shortest diameter). It cuts the ellipse into two symmetrical halves AND it points along the direction of the cylinder the ellipse belongs to. After drawing each ellipse, draw its minor axis through it. Symmetry off? That's the fix for next time.", tool: "pencil" },
            { h: "Ellipses in a tube", t: "Draw two long parallel lines (a tube) and fill it with ellipses that touch both sides, changing degree as they go. This is the exercise that later makes wrists, necks, tree trunks and cannon barrels work.", tool: "pencil" },
          ] },
      ],
      reflect: ["Which lines started to feel automatic? Which still needed a conscious ghost?", "Look at your first row and your last row of ellipses. What changed?"] },

    { id: "forms-2", title: "The four primitives", minutes: 35,
      goal: "Construct a cube, cylinder, sphere and cone that feel solid — and add contour lines that prove it.",
      why: "These four volumes are the alphabet. Later, a torso is a bent cylinder, a skull is a sphere with a wedge cut off, a car is two boxes on cylinders. If the primitives feel like flat symbols, everything built from them will too.",
      refs: ["drawabox", "loomis-fun", "proko-basics"],
      pages: [
        { title: "Cube, cylinder, sphere, cone", exemplar: "primitives",
          steps: [
            { h: "The cube starts with a Y", t: "Draw a Y. That's a cube's nearest corner and its three edges going away. Now add the three far edges, each PARALLEL to one arm of the Y. Copy the guide cube, then draw three more with different Y angles — squat Ys give you a view from above; tall Ys, a view from the side.", tool: "pencil", layer: "Pencils" },
            { h: "The cylinder: two ellipses and two lines", t: "Draw the top ellipse, drop two vertical lines from its widest points, then the bottom ellipse — SAME degree or slightly rounder (it's further below eye level). Draw the hidden back half of the bottom ellipse dashed: you must know where it is even when you can't see it.", tool: "pencil" },
            { h: "The sphere is a circle until you add contours", t: "A circle is flat. Add one horizontal ellipse across its middle (the equator) and one vertical (a meridian), both drawn as ellipses that would touch the circle's edge. Suddenly it's a ball. Draw three spheres with the equator ellipse at different degrees — a tilted planet.", tool: "pencil" },
            { h: "The cone", t: "Draw the base ellipse, mark the apex directly above its center (or offset for a leaning cone), and connect apex to the ellipse's widest points. Add one contour ellipse partway up, smaller and the same degree. Notice: the cone is just a cylinder that tapers to nothing.", tool: "pencil" },
            { h: "Ink one of each", t: "Switch to the Inks layer and re-draw your best cube, cylinder, sphere and cone over the pencils with confident single lines. Thicken the edges on the side away from the light. This is the pipeline you'll use for everything: rough in blue, commit in ink.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Contour lines: the proof of solidity", exemplar: "organicForms",
          steps: [
            { h: "Contours follow the surface", t: "A contour line is an ellipse drawn ON the surface of a form, wrapping around it. Draw a sausage (two spheres joined by a tube) and add five contour ellipses along it. Their degree changes as the tube turns toward or away from you.", tool: "pencil", layer: "Pencils" },
            { h: "Bend it", t: "Draw a curved sausage — a banana. Contours on the outside of the curve spread apart; on the inside they bunch up. This single fact is how you'll later draw a bending arm or a twisting torso.", tool: "pencil" },
            { h: "Overlap two", t: "Draw two sausages where one passes in front of the other. The nearer one's outline is unbroken; the far one's outline stops at the overlap. Overlap is the cheapest depth cue there is — use it constantly.", tool: "pencil" },
          ] },
      ],
      reflect: ["Pick your most solid-looking cube. What made it work — the parallel edges, the line weight, or the angle?", "Where did contour ellipses feel wrong? Usually it's their degree."] },

    { id: "forms-3", title: "Boxes in space", minutes: 45,
      goal: "Draw boxes rotated freely in 3-D with edges that converge convincingly — the foundation of perspective without any rulers.",
      why: "This is the exercise that famously produces the 3-D 'click'. Drawabox has thousands of students doing 250 of these because it works: the hand learns convergence as feel before the head learns it as geometry. Do 20 per session, not 250 in one sitting.",
      refs: ["drawabox-250", "drawabox", "norling"],
      pages: [
        { title: "Rotating boxes", exemplar: "boxRotations",
          steps: [
            { h: "One box, then rotate", t: "Copy the guide box. Now draw the next one rotated a little around its vertical axis, as if turning it on a lazy Susan. The Y's two side arms change length as it turns. Fill the first dotted row with a smooth rotation.", tool: "pencil", layer: "Pencils" },
            { h: "Extend the edges to check", t: "Take each box and extend its three sets of parallel edges far out with light lines. Each set should CONVERGE toward a single distant point, never diverge. Diverging lines mean the far face was drawn bigger than the near face — the classic beginner tell. Fix it by shrinking far faces.", tool: "pencil" },
            { h: "Tilt the axis", t: "Second row: boxes rotated around a horizontal axis — tumbling toward you. Third row: both. These are harder because ALL three edge sets now converge visibly. Keep the convergence gentle (far away vanishing points) or the box looks fish-eyed.", tool: "pencil" },
            { h: "Add line weight for depth", t: "Go over the nearest edges (the ones facing you) with slightly heavier lines. Leave far edges light. Watch the boxes pop off the page without any shading at all.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Boxes with things inside", exemplar: "boxRotations",
          steps: [
            { h: "Subdivide a face", t: "Draw a box and find the center of one face with its diagonals. Draw a line through that center parallel to the edges — you've halved the face in perspective (the halves aren't equal on paper, and that's correct). Do this for all three visible faces.", tool: "pencil", layer: "Pencils" },
            { h: "Nest a smaller box", t: "Using the subdivisions, draw a smaller box sitting inside the big one, sharing the same convergence. Then a box sitting ON TOP of the first box, edges aligned. This is how you'll later put a head on a torso, or a cab on a truck.", tool: "pencil" },
            { h: "Cut a box", t: "Draw a box and slice a corner off with a plane — a wedge. Now cut a cylinder-shaped hole through one face (an ellipse on the face, another on the far face, connected by lines). You are now carving, not just stacking.", tool: "pencil" },
          ] },
      ],
      reflect: ["Extend the edges on your five best boxes. How many truly converge?", "Do you feel the space behind the page yet, or are you still drawing on it?"] },

    { id: "forms-4", title: "Combining volumes", minutes: 40,
      goal: "Build recognizable objects purely by stacking, joining and cutting primitives.",
      why: "The shift from 'draw a mug' to 'draw a cylinder, then a torus handle' is THE mental move of construction drawing. Once you name the volumes first, you can draw an object you've never seen from any angle you want.",
      refs: ["drawabox-l2", "loomis-fun", "unsplash"],
      pages: [
        { title: "Named combinations", exemplar: "combineVolumes",
          steps: [
            { h: "Copy each combo, naming the parts out loud", t: "House = box + wedge. Mug = cylinder + torus (a bent tube). Snowman = three spheres. Lamp = cone + thin cylinder. Cart = box + two cylinders. Say the recipe before you draw each one; the naming is the skill.", tool: "pencil", layer: "Pencils" },
            { h: "Re-draw each from a new angle", t: "Now draw the same five objects rotated 45° — you can, because you know the recipe. Start with the biggest volume at the new angle, then attach the others to its faces. If you were copying outlines you'd be stuck; because you built volumes, you're free.", tool: "pencil" },
            { h: "Ink the best two", t: "Commit two objects in ink. Use heavier line weight where forms overlap in front of others.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Your first object hunt",
          hints: ["Look around the room. Pick five objects.", "For each: what's the BIGGEST volume? Draw it first. Then attach the rest.", "No details allowed until all five have their volumes.", "Angles must match what you see — sight-measure them."],
          steps: [
            { h: "Five objects, volumes only", t: "Look at real things around you (or search a noun on Unsplash — link in References). For each object write its recipe in your head: 'kettle = sphere + cylinder spout + torus handle'. Draw the volumes only, lightly. No texture, no shading, no details — those are rewards for later.", tool: "pencil", layer: "Pencils" },
            { h: "Details as attached forms", t: "Now add details — but as MORE VOLUMES. A button is a tiny cylinder on the surface. A seam follows a contour line. A logo sits on a plane. Details that respect the form look real; details floated on top look like stickers.", tool: "pencil" },
            { h: "Ink and self-critique", t: "Ink the best object. Then, in the margin, write one thing that's wrong with it. Naming the error is 80% of fixing it next time.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which object was easiest to break into volumes? Which fought you, and why?"] },

    { id: "forms-5", title: "Intersections and the solidity test", minutes: 40,
      goal: "Draw the seam where two forms pass through each other — the proof that you believe the forms are solid.",
      why: "If you can draw where a cylinder enters a box, you truly understand both as 3-D objects. This is the hardest exercise in the chapter and the one that makes the next four chapters possible: limbs enter torsos, necks enter skulls, wings enter bodies.",
      refs: ["drawabox-l2", "scott-robertson"],
      pages: [
        { title: "Form intersections", exemplar: "formIntersections",
          steps: [
            { h: "Box + cylinder", t: "Copy the guide: a cylinder driving through a box. The seam is where the cylinder's surface meets the box's face — on a flat face it's an ellipse; where it crosses an edge, the seam kinks. Draw the seam as a firm line. Draw the hidden parts dashed.", tool: "pencil", layer: "Pencils" },
            { h: "Sphere + box", t: "A ball half-buried in a box. The seam is a curve on each box face it touches. Think: where is the surface of the ball exactly one box-face away? Draw four different sphere-box overlaps.", tool: "pencil" },
            { h: "Three at once", t: "Draw a box, a cylinder and a sphere all overlapping in a cluster. Every pair needs its seam. This is slow, uncomfortable and exactly the point. Two clusters, then stop.", tool: "pencil" },
          ] },
        { title: "Capstone: draw anything",
          hints: ["Choose something 'hard' — a bicycle, a shoe, a hand mixer.", "Biggest volume first. Attach. Cut. Seam every overlap.", "Only when the volumes are right do you add surface details."],
          steps: [
            { h: "Pick something you 'can't draw'", t: "Choose an object you'd normally avoid. Photograph it or find a clear photo (Unsplash / Pexels). List its recipe: big volume, attached volumes, cuts. If the recipe has more than eight parts, you're overthinking — merge parts.", tool: "pencil", layer: "Pencils" },
            { h: "Build it, then turn it", t: "Draw it from the photo's angle using volumes only. Then — without a photo — draw it rotated 90°. You will get details wrong; the VOLUMES should still be right. That's the whole point of this chapter.", tool: "pencil" },
            { h: "Ink and compare", t: "Ink the second (invented-angle) drawing. Put it next to the photo. Where it fails is your next study subject.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Could you draw the object from an angle you've never seen? That's the test of thinking in 3-D.", "What's one primitive you still can't rotate confidently? Go back to that lesson."] },
    ] },

  /* ============================================================ */
  { id: "s1-observe", title: "Making Observations",
    summary: "Your brain stores objects as symbols — 'eye', 'cup', 'hand' — and draws the symbol instead of the thing in front of you. This chapter breaks that habit using references you open in a browser tab and draw from in Penshi. You will trace very little; you will measure, compare and look until the real shapes replace the symbols.",
    lessons: [

    { id: "obs-1", title: "Seeing versus knowing", minutes: 35,
      goal: "Experience the difference between drawing what you know and drawing what you see.",
      why: "Betty Edwards' famous exercises (upside-down copying, negative space) work because they starve the naming part of your brain. When the 'symbol' can't fire, your eye takes over — and your drawing suddenly improves by a shocking amount in one session.",
      refs: ["edwards", "speed", "loa-stilllife"],
      pages: [
        { title: "Negative space", exemplar: "negativeSpace",
          steps: [
            { h: "Find a chair (or any object with holes)", t: "Look at a real chair, or open the Line of Action still-life tool and pick something with gaps in it. Don't draw the chair. Draw the SHAPES OF AIR between its parts — the trapezoid between the legs, the sliver under the seat. Fill them in solid.", tool: "marker", layer: "Pencils" },
            { h: "Notice what happened", t: "When you're done, the chair is there — drawn correctly, without ever drawing it. Air has no name, so your brain couldn't lie about its shape. Repeat with a second object in the right-hand frame.", tool: "marker" },
            { h: "Now draw it 'normally'", t: "Draw the same chair the ordinary way, but any time an angle looks off, check it against the negative shape next to it. Negative space is the referee you can always call.", tool: "pencil" },
          ] },
        { title: "Upside-down and blind contour",
          hints: ["Find a line drawing online (a simple cartoon or a diagram) and rotate the screen or the image 180°.", "Copy it upside-down, line by line, NOT thinking about what it is.", "Then a blind contour: eyes on the object, never on the page, one continuous line."],
          steps: [
            { h: "Upside-down copy", t: "Open any clean line drawing in a browser tab and rotate it 180° (most image viewers can). Copy it upside-down, treating every line as an abstract line — 'this one goes up-left at about 30°, this curve bulges right'. Don't turn it right-side up until you're finished.", tool: "pencil", layer: "Pencils" },
            { h: "Turn it over", t: "Flip your drawing. It's probably the best copy you've ever made. That's what your eye can do when your knowledge stays out of the way.", tool: "pencil" },
            { h: "Blind contour: your hand", t: "Look at your non-drawing hand and draw its outline in one continuous line WITHOUT looking at the page. It will be a mess and that's fine — the point is to feel your eye tracking an edge at the same speed as your pen. Do three.", tool: "pencil" },
          ] },
      ],
      reflect: ["How different was the upside-down copy from your usual work?", "What did your eye notice about your hand that your brain never had?"] },

    { id: "obs-2", title: "Sight-measuring and angles", minutes: 30,
      goal: "Measure proportions and angles against a reference so that relationships come out right.",
      why: "Nobody draws accurately by 'eyeballing'. Pros measure constantly — one unit against another, every angle against vertical — and it looks effortless only because they've done it ten thousand times. This lesson makes measurement a reflex.",
      refs: ["edwards", "speed", "unsplash"],
      pages: [
        { title: "Units and angles", exemplar: "sightMeasure",
          steps: [
            { h: "Pick a unit", t: "Choose a simple object photo (a bottle, a book, a shoe). Pick its most obvious dimension as your unit — the width of the bottle, say. Everything else gets described in units: 'the height is about 3.2 widths'. Never in inches.", tool: "pencil", layer: "Pencils" },
            { h: "Draw the envelope first", t: "Before any detail, draw the object's bounding box in units: 1 wide, 3.2 tall. Then the biggest sub-shape as a fraction of it. Get the envelope right and the details have nowhere to go wrong.", tool: "pencil" },
            { h: "Angles against the clock", t: "For every slanted edge, ask: relative to vertical, is this 10°? 30°? 45°? Hold the pen along the edge on screen, then swing it to your page keeping the angle. Draw a small clock face in the margin and mark each angle before committing.", tool: "pencil" },
            { h: "Plumb lines and level lines", t: "Draw a vertical line through the reference (a plumb line) and note what lands on it — 'the spout is directly above the left foot'. Do a horizontal one too. Two or three of these lock the whole drawing together.", tool: "pencil" },
          ] },
        { title: "Measured study", exemplar: "obsFrame",
          steps: [
            { h: "Three objects, measured", t: "Draw three objects from photos using ONLY measurement: envelope, units, angles, plumb lines. Take ten minutes each. Resist detail until the envelope and sub-shapes agree with the reference.", tool: "pencil", layer: "Pencils" },
            { h: "Overlay check", t: "If your photo is on the same screen, drag the browser to sit beside Penshi (Win + ← / →). Compare side by side. Write one measurement you got wrong for each object.", tool: "pencil" },
          ] },
      ],
      reflect: ["What kind of error do you make most — too tall, too wide, angles too steep? That's your bias; correct for it consciously next time."] },

    { id: "obs-3", title: "Reference study: everyday objects", minutes: 45,
      goal: "Complete two finished observational drawings from linked references, combining measurement with volume thinking.",
      why: "Observation plus construction is the professional method: you measure what's there, and you build it from volumes so it holds together. Two studies done carefully teach more than twenty done fast.",
      refs: ["unsplash", "pexels", "loa-stilllife", "ctrlpaint"],
      pages: [
        { title: "Study 1: something with a handle", exemplar: "obsFrame",
          hints: ["Search Unsplash for 'coffee mug' or 'kettle'. Pick a photo with clear light.", "Envelope → biggest volume → attached volumes → measured angles → details.", "The thirds grid on this page: note which crossing the handle sits on."],
          steps: [
            { h: "Set up the reference", t: "Open Unsplash or Pexels in a browser tab and search 'mug' or 'kettle'. Choose a photo with one clear light source and the handle visible. Snap the browser beside Penshi so you can glance, not turn.", tool: "pencil", layer: "Pencils" },
            { h: "Envelope and volumes", t: "Draw the bounding box in units. Place the main cylinder — get its top ellipse degree from the photo by comparing height-to-width of the ellipse. Attach the handle as a bent tube that ENTERS the cylinder wall (a seam, not a line stuck on).", tool: "pencil" },
            { h: "Measure the details in", t: "Rim thickness, where the handle attaches (measure from the top in units), the base's ellipse degree (rounder than the top, since it's lower). Check three plumb lines against the photo.", tool: "pencil" },
            { h: "Ink with intention", t: "On the Inks layer, commit the drawing. Heavy line on the shadow side and where the mug meets the table; thin on the lit side. Leave shading for the Shading chapter — a well-constructed line drawing needs none.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Study 2: something soft", exemplar: "obsFrame",
          hints: ["Search 'sneaker' or 'backpack' — objects with a firm core and a soft skin.", "Find the hidden volume (a shoe is a wedge on a block). Draw it before the wrinkles."],
          steps: [
            { h: "Find the hidden volume", t: "Soft objects still have a hard structure inside: a shoe is a wedge for the foot + a block heel; a backpack is a box with fabric hanging off it. Draw that structure first, from measurement.", tool: "pencil", layer: "Pencils" },
            { h: "Let the soft parts sag off the structure", t: "Now draw the surface where it departs from the volume — where fabric slumps, where laces pull. Every wrinkle points at something that's pulling it. You'll learn the full theory in the Fabrics chapter; for now, just observe and copy the biggest folds.", tool: "pencil" },
            { h: "Ink and keep it", t: "Ink it. This page and Study 1 go into your Portfolio — in three months, redraw the same two objects and compare. That comparison is worth more than any tutorial.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which was harder — the hard object or the soft one? Why?", "Did you draw the structure of the shoe first, or the wrinkles? Be honest."] },

    { id: "obs-4", title: "Reference study: living things", minutes: 45,
      goal: "Observe and draw a plant and a hand — subjects with no straight lines — using the same measure-then-build method.",
      why: "Natural forms are where beginners give up on measurement and start guessing. Plants teach you growth patterns and rhythm; the hand teaches you that even the most complex subject is still volumes and angles. Both set up the Gesture and Figure chapters.",
      refs: ["unsplash", "loa-hands", "drawabox-l2"],
      pages: [
        { title: "A plant: rhythm and branching", exemplar: "obsFrame",
          hints: ["Search 'potted plant' or 'leaf branch' on Unsplash.", "Draw the flow lines of stems FIRST, then hang leaves on them.", "Leaves are planes — draw the midrib as a curve in space, then the outline around it."],
          steps: [
            { h: "Stems as flow lines", t: "Find the main stem and draw it as one confident curve. Every branch leaves the stem at an angle — measure a few. Plants branch with rhythm, not randomness: alternate, opposite, or spiral. Which is yours?", tool: "pencil", layer: "Pencils" },
            { h: "Leaves as planes on a midrib", t: "For each leaf: draw the midrib as a curve in space (it bends and twists), then the leaf outline around it, foreshortened if the leaf faces away. A leaf seen edge-on is a line. Draw six leaves at six different tilts.", tool: "pencil" },
            { h: "Overlap for depth", t: "Where leaves cross, the front one is unbroken. Ink the study, letting nearer leaves get heavier lines.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Your own hand", exemplar: "obsFrame",
          hints: ["Use your non-drawing hand as the model. Three poses: relaxed, fist, holding the pen.", "Palm first as a flat mitten; fingers as tubes fanning from a curve.", "Measure: how many finger-widths across the palm? Where does the thumb tip reach?"],
          steps: [
            { h: "Palm as a mitten", t: "Draw the palm as a rounded box first — no fingers. Measure its proportions: about as long as the middle finger. The thumb's base is a separate wedge on the side of that box.", tool: "pencil", layer: "Pencils" },
            { h: "Fingers from a curve", t: "The knuckles sit on an ARC, not a straight line. Draw that arc, then each finger as a tapered tube from it in three segments. Measure each finger's length against the middle one.", tool: "pencil" },
            { h: "Three poses", t: "Relaxed, fist, holding the pen. Each pose is a different set of tube angles on the same mitten. This is a preview of the hands lesson in the Figure Drawing chapter — you'll come back here far more confident.", tool: "pencil" },
          ] },
      ],
      reflect: ["Where did you stop measuring and start guessing? Mark it on the page.", "The hand is the subject artists fear most. How does it feel now, after treating it as tubes on a box?"] },
    ] },
  ],
});
