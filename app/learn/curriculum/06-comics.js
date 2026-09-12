/* Curriculum · Section 6 — Comics Craft (added: bridges the drawing
   curriculum to Penshi's actual purpose — making comics) */
"use strict";
window.PENSHI_CURRICULUM = window.PENSHI_CURRICULUM || [];

PENSHI_CURRICULUM.push({
  id: "s6", num: 6, title: "Comics Craft",
  tagline: "Everything you've learned to draw, put to work telling a story in panels — using Penshi's panel, balloon and layer tools.",
  chapters: [

  { id: "s6-story", title: "Storytelling in Panels",
    summary: "Comics are a language: panels are moments, gutters are time, and the reader's eye is the camera. This chapter uses Penshi's panel templates and balloon tools to teach page layout, panel transitions, pacing and lettering — the craft vocabulary comes from Scott McCloud, and the Craft tab's reference lessons expand every topic here.",
    lessons: [

    { id: "com-1", title: "Panels, gutters and transitions", minutes: 45,
      goal: "Lay out a page with a template, then thumbnail a six-panel sequence using at least three of McCloud's transition types.",
      why: "A page is not six drawings — it's one composition read in order, where the gaps between panels do as much work as the panels. Choosing the transition type (moment-to-moment, action-to-action, scene-to-scene…) is choosing the pace.",
      refs: ["mccloud", "framed-ink", "chelsea"],
      pages: [
        { title: "Thumbnails on a template", exemplar: "panelFlow",
          steps: [
            { h: "Apply a template", t: "Guides tab → panel templates → choose the 6-grid. Notice the gutters (the Guides tab slider sets their width). Copy the Z-path from the guide: this is the order the reader's eye travels. Every panel should hand the eye to the next.", tool: "pencil", layer: "Pencils" },
            { h: "A six-panel beat", t: "Script a tiny scene in the margin: someone waits, someone arrives, something changes. Thumbnail it in the six panels as stick figures and shapes — no detail. Use at least: one action-to-action, one subject-to-subject, one aspect-to-aspect transition (Craft tab explains each).", tool: "pencil" },
            { h: "Vary the shots", t: "Assign each panel a camera: establishing wide, medium, close-up, extreme close-up, low angle, high angle. Six panels, six different shots — a page of identical talking heads is a dead page. Redraw the thumbnails with the shots.", tool: "pencil" },
            { h: "Break the grid", t: "Merge two panels for the big moment (the reveal). One larger panel among small ones controls pace: the reader's eye slows down where the panel is bigger. Redraw the layout with one merged panel using the Panel tool.", tool: "panel" },
          ] },
      ],
      reflect: ["Read your page with a finger. Did the eye ever get lost? Where?"] },

    { id: "com-2", title: "Lettering and balloons", minutes: 40,
      goal: "Place speech, thought, caption and SFX with correct reading order, tail direction and word count, using Penshi's balloon tools.",
      why: "Lettering is the part readers notice only when it's wrong: tails pointing at the wrong person, balloons read out of order, a wall of text. Comics pros place balloons BEFORE finishing the art so words and pictures never fight.",
      refs: ["mccloud", "chelsea"],
      pages: [
        { title: "Balloons on the thumbnails",
          hints: ["Speech balloon tool: drag, type, then drag the tail to the speaker's mouth.", "Reading order: left-to-right, top-to-bottom — the first speaker's balloon is higher-left.", "Under 25 words per balloon."],
          steps: [
            { h: "Place balloons first", t: "On your six-panel thumbnail page, add the dialogue with the Speech Balloon tool before drawing any finished art. Position each so it doesn't cover a face and reads in the right order. Drag every tail to the speaker's mouth.", tool: "balloon" },
            { h: "Captions and thoughts", t: "A Caption for narration ('LATER…') in the panel corner; a Thought balloon for interior voice. Notice the different shapes mean different things to the reader without a single word of explanation.", tool: "caption" },
            { h: "SFX as art", t: "A sound effect with the Burst tool — big, integrated into the composition, its shape matching the sound (jagged for a crash, round for a boom). SFX are part of the drawing, not stuck on top.", tool: "burst" },
            { h: "Edit for length", t: "Count words in each balloon. Over 25? Split it into two linked balloons or cut. Comics dialogue is compressed — every word costs panel space.", tool: "select" },
          ] },
      ],
      reflect: ["Cover the art. Can the balloons alone be read in the right order?"] },

    { id: "com-ink", title: "Line quality and inking tools", minutes: 50,
      goal: "Produce the four line families (uniform, swelling, tapered, broken) on purpose with Penshi's Ink tool, understand which traditional tool each imitates, and ink one drawing three ways to hear the difference in 'voice'.",
      why: "Two inkers can ink the same pencils and make two different comics: one crisp and architectural, one loose and alive. The difference is line quality: how the line starts, swells, tapers and breaks. Traditional inkers get it from the physics of a nib or a brush; digitally you get it from pressure and speed, which means you have to CHOOSE it. This lesson gives you the vocabulary and the control so the choice is yours.",
      refs: ["alphonso-dunn", "etherington", "janson-inking", "ctrlpaint", "mccloud"],
      pages: [
        { title: "Four line families", exemplar: "nibStrokes",
          steps: [
            { h: "Uniform: the fineliner", t: "Set the Ink tool small and hold light, even pressure. Draw a row of ten long lines with no variation at all: this is the technical pen, the tool for panel borders, backgrounds, machinery and anything that should feel measured rather than felt. Notice it takes discipline to keep the pressure flat with a stylus. That discipline is a skill in itself.", tool: "ink", layer: "Inks" },
            { h: "Swelling: the dip nib", t: "A steel nib is thin when pushed and fat when pulled with pressure, so its natural mark is thin-thick-thin. Draw ten strokes that start light, press hardest in the middle of the curve and lift off light, like the guide's second line. Then a row of short ones. Nib lines suit faces, hands and folds: the swell lands where the form turns.", tool: "ink" },
            { h: "Tapered: the brush", t: "A brush starts fat and whips to a hair as it lifts. Draw the guide's third line: heavy pressure at the start, then speed up and lift so the line tapers to nothing. Twenty of these, both directions. This is the classic comics line (most superhero and manga inks are brush or brush-pen) because the taper says 'energy' without any extra marks.", tool: "ink" },
            { h: "Broken: dry brush", t: "Move fast with low pressure and let the line skip: grit, speed lines, rough texture, the dust on a road. Draw the fourth row. Broken lines are seasoning, not the meal; used everywhere they turn the page into noise.", tool: "ink" },
            { h: "Corners and joins", t: "Draw a box with each family. Where two lines meet, uniform lines just touch; nib lines swell into the corner; brush lines overshoot slightly and taper past it (the 'flick'). A sloppy join reads as hesitation. Practice twenty corners with the brush taper until the flick is deliberate.", tool: "ink" },
          ] },
        { title: "One drawing, three voices",
          hints: ["Pencil a simple head-and-shoulders on the Pencils layer (or reuse Head-2).", "Ink it three times on the Inks layer, using the page tabs or three areas: all uniform, all nib, all brush.", "Hide the Pencils layer and compare."],
          steps: [
            { h: "Pencil it once", t: "A three-quarter head with a collar, loosely constructed, a little bigger than a hand. This is the pencil an inker receives. Duplicate it by drawing it three times across the page (or add two pages), because you will ink it three ways.", tool: "pencil", layer: "Pencils" },
            { h: "Ink it as a fineliner", t: "Uniform line only. Get depth from line SPACING (hatching density) since weight is off the table. This is the voice of ligne claire (Hergé) and much of European comics: clean, calm, everything equally in focus.", tool: "ink", layer: "Inks" },
            { h: "Ink it with the nib swell", t: "Every contour thin-thick-thin, the swell where the form turns away from the light, thin where it faces it. Hatching from short nib strokes that fatten toward the shadow. This is the voice of classic pen-and-ink illustration and a lot of horror comics: precise but alive.", tool: "ink" },
            { h: "Ink it with the brush", t: "Big tapered strokes, the outline heaviest, the interior detail a few flicks, the shadow side spotted black. Fewer lines than the other two. This is the mainstream comics voice: fast, energetic, reads at any size. Hide Pencils and put the three side by side. Write under each what it makes the character feel like.", tool: "ink" },
            { h: "Pick a voice for your book", t: "You don't need to choose forever, but you need to choose per project: mixing all three on one page reads as indecision. Decide the dominant family for your comic and the one secondary family allowed (brush contours with fineliner backgrounds is the most common pairing). Write the rule in the margin and keep it for Com-3 and Com-4.", tool: "ink" },
          ] },
      ],
      reflect: ["Which family did your hand do by default? Which one felt foreign? The foreign one is where a week of warm-ups pays off most.", "Look at three comics you own. Name each artist's dominant line family."] },

    { id: "com-3", title: "Inking for print: line weight and blacks", minutes: 50,
      goal: "Ink a finished panel with deliberate line weight, spotted blacks and hatching that reads at print size.",
      why: "Comics are printed in black. Line weight carries depth (near = heavy), spotted blacks carry composition, hatching carries tone — and it all has to survive being reduced 60% on the page. This is the Shading chapter applied to the medium.",
      refs: ["framed-ink", "mccloud", "ctrlpaint"],
      pages: [
        { title: "Line weight", exemplar: "lineWeights",
          steps: [
            { h: "Four weights", t: "Copy the four lines: hairline (far, light, detail), medium (most contours), heavy (near edges, shadow-side), and solid black (spotted shadows). Draw the cube with these rules: heavy where the form faces away from light, thin on the lit side, heaviest where it meets the ground.", tool: "ink", layer: "Inks" },
            { h: "Ink a thumbnail panel", t: "Pick your best thumbnail from Com-1, redraw it at full panel size in pencil, then ink with the four weights. Outline of the figure heavier than lines inside it. Background lighter than foreground.", tool: "ink" },
            { h: "Spot the blacks", t: "Decide where the solid black shapes go — the shadow side of the figure, a dark doorway, a silhouette. Blacks should form a pleasing shape across the panel on their own. Squint: the blacks should lead the eye to the focal point.", tool: "ink" },
            { h: "Reduce and check", t: "Zoom out to 25%. Does the panel still read — figure, action, focal point? Lines that vanish were too thin; hatching that turns to mud was too dense. Fix, then export the page. This is your first print-ready panel.", tool: "ink" },
          ] },
      ],
      reflect: ["At 25% zoom, what disappeared? That's your line-weight lesson for next time."] },

    { id: "com-4", title: "A complete one-page comic", minutes: 90,
      goal: "Script, thumbnail, pencil, ink, letter and color a one-page comic using your Section 5 character, in Penshi's full pipeline.",
      why: "This is the point of everything. One finished page — start to end, on the real layer pipeline — teaches more about making comics than any amount of study, and it becomes the first entry in a body of work.",
      refs: ["mccloud", "framed-ink", "chelsea"],
      pages: [
        { title: "Script and thumbnails",
          hints: ["Script: 5–7 panels, one small event with a turn at the end.", "Thumbnail on a template. Balloons in place. Shot variety. One big panel."],
          steps: [
            { h: "Script in the margin", t: "Write it in eight lines: who, where, what they want, what stops them, the turn. Your Section 5 character in your Section 5 world, if you have them.", tool: "pencil", layer: "Pencils" },
            { h: "Thumbnail and letter", t: "Template, panels, balloons placed with tails aimed. Shot variety. This page is the plan; keep it as page 1 of the attempt.", tool: "balloon" },
          ] },
        { title: "Pencils and inks",
          hints: ["Page tab ＋ for the finished page. Same template.", "Pencils: construction (mannequins, perspective grids) in blue.", "Inks: line weight, spotted blacks, hatching.", "Toggle Pencils off before export."],
          steps: [
            { h: "Pencil every panel", t: "Construction only — mannequins from gesture, boxes for the room, the perspective grid on where needed. Use everything: heads on balls, hands as boxes, folds from pins. It's fine if it takes two sessions.", tool: "pencil", layer: "Pencils" },
            { h: "Ink", t: "Commit each panel with the line-weight rules. Spot blacks across the whole page so they form a rhythm. Panel borders last (the Panels layer is already crisp).", tool: "ink", layer: "Inks" },
            { h: "Color (or don't)", t: "Flats on the Colors layer with a harmony chosen for the page's mood, one accent for the turn in the last panel. Or leave it black and white — a strong ink page needs no color. Toggle Pencils off, Export PNG. Save to the Portfolio.", tool: "fill", layer: "Colors" },
          ] },
      ],
      reflect: ["You made a comic. What's the first thing you'd change? Write it down — then start page two."] },
    ] },
  ],
});
