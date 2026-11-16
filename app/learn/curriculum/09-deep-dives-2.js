/* Curriculum · deep-dive pages, second batch: hands, expressions,
   vehicles and environments. Appended to the end of each lesson. */
"use strict";

(() => {
  const find = id => { for (const s of PENSHI_CURRICULUM) for (const c of s.chapters) for (const l of c.lessons) if (l.id === id) return l; };
  const extend = (id, minutes, pages) => { const l = find(id); if (!l) return; l.pages.push(...pages); l.minutes = (l.minutes || 0) + minutes; };
  const pencil = { tool: "pencil", layer: "Pencils" }, ink = { tool: "ink", layer: "Inks" }, paint = { tool: "marker", layer: "Colors" };

  /* ---------------- Expressions ---------------- */
  extend("head-4", 55, [
    { title: "How much: three strengths", exemplar: "expressionIntensity",
      hints: ["Rows are emotions, columns are strength.", "The parts move in the same direction at every strength — only further."],
      steps: [
        { h: "Twelve heads", level: 1, t: "Trace the twelve heads lightly, or draw your own grid of twelve with the brow, eye and mouth lines marked. Keep them identical: the expression must come from the features alone, not from a different head.", ...pencil },
        { h: "The 'clear' column first", level: 2, t: "Draw the middle column — the four expressions at normal strength. For each, say which three things moved from neutral (for joy: lower lids up, mouth corners up and wide, cheeks pushing the eyes narrower).", tool: "pencil" },
        { h: "Dial it down, then up", level: 2, t: "Now the 'hint' column: the same three movements at less than half the distance. Most of a comic lives here. Then 'pushed': past what a real face does, but still the same directions. If a pushed face stops reading as the same emotion, a part moved the wrong way.", tool: "pencil" },
        { h: "Check with the arrows", level: 3, t: "Turn on the arrows and compare them with your drawing, row by row. Then hide the guides and draw one emotion of your choice at FIVE strengths in a row, from almost nothing to extreme. Ink the three you would use in a story.", ...ink },
      ] },
    { title: "Six more expressions", exemplar: "expressionMore",
      hints: ["Disgust, suspicion, exhaustion, delight, rage, grief.", "Each is a neighbour of one of the basic six: find which, and what was added."],
      steps: [
        { h: "Name the neighbour", level: 1, t: "Before drawing any features, write beside each head which basic expression it is closest to: rage ← anger, grief ← sadness, delight ← joy. Disgust and suspicion both sit near anger; exhaustion sits near sadness but with no tension at all.", ...pencil },
        { h: "Draw the six", level: 2, t: "Add the features. Narrowed eyes are the hard part: in suspicion the lids close evenly from above and below; in disgust the LOWER lid does the work and the cheeks push up; in exhaustion only the upper lid drops. Draw each pair of eyes twice.", tool: "pencil" },
        { h: "What moved", level: 3, t: "Turn on the arrows. For each face cover the mouth with a finger: do the brows and eyes still say it? Then cover the brows instead. The expression that survives both tests is drawn well.", tool: "pencil" },
        { h: "On your own character, turned", level: 3, t: "Hide the guides. Draw three of these on a three-quarter head of your own character, using the Loomis construction. The far eye and far brow are shorter, and the mouth wraps round the cylinder of the muzzle. Ink them.", ...ink },
      ] },
  ]);

  /* ---------------- Hands ---------------- */
  extend("fig-3", 80, [
    { title: "The hand, all the way round", exemplar: "handTurn",
      hints: ["One relaxed hand, eight views, 45° apart.", "Edge-on, the palm is a thin wedge."],
      steps: [
        { h: "Eight palm boxes", level: 1, t: "Trace the palm box, wrist and thumb wedge in all eight views, then draw the row again yourself. Follow one corner of the palm box round the turn. Edge-on views are the ones people skip: the palm is thin there, and the thumb either covers it or hides behind it.", ...pencil },
        { h: "Fingers in every view", level: 2, t: "Add the fingers. In the back and palm views you see all four side by side. In the edge views they overlap in a stack, and you may see only two clearly. The curl increases from index to little finger in every view — that is what makes the hand look relaxed.", tool: "pencil" },
        { h: "Contour", level: 3, t: "Turn on the contour level and trace it over four of your constructions. Note where the outline is made by the fingers, where by the thumb, and where by the palm: it changes in every view.", tool: "pencil" },
        { h: "Your own hand, turned", level: 3, t: "Hide the guides. Hold your non-drawing hand relaxed and draw it from four of these angles by turning your wrist. Box first. Two minutes each.", tool: "pencil" },
      ] },
    { title: "Closing the hand", exemplar: "handCurl",
      hints: ["Open, relaxed, claw, grip, fist.", "The top row is seen from the edge, the bottom row from the back."],
      steps: [
        { h: "The edge-on row", level: 1, t: "Trace the five palms from the edge. The palm box does not change. Then with the fingers level on, draw each finger as three boxes folding: at the claw the middle knuckles are bent most; at the fist all three are folded and the tips touch the palm.", ...pencil },
        { h: "The path of the fingertips", level: 2, t: "On your edge-on row, join the fingertips of the five stages with one curved line. It is a spiral in toward the base of the palm. Any hand pose between open and fist has its fingertips somewhere on that spiral.", tool: "pencil" },
        { h: "The back row", level: 2, t: "Draw the same five from the back. As the hand closes, the fingers get shorter on the page until, in the fist, only the first segments show and the knuckles become the top edge. The thumb swings from the side to across the front.", tool: "pencil" },
        { h: "Half-closed, from memory", level: 3, t: "Hide the guides. Draw a hand halfway between relaxed and claw, and one halfway between grip and fist, from any angle. If you can draw the in-betweens you understand the mechanism rather than five memorised poses.", tool: "pencil" },
      ] },
    { title: "Holding things", exemplar: "handHolding",
      hints: ["The object comes first; the hand wraps it.", "Find where the thumb presses before drawing a single finger."],
      steps: [
        { h: "Object, palm, thumb", level: 1, t: "Trace the object in each of the four, then the palm box and thumb. A staff sits across the palm at a slant, not straight across. The ball rests in the cup of the palm. The pen lies in the notch between thumb and index.", ...pencil },
        { h: "Wrap the fingers", level: 2, t: "Add the fingers. Round a cylinder they follow its contour like contour lines; round a ball they spread and each fingertip lands on the surface. Every finger segment is a box whose inside face touches the object.", tool: "pencil" },
        { h: "Who is in front?", level: 3, t: "Turn on the contour. At every crossing decide what is in front — finger or object — and stop the other line cleanly against it. From the knuckle side the fingers hide the staff; from the palm side the staff hides the palm.", tool: "pencil" },
        { h: "Three objects from your desk", level: 3, t: "Hide the guides. Hold three real objects of different shapes — a mug, a phone, something small — and draw each: object first, then palm and thumb, then fingers. Ink the best with heavier line on the nearest forms.", ...ink },
      ] },
  ]);

  extend("fig-3b", 30, [
    { title: "Tipping the hand toward you", exemplar: "handAimed",
      hints: ["The same hand at 0°, 28°, 52°, 70° and 84°.", "Length collapses; width does not."],
      steps: [
        { h: "The open hand, five tilts", level: 1, t: "Trace the palm boxes of the top row. Measure the height of each palm against its width: the width hardly changes while the height shrinks to almost nothing. That is all foreshortening is.", ...pencil },
        { h: "Fingers as stacked boxes", level: 2, t: "Add the fingers to the top row. By 52° each finger segment overlaps the one behind it. By 84° you are looking at the ends of the fingertip boxes, with the rest of each finger hidden behind. Draw the nearest box first, every time.", tool: "pencil" },
        { h: "The fist row", level: 2, t: "Now the fist. Tipped toward you, the knuckles of the first segments become the nearest and largest forms and the back of the hand shrinks away behind them. This is the punch coming at the reader.", tool: "pencil" },
        { h: "One step further", level: 3, t: "Hide the guides and redraw the 84° open hand and the 84° fist LARGER, filling a quarter of the page each, with the forearm receding behind. Exaggerate the near forms by a third. Ink with your heaviest line on what is nearest.", ...ink },
      ] },
  ]);

  /* ---------------- Vehicles ---------------- */
  extend("obj-2", 60, [
    { title: "The car from four sides", exemplar: "carTurn",
      hints: ["Side, front three-quarter, rear three-quarter, from above.", "Same boxes every time; only the camera moves."],
      steps: [
        { h: "Four boxes, drawn through", level: 1, t: "Trace the body box in all four views and then draw them yourself, including the hidden edges. In the side view the box is a plain rectangle — which is why side views are easy and dull. From above, the top face dominates.", ...pencil },
        { h: "Cabin and wheels", level: 2, t: "Add the tapered cabin and the wheels. Each wheel is an ellipse whose short axis runs along the axle. In the rear view the far-side wheels show only as slivers under the body; from above you barely see wheels at all.", tool: "pencil" },
        { h: "Arches, doors and lights", level: 3, t: "Add the details on the faces of the boxes. Wheel arches are half-ellipses concentric with the wheels. Door lines are vertical on the side face. Lights sit on the front and rear faces — check they are level with each other in perspective.", tool: "pencil" },
        { h: "A fifth view of your own", level: 3, t: "Hide the guides. Draw the same car from a low front three-quarter view (a worm's-eye): the horizon is below the bumper. Box, cabin, wheels, details. Ink it — this is the classic car-chase panel.", ...ink },
      ] },
    { title: "Four kinds of vehicle", exemplar: "vehicleTypes",
      hints: ["Van, pickup, bus, sports car.", "Proportion of the boxes first; wheel size second; detail last."],
      steps: [
        { h: "Four recipes in boxes", level: 1, t: "Trace the big boxes of all four, then write each recipe in your own words beside it. Compare height to length: the bus is a long tall box; the sports car is barely knee-high with the cabin pushed back.", ...pencil },
        { h: "Wheels and glass", level: 2, t: "Add wheels and windows. Note how much of each wheel is hidden by the body and how big it is against the body's height. Windows are drawn ON the faces of the boxes and follow their perspective.", tool: "pencil" },
        { h: "Push one toward a character", level: 2, t: "Redraw one of the four with its proportions exaggerated: a taller, narrower van; a longer, lower sports car; a pickup with oversized wheels. Change only the boxes and the wheel size and see how far the personality moves.", tool: "pencil" },
        { h: "A vehicle for your world", level: 2, t: "Hide the guides. Design a vehicle your own story needs. Decide what it carries and where, draw the boxes for that, then wheels (or legs, or runners), then glass. Ink it with a small figure beside it for scale.", ...ink },
      ] },
  ]);

  /* ---------------- Environments ---------------- */
  extend("env-2", 35, [
    { title: "A landscape built in depth", exemplar: "terrainBuild",
      hints: ["Far, middle, near — in that order.", "Contour lines wrap the land and show its slope."],
      steps: [
        { h: "Horizon and river", level: 1, t: "Draw the horizon, then one river from the bottom edge of the page winding toward it. Each bend is flatter and narrower than the one in front. The river gives the whole picture its depth before any land is drawn.", ...pencil },
        { h: "Landforms as solids", level: 2, t: "Add the land as simple solids: far peaks, a flat-topped mesa, low hills. Wrap one or two contour lines round each. On a steep slope the contours crowd together; on a gentle one they spread. Let nearer forms overlap farther ones.", tool: "pencil" },
        { h: "Trees and rocks for scale", level: 3, t: "Add trees and rocks. Draw the nearest trees large with trunk, two tiers and a top; the middle ones as two shapes; the far ones as a single mark. Scatter them in groups along the river, not evenly.", tool: "pencil" },
        { h: "Break the solids", level: 3, t: "Hide levels 2 and 3 one at a time and redraw each cone as real terrain: an uneven ridge line, a broken shoulder, a scree slope where the contours bunch. Keep the big shape; lose the geometry. Ink the silhouettes of the three depth layers with three line weights.", ...ink },
      ] },
  ]);

  extend("env-3", 70, [
    { title: "An interior", exemplar: "interiorRoom",
      hints: ["Room, then boxes, then the things that make it someone's.", "The floor grid is a ruler: every square is the same real size."],
      steps: [
        { h: "The empty room", level: 1, t: "Trace the floor, the two walls and the floor grid. Then choose your own eye level and draw the room again beside it: a low eye level makes the room loom, a high one lays the floor out like a map.", ...pencil },
        { h: "Furniture as boxes, and a person", level: 2, t: "Place the furniture as plain boxes standing on grid squares: bed, table, chair, shelf. Add the figure and check every box against it — table at the hip, seat at the knee, shelf above the head. A room with a figure in it cannot have the wrong scale for long.", tool: "pencil" },
        { h: "Window, door, and small things", level: 3, t: "Add the window and door on the walls, the shelves, pillow, lamp and rug. Each lies on a face of the room or of a box and follows that face's perspective. The door is one head taller than the figure.", tool: "pencil" },
        { h: "Who lives here?", level: 3, t: "Hide the guides and redraw the room for a specific character: change three pieces of furniture and add five objects that tell us about them without a word of text. Decide what is tidy and what is not. Ink it.", ...ink },
      ] },
    { title: "A street", exemplar: "streetScene",
      hints: ["One vanishing point on the horizon, straight ahead.", "Vary the building heights; keep every eye on the horizon."],
      steps: [
        { h: "Horizon, point, kerbs", level: 1, t: "Draw the horizon and mark the vanishing point. Draw the two kerbs and two more lines for the edges of the pavement, all aimed at the point. Then four light lines above the horizon where the roofs will run.", ...pencil },
        { h: "Buildings as boxes", level: 2, t: "Build each block as a box: a vertical front edge, then top and bottom edges running to the vanishing point, then the next building's edge. Make neighbours different heights and let some step back from the pavement.", tool: "pencil" },
        { h: "Rows of windows", level: 3, t: "Windows sit in rows that run to the same point. Their vertical spacing stays even; their horizontal spacing closes up with distance. Add a door per building, lamp posts along one kerb, and three people with their eyes on the horizon.", tool: "pencil" },
        { h: "Make it a place", level: 3, t: "Hide the guides. Redraw the street as a particular one: a market, a canal side, a run-down block. Change the buildings' proportions and add signs, awnings, wires and things on the pavement. Ink it.", ...ink },
      ] },
  ]);

  extend("env-3b", 35, [
    { title: "One set, three lights", exemplar: "lightDirections",
      hints: ["The same figure and crate, lit from three places.", "Decide where the lamp is before you shade anything."],
      steps: [
        { h: "Three identical sets", level: 1, t: "Trace or redraw the figure and crate three times, with the arrow for each light. On each, mark with a small tick every plane that FACES the arrow. Those are your light planes; everything else is in shadow.", ...pencil },
        { h: "Fill the shadow shapes", level: 2, t: "With one flat grey, fill every plane that does not face the light, then the cast shadow on the ground on the side away from the arrow. Do all three before refining any of them. Compare with the guide's values.", ...paint },
        { h: "Read the moods", level: 2, t: "Look at your three. The high side light explains the forms. The overhead light puts the eyes in shadow. The low back light leaves the figure dark against the ground, with shadows reaching toward the viewer. Write one word for the mood of each.", tool: "pencil", layer: "Pencils" },
        { h: "A fourth light of your own", level: 2, t: "Hide the guides. Light the same set from below and in front (a campfire or a torch), working out each plane and the direction of the cast shadows yourself. This is the classic horror light because nothing in daily life is lit that way.", ...paint },
      ] },
  ]);
})();
