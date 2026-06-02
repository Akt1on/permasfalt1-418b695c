import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Phone, MessageCircle, Send, X, MessagesSquare } from "lucide-react";
import { fetchSettings } from "@/lib/site-data";

export function FloatingContacts() {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: fetchSettings });
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const contacts = settings?.contacts ?? {};
  const phone = contacts.phone ?? "+7 (342) 277-77-10";
  const whatsapp = (contacts.whatsapp ?? "").replace(/[^\d]/g, "");
  const telegram = (contacts.telegram ?? "").replace(/^@/, "");
  const max = contacts.max ?? "";

  if (!visible) return null;

  const items = [
    whatsapp && {
      href: `https://wa.me/${whatsapp}`,
      label: "WhatsApp",
      icon: MessageCircle,
      bg: "bg-[#25D366]",
    },
    telegram && {
      href: `https://t.me/${telegram}`,
      label: "Telegram",
      icon: Send,
      bg: "bg-[#229ED9]",
    },
    max && {
      href: max,
      label: "Max",
      icon: MessagesSquare,
      bg: "bg-[#0077FF]",
    },
    {
      href: `tel:${phone.replace(/[^+\d]/g, "")}`,
      label: "Позвонить",
      icon: Phone,
      bg: "btn-gold",
    },
  ].filter(Boolean) as { href: string; label: string; icon: any; bg: string }[];

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col gap-2 animate-float-up">
          {items.map((it) => (
            <a key={it.label} href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noopener"
              className={`group flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full text-white font-medium shadow-2xl ${it.bg} hover:scale-105 transition`}>
              <it.icon className="h-5 w-5" />
              <span className="text-sm whitespace-nowrap">{it.label}</span>
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрыть" : "Связаться"}
        className="relative h-14 w-14 rounded-full btn-gold grid place-items-center shadow-2xl"
      >
        {!open && <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />}
        {open ? <X className="h-6 w-6 relative" /> : <MessageCircle className="h-6 w-6 relative" />}
      </button>
    </div>
  );
}