import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings, fetchServices } from "@/lib/site-data";

export function Footer() {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: fetchServices });
  const c = settings?.contacts ?? {};
  return (
    <footer className="relative mt-32 border-t border-border bg-surface">
      <div className="container-x py-16 grid lg:grid-cols-4 gap-12">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg btn-gold grid place-items-center font-bold">П</div>
            <div>
              <div className="font-display font-bold text-lg">ПЕРМЬ АСФАЛЬТ <span className="text-gradient-gold">59</span></div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">Благоустройство</div>
            </div>
          </div>
          <p className="mt-5 text-sm text-muted-foreground leading-relaxed">
            Профессиональное благоустройство территорий, асфальтирование и спецтехника в Перми с 2010 года.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-primary mb-4">Услуги</h4>
          <ul className="space-y-2 text-sm">
            {services.slice(0, 6).map((s) => (
              <li key={s.id}><Link to="/services/$slug" params={{ slug: s.slug }} className="text-muted-foreground hover:text-primary transition">{s.title}</Link></li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-primary mb-4">Компания</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-muted-foreground hover:text-primary transition">О нас</Link></li>
            <li><Link to="/portfolio" className="text-muted-foreground hover:text-primary transition">Портфолио</Link></li>
            <li><Link to="/contacts" className="text-muted-foreground hover:text-primary transition">Контакты</Link></li>
            <li><Link to="/admin" className="text-muted-foreground hover:text-primary transition">Админ-панель</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm uppercase tracking-widest text-primary mb-4">Контакты</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            {c.phone && <li className="flex gap-3"><Phone className="h-4 w-4 mt-0.5 text-primary" /><a href={`tel:${c.phone.replace(/[^+\d]/g,'')}`} className="hover:text-primary">{c.phone}</a></li>}
            {c.email && <li className="flex gap-3"><Mail className="h-4 w-4 mt-0.5 text-primary" /><a href={`mailto:${c.email}`} className="hover:text-primary">{c.email}</a></li>}
            {c.address && <li className="flex gap-3"><MapPin className="h-4 w-4 mt-0.5 text-primary" />{c.address}</li>}
            {c.work_hours && <li className="flex gap-3"><Clock className="h-4 w-4 mt-0.5 text-primary" />{c.work_hours}</li>}
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-x py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>© {new Date().getFullYear()} Пермь Асфальт 59 • permasfalt59.ru</div>
          <div>Все права защищены</div>
        </div>
      </div>
    </footer>
  );
}
