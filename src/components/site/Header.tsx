import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchSettings } from "@/lib/site-data";

const nav = [
  { to: "/", label: "Главная" },
  { to: "/services", label: "Услуги" },
  { to: "/portfolio", label: "Портфолио" },
  { to: "/about", label: "О нас" },
  { to: "/contacts", label: "Контакты" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const phone = settings?.contacts?.phone ?? "+7 (342) 277-77-10";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [path]);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "py-2" : "py-4"}`}>
      <div className="container-x">
        <div className={`glass rounded-2xl flex items-center justify-between px-5 py-3 transition-all ${scrolled ? "shadow-2xl" : ""}`}>
          <Link to="/" className="flex items-center gap-3 group">
            <div className="h-10 w-10 rounded-lg btn-gold grid place-items-center font-bold text-lg">П</div>
            <div className="leading-none">
              <div className="font-display text-lg font-bold tracking-wide">ПЕРМЬ АСФАЛЬТ <span className="text-gradient-gold">59</span></div>
              <div className="text-[11px] text-muted-foreground tracking-widest uppercase">Благоустройство территорий</div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((n) => {
              const active = path === n.to || (n.to !== "/" && path.startsWith(n.to));
              return (
                <Link key={n.to} to={n.to}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${active ? "text-primary" : "text-foreground/80 hover:text-foreground"}`}>
                  {n.label}
                  {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />}
                </Link>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="flex items-center gap-2 text-sm font-semibold hover:text-primary transition">
              <Phone className="h-4 w-4 text-primary" />
              {phone}
            </a>
          </div>

          <button onClick={() => setOpen((v) => !v)} className="lg:hidden p-2 rounded-lg hover:bg-surface-2" aria-label="Меню">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {open && (
          <div className="glass rounded-2xl mt-2 p-4 lg:hidden animate-float-up">
            <nav className="flex flex-col gap-1">
              {nav.map((n) => (
                <Link key={n.to} to={n.to} className="px-4 py-3 rounded-lg hover:bg-surface-2 font-medium">{n.label}</Link>
              ))}
              <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="px-4 py-3 mt-2 btn-gold rounded-lg text-center font-semibold">{phone}</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
