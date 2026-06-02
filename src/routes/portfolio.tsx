import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { fetchProjects, STATIC_PROJECTS } from "@/lib/site-data";
import { Section } from "@/components/site/Section";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Портфолио — Пермь Асфальт 59" },
      { name: "description", content: "Галерея реализованных проектов: асфальтирование, плитка, демонтаж, земляные работы и благоустройство в Перми." },
      { name: "keywords", content: "портфолио асфальтирования пермь, выполненные работы по благоустройству, объекты асфальтирования пермский край" },
      { property: "og:title", content: "Портфолио — Пермь Асфальт 59" },
      { property: "og:url", content: "https://permasfalt59.ru/portfolio" },
    ],
    links: [{ rel: "canonical", href: "https://permasfalt59.ru/portfolio" }],
  }),
  component: PortfolioLayout,
});

function PortfolioLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path !== "/portfolio") return <Outlet />;
  return <PortfolioIndex />;
}

function PortfolioIndex() {
  const { data: projects = STATIC_PROJECTS } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects, initialData: STATIC_PROJECTS, staleTime: 60_000 });
  return (
    <Section eyebrow="Портфолио" title={<>Наши <span className="text-gradient-gold">объекты</span></>} subtitle="Каждый проект — индивидуальное решение, фиксированная смета и гарантия.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p, i) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Link to="/portfolio/$slug" params={{ slug: p.slug }} className="group block glass rounded-2xl overflow-hidden hover:border-primary/40 transition">
              <div className="aspect-[4/3] overflow-hidden bg-surface">
                {p.cover_image && (
                  <img src={p.cover_image} alt={p.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                )}
              </div>
              <div className="p-6">
                <div className="text-[10px] uppercase tracking-widest text-primary mb-2">{p.category}</div>
                <h3 className="font-display text-lg font-bold leading-tight">{p.title}</h3>
                {p.location && <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> {p.location}</div>}
                <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-70 group-hover:opacity-100 transition">
                  Смотреть проект <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
