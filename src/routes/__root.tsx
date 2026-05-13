import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext, useRouter, useRouterState, HeadContent, Scripts, Link } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="min-h-screen grid place-items-center bg-background px-4">
      <div className="text-center">
        <div className="text-[10rem] font-display font-bold leading-none text-gradient-gold">404</div>
        <p className="text-muted-foreground mt-2 mb-6">Страница не найдена</p>
        <Link to="/" className="btn-gold rounded-lg px-6 py-3 font-semibold inline-block">На главную</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="min-h-screen grid place-items-center bg-background px-4 text-center">
      <div>
        <h1 className="text-2xl font-bold">Что-то пошло не так</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-6 btn-gold rounded-lg px-6 py-3 font-semibold">Попробовать снова</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Пермь Асфальт 59 — асфальтирование и благоустройство в Перми" },
      { name: "description", content: "Асфальтирование, укладка плитки, демонтаж, спецтехника и благоустройство в Перми и Пермском крае. Гарантия 3 года." },
      { property: "og:title", content: "Пермь Асфальт 59" },
      { property: "og:description", content: "Асфальтирование и благоустройство территорий в Перми с 2010 года." },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = path.startsWith("/admin");
  return (
    <QueryClientProvider client={queryClient}>
      {!isAdmin && <Header />}
      <main className={!isAdmin ? "pt-24" : ""}>
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      <Toaster theme="dark" position="top-right" />
    </QueryClientProvider>
  );
}
