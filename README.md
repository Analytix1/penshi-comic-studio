# 🖋 Penshi — Comic Studio

A local, browser-based comic/graphic-novel studio. No accounts, no cloud, **no AI image
generation** — it's a drafting table that teaches real comic craft while you draw.
Everything runs on your machine: a dependency-free Python server plus vanilla JS.

## Getting started (no coding experience needed)

Penshi runs entirely on your own computer. No account, no cloud — after the
download, it works offline and nothing ever leaves your machine.

### Step 1 — Download Penshi

- Near the top of this GitHub page, click the green **`<> Code`** button, then
  **Download ZIP**.
- Find the downloaded `penshi-comic-studio-main.zip`, right-click it →
  **Extract All…**, and put the folder somewhere easy to find (like Documents).

*(If you're comfortable with Git: `git clone https://github.com/Analytix1/penshi-comic-studio.git` works too, and lets you update later with `git pull`.)*

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

A guided tour starts on your first visit. Never drawn before? Open the **Learn**
tab → **🎓 Draw School**.

### Where your work lives

Saved comics go in the `projects` folder inside the Penshi folder, and saved
art stamps go in `assets`. Back those two folders up and you've backed up
everything. The server only listens on `127.0.0.1` (your own machine) — it is
not visible to your network or the internet.

### Troubleshooting

| Problem | Fix |
|---|---|
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
      ├─ reference.js Learn lessons + Library tab
      └─ main.js      UI wiring, shortcuts, tour, boot
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

## Draw School (for total beginners)

Learn tab → **🎓 Draw School**: a 9-lesson hands-on course — line control, shapes,
forms, light & shadow, perspective, gesture, heads, figures, and finally your first
comic page. Lessons project faint example constructions straight onto the canvas
(a light table) for you to practice over, auto-select the right tool and layer,
and remember which lessons you've finished.

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
