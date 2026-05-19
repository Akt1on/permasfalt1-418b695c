// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, cloudflare (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  tanstackStart: {
    spa: { enabled: true },
  },
  vite: {
    plugins: [
      {
        // Cloudflare plugin emits dist/server/index.js, but TanStack's SPA
        // prerender preview server imports dist/server/server.js. Mirror the
        // file so prerender can boot.
        name: "lovable-mirror-ssr-entry",
        apply: "build",
        closeBundle() {
          const src = path.resolve("dist/server/index.js");
          const dest = path.resolve("dist/server/server.js");
          if (fs.existsSync(src) && !fs.existsSync(dest)) {
            fs.copyFileSync(src, dest);
          }
        },
      },
    ],
  },
});
