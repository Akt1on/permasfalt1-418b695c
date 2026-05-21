import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { fetchProjects } from "@/lib/site-data";
import { Section } from "@/components/site/Section";

const PORTFOLIO_URL = "https://permasfalt59.ru/portfolio";
const PORTFOLIO_TITLE = "Портфолио — Пермь Асфальт 59";
const PORTFOLIO_DESCRIPTION = "Галерея реализованных проектов: асфальтирование, плитка, демонтаж, земляные работы и благоустройство в Перми.";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: PORTFOLIO_TITLE },
      { name: "description", content: PORTFOLIO_DESCRIPTION },
      { property: "og:title", content: PORTFOLIO_TITLE },
      { property: "og:description", content: PORTFOLIO_DESCRIPTION },
      { property: "og:url", content: PORTFOLIO_URL },
      { property: "og:site_name", content: "Пермь Асфальт 59" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PORTFOLIO_TITLE },
      { name: "twitter:description", content: PORTFOLIO_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: PORTFOLIO_URL }],
  }),
  component: PortfolioLayout,
});

function PortfolioLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path !== "/portfolio") return <Outlet />;
  return <PortfolioIndex />;
}

function PortfolioIndex() {
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  return (
    <Section eyebrow="Портфолио" title={<>Наши <span className="text-gradient-gold">объекты</span></>} subtitle="Каждый проект — индивидуальное решение, фиксированная смета и гарантия.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((p, i) => (
          <motion.div key={p.id}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Link to="/portfolio/$slug" params={{ slug: p.slug }} className="group block glass rounded-2xl overflow-hidden hover:border-primary/40 transition">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={p.cover_image ?? ""} alt={p.title} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
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
