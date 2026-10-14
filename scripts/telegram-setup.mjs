// One-time setup for @dohsray_bot: commands menu, descriptions, profile photo and (if SITE_URL is set) the webhook.
// Run: npm run bot:setup      (safe to run again after changing anything here)
//      npm run bot:setup -- --photo   also uploads public/brand/telegram-avatar.png as the profile photo
import fs from "node:fs";

process.loadEnvFile(".env");
const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_WEBHOOK_SECRET: secret, SITE_URL: siteUrl } = process.env;
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is missing in .env");

const api = `https://api.telegram.org/bot${token}`;
async function call(method, payload, form) {
  const res = form
    ? await fetch(`${api}/${method}`, { method: "POST", body: form })
    : await fetch(`${api}/${method}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
  const data = await res.json();
  console.log(data.ok ? `✓ ${method}` : `✗ ${method}: ${data.description}`);
  return data;
}

// Shown in the "/" menu and the Menu button.
await call("setMyCommands", {
  commands: [
    { command: "start", description: "Welcome and main menu" },
    { command: "menu", description: "Open the main menu" },
    { command: "projects", description: "Explore Dohsray products" },
    { command: "about", description: "About Dohsray and the founder" },
    { command: "contact", description: "Send a message to the founder" },
    { command: "website", description: "Open the Dohsray website" },
    { command: "privacy", description: "How your data is handled" },
    { command: "help", description: "How to use this bot" },
  ],
});
await call("setChatMenuButton", { menu_button: { type: "commands" } });

// Shown in an empty chat ("What can this bot do?"), max 512 characters.
await call("setMyDescription", {
  description: [
    "👋 Welcome to Dohsray!",
    "",
    "Dohsray (ដោះស្រាយ) means “to solve” in Khmer. Here you'll find the public products designed and built by founder Kao Vichet, solving real problems in communication, security, health and community.",
    "",
    "With this bot you can:",
    "🚀 Explore our products",
    "ℹ️ Learn about Dohsray and its founder",
    "✉️ Message the founder directly",
    "",
    "Tap START to begin.",
  ].join("\n"),
});

// Shown on the bot's profile and when the bot is shared, max 120 characters.
await call("setMyShortDescription", {
  short_description: "Real problems. Practical solutions. Explore Dohsray products and talk to the founder.",
});

// Only with --photo: each upload adds another photo to the bot's profile.
if (process.argv.includes("--photo")) {
  const photo = new FormData();
  photo.append("photo", JSON.stringify({ type: "static", photo: "attach://avatar" }));
  photo.append("avatar", new Blob([fs.readFileSync("public/brand/telegram-avatar.png")], { type: "image/png" }), "avatar.png");
  await call("setMyProfilePhoto", null, photo);
}

if (siteUrl?.startsWith("https://") && secret) {
  await call("setWebhook", {
    url: `${siteUrl.replace(/\/$/, "")}/api/telegram`,
    secret_token: secret,
    allowed_updates: ["message", "callback_query"],
    drop_pending_updates: true,
  });
} else {
  console.log("• Webhook not set (needs SITE_URL=https://… and TELEGRAM_WEBHOOK_SECRET). For local testing run: npm run bot:dev");
}
console.log("\nOne manual step: in @BotFather → /mybots → @dohsray_bot → Edit Bot → Edit Description Picture,\nupload public/brand/telegram-description.png (the API can't set this one).");
