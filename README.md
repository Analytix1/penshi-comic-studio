# 🖋 Inkwell — Comic Studio

A local, browser-based comic/graphic-novel studio. No accounts, no cloud, **no AI image
generation** — it's a drafting table that teaches real comic craft while you draw.

## Run it

Requires Python 3.8+ (standard library only — no pip installs).

```powershell
cd path\to\inkwell-comic-studio
python server.py
```

Then open **http://localhost:8321** (Edge or Chrome recommended for full stylus
support). On Windows you can just double-click **Start Inkwell.bat** instead.
The server binds to 127.0.0.1 only — nothing is exposed to your network.

## Surface Slim Pen 2

Works natively, no drivers or settings:
- **Pressure** → line width (the Ink tool's whole personality)
- **Tilt** → shown live in the top-right telemetry readout
- **Tail eraser** → flips to the eraser automatically (`buttons & 32`)
- **Barrel button** → also erases while held
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
| Ctrl+Z / Y | Undo / redo | Ctrl+S / O | Save / open |
| Ctrl+E | Export PNG | Ctrl+0 | Fit page |
| Wheel | Zoom at cursor | Del | Delete selected object |

## Draw School (for total beginners)

Learn tab → **🎓 Draw School**: a 9-lesson hands-on course — line control, shapes,
forms, light & shadow, perspective, gesture, heads, figures, and finally your first
comic page. Lessons project faint example constructions straight onto the canvas
(a light table) for you to practice over, auto-select the right tool and layer,
and remember which lessons you've finished.

## The workflow it teaches

Bottom-to-top layer stack = the industry pipeline:
**Panels → Pencils (non-photo blue) → Colors → Inks → Lettering.**
Rough on Pencils, ink over it on Inks, hide Pencils' 👁, Export PNG. The Learn tab
explains why each step exists; the Guides tab gives you page templates and a
draggable 1/2/3-point perspective grid.
