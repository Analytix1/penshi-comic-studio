/* Curriculum · Section 3 — Gaining Form (characters) */
"use strict";
window.PENSHI_CURRICULUM = window.PENSHI_CURRICULUM || [];

PENSHI_CURRICULUM.push({
  id: "s3", num: 3, title: "Gaining Form",
  tagline: "Build a clothed, colored, believable character from construction — heads, bodies, fabric and color.",
  chapters: [

  /* ============================================================ */
  { id: "s3-head", title: "Head Construction",
    summary: "The Loomis method: a ball with the sides sliced off, a jaw hung from it, and the features placed on lines that bend with the head. Learn it front-on, then turn the head to any angle — the construction survives the turn, which is the whole reason to learn it. Then features, then expressions.",
    lessons: [

    { id: "head-1", title: "The Loomis head, front", minutes: 35,
      goal: "Construct a front-view head with correct proportions using the ball-and-plane method.",
      why: "Faces are where symbol-drawing is strongest — everyone 'knows' what an eye looks like and draws the symbol too big and too high. Construction fixes that by placing features on measured lines, not memory.",
      refs: ["loomis-head", "proko-head", "loomis-fun"],
      pages: [
        { title: "Ball, planes, jaw, thirds", exemplar: "loomisFront",
          steps: [
            { h: "The cranium is a ball", t: "Draw a circle — the cranium. It's bigger than beginners think: the face hangs off the FRONT-BOTTOM of it. Draw it three times at different sizes before going on, ghosting each.", tool: "pencil", layer: "Pencils" },
            { h: "Slice the sides", t: "The skull is narrower than a ball. Draw an oval on each side — the flattened side planes. From the front you see them as narrow ellipses at the edges. The ear will later sit inside this oval.", tool: "pencil" },
            { h: "The brow line and centerline", t: "A horizontal line about a third down the ball is the brow line. A vertical centerline splits the face. These two lines are the axes of the whole head; when the head turns, THEY curve.", tool: "pencil" },
            { h: "Hang the jaw", t: "From the side-plane ovals, drop the jaw: it goes down about the height of the ball's radius and comes to a chin on the centerline. The jaw is a U, wider at the top. Draw the chin box slightly forward.", tool: "pencil" },
            { h: "Equal thirds", t: "Hairline → brow → base of nose → chin are three EQUAL divisions. Mark them. The eyes sit halfway down the whole head (skull included) — lower than you expect. Mark that too.", tool: "pencil" },
            { h: "Place the features on the lines", t: "Eyes on the eye line, one eye-width apart, one eye-width from each edge. Nose base on the nose line, as wide as the gap between the eyes. Mouth a third of the way from nose to chin. Ears from brow line to nose line, inside the side planes. Draw them SIMPLY — almonds, a wedge, a line. Detail comes later.", tool: "pencil" },
            { h: "Ink over the construction", t: "On the Inks layer, commit only the finished head — outline, features, hair mass — letting the construction stay blue underneath. Then hide the Pencils layer and judge it.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Where did your instinct want to put the eyes vs where the construction put them?", "Draw a second head from memory. Then check it against the thirds."] },

    { id: "head-2", title: "Turning the head", minutes: 45,
      goal: "Draw the same head at three-quarter, profile and tilted angles using the ball construction.",
      why: "A head that only works from the front is useless in comics — characters look up, turn away, glance over a shoulder. The Loomis ball survives every rotation because you're rotating a 3-D object, not redrawing a 2-D symbol.",
      refs: ["loomis-head", "proko-head", "loa-faces", "handy"],
      pages: [
        { title: "Three-quarter and profile", exemplar: "loomisAngles",
          steps: [
            { h: "Rotate the side plane", t: "For a three-quarter view, the side-plane oval on the far side shrinks to a sliver and the near one moves toward the middle of the ball. The centerline CURVES around the ball toward the near side. Draw the ball, place the side plane, curve the centerline.", tool: "pencil", layer: "Pencils" },
            { h: "The far side compresses", t: "Everything on the far side of the centerline is narrower: the far eye is shorter than the near eye, the far cheek is a sliver, the far side of the mouth is shorter. Everything on the near side is fuller. Place features on the CURVED thirds.", tool: "pencil" },
            { h: "Profile", t: "The side plane is now a full circle inside the ball (you see it flat-on). The jaw is a bracket hanging from it. The ear sits on the side-plane circle, behind its center. The features are on the front edge: brow bump, nose wedge, lips, chin. Nothing curves — but the ear placement will catch you if you skipped the side plane.", tool: "pencil" },
            { h: "Draw all three of the same character", t: "Pick simple distinguishing features (a big nose, a wide jaw) and draw the same person front, three-quarter and profile. Same ball size, same thirds. This is a 'model sheet' — comics artists make one per character.", tool: "pencil" },
          ] },
        { title: "Tilt, up and down", exemplar: "loomisAngles",
          steps: [
            { h: "Looking down", t: "When the head tips forward, the brow line and thirds CURVE downward like the lines of latitude on a globe seen from above. More cranium is visible; the features compress toward the chin; the ears rise relative to the eyes. Draw it.", tool: "pencil", layer: "Pencils" },
            { h: "Looking up", t: "Tilt back: the thirds curve upward, you see the underside of the nose and jaw, the ears drop below the eye line, the neck is fully visible. Draw it. These two views are where most artists' faces fall apart — it's all in curving the thirds.", tool: "pencil" },
            { h: "A tilt with a turn", t: "Combine: three-quarter view looking slightly down (the classic 'brooding' angle). The centerline curves sideways AND the thirds curve down. Use the Line of Action faces tool for reference — set 2 minutes and draw six.", tool: "pencil" },
            { h: "Ink a turnaround", t: "Ink your best four angles in a row. Comics 'model sheets' look exactly like this.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which angle was hardest? Almost universally it's 'looking up' — the underside of the nose feels wrong at first.", "Do your four angles look like the same person?"] },

    { id: "head-3", title: "Features in detail", minutes: 45,
      goal: "Construct the eye, nose, mouth and ear as 3-D forms that turn with the head.",
      why: "The eye symbol (an almond with a circle) is why drawn faces look flat. The real eye is a ball inside a socket, wrapped by lids that have thickness. Same for the nose (a wedge with a ball), the mouth (on a curved cylinder), the ear (a bowl). Forms turn; symbols don't.",
      refs: ["loomis-head", "proko-head", "loa-faces", "handy"],
      pages: [
        { title: "Eye and brow",
          hints: ["Draw each feature large — a quarter page each.", "The eyeball is a sphere. The lids wrap it. The iris is a disc on the sphere's surface.", "Draw the eye front, three-quarter and profile."],
          steps: [
            { h: "The eyeball in the socket", t: "Draw a sphere. The eye socket is a bony hollow around it; the brow ridge overhangs it. The upper lid wraps over the top of the sphere (it's thicker and casts a shadow), the lower lid tucks under. The visible 'almond' is just where the lids part.", tool: "pencil", layer: "Pencils" },
            { h: "The iris is a disc, not a circle", t: "The iris sits on the sphere's surface, so in three-quarter view it's an ellipse. The upper lid usually covers the top of it; the lower lid rarely touches it. Draw the eye at three angles with the iris turning into an ellipse.", tool: "pencil" },
            { h: "Brows are on the ridge", t: "The eyebrow follows the brow ridge — a curve OVER the socket, not a line above the eye. In three-quarter view the far brow foreshortens. Draw the brow-and-eye unit at three angles.", tool: "pencil" },
          ] },
        { title: "Nose, mouth, ear",
          hints: ["Nose: a wedge from the brow, with a ball on the end and two wings.", "Mouth: lips wrap a cylinder (the teeth). The top lip is usually thinner and angles inward.", "Ear: a bowl with a rim (helix), an inner ridge, and a lobe."],
          steps: [
            { h: "The nose as a wedge", t: "From the brow, a wedge comes forward and down; at its end sits a ball (the tip) with a wing on each side (the nostrils). Draw it as a block first — front, three-quarter, profile. Only then soften it. The underside of the wedge is what you see when the head looks up.", tool: "pencil", layer: "Pencils" },
            { h: "The mouth on a cylinder", t: "The teeth are a curved cylinder; the lips lie on its surface. So in three-quarter view the far half of the mouth is shorter and curves away. The line between the lips is the important line — the lip edges are soft. Draw the mouth relaxed, smiling and open, at two angles.", tool: "pencil" },
            { h: "The ear as a bowl", t: "A C-shaped rim (helix) around a bowl (concha), an inner Y-shaped ridge (antihelix), a lobe at the bottom. It sits on the side plane, tilted back slightly. Draw it from the side, then from the front (it's a thin curved shape), then three-quarter.", tool: "pencil" },
            { h: "Assemble a face at three-quarter, in ink", t: "Construct a three-quarter head and place all four features on it as FORMS — the eye sphere, nose wedge, mouth cylinder, ear bowl. Ink it. Compare to your very first head from lesson 1.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which feature were you drawing as a symbol before? How does it look as a form?"] },

    { id: "head-4", title: "Expressions", minutes: 45,
      goal: "Draw six core expressions on a constructed head, understand what muscles drive them, and push them for comics.",
      why: "Comics are acting. A character's face carries the story beat, and readers detect fake expressions instantly. Ekman's research shows expressions are combinations of a few muscle actions — brows, lids, mouth corners, nose — which means they can be constructed, not guessed.",
      refs: ["ekman-facs", "simon-expr", "loa-faces", "proko-head"],
      pages: [
        { title: "Six expressions", exemplar: "expressionGrid",
          steps: [
            { h: "Neutral first", t: "Draw a neutral face on a constructed head. This is your baseline — every expression is a change FROM neutral. Note where the brows, lids and mouth corners rest.", tool: "pencil", layer: "Pencils" },
            { h: "Joy", t: "The mouth corners pull UP and BACK, the cheeks rise and push the lower lids up (that's the 'real smile' — Duchenne). The eyes narrow slightly. A smile with wide-open eyes reads as fake. Draw it.", tool: "pencil" },
            { h: "Surprise and fear", t: "Surprise: brows up and arched, eyes wide (whites visible above the iris), mouth open and relaxed. Fear: brows up but pulled TOGETHER, eyes wide, mouth stretched sideways and tense. The brow-together is the difference — draw both side by side.", tool: "pencil" },
            { h: "Anger and sadness", t: "Anger: brows down and together (a crease between them), upper lids raised, lips pressed or teeth bared. Sadness: inner brows up (a peaked shape), lids heavy, mouth corners down. Draw both. Notice anger and sadness are almost opposite brow shapes.", tool: "pencil" },
            { h: "Push them", t: "Redraw each expression at 2× intensity — bigger brow movement, wider mouth, squashed or stretched skull. Comics live at this level. Then draw one at half intensity, the subtle version for a quiet panel.", tool: "pencil" },
            { h: "Turn one", t: "Draw your best expression on a three-quarter head. The near cheek pushes up more; the far brow foreshortens. Ink it.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Cover the mouth on each face. Do the eyes and brows alone still read the emotion? They should.", "Look at the Ekman FACS page: which action units did you use without knowing their names?"] },
    ] },

  /* ============================================================ */
  { id: "s3-body", title: "Body Construction",
    summary: "The mannequin: a simplified figure of boxes and tubes that can be turned to any angle, with landmark proportions you can count on. This is not anatomy yet — it's the armature anatomy will later hang on. Your Sycra anatomy sheet in the Library tab shows exactly this simplification from five angles.",
    lessons: [

    { id: "body-1", title: "Proportions and the ruler", minutes: 35,
      goal: "Lay out a figure with standard proportions using the head as the unit, and recognize stylized proportion systems.",
      why: "The head-unit system (a figure is 7½ heads tall) gives you a scaffold that's right before you've drawn anything. It also lets you CHOOSE a proportion — 8½ heads for heroes, 5 for cartoon kids — and keep it consistent across an issue.",
      refs: ["loomis-figure", "proko-figure", "bridgman"],
      pages: [
        { title: "7.5 heads", exemplar: "mannequin",
          steps: [
            { h: "Draw the ruler", t: "Eight tick marks down the left of the page, evenly spaced: that's 7½–8 heads. Copy the guide mannequin beside it, checking every landmark against the ruler: chin at 1, nipples at 2, navel at 3, crotch at 4, knees at 5½, ankles at 7¼.", tool: "pencil", layer: "Pencils" },
            { h: "Arm landmarks", t: "Shoulders at about 1½ heads; elbows at the waist (3); wrists at the crotch (4); fingertips at mid-thigh. Arms are longer than beginners draw them — check yours against these.", tool: "pencil" },
            { h: "Width", t: "Shoulders are about 2 head-widths across (wider on masculine builds), hips about 1½. Draw the mannequin a second time from memory and measure it afterward.", tool: "pencil" },
          ] },
        { title: "Proportion is a choice", exemplar: "proportionCompare",
          steps: [
            { h: "Heroic: 8½ heads", t: "Same landmarks, smaller head, longer legs. Superhero comics use this. Draw it beside the realistic one — feel how the extra leg length reads as power.", tool: "pencil", layer: "Pencils" },
            { h: "Stylized: 5 heads and 3 heads", t: "Cartoon and chibi proportions — the head is huge, the body compressed, but the LANDMARK ORDER never changes (chin, chest, waist, crotch, knee). Draw both. Consistency of proportion across a cast is what makes a comic look designed.", tool: "pencil" },
            { h: "Build your own system", t: "Decide a proportion for a character of your own and write the numbers in the margin: heads tall, shoulder width, leg length. Draw it. You'll use this sheet in the Character Design chapter.", tool: "pencil" },
          ] },
      ],
      reflect: ["Which landmark did you consistently misplace? (Usually the crotch is too high or the knees too low.)"] },

    { id: "body-2", title: "The mannequin in 3-D", minutes: 45,
      goal: "Draw the figure as boxes and tubes that can be rotated, with the ribcage and pelvis as solid forms.",
      why: "Blobs can't turn; boxes can. A ribcage drawn as a box with a front, sides and top can be tipped, twisted and viewed from below. This is the exact reason Section 1 made you rotate 250 boxes.",
      refs: ["proko-figure", "hampton", "loomis-figure", "posemaniacs"],
      pages: [
        { title: "Boxes and tubes", exemplar: "mannequinBoxes",
          steps: [
            { h: "Ribcage box", t: "Draw the ribcage as a box slightly wider than deep, tilted a bit back, with the front face showing the sternum line down the middle. Draw it at three rotations using the Y method. The box's front face gives you where the chest is; its side gives you where the arm attaches.", tool: "pencil", layer: "Pencils" },
            { h: "Pelvis box and the gap", t: "The pelvis is a smaller box (a bucket, tipped forward). Between it and the ribcage is the flexible waist — the gap that lets the two boxes tilt against each other. Draw the pair in contrapposto: ribcage tilted one way, pelvis the other, connected by a curved spine line.", tool: "pencil" },
            { h: "Limbs as tapered cylinders", t: "Upper arm: a tube tapering toward the elbow. Forearm: wider at the elbow, tapering to the wrist. Same for thighs and calves. Draw joints as spheres that both tubes plug into. The overlap at each joint says which segment is in front.", tool: "pencil" },
            { h: "Assemble and rotate", t: "Build the full mannequin: head ball, neck cylinder, ribcage box, pelvis box, limb tubes, mitten hands, wedge feet. Now draw it from the side and from a high three-quarter view (looking down). The boxes tell you what you'd see; blobs would just be blobs.", tool: "pencil" },
          ] },
        { title: "Gesture to mannequin",
          hints: ["Posemaniacs or Line of Action, 5-minute timer.", "Line of action → bean → boxes → tubes. In that order, every time.", "Six poses. Then ink the best one."],
          steps: [
            { h: "Gesture first, always", t: "Open a timed pose tool. For each pose: 20 seconds of line of action and bean, then build the boxes on the bean, then tubes on the rhythm lines. The gesture is the life; the mannequin is the solidity. Never skip the first for the second.", tool: "pencil", layer: "Pencils" },
            { h: "Foreshortened limbs", t: "When a limb points at the camera, its tubes overlap heavily and the near end draws bigger. Choose two poses with an arm reaching toward you and construct the overlaps deliberately. (Full foreshortening is in the Figure chapter — this is the first taste.)", tool: "pencil" },
            { h: "Ink one mannequin", t: "Ink the best pose as a clean mannequin — this is a legitimate finished style in itself (many storyboard artists never go further). Heavy lines where forms overlap.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Could you draw one of your poses from the opposite side? Try it — that's the mannequin's superpower."] },
    ] },

  /* ============================================================ */
  { id: "s3-fabric", title: "Fabrics and Folds",
    summary: "Cloth is simple physics: it hangs from points, stretches between points, and piles up where it's pushed. Burne Hogarth named seven fold families; every wrinkle you'll ever draw belongs to one. Learn the families, learn to find the tension points, then dress your mannequin in shirts, coats, hoods and capes.",
    lessons: [

    { id: "fab-1", title: "The seven folds", minutes: 40,
      goal: "Recognize and draw the seven fold families, and identify each in a photo reference.",
      why: "Random wrinkles look like noise; classified folds look like cloth. Once you can say 'that's a zigzag fold at the elbow, a drop fold from the shoulder', you draw with intent — and you can invent believable folds where the reference doesn't show them.",
      refs: ["hogarth-drapery", "sinix", "loa-clothed"],
      pages: [
        { title: "The families", exemplar: "foldTypes",
          steps: [
            { h: "Pipe folds", t: "Cloth hanging from one point or edge: parallel tubes, like a curtain or a hanging skirt. Draw a row, giving each tube a lit side and a shadow side — a fold is a cylinder.", tool: "pencil", layer: "Pencils" },
            { h: "Zigzag and half-lock", t: "Zigzag: a tube (a sleeve, a pant leg) that bends — the cloth on the inside of the bend buckles into a Z pattern. Half-lock: a tube bent sharply, so the fold locks over on itself. Draw a bent sleeve using each.", tool: "pencil" },
            { h: "Spiral and diaper", t: "Spiral: folds wrapping around a tube in a twist — a sleeve pushed up the arm. Diaper: cloth slung between TWO points — a sash, a hammock, fabric between two shoulders. Draw both.", tool: "pencil" },
            { h: "Drop and inert", t: "Drop: cloth falling from a single point, radiating (a cape from the shoulders, a towel from a hand). Inert: cloth lying on a surface with nothing pulling it — soft, random piles. Draw a cape and a dropped jacket.", tool: "pencil" },
            { h: "Spot them in a photo", t: "Open Line of Action's figure tool with the clothed filter (or Unsplash 'jacket'). Draw the figure loosely and LABEL each fold family you can find. Expect four or five families in one outfit.", tool: "pencil" },
          ] },
      ],
      reflect: ["Which two families do you see most often? (Pipe and zigzag, in almost every outfit.)"] },

    { id: "fab-2", title: "Tension points: where cloth hangs from", minutes: 40,
      goal: "Find the points that pin cloth to the body and draw folds radiating from them.",
      why: "The single biggest clothing mistake is drawing wrinkles everywhere. Cloth is smooth where it's stretched over the form and folds only where it's pinned or pushed. Find the pins first, and the folds place themselves.",
      refs: ["hogarth-drapery", "loa-clothed", "sinix"],
      pages: [
        { title: "Pins on the mannequin", exemplar: "tensionPoints",
          steps: [
            { h: "Mark the pins", t: "On the guide mannequin, the pins are marked: shoulders (a shirt hangs from them), the waist/belt, bent knees and elbows (cloth pulls across the bend), the crotch. Copy the mannequin and mark the pins yourself for a standing pose.", tool: "pencil", layer: "Pencils" },
            { h: "Folds radiate from pins", t: "From each shoulder pin, draw drop folds falling down the torso. Between the two shoulders, a diaper fold sags. Where the belt pins the shirt, the cloth above it bunches (zigzag). Draw the shirt on the mannequin using only those three pin systems.", tool: "pencil" },
            { h: "Move the pose, move the pins", t: "Raise one arm: the shoulder pin rises, folds now stretch from the raised shoulder DOWN across the ribs toward the opposite hip. Bend the knee: a pin appears at the knee with zigzags behind it. Draw both changes.", tool: "pencil" },
          ] },
        { title: "Smooth where stretched",
          hints: ["Stretched cloth shows the FORM underneath — few folds.", "Loose cloth hides the form — many folds.", "Draw the same torso in a tight shirt and a loose one."],
          steps: [
            { h: "Tight versus loose", t: "Draw a mannequin torso twice. Dress the first in a tight T-shirt: the cloth reads as the ribcage box with a few stretch lines at the armpits. Dress the second in a baggy sweatshirt: the cloth reads as its OWN form (a bigger, softer box) with drop and inert folds, and the body underneath is only hinted.", tool: "pencil", layer: "Pencils" },
            { h: "Cloth thickness", t: "Thin cloth (a T-shirt) makes many small sharp folds; thick cloth (a wool coat) makes a few big soft ones. Redraw the loose top as a heavy coat: fewer, rounder folds, and the hem hangs straight from the shoulders' width.", tool: "pencil" },
            { h: "Ink with fold logic", t: "Ink the tight and the thick versions. Only draw a fold line where a fold changes plane — the shadow side. A fold drawn as two outlines looks like a tube of toothpaste.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Count the fold lines on your tight shirt. If it's over ten, you drew the symbol of wrinkles, not the cloth."] },

    { id: "fab-3", title: "Dressing a character: garments", minutes: 50,
      goal: "Draw a full outfit — shirt, trousers, jacket or coat, hood, cape — on a posed mannequin, each garment obeying its own pin logic.",
      why: "Every garment type has its own structure: a hood is a tube that crumples at the neck; a cape is two drop-fold systems from the shoulders; a coat is a stiff box that hangs; trousers are two tubes pinned at the waist and knees. Learning each type once means you can dress anyone.",
      refs: ["hogarth-drapery", "loa-clothed", "unsplash", "sinix"],
      pages: [
        { title: "Shirt, trousers, jacket",
          hints: ["Pose a mannequin first (Posemaniacs, 5 min).", "Each garment is its own layer of form OVER the mannequin — draw its silhouette before its folds.", "Seams follow contour lines."],
          steps: [
            { h: "Shirt or T-shirt", t: "Silhouette first: the shirt's shape is the ribcage box plus ease (slack). Collar is a band around the neck cylinder. Sleeves are tubes wider than the arm tubes. Then folds: drop from shoulders, zigzag at the bent elbow, bunching at the waist.", tool: "pencil", layer: "Pencils" },
            { h: "Trousers", t: "Two tubes pinned at the waist and (if bent) the knees. The crotch is a tension point where diagonals meet. Straight legs: pipe folds from the waist; a bent knee: zigzags behind, stretch across the front. Cuffs pile up (inert) on the shoe.", tool: "pencil" },
            { h: "Jacket or coat", t: "A stiffer, boxier form over the shirt: the coat has its own shoulders (padding), lapels (a plane folding outward), and a hem that hangs straight. Few folds — thick cloth. An open coat swings as two drop-fold panels from the shoulders. Ink the whole figure.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Hoods, capes, and everything else",
          hints: ["A hood up: a bowl around the ball of the head, tube down the neck.", "A hood down: a crumpled inert pile behind the neck.", "A cape: two drop systems from the shoulder pins; in wind, a diaper between them."],
          steps: [
            { h: "The hood", t: "Up: a bowl following the head's ball with the face inside it, joining a tube at the neck with spiral folds where it crumples. Down: an inert pile at the back of the neck. Draw both on a three-quarter head.", tool: "pencil", layer: "Pencils" },
            { h: "The cape", t: "Pins at the two shoulders. Standing still: two drop-fold cascades meeting behind. Walking: the cape trails, folds become long pipes. In wind: a diaper fold slung between the shoulders and the hem lifting. Draw all three — capes are half of comics.", tool: "pencil" },
            { h: "Your own outfit", t: "Design an outfit from reference photos (Unsplash: 'streetwear', 'armor', 'uniform' — whatever your story needs) and dress your mannequin from lesson Body-2 in it. Pins first, silhouettes second, folds last. Ink it. This character continues into the Color chapter.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Did you draw the garment's silhouette before its folds, or the folds first? The order matters."] },
    ] },

  /* ============================================================ */
  { id: "s3-color", title: "Color Theory",
    summary: "The color wheel, the three properties of color (hue, saturation, value), and the simple harmonies — taught with Penshi's own Color Wheel tool in the Tool tab, which draws harmonies live. By the end you'll color the character you designed in the Fabric chapter with a palette you can defend.",
    lessons: [

    { id: "color-1", title: "The wheel and the three properties", minutes: 35,
      goal: "Understand hue, saturation and value as independent controls, and navigate the 12-hue wheel.",
      why: "Most color confusion comes from mixing up the three properties. 'Make it more blue' might mean hue, saturation OR value. Separate them and color becomes a set of dials you can turn on purpose.",
      refs: ["adobe-color", "ctrlpaint", "marco-bucci", "gurney-book"],
      pages: [
        { title: "The 12-hue wheel", exemplar: "colorWheel12",
          steps: [
            { h: "Open the Tool tab's color wheel", t: "Below the swatches in the Tool tab is Penshi's Color Wheel. The ring is HUE (the 12 named colors of this guide, and every shade between). Drag around it and watch the Color chip. Pick the six primaries and secondaries in turn and swatch each on the page under the wheel.", tool: "marker", layer: "Colors" },
            { h: "Primaries, secondaries, tertiaries", t: "Red, yellow, blue are primaries; orange, green, violet between them are secondaries; the six in-betweens are tertiaries (red-orange…). Label your six swatches. Note which pairs sit opposite each other — you'll use that next lesson.", tool: "marker" },
            { h: "Warm and cool halves", t: "Draw a line through the wheel from yellow-green to red-violet. One side is warm (reds, oranges, yellows), one cool (greens, blues, violets). Swatch a warm and a cool version of the same object — a mug — side by side.", tool: "marker" },
          ] },
        { title: "Hue, saturation, value", exemplar: "hsvBars",
          steps: [
            { h: "Hue row", t: "In the Tool tab wheel, keep the inner square's picker in the same spot and drag around the RING only. Fill the first row with eight swatches: hue changes, nothing else. That's the dial 'which color'.", tool: "marker", layer: "Colors" },
            { h: "Saturation row", t: "Now keep the hue fixed and slide the picker in the inner square LEFT — toward grey. Fill the second row from vivid to dull. Saturation is 'how much color'. Low saturation = calm, distant, tired; high = loud, near, alive.", tool: "marker" },
            { h: "Value row", t: "Hue fixed, slide the picker DOWN toward black. Fill the third row from light to dark. Value is 'how light'. This is the row that does the storytelling — squint at any great painting and you see its values, not its hues.", tool: "marker" },
            { h: "Change two at once", t: "Make a fourth row where each step lowers saturation AND value together — a color fading into shadow. This is what a shadow on a colored object actually does (mostly). Not 'add black'.", tool: "marker" },
          ] },
      ],
      reflect: ["Say out loud what each of the three dials does. If you had to lose one, which would hurt the image least? (Hue.)"] },

    { id: "color-2", title: "Simple harmonies", minutes: 40,
      goal: "Build monochromatic, complementary, analogous and triadic palettes and know what each feels like.",
      why: "A harmony is a rule for which hues are allowed — and a rule is freedom, because it removes ten thousand choices. Comics colorists pick a harmony per scene so pages feel unified and shifts in harmony mark story turns.",
      refs: ["adobe-color", "paletton", "gurney-book", "marco-bucci"],
      pages: [
        { title: "Four harmonies", exemplar: "harmonies",
          steps: [
            { h: "Monochromatic", t: "In the Tool tab wheel, set Harmony to Monochromatic. One hue, varied only by saturation and value. Swatch five steps. Calm, cohesive, sometimes dull — the fix is a full value range from very light to very dark.", tool: "marker", layer: "Colors" },
            { h: "Complementary", t: "Harmony → Complementary: two hues opposite on the wheel (blue/orange, red/green, yellow/violet). Maximum contrast and vibration. The rule for using it: ONE dominates (70%+), the other is the accent. Swatch a dominant and an accent.", tool: "marker" },
            { h: "Analogous", t: "Harmony → Analogous: three neighbors on the wheel. Naturally harmonious (sunsets, forests). Feels like one mood. Swatch three, then add a small complementary accent outside the set — feel it snap into focus.", tool: "marker" },
            { h: "Triadic", t: "Harmony → Triadic: three hues evenly spaced (the primaries are a triad). Balanced but lively — the classic superhero palette (red, yellow, blue). Swatch a triad, then desaturate two of the three so the third leads.", tool: "marker" },
            { h: "Apply one to the mug", t: "Draw a simple mug on a table and color it three times: monochromatic, complementary, analogous. Same drawing, three moods. Write one word under each describing the feeling.", tool: "marker" },
          ] },
      ],
      reflect: ["Which harmony did you instinctively reach for? Try the one you avoided in the next lesson."] },

    { id: "color-3", title: "Coloring your character", minutes: 60,
      goal: "Choose a harmony and color the clothed character from the Fabric chapter, in flats then with simple shadow.",
      why: "Everything in this section converges here: a constructed head on a mannequin body in folded clothing, colored with a palette chosen by rule. This is the first character you can put in a comic.",
      refs: ["adobe-color", "gurney-book", "ctrlpaint", "marco-bucci"],
      pages: [
        { title: "Flats", exemplar: "harmonies",
          hints: ["Redraw (or trace over) your inked character from Fabric-3 on the Inks layer.", "Colors layer, Fill tool for big areas, Marker for edges.", "Pick a harmony FIRST and swatch the palette in the margin."],
          steps: [
            { h: "Choose the harmony from the character", t: "What's this character like? Calm → analogous cool. Heroic → triadic. Dangerous → complementary with a red accent. Pick, set it in the wheel, and swatch 5–6 colors in the margin, including a skin tone and a near-black.", tool: "marker", layer: "Colors" },
            { h: "Flat every area", t: "On the Colors layer (under the Inks), fill each garment, the skin, the hair with a single flat color from your palette. No shading. Close your ink lines first if you use the Fill tool, or it leaks. This stage is called 'flats' and in comics it's a job of its own.", tool: "fill", layer: "Colors" },
            { h: "One shadow color per flat", t: "Decide the light (upper left, say). For each flat, make one shadow version: lower value, slightly lower saturation, and shifted a little toward the cooler side of the wheel. Paint shadow shapes with the Marker tool where the form turns away — under the jaw, inside folds, under the arms.", tool: "marker" },
            { h: "One accent", t: "Add a single small area of your accent color (the complement, or the brightest saturation) where you want the eye: the eyes, a badge, a weapon grip. Only one. That's the focal point.", tool: "marker" },
            { h: "Judge in greyscale", t: "Squint hard or export and desaturate. Does the figure read in value alone — light face, mid clothes, dark shadows? If the values are muddy, no hue choice will save it. Adjust the shadow values and save. This character goes into your Portfolio as the Section 3 capstone.", tool: "marker" },
          ] },
      ],
      reflect: ["Name the harmony you used and the one accent. Could you re-color this character for a night scene using the same rules?"] },
    ] },
  ],
});
