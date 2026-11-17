#!/usr/bin/env python3
"""Serve the built site under its Pages project prefix, including real 404 responses."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit

ROOT = Path(__file__).resolve().parents[1] / '_site'
PREFIX = '/blog-version-2'


class Handler(SimpleHTTPRequestHandler):
    def log_message(self, format, *args):
        pass  # Missing images are documented; avoid flooding test output with expected 404s.

    def do_GET(self):
        parsed = urlsplit(self.path)
        if parsed.path == PREFIX:
            self.send_response(301)
            self.send_header('Location', PREFIX + '/')
            self.end_headers()
            return
        if not parsed.path.startswith(PREFIX + '/'):
            self.send_error(404)
            return
        self.path = self.path[len(PREFIX):]
        super().do_GET()

    def send_error(self, code, message=None, explain=None):
        if code == 404 and (ROOT / '404.html').exists():
            body = (ROOT / '404.html').read_bytes()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(body)
        else:
            super().send_error(code, message, explain)


if __name__ == '__main__':
    ThreadingHTTPServer(('0.0.0.0', 8766), partial(Handler, directory=str(ROOT))).serve_forever()
