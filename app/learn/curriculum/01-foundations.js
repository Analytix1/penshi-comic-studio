/* ============================================================
   Curriculum · Section 1 — Foundations
   Format (shared by every section file):
     section  { id, num, title, tagline, chapters[] }
     chapter  { id, title, summary, lessons[] }
     lesson   { id, title, minutes, goal, why, refs[], pages[], reflect[] }
     page     { title, exemplar?, hints?[], steps[] }
     step     { h, t, tool?, layer?, guide?, drill?, refs? }
   `exemplar` is a key in Exemplars (painted onto the locked Guide
   layer). `tool`/`layer` are applied when the step is opened.
   `drill: {seconds, poses}` puts a timed-drill launcher on the step.
   ============================================================ */
"use strict";
window.PENSHI_CURRICULUM = window.PENSHI_CURRICULUM || [];

PENSHI_CURRICULUM.push({
  id: "s1", num: 1, title: "Foundations",
  tagline: "Shift your brain from 'drawing lines' to 'building volumes' — and learn to actually see.",
  chapters: [

  /* ============================================================ */
  { id: "s1-forms", title: "Drawing in Forms",
    summary: "Everything you will ever draw — a face, a horse, a spaceship — is a handful of simple 3-D volumes wearing a costume. This chapter teaches you to see, build and combine those volumes until you can construct anything from primitives. The real goal isn't the cube: it's the moment your brain stops seeing a flat page and starts seeing SPACE behind it. Expect that moment somewhere around your hundredth box, not your tenth.",
    lessons: [

    { id: "forms-1", title: "Lines you can trust", minutes: 35,
      goal: "Draw straight lines, arcs and ellipses in one confident motion, from the shoulder, and know how to diagnose your own line faults.",
      why: "Every construction technique in this curriculum assumes you can put a line where you meant to. Hairy, scratchy lines aren't a style — they're the hand outrunning the brain, and they hide errors you need to see. Ten minutes of this each session is the whole warm-up habit of professional artists; Drawabox opens with it and Proko's Drawing Basics returns to it constantly. Nothing else in the course works without it, and it never stops being useful.",
      refs: ["drawabox", "proko-basics", "speed"],
      pages: [
        { title: "Ghosted lines", exemplar: "primitives",
          steps: [
            { h: "Hold the pen loosely, move from the shoulder", t: "Grip the pen lightly — if your knuckles are pale, you're strangling it, and a strangled pen can only make short, cramped marks. For any line longer than an inch, lock your wrist and swing from the shoulder; the wrist is a precision joint that wobbles over distance, while the shoulder is a big hinge that travels straight. Sit back from the screen so the arm has room. Draw ten lines across the whole page width from the shoulder before anything else, and watch your elbow: if it stays glued to your side, the wrist is doing the work.", tool: "pencil", layer: "Pencils" },
            { h: "Ghost, then commit", t: "Before each line, hover the pen tip along the intended path two or three times without touching (this is 'ghosting'). Your arm learns the motion while nothing is at stake. Then draw the line in ONE stroke at a steady speed, slightly faster than feels safe. Never patch a line with little strokes — a slightly-wrong confident line beats a perfect hairy one, because accuracy is trainable and hairiness is a habit that gets harder to break every time you indulge it. If a line goes wrong, leave it and draw the next one beside it.", tool: "pencil" },
            { h: "Connect dot pairs", t: "Place two dots anywhere on the page, then ghost and connect them. Twenty pairs, varying length and angle: long horizontals, short diagonals, a few near-verticals. Score yourself on two things only — does the line START on the first dot, and does it END on the second? Overshooting is fine early; hesitating mid-line is not. If you consistently miss the end dot on one side, that's your arm's bias: aim a little past it next time.", tool: "pencil" },
            { h: "Arcs and curves", t: "Repeat with curves: ghost a C, commit; ghost an S, commit. Curves come from the elbow and shoulder swinging together — feel the pivot at the elbow for tight arcs and at the shoulder for wide ones. Draw one long serpentine across the whole page in a single motion, then five more nested inside it, each following the first at an even distance. Even spacing between parallel curves is the test: it proves the arm reproduced the same motion.", tool: "pencil" },
            { h: "Diagnose your lines", t: "Look at the page and sort your lines into three faults: wobbly (speed too slow, or wrist-driven), arcing when meant straight (the shoulder swings in an arc — compensate by aiming slightly against the curve), and hairy (multiple passes — stop that entirely). Write your worst fault in the margin. That's the one to watch during every warm-up this week.", tool: "pencil" },
          ] },
        { title: "Ellipses: drawing through", exemplar: "ellipseDegrees",
          steps: [
            { h: "Draw through the ellipse 2–3 times", t: "An ellipse drawn once is lumpy. Draw it two or three times around in one continuous motion, lightly, and the overlapping passes average into a clean shape — the eye reads the average. Fill a row of ellipses of increasing 'degree' — from a thin sliver to nearly a circle — matching the guide row. Keep the speed constant around the whole loop; most lumps come from slowing at the pointy ends.", tool: "pencil" },
            { h: "Find the minor axis", t: "Every ellipse has a minor axis (its shortest diameter). It cuts the ellipse into two symmetrical halves AND it points along the direction of the cylinder the ellipse belongs to — a fact that will matter enormously in perspective. After drawing each ellipse, draw its minor axis through it and check: are the two halves mirror images? If one side is fatter, that's the fix for the next one. Ellipses that are symmetric about their minor axis are what make wheels look round and glasses look like glasses.", tool: "pencil" },
            { h: "Ellipses in a tube", t: "Draw two long parallel lines (a tube) and fill it with ellipses that touch both sides, changing degree as they go: thin at one end, round at the other. Every ellipse should fit snugly against both lines without crossing them. This is the exercise that later makes wrists, necks, tree trunks and cannon barrels work — a tube is defined by the ellipses that sit in it.", tool: "pencil" },
            { h: "Ellipses in a funnel", t: "Now draw a curved funnel — two lines that start apart and converge along a bend — and fill it with ellipses whose minor axes follow the curve of the funnel. The ellipses must turn as the funnel turns. This is harder than the tube because the axis changes every time; it is also exactly what a bending arm or a curving tail is.", tool: "pencil" },
            { h: "Circles, the hardest ellipse", t: "A circle is a 90° ellipse and it's the one people draw worst, because any bias shows. Draw a row of circles by drawing through, then check each with the minor-axis test in two directions (vertical AND horizontal). Twenty circles. The last five should be visibly better than the first five; if not, slow down slightly and ghost twice more per circle.", tool: "pencil" },
          ] },
      ],
      reflect: ["Which lines started to feel automatic? Which still needed a conscious ghost?", "Look at your first row and your last row of ellipses. What changed?", "What is your line fault? Say it out loud — 'I arc my straights' — so you can catch it tomorrow."] },

    { id: "forms-2", title: "The four primitives", minutes: 45,
      goal: "Construct a cube, cylinder, sphere and cone that feel solid — and add contour lines that prove it.",
      why: "These four volumes are the alphabet. Later, a torso is a bent cylinder, a skull is a sphere with a wedge cut off, a car is two boxes on cylinders, a tree is a cone of cones. If the primitives feel like flat symbols, everything built from them will too. Loomis built his whole 'Fun With a Pencil' method on the idea that the ball comes first and the face is hung on it; Drawabox spends its first two lessons here. This is the lesson to over-practice.",
      refs: ["drawabox", "loomis-fun", "proko-basics"],
      pages: [
        { title: "Cube, cylinder, sphere, cone", exemplar: "primitives",
          steps: [
            { h: "The cube starts with a Y", t: "Draw a Y. That's a cube's nearest corner and its three edges going away. Now add the three far edges, each PARALLEL to one arm of the Y, closing three faces. Copy the guide cube, then draw three more with different Y angles — squat Ys give you a view from above; tall Ys, a view from the side; a Y with equal arms is the view straight down a corner. The Y is the whole trick: choose its angles and you've chosen the viewpoint.", tool: "pencil", layer: "Pencils" },
            { h: "The cylinder: two ellipses and two lines", t: "Draw the top ellipse, drop two vertical lines from its widest points, then the bottom ellipse — SAME degree or slightly rounder (it's further below eye level, so you see more of its face). Draw the hidden back half of the bottom ellipse dashed: you must know where it is even when you can't see it, because a handle or a shadow will need it. Check that the minor axis of both ellipses lines up with the cylinder's centerline; if it doesn't, the cylinder is leaning while its caps aren't.", tool: "pencil" },
            { h: "The sphere is a circle until you add contours", t: "A circle is flat. Add one horizontal ellipse across its middle (the equator) and one vertical (a meridian), both drawn as ellipses that would touch the circle's edge. Suddenly it's a ball, and the degree of the equator ellipse tells the viewer whether they're looking at it from above or straight on. Draw three spheres with the equator ellipse at different degrees — a tilted planet — and one with a tilted equator, like a globe on its stand.", tool: "pencil" },
            { h: "The cone", t: "Draw the base ellipse, mark the apex directly above its center (or offset for a leaning cone), and connect the apex to the ellipse's widest points. Add one contour ellipse partway up, smaller and the same degree — it proves the surface tapers evenly. Notice: the cone is just a cylinder that tapers to nothing, and a truncated cone (a lampshade, a bucket, a forearm) is the same construction with a small top ellipse instead of a point.", tool: "pencil" },
            { h: "Ink one of each", t: "Switch to the Inks layer and re-draw your best cube, cylinder, sphere and cone over the pencils with confident single lines. Thicken the edges on the side away from the light, and the edge where each form meets the ground. This is the pipeline you'll use for everything: rough in blue, commit in ink. Then hide the Pencils layer and look — the ink should stand alone.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Contour lines: the proof of solidity", exemplar: "organicForms",
          steps: [
            { h: "Contours follow the surface", t: "A contour line is an ellipse drawn ON the surface of a form, wrapping around it like a rubber band. Draw a sausage (two spheres joined by a tube) and add five contour ellipses along it. Their degree changes as the tube turns toward or away from you: a section pointing at you gets round contours, a section seen from the side gets thin ones. Contours on the end spheres curve more tightly than on the tube. If all your contours are the same degree, the sausage is a flat noodle.", tool: "pencil", layer: "Pencils" },
            { h: "Bend it", t: "Draw a curved sausage — a banana. Contours on the outside of the curve spread apart; on the inside they bunch up, exactly like the stripes on a bent straw. This single fact is how you'll later draw a bending arm, a twisting torso, a curling tail. Draw three bananas at three different bends and make the contour spacing tell the bend.", tool: "pencil" },
            { h: "Overlap two", t: "Draw two sausages where one passes in front of the other. The nearer one's outline is unbroken; the far one's outline stops dead at the overlap and resumes on the other side. Overlap is the cheapest depth cue there is — one form in front of another, no perspective required — and you'll use it in every figure, every crowd, every forest from now on. Draw a pile of five sausages with every overlap resolved.", tool: "pencil" },
            { h: "Contours on the primitives", t: "Go back to your four primitives and give each of them one extra contour line that wraps a surface: a band around the cylinder's middle, a diagonal ring around the sphere, a ring near the cone's tip, and — the hard one — a line drawn across two faces of the cube that bends at the edge. That bend is the proof the cube has a corner.", tool: "pencil" },
            { h: "Ink the pile", t: "Ink the overlapping pile of sausages. Heavier line on the front forms, thinner on the ones behind. Zoom out to a quarter of the page: the pile should read as a pile from line weight and overlap alone.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Pick your most solid-looking cube. What made it work — the parallel edges, the line weight, or the angle?", "Where did contour ellipses feel wrong? Usually it's their degree — too round on a side view, too thin on a front view."] },

    { id: "forms-3", title: "Boxes in space", minutes: 50,
      goal: "Draw boxes rotated freely in 3-D with edges that converge convincingly — the foundation of perspective without any rulers.",
      why: "This is the exercise that famously produces the 3-D 'click'. Drawabox has thousands of students doing 250 of these because it works: the hand learns convergence as a feel before the head learns it as geometry, and once the feel is there the perspective chapter becomes a formality. Do 20 per session, not 250 in one sitting — the exercise is about attention, and attention runs out.",
      refs: ["drawabox-250", "drawabox", "norling"],
      pages: [
        { title: "Rotating boxes", exemplar: "boxRotations",
          steps: [
            { h: "One box, then rotate", t: "Copy the guide box. Now draw the next one rotated a little around its vertical axis, as if turning it on a lazy Susan. As it turns, the Y's two side arms change length: the face turning toward you gets wider, the face turning away gets narrower, until at 45° both are equal and at 90° one has vanished. Fill the first dotted row with a smooth rotation of eight or nine boxes. Say the angle as you draw each: 'ten degrees, twenty, thirty'.", tool: "pencil", layer: "Pencils" },
            { h: "Extend the edges to check", t: "Take each box and extend its three sets of parallel edges far out with light lines. Each set should CONVERGE toward a single distant point, never diverge. Diverging lines mean the far face was drawn bigger than the near face — the classic beginner tell, and the one that makes objects look inside-out. Fix it by shrinking far faces slightly. Do this check on every box; it's the check that teaches, not the box.", tool: "pencil" },
            { h: "Tilt the axis", t: "Second row: boxes rotated around a horizontal axis — tumbling toward you, so you begin to see the top, then the top and front, then mostly top. Third row: both rotations at once, which is how boxes actually sit in the world. These are harder because ALL three edge sets now converge visibly. Keep the convergence gentle (far away vanishing points) or the box looks fish-eyed; save the dramatic distortion for when you mean it.", tool: "pencil" },
            { h: "Add line weight for depth", t: "Go over the nearest edges (the three that form the Y, plus the outer silhouette) with slightly heavier lines. Leave far edges light and inner edges lightest. Watch the boxes pop off the page without any shading at all — line weight is depth information, and a page of boxes is the cleanest place to learn to control it.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Boxes with things inside", exemplar: "boxRotations",
          steps: [
            { h: "Subdivide a face", t: "Draw a box and find the center of one face with its diagonals. Draw a line through that center parallel to the face's edges — you've halved the face in perspective, and the halves aren't equal on paper, which is correct: the nearer half is bigger. Do this for all three visible faces. Now halve the halves. You can find any fraction of any face this way, and it's how windows, tiles, buttons and ribs get placed correctly later.", tool: "pencil", layer: "Pencils" },
            { h: "Nest a smaller box", t: "Using the subdivisions, draw a smaller box sitting inside the big one, sharing the same convergence — its edges parallel to the parent's. Then a box sitting ON TOP of the first box, edges aligned, its base exactly on the parent's top face. Then one hanging off the side. This is how you'll later put a head on a torso, a cab on a truck, a chimney on a roof: every attached volume shares the parent's edge directions.", tool: "pencil" },
            { h: "Cut a box", t: "Draw a box and slice a corner off with a plane — a wedge. The cut face is a new plane whose edges connect points on the box's original edges. Now cut a cylinder-shaped hole through one face: an ellipse on the near face, another on the far face, connected by lines, with the inside wall visible through the hole. You are now carving, not just stacking, and carving is how a box becomes a house, a wedge becomes a roof, a hole becomes a window.", tool: "pencil" },
            { h: "Twenty more, timed", t: "Set a ten-minute timer and draw as many rotated boxes as you can with the edge-extension check on each. Quality over speed, but don't linger. Count how many converge correctly. Write the number in the margin; next session, beat it. This is the daily drill for the next month — twenty boxes before anything else.", tool: "pencil" },
          ] },
      ],
      reflect: ["Extend the edges on your five best boxes. How many truly converge?", "Do you feel the space behind the page yet, or are you still drawing on it? Be honest — it takes most people a few hundred boxes."] },

    { id: "forms-4", title: "Combining volumes", minutes: 50,
      goal: "Build recognizable objects purely by stacking, joining and cutting primitives, and re-draw them from angles you've never seen.",
      why: "The shift from 'draw a mug' to 'draw a cylinder, then a torus handle' is THE mental move of construction drawing. Once you name the volumes first, you can draw an object you've never seen from any angle you want, because you're rotating a recipe, not remembering a picture. Drawabox's Lesson 2 and Loomis both treat this as the moment drawing becomes thinking.",
      refs: ["drawabox-l2", "loomis-fun", "unsplash"],
      pages: [
        { title: "Named combinations", exemplar: "combineVolumes",
          steps: [
            { h: "Copy each combo, naming the parts out loud", t: "House = box + wedge. Mug = cylinder + torus (a bent tube). Snowman = three spheres. Lamp = cone + thin cylinder. Cart = box + two cylinders. Say the recipe before you draw each one; the naming is the skill, the drawing is the proof. Notice how each attached volume shares edges or axes with its parent: the wedge's ridge is parallel to the box's long edge, the torus enters the cylinder's wall along a contour line.", tool: "pencil", layer: "Pencils" },
            { h: "Re-draw each from a new angle", t: "Now draw the same five objects rotated 45° — you can, because you know the recipe. Start with the biggest volume at the new angle, then attach the others to its faces using the subdivision trick from Forms-3 to find where they go. If you were copying outlines you'd be stuck; because you built volumes, you're free. The mug's handle, seen from the new angle, is a torus foreshortened — its ellipse thins.", tool: "pencil" },
            { h: "Five more recipes of your own", t: "Look around you and write five recipes before drawing anything: 'bottle = cylinder + truncated cone + thin cylinder', 'chair = box seat + four thin cylinders + box back'. Then draw them. If a recipe needs more than six parts, you're describing details, not structure — merge parts until it's six or fewer.", tool: "pencil" },
            { h: "Ink the best two", t: "Commit two objects in ink. Use heavier line weight where forms overlap in front of others and where they meet the ground plane. Hide the pencils: does each object read as one solid thing, or as a pile of shapes? The seam between parts is where it fails, if it fails — that's next lesson.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Your first object hunt",
          hints: ["Look around the room. Pick five objects.", "For each: what's the BIGGEST volume? Draw it first. Then attach the rest.", "No details allowed until all five have their volumes.", "Angles must match what you see — sight-measure them."],
          steps: [
            { h: "Five objects, volumes only", t: "Look at real things around you (or search a noun on Unsplash — link in References). For each object write its recipe in your head: 'kettle = sphere + cylinder spout + torus handle'. Draw the volumes only, lightly, at the angle you actually see them — a squat Y for the box you're looking down on, a thin top ellipse for the cylinder at eye level. No texture, no shading, no details — those are rewards for later, and details on a wrong volume are wasted.", tool: "pencil", layer: "Pencils" },
            { h: "Details as attached forms", t: "Now add details — but as MORE VOLUMES. A button is a tiny cylinder on the surface, with its own ellipse matching the surface's contour. A seam follows a contour line. A logo sits on a plane and foreshortens with it. A spout enters the body along a seam. Details that respect the form look real; details floated on top look like stickers, and stickers are the giveaway of every beginner drawing.", tool: "pencil" },
            { h: "One object, three angles", t: "Choose your favorite of the five and draw it twice more: from directly above and from a low angle looking up. You've never seen it from those angles; the recipe lets you anyway. Where the drawing feels uncertain, that's a primitive you can't rotate yet — note which one.", tool: "pencil" },
            { h: "Ink and self-critique", t: "Ink the best object. Then, in the margin, write one thing that's wrong with it in specific terms — not 'the proportions', but 'the spout's ellipse is rounder than the body's, so it looks like it's tilting up'. Naming the error is 80% of fixing it next time, and vague criticism fixes nothing.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which object was easiest to break into volumes? Which fought you, and why?", "Which primitive can you not yet rotate confidently? That's tomorrow's warm-up."] },

    { id: "forms-5", title: "Intersections and the solidity test", minutes: 50,
      goal: "Draw the seam where two forms pass through each other — the proof that you believe the forms are solid.",
      why: "If you can draw where a cylinder enters a box, you truly understand both as 3-D objects; if you can't, you've been drawing outlines with extra steps. This is the hardest exercise in the chapter and the one that makes the next four chapters possible: limbs enter torsos, necks enter skulls, wings enter bodies, handles enter mugs. Scott Robertson's 'How to Draw' spends pages on it because industrial designers live on seams.",
      refs: ["drawabox-l2", "scott-robertson"],
      pages: [
        { title: "Form intersections", exemplar: "formIntersections",
          steps: [
            { h: "Box + cylinder", t: "Copy the guide: a cylinder driving through a box. The seam is where the cylinder's surface meets the box's face — on a flat face it's an ellipse (the same degree as the cylinder's own caps if it enters square-on, thinner if it enters at an angle); where it crosses an edge, the seam kinks, because the surface it's meeting changes direction. Draw the seam as a firm line. Draw the hidden parts dashed. Draw the cylinder entering a second box at a slant and watch the seam become an ellipse you have to think about.", tool: "pencil", layer: "Pencils" },
            { h: "Sphere + box", t: "A ball half-buried in a box. The seam is a curve on each box face it touches — the cross-section of the sphere at that plane, which is always a circle seen in that face's perspective. Think: where is the surface of the ball exactly one box-face away? Draw four different sphere-box overlaps: ball on top, ball in a corner, ball through a side, ball barely touching.", tool: "pencil" },
            { h: "Cylinder + cylinder", t: "Two cylinders crossing at right angles, like pipes at a junction. The seam is a curve that dips and rises — a saddle. This one defeats most people the first time; draw it by placing several contour ellipses on the first cylinder and marking where the second cylinder's surface cuts each one, then connecting the marks. Three tries.", tool: "pencil" },
            { h: "Three at once", t: "Draw a box, a cylinder and a sphere all overlapping in a cluster. Every pair needs its seam. This is slow, uncomfortable and exactly the point — you cannot fake a seam, so the exercise forces you to hold all three forms in your head as solids. Two clusters, then stop; a third would be done on autopilot.", tool: "pencil" },
          ] },
        { title: "Capstone: draw anything",
          hints: ["Choose something 'hard' — a bicycle, a shoe, a hand mixer.", "Biggest volume first. Attach. Cut. Seam every overlap.", "Only when the volumes are right do you add surface details."],
          steps: [
            { h: "Pick something you 'can't draw'", t: "Choose an object you'd normally avoid. Photograph it or find a clear photo (Unsplash / Pexels). List its recipe: big volume, attached volumes, cuts. If the recipe has more than eight parts, you're overthinking — merge parts. A bicycle is two cylinders (wheels), a triangle of thin cylinders (frame), and three attached small forms; the rest is detail.", tool: "pencil", layer: "Pencils" },
            { h: "Build it, then turn it", t: "Draw it from the photo's angle using volumes only, seaming every place one form enters another. Then — without a photo — draw it rotated 90°. You will get details wrong; the VOLUMES should still be right, because volumes rotate and details don't. That's the whole point of this chapter, and it's the test of whether the click has happened.", tool: "pencil" },
            { h: "Details on the turned version", t: "Add the details to the rotated drawing as attached forms, guessing where you must. Where you have no idea what a detail looks like from the new angle, leave it as a plain volume — a solid guess beats a fake detail.", tool: "pencil" },
            { h: "Ink and compare", t: "Ink the second (invented-angle) drawing. Put it next to the photo. Where it fails is your next study subject; write it down. Save this page — Section 7's self-critique lesson will send you back to it.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Could you draw the object from an angle you've never seen? That's the test of thinking in 3-D.", "What's one primitive you still can't rotate confidently? Go back to that lesson — it's cheaper now than in the Figure chapter."] },
    ] },

  /* ============================================================ */
  { id: "s1-observe", title: "Making Observations",
    summary: "Your brain stores objects as symbols — 'eye', 'cup', 'hand' — and draws the symbol instead of the thing in front of you. This chapter breaks that habit using references you open in a browser tab and draw from in Penshi. You will trace very little; you will measure, compare and look until the real shapes replace the symbols. Betty Edwards and Harold Speed both wrote whole books about this one shift, and it is the fastest single improvement available to a beginner.",
    lessons: [

    { id: "obs-1", title: "Seeing versus knowing", minutes: 45,
      goal: "Experience the difference between drawing what you know and drawing what you see, three different ways.",
      why: "Betty Edwards' famous exercises (upside-down copying, negative space, blind contour) work because they starve the naming part of your brain. When the 'symbol' can't fire, your eye takes over — and your drawing suddenly improves by a shocking amount in one session. The improvement isn't magic and it doesn't last on its own; the point is to feel what real looking is like so you can summon it on purpose later.",
      refs: ["edwards", "speed", "loa-stilllife"],
      pages: [
        { title: "Negative space", exemplar: "negativeSpace",
          steps: [
            { h: "Find a chair (or any object with holes)", t: "Look at a real chair, or open the Line of Action still-life tool and pick something with gaps in it. Don't draw the chair. Draw the SHAPES OF AIR between its parts — the trapezoid between the legs, the sliver under the seat, the wedge between the back slats. Fill them in solid with the Marker tool. Treat each air-shape as a flat puzzle piece with its own exact angles; you are not allowed to think 'leg' or 'seat'.", tool: "marker", layer: "Pencils" },
            { h: "Notice what happened", t: "When you're done, the chair is there — drawn correctly, without ever drawing it. Air has no name, so your brain couldn't lie about its shape, and the angles came out as they are rather than as you 'know' them. Repeat with a second object in the right-hand frame: a bicycle, a plant, a pair of scissors. Objects with many holes teach the most.", tool: "marker" },
            { h: "Now draw it 'normally'", t: "Draw the same chair the ordinary way — positive shapes — but any time an angle looks off, check it against the negative shape next to it. Negative space is the referee you can always call: if the air-shape between two legs is wrong, one of the legs is wrong, and the air will tell you which.", tool: "pencil" },
            { h: "Negative space inside a form", t: "Harder: draw a hand held with fingers spread, using ONLY the spaces between the fingers and the outline of air around the hand. Never draw a finger. The hand appears anyway, and it's usually the best hand you've drawn — because you weren't drawing the symbol 'finger' five times.", tool: "pencil" },
          ] },
        { title: "Upside-down and blind contour",
          hints: ["Find a line drawing online (a simple cartoon or a diagram) and rotate the screen or the image 180°.", "Copy it upside-down, line by line, NOT thinking about what it is.", "Then a blind contour: eyes on the object, never on the page, one continuous line."],
          steps: [
            { h: "Upside-down copy", t: "Open any clean line drawing in a browser tab and rotate it 180° (most image viewers can). Copy it upside-down, treating every line as an abstract line — 'this one goes up-left at about 30°, this curve bulges right and ends a thumb-width from that corner'. Work from one edge of the image to the other, keeping adjacent lines in relation to each other. Don't turn it right-side up until you're finished, no matter how curious you get.", tool: "pencil", layer: "Pencils" },
            { h: "Turn it over", t: "Flip your drawing. It's probably the best copy you've ever made. That's what your eye can do when your knowledge stays out of the way — the accuracy was there all along, hidden behind the symbols. Note which parts are worst: they're usually where you recognized what you were drawing (a face, a hand) and the symbol crept back in.", tool: "pencil" },
            { h: "Blind contour: your hand", t: "Look at your non-drawing hand and draw its outline in one continuous line WITHOUT looking at the page. Move the pen at the same speed your eye crawls along the edge; if the eye stops at a knuckle, the pen stops. It will be a mess and that's fine — the point is to feel your eye tracking an edge at the same pace as your pen, which is the sensation of real looking. Do three, each in a different pose.", tool: "pencil" },
            { h: "Modified contour", t: "Now allow yourself a glance at the page every few seconds to reposition — but 90% of the time, eyes on the hand. This 'modified contour' is the practical version you'll use in real observation: mostly looking at the subject, briefly checking the page. Two hands this way. Compare to the blind ones: more accurate, slightly less alive.", tool: "pencil" },
          ] },
      ],
      reflect: ["How different was the upside-down copy from your usual work?", "What did your eye notice about your hand that your brain never had?", "Which exercise felt most uncomfortable? That discomfort is your symbol-brain protesting; it's a good sign."] },

    { id: "obs-2", title: "Sight-measuring and angles", minutes: 40,
      goal: "Measure proportions and angles against a reference so that relationships come out right, using units, plumb lines and the clock.",
      why: "Nobody draws accurately by 'eyeballing'. Pros measure constantly — one unit against another, every angle against vertical — and it looks effortless only because they've done it ten thousand times and the measuring has gone silent. Harold Speed called it the difference between drawing and guessing. This lesson makes measurement a reflex you can switch on whenever a drawing looks wrong and you can't say why.",
      refs: ["edwards", "speed", "unsplash"],
      pages: [
        { title: "Units and angles", exemplar: "sightMeasure",
          steps: [
            { h: "Pick a unit", t: "Choose a simple object photo (a bottle, a book, a shoe). Pick its most obvious dimension as your unit — the width of the bottle, say. Everything else gets described in units: 'the height is about 3.2 widths, the neck is half a width wide and one width tall'. Never in inches or pixels; a drawing has no inches, only relationships. Write three measurements in the margin before drawing a line.", tool: "pencil", layer: "Pencils" },
            { h: "Draw the envelope first", t: "Before any detail, draw the object's bounding box in units: 1 wide, 3.2 tall. Then the biggest sub-shape as a fraction of it — the body fills the bottom two-thirds, the neck the top third. Get the envelope right and the details have nowhere to go wrong; get it wrong and no amount of careful detail will save the drawing. This is the single habit that separates people who improve from people who don't.", tool: "pencil" },
            { h: "Angles against the clock", t: "For every slanted edge, ask: relative to vertical, is this 10°? 30°? 45°? Hold the pen along the edge on screen, then swing it to your page keeping the angle — the old-master trick with a thumb on a brush. Draw a small clock face in the margin and mark each angle on it before committing. Beginners flatten steep angles and steepen shallow ones; the clock catches both.", tool: "pencil" },
            { h: "Plumb lines and level lines", t: "Draw a vertical line through the reference (a plumb line) and note what lands on it — 'the spout is directly above the left foot'. Do a horizontal one too: 'the handle's top is level with the lid'. Two or three of these lock the whole drawing together, because they tie distant parts to each other. If your drawing looks off and the units check out, a plumb line usually finds the culprit.", tool: "pencil" },
            { h: "Comparative measuring", t: "Now measure parts against each other rather than the unit: 'the handle is as tall as the neck', 'the base is as wide as the shoulder'. Find five such equalities in the reference and check them in your drawing. Equalities are easier to see than fractions and they're how experienced artists actually measure.", tool: "pencil" },
          ] },
        { title: "Measured study", exemplar: "obsFrame",
          steps: [
            { h: "Three objects, measured", t: "Draw three objects from photos using ONLY measurement: envelope, units, angles, plumb lines, equalities. Take ten minutes each. Resist detail until the envelope and sub-shapes agree with the reference. Use the thirds grid on this page to place each object and to notice where key points fall — a corner on a grid crossing is easy to check.", tool: "pencil", layer: "Pencils" },
            { h: "Overlay check", t: "If your photo is on the same screen, drag the browser to sit beside Penshi (Win + ← / →). Compare side by side, then flip your view horizontally in your head (or turn away and back). Write one measurement you got wrong for each object, in units: 'body 0.3 units too wide'.", tool: "pencil" },
            { h: "Redraw the worst one", t: "Take the object with the biggest error and draw it again beside the first attempt, starting from the corrected measurement. Same time limit. The second drawing is the one that teaches, because now you know what you were looking for.", tool: "pencil" },
          ] },
      ],
      reflect: ["What kind of error do you make most — too tall, too wide, angles too steep? That's your bias; correct for it consciously next time.", "Did measuring feel slow? It gets fast. The first week is the only slow week."] },

    { id: "obs-3", title: "Reference study: everyday objects", minutes: 55,
      goal: "Complete two finished observational drawings from linked references, combining measurement with volume thinking.",
      why: "Observation plus construction is the professional method: you measure what's there, and you build it from volumes so it holds together from every angle. Neither alone is enough — pure measurement gives a flat map, pure construction gives a generic object. Two studies done carefully teach more than twenty done fast, and these two go into your Portfolio as the baseline you'll compare against in three months.",
      refs: ["unsplash", "pexels", "loa-stilllife", "ctrlpaint"],
      pages: [
        { title: "Study 1: something with a handle", exemplar: "obsFrame",
          hints: ["Search Unsplash for 'coffee mug' or 'kettle'. Pick a photo with clear light.", "Envelope → biggest volume → attached volumes → measured angles → details.", "The thirds grid on this page: note which crossing the handle sits on."],
          steps: [
            { h: "Set up the reference", t: "Open Unsplash or Pexels in a browser tab and search 'mug' or 'kettle'. Choose a photo with one clear light source and the handle visible, taken slightly from above so the top ellipse is open. Snap the browser beside Penshi so you can glance, not turn — every head-turn costs you the measurement you were holding.", tool: "pencil", layer: "Pencils" },
            { h: "Envelope and volumes", t: "Draw the bounding box in units. Place the main cylinder — get its top ellipse degree from the photo by comparing height-to-width of the ellipse (a quarter as tall as wide is a thin ellipse; half is a medium one). Drop the sides, checking whether they taper. Attach the handle as a bent tube that ENTERS the cylinder wall along a contour line (a seam, not a line stuck on). Its thickness is a fraction of the body's width; measure it.", tool: "pencil" },
            { h: "Measure the details in", t: "Rim thickness, where the handle attaches (measure from the top in units), the base's ellipse degree (rounder than the top, since it's lower). Check three plumb lines against the photo: does the handle's outer edge fall directly below anything? Does the base's widest point align with the rim's? Every detail gets measured, not assumed.", tool: "pencil" },
            { h: "Ink with intention", t: "On the Inks layer, commit the drawing. Heavy line on the shadow side and where the mug meets the table; thin on the lit side; the far edge of the rim thinner than the near edge. Leave shading for the Shading chapter — a well-constructed line drawing needs none, and a shaded bad drawing is still a bad drawing.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Study 2: something soft", exemplar: "obsFrame",
          hints: ["Search 'sneaker' or 'backpack' — objects with a firm core and a soft skin.", "Find the hidden volume (a shoe is a wedge on a block). Draw it before the wrinkles."],
          steps: [
            { h: "Find the hidden volume", t: "Soft objects still have a hard structure inside: a shoe is a wedge for the foot + a block heel + a sole plate; a backpack is a box with fabric hanging off it and a cylinder of stuff inside. Draw that structure first, from measurement, exactly as you would a mug. If you start with the wrinkles you'll draw a wrinkled nothing.", tool: "pencil", layer: "Pencils" },
            { h: "Let the soft parts sag off the structure", t: "Now draw the surface where it departs from the volume — where fabric slumps, where laces pull, where the toe box creases. Every wrinkle points at something that's pulling it or pushing it. You'll learn the full theory in the Fabrics chapter; for now, just observe and copy the biggest three or four folds and ignore the rest. Beginners draw every wrinkle; pros draw the ones that explain the form.", tool: "pencil" },
            { h: "Compare hard and soft", t: "Look at both studies. The soft object should have a visible hard core showing through where the fabric is stretched (the heel, the toe), and softness only where it's slack. If the whole shoe looks like a cloud, the structure got lost — redraw the wedge and heel block over it, firmly.", tool: "pencil" },
            { h: "Ink and keep it", t: "Ink it. Heavier line where the sole meets the ground and where fabric folds over itself. This page and Study 1 go into your Portfolio — in three months, redraw the same two objects and compare. That comparison is worth more than any tutorial, and Section 7 will remind you to do it.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which was harder — the hard object or the soft one? Why?", "Did you draw the structure of the shoe first, or the wrinkles? Be honest."] },

    { id: "obs-4", title: "Reference study: living things", minutes: 55,
      goal: "Observe and draw a plant and a hand — subjects with no straight lines — using the same measure-then-build method.",
      why: "Natural forms are where beginners give up on measurement and start guessing, because there's no obvious box to measure against. Plants teach you growth patterns and rhythm; the hand teaches you that even the most complex subject is still volumes and angles. Both set up the Gesture and Figure chapters, and the hand page is the one you'll be most surprised by when you come back to it.",
      refs: ["unsplash", "loa-hands", "drawabox-l2"],
      pages: [
        { title: "A plant: rhythm and branching", exemplar: "obsFrame",
          hints: ["Search 'potted plant' or 'leaf branch' on Unsplash.", "Draw the flow lines of stems FIRST, then hang leaves on them.", "Leaves are planes — draw the midrib as a curve in space, then the outline around it."],
          steps: [
            { h: "Stems as flow lines", t: "Find the main stem and draw it as one confident curve, from the shoulder, ghosted first. Every branch leaves the stem at an angle — measure a few with the clock. Plants branch with rhythm, not randomness: alternate (left, right, left), opposite (pairs), or spiral. Which is yours? Once you know, you can draw the branches you can't see, and the plant will look like a species instead of a scribble.", tool: "pencil", layer: "Pencils" },
            { h: "Leaves as planes on a midrib", t: "For each leaf: draw the midrib as a curve in space (it bends and twists), then the leaf outline around it, foreshortened if the leaf faces away — a leaf seen edge-on is a line, a leaf facing you is its full shape, and most are somewhere between. Draw six leaves at six different tilts, measuring each one's width-to-length against the fullest leaf. Symmetry about the midrib is the thing to check.", tool: "pencil" },
            { h: "Overlap for depth", t: "Where leaves cross, the front one is unbroken and the back one stops at the overlap. Resolve every crossing. Then ink the study, letting nearer leaves get heavier lines and the far ones stay thin — the plant should have a front and a back.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Your own hand", exemplar: "obsFrame",
          hints: ["Use your non-drawing hand as the model. Three poses: relaxed, fist, holding the pen.", "Palm first as a flat mitten; fingers as tubes fanning from a curve.", "Measure: how many finger-widths across the palm? Where does the thumb tip reach?"],
          steps: [
            { h: "Palm as a mitten", t: "Draw the palm as a rounded box first — no fingers. Measure its proportions against your real hand: about as long as the middle finger, about four finger-widths across. The thumb's base is a separate wedge on the side of that box, and it's much bigger than people expect — nearly a third of the palm's width. Draw the mitten from the back, from the palm side, and edge-on.", tool: "pencil", layer: "Pencils" },
            { h: "Fingers from a curve", t: "The knuckles sit on an ARC, not a straight line — the middle knuckle is highest. Draw that arc, then each finger as a tapered tube from it in three segments, with the joints on two more arcs parallel to the first. Measure each finger's length against the middle one (index and ring about equal, pinky shortest and set lower on the palm).", tool: "pencil" },
            { h: "Three poses", t: "Relaxed, fist, holding the pen. Each pose is a different set of tube angles on the same mitten; the palm hardly changes. For the fist, the finger tubes fold under and the knuckle arc becomes the top edge. For the pen grip, the thumb wedge rotates forward to meet the index finger. This is a preview of the hands lesson in the Figure Drawing chapter — you'll come back here far more confident.", tool: "pencil" },
            { h: "Ink one and date it", t: "Ink the best pose. Write the date under it. This is the drawing you'll compare against after the Figure chapter's two hand lessons, and the difference will be the most convincing proof you'll get that construction works.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Where did you stop measuring and start guessing? Mark it on the page.", "The hand is the subject artists fear most. How does it feel now, after treating it as tubes on a box?"] },
    ] },
  ],
});
