/* Curriculum · Section 2 — Extending Beyond Foundations */
"use strict";
window.PENSHI_CURRICULUM = window.PENSHI_CURRICULUM || [];

PENSHI_CURRICULUM.push({
  id: "s2", num: 2, title: "Extending Beyond Foundations",
  tagline: "Make things sit in believable space, carry believable light, and move with believable life.",
  chapters: [

  /* ============================================================ */
  { id: "s2-persp", title: "Perspective Basics",
    summary: "Perspective is the set of rules that turns volumes into a SCENE — objects sharing one space, one eye level, one set of vanishing points. Penshi's Guides tab has a live 1/2/3-point grid with draggable vanishing points; these lessons turn it on for you and teach you to work with it, then without it. Norling's 'Perspective Made Easy' (free, public domain) is the companion text; read a chapter alongside each lesson.",
    lessons: [

    { id: "persp-1", title: "The horizon is your eye level", minutes: 40,
      goal: "Understand and place the horizon line, and predict what you see above and below it.",
      why: "Every perspective mistake traces back to one confusion: the horizon is not 'where the land ends'. It's the height of YOUR eyes, and it exists indoors, in space, and in a drawing of a teacup. Once that's felt, every other rule follows from it — what you see the top of, what you see the underside of, where a crowd's heads line up. Norling spends his first three chapters on nothing else, and he's right to.",
      refs: ["norling", "storey", "loa-env"],
      pages: [
        { title: "Above and below", exemplar: "persp1pt",
          steps: [
            { h: "Turn on the grid", t: "This step switches on Penshi's 1-point perspective guide. The blue horizontal line is the horizon — your eye level. Drag it up: you're standing tall or floating, looking down on things. Drag it down: you're crouching, looking up. The scene's whole mood changes with that one line, which is why film directors talk about camera height before anything else. Leave it a little above center for now.", guide: { persp: true, vps: 1 } },
            { h: "Boxes above, on, and below", t: "Draw a box whose top is BELOW the horizon: you see its top face, because you're looking down on it. Draw one ABOVE the horizon: you see its underside. One straddling it: you see neither top nor bottom, only sides. Label each. This is the whole rule, and it applies to tabletops, rooftops, chins, and clouds: below eye level you see tops, above it you see bottoms.", tool: "pencil", layer: "Pencils" },
            { h: "Same box, three horizons", t: "Move the horizon line to three heights and draw the same box each time, keeping it the same size on the page. Notice how a low horizon makes the box loom (heroic, monumental) and a high one makes it small and mapped (overview, vulnerable). A comics panel's emotional register is set by this before a single figure is drawn.", tool: "pencil" },
            { h: "People on the horizon", t: "Draw three stick figures of the same height at different distances, all standing on flat ground. Their EYES all sit on the horizon line (because they're your height, and the horizon is your eye level). A shorter figure's eyes sit below it; a taller one's above it; a figure on a hill has eyes above it too. This trick places crowds instantly and it's the fastest scale check in perspective.", tool: "pencil" },
            { h: "Find the horizon in a photo", t: "Open a street photo from Unsplash or the Line of Action environments tool. Extend any two edges you know are parallel and horizontal in reality (window tops, a curb) until they meet — that's on the horizon. Draw the horizon across the photo in your head, then reproduce the scene as three boxes with the horizon where you found it. The habit of finding eye level in every reference is the whole lesson.", tool: "pencil" },
          ] },
      ],
      reflect: ["Describe the horizon in your own words without using 'sky' or 'ground'.", "Look at a photo — can you find the eye level from the boxes in it?"] },

    { id: "persp-2", title: "One-point perspective", minutes: 50,
      goal: "Draw boxes, a room and a street in one-point perspective using the vanishing point.",
      why: "One-point is the view straight down a corridor, a road, a row of buildings, a train carriage. It's the simplest system and it's everywhere in comics — establishing shots, hallways, the classic 'walking toward the camera'. David Chelsea's 'Perspective! for Comic Book Artists' builds its whole first act on it. Learn it thoroughly and two-point is just one-point twice.",
      refs: ["norling", "chelsea", "storey"],
      pages: [
        { title: "Boxes to the VP", exemplar: "persp1pt",
          steps: [
            { h: "Front face flat, depth to the VP", t: "In one-point, one face of the box faces you square-on — draw it as a plain rectangle, no distortion at all. From each corner, draw a light line toward the vanishing point (the dot on the horizon). Cut those lines with a smaller rectangle to set the depth. Done. Draw five, scattered around the page, all aiming at the same VP — above, below, left and right of it — and see how each shows a different set of faces.", guide: { persp: true, vps: 1 }, tool: "pencil", layer: "Pencils" },
            { h: "Use the Line tool with Shift", t: "Penshi's Line tool snaps to 15° with Shift, and the guide grid shows the rays. Use it for construction lines toward the VP, then draw the box edges freehand over them with the Pencil. Rulers for setup, hand for the drawing — a page that's all ruled lines looks like an architect's plan, not a comic.", tool: "line" },
            { h: "How deep is deep?", t: "The depth of a box is a choice you make by where you cut the receding lines, and beginners always make boxes too deep. A cube's depth in one-point is noticeably SHORTER on the page than its front face's width. Draw three boxes that are supposed to be cubes and pick the one that looks least like a corridor; that's the right depth. Then draw a box twice as long as it is wide.", tool: "pencil" },
            { h: "Stack and cut", t: "Put one box on top of another, aligned. Cut a doorway into one (the door's top and bottom aim at the VP; its sides stay vertical). Cut a window into its side face. Verticals in one- and two-point perspective are ALWAYS vertical — the moment a vertical leans, you've drifted into three-point without meaning to.", tool: "pencil" },
          ] },
        { title: "A room and a street", exemplar: "perspRoom",
          steps: [
            { h: "The room", t: "Draw the back wall as a rectangle. Its four corners each send a line toward the VP, and those are your floor, ceiling and side walls. Put the VP off-center for a more natural view — dead center looks like a stage set. Add a door on the left wall and a window on the right — their horizontal edges aim at the VP, their vertical edges stay vertical. The window's height on the wall tells the viewer how tall the room is.", guide: { persp: true, vps: 1 }, tool: "pencil", layer: "Pencils" },
            { h: "Furniture on the floor", t: "A table is a box on the floor plane: front edge flat, depth to the VP, legs vertical, and its top BELOW the horizon so you see its surface. A rug is a rectangle whose sides aim at the VP. A picture on the side wall is a rectangle whose top and bottom aim at the VP. Everything shares the one VP, so everything belongs to the same room; that shared point is what 'same space' means.", tool: "pencil" },
            { h: "A figure in the room", t: "Put a person standing on the floor. If they're your height, their eyes are on the horizon; their feet are where the floor rays put them. Now put a second person further back: eyes still on the horizon, feet higher on the page, smaller overall. Two figures placed this way tell the reader the room's depth better than any amount of furniture.", tool: "pencil" },
            { h: "Turn it into a street", t: "New page area (or page tab ＋): the same construction, but the 'walls' are building fronts and the 'floor' is the road. Windows repeat: divide a wall face with the diagonal trick from Boxes in Space to keep spacing correct as it recedes. Add a row of lamp posts — vertical lines whose tops and bases each aim at the VP, getting closer together as they go back.", tool: "pencil" },
            { h: "Ink one scene", t: "Ink the room or the street. Line weight: heavy for the nearest edges, tapering into the distance; the far wall lightest of all. Panel-border it with the Panel tool. This is your first believable space, and it's a legitimate comics panel as it stands.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Did the furniture feel like it sat on the floor, or floated? Floating usually means its base wasn't drawn aiming at the VP.", "Where did you put the VP, and what did that do to the mood of the room?"] },

    { id: "persp-3", title: "Two-point perspective", minutes: 55,
      goal: "Draw boxes and a building corner in two-point perspective, with vanishing points far enough apart to avoid distortion.",
      why: "Two-point is how we usually see things — standing near the corner of a building, looking at a box on a table, watching a car turn. It's the workhorse of environment drawing and of most comics panels that aren't looking straight down a corridor. The single most common error is VPs too close together, which produces a fish-eye warp; the second is verticals that lean. Both are visible instantly once you know to look.",
      refs: ["norling", "scott-robertson", "chelsea"],
      pages: [
        { title: "The corner", exemplar: "persp2ptBox",
          steps: [
            { h: "Switch to 2-point", t: "The guide now has two vanishing points on the horizon. Drag them apart — as far as the canvas allows, even past its edges. Draw the nearest vertical edge of a box, then send its top and bottom ends toward BOTH VPs. Cut with two more verticals to set the width of each face. The nearest vertical is the tallest line in the box; the two outer verticals are shorter, because they're further away.", guide: { persp: true, vps: 2 }, tool: "pencil", layer: "Pencils" },
            { h: "Distortion test", t: "Deliberately drag the VPs close together and draw a box. See the warp — the near corner opens past 90°, the box looks like it's bulging toward you? That's the 'wide-angle' look — fine for a dramatic panel, wrong for a normal one. Push the VPs back out and draw the same box; it relaxes. Rule of thumb: the angle at the box's nearest corner should be at least 90° as drawn, usually more.", tool: "pencil" },
            { h: "Six boxes, one world", t: "Draw six boxes of different sizes scattered around, all obeying the same two VPs. Some above the horizon (you see undersides), some below (you see tops), one straddling. They'll read as objects in one room, because they share one eye level and one pair of VPs. Then draw one box that ignores the VPs and notice how it floats out of the scene — that's what an inconsistent object looks like to a reader.", tool: "pencil" },
            { h: "A rotated box in the same scene", t: "A box turned at a different angle needs its OWN pair of VPs on the same horizon — further apart on one side, closer on the other. Drag the guide's VPs to a new pair of positions and draw one box, then drag them back. Two boxes at two rotations, one horizon: this is what a room full of furniture actually is.", tool: "pencil" },
          ] },
        { title: "A building on a corner", exemplar: "persp2ptBox",
          steps: [
            { h: "The main block", t: "One big box, nearest corner toward the viewer, its base below the horizon so you're on the street looking at it. Then a smaller box on top (a penthouse) and a step-out at the base (an entrance). All share the VPs. Use the diagonal-center trick to put the penthouse in the middle of the roof and the entrance in the middle of the front face.", guide: { persp: true, vps: 2 }, tool: "pencil", layer: "Pencils" },
            { h: "Windows in perspective", t: "Divide each face with diagonals to find perspective-correct halves, quarters, eighths. Windows go in the divisions — same size in reality, so they shrink and tighten as the face recedes. That tightening is what makes the building look big; evenly spaced windows make it look like a cardboard box. Do one face fully and suggest the other with three or four.", tool: "pencil" },
            { h: "A figure for scale, and a car", t: "Put a person at the door — their eyes on the horizon if they're your height. Now the building has a size. Add a car parked along the near face: a box with the same VPs, its top below the horizon. The car's roof will be at about the person's chin. Ink the whole thing with the nearest corner heaviest.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["How far apart did the VPs need to be before the boxes stopped warping?", "Did you keep the verticals truly vertical? Check with the Line tool."] },

    { id: "persp-4", title: "Circles, cylinders and gridding a scene", minutes: 50,
      goal: "Place circles and cylinders correctly in perspective and lay a floor grid to position anything in a scene.",
      why: "Wheels, cups, arches, barrels, tables, clock faces — circles are everywhere, and a circle in perspective is an ellipse whose center is NOT where you'd guess. The floor grid is the tool that lets you put an object exactly where you want it in a scene and at the right size, which is the difference between a scene that's composed and one that's arranged by luck.",
      refs: ["norling", "scott-robertson", "drawabox"],
      pages: [
        { title: "Circle in a square", exemplar: "circleInPersp",
          steps: [
            { h: "Square first, then diagonals", t: "Draw a square lying on the floor in one-point perspective (front edge flat, sides to the VP, back edge shorter). Draw its diagonals: where they cross is the TRUE center — noticeably further back than halfway, because the far half of the square is compressed. Draw the midlines through that center: one to the VP, one horizontal. The circle will touch the square exactly where those midlines meet its edges.", guide: { persp: true, vps: 1 }, tool: "pencil", layer: "Pencils" },
            { h: "Fit the ellipse", t: "The circle touches the square at the four midpoints. Draw an ellipse through those four points, drawing through two or three times. Its widest part sits slightly in FRONT of the perspective center — correct, not a mistake; the nearer half of a circle really is bigger on the page. Do this three times at different distances from the horizon; the ellipses get thinner as they approach it and would become a line on it.", tool: "pencil" },
            { h: "A cylinder standing up", t: "Two such ellipses, one above the other, joined by verticals. The lower one is rounder (further from eye level). Now a cylinder lying DOWN, aimed at the VP: its ellipses' minor axes point at the VP, which is the rule for every wheel, pipe, barrel and cannon in perspective. Draw a car's two near wheels this way and feel how the minor-axis rule keeps them on the same axle.", tool: "pencil" },
            { h: "Arches and a clock", t: "An arch is a half-circle standing up in a wall: draw the wall face in perspective, put a square on it, fit the ellipse, use the top half. A clock on the side wall is a circle on a vertical plane: square on the wall, diagonals, ellipse. Draw both. Circles on vertical planes are where most 'off' drawings of doors and wheels come from.", tool: "pencil" },
          ] },
        { title: "The floor grid", exemplar: "perspRoom",
          steps: [
            { h: "Lay the grid", t: "Draw a row of equal marks along the front edge of the floor. Send each to the VP. Draw one diagonal across the whole floor from the front corner — wherever it crosses a receding line, draw a horizontal. That's a perspective-correct grid of squares, and the rows get closer together as they recede, exactly as tiles do. (The diagonal transfers equal spacing into depth; it works because a diagonal of a square is a diagonal of every square in the row.)", guide: { persp: true, vps: 1 }, tool: "pencil", layer: "Pencils" },
            { h: "Place objects on squares", t: "Now anything sits on a specific square: a chair three squares back and two to the left. Draw four boxes on chosen squares. The grid gives you scale automatically — a box two squares wide near the front is the same 'real' size as a box two squares wide at the back, however different they look on the page. Put a figure on a square and give them a shadow that covers exactly one square.", tool: "pencil" },
            { h: "A two-point grid", t: "Switch the guide to 2-point. The floor grid is now two sets of receding lines, one to each VP; mark equal spacing along a line to one VP, send those marks to the other. Draw four boxes on this grid at different depths. Two-point grids are how you'll lay out a whole street in the Advanced Perspective chapter.", guide: { persp: true, vps: 2 }, tool: "pencil" },
            { h: "Ink the scene", t: "Ink the boxes, not the grid. Keep the grid on the Pencils layer and hide it: the scene should feel measured, not gridded. If the boxes still look like they belong on the floor with the grid hidden, the lesson worked.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Where was the true center of your perspective square — did it surprise you?", "Can you now put a coffee cup exactly 'three tiles back' in a scene?"] },
    ] },

  /* ============================================================ */
  { id: "s2-shading", title: "Shading",
    summary: "Shading is the illusion of light on form. The skill isn't 'making things dark' — it's controlling VALUE (how light or dark) so the eye reads a form turning away from a light source. You'll build a value scale, learn the five zones on a sphere, translate them to cubes and cylinders, then learn the comics-specific tools: hatching, cross-hatching, feathering and spotting blacks. James Gurney's 'Color and Light' and Ctrl+Paint's free value videos are the companions.",
    lessons: [

    { id: "shade-1", title: "Value: the scale and the squint", minutes: 40,
      goal: "Build a controlled 9-step value scale with three tools, and learn to see value by squinting.",
      why: "Value does 90% of the work in any image — a drawing with good values and bad color still reads; the reverse doesn't. Before you can put light on a form you need to be able to hit a specific grey on purpose, with each of Penshi's tools, and you need a way to check values that doesn't lie. Squinting is that check: it blurs detail and leaves only value, and every painter alive uses it.",
      refs: ["ctrlpaint", "gurney-book", "speed"],
      pages: [
        { title: "The value scale", exemplar: "valueScale",
          steps: [
            { h: "Pencil scale", t: "Fill the nine boxes from white to black using the Pencil tool with pressure. Light pressure, then heavier, then layered strokes in a second direction. Each step should be a visibly even jump from the last — no two neighbors alike, no jump twice the size of another. It will take several passes and you will get the middle steps wrong first; that's normal. The middle of the scale is where control lives.", tool: "pencil", layer: "Pencils" },
            { h: "Marker scale", t: "Repeat the row just below with the Marker tool: it's translucent, so overlapping passes build value. Count the passes — 'three passes = step 5'. Write the count under each box. That's control: knowing in advance how many passes make a value means you can hit it on a face later without trial and error.", tool: "marker", layer: "Colors" },
            { h: "Ink hatching scale", t: "A third row in Ink only: value from LINE DENSITY. Sparse hatching for light, tighter for mid, cross-hatched for dark, solid black at the end. Keep the line thickness constant so density alone changes the value. This is how comics get tone on a press that only prints black, and it's the scale you'll use most in the Comics Craft section.", tool: "ink", layer: "Inks" },
            { h: "The squint test", t: "Squint at your three scales until the boxes blur. Where two neighbors merge into one grey, the step is too small; where a jump is obvious, too big. Fix the worst two in each row. Squinting is the value-checking tool you'll use forever — on your own drawings, on references, on other people's comics.", tool: "pencil" },
            { h: "Match a value from a photo", t: "Open any photo. Pick five spots — sky, a shadow, skin, a wall, a dark doorway — and, squinting, decide which step of your scale each matches. Paint a small swatch of that step next to a note of what it was. Then un-squint and check. Matching values from life is the actual skill; the scale was just the ruler.", tool: "marker" },
          ] },
      ],
      reflect: ["Which tool gave you the most control over value? Which was hardest to keep even?", "When you matched the photo, did you make the shadows too dark or too light? Most people make them too dark."] },

    { id: "shade-2", title: "One light, five zones", minutes: 50,
      goal: "Shade a sphere, cube and cylinder from a single light source, naming the five zones on each.",
      why: "Every lit form has the same anatomy: highlight, light, core shadow, reflected light, cast shadow. Learn it once on the primitives and you can light a face, a car or a planet — because they're all primitives, and light doesn't know the difference. The one thing to get right is the ORDER of values: reflected light is never as bright as any lit surface, and the core shadow is the darkest thing on the form.",
      refs: ["ctrlpaint", "gurney-book", "gurney-blog"],
      pages: [
        { title: "The sphere", exemplar: "sphereShade",
          steps: [
            { h: "Decide the light first", t: "Draw the arrow. Every decision after this is downstream of it — if you shade before you've committed to a direction, you'll end up with two lights and a flat form. The light hits from the upper left in the guide. Mark on your sphere where the surface faces the light most directly: that's the highlight, a small bright spot, not a big patch. Everything else is a gradient away from it.", tool: "pencil", layer: "Pencils" },
            { h: "The terminator", t: "Find the line where the surface turns away from the light — the terminator. On a sphere it's a curve (an ellipse through the sphere, whose plane faces the light), not a straight line. Just past it, the CORE SHADOW: the darkest band on the form, because no direct light reaches it and no reflected light has arrived yet. The core shadow is the single mark that makes a shaded circle become a ball; get it in first, with the marker.", tool: "marker", layer: "Colors" },
            { h: "Halftone and reflected light", t: "Between highlight and terminator, the value gradually darkens: that's the halftone, the biggest zone and the one that shows the form's curve. Beyond the core shadow, the surface lightens slightly again — reflected light bouncing up from the table. Keep reflected light DARKER than any halftone or the form goes flat and the light source becomes ambiguous. Build both with counted marker passes from Shade-1.", tool: "marker" },
            { h: "Cast shadow", t: "The sphere blocks light and casts a shadow on the table, on the side away from the light. It's darkest right under the sphere (the occlusion shadow, where the ball touches the table and nothing can bounce in) and softens at its far edge. Its shape is an ellipse stretched away from the light — longer when the light is low, tighter when it's high. Without the cast shadow the ball floats; with it, it sits.", tool: "marker" },
            { h: "Check the value order", t: "Squint. The order from lightest to darkest must be: highlight, light/halftone, reflected light, core shadow, occlusion shadow. If reflected light reads brighter than halftone, or the cast shadow is darker than the core, fix it now — this order is the law for every form you'll ever shade.", tool: "marker" },
          ] },
        { title: "Cube and cylinder, same light", exemplar: "sphereShade",
          steps: [
            { h: "The cube: planes, not gradients", t: "Each face of a cube faces the light at one angle, so each face is ONE value: the top brightest, the side facing the light medium, the side away dark. No gradient within a face — a gradient on a flat plane makes it read as curved. Three flat values and a cast shadow, and that's a lit cube. Draw it, then draw it again with the light coming from the right so the values swap sides.", tool: "marker", layer: "Colors" },
            { h: "The cylinder: a gradient in one direction", t: "A cylinder curves in one direction, so its shading is a gradient going around it but constant along its length. Highlight stripe, halftone, core shadow stripe, reflected light — all vertical bands. The top ellipse is one flat value (it's a plane). Draw it standing, then lying down, where the bands become horizontal and the end ellipse becomes the plane.", tool: "marker" },
            { h: "Combine them", t: "A cylinder standing on a cube, same light. The cylinder casts a shadow across the cube's top face; the cube casts one on the table. The reflected light on the cylinder's shadow side is a little brighter near the cube's lit face, because that face is bouncing light at it. This is a scene, and you lit it with one arrow.", tool: "marker" },
            { h: "Comics translation", t: "Now redo all three forms in Ink only with a 3-value rule: white, one hatch texture for halftone, solid black for core + cast shadow. No reflected light — comics usually drop it. Squint. If the forms still read, you've learned how comics are lit, and you've learned that most of the five zones are optional if the core and cast shadows are right.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which zone did you overdo? (Almost everyone makes reflected light too bright.)", "Did the ink version read as well as the marker version when you squinted? If not, which shadow was missing?"] },

    { id: "shade-3", title: "Mark-making: hatching, blending, texture", minutes: 50,
      goal: "Control value with five different mark-making techniques and choose each for a purpose.",
      why: "In comics you're rarely blending — you're rendering with lines a press can print. Hatching direction can describe form (following the surface) or flatten it (ignoring it), and the choice of mark tells the reader what a surface is made of before they've read the caption. This lesson gives you a vocabulary of marks and the judgment to pick one; the Comics Craft section's inking lessons build on it directly.",
      refs: ["ctrlpaint", "mccloud", "framed-ink"],
      pages: [
        { title: "Five textures, one value", exemplar: "hatchTypes",
          steps: [
            { h: "Hatching", t: "Fill the first box with parallel lines. Value comes from spacing and line thickness; direction is a choice — diagonal is neutral, vertical reads as falling, horizontal as calm. Keep every line the same confident stroke, starting and ending cleanly; hatching is the ghosted-line drill with a purpose. Fill the box at three densities in three bands: light, mid, dark.", tool: "ink", layer: "Inks" },
            { h: "Cross-hatching", t: "A second layer of lines across the first. Two layers = darker; three = darker still. Vary the angle between layers (around 60°, not 90°) so it doesn't turn into a grid or a fabric. Cross-hatching is the workhorse for pen-and-ink shadow, and the number of layers is a value control you can count, like marker passes.", tool: "ink" },
            { h: "Contour hatching", t: "Lines that CURVE with the surface — like the contour ellipses from Foundations, but many, tightly spaced. This is the technique that makes hatched forms look round: the lines themselves say 'this surface bends'. Fill the box with curves that bulge as if over a cylinder, then a second box with curves wrapping a sphere (they bend in two directions).", tool: "ink" },
            { h: "Stippling and scumbling", t: "Dots for a soft, grainy value (slow, meditative, great for skin, stone, or a dusty sky). Scumbling — small looping scribbles — for rough textures like foliage or fur. Fill the last two boxes. Stipple density controls value the way hatch spacing does; scumbling's loop size controls the texture's scale.", tool: "ink" },
            { h: "Direction as meaning", t: "Draw a small cube three times and hatch it three ways: hatching that follows each face's direction (reads solid), hatching all one diagonal regardless of face (reads flat, graphic), and hatching that follows the light rays (reads lit). All three are legitimate comics styles; knowing which you're doing is the skill.", tool: "ink" },
          ] },
        { title: "Smooth blending and feathering",
          hints: ["Marker tool at 40–60% opacity: overlapping passes blend.", "Feathering: hatch lines that TAPER from thick to nothing — the classic comics transition into shadow."],
          steps: [
            { h: "Smooth gradient", t: "With the Marker tool, lay a gradient from black to white across the page width in overlapping passes, each starting a little further right than the last. No hard edges, no visible stripes. This is what you'll use for skies, smoke and soft form on the Colors layer, and it's harder than it looks: the trick is to keep each pass the same pressure and let the overlap do the darkening.", tool: "marker", layer: "Colors" },
            { h: "Feathering", t: "Feathering is comics' answer to blending: a row of ink strokes that start heavy on the shadow side and taper to hairlines toward the light, pressure→size on. Draw a sphere and feather its core shadow so the strokes fade into the halftone. Then a cheekbone: feather from under the bone up into the cheek. The taper must be smooth — a stroke that stops abruptly reads as an edge.", tool: "ink", layer: "Inks" },
            { h: "Pick a texture for each material", t: "Draw four small squares labeled wood, metal, cloth, stone, and render each with the technique that suits it: long parallel hatch for wood grain, a hard highlight next to a smooth gradient for metal, soft cross-hatch for cloth, stipple for stone. Judgment is the skill here; the marks are just the vocabulary.", tool: "ink" },
            { h: "A lit object in your chosen marks", t: "Take the mug from Obs-3 and render it in ink using only hatching families — contour hatching around the body, feathering into the core shadow, cross-hatch for the cast shadow. Squint: it should read as a lit cylinder from a distance and as a drawing of lines up close. That double life is what good ink rendering is.", tool: "ink" },
          ] },
      ],
      reflect: ["Which mark do you reach for by default? Try banning it for one drawing to force range.", "Look at a comic you like. Which of the five marks does the artist use for shadow, and which for texture?"] },

    { id: "shade-4", title: "Lighting scenarios", minutes: 50,
      goal: "Light the same head four ways and understand what each lighting angle communicates.",
      why: "Light is direction, and direction is meaning. Front light is flat and honest; side light is dramatic; rim light is mystery; light from below is wrong in a way readers feel before they can name. Comics artists choose lighting the way film directors do — for the story beat, not for accuracy — and Framed Ink is built around that choice. The Environment chapter's scene-lighting lesson extends this to whole rooms.",
      refs: ["gurney-book", "gurney-blog", "framed-ink", "ctrlpaint"],
      pages: [
        { title: "Four setups", exemplar: "lightScenarios",
          steps: [
            { h: "Front light", t: "Light from the viewer's direction. Almost no shadow on the face — value flattens, shapes read by outline, the features sit on a bright plane. Good for clarity, innocence, a character with nothing to hide. Shade the first head with only slight shadows under the brow, nose and chin, where the planes turn down hardest.", tool: "marker", layer: "Colors" },
            { h: "Three-quarter (Rembrandt)", t: "Light from 45° up-left. The nose casts a shadow that just meets the cheek shadow, leaving a lit triangle under the far eye — the 'Rembrandt triangle'. This is THE portrait light — maximum form with a readable face — because every plane of the head gets a different value. Shade the second head, and find the triangle; if it isn't there, the light is too far to the side or too high.", tool: "marker" },
            { h: "Side (split) light", t: "Light from exactly the side: half the face lit, half in shadow, split down the centerline. Conflict, duality, the villain's reveal, the moment of decision. Shade the third head, keeping the shadow side almost solid with only a hint of reflected light on the far cheek. The eye on the dark side should barely be visible.", tool: "marker" },
            { h: "Rim / back light", t: "Light from behind. The face is in shadow except a bright edge along one side — a silhouette with a glowing outline. Mystery and menace, or a figure against a sunset. Ink the fourth head as solid black with a thin white rim traced along the brow, nose, lips and chin, where the profile catches the light.", tool: "ink", layer: "Inks" },
            { h: "Under-light", t: "One more, small, in the margin: light from BELOW, the campfire or the phone-screen light. Shadows go up: under the brow becomes lit, the top of the nose goes dark, the eye sockets glow. It looks wrong because sunlight never does this, and 'wrong' is exactly what horror wants. Shade it in marker.", tool: "marker", layer: "Colors" },
            { h: "Spot the blacks", t: "Below the four heads, redraw each as a comics inker would: pure black shapes only, no halftone. Which setup gives the most striking black shape? That's the one to use for a dramatic panel, and the exercise of reducing light to black shapes is the whole craft of spotting blacks that Com-3 develops.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["For a scene where a character receives bad news, which of the five would you pick, and why?", "Find the Rembrandt triangle in a film still or a portrait photo. It's in most of them."] },
    ] },

  /* ============================================================ */
  { id: "s2-gesture", title: "Gesture Drawing",
    summary: "Gesture is the pose's ENERGY: what the body is doing, the rhythm of force through it, drawn in seconds before any anatomy. Stiff figures come from starting with outlines; alive figures come from starting with gesture. You will draw from timed photo references (linked, free) — dozens per session, most of them ugly, all of them useful. Penshi's built-in timed drill (the ⏱ button) clears the page for you between poses so nothing slows the session down.",
    lessons: [

    { id: "gest-1", title: "The line of action", minutes: 40,
      goal: "Capture a pose in a single line, then a second, then build the bean on it.",
      why: "The line of action is the spine of the drawing — the one curve that says 'reaching', 'slumping', 'lunging'. Every animator, every comics artist starts here, and every stiff figure you've ever drawn was stiff because it didn't. Your FORCE book (in the Library tab) is an entire method built on this idea of directed force; Proko's gesture course is the free video version.",
      refs: ["force", "proko-gesture", "loa-figure", "quickposes"],
      pages: [
        { title: "C, S and I", exemplar: "gestureLines",
          steps: [
            { h: "Copy the three", t: "C: a body bending or reaching, one big curve from head to foot. S: a body twisting with weight on one leg (contrapposto), the curve reversing at the waist. I: rigid, tense, still — a soldier at attention, a character frozen in shock. Copy each five times, fast and big, from the shoulder, in one stroke. The whole page should take four minutes; if it took ten, you were drawing, not gesturing.", tool: "pencil", layer: "Pencils" },
            { h: "Straights against curves", t: "Mattesi's FORCE principle: where the body pushes into something (a planted leg, a braced arm, a stiff back) draw a STRAIGHT; where it stretches away, draw a CURVE. A pose is a rhythm of straight-curve-straight, and the alternation is what reads as force rather than as a noodle. Draw six poses from imagination as only 3–4 lines each, deliberately alternating straights and curves.", tool: "pencil" },
            { h: "Timed references: 30 seconds", t: "Open Line of Action's figure tool (References) in a browser tab beside Penshi, set it to 30 seconds, and press ⏱ Start here — Penshi's drill clears the page each time the timer ends and collects every pose into a contact sheet at the finish. For each pose draw ONLY the line of action and the second rhythm line. No heads, no hands, no outlines. Twenty poses. If any drawing looks 'good', you spent too long on it.", tool: "pencil", drill: { seconds: 30, poses: 20 } },
            { h: "Read the contact sheet", t: "Look at the sheet the drill made. Circle the three poses whose line of action you could name in one word (lunging, slumping, reaching). Those three worked. In the rest, the line probably followed the outline of the body instead of the force through it — the most common gesture mistake, and the one to hunt next time.", tool: "pencil" },
          ] },
        { title: "The bean", exemplar: "beanFigure",
          steps: [
            { h: "Ribcage and pelvis on the line", t: "On a line of action, hang two masses: an egg for the ribcage and a smaller egg for the pelvis, pinched at the waist — the bean. They TILT AGAINST each other in most poses (ribcage one way, pelvis the other), and that tilt is where the pose's twist lives. The bean bends, stretches on one side and compresses on the other. Copy the guide, then draw the bean on ten different lines of action.", tool: "pencil", layer: "Pencils" },
            { h: "Timed: 60 seconds with the bean", t: "Line of Action, 60-second timer, drill on. Line of action, then the bean, then quick lines for limbs — no more. Fifteen poses. Notice how much the pelvis tilt alone communicates weight: the hip over the planted leg rides higher, always.", tool: "pencil", drill: { seconds: 60, poses: 15 } },
            { h: "Pick one and push it", t: "Choose your best gesture from the contact sheet and redraw it, larger, exaggerating the line of action 20% further — more bend, more stretch, the bean's tilt increased. Comics figures are pushed; life drawing is measured. Learn to do both on purpose, and learn that pushing only works if the original line was honest.", tool: "pencil" },
            { h: "Push it too far", t: "Now redraw the same pose exaggerated 100%. It will break — the body will look boneless. Find the point between 20% and 100% where it stops reading as a body. That point is your style's limit, and knowing it is worth more than any rule.", tool: "pencil" },
          ] },
      ],
      reflect: ["Which lines were straights and which curves in your favorite pose? Did the choice match where the weight was?", "Look at the contact sheet: which poses are outlines pretending to be gestures?"] },

    { id: "gest-2", title: "Weight, balance and rhythm", minutes: 50,
      goal: "Draw figures that stand up — balanced over their support — with rhythm flowing through the limbs.",
      why: "A figure that isn't balanced looks wrong before any anatomy is judged; readers can't say why, but they feel the character is about to fall over. Balance is a physics question (where is the weight over the feet?) and rhythm is the flow of one form into the next. Both are learned at gesture speed, because at gesture speed you can't fake them with detail.",
      refs: ["proko-gesture", "force", "loa-figure", "posemaniacs"],
      pages: [
        { title: "Center of gravity", exemplar: "beanFigure",
          steps: [
            { h: "The plumb line from the pit of the neck", t: "Drop a vertical from the pit of the neck (between the collarbones). If the figure stands on one leg, that line lands on that foot. On two legs, between them. Leaning on a wall, it lands on the wall's contact point. Draw six standing poses from Line of Action and mark this plumb line on each — do they balance? A figure whose plumb line lands outside its support is falling, whether you meant it or not.", tool: "pencil", layer: "Pencils" },
            { h: "Contrapposto", t: "Weight on one leg: that hip rises, the shoulders tilt the opposite way to compensate, the head tilts back toward level so the eyes stay horizontal. The spine makes an S. Draw it from the front, then the back — the hip and shoulder lines are the whole story, and they must tilt opposite ways. Then draw it wrong on purpose, hips and shoulders tilting the same way, and feel how the figure topples.", tool: "pencil" },
            { h: "Motion: off-balance on purpose", t: "A running figure is falling forward and catching itself. Draw three poses where the plumb line lands AHEAD of the feet — that reads as motion. Behind the feet reads as recoiling, being hit, stopping short. Leaning into a wind, pulling a rope: the plumb line falls away from the force. Balance is the tool; imbalance is the story.", tool: "pencil" },
            { h: "Timed: 45 seconds, plumb line included", t: "Drill on, 45 seconds. Line of action, bean, then the plumb line and the feet — nothing else. The point is to place the feet where the plumb line demands. Twelve poses. On the contact sheet, count how many figures stand up.", tool: "pencil", drill: { seconds: 45, poses: 12 } },
          ] },
        { title: "Rhythm through the limbs",
          hints: ["Line of Action, 2-minute timer, 10 poses.", "Trace the rhythm: a curve that flows from the shoulder, down the arm, into the hand — then out the fingertip.", "Limbs are tapered tubes hung on the rhythm line."],
          steps: [
            { h: "Two-minute gestures", t: "Longer timer now: line of action, bean, then limbs as flowing rhythm lines (not tubes yet). The arm's rhythm continues the torso's twist; the leg's rhythm runs from the hip through the knee into the foot in one curve, reversing once. Ten poses, drill on. Look for the rhythm that crosses the body — shoulder to opposite hip — in every twisting pose.", tool: "pencil", layer: "Pencils", drill: { seconds: 120, poses: 10 } },
            { h: "Tubes on the rhythms", t: "Take your three best from the sheet and redraw them larger, adding tapered tubes on the limb rhythms, keeping the flow. Overlap at the joints (upper arm in front of forearm, or behind — decide from the pose). The tubes should not change the rhythm; if they stiffen it, you've drawn tubes and forgotten the line. This is the bridge into the Body Construction chapter.", tool: "pencil" },
            { h: "Ink one at speed", t: "Ink your best gesture in under two minutes with the Ink tool. Pressure heavy on the load-bearing lines (the planted leg, the braced arm), light on the stretching ones. That weight contrast IS the gesture, in ink. Save this page — it's the baseline you'll compare against in the Figure Drawing chapter.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which poses fell over? What was the plumb line doing?", "Try a 10-minute gesture session tomorrow before drawing anything else. That's the habit, and the ⏱ Drill button is on the Learn home page for exactly that."] },

    { id: "gest-drill", title: "Timed gesture drill", minutes: 15,
      goal: "Run a self-clearing gesture session — 30-second poses from a reference site, the page wiped between poses, every pose collected onto a contact sheet — as a daily warm-up.",
      why: "Gesture is a habit, not a lesson, and the thing that kills the habit is friction: clearing the page, saving, losing the poses. This drill removes all of it. Press Start, draw from the pose site in the next window, and let the timer do the rest. The contact sheet at the end lands in your Portfolio, so a month of drills becomes a month of visible progress. Every professional figure artist does some version of this before real work.",
      refs: ["loa-figure", "quickposes", "croquis", "adorkastock", "posemaniacs", "force"],
      pages: [
        { title: "Drill", exemplar: "drillSheet",
          steps: [
            { h: "Set up the reference", t: "Open one of the pose sites from References in a browser tab (Line of Action and Quickposes both have their own timer — set it to match, or ignore it and let Penshi's run). Snap the browser beside Penshi with Win + ← / → so you can glance without turning. Pick the pose category you're weakest at; the Portfolio will tell you which if you're honest.", tool: "pencil", layer: "Pencils" },
            { h: "Run the drill", t: "Choose seconds and pose count below and press Start. Draw big, from the shoulder: line of action first, the bean, then rhythm lines for the limbs, and stop when the timer stops — the page clears itself and the pose is captured. Keys: P pauses, N skips ahead. When the count is reached (or you press Finish) a contact sheet of every pose is added as a new page and saved to the Portfolio.", tool: "pencil", drill: { seconds: 30, poses: 20 } },
            { h: "Read the sheet", t: "On the contact sheet page, circle the three most alive poses and put an X on the three stiffest. Write one word under each circled one naming the force (lunge, sag, reach). Under each X, name the fault: outline instead of line, no bean, plumb line off. That's your note for tomorrow's drill. Then close the lesson; the page is already saved.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Did the timer feel too short? Good. Shorten it once more next week.", "Compare today's sheet with one from two weeks ago in the Portfolio. Are the lines of action longer and fewer?"] },
    ] },
  ],
});
