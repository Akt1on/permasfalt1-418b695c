import { Link, useRouterState } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchServices, fetchSettings } from "@/lib/site-data";

const nav = [
  { to: "/", label: "Главная" },
  { to: "/services", label: "Услуги" },
  { to: "/portfolio", label: "Портфолио" },
  { to: "/blog", label: "Блог" },
  { to: "/about", label: "О нас" },
  { to: "/contacts", label: "Контакты" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: fetchServices, staleTime: 1000 * 60 * 5 });
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

          <nav className="hidden lg:flex items-center gap-1 relative">
            {nav.map((n) => {
              const active = path === n.to || (n.to !== "/" && path.startsWith(n.to));
              if (n.to === "/services") {
                return (
                  <div key={n.to} className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
                    <Link to={n.to}
                      className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors ${active ? "text-primary" : "text-foreground/80 hover:text-foreground"}`}>
                      {n.label}
                      {active && <span className="absolute inset-x-3 -bottom-0.5 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />}
                    </Link>
                    <AnimatePresence>
                      {servicesOpen && services.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.18 }}
                          className="absolute left-0 top-full mt-3 w-[28rem] rounded-3xl glass border border-border/50 shadow-2xl p-5"
                        >
                          <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground mb-3">Услуги</div>
                          <div className="grid grid-cols-2 gap-3">
                            {services.slice(0, 6).map((service) => (
                              <Link key={service.id} to="/services/$slug" params={{ slug: service.slug }}
                                className="rounded-2xl border border-border/60 px-4 py-3 text-sm text-foreground/90 hover:border-primary/40 hover:bg-primary/5 transition"
                              >
                                {service.title}
                              </Link>
                            ))}
                          </div>
                          <div className="mt-4 text-xs text-muted-foreground">Полный каталог услуг в разделе «Услуги».</div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }
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

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18 }}
              className="glass rounded-2xl mt-2 p-4 lg:hidden"
            >
              <nav className="flex flex-col gap-1">
                {nav.map((n) => (
                  <Link key={n.to} to={n.to} className="px-4 py-3 rounded-lg hover:bg-surface-2 font-medium">{n.label}</Link>
                ))}
                <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="px-4 py-3 mt-2 btn-gold rounded-lg text-center font-semibold">{phone}</a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
