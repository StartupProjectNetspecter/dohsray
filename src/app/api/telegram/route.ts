// Telegram webhook for @dohsray_bot. Telegram sends TELEGRAM_WEBHOOK_SECRET in a header;
// anything without it is rejected. Always answers 200 so Telegram doesn't retry failed updates forever.
import { handleUpdate } from "@/lib/bot";
import type { TgUpdate } from "@/lib/telegram";

export async function POST(request: Request) {
  const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!secret || request.headers.get("x-telegram-bot-api-secret-token") !== secret) {
    return new Response("Unauthorized", { status: 401 });
  }

  const update = (await request.json().catch(() => null)) as TgUpdate | null;
  if (update) {
    try { await handleUpdate(update); } catch (error) { console.error("[telegram] update failed", error); }
  }
  return Response.json({ ok: true });
}
