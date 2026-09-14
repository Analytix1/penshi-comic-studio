/* Curriculum · Section 3 — Gaining Form (characters) */
"use strict";
window.PENSHI_CURRICULUM = window.PENSHI_CURRICULUM || [];

PENSHI_CURRICULUM.push({
  id: "s3", num: 3, title: "Gaining Form",
  tagline: "Build a clothed, colored, believable character from construction — heads, bodies, fabric and color.",
  chapters: [

  /* ============================================================ */
  { id: "s3-head", title: "Head Construction",
    summary: "The Loomis method: a ball with the sides sliced off, a jaw hung from it, and the features placed on lines that bend with the head. Learn it front-on, then turn the head to any angle — the construction survives the turn, which is the whole reason to learn it. Then features as forms, then expressions as muscle actions. Loomis's 'Drawing the Head and Hands' is public domain and linked; Proko's head course is the free video version of the same method.",
    lessons: [

    { id: "head-1", title: "The Loomis head, front", minutes: 45,
      goal: "Construct a front-view head with correct proportions using the ball-and-plane method.",
      why: "Faces are where symbol-drawing is strongest — everyone 'knows' what an eye looks like and draws the symbol too big and too high, and every beginner face has eyes in the top third of the head where the forehead should be. Construction fixes that by placing features on measured lines, not memory. The Loomis head is the construction every modern head tutorial descends from, and it's worth learning slowly the first time.",
      refs: ["loomis-head", "proko-head", "loomis-fun"],
      pages: [
        { title: "Ball, planes, jaw, thirds", exemplar: "loomisFront",
          steps: [
            { h: "The cranium is a ball", t: "Draw a circle — the cranium. It's bigger than beginners think: the face hangs off the FRONT-BOTTOM of it, and the ball alone is about two-thirds of the whole head's height. Draw it three times at different sizes before going on, ghosting each and drawing through. A lumpy ball makes a lumpy skull; this is where Forms-1 pays off.", tool: "pencil", layer: "Pencils" },
            { h: "Slice the sides", t: "The skull is narrower than a ball. Draw an oval on each side — the flattened side planes, as if you'd sliced a segment off each side of the ball. From the front you see them as narrow ellipses at the edges, from the side as a full circle. The ear will later sit inside this oval, and the temple is its front edge. Without this slice, the head is a balloon.", tool: "pencil" },
            { h: "The brow line and centerline", t: "A horizontal line about a third down the ball is the brow line. A vertical centerline splits the face. These two lines are the axes of the whole head; when the head turns, THEY curve, and every feature follows them. Draw them as if they were drawn ON the ball's surface, not floating in front of it.", tool: "pencil" },
            { h: "Hang the jaw", t: "From the side-plane ovals, drop the jaw: it goes down about the height of the ball's radius and comes to a chin on the centerline. The jaw is a U, wider at the top, with a corner (the jaw angle) roughly level with the mouth. Draw the chin as a small box slightly forward of the ball's bottom, not as a point — chins have width.", tool: "pencil" },
            { h: "Equal thirds", t: "Hairline → brow → base of nose → chin are three EQUAL divisions. Mark them. The eyes sit halfway down the whole head (skull included) — lower than you expect, and this single fact fixes most beginner faces. Mark that too. Measure the thirds with a finger against the screen; don't estimate them.", tool: "pencil" },
            { h: "Place the features on the lines", t: "Eyes on the eye line, one eye-width apart, one eye-width from each edge of the face (the head is five eyes wide). Nose base on the nose line, as wide as the gap between the eyes. Mouth a third of the way from nose to chin, its corners under the pupils. Ears from brow line to nose line, inside the side planes. Draw them SIMPLY — almonds, a wedge, a line. Detail comes later; placement comes now.", tool: "pencil" },
            { h: "Ink over the construction", t: "On the Inks layer, commit only the finished head — outline, features, hair mass sitting ON the ball (hair has volume; it doesn't start at the skull's surface) — letting the construction stay blue underneath. Then hide the Pencils layer and judge it. If the eyes look too low, you've drawn every previous face with them too high.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Five heads, then one from memory",
          hints: ["Repeat the full construction five times in a row, smaller, faster.", "Then one from memory, no guide. Check it against the thirds afterward."],
          steps: [
            { h: "Five in a row", t: "Ball, slice, axes, jaw, thirds, features — five times across the page, each in under four minutes. Speed is the point: the construction must become a sequence your hand knows. Vary the ball size and the jaw length so the five are five people.", tool: "pencil", layer: "Pencils" },
            { h: "One from memory", t: "Draw a head with no construction, the way you would have last month. Then, over it, lightly draw the ball and thirds and see where your instinct disagreed with the method. The eyes will be high, the cranium small, the jaw short. That gap is exactly what the next weeks close.", tool: "pencil" },
            { h: "Vary the proportions", t: "Construct two more heads changing one thing each: a longer jaw (a longer face, more adult, sterner), and a bigger ball relative to the jaw (younger, rounder). The construction stays; the character changes. This is the first step toward the Character Design chapter.", tool: "pencil" },
          ] },
      ],
      reflect: ["Where did your instinct want to put the eyes vs where the construction put them?", "Draw a second head from memory tomorrow. Then check it against the thirds."] },

    { id: "head-2", title: "Turning the head", minutes: 55,
      goal: "Draw the same head at three-quarter, profile and tilted angles using the ball construction.",
      why: "A head that only works from the front is useless in comics — characters look up, turn away, glance over a shoulder. The Loomis ball survives every rotation because you're rotating a 3-D object, not redrawing a 2-D symbol, and the side plane tells you exactly how far the head has turned. This is the lesson that makes the 250 boxes worth it: a head is a ball with planes, and you can already rotate those.",
      refs: ["loomis-head", "proko-head", "loa-faces", "handy"],
      pages: [
        { title: "Three-quarter and profile", exemplar: "loomisAngles",
          steps: [
            { h: "Rotate the side plane", t: "For a three-quarter view, the side-plane oval on the far side shrinks to a sliver and disappears, and the near one moves toward the middle of the ball and opens up toward a circle. The centerline CURVES around the ball toward the near side, like a meridian on a globe. Draw the ball, place the side plane, curve the centerline. The position of that side plane IS the angle of the head; everything else follows.", tool: "pencil", layer: "Pencils" },
            { h: "The far side compresses", t: "Everything on the far side of the centerline is narrower: the far eye is shorter than the near eye, the far cheek is a sliver, the far side of the mouth is shorter, the far nostril nearly hidden behind the nose. Everything on the near side is fuller. Place features on the CURVED thirds — the brow line, nose line and mouth line all bend around the ball. The nose sticks out past the far cheek's contour.", tool: "pencil" },
            { h: "Profile", t: "The side plane is now a full circle inside the ball (you see it flat-on). The jaw is a bracket hanging from it, the jaw angle just behind the circle's center. The ear sits on the side-plane circle, behind its center and between the brow and nose lines. The features are on the front edge: brow bump, nose wedge, lips, chin, in a zigzag. Nothing curves — but the ear placement will catch you if you skipped the side plane, and the neck comes off the back of the skull at an angle, not straight down.", tool: "pencil" },
            { h: "Draw all three of the same character", t: "Pick simple distinguishing features (a big nose, a wide jaw, a specific hairline) and draw the same person front, three-quarter and profile. Same ball size, same thirds, same jaw length. This is a 'model sheet' — comics artists make one per character so the face stays consistent across two hundred panels. Line them up so the thirds are level across all three.", tool: "pencil" },
          ] },
        { title: "Tilt, up and down", exemplar: "headTilt",
          steps: [
            { h: "Looking down", t: "When the head tips forward, the brow line and thirds CURVE downward like the lines of latitude on a globe seen from above. More cranium is visible; the features compress toward the chin; the ears rise relative to the eyes; the top of the head becomes the biggest shape. The nose tip drops below the mouth line's level. Draw it, front and three-quarter.", tool: "pencil", layer: "Pencils" },
            { h: "Looking up", t: "Tilt back: the thirds curve upward, you see the underside of the nose and jaw (two planes you never drew before), the ears drop below the eye line, the neck is fully visible as a cylinder entering the jaw's underside. The eyes look like they're sitting on the brow. Draw it. These two views are where most artists' faces fall apart — it's all in curving the thirds and in trusting that the underside exists.", tool: "pencil" },
            { h: "A tilt with a turn", t: "Combine: three-quarter view looking slightly down (the classic 'brooding' angle) and three-quarter looking up (defiance). The centerline curves sideways AND the thirds curve down or up. Use the Line of Action faces tool for reference — set 2 minutes and draw six, construction only, no rendering.", tool: "pencil" },
            { h: "Ink a turnaround", t: "Ink your best four angles in a row: front, three-quarter, profile, three-quarter looking down. Comics 'model sheets' look exactly like this. Hide Pencils and check that the four read as one person — same jaw, same nose, same hairline.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which angle was hardest? Almost universally it's 'looking up' — the underside of the nose feels wrong at first.", "Do your four angles look like the same person? If the profile doesn't match, the jaw length is the usual culprit."] },

    { id: "head-3", title: "Features in detail", minutes: 55,
      goal: "Construct the eye, nose, mouth and ear as 3-D forms that turn with the head.",
      why: "The eye symbol (an almond with a circle) is why drawn faces look flat. The real eye is a ball inside a socket, wrapped by lids that have thickness and cast a shadow. Same for the nose (a wedge with a ball), the mouth (on a curved cylinder), the ear (a bowl). Forms turn; symbols don't — and the moment a character glances sideways, the symbols break while the forms simply rotate.",
      refs: ["loomis-head", "proko-head", "loa-faces", "handy"],
      pages: [
        { title: "Eye and brow",
          hints: ["Draw each feature large — a quarter page each.", "The eyeball is a sphere. The lids wrap it. The iris is a disc on the sphere's surface.", "Draw the eye front, three-quarter and profile."],
          steps: [
            { h: "The eyeball in the socket", t: "Draw a sphere. The eye socket is a bony hollow around it; the brow ridge overhangs it, which is why the upper part of the eye is usually in shadow. The upper lid wraps over the top of the sphere (it's thicker and casts a shadow on the eyeball), the lower lid tucks under and is thinner. The visible 'almond' is just where the lids part, and its shape is a consequence of the sphere underneath, not a shape in itself.", tool: "pencil", layer: "Pencils" },
            { h: "The iris is a disc, not a circle", t: "The iris sits on the sphere's surface, so in three-quarter view it's an ellipse, and in profile it's a thin sliver. The upper lid usually covers the top of it; the lower lid rarely touches it. The pupil is a smaller disc on the same surface. Draw the eye at three angles with the iris turning into an ellipse, and the lids' thickness visible as a tiny ledge along the lower lid.", tool: "pencil" },
            { h: "Brows are on the ridge", t: "The eyebrow follows the brow ridge — a curve OVER the socket, not a line above the eye, and it wraps around the corner of the forehead onto the side plane. In three-quarter view the far brow foreshortens and its outer end disappears behind the forehead. Draw the brow-and-eye unit at three angles, and note the tear duct at the inner corner: it's what makes an eye look like it belongs to a face.", tool: "pencil" },
            { h: "A pair of eyes", t: "Two eyes on a three-quarter head, both constructed. The far eye is narrower, sits slightly lower on the page (the eye line curves), and its outer corner may be hidden by the bridge of the nose. Both irises point the same way. This pair is the test: most flat faces have two identical front-view eyes stuck on a turned head.", tool: "pencil" },
          ] },
        { title: "Nose, mouth, ear",
          hints: ["Nose: a wedge from the brow, with a ball on the end and two wings.", "Mouth: lips wrap a cylinder (the teeth). The top lip is usually thinner and angles inward.", "Ear: a bowl with a rim (helix), an inner ridge, and a lobe."],
          steps: [
            { h: "The nose as a wedge", t: "From the brow, a wedge comes forward and down; at its end sits a ball (the tip) with a wing on each side (the nostrils). Draw it as a block first — front, three-quarter, profile — with its four planes: top (the bridge, lit), two sides (halftone), and bottom (the underside, in shadow, with the nostrils in it). Only then soften it. The underside of the wedge is what you see when the head looks up, and the bridge is what catches the highlight.", tool: "pencil", layer: "Pencils" },
            { h: "The mouth on a cylinder", t: "The teeth are a curved cylinder; the lips lie on its surface. So in three-quarter view the far half of the mouth is shorter and curves away, and in profile the lips stick out past the chin. The line between the lips is the important line — the lip edges are soft and mostly shown by value, not line. The top lip has three parts (two wings and a center), the bottom lip two pads. Draw the mouth relaxed, smiling and open, at two angles.", tool: "pencil" },
            { h: "The ear as a bowl", t: "A C-shaped rim (helix) around a bowl (concha), an inner Y-shaped ridge (antihelix), a lobe at the bottom. It sits on the side plane, tilted back slightly, its top level with the brow and its bottom with the nose base. Draw it from the side, then from the front (it's a thin curved shape sticking out from the head), then three-quarter (the bowl faces you and the rim is a thick edge). Ears are the feature nobody studies and everybody notices when wrong.", tool: "pencil" },
            { h: "Assemble a face at three-quarter, in ink", t: "Construct a three-quarter head and place all four features on it as FORMS — the eye spheres in their sockets, nose wedge with its planes, mouth cylinder, ear bowl. Ink it with heavier line under the brow, under the nose and under the lower lip, where the forms overhang. Compare to your very first head from Head-1.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which feature were you drawing as a symbol before? How does it look as a form?", "Turn your inked head upside down. Do the features still sit on the ball, or do they float?"] },

    { id: "head-4", title: "Expressions", minutes: 55,
      goal: "Draw six core expressions on a constructed head, understand what muscles drive them, and push them for comics.",
      why: "Comics are acting. A character's face carries the story beat, and readers detect fake expressions instantly — a smile without the eyes, surprise without the brows. Ekman's research shows expressions are combinations of a few muscle actions — brows, lids, mouth corners, nose — which means they can be constructed, not guessed, and pushed on purpose. The FACS page in References is the science; Mark Simon's photo book is the reference library.",
      refs: ["ekman-facs", "simon-expr", "loa-faces", "proko-head"],
      pages: [
        { title: "Six expressions", exemplar: "expressionGrid",
          steps: [
            { h: "Neutral first", t: "Draw a neutral face on a constructed head. This is your baseline — every expression is a change FROM neutral, and without the baseline you can't tell how far you've pushed. Note where the brows, lids and mouth corners rest. Draw the same neutral face five more times, small, in the remaining cells; they'll become the expressions.", tool: "pencil", layer: "Pencils" },
            { h: "Joy", t: "The mouth corners pull UP and BACK, the cheeks rise and push the lower lids up (that's the 'real smile' — Duchenne — and it's the lower lids that sell it). The eyes narrow slightly, crow's feet appear at the outer corners. A smile with wide-open eyes reads as fake or sinister, which is useful when you want fake or sinister. Draw it on the second head.", tool: "pencil" },
            { h: "Surprise and fear", t: "Surprise: brows up and arched, eyes wide (whites visible above the iris), mouth open and relaxed, jaw dropped. Fear: brows up but pulled TOGETHER (a ripple across the forehead), eyes wide, mouth stretched sideways and tense, chin pulled back. The brow-together is the difference — draw both side by side and swap only the brows to feel it.", tool: "pencil" },
            { h: "Anger and sadness", t: "Anger: brows down and together (a vertical crease between them), upper lids raised so the eyes glare, nostrils flared, lips pressed or teeth bared. Sadness: inner brows up (a peaked shape), lids heavy and drooping, mouth corners down, lower lip possibly pushed up. Draw both. Notice anger and sadness are almost opposite brow shapes — the brows carry most of the emotion; the mouth confirms it.", tool: "pencil" },
            { h: "Push them", t: "Redraw each expression at 2× intensity — bigger brow movement, wider mouth, squashed or stretched skull (joy stretches the face wide, anger compresses it, surprise stretches it tall). Comics live at this level. Then draw one at half intensity, the subtle version for a quiet panel — a character hiding the feeling.", tool: "pencil" },
            { h: "Turn one", t: "Draw your best expression on a three-quarter head. The near cheek pushes up more; the far brow foreshortens; the mouth's far corner is hidden by the cheek in a wide smile. Ink it. Then ink the neutral face next to it — the pair is the acting range of your character.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Mixed and in-between",
          hints: ["Real faces mix expressions: nervous laughter, angry tears, polite disgust.", "Take the brows from one expression and the mouth from another."],
          steps: [
            { h: "Mix two", t: "Brows of fear with the mouth of joy: nervous laughter. Brows of anger with the mouth of sadness: bitterness. Brows of surprise with a neutral mouth: attention. Draw four mixes, naming each. This is where characters stop being masks and start being people.", tool: "pencil", layer: "Pencils" },
            { h: "The transition", t: "Three heads in a row: neutral, halfway, full expression — a face beginning to realize something. Comics panels often want the halfway frame. Which features move first? (The brows, then the eyes, then the mouth.)", tool: "pencil" },
            { h: "From reference", t: "Line of Action faces tool, 2 minutes, six expressions. Construct the head, identify the action units (which brows, which lids, which mouth), draw only those. Don't copy the photo — extract the mechanism.", tool: "pencil" },
          ] },
      ],
      reflect: ["Cover the mouth on each face. Do the eyes and brows alone still read the emotion? They should.", "Look at the Ekman FACS page: which action units did you use without knowing their names?"] },
    ] },

  /* ============================================================ */
  { id: "s3-body", title: "Body Construction",
    summary: "The mannequin: a simplified figure of boxes and tubes that can be turned to any angle, with landmark proportions you can count on. This is not anatomy yet — it's the armature anatomy will later hang on. Your Sycra anatomy sheet in the Library tab shows exactly this simplification from five angles, and Loomis's 'Figure Drawing for All It's Worth' (public domain) is the source for the proportions, including the proportions of children and different builds.",
    lessons: [

    { id: "body-1", title: "Proportions and the ruler", minutes: 45,
      goal: "Lay out a figure with standard proportions using the head as the unit, and recognize stylized proportion systems.",
      why: "The head-unit system (a figure is 7½ heads tall) gives you a scaffold that's right before you've drawn anything. It also lets you CHOOSE a proportion — 8½ heads for heroes, 5 for cartoon kids — and keep it consistent across an issue, which is the difference between a cast that looks designed and one that looks improvised. Loomis's proportion charts are the standard every later book copies.",
      refs: ["loomis-figure", "proko-figure", "bridgman"],
      pages: [
        { title: "7.5 heads", exemplar: "mannequin",
          steps: [
            { h: "Draw the ruler", t: "Eight tick marks down the left of the page, evenly spaced: that's 7½–8 heads. Copy the guide mannequin beside it, checking every landmark against the ruler: chin at 1, nipples at 2, navel at 3, crotch at 4 (the halfway point of the body — most beginners put it higher), knees at 5½, ankles at 7¼, soles at 7½. Say each number as you place it.", tool: "pencil", layer: "Pencils" },
            { h: "Arm landmarks", t: "Shoulders at about 1½ heads; elbows at the waist (3); wrists at the crotch (4); fingertips at mid-thigh (4¾). Arms are longer than beginners draw them — check yours against these and you'll almost certainly find them short. The upper arm and forearm are nearly equal in length; the hand is about a face long.", tool: "pencil" },
            { h: "Width", t: "Shoulders are about 2 head-widths across on a feminine build and 2⅓ on a masculine one; hips about 1½, wider than the shoulders' proportion on a feminine build and narrower on a masculine one. The ribcage is a head and a half wide. Draw the mannequin a second time from memory and measure it afterward — width is what memory gets wrong most.", tool: "pencil" },
            { h: "Side and back", t: "Draw the same 7½-head figure from the side (the spine's S-curve, the ribcage tilted back, the pelvis tilted forward, the calves behind the line of the thigh) and from the back (shoulder blades at 1½–2, the small of the back at 3, the glutes at 3½–4). The landmarks are at the same heights from every angle; that's what makes them landmarks.", tool: "pencil" },
          ] },
        { title: "Proportion is a choice", exemplar: "proportionCompare",
          steps: [
            { h: "Heroic: 8½ heads", t: "Same landmarks, smaller head, longer legs, the extra half-head all below the crotch. Superhero comics use this. Draw it beside the realistic one — feel how the extra leg length reads as power and the smaller head as distance, as if you're looking up at a statue.", tool: "pencil", layer: "Pencils" },
            { h: "Stylized: 5 heads and 3 heads", t: "Cartoon and chibi proportions — the head is huge, the body compressed, but the LANDMARK ORDER never changes (chin, chest, waist, crotch, knee). Draw both. At 3 heads the hands become mittens and the legs are shorter than the head; at 5 the figure still walks like a person. Consistency of proportion across a cast is what makes a comic look designed.", tool: "pencil" },
            { h: "Build your own system", t: "Decide a proportion for a character of your own and write the numbers in the margin: heads tall, shoulder width, leg length, hand size. Draw it. Then draw a second character in the SAME system but a different build (wider, narrower). You'll use this sheet in the Character Design chapter.", tool: "pencil" },
            { h: "Spot the system", t: "Open three comics or animation stills. Count heads for one character in each. Write down the system each artist chose and what it does for the tone. Most manga runs 6–7; most superheroes 8–9; most gag strips 3–4.", tool: "pencil" },
          ] },
      ],
      reflect: ["Which landmark did you consistently misplace? (Usually the crotch is too high or the knees too low.)", "What proportion system suits the comic you want to make? Say why in one sentence."] },

    { id: "body-2", title: "The mannequin in 3-D", minutes: 55,
      goal: "Draw the figure as boxes and tubes that can be rotated, with the ribcage and pelvis as solid forms.",
      why: "Blobs can't turn; boxes can. A ribcage drawn as a box with a front, sides and top can be tipped, twisted and viewed from below, and its front face tells you where the chest is and its side where the arm attaches. This is the exact reason Section 1 made you rotate 250 boxes: the figure is three boxes and eight tubes, and you already know how to rotate those.",
      refs: ["proko-figure", "hampton", "loomis-figure", "posemaniacs"],
      pages: [
        { title: "Boxes and tubes", exemplar: "mannequinBoxes",
          steps: [
            { h: "Ribcage box", t: "Draw the ribcage as a box slightly wider than deep, tilted a bit back, with the front face showing the sternum line down the middle and the bottom edge of the ribs as an arch. Draw it at three rotations using the Y method. The box's front face gives you where the chest is; its side face is where the arm attaches; its top is where the neck enters. Round the corners only after the box is right.", tool: "pencil", layer: "Pencils" },
            { h: "Pelvis box and the gap", t: "The pelvis is a smaller box (a bucket, tipped forward), whose top edge is the belt line and whose front face carries the crotch at its bottom. Between it and the ribcage is the flexible waist — the gap that lets the two boxes tilt against each other, about half a head tall. Draw the pair in contrapposto: ribcage tilted one way, pelvis the other, connected by a curved spine line, the waist compressed on one side and stretched on the other.", tool: "pencil" },
            { h: "Limbs as tapered cylinders", t: "Upper arm: a tube tapering toward the elbow. Forearm: wider at the elbow (the muscle mass), tapering to the wrist, which is a flattened box. Same for thighs (widest at the top) and calves (widest a third of the way down). Draw joints as spheres that both tubes plug into. The overlap at each joint says which segment is in front — decide it every time.", tool: "pencil" },
            { h: "Assemble and rotate", t: "Build the full mannequin: head ball, neck cylinder (angled forward, not vertical), ribcage box, pelvis box, limb tubes, mitten hands, wedge feet. Now draw it from the side and from a high three-quarter view (looking down). The boxes tell you what you'd see — the top of the ribcage, the top of the pelvis, the shoulders foreshortened; blobs would just be blobs.", tool: "pencil" },
            { h: "From below", t: "The hardest angle: a low three-quarter view looking up. You see the undersides of the ribcage box and the jaw, the pelvis box's front face large, the feet biggest of all. Construct it slowly. This is the heroic low angle comics use constantly and almost nobody draws without a mannequin.", tool: "pencil" },
          ] },
        { title: "Gesture to mannequin",
          hints: ["Posemaniacs or Line of Action, 5-minute timer.", "Line of action → bean → boxes → tubes. In that order, every time.", "Six poses. Then ink the best one."],
          steps: [
            { h: "Gesture first, always", t: "Open a timed pose tool. For each pose: 20 seconds of line of action and bean, then build the boxes on the bean (the ribcage box on the top egg, the pelvis box on the bottom one, keeping their tilt), then tubes on the rhythm lines. The gesture is the life; the mannequin is the solidity. Never skip the first for the second, and never let the second stiffen the first.", tool: "pencil", layer: "Pencils" },
            { h: "Foreshortened limbs", t: "When a limb points at the camera, its tubes overlap heavily and the near end draws bigger. Choose two poses with an arm reaching toward you and construct the overlaps deliberately, contour ellipses on each tube showing which way it points. (Full foreshortening is in the Figure chapter — this is the first taste.)", tool: "pencil" },
            { h: "Timed: five minutes, full mannequin", t: "Drill on, five minutes per pose, six poses. Line of action, bean, boxes, tubes, mittens, wedges. Five minutes is long enough to construct and short enough to forbid rendering. On the contact sheet, check every ribcage-pelvis pair for tilt.", tool: "pencil", drill: { seconds: 300, poses: 6 } },
            { h: "Ink one mannequin", t: "Ink the best pose as a clean mannequin — this is a legitimate finished style in itself (many storyboard artists never go further). Heavy lines where forms overlap; light contour lines on the tubes. Save it: Anatomy in Section 5 will hang muscles on exactly this figure.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Could you draw one of your poses from the opposite side? Try it — that's the mannequin's superpower.", "Which box do you keep forgetting to tilt? (Usually the pelvis.)"] },

    { id: "body-3", title: "Age and body types", minutes: 55,
      goal: "Draw the mannequin as a toddler, a child, a teenager, an adult and an elder, and as four adult builds — changing proportion, head size and posture while keeping the landmark order.",
      why: "One default body is the tell of an untrained cast: every character the same height, the same build, the same age, distinguished only by hair. Age is mostly proportion (a toddler is four heads tall with the halfway point at the navel), build is mostly width and mass distribution, and posture carries the rest. Loomis's charts and Jack Hamm's give the numbers; this lesson turns them into a cast that reads at a glance.",
      refs: ["loomis-figure", "hamm-figure", "loomis-fun", "proko-figure", "posemaniacs"],
      pages: [
        { title: "Five ages", exemplar: "ageProportions",
          steps: [
            { h: "The toddler: 4 heads", t: "Copy the guide's first figure. The head is a quarter of the whole height, the halfway point is at the NAVEL (not the crotch), the legs are short and the belly round, the limbs are tubes with no taper, the neck is nearly absent, and the face's features sit low on a huge cranium — the eyes at or below the ball's center. Draw it standing, then sitting: toddlers sit with legs straight out.", tool: "pencil", layer: "Pencils" },
            { h: "The child: 5½ heads", t: "Around six years old: the halfway point has dropped to the hips, the legs have lengthened, the head is still big and round, the shoulders narrow (about 1½ heads), no waist to speak of. Children's proportions change fastest in the legs; draw a child next to the toddler and make the leg difference the obvious thing.", tool: "pencil" },
            { h: "The teenager: 6½ heads", t: "Legs nearly adult length, the head nearly adult size, so the whole figure is 'stretched': long limbs, narrow shoulders and hips, a visible waist, big hands and feet (they grow first). Posture matters — a slouch or a stiffness tells the age as much as the ratio. Draw a teen beside the child.", tool: "pencil" },
            { h: "The adult and the elder", t: "Adult at 7½ heads as in Body-1. Then the elder: about 7 heads because the spine has compressed and curved — the head comes forward, the shoulders round, the knees bend slightly, the chest sinks and the belly comes forward, the hands and joints enlarge while the limbs thin. Age in the elder is posture and mass, not just height. Draw the elder with the same skeleton as the adult but every curve increased.", tool: "pencil" },
            { h: "Line them up", t: "Redraw all five in a row at true relative heights (the guide shows them: a toddler is about half an adult), feet on one line. This is a family or a cast. Ink the row. If the teen and the adult look the same, the teen's shoulders are too wide.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Four builds, one system",
          hints: ["Keep the head-unit system fixed (7½). Change only width and where the mass sits.", "Heavy, lean, muscular, stocky. Then mix two."],
          steps: [
            { h: "Heavy", t: "Same skeleton, mass added: the ribcage box gets a soft cylinder around it, the belly is a sphere that hangs from the ribcage and sits on the pelvis, the limbs are tubes with a wider middle, the neck merges into the shoulders. The landmarks don't move; the surface moves out from them. Weight sits LOW on most bodies. Draw it front and side.", tool: "pencil", layer: "Pencils" },
            { h: "Lean", t: "Mass removed: the ribcage box's edges show (the thoracic arch, the collarbones), the limbs are near-straight tubes with visible joints, the neck long, the face angular. The elbow and knee spheres now look bigger than the tubes. Draw it beside the heavy figure at the same height.", tool: "pencil" },
            { h: "Muscular and stocky", t: "Muscular: mass added HIGH — shoulders wider (2½+ heads), ribcage box deeper, upper arms and thighs as fat tapered tubes, waist narrow. Stocky: the whole figure shortened to 6½ heads and widened, mass everywhere, short neck, big hands. Both are 'strong' but they read as different characters: the athlete and the laborer.", tool: "pencil" },
            { h: "Mix and cast", t: "Combine: a lean elder, a heavy child, a muscular teen, a stocky adult. Draw the four as a group with heights consistent. Then pick the two that feel most like characters, dress them in the Fabric chapter, and color them in the Color chapter — a cast begins here. Save this page: Character Design (Section 5) starts from it.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which age did you draw as 'a small adult'? (The child, almost always — the head was too small.)", "Cover the heads on your four builds. Can you still tell them apart from the bodies alone?"] },
    ] },

  /* ============================================================ */
  { id: "s3-fabric", title: "Fabrics and Folds",
    summary: "Cloth is simple physics: it hangs from points, stretches between points, and piles up where it's pushed. Burne Hogarth named seven fold families; every wrinkle you'll ever draw belongs to one. Learn the families, learn to find the tension points, then dress your mannequin in shirts, coats, hoods and capes. The rule that fixes most clothing: cloth is SMOOTH where it's stretched over the form and folds only where it's pinned or pushed.",
    lessons: [

    { id: "fab-1", title: "The seven folds", minutes: 50,
      goal: "Recognize and draw the seven fold families, and identify each in a photo reference.",
      why: "Random wrinkles look like noise; classified folds look like cloth. Once you can say 'that's a zigzag fold at the elbow, a drop fold from the shoulder', you draw with intent — and you can invent believable folds where the reference doesn't show them, which is most of the time in comics. Hogarth's 'Dynamic Wrinkles and Drapery' is the source; Sinix's fold videos are the free version.",
      refs: ["hogarth-drapery", "sinix", "loa-clothed"],
      pages: [
        { title: "The families", exemplar: "foldTypes",
          steps: [
            { h: "Pipe folds", t: "Cloth hanging from one point or edge: parallel tubes, like a curtain or a hanging skirt, widening as they fall. Draw a row, giving each tube a lit side and a shadow side — a fold is a cylinder, and it's shaded like one, with a core shadow just past its ridge. Pipe folds from a single point radiate; from an edge they run parallel.", tool: "pencil", layer: "Pencils" },
            { h: "Zigzag and half-lock", t: "Zigzag: a tube (a sleeve, a pant leg) that bends — the cloth on the inside of the bend buckles into a Z pattern, the cloth on the outside stretches smooth. Half-lock: a tube bent sharply, so the fold locks over on itself and makes a flat diamond. Draw a bent sleeve using each, and note that the zigzag is always on the INSIDE of the bend; the outside is where the form shows through.", tool: "pencil" },
            { h: "Spiral and diaper", t: "Spiral: folds wrapping around a tube in a twist — a sleeve pushed up the arm, a sock, cloth on a twisting torso. Diaper: cloth slung between TWO points — a sash, a hammock, a scarf between two shoulders — sagging in a U with folds that radiate from both pins. Draw both, and draw the diaper again with the two points closer together (deeper sag) and further apart (flatter).", tool: "pencil" },
            { h: "Drop and inert", t: "Drop: cloth falling from a single point, radiating and flaring (a cape from the shoulders, a towel from a hand, a tablecloth from a corner). Inert: cloth lying on a surface with nothing pulling it — soft, random piles, the folds rounded and directionless. Draw a cape and a dropped jacket. Inert folds are the only random ones; everything else has a cause.", tool: "pencil" },
            { h: "Spot them in a photo", t: "Open Line of Action's figure tool with the clothed filter (or Unsplash 'jacket'). Draw the figure loosely and LABEL each fold family you can find. Expect four or five families in one outfit — pipes from the shoulders, zigzags at the elbows, a diaper across the chest, inert at the cuffs. If you find a fold that fits no family, look again; it's usually two families overlapping.", tool: "pencil" },
          ] },
      ],
      reflect: ["Which two families do you see most often? (Pipe and zigzag, in almost every outfit.)", "Draw a fold from memory now, from each family. Which one couldn't you draw without the guide?"] },

    { id: "fab-2", title: "Tension points: where cloth hangs from", minutes: 50,
      goal: "Find the points that pin cloth to the body and draw folds radiating from them.",
      why: "The single biggest clothing mistake is drawing wrinkles everywhere. Cloth is smooth where it's stretched over the form and folds only where it's pinned (a shoulder, a belt) or pushed (a bent elbow). Find the pins first, and the folds place themselves — and the smooth areas, which show the body underneath, do more for the figure than any fold.",
      refs: ["hogarth-drapery", "loa-clothed", "sinix"],
      pages: [
        { title: "Pins on the mannequin", exemplar: "tensionPoints",
          steps: [
            { h: "Mark the pins", t: "On the guide mannequin, the pins are marked: shoulders (a shirt hangs from them), the waist/belt, bent knees and elbows (cloth pulls across the bend), the crotch, the collar. Copy the mannequin and mark the pins yourself for a standing pose. Then mark where the cloth is STRETCHED between pins (smooth) and where it's slack (folds). Two colors of marker help.", tool: "pencil", layer: "Pencils" },
            { h: "Folds radiate from pins", t: "From each shoulder pin, draw drop folds falling down the torso. Between the two shoulders, a diaper fold sags across the chest. Where the belt pins the shirt, the cloth above it bunches (zigzag and inert). Draw the shirt on the mannequin using only those three pin systems and leave the rest of the cloth smooth. Count your fold lines: under eight is right.", tool: "pencil" },
            { h: "Move the pose, move the pins", t: "Raise one arm: the shoulder pin rises, folds now stretch from the raised shoulder DOWN across the ribs toward the opposite hip, and the armpit becomes a pin. Bend the knee: a pin appears at the knee with zigzags behind it and stretch across the front. Twist the torso: spiral folds around the waist. Draw all three changes on three mannequins.", tool: "pencil" },
            { h: "Sitting", t: "A seated figure: pins at the hips and knees, the trouser cloth stretched tight across the thigh (smooth, showing the form) and bunched at the hip and behind the knee (zigzag). The shirt bunches at the belt. Sitting figures are half of all comic panels; draw two.", tool: "pencil" },
          ] },
        { title: "Smooth where stretched",
          hints: ["Stretched cloth shows the FORM underneath — few folds.", "Loose cloth hides the form — many folds.", "Draw the same torso in a tight shirt and a loose one."],
          steps: [
            { h: "Tight versus loose", t: "Draw a mannequin torso twice. Dress the first in a tight T-shirt: the cloth reads as the ribcage box with a few stretch lines at the armpits and across the chest. Dress the second in a baggy sweatshirt: the cloth reads as its OWN form (a bigger, softer box) with drop and inert folds, and the body underneath is only hinted at the shoulders and where the belt pins it. Both are correct; they're different garments.", tool: "pencil", layer: "Pencils" },
            { h: "Cloth thickness", t: "Thin cloth (a T-shirt, silk) makes many small sharp folds; thick cloth (a wool coat, denim) makes a few big soft ones, and leather makes almost none. Redraw the loose top as a heavy coat: fewer, rounder folds, and the hem hangs straight from the shoulders' width without touching the hips. Then as silk: many fine folds, everything clinging.", tool: "pencil" },
            { h: "Ink with fold logic", t: "Ink the tight and the thick versions. Only draw a fold line where a fold changes plane — the shadow side of the ridge. A fold drawn as two outlines looks like a tube of toothpaste; a fold drawn as one line plus a shadow looks like cloth. Let smooth areas stay empty; the emptiness is the form.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Count the fold lines on your tight shirt. If it's over ten, you drew the symbol of wrinkles, not the cloth.", "Where is the cloth smooth on your seated figure? That's where the body shows."] },

    { id: "fab-3", title: "Dressing a character: garments", minutes: 60,
      goal: "Draw a full outfit — shirt, trousers, jacket or coat, hood, cape — on a posed mannequin, each garment obeying its own pin logic.",
      why: "Every garment type has its own structure: a hood is a tube that crumples at the neck; a cape is two drop-fold systems from the shoulders; a coat is a stiff box that hangs; trousers are two tubes pinned at the waist and knees. Learning each type once means you can dress anyone, in any pose, from any era — because you're drawing the garment's structure, not copying a photo of it.",
      refs: ["hogarth-drapery", "loa-clothed", "unsplash", "sinix"],
      pages: [
        { title: "Shirt, trousers, jacket",
          hints: ["Pose a mannequin first (Posemaniacs, 5 min).", "Each garment is its own layer of form OVER the mannequin — draw its silhouette before its folds.", "Seams follow contour lines."],
          steps: [
            { h: "Shirt or T-shirt", t: "Silhouette first: the shirt's shape is the ribcage box plus ease (slack), so it's a slightly bigger, softer box that hangs from the shoulders. Collar is a band around the neck cylinder. Sleeves are tubes wider than the arm tubes, with a seam at the shoulder that follows the deltoid's contour. Then folds: drop from shoulders, zigzag at the bent elbow, bunching at the waist. Seams follow contour lines — the side seam runs down the ribcage's side plane.", tool: "pencil", layer: "Pencils" },
            { h: "Trousers", t: "Two tubes pinned at the waist and (if bent) the knees. The crotch is a tension point where diagonals from both hips meet. Straight legs: pipe folds from the waist, breaking once at the shoe. A bent knee: zigzags behind, stretch across the front, the cloth revealing the kneecap. Cuffs pile up (inert) on the shoe. Pockets and seams sit on the tube's contour lines.", tool: "pencil" },
            { h: "Jacket or coat", t: "A stiffer, boxier form over the shirt: the coat has its own shoulders (padding makes them square), lapels (a plane folding outward from the chest, with a roll line), and a hem that hangs straight from the shoulders' width. Few folds — thick cloth. An open coat swings as two drop-fold panels from the shoulders and reveals the shirt's folds inside. Ink the whole figure.", tool: "ink", layer: "Inks" },
          ] },
        { title: "Hoods, capes, and everything else",
          hints: ["A hood up: a bowl around the ball of the head, tube down the neck.", "A hood down: a crumpled inert pile behind the neck.", "A cape: two drop systems from the shoulder pins; in wind, a diaper between them."],
          steps: [
            { h: "The hood", t: "Up: a bowl following the head's ball with the face inside it in shadow, joining a tube at the neck with spiral folds where it crumples. The opening's edge is an ellipse around the face. Down: an inert pile at the back of the neck, its opening now a diaper fold between the shoulders. Draw both on a three-quarter head.", tool: "pencil", layer: "Pencils" },
            { h: "The cape", t: "Pins at the two shoulders. Standing still: two drop-fold cascades meeting behind, the hem a soft curve. Walking: the cape trails, folds become long pipes, the hem lifts at the back. In wind: a diaper fold slung between the shoulders and the hem lifting and flaring, folds radiating from the pins. Draw all three — capes are half of comics, and they're the easiest garment to get right once you see the two pins.", tool: "pencil" },
            { h: "Skirts, sleeves, boots", t: "A skirt: pipe folds from the waistband, breaking over the knee when the leg advances. A rolled sleeve: spiral folds bunched above the elbow. A boot: a tube on a wedge with zigzags at the ankle where it bends. Draw one of each on a mannequin. Every garment you'll ever meet is a combination of these.", tool: "pencil" },
            { h: "Your own outfit", t: "Design an outfit from reference photos (Unsplash: 'streetwear', 'armor', 'uniform' — whatever your story needs) and dress your mannequin from Body-2 in it. Pins first, silhouettes second, folds last. Ink it. This character continues into the Color chapter and, from there, into Section 5.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Did you draw the garment's silhouette before its folds, or the folds first? The order matters.", "Which garment on your character has the fewest folds? It should be the thickest one."] },
    ] },

  /* ============================================================ */
  { id: "s3-color", title: "Color Theory",
    summary: "The color wheel, the three properties of color (hue, saturation, value), and the simple harmonies — taught with Penshi's own Color Wheel tool in the Tool tab, which keeps hue, saturation and value on three separate controls and draws harmonies live. By the end you'll color the character you designed in the Fabric chapter with a palette you can defend, and you'll know why value matters more than hue. The Advanced Color chapter in Section 4 extends everything here.",
    lessons: [

    { id: "color-1", title: "The wheel and the three properties", minutes: 45,
      goal: "Understand hue, saturation and value as independent controls, and navigate the 12-hue wheel.",
      why: "Most color confusion comes from mixing up the three properties. 'Make it more blue' might mean hue, saturation OR value, and until you separate them you're turning three dials at once and hoping. Separate them and color becomes a set of controls you can turn on purpose — and Penshi's wheel is built so each dial is a separate motion.",
      refs: ["adobe-color", "ctrlpaint", "marco-bucci", "gurney-book"],
      pages: [
        { title: "The 12-hue wheel", exemplar: "colorWheel12",
          steps: [
            { h: "Open the Tool tab's color wheel", t: "Below the swatches in the Tool tab is Penshi's Color Wheel. The ring is HUE (the 12 named colors of this guide, and every shade between). Drag around it and watch the Color chip. Pick the six primaries and secondaries in turn and swatch each on the page under the matching wheel segment. Then the six tertiaries between them. Twelve swatches, in wheel order.", tool: "marker", layer: "Colors" },
            { h: "Primaries, secondaries, tertiaries", t: "Red, yellow, blue are primaries; orange, green, violet between them are secondaries; the six in-betweens are tertiaries (red-orange, yellow-green…). Label your swatches. Note which pairs sit opposite each other — red/green, blue/orange, yellow/violet — you'll use that next lesson. (Screens actually mix red, green and blue light; the painter's wheel is a useful fiction that harmony rules are built on.)", tool: "marker" },
            { h: "Warm and cool halves", t: "Draw a line through the wheel from yellow-green to red-violet. One side is warm (reds, oranges, yellows), one cool (greens, blues, violets). Swatch a warm and a cool version of the same object — a mug — side by side, and notice the warm one seems nearer and the cool one further. That's a tool, not a coincidence, and Section 4 uses it for depth.", tool: "marker" },
            { h: "Neighbors and opposites", t: "Put two neighboring hues side by side (blue and blue-violet), then two opposites (blue and orange). Neighbors are calm; opposites vibrate. Make a small swatch of each pair and write 'calm' or 'loud' under it. Every palette you ever build is a mix of these two relationships.", tool: "marker" },
          ] },
        { title: "Hue, saturation, value", exemplar: "hsvBars",
          steps: [
            { h: "Hue row", t: "In the Tool tab wheel, leave the Saturation and Value scales where they are and drag around the RING only. Fill the first row with eight swatches: hue changes, nothing else. That's the dial 'which color'. Notice that some hues at the same saturation and value look lighter than others (yellow) — that's a property of hue you can't switch off.", tool: "marker", layer: "Colors" },
            { h: "Saturation row", t: "Now keep the hue fixed and drag the SATURATION scale to the left — toward grey. Fill the second row from vivid to dull. Saturation is 'how much color'. Low saturation = calm, distant, tired, old; high = loud, near, alive, new. Most of a good image is LOW saturation with a few high spots, which is why beginner work looks garish: everything is at full.", tool: "marker" },
            { h: "Value row", t: "Hue and saturation fixed, drag the VALUE scale to the left toward black. Fill the third row from light to dark. Value is 'how light'. This is the row that does the storytelling — squint at any great painting and you see its values, not its hues. Your value scale from Shade-1 is this row in grey; every color has a value, and you should be able to name it.", tool: "marker" },
            { h: "Change two at once", t: "Make a fourth row where each step lowers saturation AND value together — a color fading into shadow. This is what a shadow on a colored object actually does (mostly). Not 'add black': adding black alone makes shadows dead. Then a fifth row where value drops but saturation RISES slightly — the glowing, saturated shadow you see in sunlight. Both are tools.", tool: "marker" },
            { h: "Name the dials on a photo", t: "Open a photo. Pick three colors from it with the eyedropper (I) and, for each, say which dial is doing the work: is that sky mostly a hue choice, a saturation choice, or a value choice? Write it under each swatch. Reading color this way is the skill; the wheel is just the instrument.", tool: "marker" },
          ] },
      ],
      reflect: ["Say out loud what each of the three dials does. If you had to lose one, which would hurt the image least? (Hue.)", "How saturated is most of the photo you sampled? Less than you thought, almost certainly."] },

    { id: "color-2", title: "Simple harmonies", minutes: 50,
      goal: "Build monochromatic, complementary, analogous and triadic palettes and know what each feels like.",
      why: "A harmony is a rule for which hues are allowed — and a rule is freedom, because it removes ten thousand choices. Comics colorists pick a harmony per scene so pages feel unified and shifts in harmony mark story turns; a reader feels the palette change before they read the caption. Penshi's wheel draws each harmony live, and Adobe Color and Paletton (References) let you explore the same rules.",
      refs: ["adobe-color", "paletton", "gurney-book", "marco-bucci"],
      pages: [
        { title: "Four harmonies", exemplar: "harmonies",
          steps: [
            { h: "Monochromatic", t: "In the Tool tab wheel, set Harmony to Monochromatic. One hue, varied only by saturation and value. Swatch five steps from near-white to near-black. Calm, cohesive, sometimes dull — the fix is a full value range from very light to very dark, and one spot of full saturation. Noir comics, dream sequences and memory scenes live here.", tool: "marker", layer: "Colors" },
            { h: "Complementary", t: "Harmony → Complementary: two hues opposite on the wheel (blue/orange, red/green, yellow/violet). Maximum contrast and vibration. The rule for using it: ONE dominates (70%+), the other is the accent, and the accent goes where you want the eye. Swatch a dominant and an accent, then a third swatch mixing them — the neutral grey that complements make together, which is the shadow color of this palette.", tool: "marker" },
            { h: "Analogous", t: "Harmony → Analogous: three neighbors on the wheel. Naturally harmonious (sunsets, forests, underwater). Feels like one mood. Swatch three, then add a small complementary accent outside the set — feel it snap into focus. Analogous is the safest palette and the most common in comics; the accent is what keeps it from being boring.", tool: "marker" },
            { h: "Triadic", t: "Harmony → Triadic: three hues evenly spaced (the primaries are a triad). Balanced but lively — the classic superhero palette (red, yellow, blue). Swatch a triad, then desaturate two of the three so the third leads. A triad at full saturation is a circus; a triad with one leader and two supporters is a costume.", tool: "marker" },
            { h: "Apply one to the mug", t: "Draw a simple mug on a table and color it three times: monochromatic, complementary, analogous. Same drawing, three moods. Write one word under each describing the feeling. Then squint: the values should be the same in all three, because harmony changes hue, not value.", tool: "marker" },
          ] },
        { title: "Harmony as story",
          hints: ["Three thumbnails of the same scene: morning, argument, aftermath.", "One harmony each. The SHIFT between them is the story."],
          steps: [
            { h: "Three moods, one scene", t: "Thumbnail a kitchen (a box room from Persp-2 is fine) three times. Morning: analogous warm. The argument: complementary, the accent on the person speaking. Aftermath: monochromatic cool. Flat color only, no rendering. Put them in a row.", tool: "marker", layer: "Colors" },
            { h: "Read the row", t: "Cover the drawings with your hand and look only at the color fields. Can you tell which is the argument? If not, the complementary contrast wasn't strong enough or the other two weren't calm enough. Adjust until the story reads from color alone.", tool: "marker" },
          ] },
      ],
      reflect: ["Which harmony did you instinctively reach for? Try the one you avoided in the next lesson.", "Look at a comic page you like: which harmony is it, and where's the accent?"] },

    { id: "color-3", title: "Coloring your character", minutes: 70,
      goal: "Choose a harmony and color the clothed character from the Fabric chapter, in flats then with simple shadow.",
      why: "Everything in this section converges here: a constructed head on a mannequin body in folded clothing, colored with a palette chosen by rule. This is the first character you can put in a comic, and the flats-then-shadow pipeline is exactly how comics are colored professionally — flats are a job title in the industry.",
      refs: ["adobe-color", "gurney-book", "ctrlpaint", "marco-bucci"],
      pages: [
        { title: "Flats", exemplar: "flatsSteps",
          hints: ["Redraw (or trace over) your inked character from Fabric-3 on the Inks layer.", "Colors layer, Fill tool for big areas, Marker for edges.", "Pick a harmony FIRST and swatch the palette in the margin."],
          steps: [
            { h: "Choose the harmony from the character", t: "What's this character like? Calm → analogous cool. Heroic → triadic. Dangerous → complementary with a red accent. Tired → monochromatic with one warm spot. Pick, set it in the wheel, and swatch 5–6 colors in the margin, including a skin tone and a near-black (never pure black — a very dark version of your dominant hue). Write the harmony's name next to the swatches.", tool: "marker", layer: "Colors" },
            { h: "Flat every area", t: "On the Colors layer (under the Inks), fill each garment, the skin, the hair with a single flat color from your palette. No shading, no gradients. Close your ink lines first if you use the Fill tool, or it leaks. Keep most areas LOW saturation; save the saturated swatch. This stage is called 'flats' and in comics it's a job of its own.", tool: "fill", layer: "Colors" },
            { h: "Check the flats in greyscale", t: "Squint. Before any shading, the flats alone should separate the figure into readable value groups: the face lighter than the hair, the shirt different from the trousers, the whole figure different from the background. If two adjacent areas merge when you squint, change the VALUE of one, not its hue.", tool: "marker" },
            { h: "One shadow color per flat", t: "Decide the light (upper left, say). For each flat, make one shadow version: lower value, slightly lower saturation, and shifted a little toward the cooler side of the wheel (Section 4 explains why). Paint shadow shapes with the Marker tool where the form turns away — under the jaw, inside folds, under the arms, the shadow side of every tube. Hard-edged shadow shapes, like a comic; one shadow per flat, no gradients.", tool: "marker" },
            { h: "One accent", t: "Add a single small area of your accent color (the complement, or the brightest saturation) where you want the eye: the eyes, a badge, a weapon grip, a scarf. Only one. That's the focal point, and a character with three accents has none.", tool: "marker" },
            { h: "Judge in greyscale, then save", t: "Squint hard or export and desaturate. Does the figure read in value alone — light face, mid clothes, dark shadows? If the values are muddy, no hue choice will save it; adjust the shadow values and try again. Then save. This character goes into your Portfolio as the Section 3 capstone, and Section 5's Character Design chapter will start by redesigning them.", tool: "marker" },
          ] },
      ],
      reflect: ["Name the harmony you used and the one accent. Could you re-color this character for a night scene using the same rules?", "What's the saturation of the biggest area on your character? If it's high, try it lower and see if the accent gets stronger."] },
    ] },
  ],
});
