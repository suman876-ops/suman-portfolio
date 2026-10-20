#!/usr/bin/env python3
"""
app.py — a tiny zero-dependency static file server (Python 3).

    python3 server/app.py            # serves on http://localhost:3000
    python3 server/app.py 8080       # custom port
    PORT=8080 python3 server/app.py  # or via environment variable

Uses only the standard library (http.server), so there is nothing to install.
Handy on machines without Node.js.
"""

import os
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

# the site lives one level up from this file
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORT = int(sys.argv[1] if len(sys.argv) > 1 else os.environ.get("PORT", 3000))


class Handler(SimpleHTTPRequestHandler):
    """Serves the site and quiets the default noisy logging a little."""

    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".json": "application/json",
        ".webp": "image/webp",
        ".woff2": "font/woff2",
    }

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s\n" % (fmt % args))


def main():
    handler = partial(Handler, directory=ROOT)
    with ThreadingHTTPServer(("", PORT), handler) as httpd:
        print(f"\n  Suman.dev portfolio running at  http://localhost:{PORT}\n")
        print(f"  Serving files from {ROOT}\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  Stopped.\n")


if __name__ == "__main__":
    main()
