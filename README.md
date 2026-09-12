# 🖋 Penshi — Comic Studio

A local, browser-based comic/graphic-novel studio. No accounts, no cloud, **no AI image
generation** — it's a drafting table that teaches real comic craft while you draw.
Everything runs on your machine: a dependency-free Python server plus vanilla JS.

## Getting started (no coding experience needed)

Penshi runs entirely on your own computer. No account, no cloud — after the
download, it works offline and nothing ever leaves your machine.

### Step 1 — Get Penshi onto your computer

Two ways. **Option A is recommended** — it takes five extra minutes now and makes
future updates a single command instead of a re-download.

<details open>
<summary><b>Option A — Clone with Git (recommended: easy updates later)</b></summary>

**1. Install Git** (one time, free)

- **Windows:** download from [git-scm.com/download/win](https://git-scm.com/download/win)
  and run the installer. Click **Next** through every screen — the defaults are
  fine. This also installs "Git Bash", a terminal you can use.
- **Mac:** open Terminal and type `git --version`. If it prints a version you're
  done; if it offers to install "command line developer tools", click **Install**.
- **Linux:** `sudo apt install git` (Debian/Ubuntu) or your distro's equivalent.

**2. Pick where Penshi should live**

Decide on a parent folder — your Documents folder is a fine choice. Penshi will
create its own folder inside it, so you don't need to make one first.

**3. Open a terminal in that folder**

- **Windows 11:** open Documents in File Explorer, right-click any empty space in
  the window, choose **Open in Terminal**.
- **Windows 10:** hold **Shift**, right-click empty space, choose **Open PowerShell
  window here**.
- **Mac:** open Terminal and type `cd ~/Documents` then press Enter.
- *Either way, you can always type `cd ` (with a space) and then drag the folder
  from your file manager onto the terminal window — it fills in the path for you.*

**4. Clone the repository**

Type this and press Enter (or copy-paste it):

```bash
git clone https://github.com/Analytix1/penshi-comic-studio.git
```

You'll see a few lines about "Cloning into..." and counting objects. When your
cursor comes back, you're done — there's now a **`penshi-comic-studio`** folder
inside Documents with everything in it. Nothing else to build or install.

**5. Step into the folder** (you'll want this for Step 3 and for updates)

```bash
cd penshi-comic-studio
```

</details>

<details>
<summary><b>Option B — Download a ZIP (no Git, but manual updates)</b></summary>

- Near the top of this GitHub page, click the green **`<> Code`** button, then
  **Download ZIP**.
- Find the downloaded `penshi-comic-studio-main.zip`, right-click it →
  **Extract All…**, and put the folder somewhere easy to find (like Documents).
- To update later you'll download a fresh ZIP and copy your `projects` and
  `assets` folders across by hand. (This is why Option A is nicer.)

</details>

### Step 2 — Install Python (one time, free)

Python is the engine Penshi's local server runs on. Any version 3.8 or newer.

- **Windows:** download it from [python.org/downloads](https://www.python.org/downloads/)
  and run the installer. **Important:** on the installer's first screen, tick the
  box that says **"Add python.exe to PATH"** before clicking Install.
- **Mac:** open Terminal and run `python3 --version` — if it prints a version,
  you already have it. Otherwise install from python.org.
- Nothing else to install. No pip packages, no Node, no build steps.

### Step 3 — Start drawing

- **Windows:** open the extracted folder and double-click **`Start Penshi.bat`**.
  Your browser opens at `http://localhost:8321` — that's the app.
  - The first time, Windows SmartScreen may warn about an unrecognized script:
    click **More info → Run anyway**. (The script is 20 lines that start the
    local server and open your browser — open it in Notepad if you'd like to
    check.)
- **Mac / Linux:** open a terminal in the folder and run `python3 server.py`,
  then open **http://localhost:8321** in your browser.
- Use **Chrome or Edge** for the best stylus support (pressure + tilt).

A guided tour starts on your first visit. Never drawn before? Click **Learn** in the
top bar and start with Foundations (see *Learn mode* below).

### Updating to the latest version

If you used **Option A (Git)**, updating is two commands. Open a terminal in your
`penshi-comic-studio` folder (same trick as Step 1) and run:

```bash
git pull
```

That's it — next time you start Penshi you're on the newest version. If it prints
`Already up to date.`, you already had it.

**Your artwork is safe.** Your saved comics (`projects`), your asset stamps
(`assets`), and your `config.json` are deliberately excluded from the repository,
so `git pull` never touches them. It only updates Penshi's own program files.

If you used **Option B (ZIP)**: download a fresh ZIP, extract it, then copy your
old `projects` and `assets` folders (and `config.json`, if you made one) into the
new folder before deleting the old one.

### Where your work lives

Saved comics go in the `projects` folder inside the Penshi folder, saved art
stamps go in `assets`, and your curriculum progress plus every practice page live
in `learn`. Back those three folders up and you've backed up everything. The server only listens on `127.0.0.1` (your own machine) — it is
not visible to your network or the internet.

### Troubleshooting

| Problem | Fix |
|---|---|
| `'git' is not recognized` | Git isn't installed or the terminal predates the install — close the terminal, reopen it, and try again. Still failing? Reinstall from [git-scm.com](https://git-scm.com/download/win) |
| `git clone` says "destination path already exists" | You already cloned it here. Just `cd penshi-comic-studio` and run `git pull` instead |
| `git pull` says "Your local changes would be overwritten" | You edited one of Penshi's program files. To throw those edits away and take the new version: `git checkout -- .` then `git pull`. (Your `projects` and `assets` are never affected) |
| Not sure which folder you're in | Run `pwd` (Mac/Linux/Git Bash) or `cd` with nothing after it (Windows PowerShell) to print the current folder |
| `'python' is not recognized` | Reinstall Python with **Add python.exe to PATH** ticked — or try running `py server.py` instead |
| A window flashes open and instantly closes | Open PowerShell in the folder and run `python server.py` to see the actual error message |
| Browser says it can't connect | The server isn't running — do Step 3 first, then refresh |
| Pen pressure isn't working | Use Chrome or Edge; some browsers don't report stylus pressure |
| App opens but the Library shelf is empty | That's normal — see `config.example.json` to point it at your own reference folder |

## Surface Slim Pen 2

Works natively, no drivers or settings:
- **Pressure** → line width (the Ink tool's whole personality)
- **Tilt** → shown live in the top-right telemetry readout
- **Tail eraser** → erases automatically (`buttons & 32`); the top-bar **Tail**
  toggle picks pixel eraser ◻ or whole-stroke eraser ⌫
- **Barrel (side) button** → lasso: hold it and circle strokes from any tool
- **Fingers** → pan and pinch-zoom only; they never draw, so rest your palm freely
- **Pen-only mode** (top bar) → additionally stops the mouse from drawing

## Where things live

```
comic-studio/
├─ server.py          Python stdlib backend (static files + projects API + resource library)
├─ projects/          your saved projects (one JSON file each)
├─ HANDOFF.md         architecture notes + ready-made prompts for Claude Opus/Sonnet
└─ app/
   ├─ index.html      layout shell
   ├─ css/styles.css  dark drafting-table theme
   └─ js/
      ├─ state.js     document model, layers, undo/redo, save/load
      ├─ engine.js    compositor, zoom/pan, PNG export
      ├─ tools.js     pointer pipeline, brushes, fill, shapes, select
      ├─ panels.js    panel objects + page templates
      ├─ lettering.js balloons, thoughts, captions, SFX bursts
      ├─ guides.js    print guides, composition overlays, perspective grid
      ├─ reference.js Craft tab (comics reference) + Library tab
      ├─ colorwheel.js HSV wheel with harmony modes (Tool tab)
      └─ main.js      UI wiring, shortcuts, tour, boot
   └─ learn/          Learn mode — its own folder
      ├─ learn.js     mode switch, curriculum home, Portfolio, lesson runner
      ├─ drill.js     timed gesture drill (countdown, auto-clear, contact sheet)
      ├─ exemplars.js the guide drawings painted onto practice pages
      ├─ resources.js the citation database (every linked source)
      └─ curriculum/  one data file per section (01-foundations … 07-further)
```

**Your reference library**: any PDFs or images you drop into the `drawing-resources`
folder (created on first run) appear in the app's **Library** tab. To use a folder you
already have (e.g. in OneDrive), copy `config.example.json` to `config.json` and set
`resourcesDir` to that path — `config.json` is gitignored, so your personal paths
never enter version control.

## Keyboard shortcuts

| Key | Action | Key | Action |
|---|---|---|---|
| B | Ink pen | V | Select/move |
| P | Pencil (blue) | H | Pan (or hold Space) |
| M | Marker | K | Panel tool |
| E | Eraser | T | Speech balloon |
| G | Fill | [ / ] | Brush smaller/bigger |
| S | Stroke eraser (removes whole strokes) | Ctrl+C/X/V | Copy / cut / paste selected object |
| Ctrl+Z / Y | Undo / redo | Ctrl+S / O | Save / open |
| Ctrl+E | Export PNG | Ctrl+0 | Fit page |
| Wheel | Zoom at cursor | Del | Delete selected object |

## Settings (⚙ in the top bar)

- **Stroke history** — the memory that lets the stroke eraser and lasso treat art
  as individual strokes. Kept across page switches by default; optionally include
  it in save files so old art stays stroke-editable forever (larger files).
- **Interface** — hide the tool rail, the sidebar, or individual tools you don't
  use (their shortcuts keep working). **Tab** toggles distraction-free mode.
- **Autosave** — every N minutes once the project is named.
- **Export** — with bleed, or cropped to the trim line.

Page formats: 8 presets (US comic, manga B5, webtoon, square, Golden Age, digest,
US Letter, A4) plus fully custom width × height at 150 or 300 dpi.

## Volumes, assets & lasso

- **Volumes**: every project is multi-page. The page tabs at the top-left of the
  canvas add (＋), switch, and delete (✕) pages; **Export all** downloads each page
  as a numbered PNG. Old single-page saves open fine and become one-page volumes.
- **Lasso (L)**: circle strokes to select them as a group — drag to move, pull the
  corner/edge handles to **stretch** (Shift keeps proportions), drag the knob above
  the box to **rotate** (Shift snaps to 15°), Del to delete, **📦 Save asset** to
  capture them.
- **Asset library** (Library tab → My assets): your saved stamps — eyes, logos,
  props — available in every project. Click one, then click the page to place it;
  `[` `]` resize before placing, Esc cancels. Assets live in the gitignored
  `assets/` folder.
- **⧉ on any Learn lesson** pops it out into a draggable floating window, so you
  can keep several lessons open while you draw.

## Learn mode — the drawing curriculum

Click **Learn** in the top bar (next to **Studio**) to open a full, self-paced drawing
course that runs on the same canvas and tools you make comics with:

- **7 sections · 20 chapters · 75 lessons · ~500 steps (about 33,000 words of
  instruction).** Foundations (thinking in 3-D forms, observation) → Extending
  (perspective, shading, gesture) → Gaining Form (heads, bodies incl. age & body
  types, fabric, color) → Advanced Topics (figure incl. hands, feet and
  foreshortened hands, advanced color, advanced perspective) → Becoming a Creator
  (anatomy, character design, animals incl. reptiles & amphibians, creatures,
  machines/vehicles/weapons, environment incl. lighting a scene, worldbuilding) →
  Comics Craft (panels, lettering, line quality & inking tools, inking for print, a
  full page) → Going Further (routines, self-critique, reference ethics & copyright,
  the resource shelf).
- **A built-in timed gesture drill.** Press **⏱ Drill** on the Learn home page (or the
  Start button on any timed step): pick seconds per pose and a pose count, draw from a
  pose site in the next window, and the page clears itself when the timer hits zero.
  Every pose is captured; when the drill ends they're laid out on a contact-sheet
  page that's saved to your Portfolio. `P` pauses, `N` skips ahead.
- **Lessons draw on the page.** Each practice page gets a locked, blue **Guide**
  layer with construction diagrams to work over — they stay on the page for good
  and save with your work. Steps switch you to the right tool and layer, and even
  turn on the perspective grid when a lesson needs it.
- **Study from real sources.** Every lesson cites its references — Drawabox, Proko,
  Loomis and Bridgman (public domain), Line of Action, Posemaniacs, museum
  collections, NASA landform imagery and more — with a free / freemium / paid badge.
  Links open in your browser; you draw in Penshi. Nothing is AI-generated; the
  design chapters teach you to recombine references into your own creations.
- **Progress and Portfolio.** Every step you tick is remembered; every practice
  page is saved to a **Portfolio** with a thumbnail and date, kept apart from your
  comic projects, so you can scroll back through months of work and see the change.

Color lessons use the **color wheel in the Tool tab** — a hue ring with separate
Saturation and Value scales and harmony modes (complementary, analogous, triadic,
split-complementary, tetradic, monochromatic) that works everywhere in the app.

## The workflow it teaches

Bottom-to-top layer stack = the industry pipeline:
**Panels → Pencils (non-photo blue) → Colors → Inks → Lettering.**
Rough on Pencils, ink over it on Inks, toggle Pencils off, Export PNG. The Learn tab
explains why each step exists; the Guides tab gives you page templates and a
draggable 1/2/3-point perspective grid.

## License

Penshi Comic Studio — Copyright (C) 2026 Analytix1

This program is free software: you can redistribute it and/or modify it under
the terms of the **GNU General Public License v3.0** as published by the Free
Software Foundation. It is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
FITNESS FOR A PARTICULAR PURPOSE. See the [LICENSE](LICENSE) file for the full
text.

In plain terms: use it, study it, modify it, share it, even sell it — but if you
distribute a modified version, you must release your source under the GPL too, so
it stays free for everyone.
