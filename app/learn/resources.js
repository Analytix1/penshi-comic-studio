/* ============================================================
   learn/resources.js — the citation database
   Every lesson cites its sources from this table by id. Nothing
   here is embedded in the app: links open in a new tab, so the
   student studies FROM the source and draws in Penshi.
   free: "free" | "freemium" | "paid" | "public-domain"
   ============================================================ */
"use strict";

const LearnResources = {
  /* ---- foundations / forms ---- */
  "drawabox": { title: "Drawabox — Lesson 1: Lines, Ellipses & Boxes", by: "Irshad Karim (Uncomfortable)",
    url: "https://drawabox.com/lesson/1", free: "free",
    note: "The most widely used free construction curriculum. Ghosting, ellipses, rotated boxes." },
  "drawabox-250": { title: "Drawabox — the 250 Box Challenge", by: "Drawabox",
    url: "https://drawabox.com/lesson/250boxes", free: "free",
    note: "The single most effective exercise for thinking in 3D. Do it slowly over weeks." },
  "drawabox-l2": { title: "Drawabox — Lesson 2: Contour, Form Intersections, Organic Forms", by: "Drawabox",
    url: "https://drawabox.com/lesson/2", free: "free" },
  "drawabox-l5": { title: "Drawabox — Lesson 5: Animals (construction)", by: "Drawabox",
    url: "https://drawabox.com/lesson/5", free: "free" },
  "drawabox-l6": { title: "Drawabox — Lesson 6: Everyday Objects", by: "Drawabox",
    url: "https://drawabox.com/lesson/6", free: "free" },
  "drawabox-l7": { title: "Drawabox — Lesson 7: Vehicles", by: "Drawabox",
    url: "https://drawabox.com/lesson/7", free: "free" },
  "loomis-fun": { title: "Fun With a Pencil (1939)", by: "Andrew Loomis",
    url: "https://archive.org/search?query=andrew+loomis+fun+with+a+pencil", free: "public-domain",
    note: "'Blooks' — building faces and figures from a ball. Search result on the Internet Archive." },
  "loomis-figure": { title: "Figure Drawing for All It's Worth (1943)", by: "Andrew Loomis",
    url: "https://archive.org/search?query=andrew+loomis+figure+drawing+for+all+it%27s+worth", free: "public-domain" },
  "loomis-head": { title: "Drawing the Head and Hands (1956)", by: "Andrew Loomis",
    url: "https://archive.org/search?query=andrew+loomis+drawing+the+head+and+hands", free: "public-domain",
    note: "THE ball-and-plane head method every construction tutorial descends from." },
  "speed": { title: "The Practice and Science of Drawing (1913)", by: "Harold Speed",
    url: "https://www.gutenberg.org/ebooks/14264", free: "public-domain",
    note: "Line vs mass drawing, and how to SEE. Project Gutenberg." },
  "bridgman": { title: "Constructive Anatomy (1920)", by: "George Bridgman",
    url: "https://archive.org/details/constructiveanat00brid", free: "public-domain" },
  "edwards": { title: "Drawing on the Right Side of the Brain (book & site)", by: "Betty Edwards",
    url: "https://www.drawright.com/", free: "paid",
    note: "Upside-down drawing, negative space, sighting — the observation classics come from here." },
  "loa-stilllife": { title: "Line of Action — Basic Shapes & Still Life (timed tool)", by: "Line of Action",
    url: "https://line-of-action.com/practice-tools/app/still-life", free: "free" },
  "unsplash": { title: "Unsplash — free high-resolution reference photos", by: "Unsplash",
    url: "https://unsplash.com/", free: "free", note: "Search a noun, draw the photo. Free to use as reference." },
  "pexels": { title: "Pexels — free reference photos & video", by: "Pexels", url: "https://www.pexels.com/", free: "free" },

  /* ---- perspective ---- */
  "norling": { title: "Perspective Made Easy (1939)", by: "Ernest Norling",
    url: "https://archive.org/details/perspectivemadeeasy", free: "public-domain",
    note: "Still the friendliest perspective book ever written." },
  "storey": { title: "The Theory and Practice of Perspective (1910)", by: "G. A. Storey",
    url: "https://www.gutenberg.org/ebooks/20165", free: "public-domain" },
  "scott-robertson": { title: "How to Draw: drawing and sketching objects and environments", by: "Scott Robertson & Thomas Bertling",
    url: "https://scottrobertsonworkshops.com/", free: "paid",
    note: "The advanced-perspective bible: perfect ellipses, mirroring, vehicles. Book + workshops." },
  "vandruff": { title: "Perspective video series", by: "Marshall Vandruff",
    url: "https://www.marshallart.com/", free: "paid", note: "Legendary lecture series; site lists the courses." },
  "loa-env": { title: "Line of Action — Scenes & Environments (timed tool)", by: "Line of Action",
    url: "https://line-of-action.com/practice-tools/app/environments", free: "free" },

  /* ---- shading / light ---- */
  "ctrlpaint": { title: "Ctrl+Paint — free video library (drawing, value, light, color)", by: "Matt Kohr",
    url: "https://www.ctrlpaint.com/library", free: "free",
    note: "Hundreds of short free videos. Start at 'Traditional Drawing' then 'Value'." },
  "gurney-blog": { title: "Gurney Journey (blog)", by: "James Gurney",
    url: "https://gurneyjourney.blogspot.com/", free: "free",
    note: "Author of 'Color and Light'. Thousands of free posts on light, color, and observation." },
  "gurney-book": { title: "Color and Light: A Guide for the Realist Painter", by: "James Gurney", url: "https://gurneyjourney.blogspot.com/", free: "paid",
    note: "Buy this one. Light scenarios, color temperature, atmosphere." },

  /* ---- gesture / figure ---- */
  "proko-gesture": { title: "Proko — The Gesture Course (free lessons)", by: "Stan Prokopenko",
    url: "https://www.proko.com/course/the-gesture-course", free: "freemium" },
  "proko-figure": { title: "Proko — Figure Drawing Fundamentals", by: "Stan Prokopenko",
    url: "https://www.proko.com/course/figure-drawing-fundamentals", free: "freemium",
    note: "Gesture → bean → mannequin → landmarks. Free video versions on the site." },
  "proko-head": { title: "Proko — Head Drawing and Construction", by: "Stan Prokopenko",
    url: "https://www.proko.com/course/head-drawing-and-construction", free: "freemium" },
  "proko-anatomy": { title: "Proko — Anatomy of the Human Body", by: "Stan Prokopenko",
    url: "https://www.proko.com/course/anatomy-of-the-human-body", free: "freemium" },
  "proko-basics": { title: "Proko — Drawing Basics", by: "Proko", url: "https://www.proko.com/course/drawing-basics", free: "freemium" },
  "loa-figure": { title: "Line of Action — Figure Drawing (timed tool)", by: "Line of Action",
    url: "https://line-of-action.com/practice-tools/app/figure-drawing", free: "free",
    note: "Set 30s–2min timers. Thousands of poses, clothed and nude toggles." },
  "loa-360": { title: "Line of Action — 360° figure views", by: "Line of Action",
    url: "https://line-of-action.com/360-views/figure-drawing", free: "free" },
  "loa-hands": { title: "Line of Action — Hands & Feet (timed tool)", by: "Line of Action",
    url: "https://line-of-action.com/practice-tools/app/hands-feet", free: "free" },
  "loa-faces": { title: "Line of Action — Faces & Expressions (timed tool)", by: "Line of Action",
    url: "https://line-of-action.com/practice-tools/app/faces-expressions", free: "free" },
  "loa-animals": { title: "Line of Action — Animal Drawing (timed tool)", by: "Line of Action",
    url: "https://line-of-action.com/practice-tools/app/animal-drawing", free: "free" },
  "quickposes": { title: "Quickposes — timed gesture references", by: "Quickposes",
    url: "https://quickposes.com/", free: "free" },
  "posemaniacs": { title: "Posemaniacs — royalty-free 3D pose, hand, muscle & face reference", by: "Posemaniacs",
    url: "https://www.posemaniacs.com/", free: "free",
    note: "Rotate any pose. Toggle the muscle view for anatomy — invaluable." },
  "adorkastock": { title: "AdorkaStock — free pose reference photos", by: "AdorkaStock (formerly SenshiStock)",
    url: "https://www.adorkastock.com/", free: "free" },
  "croquis": { title: "Croquis Cafe — figure drawing reference videos", by: "OnAirVideo",
    url: "https://croquis.cafe/", free: "freemium" },
  "handy": { title: "Handy — 3D hand/head/foot posing app", by: "Belief Engine",
    url: "https://www.handyarttool.com/", free: "paid", note: "Cheap app; rotatable lit hands in any pose." },
  "force": { title: "FORCE: Character Design from Life Drawing", by: "Mike Mattesi",
    url: "", free: "paid", note: "In your Library tab. The book on rhythm and directed force in gesture." },
  "hampton": { title: "Figure Drawing: Design and Invention", by: "Michael Hampton", url: "", free: "paid",
    note: "The best modern bridge between gesture and construction." },

  /* ---- head / expression ---- */
  "ekman-facs": { title: "Facial Action Coding System (FACS)", by: "Paul Ekman Group",
    url: "https://www.paulekman.com/facial-action-coding-system/", free: "free",
    note: "The science behind expressions: which muscles (Action Units) make each one." },
  "simon-expr": { title: "Facial Expressions: A Visual Reference for Artists", by: "Mark Simon", url: "", free: "paid",
    note: "Photo reference of dozens of models × dozens of expressions." },

  /* ---- fabric ---- */
  "hogarth-drapery": { title: "Dynamic Wrinkles and Drapery", by: "Burne Hogarth",
    url: "https://archive.org/search?query=hogarth+dynamic+wrinkles+and+drapery", free: "paid",
    note: "Names the seven fold families. Archive search for previews; buy the book." },
  "loa-clothed": { title: "Line of Action — Figure tool with 'clothed' filter", by: "Line of Action",
    url: "https://line-of-action.com/practice-tools/app/figure-drawing", free: "free" },

  /* ---- color ---- */
  "adobe-color": { title: "Adobe Color — interactive color wheel & harmony rules", by: "Adobe",
    url: "https://color.adobe.com/create/color-wheel", free: "free",
    note: "Complementary, split, analogous, triadic, monochromatic — same rules as Penshi's wheel." },
  "paletton": { title: "Paletton — color scheme designer", by: "Paletton", url: "https://paletton.com/", free: "free" },
  "coolors": { title: "Coolors — palette generator & extractor", by: "Coolors", url: "https://coolors.co/", free: "freemium" },
  "albers": { title: "Interaction of Color", by: "Josef Albers", url: "", free: "paid",
    note: "The relativity of color: the same swatch changes with its neighbors." },
  "marco-bucci": { title: "Marco Bucci — color & light lessons (YouTube)", by: "Marco Bucci",
    url: "https://www.youtube.com/@marcobucci", free: "free", note: "'10 Minutes to Better Painting' series." },

  /* ---- anatomy ---- */
  "zygote": { title: "Zygote Body — 3D anatomy viewer", by: "Zygote", url: "https://www.zygotebody.com/", free: "freemium",
    note: "Peel muscle layers off a rotatable body. Free tier is enough." },
  "kenhub": { title: "Kenhub — anatomy library (articles)", by: "Kenhub", url: "https://www.kenhub.com/en/library/anatomy", free: "freemium",
    note: "Medical-grade illustrations; articles free, video/quizzes paid." },
  "a4s": { title: "Anatomy For Sculptors — blog & books", by: "Uldis Zarins", url: "https://anatomy4sculptors.com/", free: "freemium",
    note: "'Understanding the Human Figure' is the clearest simplified-anatomy book made." },
  "bammes": { title: "The Artist's Guide to Human Anatomy", by: "Gottfried Bammes", url: "", free: "paid" },

  /* ---- animals ---- */
  "hultgren": { title: "The Art of Animal Drawing (1951)", by: "Ken Hultgren",
    url: "https://archive.org/search?query=ken+hultgren+art+of+animal+drawing", free: "public-domain",
    note: "Disney animator. Construction, gesture and caricature of animals." },
  "goldfinger-animal": { title: "Animal Anatomy for Artists", by: "Eliot Goldfinger", url: "", free: "paid",
    note: "The definitive comparative-anatomy reference." },
  "commons-zootomy": { title: "Wikimedia Commons — Zootomy (animal anatomy images)", by: "Wikimedia",
    url: "https://commons.wikimedia.org/wiki/Category:Zootomy", free: "free",
    note: "Skeletons, skulls, dissections, by species. Free to use." },
  "sketchfab-skel": { title: "Sketchfab — rotatable 3D animal skeletons", by: "Sketchfab community",
    url: "https://sketchfab.com/search?q=animal+skeleton&type=models", free: "free" },
  "whitlatch": { title: "Animals Real and Imagined / The Science of Creature Design", by: "Terryl Whitlatch", url: "", free: "paid",
    note: "Disney/Lucasfilm creature designer. How real anatomy makes fake animals believable." },

  /* ---- objects / vehicles / weapons ---- */
  "met-collection": { title: "The Met — Open Access collection (arms & armor, tools, vehicles)", by: "Metropolitan Museum of Art",
    url: "https://www.metmuseum.org/art/collection", free: "free",
    note: "Search 'armor', 'sword', 'saddle'. High-res, many public domain." },
  "royal-armouries": { title: "Royal Armouries — collection online", by: "Royal Armouries (UK)",
    url: "https://royalarmouries.org/collection", free: "free" },
  "sketchfab": { title: "Sketchfab — 3D models to rotate (vehicles, machines, props)", by: "Sketchfab",
    url: "https://sketchfab.com/", free: "free" },

  /* ---- environment ---- */
  "nasa-eo": { title: "NASA Earth Observatory — landform & climate imagery", by: "NASA",
    url: "https://science.nasa.gov/earth/earth-observatory", free: "free",
    note: "Deltas, dunes, glaciers, volcanoes from orbit. Learn what shapes land." },
  "usgs": { title: "USGS — geology & hydrology education", by: "U.S. Geological Survey", url: "https://www.usgs.gov/", free: "free" },
  "fzd": { title: "FZD School — design education videos (YouTube)", by: "Feng Zhu",
    url: "https://www.youtube.com/@FZDSCHOOL", free: "free",
    note: "Environment & concept design lectures from a working studio." },
  "framed-ink": { title: "Framed Ink: Drawing and Composition for Visual Storytellers", by: "Marcos Mateu-Mestre", url: "", free: "paid",
    note: "Composition and light for comics/storyboards. Essential for the Environment and Comics chapters." },

  /* ---- comics ---- */
  "mccloud": { title: "Understanding Comics", by: "Scott McCloud", url: "", free: "paid",
    note: "Panel transitions, closure, the icon. The vocabulary Penshi's Craft tab uses." },
  "chelsea": { title: "Perspective! for Comic Book Artists", by: "David Chelsea", url: "", free: "paid" },

  /* ---- character / creature design ---- */
  "aldoori": { title: "Ahmed Aldoori — character design & mash-up studies (YouTube)", by: "Ahmed Aldoori",
    url: "https://www.youtube.com/@AhmedAldoori", free: "free" },
  "sinix": { title: "Sinix Design — anatomy, design, folds (YouTube)", by: "Sinix", url: "https://www.youtube.com/@SinixDesign", free: "free" },
};

function resourceLink(id) {
  const r = LearnResources[id];
  if (!r) return "";
  const badge = { "free": "free", "freemium": "free tier", "paid": "book / paid", "public-domain": "public domain" }[r.free] || r.free;
  const inner = `<b>${r.title}</b><span class="rs-by">${r.by}</span>${r.note ? `<span class="rs-note">${r.note}</span>` : ""}`;
  return `<div class="rs"><span class="rs-badge rs-${r.free}">${badge}</span>
    ${r.url ? `<a href="${r.url}" target="_blank" rel="noopener">${inner} ↗</a>` : `<span>${inner}</span>`}</div>`;
}
