"""
Penshi Comic Studio -- local backend server.

Pure Python stdlib (no pip installs). Responsibilities:
  1. Serve the static frontend from ./app
  2. Project persistence API (JSON documents in ./projects)
  3. Stream the user's Drawing Resources folder (PDFs / images) into the app

Run:  python server.py        then open http://localhost:8321
"""

import json
import mimetypes
import os
import re
import sys
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse

ROOT = Path(__file__).resolve().parent
APP_DIR = ROOT / "app"
PROJECTS_DIR = ROOT / "projects"
ASSETS_DIR = ROOT / "assets"      # personal reusable art stamps (eyes, titles, ...)

# The user's personal reference library (PDFs/images shown in the Library tab).
# Resolution order:
#   1. "resourcesDir" in an optional config.json next to this file (gitignored,
#      so personal paths never end up in version control)
#   2. PENSHI_RESOURCES environment variable
#   3. a "drawing-resources" folder inside this project (auto-created)
def _resources_dir() -> Path:
    cfg = ROOT / "config.json"
    if cfg.is_file():
        try:
            value = json.loads(cfg.read_text(encoding="utf-8")).get("resourcesDir")
            if value:
                return Path(value)
        except (json.JSONDecodeError, OSError) as e:
            print(f"[penshi] ignoring bad config.json: {e}", file=sys.stderr)
    if os.environ.get("PENSHI_RESOURCES"):
        return Path(os.environ["PENSHI_RESOURCES"])
    default = ROOT / "drawing-resources"
    default.mkdir(exist_ok=True)
    return default


RESOURCES_DIR = _resources_dir()

PORT = 8321
MAX_PROJECT_BYTES = 200 * 1024 * 1024  # layer bitmaps are stored as data URLs
SAFE_NAME = re.compile(r"^[\w][\w \-\.]{0,80}$")  # project names: no paths, no tricks

mimetypes.add_type("application/javascript", ".js")


def safe_child(base: Path, name: str) -> Path | None:
    """Resolve name inside base; refuse anything that escapes it."""
    try:
        candidate = (base / name).resolve()
    except (OSError, ValueError):
        return None
    if base.resolve() not in candidate.parents and candidate != base.resolve():
        return None
    return candidate


class PenshiHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    # ---------- plumbing ----------

    def send_json(self, obj, status=200):
        body = json.dumps(obj).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def send_file(self, path: Path):
        ctype = mimetypes.guess_type(str(path))[0] or "application/octet-stream"
        try:
            size = path.stat().st_size
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(size))
            # PDFs open in the browser's viewer instead of downloading
            self.send_header("Content-Disposition", "inline")
            self.end_headers()
            with open(path, "rb") as f:
                while chunk := f.read(64 * 1024):
                    self.wfile.write(chunk)
        except (BrokenPipeError, ConnectionAbortedError):
            pass  # client cancelled (e.g. scrubbing through a PDF) -- not an error

    def log_message(self, fmt, *args):
        sys.stderr.write("[penshi] %s\n" % (fmt % args))

    # ---------- routing ----------

    def do_GET(self):
        path = unquote(urlparse(self.path).path)

        if path == "/api/projects":
            return self.list_projects()
        if path.startswith("/api/projects/"):
            return self.load_project(path.removeprefix("/api/projects/"))
        if path == "/api/resources":
            return self.list_resources()
        if path.startswith("/resources/"):
            return self.serve_resource(path.removeprefix("/resources/"))
        if path == "/api/assets":
            return self.list_assets()
        return self.serve_static(path)

    def do_POST(self):
        path = unquote(urlparse(self.path).path)
        if path.startswith("/api/projects/"):
            return self.save_project(path.removeprefix("/api/projects/"))
        if path == "/api/assets":
            return self.save_asset()
        self.send_json({"error": "not found"}, 404)

    def do_DELETE(self):
        path = unquote(urlparse(self.path).path)
        if path.startswith("/api/projects/"):
            return self.delete_project(path.removeprefix("/api/projects/"))
        if path.startswith("/api/assets/"):
            return self.delete_asset(path.removeprefix("/api/assets/"))
        self.send_json({"error": "not found"}, 404)

    # ---------- static frontend ----------

    def serve_static(self, path: str):
        if path in ("/", ""):
            path = "/index.html"
        target = safe_child(APP_DIR, path.lstrip("/"))
        if target and target.is_file():
            return self.send_file(target)
        self.send_json({"error": "not found"}, 404)

    # ---------- projects API ----------

    def list_projects(self):
        items = []
        for f in sorted(PROJECTS_DIR.glob("*.json")):
            try:
                stat = f.stat()
                items.append({
                    "name": f.stem,
                    "modified": stat.st_mtime,
                    "sizeKb": round(stat.st_size / 1024),
                })
            except OSError:
                continue
        self.send_json({"projects": items})

    def load_project(self, name: str):
        if not SAFE_NAME.match(name):
            return self.send_json({"error": "bad project name"}, 400)
        target = safe_child(PROJECTS_DIR, name + ".json")
        if not (target and target.is_file()):
            return self.send_json({"error": "no such project"}, 404)
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(target.stat().st_size))
        self.end_headers()
        with open(target, "rb") as f:
            while chunk := f.read(64 * 1024):
                self.wfile.write(chunk)

    def save_project(self, name: str):
        if not SAFE_NAME.match(name):
            return self.send_json({"error": "bad project name"}, 400)
        length = int(self.headers.get("Content-Length", 0))
        if length <= 0 or length > MAX_PROJECT_BYTES:
            return self.send_json({"error": "bad payload size"}, 400)
        raw = self.rfile.read(length)
        try:
            json.loads(raw)  # validate before trusting it to disk
        except json.JSONDecodeError:
            return self.send_json({"error": "payload is not valid JSON"}, 400)
        target = safe_child(PROJECTS_DIR, name + ".json")
        if target is None:
            return self.send_json({"error": "bad project name"}, 400)
        tmp = target.with_suffix(".json.tmp")
        with open(tmp, "wb") as f:  # atomic-ish write: never half a project
            f.write(raw)
        os.replace(tmp, target)
        self.send_json({"ok": True, "name": name})

    def delete_project(self, name: str):
        if not SAFE_NAME.match(name):
            return self.send_json({"error": "bad project name"}, 400)
        target = safe_child(PROJECTS_DIR, name + ".json")
        if target and target.is_file():
            target.unlink()
            return self.send_json({"ok": True})
        self.send_json({"error": "no such project"}, 404)

    # ---------- personal asset library (reusable art stamps) ----------

    def list_assets(self):
        items = []
        for f in sorted(ASSETS_DIR.glob("*.json"), key=lambda p: p.stat().st_mtime,
                        reverse=True):
            try:
                items.append(json.loads(f.read_text(encoding="utf-8")) | {"id": f.stem})
            except (json.JSONDecodeError, OSError):
                continue
        self.send_json({"assets": items})

    def save_asset(self):
        length = int(self.headers.get("Content-Length", 0))
        if length <= 0 or length > 20 * 1024 * 1024:
            return self.send_json({"error": "bad payload size"}, 400)
        try:
            data = json.loads(self.rfile.read(length))
            name = str(data["name"])[:60] or "asset"
            asset = {"name": name, "png": str(data["png"]),
                     "w": int(data["w"]), "h": int(data["h"])}
        except (json.JSONDecodeError, KeyError, ValueError, TypeError):
            return self.send_json({"error": "bad asset payload"}, 400)
        if not asset["png"].startswith("data:image/png;base64,"):
            return self.send_json({"error": "png must be a png data URL"}, 400)
        asset_id = f"{int(time.time() * 1000)}"
        target = safe_child(ASSETS_DIR, asset_id + ".json")
        target.write_text(json.dumps(asset), encoding="utf-8")
        self.send_json({"ok": True, "id": asset_id})

    def delete_asset(self, asset_id: str):
        if not re.match(r"^\d{6,20}$", asset_id):
            return self.send_json({"error": "bad asset id"}, 400)
        target = safe_child(ASSETS_DIR, asset_id + ".json")
        if target and target.is_file():
            target.unlink()
            return self.send_json({"ok": True})
        self.send_json({"error": "no such asset"}, 404)

    # ---------- personal resource library ----------

    def list_resources(self):
        if not RESOURCES_DIR.is_dir():
            return self.send_json({"resources": [], "folder": str(RESOURCES_DIR),
                                   "missing": True})
        items = []
        for f in sorted(RESOURCES_DIR.iterdir()):
            if f.is_file() and f.suffix.lower() in (
                    ".pdf", ".jpg", ".jpeg", ".png", ".gif", ".webp"):
                items.append({
                    "file": f.name,
                    "kind": "pdf" if f.suffix.lower() == ".pdf" else "image",
                    "sizeMb": round(f.stat().st_size / (1024 * 1024), 1),
                })
        self.send_json({"resources": items, "folder": str(RESOURCES_DIR)})

    def serve_resource(self, name: str):
        target = safe_child(RESOURCES_DIR, name)
        if target and target.is_file():
            return self.send_file(target)
        self.send_json({"error": "not found"}, 404)


def main():
    PROJECTS_DIR.mkdir(exist_ok=True)
    ASSETS_DIR.mkdir(exist_ok=True)
    server = ThreadingHTTPServer(("127.0.0.1", PORT), PenshiHandler)
    print(f"Penshi Comic Studio -> http://localhost:{PORT}")
    print(f"  projects : {PROJECTS_DIR}")
    print(f"  resources: {RESOURCES_DIR}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()


if __name__ == "__main__":
    main()
