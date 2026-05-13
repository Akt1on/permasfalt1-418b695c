import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Wrench, FolderKanban, Inbox, Settings, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

const items = [
  { to: "/admin", label: "Обзор", icon: LayoutDashboard },
  { to: "/admin/services", label: "Услуги", icon: Wrench },
  { to: "/admin/projects", label: "Портфолио", icon: FolderKanban },
  { to: "/admin/leads", label: "Заявки", icon: Inbox },
  { to: "/admin/settings", label: "Настройки", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const nav = useNavigate();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/auth" });
  }, [loading, user, nav]);

  if (loading) return <div className="min-h-screen grid place-items-center text-muted-foreground">Загрузка…</div>;
  if (!user) return null;
  if (!isAdmin) return (
    <div className="min-h-screen grid place-items-center px-4 text-center">
      <div className="glass rounded-2xl p-8 max-w-md">
        <h2 className="font-display text-2xl font-bold mb-2">Доступ ограничен</h2>
        <p className="text-sm text-muted-foreground mb-4">У вашего аккаунта нет роли администратора. Назначьте её в таблице user_roles через бэкенд.</p>
        <button onClick={async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); }} className="btn-gold rounded-lg px-5 py-2.5 font-semibold">Выйти</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 border-r border-border bg-surface p-5 flex flex-col">
        <Link to="/" className="font-display font-bold text-lg mb-8">ПЕРМЬ АСФАЛЬТ <span className="text-gradient-gold">59</span></Link>
        <nav className="flex-1 space-y-1">
          {items.map((it) => {
            const active = path === it.to;
            return (
              <Link key={it.to} to={it.to} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${active ? "bg-primary text-primary-foreground" : "hover:bg-surface-2"}`}>
                <it.icon className="h-4 w-4" /> {it.label}
              </Link>
            );
          })}
        </nav>
        <button onClick={async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); }} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm hover:bg-surface-2 text-muted-foreground">
          <LogOut className="h-4 w-4" /> Выйти
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
