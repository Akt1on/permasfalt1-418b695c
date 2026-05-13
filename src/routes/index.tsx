import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useState } from "react";
import { ArrowRight, Check, Phone, Shield, Clock, Award, Sparkles, Star, Quote } from "lucide-react";
import { fetchServices, fetchProjects, fetchSettings, fetchReviews } from "@/lib/site-data";
import { Section } from "@/components/site/Section";
import { CallbackForm } from "@/components/site/CallbackForm";
import { DynIcon } from "@/components/site/icon";
import heroImg from "@/assets/hero-asphalt.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Пермь Асфальт 59 — асфальтирование, плитка, благоустройство в Перми" },
      { name: "description", content: "Асфальтирование территорий, укладка тротуарной плитки, демонтаж, аренда спецтехники в Перми. Гарантия 3 года, выезд бесплатно." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const { data: projects = [] } = useQuery({ queryKey: ["projects"], queryFn: fetchProjects });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const { data: reviews = [] } = useQuery({ queryKey: ["reviews"], queryFn: fetchReviews });
  const hero = settings?.hero ?? {};
  const about = settings?.about ?? {};
  const phone = settings?.contacts?.phone ?? "+7 (342) 277-77-10";

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-24 min-h-[100vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImg} alt="Асфальтирование" className="h-full w-full object-cover" width={1920} height={1080} />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/30" />
          <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
        </div>

        <div className="container-x relative z-10 pt-32 pb-20 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-xs uppercase tracking-widest text-primary">
                <Sparkles className="h-3.5 w-3.5" /> {hero.badge ?? "Работаем с 2010 года"}
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
              className="mt-6 text-5xl md:text-7xl lg:text-[5.5rem] font-bold leading-[0.95]"
            >
              {(() => {
                const raw = (hero.title ?? "Пермь Асфальт 59").trim();
                const m = raw.match(/^(.*?)(\s*59)\s*$/);
                const base = m ? m[1].trim() : raw;
                return (
                  <>
                    <span className="bg-gradient-to-br from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">{base}</span>{" "}
                    <span className="text-gradient-gold drop-shadow-[0_0_30px_oklch(0.78_0.16_70/0.4)]">59</span>
                  </>
                );
              })()}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
            >
              {hero.subtitle ?? "Асфальтирование, благоустройство и спецтехника в Перми и Пермском крае"}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link to="/services" className="btn-gold rounded-xl px-8 py-4 font-semibold uppercase tracking-wide text-sm flex items-center gap-2">
                Наши услуги <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={`tel:${phone.replace(/[^+\d]/g,'')}`} className="glass rounded-xl px-8 py-4 font-semibold flex items-center gap-2 hover:border-primary/40 transition">
                <Phone className="h-4 w-4 text-primary" /> {phone}
              </a>
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.5 }}
              className="mt-12 grid grid-cols-3 gap-6 max-w-xl"
            >
              {[
                { icon: Award, label: "15+ лет", sub: "на рынке" },
                { icon: Shield, label: "3 года", sub: "гарантии" },
                { icon: Clock, label: "24/7", sub: "выезд" },
              ].map((s, i) => (
                <div key={i} className="border-l border-primary/30 pl-4">
                  <s.icon className="h-5 w-5 text-primary mb-2" />
                  <div className="font-display font-bold text-2xl">{s.label}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">{s.sub}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.4 }}
            className="lg:col-span-5"
          >
            <div className="glass rounded-2xl p-7 shadow-2xl">
              <div className="flex items-center gap-3 mb-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span className="text-xs uppercase tracking-widest text-primary">Бесплатный выезд</span>
              </div>
              <h3 className="font-display text-2xl font-bold mb-1">Получите расчёт за 15 минут</h3>
              <p className="text-sm text-muted-foreground mb-5">Замер и смета — бесплатно</p>
              <CallbackForm source="hero" />
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-6 inset-x-0 flex justify-center">
          <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Скролл вниз</div>
        </div>
      </section>

      {/* SERVICES */}
      <Section
        eyebrow="Что мы делаем"
        title={<>Полный цикл <span className="text-gradient-gold">благоустройства</span></>}
        subtitle="Берём проект под ключ — от замеров до сдачи объекта. Своя техника, опытные бригады, договор и гарантия."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <motion.div key={s.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link to="/services/$slug" params={{ slug: s.slug }}
                className="group relative block overflow-hidden rounded-2xl glass p-7 h-full hover:border-primary/40 transition-all duration-500 hover:-translate-y-1">
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all" />
                <div className="relative">
                  <div className="h-12 w-12 rounded-xl btn-gold grid place-items-center mb-5">
                    <DynIcon name={s.icon} className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-5">{s.short_description}</p>
                  <div className="flex items-center justify-between pt-5 border-t border-border">
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">от</div>
                      <div className="font-display font-bold text-lg text-primary">{Number(s.price_from).toLocaleString("ru-RU")} ₽<span className="text-xs text-muted-foreground"> / {s.price_unit}</span></div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary translate-x-0 group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CALCULATOR */}
      <Calculator />

      {/* WHY US */}
      <Section
        eyebrow="Почему мы"
        title={<>Делаем по-взрослому, <span className="text-gradient-gold">по договору</span></>}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { t: "Соблюдение сроков", d: "Чёткие этапы и контроль на каждом шаге. Заканчиваем когда обещали." },
            { t: "Гарантия 3 года", d: "На все работы под ключ. Устраняем недостатки за свой счёт." },
            { t: "Своя техника", d: "Экскаваторы, катки, самосвалы. Не зависим от подрядчиков." },
            { t: "Прозрачная цена", d: "Фиксируем смету в договоре. Никаких сюрпризов в конце." },
          ].map((b, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-7 hover:border-primary/40 transition"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/15 grid place-items-center mb-5">
                <Check className="h-5 w-5 text-primary" />
              </div>
              <div className="font-display font-bold text-lg mb-2">{b.t}</div>
              <p className="text-sm text-muted-foreground leading-relaxed">{b.d}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* STAGES */}
      <Section eyebrow="Как мы работаем" title="7 этапов до сдачи объекта">
        <div className="grid lg:grid-cols-2 gap-3">
          {["Обзор объекта и замеры","Согласование плана и стоимости","Заключение договора","Подготовка материалов и бригады","Подготовка территории","Производство работ","Сдача объекта и гарантия"].map((step, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center gap-5 glass rounded-2xl px-6 py-5 hover:border-primary/40 transition"
            >
              <div className="font-display text-3xl font-bold text-primary/40 w-12">0{i+1}</div>
              <div className="flex-1 font-medium">{step}</div>
              <Check className="h-5 w-5 text-primary" />
            </motion.div>
          ))}
        </div>
      </Section>

      {/* PORTFOLIO */}
      <Section
        eyebrow="Портфолио"
        title="Наши работы"
        subtitle="Фрагмент выполненных объектов. Полная галерея с фото — в разделе портфолио."
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.slice(0, 6).map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.5, delay: i * 0.05 }}
            >
              <Link to="/portfolio/$slug" params={{ slug: p.slug }} className="group block relative overflow-hidden rounded-2xl aspect-[4/5] glass">
                <img src={p.cover_image ?? ""} alt={p.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="text-[10px] uppercase tracking-widest text-primary mb-2">{p.category}</div>
                  <h3 className="font-display text-xl font-bold leading-tight">{p.title}</h3>
                  <div className="mt-4 flex items-center gap-2 text-sm text-primary opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
                    Смотреть <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/portfolio" className="inline-flex items-center gap-2 glass rounded-xl px-6 py-3 font-semibold hover:border-primary/40 transition">
            Все работы <ArrowRight className="h-4 w-4 text-primary" />
          </Link>
        </div>
      </Section>

      {/* ABOUT / STATS */}
      <Section eyebrow="О компании" title={about.title ?? "Кладём асфальт и плитку с 2010 года"} subtitle={about.text}>
        <div className="grid md:grid-cols-4 gap-5 mt-8">
          {(about.stats ?? []).map((s: any, i: number) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass rounded-2xl p-7 text-center"
            >
              <div className="font-display text-5xl font-bold text-gradient-gold">{s.value}</div>
              <div className="mt-2 text-sm text-muted-foreground uppercase tracking-widest">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* REVIEWS */}
      {reviews.length > 0 && (
        <Section eyebrow="Отзывы" title="Что говорят клиенты" subtitle="Более 500 завершённых проектов в Перми и крае.">
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {reviews.map((r, i) => (
              <motion.div key={r.id}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass rounded-2xl p-7 relative"
              >
                <Quote className="h-8 w-8 text-primary/40 absolute top-5 right-5" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">«{r.content}»</p>
                <div className="mt-5 pt-5 border-t border-border/50">
                  <div className="font-semibold">{r.author_name}</div>
                  {r.author_role && <div className="text-xs text-muted-foreground mt-0.5">{r.author_role}</div>}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* CTA */}
      <section className="py-24">
        <div className="container-x">
          <div className="relative overflow-hidden rounded-3xl glass p-10 md:p-16">
            <div className="absolute inset-0" style={{ background: "var(--gradient-radial)" }} />
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-primary mb-4">Готовы начать?</div>
                <h2 className="text-4xl md:text-5xl font-bold leading-tight">Оставьте заявку — и наш инженер выедет на замер <span className="text-gradient-gold">бесплатно</span></h2>
                <p className="mt-5 text-muted-foreground">Перезвоним в течение 15 минут в рабочее время.</p>
              </div>
              <div><CallbackForm source="cta" /></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Calculator() {
  const [area, setArea] = useState(100);
  const price = area * 1500;
  return (
    <Section eyebrow="Калькулятор" title={<>Прикиньте стоимость <span className="text-gradient-gold">асфальтирования</span></>}>
      <div className="grid lg:grid-cols-2 gap-8 items-stretch">
        <div className="glass rounded-2xl p-8">
          <label className="text-xs uppercase tracking-widest text-muted-foreground">Площадь, м²</label>
          <div className="mt-3 flex items-baseline gap-3">
            <input type="number" min={10} value={area} onChange={(e) => setArea(Math.max(10, Number(e.target.value) || 10))}
              className="bg-transparent border-b-2 border-primary text-5xl font-display font-bold w-40 focus:outline-none" />
            <span className="text-muted-foreground">м²</span>
          </div>
          <input type="range" min={10} max={2000} step={10} value={area} onChange={(e) => setArea(Number(e.target.value))}
            className="mt-6 w-full accent-primary" />
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-surface-2 rounded-xl p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Цена за м²</div>
              <div className="font-display text-2xl font-bold mt-1">от 1 500 ₽</div>
            </div>
            <div className="bg-surface-2 rounded-xl p-5">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Итого</div>
              <div className="font-display text-2xl font-bold text-primary mt-1">{price.toLocaleString("ru-RU")} ₽</div>
            </div>
          </div>
          <p className="mt-5 text-xs text-muted-foreground leading-relaxed">
            * Включено: подготовка основания (снятие грунта, геотекстиль, щебень, утрамбовка), укладка асфальта.
            Финальная стоимость зависит от условий объекта.
          </p>
        </div>
        <div className="glass rounded-2xl p-8 flex flex-col">
          <h3 className="font-display text-2xl font-bold">Получите точный расчёт</h3>
          <p className="text-muted-foreground mt-2 mb-6">Оставьте телефон — пришлём смету в течение 1 рабочего дня.</p>
          <div className="flex-1 flex items-end"><div className="w-full"><CallbackForm source="calculator" /></div></div>
        </div>
      </div>
    </Section>
  );
}
