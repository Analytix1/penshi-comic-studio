/* Curriculum · fourth batch: machines and creature-design deep dives,
   plus two new lessons — objects in motion, and depth on layers.
   Pages are appended to the end of a lesson and new lessons to the end
   of a chapter, so saved progress keeps its place. */
"use strict";

(() => {
  const each = fn => { for (const s of PENSHI_CURRICULUM) for (const c of s.chapters) fn(c); };
  const find = id => { let hit; each(c => { for (const l of c.lessons) if (l.id === id) hit = l; }); return hit; };
  const extend = (id, minutes, pages) => { const l = find(id); if (!l) return; l.pages.push(...pages); l.minutes = (l.minutes || 0) + minutes; };
  const addLesson = (chapterId, lesson) => each(c => { if (c.id === chapterId && !c.lessons.some(l => l.id === lesson.id)) c.lessons.push(lesson); });
  const pencil = { tool: "pencil", layer: "Pencils" }, ink = { tool: "ink", layer: "Inks" };

  /* ---------------- Machines ---------------- */
  extend("obj-1", 90, [
    { title: "Joints through their range", exemplar: "jointRange",
      hints: ["Fixed half first, moving half second.", "Every joint has a path and a stop."],
      steps: [
        { h: "The fixed half, twelve times", level: 1, t: "Trace or copy the fixed half of each joint in all three columns: the hinge's plate and pin, the pivot's base and post, the slider's sleeve, the ball's socket. They are identical across each row. Mark the axis of each one with a centre line.", ...pencil },
        { h: "The moving half in three positions", level: 2, t: "Add the moving half at the start, middle and end of its travel. For the hinge and pivot, the moving part keeps its length and only its angle changes. For the slider, the rod keeps its angle and only its position changes. For the ball, the rod leans but its base stays in the socket.", tool: "pencil" },
        { h: "The path", level: 3, t: "Turn on level 3 and draw the path the far end sweeps: an arc for the hinge, a flat ellipse for the pivot, a straight line for the slider, a ring for the ball. Check your three positions all sit on that path. If one does not, the part changed length.", tool: "pencil" },
        { h: "Find the stops on a real one", level: 3, t: "Hide the guides. Find one real example of each joint near you (a door, a desk-chair base, a drawer, a tripod head). Move it to each end of its travel and draw it there, with whatever stops it: a door frame, a bump, the end of a slot. Draw the stop as carefully as the joint.", ...ink },
      ] },
    { title: "A jointed arm", exemplar: "armLinkage",
      hints: ["Segment lengths never change.", "Move the dots, check the arcs, then draw the parts."],
      steps: [
        { h: "Dots and centre lines", level: 1, t: "Copy the base, the three hinge dots and the centre lines for all three poses. Measure the two long segments with a strip of paper and confirm they are the same length in every pose. Only the angles between them differ.", ...pencil },
        { h: "Tubes and pins", level: 2, t: "Build a tube on each centre line and a short pin housing across each hinge. The housings are cylinders whose axes are all parallel — check their ellipses lean the same way. The end piece is a cone: draw its far rim as a full ellipse.", tool: "pencil" },
        { h: "Arcs", level: 3, t: "Turn on level 3. The dashed arcs show where the elbow can be (a circle round the shoulder) and where the wrist can be (a circle round the elbow). Find a fourth pose by picking a new point on the first arc, then a new point on the arc drawn from there.", tool: "pencil" },
        { h: "A real arm, three poses", level: 3, t: "Hide the guides. Study a real jointed arm — a desk lamp, an excavator, a folding ruler — from photographs or the 3-D model links, and count its joints. Draw it in three poses from one viewpoint: dots, arcs, then parts. Ink the pose that best shows how it works.", ...ink },
      ] },
    { title: "Passing motion on", exemplar: "motionTransfer",
      hints: ["Gears reverse; belts do not.", "A crank turns spinning into sliding; a lever trades distance for force."],
      steps: [
        { h: "Fixed points", level: 1, t: "Copy the four frames with only the axles and the pivot marked. These points do not move. Before drawing any mechanism, find the points that are bolted to the frame; everything else swings or slides around them.", ...pencil },
        { h: "The parts", level: 2, t: "Add the parts: two toothed wheels touching; two plain wheels with a belt round them; a wheel with an off-centre pin, a rod, and a block between two rails; a bar on a wedge with a load at the short end. Keep the wheels round — use the ellipse tool if you need to.", tool: "pencil" },
        { h: "Follow the motion", level: 3, t: "Turn on level 3 and draw the arrows. Then answer in the margin for each frame: if the first part turns one full turn (or the long end drops one hand-width), how far does the last part go? The small gear turns nearly twice; the load rises only a little.", tool: "pencil" },
        { h: "Find them in a real machine", level: 3, t: "Hide the guides. Choose one real machine with visible workings — a bicycle, a hand drill, a can opener, a sewing machine. Draw it as fixed points first, then parts, then arrows from where the force goes in to where the work comes out. Label each of the four mechanisms you find.", ...ink },
      ] },
  ]);

  /* ---------------- Creature design: method, on real animals ---------------- */
  extend("cr-1", 65, [
    { title: "Where limbs attach", exemplar: "girdles",
      hints: ["Shoulder girdle on the ribcage; hip girdle on the pelvis.", "The joints come in the same order in every mammal."],
      steps: [
        { h: "Spine and leg lines", level: 1, t: "Trace the spine and leg lines of the horse and the dog. Mark where each leg line meets the body. The front leg does not start at the bottom of the chest — it starts high on the side of the ribcage, at the shoulder blade.", ...pencil },
        { h: "Girdles and joints", level: 2, t: "Turn on level 2. Circle the shoulder and hip, then put a dot on every joint down each leg and name them from the labels. Do the same on the dog without labels. The order is identical; the dog's lower bones are simply shorter.", tool: "pencil" },
        { h: "Volumes", level: 3, t: "Add the volumes over your dots. The shoulder blade lies flat on the ribcage and slides when the leg swings; the pelvis is fixed to the spine. That is why the front of an animal absorbs landings and the back drives.", tool: "pencil" },
        { h: "Check your own design", level: 3, t: "Hide the guides. Take the creature you built on the first page of this lesson and draw its skeleton line again. Circle every girdle and dot every joint. For each limb, write which real animal's limb it is modelled on. Where a limb has no girdle, decide what it attaches to and redraw.", ...pencil },
      ] },
    { title: "Does it stand?", exemplar: "creatureBalance",
      hints: ["Weight over the feet.", "A heavy head or tail moves the balance point."],
      steps: [
        { h: "Three standing animals", level: 1, t: "Trace the spine and legs of the horse, dog and bear on the ground line. Note where the feet are relative to the body: the front feet under the shoulder, the hind feet a little behind the hip.", ...pencil },
        { h: "Volumes", level: 2, t: "Add the volumes. As you draw each mass, judge its weight: the ribcage is the heaviest, then the hindquarters, then the head and neck. The bear's head is low and close in; the horse's is high and far forward.", tool: "pencil" },
        { h: "The balance check", level: 3, t: "Turn on level 3. Draw the support bar between hind feet and front feet, estimate the balance point and drop a line from it. It lands inside the bar in all three, nearer the front. The dot's position here is an estimate — judge it by eye from the masses, as you will on your own designs.", tool: "pencil" },
        { h: "Test your creature", level: 3, t: "Hide the guides. Draw your own creature standing, side-on, on a ground line. Mark the support bar and the balance point. If the line falls outside the bar, change the design until it stands: move the feet, shorten what overhangs, or add weight at the other end. Then draw the corrected version.", ...ink },
      ] },
  ]);
  extend("cr-2", 60, [
    { title: "Size changes the build", exemplar: "scaleBuild",
      hints: ["Compare proportion, not size.", "Bigger animals need proportionally more leg under them."],
      steps: [
        { h: "Four animals, one width", level: 1, t: "Trace the spine and leg lines of the cat, dog, horse and bear. They are drawn to the same width so the proportions can be compared. Notice how much of each animal's height is leg.", ...pencil },
        { h: "Volumes", level: 2, t: "Add the volumes. Compare the thickness of the legs with the depth of the chest in each one. The cat's legs are thin and folded; the horse's are long and straight; the bear's are thick columns.", tool: "pencil" },
        { h: "Measure body against leg", level: 3, t: "Turn on level 3 and copy the two brackets on each animal: body depth from the top of the shoulder to the elbow, and leg length from the elbow to the ground. Write the ratio beside each. This number is what makes an animal look its size.", tool: "pencil" },
        { h: "Size your creature", level: 3, t: "Hide the guides. Write down how large your own creature really is, compared with a person. Find a real animal of about that size and measure its body-to-leg ratio from a side photograph. Redraw your creature with that ratio, and compare it with your first version.", ...pencil },
      ] },
    { title: "The silhouette test, practised", exemplar: "silhouetteTest",
      hints: ["What identifies it must be on the outside edge.", "Test at thumbnail size."],
      steps: [
        { h: "Construction", level: 1, t: "Trace the four animals as volumes, or draw them from the Animal chapter. Before filling anything, write beside each the two or three features you think will survive as an outline.", ...pencil },
        { h: "Fill them solid", level: 2, t: "Turn on level 2 and fill your four drawings solid with the marker. Compare with your predictions. Anything inside the outline — eyes, markings, muscle — has gone. The neck, the back line, the legs and the tail carry everything.", tool: "marker" },
        { h: "Shrink them", level: 3, t: "Draw each silhouette again at thumbnail size, as in level 3. If two of yours look alike at that size, find the one outline feature that separates them and exaggerate it slightly.", tool: "marker" },
        { h: "Your creature, three levels", level: 3, t: "Hide the guides. Put your own creature through the same three stages: construction, solid fill, thumbnail. Show the thumbnail to someone without explaining it and ask what they see. Adjust only the outline, and repeat until the answer matches what you intended.", tool: "marker" },
      ] },
  ]);

  /* ---------------- New lesson: objects in motion ---------------- */
  addLesson("s5-objects", {
    id: "obj-4", title: "Objects in motion", minutes: 110,
    goal: "Draw things that are thrown, dropped, bounced and driven so that their path, speed and weight are clear in a single still image.",
    why: "A comic panel is one frozen moment, so motion has to be built into the drawing: where the object is on its path, how it is tilted, what it does when it meets the ground, and which marks trail behind it. These rules are the same ones animators use, applied to one frame instead of twenty-four.",
    refs: ["force", "scott-robertson", "pexels", "framed-ink"],
    pages: [
      { title: "Arcs: thrown and falling things", exemplar: "throwArc",
        hints: ["Draw the whole path first.", "Even gaps sideways; shrinking gaps toward the top."],
        steps: [
          { h: "The path", level: 1, t: "Trace both arcs and their ground lines, then draw two more arcs of your own beside them: one high and narrow, one low and long. Each is a single smooth curve, steepest at the ends and flat at the top.", ...pencil },
          { h: "Ten equal moments", level: 2, t: "Turn on level 2 and place the ball at ten equal moments on the first arc. Rule light vertical lines at even spacing to get the sideways positions, then put each ball where its line meets the arc. See how the balls crowd together at the top.", tool: "pencil" },
          { h: "The tumbling box", level: 3, t: "On the second arc, put a dot at each of the ten positions first. Then draw the box round each dot, turned a little further every time. The dot — the centre — stays on the arc while the corners wander above and below it.", tool: "pencil" },
          { h: "One panel, one moment", level: 3, t: "Hide the guides. Choose an object and a throw of your own. Draw its arc lightly, then draw the object ONCE, at the moment you would show in a comic panel, and ink only that one. Try the same throw with the object at the start, the top and just before landing, and compare what each says.", ...ink },
        ] },
      { title: "Bounce and weight", exemplar: "bounceWeight",
        hints: ["Each bounce is lower and shorter.", "Weight shows at the moment of contact."],
        steps: [
          { h: "Two paths", level: 1, t: "Trace both paths. Count the bounces and compare the heights: the light ball keeps well over half its height each time, the heavy one almost none. Mark the highest point of every bounce.", ...pencil },
          { h: "Equal moments", level: 2, t: "Add the balls. There are more of them on a high bounce than a low one because a high bounce takes longer. Near the ground the gaps are widest: that is where the ball is fastest.", tool: "pencil" },
          { h: "Contact", level: 3, t: "Turn on level 3. At each landing the light ball is drawn flattened, and just after it is drawn stretched along its path. The heavy ball stays round and the ground gives instead. Copy each contact carefully — the flattened ball is wider than the round one by as much as it is shorter.", tool: "pencil" },
          { h: "Two objects of your own", level: 3, t: "Hide the guides. Pick two real objects of very different weight and springiness (a tennis ball and a brick, a balloon and a bowling ball). Drop each from the same height and draw its path, its positions and its first contact. Use slow-motion video for reference if you can.", ...ink },
        ] },
      { title: "A vehicle under way", exemplar: "vehicleMotion",
        hints: ["Wheels stay on the ground; the body tips.", "Weight goes back, forward, or to the outside."],
        steps: [
          { h: "Wheels and the level line", level: 1, t: "Trace the four sets of wheels and the dashed level line over each. The wheels do not change. The level line is where the body's waistline would be if the vehicle were parked.", ...pencil },
          { h: "Tip the body", level: 2, t: "Add the body in each case, measuring its tilt against the level line. Pulling away: the back sinks. Braking: the front sinks. Cornering, seen from the front: the body leans away from the centre of the turn while the wheels stay upright.", tool: "pencil" },
          { h: "Where the weight goes", level: 3, t: "Turn on level 3 and add the arrows. Then look at the space between each wheel and the body above it: on the loaded side it has nearly closed. Darken that gap on the loaded side and open it on the other.", tool: "pencil" },
          { h: "Your vehicle, three states", level: 3, t: "Hide the guides. Take a vehicle from the Vehicles lesson — one you drew or designed — and draw it parked, braking hard and cornering, from one viewpoint. Change only the tilt and the wheel gaps. Add a driver or a load that shifts the same way the body does.", ...ink },
        ] },
      { title: "Showing speed on a still page", exemplar: "speedLines",
        hints: ["Marks go behind; the front stays clean.", "One convention per panel."],
        steps: [
          { h: "Four frames, one object", level: 1, t: "Trace the four frames with the object in each. It is moving left to right. In the third frame leave the object out for now: its shape is the effect.", ...pencil },
          { h: "Add the marks", level: 2, t: "Turn on level 2. Speed lines: straight, parallel, different lengths, all stopping short of the object. Multiples: the same outline again, fainter each time. Smear: one long shape, round at the front and tapering behind. Streaked background: the object crisp and the lines running the full width behind it.", tool: "pencil" },
          { h: "Reverse it", level: 2, t: "Redraw two of the frames with the object moving right to left, then one moving toward the viewer (the lines now spread out from a point behind it). In every version, check the leading edge is clean.", tool: "pencil" },
          { h: "Your own panel", level: 2, t: "Hide the guides. Take the object from the first page of this lesson, or a vehicle from the third, and draw one finished panel of it at speed. Choose the convention that suits the tone: speed lines are loud, a streaked background is cinematic, a smear is comic. Ink it.", ...ink },
        ] },
    ],
    reflect: ["Which single moment on a path tells the most about what happens next?", "Find a panel in a comic you like that shows speed. Which of the four conventions does it use, and what did it leave out?"],
  });

  /* ---------------- New lesson: depth on layers ---------------- */
  const planes = ["Background", "Middle ground", "Foreground"];
  addLesson("s5-env", {
    id: "env-5", title: "Depth on layers: building a complex scene", minutes: 120,
    goal: "Build a scene from three overlapping planes, each on its own layer, and use the layers to control overlap, value and detail.",
    why: "A complicated picture is several simple pictures stacked. Drawing each plane on its own layer lets you draw shapes that pass behind others without erasing, judge each plane alone, give each one its own value, and slide a whole plane sideways to fix the composition. Painters and animators have worked this way for a century; layers make it easy.",
    refs: ["framed-ink", "gurney-book", "fzd", "loa-env"],
    pages: [
      { title: "Three planes, three layers", exemplar: "layerPlanes", layers: planes,
        hints: ["One layer per plane: Background, Middle ground, Foreground.", "Draw far to near."],
        steps: [
          { h: "The far plane", level: 1, t: "This page has three extra drawing layers, named for the three planes. You are on Background. Draw the frame, then the far plane: the horizon, a far ridge and a few small distant blocks. Thin lines, no detail. Draw the ridge right across, even where something will later cover it.", tool: "pencil", layer: "Background" },
          { h: "The middle plane", level: 2, t: "You are now on the Middle ground layer. Draw the ground edge, the larger blocks and the small standing figure. Let them overlap the far ridge freely — it is on another layer, so nothing needs erasing. This plane is where the subject lives.", tool: "pencil", layer: "Middle ground" },
          { h: "The near plane", level: 3, t: "On the Foreground layer, draw the big near shapes at the edges of the frame with a heavier line: the post, the overhang, the ground lip. They are cropped by the frame and overlap both planes behind them.", tool: "pencil", layer: "Foreground" },
          { h: "Look at each alone", level: 3, t: "Hide the guides. In the Layers tab, tap the eye beside each of your three layers in turn so that only one shows. Each should make sense alone. Then show all three and step between them with the . and , keys, adding one shape to each that overlaps the plane behind.", tool: "pencil", layer: "Middle ground" },
        ] },
      { title: "Where layers cross", exemplar: "layerOverlap", layers: planes,
        hints: ["Overlap, don't touch.", "A gap of air, a heavier near line, a step in value."],
        steps: [
          { h: "The far shape", level: 1, t: "On the Background layer, draw the far block in each of the four frames. Draw the whole rectangle lightly, including the dashed part that will be hidden: on a lower layer you can always draw through.", tool: "pencil", layer: "Background" },
          { h: "The near shape", level: 2, t: "On the Foreground layer, draw the near post in each frame. In the first frame its edge only touches the block — look at how flat that is. In the second it clearly covers part of the block.", tool: "pencil", layer: "Foreground" },
          { h: "Gap, weight, value", level: 2, t: "Third frame: go back to the Background layer and erase the far lines just short of the post, then thicken the post's outline on the Foreground layer. Fourth frame: fill the block with a pale grey on its layer and the post with a dark grey on its own.", tool: "marker", layer: "Background" },
          { h: "Hunt the tangents", level: 2, t: "Hide the guides. Go back to the previous page of this lesson and look for anywhere two shapes on different layers only touch, or share an edge. Fix each one by moving a shape so that it clearly overlaps or clearly clears. Then add a gap of air round your figure.", tool: "pencil", layer: "Middle ground" },
        ] },
      { title: "One object on three layers", exemplar: "layerDepth", layers: planes,
        hints: ["Size, value, detail and line weight change together.", "Near shapes may leave the frame."],
        steps: [
          { h: "The far row", level: 1, t: "On the Background layer, draw the frame and the row of small far posts with a thin line. Fill them with the palest grey. No detail at all: at this distance a post is a mark.", tool: "pencil", layer: "Background" },
          { h: "The middle row", level: 2, t: "On the Middle ground layer, draw the three middle posts: more than twice the size, a normal line, a middle grey, and one or two details. Their bases sit lower in the frame than the far row's.", tool: "pencil", layer: "Middle ground" },
          { h: "The near pair", level: 3, t: "On the Foreground layer, draw the two near posts with a heavy line and a dark grey. They run off the bottom of the frame. Put all the detail here: the cap, the band, the edge.", tool: "pencil", layer: "Foreground" },
          { h: "Your own repeated object", level: 3, t: "Hide the guides. Choose one object from your own world that repeats — a tree, a lamp, a window, a person — and draw it on all three layers, changing size, value, detail and line weight together. Then lower the Background layer's opacity in the Layers tab and see how much further away it goes.", ...ink },
        ] },
      { title: "Recompose by moving a layer", exemplar: "layerPasses", layers: planes,
        hints: ["Big shapes on each layer first.", "Slide a whole layer to fix the picture."],
        steps: [
          { h: "Far and middle planes", level: 1, t: "On the Background layer draw the frame, horizon and ridge twice, side by side. On the Middle ground layer add the ground edge and the small figure in both. The two frames are identical so far.", tool: "pencil", layer: "Background" },
          { h: "Foreground, first try", level: 2, t: "On the Foreground layer, draw and fill the two big near shapes in the left frame as the guide shows them. One of them covers the figure. That is a real problem, and with everything on one layer you would have to redraw to fix it.", tool: "marker", layer: "Foreground" },
          { h: "Move the layer's shapes", level: 3, t: "In the right frame, draw the same two shapes shifted along, so the figure stands in the open window between them. Then try it properly on the left frame: choose the Lasso, circle your foreground strokes, and drag them sideways until the window frames the figure.", tool: "marker", layer: "Foreground" },
          { h: "A scene of your own, in passes", level: 3, t: "Hide the guides. Build one scene from your own world following the order of work on the guide: big shapes on each layer, check each alone, slide layers until the overlaps help, one grey per layer, second-size shapes, and detail last and only round the focal point. Ink the result on the Inks layer.", ...ink },
        ] },
    ],
    reflect: ["Which plane did the most work in your final scene? Which could you have left almost empty?", "Hide your foreground layer. Is the picture better or worse without it, and why?"],
  });
})();
