// Local development: Telegram can't reach localhost, so this polls Telegram for new updates
// and passes each one to the local webhook (/api/telegram). Keep `npm run dev` running too.
// Run: npm run bot:dev
process.loadEnvFile(".env");
const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_WEBHOOK_SECRET: secret } = process.env;
const local = process.env.LOCAL_URL ?? "http://localhost:3000";
if (!token || !secret) throw new Error("TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET must be set in .env");

const api = `https://api.telegram.org/bot${token}`;
const hook = await fetch(`${api}/getWebhookInfo`).then((r) => r.json());
if (hook.result?.url) {
  console.error("A webhook is set, so polling won't receive updates. The deployed site is handling the bot.");
  process.exit(1);
}

console.log(`Polling @dohsray_bot → ${local}/api/telegram  (Ctrl+C to stop)`);
let offset = 0;
for (;;) {
  try {
    const { result = [] } = await fetch(`${api}/getUpdates?timeout=30&offset=${offset}&allowed_updates=["message","callback_query"]`).then((r) => r.json());
    for (const update of result) {
      offset = update.update_id + 1;
      const label = update.message?.text ?? update.callback_query?.data ?? "(update)";
      const res = await fetch(`${local}/api/telegram`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-telegram-bot-api-secret-token": secret },
        body: JSON.stringify(update),
      });
      console.log(`${res.ok ? "✓" : "✗ " + res.status} ${label}`);
    }
  } catch (error) {
    console.error("Polling error:", error.message);
    await new Promise((r) => setTimeout(r, 3000));
  }
}
