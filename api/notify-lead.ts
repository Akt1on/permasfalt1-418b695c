type LeadNotification = {
  name?: string | null;
  phone?: string | null;
  message?: string | null;
  source?: string | null;
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, reason: "method_not_allowed" });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return res.status(200).json({ ok: false, reason: "not_configured" });

  const body = parseBody(req.body) as LeadNotification;
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  if (phone.length < 5 || phone.length > 40) {
    return res.status(400).json({ ok: false, reason: "invalid_phone" });
  }

  const name = clean(body.name, 80);
  const message = clean(body.message, 800);
  const source = clean(body.source, 120);
  const lines = [
    "🆕 <b>Новая заявка — Пермь Асфальт 59</b>",
    "",
    `👤 Имя: <b>${escapeHtml(name) || "—"}</b>`,
    `📞 Телефон: <b>${escapeHtml(phone)}</b>`,
    message ? `📝 Сообщение:\n${escapeHtml(message)}` : null,
    source ? `🌐 Источник: ${escapeHtml(source)}` : null,
  ].filter(Boolean).join("\n");

  try {
    const telegram = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines, parse_mode: "HTML", disable_web_page_preview: true }),
    });
    return res.status(200).json({ ok: telegram.ok });
  } catch {
    return res.status(200).json({ ok: false });
  }
}

function parseBody(body: unknown): unknown {
  if (typeof body !== "string") return body ?? {};
  try { return JSON.parse(body); } catch { return {}; }
}

function clean(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}