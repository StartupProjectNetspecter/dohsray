// Minimal Telegram Bot API client (server-only). The token comes from TELEGRAM_BOT_TOKEN.

const API = "https://api.telegram.org";

type ApiResponse<T> = { ok: boolean; result: T; description?: string };

function token() {
  const value = process.env.TELEGRAM_BOT_TOKEN;
  if (!value) throw new Error("TELEGRAM_BOT_TOKEN is missing");
  return value;
}

export async function tg<T = unknown>(method: string, payload: Record<string, unknown>): Promise<T> {
  const res = await fetch(`${API}/bot${token()}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = (await res.json()) as ApiResponse<T>;
  if (!data.ok) throw new Error(`Telegram ${method} failed: ${data.description}`);
  return data.result;
}

// Same as tg(), but uploads a file as multipart/form-data.
export async function tgUpload<T = unknown>(method: string, fields: Record<string, unknown>, fileField: string, file: Blob, filename: string): Promise<T> {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) form.append(key, typeof value === "string" ? value : JSON.stringify(value));
  }
  form.append(fileField, file, filename);
  const res = await fetch(`${API}/bot${token()}/${method}`, { method: "POST", body: form });
  const data = (await res.json()) as ApiResponse<T>;
  if (!data.ok) throw new Error(`Telegram ${method} failed: ${data.description}`);
  return data.result;
}

export function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export type TgUser = { id: number; is_bot: boolean; first_name: string; last_name?: string; username?: string; language_code?: string };
export type TgMessage = {
  message_id: number;
  from?: TgUser;
  chat: { id: number; type: string };
  text?: string;
  caption?: string;
  reply_to_message?: TgMessage;
};
export type TgCallbackQuery = { id: string; from: TgUser; message?: TgMessage; data?: string };
export type TgUpdate = { update_id: number; message?: TgMessage; callback_query?: TgCallbackQuery };
