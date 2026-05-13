import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Check, Phone } from "lucide-react";
import { fetchService, fetchPricing, fetchSettings } from "@/lib/site-data";
import { CallbackForm } from "@/components/site/CallbackForm";
import { DynIcon } from "@/components/site/icon";

export const Route = createFileRoute("/services/$slug")({
  component: ServicePage,
});

function ServicePage() {
  const { slug } = useParams({ from: "/services/$slug" });
  const { data: service, isLoading } = useQuery({ queryKey: ["service", slug], queryFn: () => fetchService(slug) });
  const { data: pricing = [] } = useQuery({
    queryKey: ["pricing", service?.id], queryFn: () => fetchPricing(service!.id), enabled: !!service?.id,
  });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const phone = settings?.contacts?.phone ?? "+7 (342) 277-77-10";

  if (isLoading) return <div className="container-x py-32 text-center text-muted-foreground">Загрузка…</div>;
  if (!service) return <div className="container-x py-32 text-center">Услуга не найдена. <Link to="/services" className="text-primary">К списку услуг</Link></div>;

  return (
    <>
      <section className="relative overflow-hidden -mt-24 pt-32 pb-16">
        {service.image_url && (
          <div className="absolute inset-0">
            <img src={service.image_url} alt={service.title} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/50" />
          </div>
        )}
        <div className="container-x relative z-10 pt-16 pb-10">
          <Link to="/services" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-8">
            <ArrowLeft className="h-4 w-4" /> Все услуги
          </Link>
          <div className="flex items-start gap-5">
            <div className="h-14 w-14 rounded-xl btn-gold grid place-items-center shrink-0">
              <DynIcon name={service.icon} className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">{service.title}</h1>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl">{service.short_description}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-x grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <div className="glass rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold mb-4">Описание</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{service.description}</p>
            </div>

            <div className="glass rounded-2xl p-8">
              <h2 className="font-display text-2xl font-bold mb-6">Что включено</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {["Бесплатный выезд и замер","Подготовка проекта и сметы","Закупка материалов","Подготовка основания","Производство работ","Уборка и сдача объекта"].map((t) => (
                  <div key={t} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/15 grid place-items-center shrink-0 mt-0.5"><Check className="h-3.5 w-3.5 text-primary" /></div>
                    <span className="text-sm">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {pricing.length > 0 && (
              <div className="glass rounded-2xl p-8">
                <h2 className="font-display text-2xl font-bold mb-6">Прайс-лист</h2>
                <div className="divide-y divide-border">
                  {pricing.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between py-4">
                      <div className="font-medium">{p.name}</div>
                      <div className="font-display text-lg text-primary">{Number(p.price).toLocaleString("ru-RU")} ₽<span className="text-xs text-muted-foreground"> / {p.unit}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-5">
            <div className="glass rounded-2xl p-7 sticky top-28">
              <div className="text-xs uppercase tracking-widest text-muted-foreground">Цена</div>
              <div className="mt-2 font-display text-4xl font-bold text-gradient-gold">от {Number(service.price_from).toLocaleString("ru-RU")} ₽</div>
              <div className="text-sm text-muted-foreground">за {service.price_unit}</div>
              <div className="mt-6 mb-6 h-px bg-border" />
              <h3 className="font-display text-lg font-bold mb-4">Заказать услугу</h3>
              <CallbackForm source={`service:${service.slug}`} compact />
              <a href={`tel:${phone.replace(/[^+\d]/g,'')}`} className="mt-3 flex items-center justify-center gap-2 text-sm text-primary hover:underline">
                <Phone className="h-4 w-4" /> {phone}
              </a>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
