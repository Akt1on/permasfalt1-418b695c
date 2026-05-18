import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const LeadSchema = z.object({
  name: z.string().nullable().optional(),
  phone: z.string().min(5).max(40),
  message: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
});

export const notifyLead = createServerFn({ method: "POST" })
  .inputValidator((input) => LeadSchema.parse(input))
  .handler(async ({ data }) => {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!token || !chatId) return { ok: false, reason: "not_configured" as const };
    const lines = [
      "🆕 <b>Новая заявка — Пермь Асфальт 59</b>",
      "",
      `👤 Имя: <b>${escape(data.name) || "—"}</b>`,
      `📞 Телефон: <b>${escape(data.phone)}</b>`,
      data.message ? `📝 Сообщение:\n${escape(data.message)}` : null,
      data.source ? `🌐 Источник: ${escape(data.source)}` : null,
    ].filter(Boolean).join("\n");
    try {
      const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: lines, parse_mode: "HTML", disable_web_page_preview: true }),
      });
      return { ok: r.ok };
    } catch {
      return { ok: false };
    }
  });

function escape(s: string | null | undefined): string {
  if (!s) return "";
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
