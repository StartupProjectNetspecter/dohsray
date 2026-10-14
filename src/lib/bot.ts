// @dohsray_bot: welcome, menu, projects, about, contact (relayed to the admin) and help.
// Updates arrive at /api/telegram (webhook in production, scripts/telegram-dev.mjs locally).
//
// Every screen is an inline message with a back button. Tapping a button edits the same
// message in place, so the chat stays clean; commands and the bottom keyboard send a fresh one.
import { readFile } from "node:fs/promises";
import path from "node:path";
import { solutions } from "@/data/solutions";
import { escapeHtml, tg, tgUpload, type TgCallbackQuery, type TgMessage, type TgUpdate, type TgUser } from "@/lib/telegram";

const ADMIN_ID = Number(process.env.TELEGRAM_ADMIN_ID);
const SITE_URL = process.env.SITE_URL?.startsWith("https://") ? process.env.SITE_URL.replace(/\/$/, "") : "";

// Text that marks bot messages the user can reply to, so the bot knows a reply is meant for the founder.
const CONTACT_PROMPT = "Reply to this message with what you'd like to say";
const FOUNDER_REPLY = "Reply from Dohsray";

type Button = { text: string; callback_data?: string; url?: string };
type Screen = { text: string; keyboard: Button[][] };

const BUTTONS: Record<string, string> = {
  "🚀 Projects": "projects", "ℹ️ About": "about",
  "✉️ Contact": "contact", "🌐 Website": "website",
  "❓ Help": "help", "🔒 Privacy": "privacy",
};

// Bottom keyboard (always visible under the message box).
const KEYBOARD = {
  keyboard: [
    [{ text: "🚀 Projects" }, { text: "ℹ️ About" }],
    [{ text: "✉️ Contact" }, { text: "🌐 Website" }],
    [{ text: "❓ Help" }, { text: "🔒 Privacy" }],
  ],
  resize_keyboard: true,
  is_persistent: true,
  input_field_placeholder: "Choose an option below…",
};

const nav = (text: string, to: string): Button => ({ text, callback_data: to });
const BACK_HOME = [nav("⬅️ Back to menu", "home")];

function send(chatId: number, text: string, extra: Record<string, unknown> = {}) {
  return tg("sendMessage", { chat_id: chatId, text, parse_mode: "HTML", link_preview_options: { is_disabled: true }, ...extra });
}

function sendScreen(chatId: number, screen: Screen) {
  return send(chatId, screen.text, { reply_markup: { inline_keyboard: screen.keyboard } });
}

// ---------- Screens ----------

function homeScreen(): Screen {
  return {
    text: "🏠 <b>Main menu</b>\n\nWhat would you like to explore?",
    keyboard: [
      [nav("🚀 Projects", "projects"), nav("ℹ️ About", "about")],
      [nav("✉️ Contact", "contact"), nav("🌐 Website", "website")],
      [nav("❓ Help", "help"), nav("🔒 Privacy", "privacy")],
    ],
  };
}

function projectsScreen(): Screen {
  const lines = solutions.map((s) => `<b>${s.id} · ${escapeHtml(s.title)}</b> · ${escapeHtml(s.type)}\n<i>Solves:</i> ${escapeHtml(s.solves)}`);
  const buttons = solutions.map((s) => nav(`${s.id} · ${s.title}`, `p:${s.id}`));
  const rows: Button[][] = [];
  for (let i = 0; i < buttons.length; i += 2) rows.push(buttons.slice(i, i + 2));
  return {
    text: ["🚀 <b>Dohsray products</b>", "Public projects designed and built by Kao Vichet. Every product starts with a real problem.", "", lines.join("\n\n"), "", "Tap a product to see the full story."].join("\n"),
    keyboard: [...rows, BACK_HOME],
  };
}

function projectScreen(id: string): Screen {
  const s = solutions.find((item) => item.id === id);
  if (!s) return projectsScreen();
  const links: Button[] = [];
  if (s.url) links.push({ text: `🌐 Visit ${s.url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}`, url: s.url });
  if (s.bot) links.push({ text: "🤖 Open the bot", url: s.bot });
  return {
    text: [
      `<b>${escapeHtml(s.title)}</b>`,
      `${escapeHtml(s.type)} · ${escapeHtml(s.category)} · 🟢 ${escapeHtml(s.status)}`,
      "",
      escapeHtml(s.summary),
      "",
      `🔍 <b>Problem</b>\n${escapeHtml(s.problem)}`,
      "",
      `💡 <b>Solution</b>\n${escapeHtml(s.solution)}`,
      "",
      `🎯 <b>Impact</b>\n${escapeHtml(s.impact)}`,
      "",
      s.stack.map((t) => `#${t.replace(/[^\p{L}\p{N}]+/gu, "")}`).join(" "),
    ].join("\n"),
    keyboard: [
      ...(links.length ? [links] : []),
      [nav("✉️ Ask about this", `ask:${s.id}`)],
      [nav("⬅️ All projects", "projects"), nav("🏠 Menu", "home")],
    ],
  };
}

function aboutScreen(): Screen {
  return {
    text: [
      "ℹ️ <b>About Dohsray</b>",
      "",
      "<b>Dohsray</b> (ដោះស្រាយ) means “to solve” in Khmer. That is the whole idea: every product we build begins with a real problem people face, and exists to solve it.",
      "",
      "👤 <b>Founder</b>",
      "Kao Vichet, founder and product builder from Cambodia, working across strategy, interface design and development.",
      "",
      "🛠 <b>How we work</b>",
      "1. <b>Understand</b>: define the real problem and the people involved",
      "2. <b>Shape</b>: turn it into a focused product direction",
      "3. <b>Build</b>: develop with care for every detail",
      "4. <b>Improve</b>: learn from real use and refine",
      "",
      `So far: <b>${solutions.length} public products</b>, all designed and built by Kao Vichet.`,
    ].join("\n"),
    keyboard: [[nav("🚀 See the projects", "projects")], BACK_HOME],
  };
}

function contactScreen(): Screen {
  return {
    text: [
      "✉️ <b>Contact the founder</b>",
      "",
      "Have an idea, a question, or a problem worth solving? Send a message and it goes straight to the founder. The reply arrives right here in this chat.",
      "",
      "Tap <b>✍️ Write a message</b> to start.",
    ].join("\n"),
    keyboard: [[nav("✍️ Write a message", "write")], BACK_HOME],
  };
}

function websiteScreen(): Screen {
  return SITE_URL
    ? { text: "🌐 <b>Dohsray website</b>\n\nSee every product, the story behind Dohsray and ways to get in touch.", keyboard: [[{ text: "🌐 Open the website", url: SITE_URL }], BACK_HOME] }
    : { text: "🌐 <b>Dohsray website</b>\n\nThe website is launching soon. Meanwhile, explore what we build in 🚀 Projects.", keyboard: [[nav("🚀 See the projects", "projects")], BACK_HOME] };
}

function helpScreen(): Screen {
  return {
    text: [
      "❓ <b>How to use this bot</b>",
      "Tap a button, or type a command:",
      "",
      "/start · Welcome and main menu",
      "/menu · Open the main menu",
      "/projects · Explore Dohsray products",
      "/about · About Dohsray and the founder",
      "/contact · Send a message to the founder",
      "/website · Open the Dohsray website",
      "/privacy · How your data is handled",
      "/help · Show this guide",
    ].join("\n"),
    keyboard: [BACK_HOME],
  };
}

function privacyScreen(): Screen {
  return {
    text: [
      "🔒 <b>Privacy</b>",
      "",
      "• This bot only receives what you send to it.",
      "• When you use ✉️ Contact, your message, Telegram name, username and ID are delivered to the founder so they can reply to you here.",
      "• Messages are not stored in a database or shared with anyone else.",
      "• Questions about your data? Use ✉️ Contact.",
    ].join("\n"),
    keyboard: [BACK_HOME],
  };
}

const SCREENS: Record<string, () => Screen> = {
  home: homeScreen, projects: projectsScreen, about: aboutScreen, contact: contactScreen,
  website: websiteScreen, help: helpScreen, privacy: privacyScreen,
};

// ---------- Welcome ----------

let welcomePhotoId = ""; // Telegram file_id, cached after the first upload

async function sendWelcome(msg: TgMessage) {
  const name = escapeHtml(msg.from?.first_name ?? "there");
  const caption = [
    `<b>Welcome to Dohsray, ${name}</b> 👋`,
    "",
    "<b>ដោះស្រាយ</b>  ·  means “to solve” in Khmer",
    "",
    "Here you'll find the public products designed and built by founder Kao Vichet, each solving a real problem in communication, security, health and community.",
    "",
    "<b>What you can do here</b>",
    "🚀 <b>Projects</b>: explore our products",
    "ℹ️ <b>About</b>: the story behind Dohsray",
    "✉️ <b>Contact</b>: message the founder directly",
    "🌐 <b>Website</b>: visit Dohsray online",
    "",
    "Use the menu below to get started.",
  ].join("\n");
  const base = { chat_id: msg.chat.id, caption, parse_mode: "HTML", reply_markup: KEYBOARD };

  try {
    if (welcomePhotoId) return await tg("sendPhoto", { ...base, photo: welcomePhotoId });
    if (SITE_URL) return await tg("sendPhoto", { ...base, photo: `${SITE_URL}/brand/telegram-welcome.png` });
    const file = await readFile(path.join(process.cwd(), "public/brand/telegram-welcome.png"));
    const sent = await tgUpload<{ photo: { file_id: string }[] }>("sendPhoto", base, "photo", new Blob([file], { type: "image/png" }), "welcome.png");
    welcomePhotoId = sent.photo.at(-1)?.file_id ?? "";
  } catch (error) {
    console.error("[bot] welcome photo failed, sending text only", error);
    await send(msg.chat.id, caption, { reply_markup: KEYBOARD });
  }
}

// ---------- Contact relay ----------
// No force-reply: that hides the bottom keyboard. Visitors just type; the bot shows the text back
// with Send / Cancel, and on Send reads it from that confirmation message (no database needed).

const CONFIRM_TITLE = "📝 Send this message to the founder?";

async function askForMessage(chatId: number, about?: string) {
  const topic = about ? `\n\nTopic: <b>${escapeHtml(about)}</b>\n<i>${CONTACT_PROMPT}, so the topic stays attached.</i>` : "";
  await send(chatId, `✍️ <b>Write your message</b>\n\nType your idea, question or problem below and send it. You'll be able to check it before it goes to the founder.${topic}`, {
    reply_markup: KEYBOARD,
  });
}

async function confirmMessage(chatId: number, text: string, topic?: string) {
  const header = topic ? `${CONFIRM_TITLE}\nTopic: ${escapeHtml(topic)}` : CONFIRM_TITLE;
  await send(chatId, `<b>${header}</b>\n\n${escapeHtml(text.slice(0, 3500))}`, {
    reply_markup: { inline_keyboard: [[nav("✅ Send", "send"), nav("✖️ Cancel", "cancel")]] },
  });
}

async function deliverToAdmin(user: TgUser, text: string, topic?: string) {
  const who = escapeHtml([user.first_name, user.last_name].filter(Boolean).join(" "));
  const handle = user.username ? ` (@${escapeHtml(user.username)})` : "";
  await send(ADMIN_ID, [
    "📨 <b>New message via @dohsray_bot</b>",
    "",
    `<b>From:</b> ${who}${handle}`,
    `<b>User ID:</b> <code>${user.id}</code>`,
    ...(topic ? [`<b>Topic:</b> ${escapeHtml(topic)}`] : []),
    "",
    escapeHtml(text),
    "",
    `↩️ <i>Reply to this message to answer.</i> #u${user.id}`,
  ].join("\n"));
}

const SENT_TEXT = "✅ <b>Message sent!</b>\n\nThanks for reaching out. The founder will reply to you right here in this chat.";

async function relayAdminReply(msg: TgMessage, userId: number, text: string) {
  try {
    await send(userId, `💬 <b>${FOUNDER_REPLY}</b>\n\n${escapeHtml(text)}\n\n<i>Reply to this message to continue the conversation.</i>`);
    await send(msg.chat.id, "✅ Reply delivered.");
  } catch (error) {
    await send(msg.chat.id, `⚠️ Couldn't deliver: ${escapeHtml(String(error))}`);
  }
}

// ---------- Router ----------

async function onMessage(msg: TgMessage) {
  if (msg.chat.type !== "private" || !msg.from || msg.from.is_bot) return;
  const text = (msg.text ?? msg.caption ?? "").trim();
  const repliedTo = msg.reply_to_message?.text ?? "";

  // Founder answering a relayed message: reply to it and the bot forwards the answer.
  const target = /#u(\d+)/.exec(repliedTo);
  if (msg.from.id === ADMIN_ID && target) {
    if (!text) return send(msg.chat.id, "Please reply with text.");
    return relayAdminReply(msg, Number(target[1]), text);
  }

  // Visitor replying to the contact prompt or to a founder reply.
  if (msg.reply_to_message?.from?.is_bot && (repliedTo.includes(CONTACT_PROMPT) || repliedTo.includes(FOUNDER_REPLY))) {
    if (text.length < 2) return send(msg.chat.id, "Please write your message as text.");
    const topic = /Topic: (.+)$/m.exec(repliedTo)?.[1];
    return confirmMessage(msg.chat.id, text, topic);
  }

  const [first, payload] = text.split(/\s+/, 2);
  const command = first.startsWith("/") ? first.slice(1).split("@")[0].toLowerCase() : BUTTONS[text];
  const chatId = msg.chat.id;

  if (command === "start") return payload === "contact" ? sendScreen(chatId, contactScreen()) : sendWelcome(msg);
  if (command === "menu") return sendScreen(chatId, homeScreen());
  if (command && SCREENS[command]) return sendScreen(chatId, SCREENS[command]());
  if (command || text.length < 2) {
    return send(chatId, "I didn't catch that. 🤔\nPick an option below, or type /help.", { reply_markup: { inline_keyboard: homeScreen().keyboard } });
  }
  // Any other text is treated as a message for the founder, after confirmation.
  return confirmMessage(chatId, text);
}

async function onCallback(query: TgCallbackQuery) {
  const data = query.data ?? "";
  const msg = query.message;
  await tg("answerCallbackQuery", { callback_query_id: query.id }).catch(() => {});
  if (!msg) return;

  if (data === "write") return askForMessage(msg.chat.id);
  if (data === "send" || data === "cancel") {
    const [head, ...body] = (msg.text ?? "").split("\n\n");
    const edit = (text: string) => tg("editMessageText", {
      chat_id: msg.chat.id, message_id: msg.message_id, text, parse_mode: "HTML",
      reply_markup: { inline_keyboard: [[nav("🏠 Back to menu", "home")]] },
    }).catch(() => {});
    if (data === "cancel") return edit("✖️ Message discarded. Nothing was sent.");
    if (!head.startsWith(CONFIRM_TITLE) || !body.length) return edit("This message has already been handled.");
    await deliverToAdmin(query.from, body.join("\n\n"), /^Topic: (.+)$/m.exec(head)?.[1]);
    return edit(SENT_TEXT);
  }
  if (data.startsWith("ask:")) return askForMessage(msg.chat.id, solutions.find((s) => s.id === data.slice(4))?.title);

  const screen = data.startsWith("p:") ? projectScreen(data.slice(2)) : SCREENS[data]?.();
  if (!screen) return;
  await tg("editMessageText", {
    chat_id: msg.chat.id, message_id: msg.message_id, text: screen.text, parse_mode: "HTML",
    link_preview_options: { is_disabled: true }, reply_markup: { inline_keyboard: screen.keyboard },
  }).catch(async (error) => {
    if (String(error).includes("message is not modified")) return;
    await sendScreen(msg.chat.id, screen); // e.g. the original message was a photo
  });
}

export async function handleUpdate(update: TgUpdate) {
  if (update.callback_query) return onCallback(update.callback_query);
  if (update.message) return onMessage(update.message);
}
