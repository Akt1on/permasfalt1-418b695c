// @lovable.dev/vite-tanstack-config already includes the core Vite/TanStack plugins.
// Do not add duplicate React, Router, Tailwind or path-alias plugins manually.
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import fs from "node:fs";
import path from "node:path";

export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    spa: { enabled: true, prerender: { outputPath: "/_shell" } },
    prerender: { enabled: true, failOnError: false },
    sitemap: { enabled: false },
    pages: ["/", "/services", "/portfolio", "/blog", "/about", "/contacts"].map((path) => ({
      path,
      prerender: { enabled: true, crawlLinks: false, retryCount: 0 },
    })),
  },
  vite: {
    define: {
      "import.meta.env.VITE_SUPABASE_URL": JSON.stringify(process.env.VITE_SUPABASE_URL ?? "https://cemvklfruuuzhhvzrbrb.supabase.co"),
      "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify(process.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJjZW12a2xmcnV1dXpoaHZ6cmJyYiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzc4NjU4NTM4LCJleHAiOjIwOTQyMzQ1Mzh9.kcycRWTB7TH6hnx9Y-NOkOMQBhpjAHADl_-P7Y47nzM"),
      "import.meta.env.VITE_SUPABASE_PROJECT_ID": JSON.stringify(process.env.VITE_SUPABASE_PROJECT_ID ?? "cemvklfruuuzhhvzrbrb"),
    },
    plugins: [
      {
        // TanStack's SPA prerender may expect server.js while the build emits index.js.
        // Mirror the entry so prerender can boot reliably on static Vercel builds.
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
