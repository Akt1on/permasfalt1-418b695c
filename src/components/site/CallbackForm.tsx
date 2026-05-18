import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { notifyLead } from "@/lib/notifications.functions";
import { toast } from "sonner";
import { IMaskInput } from "react-imask";

export function CallbackForm({ source = "website", compact = false }: { source?: string; compact?: boolean }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, "").length < 11) { toast.error("Введите корректный номер телефона"); return; }
    setLoading(true);
    const { error } = await supabase.from("leads").insert({ name, phone, message, source });
    setLoading(false);
    if (error) { toast.error("Не удалось отправить. Попробуйте позже."); return; }
    notifyLead({ data: { name: name || null, phone, message: message || null, source } }).catch(() => {});
    toast.success("Заявка принята! Мы перезвоним в ближайшее время.");
    setName(""); setPhone(""); setMessage("");
  };

  return (
    <form onSubmit={submit} className="grid gap-3">
      {!compact && (
        <input
          value={name} onChange={(e) => setName(e.target.value)} placeholder="Ваше имя"
          className="bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition"
        />
      )}
      <IMaskInput
        mask="+7 (000) 000-00-00" value={phone}
        onAccept={(v: string) => setPhone(v)}
        placeholder="+7 (___) ___-__-__" required
        className="bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition"
      />
      {!compact && (
        <textarea
          value={message} onChange={(e) => setMessage(e.target.value)} rows={3} placeholder="Кратко опишите задачу (необязательно)"
          className="bg-input border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition resize-none"
        />
      )}
      <button type="submit" disabled={loading} className="btn-gold rounded-lg px-6 py-3.5 font-semibold uppercase tracking-wide text-sm disabled:opacity-60">
        {loading ? "Отправка..." : "Заказать звонок"}
      </button>
      <p className="text-xs text-muted-foreground">Нажимая кнопку, вы соглашаетесь на обработку персональных данных</p>
    </form>
  );
}
