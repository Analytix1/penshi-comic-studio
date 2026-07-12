/* ============================================================
   reference.js — the Learn tab (comics craft + art fundamentals)
   and the Library tab (your personal files served by the backend
   plus genuinely free, public-domain drawing books).
   ============================================================ */
"use strict";

const Reference = (() => {

  /* small inline SVG figures */
  const FIG = {
    anatomy: `<svg class="learn-fig" viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="8" width="224" height="134" fill="none" stroke="#e06060" stroke-width="2"/>
      <rect x="24" y="22" width="192" height="106" fill="none" stroke="#6db3f2" stroke-dasharray="5 4" stroke-width="2"/>
      <rect x="2" y="2" width="236" height="146" fill="none" stroke="#999" stroke-width="1"/>
      <text x="120" y="80" font-size="11" text-anchor="middle" fill="#333">live / safe area</text>
      <text x="120" y="20" font-size="9" text-anchor="middle" fill="#e06060">trim</text>
      <text x="120" y="146" font-size="9" text-anchor="middle" fill="#777">bleed</text></svg>`,
    zpath: `<svg class="learn-fig" viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="4" width="232" height="142" fill="none" stroke="#999"/>
      <path d="M 20 25 L 220 25 L 20 125 L 220 125" fill="none" stroke="#e8b04b" stroke-width="3" marker-end="url(#a)"/>
      <defs><marker id="a" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
      <path d="M0 0 L8 4 L0 8 z" fill="#e8b04b"/></marker></defs>
      <text x="120" y="82" font-size="11" text-anchor="middle" fill="#333">the reader's eye sweeps a Z</text></svg>`,
  };

  const LESSONS = [
    ["📐 Page anatomy: bleed, trim, safe", `
      ${FIG.anatomy}
      <p><b>Trim</b> (red line on your canvas) is where the printer cuts.
      <b>Bleed</b> is extra art past the trim so a slightly-off cut never
      shows white paper — run backgrounds to the page edge.
      <b>Safe area</b> (blue dashes): keep every balloon, caption and face
      inside it or risk losing them to the cutter or the binding.</p>
      <p>The <b>gutter</b> is the gap between panels. It isn't dead space —
      it's where the reader's mind constructs time. Scott McCloud calls this
      <i>closure</i>: the murder happens between the panels, and the reader
      commits it.</p>`],

    ["🔀 Panel transitions (McCloud's six)", `
      <p>Every panel-to-panel cut is one of six moves — vary them to control pace:</p>
      <ul>
        <li><b>Moment-to-moment</b> — tiny time slices. Slow, cinematic, tense.</li>
        <li><b>Action-to-action</b> — one subject, distinct beats. The workhorse of Western comics.</li>
        <li><b>Subject-to-subject</b> — new subject, same scene. Conversations, reactions.</li>
        <li><b>Scene-to-scene</b> — jumps across time/space. Needs a caption ("LATER…") or a strong visual anchor.</li>
        <li><b>Aspect-to-aspect</b> — wandering eye over a mood or place, time stands still. Manga uses this constantly.</li>
        <li><b>Non-sequitur</b> — no logical relation. Rare; surreal or comedic.</li>
      </ul>
      <p>Rule of thumb: more panels for a beat = that beat feels longer.
      A single wide panel = a held breath.</p>`],

    ["👁 Reading flow & the Z-path", `
      ${FIG.zpath}
      <p>Western readers sweep <b>left→right, top→bottom</b> in a Z.
      Compose so faces, gestures and balloon tails push the eye along that
      path. If two balloons share a panel, the <b>left/higher one is read
      first</b> — position speakers accordingly, or you'll have characters
      answering questions before they're asked.</p>
      <p>Break the grid deliberately: a character bursting out of a panel
      border reads as energy precisely because everything else respects
      the borders.</p>`],

    ["💬 Balloon & lettering craft", `
      <ul>
        <li>The <b>tail points at the speaker's mouth</b>, never their body — select a balloon and drag the blue dot.</li>
        <li>Keep balloons to <b>~25 words max</b>. More than that: split into linked balloons or trim the script.</li>
        <li>Comic lettering is traditionally <b>ALL CAPS</b> (Inkwell does this for you) with <b>bold</b> used for emphasis, roughly every 5–7 words in dramatic dialogue.</li>
        <li><b>Thought bubbles</b> are cloud-scalloped with dot trails. Modern books often swap them for rectangular caption narration.</li>
        <li><b>Captions</b> carry narration and time jumps. <b>Bursts</b> carry SFX and shouts — draw the SFX big, it's part of the art.</li>
        <li>Letter <b>before</b> you finish the art in tight panels — pros place balloons at rough-layout stage so art never fights text.</li>
      </ul>`],

    ["🎥 Shots, angles & the 180° rule", `
      <p>Panels are camera shots. A page of same-size talking heads is a
      dead page — mix your shots:</p>
      <ul>
        <li><b>Establishing shot</b> — wide view opening each new scene, so readers always know where they are.</li>
        <li><b>Full / medium / close-up</b> — move closer as emotion intensifies.</li>
        <li><b>Extreme close-up</b> — eyes, a trembling hand. Punctuation; use sparingly.</li>
        <li><b>Low angle</b> = power, menace. <b>High angle</b> = vulnerability, isolation.</li>
      </ul>
      <p><b>180° rule:</b> imagine a line between two characters talking.
      Keep your "camera" on one side of it, panel after panel, or the
      characters appear to teleport sides and the reader loses who's who.</p>`],

    ["✏️ The pro pipeline (why the layers are named that)", `
      <p>Inkwell's default layer stack is the industry pipeline, bottom to top:</p>
      <ul>
        <li><b>Panels</b> — layout first. Thumbnails → panel grid before any drawing.</li>
        <li><b>Pencils</b> — rough construction on this layer. It renders in <b>non-photo blue</b>, the color print cameras couldn't see, which is why pencillers used it: ink over it, never erase.</li>
        <li><b>Colors</b> — flats and rendering, sitting <i>under</i> the ink line.</li>
        <li><b>Inks</b> — the confident final line. Pressure = line weight: thin for far/light, thick for near/shadow. Vary weight or the page looks like a coloring book.</li>
        <li><b>Lettering</b> — always on top. Nothing overlaps a balloon.</li>
      </ul>
      <p>Toggle the Pencils layer's ◉ visibility off before export — that's the whole trick.</p>`],

    ["🎭 Figures: gesture before anatomy", `
      <p>Every figure starts as a <b>gesture</b> — one flowing line of
      action, 30 seconds, capturing what the pose <i>does</i>, not what it
      looks like. Your FORCE book (Library tab) is entirely about this:
      find the rhythm of applied and directed forces before any contour.</p>
      <ul>
        <li>Build on the gesture with <b>simple solids</b> — the Sycra sheet in your Library shows the standard simplification: egg head, box/shield ribcage, pelvis bucket, cylinder limbs.</li>
        <li>Proportion anchor: an adult is <b>~7.5 heads tall</b>; heroic comic style stretches to 8–9 heads.</li>
        <li>Hands are ~face-sized. When in doubt, draw hands bigger.</li>
        <li>Comics shortcut: <b>silhouette test</b> — if the pose doesn't read filled with solid black, no amount of rendering saves it.</li>
      </ul>`],

    ["🏙 Perspective in 60 seconds", `
      <p>Turn on the <b>perspective grid</b> (Guides tab) and drag the ⊕ points:</p>
      <ul>
        <li><b>Horizon = the viewer's eye level.</b> Everything above it we see from below, everything under it from above. Low horizon = heroic; high horizon = map-like overview.</li>
        <li><b>1-point</b>: flat-on views, corridors, roads to the horizon.</li>
        <li><b>2-point</b>: standing at a building's corner — the everyday street shot. Keep both VPs <i>far apart</i> (even off-page) or things distort.</li>
        <li><b>3-point</b>: add a vertical VP for dramatic worm's-eye or bird's-eye superhero shots.</li>
        <li>Figures obey it too: all heads of same-height people cross the horizon at the same body point.</li>
      </ul>
      <p>Use the <b>line tool + Shift</b> to snap construction lines toward your VPs.</p>`],

    ["◐ Values, spotting blacks & composition", `
      <ul>
        <li>Comics read at <b>3 values</b>: white, black, and one mid-tone. Squint at your panel — if it turns to mud, restate.</li>
        <li><b>Spotting blacks</b>: place solid black shapes to steer the eye and anchor the composition — Mignola and Toth built careers on it. Marker tool at 100% is your friend.</li>
        <li><b>Rule of thirds</b> (Guides tab): park your focal point on an intersection, not dead center… unless symmetry <i>is</i> the point.</li>
        <li>Contrast draws the eye: the highest black-vs-white contrast in a panel should sit on the story point.</li>
        <li>Leave <b>rest areas</b> — a busy panel next to a quiet one makes both stronger.</li>
      </ul>`],

    ["⏱ Pacing a page", `
      <ul>
        <li>A standard comic page holds <b>5–6 panels</b>; 9 max before it gets cramped, 1 (splash) for maximum impact.</li>
        <li>The <b>last panel of a page</b> is a cliff edge — end on a question, a reveal, a raised fist, so the reader turns the page.</li>
        <li>Page-turn reveals only work on <b>odd (right-hand) pages</b> in print — plan spreads, not just pages.</li>
        <li>Wide panels stretch time; tall thin panels chop it. A row of identical panels with tiny changes = comic timing (beat… beat… punchline).</li>
        <li>Thumbnail the <b>whole issue tiny first</b>. Fixing pacing at postage-stamp size costs minutes; at full size it costs days.</li>
      </ul>`],
  ];

  /* ---------- free, public-domain books ---------- */
  const FREE_BOOKS = [
    ["Bridgman — Constructive Anatomy", "The classic on building figures from planes and masses. Public domain.",
     "https://archive.org/details/constructiveanat00brid"],
    ["Harold Speed — The Practice & Science of Drawing", "The best free book on line, mass and seeing like an artist. Project Gutenberg.",
     "https://www.gutenberg.org/ebooks/14264"],
    ["G.A. Storey — The Theory and Practice of Perspective", "Thorough perspective course, free on Project Gutenberg.",
     "https://www.gutenberg.org/ebooks/20165"],
    ["Vanderpoel — The Human Figure", "Beloved figure-drawing standard, public domain scan.",
     "https://archive.org/details/humanfigure00vand"],
    ["Norling — Perspective Made Easy", "The friendliest perspective book ever written (1939, unrenewed copyright).",
     "https://archive.org/details/perspectivemadeeasy"],
    ["McCloud — Understanding Comics", "Not free, but THE book on comic mechanics — the Learn tab borrows its vocabulary. Worth owning.",
     "https://archive.org/search?query=understanding+comics"],
  ];

  function buildLearn() {
    const host = document.getElementById("learn-content");
    host.innerHTML = `<div class="hint" style="margin-top:0">Working references while
      you draw — each section is one craft mechanic, shortest useful version.</div>`;
    for (const [title, body] of LESSONS) {
      const d = document.createElement("details");
      d.className = "learn";
      d.innerHTML = `<summary>${title}<span class="pop" title="Open in a floating window — keep several lessons open while you draw">⧉</span></summary>
        <div class="body">${body}</div>`;
      d.querySelector(".pop").addEventListener("click", e => {
        e.preventDefault(); e.stopPropagation();
        UI.popout(title, `<div class="body">${body}</div>`);
      });
      host.appendChild(d);
    }
  }

  async function buildLibrary() {
    const host = document.getElementById("library-content");
    let mine = "";
    try {
      const data = await (await fetch("/api/resources")).json();
      if (data.missing) {
        mine = `<div class="hint">Folder not found: <code>${data.folder}</code> —
          set "resourcesDir" in config.json (see config.example.json).</div>`;
      } else if (!data.resources.length) {
        mine = `<div class="hint">Drop PDFs or images into<br><code>${data.folder}</code><br>and they appear here.</div>`;
      } else {
        mine = data.resources.map(r => `
          <div class="lib-item">
            <span class="ic">${r.kind === "pdf" ? "📕" : "🖼"}</span>
            <div class="meta"><div class="t">${r.file}</div>
              <div class="muted">${r.kind.toUpperCase()} · ${r.sizeMb} MB</div></div>
            <button onclick="window.open('/resources/${encodeURIComponent(r.file)}','_blank')">Open</button>
          </div>`).join("");
      }
    } catch {
      mine = `<div class="hint">Couldn't reach the backend resource API.</div>`;
    }

    /* personal asset library — drawn stamps saved with the lasso tool */
    let assetsHtml = "";
    try {
      const a = await (await fetch("/api/assets")).json();
      assetsHtml = a.assets.length
        ? `<div id="asset-grid">${a.assets.map(x => `
            <div class="asset" data-id="${x.id}" data-w="${x.w}" data-h="${x.h}"
                 title="Click to stamp '${x.name}' onto the page">
              <img src="${x.png}" alt="${x.name}">
              <span class="a-name">${x.name}</span>
              <button class="a-del" data-id="${x.id}" title="Delete asset">✕</button>
            </div>`).join("")}</div>`
        : `<div class="hint">No assets yet. Draw something (a pair of eyes, a
           title, a prop), circle it with the <b>Lasso ◌</b> tool, and hit
           <b>📦 Save asset</b>. It'll live here, ready to stamp onto any page
           of any project.</div>`;
    } catch { assetsHtml = `<div class="hint">Asset API unreachable.</div>`; }

    host.innerHTML = `
      <h3>My assets</h3>${assetsHtml}
      <h3>Your shelf</h3>${mine}
      <h3>Free classics (legit public domain)</h3>
      ${FREE_BOOKS.map(([t, d, url]) => `
        <div class="lib-item"><span class="ic">📖</span>
          <div class="meta"><div class="t">${t}</div><div class="muted">${d}</div>
          <a href="${url}" target="_blank" rel="noopener">open ↗</a></div></div>`).join("")}
      <div class="hint">Tip: open a reference beside Inkwell in Windows
        Snap (Win+←/→) and draw from it — study, don't trace-and-paste.
        These books are drawn from Project Gutenberg and the Internet
        Archive's public-domain collections.</div>`;

    host.querySelectorAll(".asset").forEach(el =>
      el.addEventListener("click", e => {
        if (e.target.classList.contains("a-del")) return;
        Tools.startPlacing(el.querySelector("img").src, +el.dataset.w, +el.dataset.h);
      }));
    host.querySelectorAll(".a-del").forEach(btn =>
      btn.addEventListener("click", async e => {
        e.stopPropagation();
        if (!confirm("Delete this asset from your library?")) return;
        await fetch(`/api/assets/${btn.dataset.id}`, { method: "DELETE" });
        buildLibrary();
      }));
  }

  return { buildLearn, buildLibrary };
})();
