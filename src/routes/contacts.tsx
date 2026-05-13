import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import { fetchSettings } from "@/lib/site-data";
import { Section } from "@/components/site/Section";
import { CallbackForm } from "@/components/site/CallbackForm";

export const Route = createFileRoute("/contacts")({
  head: () => ({ meta: [{ title: "Контакты — Пермь Асфальт 59" }, { name: "description", content: "Адрес, телефон, e-mail компании Пермь Асфальт 59." }] }),
  component: ContactsPage,
});

function ContactsPage() {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const c = settings?.contacts ?? {};
  return (
    <Section eyebrow="Контакты" title={<>Свяжитесь с <span className="text-gradient-gold">нами</span></>} subtitle="Работаем круглосуточно, без выходных. Выезд инженера на замер — бесплатно.">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {c.phone && (
            <a href={`tel:${c.phone.replace(/[^+\d]/g,'')}`} className="flex items-start gap-4 glass rounded-2xl p-6 hover:border-primary/40 transition">
              <div className="h-11 w-11 rounded-xl btn-gold grid place-items-center shrink-0"><Phone className="h-5 w-5" /></div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Телефон</div>
                <div className="font-display text-xl font-bold mt-1">{c.phone}</div>
                {c.phone2 && <div className="text-sm text-muted-foreground mt-1">{c.phone2}</div>}
              </div>
            </a>
          )}
          {c.email && (
            <a href={`mailto:${c.email}`} className="flex items-start gap-4 glass rounded-2xl p-6 hover:border-primary/40 transition">
              <div className="h-11 w-11 rounded-xl btn-gold grid place-items-center shrink-0"><Mail className="h-5 w-5" /></div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">E-mail</div>
                <div className="font-display text-xl font-bold mt-1">{c.email}</div>
              </div>
            </a>
          )}
          {c.address && (
            <div className="flex items-start gap-4 glass rounded-2xl p-6">
              <div className="h-11 w-11 rounded-xl btn-gold grid place-items-center shrink-0"><MapPin className="h-5 w-5" /></div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Адрес</div>
                <div className="font-display text-xl font-bold mt-1">{c.address}</div>
              </div>
            </div>
          )}
          {c.work_hours && (
            <div className="flex items-start gap-4 glass rounded-2xl p-6">
              <div className="h-11 w-11 rounded-xl btn-gold grid place-items-center shrink-0"><Clock className="h-5 w-5" /></div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Режим работы</div>
                <div className="font-display text-xl font-bold mt-1">{c.work_hours}</div>
              </div>
            </div>
          )}
          {c.whatsapp && (
            <a href={`https://wa.me/${c.whatsapp.replace(/[^\d]/g,'')}`} target="_blank" rel="noreferrer" className="flex items-start gap-4 glass rounded-2xl p-6 hover:border-primary/40 transition">
              <div className="h-11 w-11 rounded-xl btn-gold grid place-items-center shrink-0"><MessageCircle className="h-5 w-5" /></div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">WhatsApp</div>
                <div className="font-display text-xl font-bold mt-1">Написать в WhatsApp</div>
              </div>
            </a>
          )}
        </div>
        <div className="glass rounded-2xl p-8">
          <h3 className="font-display text-2xl font-bold mb-2">Оставьте заявку</h3>
          <p className="text-muted-foreground mb-6">Перезвоним в течение 15 минут.</p>
          <CallbackForm source="contacts" />
        </div>
      </div>
    </Section>
  );
}
