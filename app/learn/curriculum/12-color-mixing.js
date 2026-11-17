/* Curriculum · Mixing and blending: light, paint and edges.
   A new lesson at the end of Advanced Color Theory, so saved progress
   keeps its place. Steps set Colour mixing (`mix:`); the lesson puts the
   student's own setting back when it closes. */
"use strict";

(() => {
  const each = fn => { for (const s of PENSHI_CURRICULUM) for (const c of s.chapters) fn(c); };
  const addLesson = (chapterId, lesson) => each(c => { if (c.id === chapterId && !c.lessons.some(l => l.id === lesson.id)) c.lessons.push(lesson); });
  const colors = { layer: "Colors" };

  addLesson("s4-color", {
    id: "acolor-5", title: "Mixing and blending: light, paint and edges", minutes: 150,
    goal: "Mix colours the way light does and the way paint does, find every colour between two others, and control the edges where colours meet.",
    why: "Every colour on a screen is made of light, and every printed or painted colour is made of pigment, and the two mix by opposite rules. Knowing which rule you are using tells you what an overlap will do before you make it. Painters also mix on the page itself, in strings of steps, in thin glazes and in the edges between colours, and those edges decide where the eye goes. Penshi's Colour mixing setting paints by both rules, so you can practise them directly.",
    refs: ["gurney-book", "gurney-blog", "marco-bucci", "albers", "ctrlpaint"],
    pages: [
      { title: "Light adds, paint subtracts", exemplar: "mixLightPigment", layers: ["Dark ground"],
        hints: ["Light: red + green = yellow; all three = white.", "Paint: cyan + yellow = green; all three = a dark mud."],
        steps: [
          { h: "Two sets of circles", level: 1, mix: "off", tool: "pencil", layer: "Pencils", t: "Trace the six circles lightly, or draw two sets of three overlapping circles of your own in your space. The left set will be lamps shone on a dark wall; the right set, paints on white paper. The shapes are the same; the rules are opposite." },
          { h: "A dark wall", level: 2, mix: "off", tool: "ink", layer: "Dark ground", t: "This page has an extra layer, Dark ground, under Colors, and you are on it. Set the ink pen to about size 60 and paint a dark patch over your left set of circles. Coloured light only shows against dark." },
          { h: "Three lamps", level: 2, mix: "light", tool: "ink", ...colors, t: "Colour mixing is now Light (Tool tab), and you are on Colors. With the ink pen at full opacity, fill your left circles with pure red, pure green and pure blue (type #ff0000, #00ff00 and #0000ff into the colour box). Where two overlap you get yellow, cyan and magenta, and the middle turns white. Check against the guide." },
          { h: "Three paints", level: 3, mix: "pigment", tool: "ink", ...colors, t: "Colour mixing is now Pigment. Fill your right circles with cyan, magenta and yellow (you can sample them from the guide with the colour box). Each overlap mixes half and half: green, a red-orange, a blue-violet, and a dark mud in the middle. Then paint blue and yellow side by side in both modes, as in the guide's bottom rows: as light they make white, as paint, green." },
        ] },
      { title: "A mixing chart", exemplar: "mixChart",
        hints: ["One pass of the ink pen at full opacity in Pigment mode mixes half and half.", "Compare each square with its mirror across the diagonal."],
        steps: [
          { h: "Six paints", level: 1, mix: "off", tool: "ink", ...colors, t: "Rule a six-by-six grid in your space (the line tool helps) and paint the six colours down its diagonal with Colour mixing off: red, yellow, blue, white, black, brown. The guide's diagonal has the exact colours if you want to sample them." },
          { h: "Mix every pair", level: 2, mix: "pigment", tool: "ink", ...colors, t: "Colour mixing is now Pigment. In each square above the diagonal, paint the row's colour, then the column's colour over it with the ink pen at full opacity: one pass mixes them half and half. Fill the whole upper triangle, then compare with the guide square by square." },
          { h: "Paint against plain blending", level: 3, mix: "pigment", tool: "pencil", layer: "Pencils", t: "Level 3 fills the squares below the diagonal with a plain average of the same two colours' numbers. Compare each square with its mirror across the diagonal and circle the three pairs that differ most. Blue and yellow is the famous one; look at what white does to red as well." },
          { h: "Your own palette", level: 3, mix: "pigment", tool: "ink", ...colors, t: "Hide the guides. Choose four colours your comic actually uses and make a four-by-four chart of them in Pigment mode. Keep it: it is a map of every colour your palette can reach by mixing." },
        ] },
      { title: "Strings", exemplar: "mixStrings",
        hints: ["One pass at full opacity mixes half and half; at 33%, one part in six.", "Complements cross through grey."],
        steps: [
          { h: "The ends", level: 1, mix: "off", tool: "ink", ...colors, t: "Copy the six rows of seven boxes in your space and paint the two end colours of each row with Colour mixing off." },
          { h: "Five steps between", level: 2, mix: "pigment", tool: "ink", ...colors, t: "Colour mixing is now Pigment. For the boxes nearer the left end, paint the left colour and then the right colour over it; nearer the right end, the other way round. With the ink pen, one pass at full opacity mixes half and half, and at 33% it mixes in one part in six. So working in from the left, the second box needs 33%, the third 67%, the middle box 100%; then the same from the right." },
          { h: "Find the greys", level: 3, mix: "pigment", tool: "pencil", layer: "Pencils", t: "In the three complement rows, find the box with the least colour in it and circle it; level 3 rings the guide's answer. Complements pass through grey on the way across, not through any brighter colour, and that grey still leans a little toward one end." },
          { h: "A string for your character", level: 3, mix: "pigment", tool: "ink", ...colors, t: "Hide the guides. Take a main colour from one of your own characters and its complement, and paint a seven-step string between them. Mark the step you would use for that colour's shadow: a little of the complement darkens and calms a colour without turning it black." },
        ] },
      { title: "Edges", exemplar: "blendEdges",
        hints: ["Hard, soft, lost, broken.", "Keep the hardest edge at the focal point."],
        steps: [
          { h: "Hard", level: 1, mix: "off", tool: "oil", ...colors, t: "Copy the four strips in your space. On the first, paint orange on the left and blue on the right with the oil brush at Wetness 0, so the two colours simply meet." },
          { h: "Soft and lost", level: 2, mix: "pigment", tool: "oil", ...colors, t: "Colour mixing is now Pigment. Paint the two colours on the second and third strips, then raise Wetness to 70% or more and brush back and forth across the join: over a short distance for a soft edge, over half the strip for a lost one. Compare with the guide." },
          { h: "Broken", level: 2, mix: "pigment", tool: "oil", ...colors, t: "On the fourth strip, set Paint load to about 15% and drag each colour across the join in a few quick strokes, so the brush runs dry and breaks into streaks over the other colour." },
          { h: "All four on one ball", level: 3, mix: "pigment", tool: "oil", ...colors, t: "Level 3 is a ball that uses all four. Copy it in your space: a hard edge where its cast shadow meets the ball, a soft turn from light into shadow, the shadow side lost into a dark wall of nearly the same value, and a few broken streaks where the lit rim meets the wall." },
        ] },
      { title: "Layers of paint", exemplar: "glazeScumble",
        hints: ["Glaze: thin and see-through. Scumble: light, broken, over dark.", "Dots mix in the eye as light."],
        steps: [
          { h: "The first layers", level: 1, mix: "off", tool: "oil", ...colors, t: "Paint the first layer of each panel in your space with Colour mixing off: yellow and ochre stripes, a dark blue-grey block, a patch of small touching red and yellow squares, and four red boxes." },
          { h: "Glazes", level: 2, mix: "pigment", tool: "ink", ...colors, t: "Colour mixing is now Pigment. With the ink pen at about 60% opacity, glaze blue over the right half of the stripes in one pass: the stripes stay visible and only the colour shifts. Then glaze green over three of the red boxes at 20%, 40% and 60%: the red greys without getting much darker." },
          { h: "Scumble", level: 2, mix: "off", tool: "oil", ...colors, t: "Switch to a pale cream colour and set the oil brush's Paint load to about 15%. Scrub lightly over most of the dark block, keeping the brush moving, so the paint breaks up and the dark shows through between the strokes." },
          { h: "From across the room", level: 3, mix: "off", tool: "ink", ...colors, t: "Zoom out with the mouse wheel or a pinch until the squares stop looking like squares. Level 3 shows what the eye makes of them, beside the same two colours mixed as paint: the eye's mix is brighter, because it mixes them as light. Then hide the guides and use one of the four techniques on a small study of your own." },
        ] },
    ],
    reflect: ["Your screen mixes light and your printer mixes ink. Which of your colours changed most when printed, and does the chart explain why?",
              "Find the hardest edge in a page of a comic you admire. Is it where the story wants you to look?"],
  });
})();
