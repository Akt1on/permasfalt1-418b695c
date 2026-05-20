import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { fetchServices } from "@/lib/site-data";
import { Section } from "@/components/site/Section";
import { DynIcon } from "@/components/site/icon";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Услуги — Пермь Асфальт 59" },
      { name: "description", content: "Полный список услуг: асфальтирование, укладка плитки, демонтаж, земляные работы, аренда спецтехники, доставка нерудных материалов." },
      { property: "og:title", content: "Услуги — Пермь Асфальт 59" },
      { property: "og:description", content: "Асфальтирование, тротуарная плитка, демонтаж, земляные работы и спецтехника в Перми." },
      { property: "og:url", content: "https://permasfalt1.lovable.app/services" },
    ],
    links: [{ rel: "canonical", href: "https://permasfalt1.lovable.app/services" }],
  }),
  component: ServicesLayout,
});

function ServicesLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  if (path !== "/services") return <Outlet />;
  return <ServicesIndex />;
}

function ServicesIndex() {
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  return (
    <Section
      eyebrow="Услуги"
      title={<>Все направления <span className="text-gradient-gold">благоустройства</span></>}
      subtitle="Работаем с физическими и юридическими лицами. Договор, гарантия, бесплатный замер."
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((s, i) => (
          <motion.div key={s.id}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Link to="/services/$slug" params={{ slug: s.slug }} className="group block glass rounded-2xl overflow-hidden h-full hover:border-primary/40 transition-all hover:-translate-y-1">
              {s.image_url && (
                <div className="aspect-video overflow-hidden">
                  <img src={s.image_url} alt={s.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                </div>
              )}
              <div className="p-7">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-11 w-11 rounded-xl btn-gold grid place-items-center shrink-0">
                    <DynIcon name={s.icon} className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-xl font-bold leading-tight pt-1">{s.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-5">{s.short_description}</p>
                <div className="flex items-center justify-between pt-5 border-t border-border">
                  <div>
                    <div className="text-[10px] uppercase tracking-widest text-muted-foreground">от</div>
                    <div className="font-display font-bold text-lg text-primary">{Number(s.price_from).toLocaleString("ru-RU")} ₽<span className="text-xs text-muted-foreground"> / {s.price_unit}</span></div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
