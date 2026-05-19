import fs from "node:fs";
import path from "node:path";

// TanStack Start SPA prerender writes the shell to dist/client/_shell.html.
// For static hosts (Vercel) we need an index.html at the SPA fallback path.
const clientDir = path.resolve("dist/client");
const shell = path.join(clientDir, "_shell.html");
const indexHtml = path.join(clientDir, "index.html");

if (!fs.existsSync(shell)) {
  console.error("[finalize-build] dist/client/_shell.html missing — build failed before prerender.");
  process.exit(1);
}

fs.copyFileSync(shell, indexHtml);
console.log("[finalize-build] Wrote dist/client/index.html from _shell.html");