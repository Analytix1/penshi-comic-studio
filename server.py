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
LEARN_DIR = ROOT / "learn"        # curriculum progress + practice attempts (separate
LEARN_ATTEMPTS = LEARN_DIR / "attempts"   # from projects/, so study work is its own record)
ATTEMPT_ID = re.compile(r"^[\w\-]{1,80}$")

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

    def _drain_body(self):
        """Read and discard this request's body.

        Mandatory before returning early from a POST: on a keep-alive
        connection an unread body is parsed as the NEXT request line, so a
        rejected save (e.g. a project named "Chapter 1: The Fall") poisoned
        the connection and the following request came back 501.
        """
        try:
            remaining = max(0, int(self.headers.get("Content-Length", 0)))
        except ValueError:
            return
        while remaining:
            chunk = self.rfile.read(min(remaining, 64 * 1024))
            if not chunk:
                return
            remaining -= len(chunk)

    def reject(self, obj, status=400):
        """Error reply for a request that may carry a body."""
        self._drain_body()
        self.send_json(obj, status)

    def send_file(self, path: Path, cache: str = "no-cache"):
        ctype = mimetypes.guess_type(str(path))[0] or "application/octet-stream"
        try:
            st = path.stat()
            # Without a validator the browser may serve stale JS after a
            # `git pull`; with one, an unchanged file costs a 304 and no body.
            etag = f'"{int(st.st_mtime)}-{st.st_size}"'
            if self.headers.get("If-None-Match") == etag:
                self.send_response(304)
                self.send_header("ETag", etag)
                self.send_header("Cache-Control", cache)
                self.send_header("Content-Length", "0")
                self.end_headers()
                return
            self.send_response(200)
            self.send_header("Content-Type", ctype)
            self.send_header("Content-Length", str(st.st_size))
            self.send_header("ETag", etag)
            self.send_header("Cache-Control", cache)
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
        if path == "/api/learn/progress":
            return self.learn_progress_get()
        if path == "/api/learn/attempts":
            return self.learn_attempts_list()
        if path.startswith("/api/learn/attempts/"):
            return self.learn_attempt_get(path.removeprefix("/api/learn/attempts/"))
        return self.serve_static(path)

    def do_POST(self):
        path = unquote(urlparse(self.path).path)
        if path.startswith("/api/projects/"):
            return self.save_project(path.removeprefix("/api/projects/"))
        if path == "/api/assets":
            return self.save_asset()
        if path == "/api/learn/progress":
            return self.learn_progress_set()
        if path.startswith("/api/learn/attempts/"):
            return self.learn_attempt_save(path.removeprefix("/api/learn/attempts/"))
        self.reject({"error": "not found"}, 404)

    def do_DELETE(self):
        path = unquote(urlparse(self.path).path)
        if path.startswith("/api/projects/"):
            return self.delete_project(path.removeprefix("/api/projects/"))
        if path.startswith("/api/assets/"):
            return self.delete_asset(path.removeprefix("/api/assets/"))
        if path.startswith("/api/learn/attempts/"):
            return self.learn_attempt_delete(path.removeprefix("/api/learn/attempts/"))
        self.send_json({"error": "not found"}, 404)

    # ---------- learning: progress + practice attempts ----------

    def _read_body_json(self, limit):
        try:
            length = int(self.headers.get("Content-Length", 0))
        except ValueError:
            return None
        if length <= 0:
            return None
        if length > limit:
            # too big to be worth draining; end the connection instead of
            # leaving the body to be misread as the next request
            self.close_connection = True
            return None
        try:
            return json.loads(self.rfile.read(length))
        except json.JSONDecodeError:
            return None

    def learn_progress_get(self):
        f = LEARN_DIR / "progress.json"
        if f.is_file():
            try:
                return self.send_json(json.loads(f.read_text(encoding="utf-8")))
            except (json.JSONDecodeError, OSError):
                pass
        self.send_json({"lessons": {}, "updated": None})

    def learn_progress_set(self):
        data = self._read_body_json(4 * 1024 * 1024)
        if not isinstance(data, dict):
            return self.send_json({"error": "bad progress payload"}, 400)
        data["updated"] = time.time()
        f = LEARN_DIR / "progress.json"
        tmp = f.with_suffix(".json.tmp")
        tmp.write_text(json.dumps(data), encoding="utf-8")
        os.replace(tmp, f)
        self.send_json({"ok": True})

    def learn_attempts_list(self):
        items = []
        for f in sorted(LEARN_ATTEMPTS.glob("*.json"),
                        key=lambda p: p.stat().st_mtime, reverse=True):
            try:
                d = json.loads(f.read_text(encoding="utf-8"))
                d.pop("project", None)      # list is metadata + thumbnail only
                d["id"] = f.stem
                items.append(d)
            except (json.JSONDecodeError, OSError):
                continue
        self.send_json({"attempts": items})

    def learn_attempt_get(self, aid):
        if not ATTEMPT_ID.match(aid):
            return self.send_json({"error": "bad attempt id"}, 400)
        target = safe_child(LEARN_ATTEMPTS, aid + ".json")
        if not (target and target.is_file()):
            return self.send_json({"error": "no such attempt"}, 404)
        self.send_response(200)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(target.stat().st_size))
        self.end_headers()
        with open(target, "rb") as fh:
            while chunk := fh.read(64 * 1024):
                self.wfile.write(chunk)

    def learn_attempt_save(self, aid):
        if not ATTEMPT_ID.match(aid):
            return self.reject({"error": "bad attempt id"})
        data = self._read_body_json(MAX_PROJECT_BYTES)
        if not isinstance(data, dict) or "lessonId" not in data or "project" not in data:
            return self.send_json({"error": "bad attempt payload"}, 400)
        target = safe_child(LEARN_ATTEMPTS, aid + ".json")
        if target is None:
            return self.send_json({"error": "bad attempt id"}, 400)
        tmp = target.with_suffix(".json.tmp")
        tmp.write_text(json.dumps(data), encoding="utf-8")
        os.replace(tmp, target)
        self.send_json({"ok": True, "id": aid})

    def learn_attempt_delete(self, aid):
        if not ATTEMPT_ID.match(aid):
            return self.send_json({"error": "bad attempt id"}, 400)
        target = safe_child(LEARN_ATTEMPTS, aid + ".json")
        if target and target.is_file():
            target.unlink()
            return self.send_json({"ok": True})
        self.send_json({"error": "no such attempt"}, 404)

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
            return self.reject({"error": "bad project name"})
        try:
            length = int(self.headers.get("Content-Length", 0))
        except ValueError:
            length = 0
        if length <= 0:
            return self.send_json({"error": "bad payload size"}, 400)
        if length > MAX_PROJECT_BYTES:
            self.close_connection = True
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
        try:
            length = int(self.headers.get("Content-Length", 0))
        except ValueError:
            length = 0
        if length <= 0:
            return self.send_json({"error": "bad payload size"}, 400)
        if length > 20 * 1024 * 1024:
            self.close_connection = True
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
            return self.send_file(target, cache="private, max-age=3600")
        self.send_json({"error": "not found"}, 404)


def main():
    PROJECTS_DIR.mkdir(exist_ok=True)
    ASSETS_DIR.mkdir(exist_ok=True)
    LEARN_ATTEMPTS.mkdir(parents=True, exist_ok=True)
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
