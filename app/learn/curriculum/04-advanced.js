/* Curriculum · Section 4 — Becoming Advanced */
"use strict";
window.PENSHI_CURRICULUM = window.PENSHI_CURRICULUM || [];

PENSHI_CURRICULUM.push({
  id: "s4", num: 4, title: "Becoming Advanced",
  tagline: "Deep figure work, mastery of color, and the ability to place anything anywhere in convincing space.",
  chapters: [

  /* ============================================================ */
  { id: "s4-figure", title: "Figure Drawing",
    summary: "Gesture drawing was seconds; figure drawing is minutes to hours on one pose — the same foundation (line of action, bean, mannequin) carried through to a resolved figure with foreshortening, landmarks, and hands and feet that actually work. This chapter is long because there is no shortcut: the figure is learned by drawing hundreds of them from reference. Every lesson here links timed reference tools; use them.",
    lessons: [

    { id: "fig-1", title: "From gesture to figure: the long pose", minutes: 60,
      goal: "Take one pose through every stage — gesture, bean, mannequin, landmarks, contour — in a 20-minute study, and repeat it three times.",
      why: "The long pose is where all previous chapters meet. Beginners skip stages ('I'll just draw the outline'); the discipline of the stages is what makes the drawing hold together. The three repeats are not optional: the third will be dramatically better than the first, and that difference is the lesson.",
      refs: ["proko-figure", "loa-figure", "loa-360", "hampton", "loomis-figure"],
      pages: [
        { title: "The stages", exemplar: "mannequinBoxes",
          hints: ["Line of Action figure tool, timer 20 min, or 360° views for a pose you can rotate.", "Stage 1 (2 min): line of action + bean.", "Stage 2 (5 min): boxes and tubes.", "Stage 3 (5 min): landmarks — pit of neck, nipples, navel, iliac crests, kneecaps.", "Stage 4 (8 min): contour — the outline that follows the forms, heavier on the shadow side."],
          steps: [
            { h: "Stage 1 — gesture (2 minutes)", t: "Line of action, then the bean. Big, light, from the shoulder. Ask: what is this pose DOING? Reaching, resting, bracing? The answer is the line. Do not pass go until the gesture reads.", tool: "pencil", layer: "Pencils" },
            { h: "Stage 2 — mannequin (5 minutes)", t: "Ribcage box tilted with the bean's upper egg, pelvis box with the lower. Neck cylinder, limb tubes on the rhythm lines, joint spheres. Check the plumb line from the pit of the neck — does the figure balance on its support? Fix now; it's cheap.", tool: "pencil" },
            { h: "Stage 3 — landmarks (5 minutes)", t: "Mark the bony landmarks you can see in the reference: pit of the neck, collarbones, sternum, nipples, navel, the iliac crests (hip bones), kneecaps, ankle bones, elbow points, wrist bones. These are the pins the surface hangs from — same idea as fabric.", tool: "pencil" },
            { h: "Stage 4 — contour (8 minutes)", t: "Now the outline — but drawn as the EDGE of the forms you built, never as a separate tracing. Where a form overlaps another, the line of the near form is unbroken. Heavier on the shadow side. Interior lines only where a form clearly turns (the edge of the deltoid, the fold of the elbow).", tool: "ink", layer: "Inks" },
            { h: "Repeat with a new pose, twice", t: "Two more 20-minute poses on new pages (page tab ＋). Same stages, same timings. Put the three side by side. Write on the third page what changed. That note is your curriculum for next week.", tool: "pencil", layer: "Pencils" },
          ] },
      ],
      reflect: ["Which stage did you rush? That's the one that will keep failing until you stop rushing it.", "Did your third figure balance? Did your first?"] },

    { id: "fig-2", title: "Foreshortening", minutes: 60,
      goal: "Draw limbs and torsos aimed toward or away from the viewer using overlap, cross-contours and size change.",
      why: "Foreshortening is the difference between a figure standing in a lineup and a figure punching out of the panel. Comics demand it constantly and most artists avoid it because it 'looks wrong' — it looks wrong because the brain knows the arm is long and refuses to draw it short. Construction overrides the brain.",
      refs: ["proko-figure", "loa-360", "posemaniacs", "loomis-figure", "hampton"],
      pages: [
        { title: "The three cues", exemplar: "foreshorten",
          steps: [
            { h: "Overlap", t: "Draw a cylinder arm pointing sideways, then the same arm pointing at you: upper arm, forearm, hand each OVERLAP the one behind. The overlaps are the single strongest depth cue. Draw three arms at increasing foreshortening — each overlap line clearly in front.", tool: "pencil", layer: "Pencils" },
            { h: "Cross-contours go round", t: "Add contour ellipses to each tube. Sideways: thin ellipses. Toward you: nearly circles. That change in ellipse degree is what tells the eye the tube turned. This is the ellipse drill from Foundations paying off.", tool: "pencil" },
            { h: "Near end bigger", t: "The hand at the end of an arm reaching toward you is BIGGER than the head behind it. Draw it that way even though your brain screams. Then check a reference (Posemaniacs, rotate a pose until an arm points at the camera) — the reference agrees with the construction, not with your brain.", tool: "pencil" },
          ] },
        { title: "Foreshortened figures from reference",
          hints: ["Posemaniacs: rotate any pose until a limb points at the camera. Or Line of Action 360° views.", "Six 10-minute studies. Construction only — no outline until the tubes and overlaps are right.", "Say out loud for every limb: which segment is nearest?"],
          steps: [
            { h: "Reaching poses", t: "Three poses where an arm or leg comes toward the viewer. Build them as tubes with explicit overlap and round cross-contours. Compare each to the reference by measuring: how big is the near hand relative to the head? Match it.", tool: "pencil", layer: "Pencils" },
            { h: "Receding poses", t: "Three poses where a limb goes AWAY — a leg stretched behind, an arm pointed into the distance. The far end is small, overlaps reverse (the near segment covers the far one), and the cross-contours are still rounder than sideways. Receding is harder than reaching; take your time.", tool: "pencil" },
            { h: "Torso foreshortening", t: "One pose seen from above or below (a bird's-eye or worm's-eye view — Posemaniacs lets you tilt the camera). The ribcage box and pelvis box now overlap each other. Whichever is nearer the camera is drawn bigger and overlaps the other. Ink this one.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which cue did you lean on most — overlap, contours, or size? Try a pose using only the one you neglected."] },

    { id: "fig-3", title: "Hands: structure and gesture", minutes: 60,
      goal: "Construct hands as box + wedge + tubes, then draw hands in a dozen functional poses — holding, pointing, gripping, gesturing.",
      why: "Hands are the second most expressive thing in a comic after the face, and the first thing readers notice when they're wrong. The fear of hands comes from treating them as five separate problems; treated as one box with attachments, they become drawable — and then, with practice, expressive.",
      refs: ["loomis-head", "loa-hands", "handy", "posemaniacs", "proko-figure"],
      pages: [
        { title: "The hand block", exemplar: "handBlock",
          steps: [
            { h: "Palm box", t: "Copy the guide: the palm is a box, slightly cupped, about as long as it is wide (a little longer). Draw it at four angles: flat toward you, edge-on, from the back, tilted. The box tells you where the fingers and thumb attach — the fingers from the far edge, the thumb from a side plane.", tool: "pencil", layer: "Pencils" },
            { h: "The thumb wedge", t: "The thumb's base is a wedge (the thenar mass) on the side of the palm box, angled about 45° out. The thumb itself is two tube segments from the wedge's tip. It can swing across the palm — draw the wedge in three positions: out, forward, tucked.", tool: "pencil" },
            { h: "Fingers fan from an arc", t: "The knuckles lie on an arc, not a straight line. Each finger is three tapered tubes; the middle finger is longest, the index and ring about equal, the pinky shortest and set lower. Draw the four fingers straight, then all curled together — they curl on a shared arc.", tool: "pencil" },
            { h: "Proportions", t: "Measure on your own hand: the palm ≈ the middle finger. Each finger's segments shorten toward the tip (roughly 3 : 2 : 1.5). The thumb reaches the middle knuckle of the index finger. Draw a hand from memory and check these.", tool: "pencil" },
          ] },
        { title: "Hands in use",
          hints: ["Line of Action hands tool, 2-minute timer, 12 hands.", "Every hand: palm box → thumb wedge → finger arc → tubes.", "Then the 'holding' set: a cup, a phone, a sword grip, a fist."],
          steps: [
            { h: "Twelve timed hands", t: "Line of Action's hands-and-feet tool, 2-minute timer. Box, wedge, arc, tubes, done. Don't render — construct. After twelve, look for your pattern of error (thumb too short? fingers on a straight line?).", tool: "pencil", layer: "Pencils" },
            { h: "Holding things", t: "Draw your own hand holding: a cup (fingers wrap a cylinder — their arc follows the cup's contour), a phone (thumb opposed, fingers flat), a stick or sword grip (fist around a cylinder — the top of the fist is four knuckles on an arc). The object defines the hand's shape; draw the object's form first.", tool: "pencil" },
            { h: "Gestures", t: "Pointing (one tube extended, the rest curled), an open palm 'stop', a relaxed hanging hand (fingers curl slightly, the pinky most), a fist (knuckle arc on top, thumb across the fingers). These four cover most comic panels.", tool: "pencil" },
            { h: "Hands at angles, in ink", t: "Redraw three of the above from a different angle using the box — from below, from the wrist end, edge-on. Ink them with line weight heavy at the overlaps between fingers. Keep this page: redo it in three months.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Which hand pose still needs a reference? Practice it with the Handy app or Posemaniacs until it doesn't."] },

    { id: "fig-4", title: "Feet, and the figure in motion", minutes: 50,
      goal: "Construct the foot as a wedge with a heel block, then draw full figures walking, running and jumping.",
      why: "Feet ground the figure — a figure with floating feet floats. Motion is what comics are FOR, and motion is just gesture plus foreshortening plus a plumb line that's off-balance on purpose.",
      refs: ["loa-hands", "loa-figure", "posemaniacs", "force", "proko-figure"],
      pages: [
        { title: "The foot", exemplar: "footWedge",
          steps: [
            { h: "Wedge, heel block, toe box", t: "The foot is a long wedge (high at the ankle, low at the toes) sitting on the ground, with a block at the back (the heel) and a small box at the front (the toes). Draw it from the side, then from the front — a wedge pointing at you — then from above.", tool: "pencil", layer: "Pencils" },
            { h: "The arch and the ankle", t: "The inner edge of the foot lifts in an arch; the outer edge lies flat. The inner ankle bone is higher than the outer. Draw both feet from the front and mark these — it's what makes a pair of feet look like a left and a right.", tool: "pencil" },
            { h: "Shoes are feet plus thickness", t: "A shoe is the foot wedge with a sole plate under it and a thicker skin. Draw a foot, then the same foot in a sneaker and in a boot. The boot is a tube added at the ankle.", tool: "pencil" },
          ] },
        { title: "Walk, run, jump",
          hints: ["FORCE book (Library): the rhythm of weight transfer.", "Walking: one foot always down. Running: both feet off the ground at one point. Jumping: the whole figure is one arc.", "Posemaniacs has animation-style poses — use them."],
          steps: [
            { h: "The walk cycle", t: "Draw four positions of a walk: contact (front heel down, back toe down), passing (weight over one foot, other leg swinging), contact, passing. The pelvis rises over the planted leg and the shoulders counter-rotate the hips. The plumb line stays over the support.", tool: "pencil", layer: "Pencils" },
            { h: "The run", t: "Same four positions but the body leans forward, the plumb line falls AHEAD of the feet, arms pump higher, and at 'passing' both feet leave the ground. Exaggerate the lean; comics runs are pushed.", tool: "pencil" },
            { h: "The jump", t: "Crouch (compressed, everything bent), launch (one line of action arcing up), apex (stretched, arms up), land (compressed again). Each is a C or an S. Draw the four as gestures, then build the apex as a full mannequin. Ink it — a jumping figure is a classic comics cover.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["In your run, does the figure look like it's falling forward? Good — that's running.", "Where do your feet touch the ground? Draw the shadow under each to prove it."] },
    ] },

  /* ============================================================ */
  { id: "s4-color", title: "Advanced Color Theory",
    summary: "Color mastery is about RELATIONSHIPS: temperature is relative, grey is never neutral, and a palette means nothing until you know what its harmony does to a reader's mood. This chapter goes deep on temperature, the full set of harmonies, color psychology, and the behavior of greys — with the Tool tab wheel as your lab bench.",
    lessons: [

    { id: "acolor-1", title: "Temperature and relativity", minutes: 50,
      goal: "See color temperature as relative, use warm/cool shifts to model form, and explain why the same grey changes with its neighbors.",
      why: "The single biggest step from beginner to intermediate color is discovering that shadows aren't 'darker' — they're a different TEMPERATURE. Once you shift hue as forms turn from light to shadow, your color stops looking like a coloring book.",
      refs: ["gurney-book", "gurney-blog", "albers", "marco-bucci", "adobe-color"],
      pages: [
        { title: "The same grey, twice", exemplar: "temperature",
          steps: [
            { h: "Copy the experiment", t: "Paint a mid-grey square on a warm orange field and the same grey on a cool blue field. Look: on the orange it reads bluish; on the blue it reads warm. The grey didn't change — its neighbors did. This is Albers' 'interaction of color', and it means NO color has a fixed identity.", tool: "marker", layer: "Colors" },
            { h: "Temperature is a direction on the wheel", t: "Any hue has a warmer neighbor and a cooler one. 'Warmer' means toward orange, 'cooler' means toward blue — from wherever you are. A warm green is yellowish; a cool green is bluish. Swatch three greens: warm, neutral, cool. Then three reds.", tool: "marker" },
            { h: "Light warm, shadow cool (and vice versa)", t: "Sunlight is warm, so surfaces in sunlight shift warm and shadows (lit by the blue sky) shift cool. Under a cool light (overcast, fluorescent, moonlight) it flips: cool lights, warm shadows. Paint a sphere twice: warm-light/cool-shadow, cool-light/warm-shadow. Both are 'correct'; they're different times of day.", tool: "marker" },
            { h: "Model a form with temperature only", t: "Paint a cylinder keeping the VALUE almost constant and shifting only temperature from warm (lit side) to cool (shadow side). It still reads as round. Painters call this 'color modeling' — it's how you keep color rich in shadows instead of muddy.", tool: "marker" },
          ] },
      ],
      reflect: ["Look at a photo of a face in sunlight. Where are the warm areas and where are the cool? (Cheeks and nose warm; jaw shadow and eye sockets cool.)"] },

    { id: "acolor-2", title: "All the harmonies", minutes: 50,
      goal: "Build and apply every major harmony — including split-complementary, tetradic, and accented analogous — and judge which serves a scene.",
      why: "The simple harmonies give you four choices; the full set gives you a palette for any mood. More importantly, knowing them lets you DIAGNOSE a palette that isn't working: usually it's two harmonies fighting, or an accent that isn't really an accent.",
      refs: ["adobe-color", "paletton", "gurney-book", "marco-bucci", "coolors"],
      pages: [
        { title: "The full set", exemplar: "harmonies",
          steps: [
            { h: "Split-complementary", t: "Tool tab wheel → Split-complementary: a base hue plus the two neighbors of its complement. All the punch of complementary with less vibration; the most forgiving harmony there is. Swatch it. Most comics color is secretly split-comp.", tool: "marker", layer: "Colors" },
            { h: "Tetradic (double complementary)", t: "Two complementary pairs — four hues in a rectangle on the wheel. Rich but easy to overload: ONE hue must dominate, one supports, two accent. Swatch four, then repaint your mug with a tetrad where blue leads.", tool: "marker" },
            { h: "Accented analogous", t: "Three neighbors plus the complement of the middle one as a spark. The most used palette in film and animation posters — cohesive with one point of fire. Swatch it: three teals and one orange.", tool: "marker" },
            { h: "Compare on one scene", t: "Draw a simple scene (a figure in a doorway) and color it three times: complementary, split-complementary, accented analogous. Which is calm? Which is tense? Which makes the figure pop? Label them.", tool: "marker" },
          ] },
        { title: "Diagnosing a bad palette",
          hints: ["Take an old colored drawing of yours (Portfolio) or a screenshot of any image with colors you dislike.", "Sample its colors with Alt+click and plot them on the wheel.", "Is there a harmony? A dominant? An accent — or five accents?"],
          steps: [
            { h: "Plot the colors", t: "Alt+click sample the four or five main colors from the image and, for each, look at where the Tool tab wheel puts it. Sketch the wheel in the margin and dot the positions. Do they form any harmony? Random scatter usually means the palette 'feels off' and nobody knows why.", tool: "marker", layer: "Colors" },
            { h: "Find the fight", t: "Two hues opposite each other at equal weight are fighting for attention. Three saturated hues at equal weight are shouting. The fix is almost always hierarchy: one leads (60–70%), one supports, one accents (under 10%).", tool: "marker" },
            { h: "Repaint with hierarchy", t: "Re-color the image (or a copy of your drawing) enforcing the hierarchy — desaturate the supporters, cut the accent to one small area. Compare before/after in the Portfolio.", tool: "marker" },
          ] },
      ],
      reflect: ["Which harmony would you use for a funeral scene? A carnival? A tense standoff? Write your answers with the reasons."] },

    { id: "acolor-3", title: "Color psychology and story", minutes: 45,
      goal: "Use color to convey mood, character and story beats — and know where those associations come from and where they break.",
      why: "Readers respond to color before they read a word. Comics colorists control emotion page by page: a warm palette for safety, a sickly green for dread, a single red object in a grey scene. But associations are cultural and contextual — red is danger AND love AND luck — so the tool is contrast and consistency, not a dictionary.",
      refs: ["gurney-book", "framed-ink", "marco-bucci", "gurney-blog"],
      pages: [
        { title: "Mood boards",
          hints: ["Six small rectangles. Each is a 'scene' colored for one mood: safe, dread, romance, action, mystery, grief.", "No drawing needed — just three to five color areas per rectangle: sky/background, ground, figure, accent.", "Note WHY each color choice — temperature? saturation? value?"],
          steps: [
            { h: "Safe and dread", t: "Safe: warm, mid-saturation, mid-to-high value, analogous. Dread: cool or sickly (yellow-green), low saturation except one wrong note, low value, high contrast. Paint both rectangles as abstract color fields. The associations here are physical — warmth, daylight versus cold, dimness.", tool: "marker", layer: "Colors" },
            { h: "Romance and action", t: "Romance: warm pinks/reds at low contrast, soft value transitions. Action: high saturation complementary (orange/blue is the cinema cliché for a reason), high contrast. Paint both. Notice that action uses the SAME orange/blue as many 'safe' sunsets — context and contrast, not the hue alone.", tool: "marker" },
            { h: "Mystery and grief", t: "Mystery: desaturated cool with deep blacks and one warm light source (a lamp, a window). Grief: near-monochrome, low saturation, muted warm greys — color drained out. Paint both.", tool: "marker" },
            { h: "One scene, two moods", t: "Draw one simple panel (a figure at a window). Color it 'safe' and 'dread' with the same drawing. Everything a colorist does is in that pair.", tool: "marker" },
          ] },
        { title: "Color as a story device",
          hints: ["Comics tricks: a color motif for a character; a palette shift at a story turn; a single saturated object in a desaturated scene.", "Design a 4-panel sequence's palette: panels 1–3 one harmony, panel 4 a shift."],
          steps: [
            { h: "Character motif", t: "Give a character a signature color that appears in every scene they're in — on their clothes, in the light around them, in a prop. Sketch three tiny panels with the character in different settings; the motif persists. Readers will feel the character's presence before recognizing them.", tool: "marker", layer: "Colors" },
            { h: "The palette shift", t: "Thumbnail a four-panel strip: three panels in an analogous cool harmony, the fourth suddenly warm complementary. The shift IS the story beat — a reveal, an arrival, a memory. No dialogue needed.", tool: "marker" },
            { h: "The isolated saturation", t: "A grey scene with one saturated red object (Schindler's List's coat). Draw a crowd scene in desaturated blues; give one figure a saturated coat. That's a focal point stronger than any composition trick.", tool: "marker" },
          ] },
      ],
      reflect: ["Pick a comic or film you love. What's the palette of its happiest scene and its darkest? Sketch both as color fields."] },

    { id: "acolor-4", title: "The life of grey", minutes: 40,
      goal: "Mix and use chromatic greys — greys with a hue leaning — and understand how surroundings shift them.",
      why: "Pure neutral grey almost never exists in a good image. Every 'grey' leans warm or cool, and that lean is what makes shadows breathe and skies glow. Mastering grey is mastering the 80% of any picture that isn't the saturated accent.",
      refs: ["gurney-book", "albers", "gurney-blog", "marco-bucci"],
      pages: [
        { title: "Chromatic greys", exemplar: "temperature",
          steps: [
            { h: "Make greys from complements", t: "In the Tool tab wheel, pick a blue at very low saturation — that's a cool grey. Pick its complement (orange) at very low saturation — a warm grey. Swatch a row from warm grey to cool grey with neutral in the middle. All of them are 'grey'; none of them is the same.", tool: "marker", layer: "Colors" },
            { h: "Grey takes on its opposite", t: "Put your neutral grey swatch next to a saturated red: it looks greenish. Next to green: it looks pinkish. Next to yellow: violet-ish. The eye 'pushes' a neutral toward the complement of its neighbor (simultaneous contrast). Paint the four pairs.", tool: "marker" },
            { h: "Greys carry the light", t: "Paint a simple interior — wall, floor, window — using ONLY chromatic greys: warm greys where the window light lands, cool greys in the shadows, one slightly saturated color for the light source. It will look richly colored. Most masterful color is exactly this.", tool: "marker" },
            { h: "Grey against saturation", t: "The rule of thumb: saturation is a budget. Spend most of it on greys (low), so your one saturated accent can be loud. Repaint the interior with a single saturated object (a red chair) and watch the greys make it sing.", tool: "marker" },
          ] },
      ],
      reflect: ["Look at a photo of an overcast day. How many different greys can you name by temperature?"] },
    ] },

  /* ============================================================ */
  { id: "s4-persp", title: "Advanced Perspective",
    summary: "Place ANYTHING anywhere in convincing space: two- and three-point mastery, perfect ellipses and cylinders at any angle, figures dropped into a scene at the right scale, mirrored and repeated objects, and atmospheric perspective for distance. This is technical, patient work — and it's what separates a drawing of a thing from a drawing of a world.",
    lessons: [

    { id: "apersp-1", title: "Two-point mastery: measuring and repeating", minutes: 55,
      goal: "Use measuring points and diagonals to place, space and repeat objects accurately in two-point perspective.",
      why: "Eyeballing works until you need a colonnade of equally spaced columns, or a row of identical windows receding down a street. Then you need the geometry — and once you know it, you can lay out a whole city block in an hour.",
      refs: ["scott-robertson", "norling", "storey", "chelsea"],
      pages: [
        { title: "Equal spacing in depth", exemplar: "persp2ptBox",
          steps: [
            { h: "The diagonal trick, two-point", t: "Draw a two-point box (grid on: 2 VPs). Draw the diagonals of its front face to find the center. A vertical through the center splits the face in half in perspective. Now draw a diagonal from a top corner through the midpoint of the FAR edge and extend it until it hits the base line: that's where the NEXT identical box's edge goes. Repeat for a row of five.", guide: { persp: true, vps: 2 }, tool: "pencil", layer: "Pencils" },
            { h: "Windows down a wall", t: "Use the same trick on a long wall to place six identical windows, spacing tightening as they recede. Each window's top and bottom aim at the wall's VP; each side is vertical.", tool: "pencil" },
            { h: "Transfer a height", t: "To give a distant object the same height as a near one: draw a line from the near object's top toward the VP and a line from its base toward the VP. Anything between those lines at any depth is 'the same height'. Place three figures of equal height at different depths this way.", tool: "pencil" },
          ] },
        { title: "Mirroring and stacking",
          hints: ["Symmetric objects (a car, a chair, a face) are mirrored across a center plane.", "Find the center plane's diagonals in perspective, then reflect points across it.", "Stack: a box on a box on a box shares VPs and the vertical."],
          steps: [
            { h: "Mirror across a center line", t: "Draw a two-point box and a shape on its left face (a window). To mirror it onto the right side of the same face: find the face center with diagonals, then measure the window's distance from the center along the receding edge and duplicate it on the other side using a diagonal transfer. The mirrored window is smaller — correctly.", guide: { persp: true, vps: 2 }, tool: "pencil", layer: "Pencils" },
            { h: "A symmetric object", t: "Construct a simple chair in two-point: a seat box, four leg tubes at the corners, a back plane. The left legs mirror the right across the seat's center line. This is the method for cars, robots, buildings, thrones.", tool: "pencil" },
            { h: "Stack a tower", t: "Boxes on boxes, each smaller, all on one vertical axis, all sharing VPs. Add a cylinder (a tank) on top using the ellipse-in-a-square method. Ink the tower with heavier lines at the base — weight sits low.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Did your row of five boxes stay equal? Extend their tops — do the lines converge to the same VP?"] },

    { id: "apersp-2", title: "Three-point and extreme angles", minutes: 50,
      goal: "Draw dramatic looking-up and looking-down shots with a third vanishing point, and know when to use them.",
      why: "Three-point is the superhero angle: a hero on a rooftop seen from the street, a city seen from a falling body. It's also the easiest way to make a panel feel dynamic — and the easiest to overuse. Learn it precisely so you can deploy it deliberately.",
      refs: ["scott-robertson", "chelsea", "norling", "framed-ink"],
      pages: [
        { title: "The third point", exemplar: "persp3pt",
          steps: [
            { h: "Worm's-eye: VP3 above", t: "Grid on, 3-point. Drag VP3 high above the page. Now verticals are no longer parallel — they converge UP. Draw a tower: its base is wide, its top narrow, its side edges aim at VP3 while its horizontal edges still aim at VP1 and VP2 on the horizon.", guide: { persp: true, vps: 3 }, tool: "pencil", layer: "Pencils" },
            { h: "Bird's-eye: VP3 below", t: "Drag VP3 far below the page. Verticals converge DOWN. Draw a building seen from above: the roof is big, the base shrinks toward VP3. Add a tiny figure on the street — its verticals also aim at VP3.", tool: "pencil" },
            { h: "Distance controls drama", t: "Draw the same tower with VP3 close to the page (extreme, vertiginous) and far from it (gentle, almost two-point). The distance is the dial. Comics use the extreme version for one panel per issue, not every panel.", tool: "pencil" },
            { h: "A figure in three-point", t: "Draw a mannequin standing on the tower's roof, seen from below: the figure is also three-point — the legs are big, the head is small, the torso box converges up. Ink it. This is the classic hero shot.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["When would a story need three-point and when would it distract? Name a scene for each."] },

    { id: "apersp-3", title: "Perfect circles, cylinders and figures in space", minutes: 55,
      goal: "Construct ellipses correctly at any angle (wheels, arches, barrels) and drop figures into a scene at exact scale.",
      why: "Wheels are where car drawings die and arches are where architecture drawings die: a slightly wrong ellipse is instantly visible. Scott Robertson's method — ellipse minor axis = the cylinder's axis, and the ellipse sits in a perspective square — is precise and learnable.",
      refs: ["scott-robertson", "norling", "drawabox", "loa-env"],
      pages: [
        { title: "Ellipses at any angle", exemplar: "circleInPersp",
          steps: [
            { h: "Minor axis = the axle", t: "A wheel is an ellipse whose MINOR axis points along the axle. Draw an axle line aimed at a VP; at its end draw an ellipse whose minor axis lies on the axle. Draw a second wheel further along the same axle: same rule, smaller, slightly different degree. That's a car's wheelbase — get this and the car works.", guide: { persp: true, vps: 2 }, tool: "pencil", layer: "Pencils" },
            { h: "Ellipse in a perspective square", t: "For a horizontal circle (a table, a manhole, a fountain), draw the perspective square first, diagonals for center, then fit the ellipse to the four midpoints. Three at different depths. Then a VERTICAL square on a wall for an arch or a clock.", tool: "pencil" },
            { h: "Cylinders on their side", t: "A barrel lying on the ground: an axle aimed at a VP, an ellipse at each end whose minor axes are on the axle, connected by lines. Draw a pile of three barrels. Then a pipe bending 90° (two cylinders meeting with a curved seam).", tool: "pencil" },
          ] },
        { title: "Figures dropped into a scene",
          hints: ["Grid on. Build a simple street in two-point.", "Place figures at 4 depths using the height-transfer method — eyes on the horizon if standing and your height.", "Then one figure sitting, one on a step, one far away."],
          steps: [
            { h: "The horizon does the work", t: "For standing figures of your own height, their EYES touch the horizon wherever they stand. Draw four figures at four depths; sizes come out automatically. A child's eyes sit below the horizon; someone on a box, above it.", guide: { persp: true, vps: 2 }, tool: "pencil", layer: "Pencils" },
            { h: "Transfer a height off the ground", t: "A figure sitting on a wall: draw a standing figure at that depth first (eyes on the horizon), then 'cut off' the height of the wall using the height-transfer lines, and build the sitting figure at that scale. Never guess a distant figure's size — transfer it.", tool: "pencil" },
            { h: "Mannequins, not stick figures", t: "Build two of the figures as full mannequins whose boxes obey the scene's VPs (the ribcage box converges to the same VPs as the buildings). Ink the scene. This page proves you can put anyone anywhere.", tool: "ink", layer: "Inks" },
          ] },
      ],
      reflect: ["Are all your standing figures' eyes on the horizon? That single check catches most scale errors."] },

    { id: "apersp-4", title: "Atmospheric perspective and depth without lines", minutes: 40,
      goal: "Convey distance through value, contrast, edge softness and temperature — the perspective of AIR.",
      why: "Linear perspective is geometry; atmospheric perspective is physics — the air between you and a distant hill scatters light, lifting values, cooling hues and softening edges. Landscapes, cityscapes and any deep background need it, and it's the cheapest depth you'll ever draw.",
      refs: ["gurney-book", "gurney-blog", "nasa-eo", "fzd"],
      pages: [
        { title: "Bands of distance", exemplar: "atmospheric",
          steps: [
            { h: "Four bands", t: "Copy the guide: four overlapping hill silhouettes. Nearest: darkest, most contrast, crispest edge, warmest. Farthest: lightest, lowest contrast, softest, coolest. Use the Marker tool at decreasing opacity per band.", tool: "marker", layer: "Colors" },
            { h: "Detail falls off", t: "Add texture (trees, rocks) to the nearest band with the Ink tool. Add half as much to the second band, a hint to the third, none to the fourth. Detail is a depth cue as strong as size.", tool: "ink", layer: "Inks" },
            { h: "Temperature shift", t: "Repaint the bands in color: warm brown-greens near, shifting to grey-blue far. Even a fantasy scene obeys this — the air is still air. Compare with a NASA Earth Observatory photo of mountains.", tool: "marker", layer: "Colors" },
            { h: "Combine with linear", t: "On a new page, draw a road in one-point perspective with telephone poles receding (diagonal spacing trick) — then apply atmospheric perspective: the far poles are lighter, softer, cooler. Both systems together are what a real scene looks like.", guide: { persp: true, vps: 1 }, tool: "marker" },
          ] },
      ],
      reflect: ["Look out a window. How many bands of distance can you see, and what changes between each?"] },
    ] },
  ],
});
