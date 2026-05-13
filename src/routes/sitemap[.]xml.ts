import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { supabase } from "@/integrations/supabase/client";

const BASE_URL = "https://permasfalt59.ru";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [{ data: services }, { data: projects }] = await Promise.all([
          supabase.from("services").select("slug,updated_at").eq("is_active", true),
          supabase.from("projects").select("slug,updated_at").eq("is_active", true),
        ]);

        const staticEntries = [
          { path: "/", priority: "1.0", changefreq: "weekly" },
          { path: "/services", priority: "0.9", changefreq: "weekly" },
          { path: "/portfolio", priority: "0.8", changefreq: "weekly" },
          { path: "/about", priority: "0.6", changefreq: "monthly" },
          { path: "/contacts", priority: "0.7", changefreq: "monthly" },
        ];

        const dynamicEntries = [
          ...(services ?? []).map((s: any) => ({ path: `/services/${s.slug}`, lastmod: s.updated_at, priority: "0.8", changefreq: "monthly" })),
          ...(projects ?? []).map((p: any) => ({ path: `/portfolio/${p.slug}`, lastmod: p.updated_at, priority: "0.7", changefreq: "monthly" })),
        ];

        const urls = [...staticEntries, ...dynamicEntries].map((e: any) =>
          [
            `  <url>`,
            `    <loc>${BASE_URL}${e.path}</loc>`,
            e.lastmod ? `    <lastmod>${new Date(e.lastmod).toISOString()}</lastmod>` : null,
            e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
            e.priority ? `    <priority>${e.priority}</priority>` : null,
            `  </url>`,
          ].filter(Boolean).join("\n")
        );

        const xml = [
          `<?xml version="1.0" encoding="UTF-8"?>`,
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
          ...urls,
          `</urlset>`,
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});