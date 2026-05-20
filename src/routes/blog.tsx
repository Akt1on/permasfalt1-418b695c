import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Section } from "@/components/site/Section";
import { fetchPosts } from "@/lib/site-data";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Блог — Пермь Асфальт 59 | Полезные статьи об асфальтировании" },
      { name: "description", content: "Статьи и советы об асфальтировании, благоустройстве, укладке плитки и спецтехнике в Перми и Пермском крае." },
      { property: "og:title", content: "Блог — Пермь Асфальт 59" },
      { property: "og:description", content: "Полезные статьи об асфальтировании и благоустройстве." },
      { property: "og:url", content: "https://permasfalt59.ru/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://permasfalt59.ru/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  const { data: posts = [], isLoading } = useQuery({ queryKey: ["posts"], queryFn: fetchPosts });

  return (
    <main>
        <Section
          eyebrow="Журнал"
          title={<>Полезное о <span className="text-gradient-gold">благоустройстве</span></>}
          subtitle="Разбираем технологии, цены, типичные ошибки заказчиков и делимся опытом с реальных объектов."
        >
          {isLoading ? (
            <div className="text-center text-muted-foreground py-20">Загрузка…</div>
          ) : posts.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center text-muted-foreground">Скоро здесь появятся первые статьи.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((p, i) => (
                <motion.div key={p.id}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Link to="/blog/$slug" params={{ slug: p.slug }}
                    className="group block glass rounded-2xl overflow-hidden hover:border-primary/40 hover:-translate-y-1 transition-all duration-500 h-full">
                    {p.cover_image && (
                      <div className="aspect-video overflow-hidden">
                        <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover group-hover:scale-105 transition duration-700" loading="lazy" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground uppercase tracking-widest mb-3">
                        {p.published_at && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(p.published_at).toLocaleDateString("ru-RU")}</span>}
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.read_minutes} мин</span>
                      </div>
                      <h2 className="font-display text-xl font-bold mb-2 group-hover:text-primary transition">{p.title}</h2>
                      {p.excerpt && <p className="text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>}
                      <div className="mt-5 inline-flex items-center gap-1 text-sm text-primary font-semibold">
                        Читать <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </Section>
      </main>
  );
}
