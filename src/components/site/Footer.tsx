import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings, fetchServices } from "@/lib/site-data";
import { getServiceImageUrl } from "@/lib/service-images";

export function Footer() {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const c = settings?.contacts ?? {};
  return (
    <footer className="relative mt-32 border-t border-border/50 bg-background/80 backdrop-blur-2xl">
      <div className="container-x py-16 grid lg:grid-cols-[1.3fr_0.95fr_0.95fr_1.1fr] gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl btn-gold grid place-items-center font-bold text-lg">П</div>
            <div>
              <div className="font-display font-bold text-lg">ПЕРМЬ АСФАЛЬТ <span className="text-gradient-gold">59</span></div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-widest">Благоустройство территорий</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Профессиональное благоустройство территорий, асфальтирование и спецтехника в Перми с 2010 года.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="glass rounded-3xl p-4 border border-border/40">
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Сроки</div>
              <div className="font-semibold">Точно по графику</div>
            </div>
            <div className="glass rounded-3xl p-4 border border-border/40">
              <div className="text-xs uppercase tracking-[0.3em] text-primary mb-2">Гарантия</div>
              <div className="font-semibold">3 года на работы</div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-primary mb-4">Услуги</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {services.slice(0, 6).map((s) => (
              <li key={s.id}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary shrink-0" />
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-primary mb-4">Компания</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary transition">О нас</Link></li>
            <li><Link to="/portfolio" className="hover:text-primary transition">Портфолио</Link></li>
            <li><Link to="/contacts" className="hover:text-primary transition">Контакты</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-primary transition">Конфиденциальность</Link></li>
            <li><Link to="/cookie-policy" className="hover:text-primary transition">Cookies</Link></li>
            <li><Link to="/admin" className="hover:text-primary transition">Админ-панель</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-display text-sm uppercase tracking-widest text-primary mb-4">Контакты</h4>
          <div className="space-y-3 text-sm text-muted-foreground">
            {c.phone && <div className="flex items-start gap-3"><Phone className="h-4 w-4 mt-0.5 text-primary" /><a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`} className="hover:text-primary">{c.phone}</a></div>}
            {c.email && <div className="flex items-start gap-3"><Mail className="h-4 w-4 mt-0.5 text-primary" /><a href={`mailto:${c.email}`} className="hover:text-primary">{c.email}</a></div>}
            {c.address && <div className="flex items-start gap-3"><MapPin className="h-4 w-4 mt-0.5 text-primary" />{c.address}</div>}
            {c.work_hours && <div className="flex items-start gap-3"><Clock className="h-4 w-4 mt-0.5 text-primary" />{c.work_hours}</div>}
          </div>
        </div>
      </div>
      <div className="border-t border-border/40">
        <div className="container-x py-6 flex flex-col gap-3 items-center justify-between text-xs text-muted-foreground md:flex-row">
          <div>© {new Date().getFullYear()} Пермь Асфальт 59 • permasfalt59.ru</div>
          <div>Все права защищены</div>
        </div>
      </div>
    </footer>
  );
}
