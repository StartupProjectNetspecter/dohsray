// Contact form endpoint: validates the message and forwards it to the admin on Telegram.
// Needs TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_ID in .env (server-only, never sent to the browser).

import { CONTACT_LIMITS as LIMITS, EMAIL_RE } from "@/lib/contact";

// Simple per-visitor rate limit: 5 messages per 10 minutes. In-memory, so it resets on restart.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const recent = new Map<string, number[]>();

function isRateLimited(key: string) {
  const now = Date.now();
  const hits = (recent.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_LIMIT) { recent.set(key, hits); return true; }
  recent.set(key, [...hits, now]);
  return false;
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_ID;
  if (!token || !chatId) {
    console.error("[contact] TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_ID is missing");
    return Response.json({ error: "The contact form is not set up yet. Please email me directly." }, { status: 500 });
  }

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request." }, { status: 400 }); }
  const field = (key: string) => (typeof body[key] === "string" ? (body[key] as string).trim() : "");
  const name = field("name"), email = field("email"), subject = field("subject"), message = field("message");

  // Hidden "website" field: people never fill it, bots usually do. Pretend success and drop it.
  if (field("website")) return Response.json({ ok: true });

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please enter your name.";
  else if (name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters.`;
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) errors.email = "Please enter a valid email.";
  if (!subject) errors.subject = "Please add a subject.";
  else if (subject.length > LIMITS.subject) errors.subject = `Keep it under ${LIMITS.subject} characters.`;
  if (message.length < 10) errors.message = "Please write at least 10 characters.";
  else if (message.length > LIMITS.message) errors.message = `Keep it under ${LIMITS.message} characters.`;
  if (Object.keys(errors).length) return Response.json({ errors }, { status: 400 });

  const visitor = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "local";
  if (isRateLimited(visitor)) {
    return Response.json({ error: "Too many messages. Please try again in a few minutes." }, { status: 429 });
  }

  const sentAt = new Date().toLocaleString("en-GB", { timeZone: "Asia/Phnom_Penh", dateStyle: "medium", timeStyle: "short" });
  const text = [
    "📬 <b>New message from Dohsray website</b>",
    "",
    `<b>Name:</b> ${escapeHtml(name)}`,
    `<b>Email:</b> ${escapeHtml(email)}`,
    `<b>Subject:</b> ${escapeHtml(subject)}`,
    "",
    "<b>Message:</b>",
    escapeHtml(message),
    "",
    `<i>${sentAt} (Phnom Penh)</i>`,
  ].join("\n");

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", link_preview_options: { is_disabled: true } }),
    });
    if (!res.ok) {
      const detail = await res.json().catch(() => ({}));
      console.error("[contact] Telegram sendMessage failed", res.status, (detail as { description?: string }).description);
      return Response.json({ error: "Couldn't send your message right now. Please try again or email me directly." }, { status: 502 });
    }
  } catch (error) {
    console.error("[contact] Telegram request error", error);
    return Response.json({ error: "Couldn't reach the server. Please try again." }, { status: 502 });
  }

  return Response.json({ ok: true, sentAt });
}
