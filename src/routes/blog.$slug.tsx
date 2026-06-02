import { createFileRoute, Link, useParams, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { CallbackForm } from "@/components/site/CallbackForm";
import { fetchPost } from "@/lib/site-data";

const BASE = "https://permasfalt59.ru";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const post = await fetchPost(params.slug);
    if (!post || !post.is_published) throw notFound();
    return { post };
  },
  head: ({ loaderData, params }) => {
    const p = loaderData?.post;
    const title = p ? `${p.title} — Блог Пермь Асфальт 59` : "Статья";
    const description = p?.excerpt?.slice(0, 160) ?? "";
    const url = `${BASE}/blog/${params.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        ...(p?.keywords ? [{ name: "keywords", content: p.keywords }] : []),
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:site_name", content: "Пермь Асфальт 59" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        ...(p?.cover_image ? [{ property: "og:image", content: p.cover_image }] : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: p ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          description: p.excerpt,
          image: p.cover_image,
          datePublished: p.published_at,
          dateModified: p.updated_at,
          author: { "@type": "Organization", name: "Пермь Асфальт 59" },
          publisher: { "@type": "Organization", name: "Пермь Асфальт 59" },
          mainEntityOfPage: url,
        }),
      }] : undefined,
    };
  },
  notFoundComponent: () => (
    <div className="container-x py-32 text-center">
      Статья не найдена. <Link to="/blog" className="text-primary">В блог</Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="container-x py-32 text-center text-muted-foreground">{error.message}</div>
  ),
  component: PostPage,
});

function PostPage() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const { data: post } = useQuery({ queryKey: ["post", slug], queryFn: () => fetchPost(slug) });
  const initial = Route.useLoaderData().post;
  const p = post ?? initial;

  return (
    <main>
        <article className="container-x py-12 max-w-3xl">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4" /> К списку статей
          </Link>
          <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest mb-4">
            {p.published_at && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(p.published_at).toLocaleDateString("ru-RU")}</span>}
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.read_minutes} мин чтения</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-6">{p.title}</h1>
          {p.excerpt && <p className="text-xl text-muted-foreground mb-8 leading-relaxed">{p.excerpt}</p>}
          {p.cover_image && (
            <img src={p.cover_image} alt={p.title} className="w-full aspect-video object-cover rounded-2xl mb-10" />
          )}
          {p.content && (
            <div
              className="prose prose-invert max-w-none prose-headings:font-display prose-headings:text-foreground prose-a:text-primary prose-strong:text-foreground prose-p:text-muted-foreground prose-li:text-muted-foreground prose-img:rounded-xl"
              dangerouslySetInnerHTML={{ __html: renderContent(p.content) }}
            />
          )}
          <div className="mt-16 glass rounded-2xl p-7">
            <h3 className="font-display text-2xl font-bold mb-2">Нужен расчёт по вашему объекту?</h3>
            <p className="text-sm text-muted-foreground mb-5">Замер и смета — бесплатно. Перезвоним в течение 15 минут.</p>
            <CallbackForm source={`blog:${slug}`} />
          </div>
        </article>
      </main>
  );
}

// Minimal markdown-ish to HTML: paragraphs, headings, lists, bold. Safe enough for trusted admin content.
function renderContent(src: string): string {
  const lines = src.split(/\r?\n/);
  const out: string[] = [];
  let inList = false;
  const flushList = () => { if (inList) { out.push("</ul>"); inList = false; } };
  for (const raw of lines) {
    const l = raw.trim();
    if (!l) { flushList(); continue; }
    if (l.startsWith("### ")) { flushList(); out.push(`<h3>${inline(l.slice(4))}</h3>`); continue; }
    if (l.startsWith("## ")) { flushList(); out.push(`<h2>${inline(l.slice(3))}</h2>`); continue; }
    if (l.startsWith("# ")) { flushList(); out.push(`<h1>${inline(l.slice(2))}</h1>`); continue; }
    if (l.startsWith("- ") || l.startsWith("* ")) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${inline(l.slice(2))}</li>`);
      continue;
    }
    flushList();
    if (l.startsWith("<")) { out.push(l); continue; }
    out.push(`<p>${inline(l)}</p>`);
  }
  flushList();
  return out.join("\n");
}
function inline(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>');
}
