/* Curriculum · deep-dive pages, third batch: composition, worldbuilding
   and weapons. Appended to the end of each lesson. */
"use strict";

(() => {
  const find = id => { for (const s of PENSHI_CURRICULUM) for (const c of s.chapters) for (const l of c.lessons) if (l.id === id) return l; };
  const extend = (id, minutes, pages) => { const l = find(id); if (!l) return; l.pages.push(...pages); l.minutes = (l.minutes || 0) + minutes; };
  const pencil = { tool: "pencil", layer: "Pencils" }, ink = { tool: "ink", layer: "Inks" }, marker = { tool: "marker", layer: "Pencils" };

  /* ---------------- Composition ---------------- */
  extend("env-1", 110, [
    { title: "Where the eye goes", exemplar: "focalPoint",
      hints: ["One focal point per picture.", "Thirds, leading lines, a frame inside the frame, and the odd one out."],
      steps: [
        { h: "Four frames in thirds", level: 1, t: "Trace the four frames and split each into thirds, or rule your own. The four places where the lines cross are where a subject sits comfortably: off-centre, with space on one side to look or move into. Mark one crossing in each frame.", ...pencil },
        { h: "Block the big shapes", level: 2, t: "Copy the shapes in each frame with the marker, as flat blocks. Nothing here is a detailed object — a tower is a rectangle, a road is two lines. In the third frame the dark shapes at the edges are the 'frame inside the frame': they are near, dark and plain so the eye passes through them.", tool: "marker" },
        { h: "Mark the landing point and the route", level: 3, t: "Turn on level 3. Circle where your eye stops in each of your frames, and draw an arrow for how it got there. If your circle is somewhere different from the guide's, look for what pulled you: usually a stronger contrast you made by accident.", tool: "pencil" },
        { h: "Four of your own", level: 3, t: "Hide the guides. Choose one setting of your own and draw it four times at thumbnail size, using one of the four tools each time. Then a fifth that uses two tools together. Put a dot on the focal point of each and ask someone where they looked first.", tool: "marker" },
      ] },
    { title: "Three values", exemplar: "valueGroups",
      hints: ["Light, middle, dark — and nothing in between.", "The subject sits against the value most unlike it."],
      steps: [
        { h: "Five shapes, four times", level: 1, t: "Trace the five shapes in each frame: sky, far hills, middle ground, foreground (with the tall shape at the left) and the subject. Keep the four frames identical. All the difference will come from value.", ...pencil },
        { h: "Fill with three values", level: 2, t: "Turn on level 2 and fill your frames to match, using the marker at three pressures or three greys from the palette. Each shape gets exactly one value. Where two neighbours share a value, let them merge and do not draw the line between them.", tool: "marker", layer: "Colors" },
        { h: "Squint and count", level: 2, t: "Squint at each frame until the details go. Count the big shapes you can still see: three or four is strong, seven is noise. Write under each frame what time of day or weather it feels like. You changed nothing but the grouping.", tool: "pencil" },
        { h: "Regroup your own thumbnail", level: 2, t: "Hide the guides. Take the best thumbnail from the first page of this lesson and repaint it three times with different value groupings. Keep the one where the subject separates most clearly, and note which value it sits against.", tool: "marker", layer: "Colors" },
      ] },
    { title: "Armatures", exemplar: "compArmatures",
      hints: ["An armature is the two or three lines the big shapes follow.", "Choose it for the feeling, before the objects."],
      steps: [
        { h: "Six frames", level: 1, t: "Trace the six frames, or draw six of your own at the same proportion as your comic's panels. Write the name of each armature under it so you learn the vocabulary: thirds, diagonal, triangle, L-shape, S-curve, radial.", ...pencil },
        { h: "Draw each armature in three strokes", level: 2, t: "Turn on level 2 and draw each armature freehand, large and confident, in no more than three or four strokes. The diagonal tips a picture into motion; the triangle sits still; the S-curve walks the eye slowly into the distance; the radial pins it to one spot.", tool: "marker" },
        { h: "Hang masses on them", level: 3, t: "Turn on level 3 and block in the grey masses. Notice that the masses lie ALONG the armature or stop against it, and that the largest empty area is as deliberate as the largest filled one. Empty space is a shape too.", tool: "marker" },
        { h: "One moment, six armatures", level: 3, t: "Hide the guides. Pick a single story moment from your own comic and thumbnail it on all six armatures. Do not change what happens, only how the shapes are arranged. Circle the one whose feeling matches the moment, and write one line on why.", tool: "marker" },
      ] },
    { title: "Camera height", exemplar: "cameraHeights",
      hints: ["The horizon is the height of the camera.", "Nothing in the scene moves; only the eye level does."],
      steps: [
        { h: "Three horizons, three sets of footprints", level: 1, t: "Trace the horizon and the three footprints in each view. From above, the footprints are wide open and far below the horizon. From near the ground they flatten almost to lines, close under it. The footprints tell you the camera height before any wall is drawn.", ...pencil },
        { h: "Raise the boxes", level: 2, t: "Add the three boxes in each view. In the low view every vertical edge crosses the horizon and most of each box is above it. In the high view you see the tops. At eye level the verticals are upright. In the high and low views they lean a little toward a third vanishing point, far below or far above.", tool: "pencil" },
        { h: "Add the person", level: 3, t: "Turn on level 3 and add the figure. At eye level the horizon passes through the figure's eyes, and would pass through the eyes of anyone the same height standing anywhere on that ground. From below, the figure's whole body is above the horizon.", tool: "pencil" },
        { h: "Your own scene, three heights", level: 3, t: "Hide the guides. Thumbnail one setting of your own from above, at eye level and from near the ground. Write under each who or what seems to have the power in the picture. Keep the one that suits the story, and ink it.", ...ink },
      ] },
  ]);

  /* ---------------- Worldbuilding ---------------- */
  extend("env-4", 95, [
    { title: "How a building meets the ground", exemplar: "landToBuilding",
      hints: ["Same building, three grounds.", "The footing is the part that answers the land."],
      steps: [
        { h: "Three grounds", level: 1, t: "Trace the slope, the water and the rock, or draw the ground from your own landform reference three times. Draw ground as a form with thickness and a visible edge, not as a line. On the slope, mark which way is downhill.", ...pencil },
        { h: "The footing", level: 2, t: "Add the footings. On the slope: a level deck, dug into the hill on one side and held on posts on the other. Over water: a deck on posts. On rock: a plinth that makes a level top. In each case draw the level surface first, then what holds it up.", tool: "pencil" },
        { h: "The same building", level: 3, t: "Turn on level 3 and set the box and roof on each footing. It is identical each time. Compare the three results: the building reads as belonging to three different places although only what is underneath it changed.", tool: "pencil" },
        { h: "Your ground, your footing", level: 3, t: "Hide the guides. Look at photographs of real buildings on the kind of land your world has, and write down how they meet the ground. Then draw one simple building from your own world on your own ground, using that logic. Draw it twice: a small building and a large one.", ...ink },
      ] },
    { title: "From map to view", exemplar: "settlementPlan",
      hints: ["Plan first: a path and plots.", "Then stand at one point and raise it."],
      steps: [
        { h: "The plan", level: 1, t: "Copy the plan: the path and the seven numbered plots. Then find each numbered footprint in the view below it. Near plots are low on the page and large; far plots are higher and smaller. The bend in the path looks much tighter in the view than on the plan.", ...pencil },
        { h: "Raise the boxes", level: 2, t: "Turn on level 2 and raise each footprint into a box. All verticals are upright. Heights differ on purpose: one building is clearly the tallest, and it stands where the path leads. Near boxes overlap far ones — draw the near ones first.", tool: "pencil" },
        { h: "Roofs and people", level: 3, t: "Add the roofs and the two people. The near person and the far person stand on the same ground, so the horizon crosses both at the same part of the body. Use them to check that your doors would be a believable size.", tool: "pencil" },
        { h: "Plan your own", level: 3, t: "Hide the guides. Draw a plan of a small part of your own world: one path and five to eight plots, placed for reasons you can state (shelter, water, a view, defence). Mark where you stand. Then draw the view from that spot, as footprints first and boxes second.", ...ink },
      ] },
    { title: "Scale: measure the world in people", exemplar: "scaleLadder",
      hints: ["One person is the ruler.", "Count storeys, not metres."],
      steps: [
        { h: "The ruler", level: 1, t: "Trace the figure and rule the four lines at one, two, three and four person-heights. Step the height off with your fingers or a strip of paper rather than guessing. This ruler is what every other size on the page is checked against.", ...pencil },
        { h: "Door and one storey", level: 2, t: "Add the door and the one-storey house. The door clears the figure's head by a little. The wall is about a person and a third; the roof is extra. Draw the door on the house and check it is the same height as the door standing alone.", tool: "pencil" },
        { h: "Two storeys and a tree", level: 3, t: "Add the taller house and the tree. The second floor line sits one storey up, and a second door-height fits above it. A grown tree is three to five people tall, which is more than most beginners draw.", tool: "pencil" },
        { h: "Your world's ladder", level: 3, t: "Hide the guides. Draw the same line-up for your own world: one of its people, a door, its commonest building, its largest building, and one natural feature. Rule the person-heights across. Keep this page — every later drawing of that world should agree with it.", ...ink },
      ] },
  ]);

  /* ---------------- Weapons ---------------- */
  extend("obj-3", 105, [
    { title: "A sword in depth", exemplar: "swordAnatomy",
      hints: ["One axis; five stations along it.", "The cross-section decides where the light breaks."],
      steps: [
        { h: "Axis and stations", level: 1, t: "Rule the axis in all three views and mark the stations along it: pommel, grip, guard, balance point, point. Mark the grip thick. In the three-quarter view the stations are closer together at the far end. Get the stations right and the sword is already in proportion.", ...pencil },
        { h: "Build the forms", level: 2, t: "Add the forms: a ball for the pommel, a cylinder for the grip, a small box for the guard, a long tapering wedge for the blade. In the edge view the blade is a sliver. Draw the flat and edge views first, then the three-quarter view from what they told you.", tool: "pencil" },
        { h: "Ridge and cross-section", level: 3, t: "Turn on level 3. Draw the ridge down the centre of the blade and copy the three cross-sections. Choose one for your sword. With a diamond section, one side of the ridge is light and the other dark; a lens has a single soft highlight; a groove adds a dark stripe with a light edge.", tool: "pencil" },
        { h: "A real one, three views", level: 3, t: "Hide the guides. Find one sword in a museum collection (the links in this lesson) that has both a full photograph and measurements. Draw it flat, edge-on and three-quarter, with its stations measured from the photograph. Shade it by its cross-section and ink the three-quarter view.", ...ink },
      ] },
    { title: "Turning a weapon toward you", exemplar: "weaponTurn",
      hints: ["The axis shortens; the cross-piece does not.", "Near end larger, far end smaller."],
      steps: [
        { h: "Two lines, five times", level: 1, t: "Copy the axis and cross-piece for the sword at all five angles, then for the axe. Measure with your pencil how much the axis has shortened at each step. At 75° it is about a quarter of its full length, and the cross-piece has not changed at all.", ...pencil },
        { h: "Forms on the axes", level: 2, t: "Turn on level 2 and build the forms. Work from the near end to the far end so the overlaps come out right: point over blade, blade over guard, guard over grip. The round parts (grip, pommel, haft) become ellipses and then nearly circles.", tool: "pencil" },
        { h: "Fill the gaps", level: 2, t: "Draw the sword at two angles the guide does not show: about 15° and about 65°. Estimate the axis length from its neighbours on either side. Then draw the axe at 88° from memory before checking it against the guide.", tool: "pencil" },
        { h: "From life", level: 2, t: "Hide the guides. Hold a long kitchen spoon or a ruler at arm's length and turn it toward you in four steps, drawing it each time: axis, ends, then form. Then draw one weapon of your own choice pointing almost straight out of the page, and ink it with the near end heaviest.", ...ink },
      ] },
    { title: "In the hand", exemplar: "weaponInHand",
      hints: ["Weapon first, hand second.", "The blade's edge lines up with the knuckles."],
      steps: [
        { h: "Weapon, palm, thumb", level: 1, t: "Trace or copy level 1 for all four: the weapon, then the palm box, wrist and thumb. The grip passes diagonally across the palm, not straight across it. Find where the thumb presses: against the side of the grip, or wrapped over the fingers.", ...pencil },
        { h: "Wrap the fingers", level: 2, t: "Add the fingers. They wrap in a slight spiral, the index finger nearest the guard or the axe's head. From the knuckle side you see the backs of the fingers in a row; from the palm side you see the fingertips and the thumb crossing them.", tool: "pencil" },
        { h: "Contour and overlap", level: 3, t: "Turn on the contour. Decide at each crossing which is in front, the hand or the weapon, and stop the line of the one behind. Compare the sword grip with the reversed knife: the hand is the same, and only the end the blade leaves from has changed.", tool: "pencil" },
        { h: "Your own hand", level: 3, t: "Hide the guides. Hold a wooden spoon, a hammer or a rolled magazine as each of the four grips in turn and draw your own hand from life — the weapon's axis first. Then draw one of the grips again with a weapon of your own design in place of the spoon.", ...ink },
      ] },
    { title: "Against the body", exemplar: "weaponScale",
      hints: ["Lengths in heads of the figure.", "A weapon far outside these sizes needs a reason."],
      steps: [
        { h: "The figure and four heights", level: 1, t: "Trace the standing figure and rule the lines at the knee, hip, shoulder and top of the head. These four lines are the ruler for this page. A head is the unit: the figure is about seven and a half of them.", ...pencil },
        { h: "Lengths and grips", level: 2, t: "Turn on level 2 and draw each weapon as one upright line of the right length, with the grip marked thick. Note where each one ends against the body: the dagger below the knee, the one-hand sword near the hip, the bow near the top of the head, the spear well above it.", tool: "pencil" },
        { h: "Forms", level: 3, t: "Add the forms on each line. The long sword's grip is twice the length of the one-hand sword's because two hands hold it. The axe's haft is plain for most of its length because the hand slides along it. Compare each grip with the figure's hand.", tool: "pencil" },
        { h: "Your character's weapon", level: 3, t: "Hide the guides. Stand your own character on a clean space with the four body lines ruled across, and draw the weapon or tool you designed for them upright beside them at its true length. Then draw them holding it. If it is unusually long or short, write the reason beside it.", ...ink },
      ] },
  ]);
})();
