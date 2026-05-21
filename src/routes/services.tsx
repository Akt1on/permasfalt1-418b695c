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
      { property: "og:site_name", content: "Пермь Асфальт 59" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Услуги — Пермь Асфальт 59" },
      { name: "twitter:description", content: "Асфальтирование, тротуарная плитка, демонтаж, земляные работы и спецтехника в Перми." },
      { property: "og:url", content: "https://permasfalt59.ru/services" },
    ],
    links: [{ rel: "canonical", href: "https://permasfalt59.ru/services" }],
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
    <>
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/95" />
        <div className="container-x relative z-10">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="glass rounded-3xl border border-border/50 p-12 shadow-2xl">
            <div className="max-w-3xl">
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-3">Услуги</div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">Комплексное благоустройство и дорожные работы в Перми</h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed">Выберите направление работ: асфальтирование, укладка тротуарной плитки, демонтаж, аренда спецтехники и другие профильные услуги под ключ.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Section
        eyebrow="Услуги"
        title={<>Все направления <span className="text-gradient-gold">благоустройства</span></>}
        subtitle="Работаем с физическими и юридическими лицами. Договор, гарантия, бесплатный замер."
      >
        <div className="glass rounded-3xl border border-border/60 p-6 mb-10">
          <div className="text-sm uppercase tracking-[0.3em] text-primary mb-4">Подменю услуг</div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {services.map((service) => (
              <Link key={service.id} to="/services/$slug" params={{ slug: service.slug }} className="rounded-3xl border border-border/60 px-4 py-4 text-sm text-foreground/90 hover:border-primary/40 hover:bg-primary/5 transition">
                <div className="font-semibold">{service.title}</div>
                <div className="mt-2 text-xs text-muted-foreground line-clamp-2">{service.short_description}</div>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div key={s.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.45, delay: i * 0.05 }}
            >
              <Link to="/services/$slug" params={{ slug: s.slug }} className="group block glass rounded-3xl overflow-hidden h-full border border-border/40 transition-all duration-500 hover:border-primary/40 hover:shadow-glow-gold">
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
    </>
  );
}
