/* Curriculum · Section 7 — Going Further (practice routines, self-
   assessment, and the curated resource shelf for leveling up beyond
   this curriculum) */
"use strict";
window.PENSHI_CURRICULUM = window.PENSHI_CURRICULUM || [];

PENSHI_CURRICULUM.push({
  id: "s7", num: 7, title: "Going Further",
  tagline: "How to keep improving after the curriculum: routines, self-critique, and the best resources on the internet.",
  chapters: [

  { id: "s7-practice", title: "Practice, Critique, Resources",
    summary: "A curriculum ends; practice doesn't. These lessons set up a sustainable routine, teach you to critique your own work with the Portfolio's timeline, and hand you a curated shelf of the deepest free and paid resources for every topic you've touched.",
    lessons: [

    { id: "fur-1", title: "The daily routine", minutes: 30,
      goal: "Build a 30-minute daily practice you'll actually keep, and record it in the Portfolio.",
      why: "Skill is mileage. Thirty focused minutes every day beats a six-hour Sunday, because the hand forgets between long gaps. The routine below is what working artists actually do — warm-up, study, play — scaled to fit a life.",
      refs: ["drawabox", "loa-figure", "proko-basics", "ctrlpaint"],
      pages: [
        { title: "The 10-10-10",
          hints: ["10 min warm-up: lines, ellipses, boxes (Forms-1, Forms-3).", "10 min study: timed references for whatever you're weakest at.", "10 min play: draw something for fun with no rules.", "Save the page to the Portfolio every day — the timeline is your progress bar."],
          steps: [
            { h: "Warm-up (10 minutes)", t: "Ghosted lines, a row of ellipses, five rotated boxes. Every day, no exceptions, before anything else. It's not glamorous; it's what keeps the lines confident.", tool: "pencil", layer: "Pencils" },
            { h: "Study (10 minutes)", t: "Pick your weakest chapter — be honest; the Portfolio shows you — and do timed references for it: Line of Action hands if hands are weak, animals if animals are, 30-second gestures if figures are stiff.", tool: "pencil" },
            { h: "Play (10 minutes)", t: "Draw whatever you want, however you want. No construction required. This is where the studied things become YOURS, and it's what keeps you coming back tomorrow.", tool: "ink", layer: "Inks" },
            { h: "Save and date", t: "Save the attempt. In a month the Portfolio will show thirty pages in a row, and the difference between day 1 and day 30 will be the most motivating thing you've ever seen.", tool: "pencil" },
          ] },
      ],
      reflect: ["What time of day will this actually happen? Put it in a calendar now."] },

    { id: "fur-2", title: "Self-critique with the timeline", minutes: 30,
      goal: "Compare current work against past attempts in the Portfolio, name specific errors, and turn them into next week's study plan.",
      why: "Improvement is invisible day to day and obvious month to month — but only if you look. Comparing your Section 1 mug study to a mug drawn today, or your first gesture page to this week's, tells you exactly what changed and what didn't.",
      refs: ["proko-basics", "ctrlpaint"],
      pages: [
        { title: "Then and now",
          hints: ["Open the Portfolio (Learn tab home). Find your earliest attempt of any lesson.", "Redo that lesson's capstone page now.", "Side by side: what improved, what didn't, and what's the one thing to fix next."],
          steps: [
            { h: "Redo an early lesson", t: "Pick the oldest attempt in your Portfolio — the very first mug, the first head, the first gesture page. Redo that lesson's last page today, cold, without re-reading the steps.", tool: "pencil", layer: "Pencils" },
            { h: "Name three things", t: "Open both in the Portfolio side by side. Write in the margin: one thing that clearly improved, one thing that didn't, and one specific error in today's version (not 'proportions' — 'the eyes are too high by a quarter head').", tool: "pencil" },
            { h: "Plan the week", t: "The 'didn't improve' item becomes the Study block of your 10-10-10 for the next seven days. That's the whole loop: draw, compare, name, drill, repeat.", tool: "pencil" },
          ] },
      ],
      reflect: ["Is the thing that didn't improve something you've actually been practicing, or just hoping about?"] },

    { id: "fur-3", title: "The resource shelf", minutes: 20,
      goal: "Know the deepest resource for each topic in the curriculum, and what each is for.",
      why: "This curriculum synthesizes; the sources go deeper. Every lesson has cited its references — this page collects the ones worth your next hundred hours, sorted by what they're best at, with an honest note on what's free.",
      refs: ["drawabox", "proko-figure", "proko-anatomy", "loomis-head", "loomis-figure", "bridgman", "speed", "norling", "scott-robertson",
             "ctrlpaint", "gurney-book", "gurney-blog", "hampton", "force", "hogarth-drapery", "adobe-color", "albers", "zygote", "posemaniacs",
             "loa-figure", "quickposes", "hultgren", "goldfinger-animal", "whitlatch", "met-collection", "royal-armouries", "sketchfab", "nasa-eo",
             "fzd", "framed-ink", "mccloud", "chelsea", "aldoori", "sinix", "marco-bucci", "a4s", "kenhub", "edwards", "handy", "adorkastock", "croquis"],
      pages: [
        { title: "How to use the shelf",
          hints: ["Every link is in the References panel of this lesson.", "Free first: Drawabox, Proko's free courses, Ctrl+Paint, Line of Action, Posemaniacs, the public-domain books.", "Then the books worth buying, in order: Loomis, Hampton, Gurney's Color and Light, Scott Robertson's How to Draw, Framed Ink."],
          steps: [
            { h: "Bookmark the free core", t: "Drawabox (construction), Proko's free courses (figure, gesture, head, anatomy), Ctrl+Paint (value and digital fundamentals), Line of Action and Posemaniacs (references). These alone are a multi-year curriculum at zero cost.", tool: "pencil", layer: "Pencils" },
            { h: "The public-domain library", t: "Loomis (heads, figures, blooks), Bridgman (anatomy), Harold Speed (seeing), Norling and Storey (perspective), Hultgren (animals). All free, all still the best at what they do. Your Library tab links the ones you've opened.", tool: "pencil" },
            { h: "Where money is worth it", t: "In this order: Hampton's Figure Drawing (the modern figure method), Gurney's Color and Light (there is no free equivalent), Scott Robertson's How to Draw (advanced perspective and vehicles), Framed Ink (composition for comics), Whitlatch (creatures), Goldfinger (animal anatomy).", tool: "pencil" },
            { h: "Draw one page from the shelf", t: "Pick any source, open it, and draw one page from it — right now, on this canvas. That's how the shelf is meant to be used: not read, drawn.", tool: "pencil" },
          ] },
      ],
      reflect: ["Which resource will you open tomorrow?"] },
    ] },
  ],
});
