import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Award, Shield, Truck, Users } from "lucide-react";
import { fetchSettings } from "@/lib/site-data";
import { Section } from "@/components/site/Section";

const ABOUT_URL = "https://permasfalt59.ru/about";
const ABOUT_TITLE = "О компании — Пермь Асфальт 59";
const ABOUT_DESCRIPTION = "Пермь Асфальт 59 — команда профессионалов по благоустройству, асфальтированию и спецтехнике в Перми. Договор, гарантия и опыт с 2010 года.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: ABOUT_TITLE },
      { name: "description", content: ABOUT_DESCRIPTION },
      { property: "og:title", content: ABOUT_TITLE },
      { property: "og:description", content: ABOUT_DESCRIPTION },
      { property: "og:url", content: ABOUT_URL },
      { property: "og:site_name", content: "Пермь Асфальт 59" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: ABOUT_TITLE },
      { name: "twitter:description", content: ABOUT_DESCRIPTION },
    ],
    links: [{ rel: "canonical", href: ABOUT_URL }],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const about = settings?.about ?? {};
  return (
    <>
      <Section eyebrow="О нас" title={about.title ?? "О компании"} subtitle={about.text}>
        <div className="grid md:grid-cols-4 gap-5 mb-12">
          {(about.stats ?? []).map((s: any, i: number) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-7 text-center">
              <div className="font-display text-5xl font-bold text-gradient-gold">{s.value}</div>
              <div className="mt-2 text-sm text-muted-foreground uppercase tracking-widest">{s.label}</div>
            </motion.div>
          ))}
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { i: Award, t: "Опыт", d: "Более 15 лет на рынке благоустройства Пермского края" },
            { i: Shield, t: "Гарантия", d: "3 года на работы под ключ. Договор и акт сдачи" },
            { i: Truck, t: "Своя техника", d: "Парк современной спецтехники — без посредников" },
            { i: Users, t: "Команда", d: "Опытные инженеры, бригадиры и операторы" },
          ].map((b, i) => {
            const Icon = b.i;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="glass rounded-2xl p-7">
                <div className="h-11 w-11 rounded-xl btn-gold grid place-items-center mb-4"><Icon className="h-5 w-5" /></div>
                <div className="font-display font-bold text-lg mb-2">{b.t}</div>
                <p className="text-sm text-muted-foreground">{b.d}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
