#!/usr/bin/env node
/* ============================================================================
 * server.js — a tiny zero-dependency static file server (Node.js).
 *
 *   node server/server.js            # serves on http://localhost:3000
 *   node server/server.js 8080       # custom port
 *   PORT=8080 node server/server.js  # or via environment variable
 *
 * No npm install required — it only uses Node's built-in `http` and `fs`.
 * ==========================================================================*/

const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = Number(process.argv[2] || process.env.PORT || 3000);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8"
};

const server = http.createServer((req, res) => {
  // strip the query string and decode the path
  let urlPath = decodeURIComponent(req.url.split("?")[0]);
  if (urlPath === "/") urlPath = "/index.html";

  // resolve safely inside ROOT (block path traversal)
  const filePath = path.join(ROOT, urlPath);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    return res.end("403 Forbidden");
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end("<h1>404 — Not Found</h1><p>" + urlPath + "</p>");
    }
    const type = MIME[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-cache" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  Suman.dev portfolio running at  http://localhost:${PORT}\n`);
  console.log(`  Serving files from ${ROOT}\n`);
});
