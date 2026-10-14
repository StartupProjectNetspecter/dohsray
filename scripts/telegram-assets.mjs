// Generates the Telegram bot images from the Dohsray logo:
//   public/brand/telegram-welcome.png      1280x720  (sent with /start)
//   public/brand/telegram-description.png  640x360   (BotFather "description picture")
//   public/brand/telegram-avatar.png       640x640   (bot profile photo)
// Run: node scripts/telegram-assets.mjs
import fs from "node:fs";
import sharp from "sharp";

const logo = fs.readFileSync("public/brand/logo.svg", "utf8").replace(/<svg[^>]*>/, "").replace("</svg>", "");
const sans = "'Segoe UI', 'Plus Jakarta Sans', Arial, sans-serif";
const khmer = "'Leelawadee UI', 'Khmer UI', 'Noto Sans Khmer', sans-serif";

const banner = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 720" width="1280" height="720">
  <defs>
    <radialGradient id="g1" cx="85%" cy="10%" r="65%"><stop offset="0" stop-color="#2f5bff" stop-opacity=".55"/><stop offset="1" stop-color="#2f5bff" stop-opacity="0"/></radialGradient>
    <radialGradient id="g2" cx="5%" cy="100%" r="55%"><stop offset="0" stop-color="#a78bfa" stop-opacity=".35"/><stop offset="1" stop-color="#a78bfa" stop-opacity="0"/></radialGradient>
    <pattern id="grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="#ffffff" stroke-opacity=".05"/></pattern>
  </defs>
  <rect width="1280" height="720" fill="#0b0c0a"/>
  <rect width="1280" height="720" fill="url(#grid)"/>
  <rect width="1280" height="720" fill="url(#g1)"/>
  <rect width="1280" height="720" fill="url(#g2)"/>
  <g transform="translate(96 150) scale(1.5)">${logo}</g>
  <text x="96" y="420" font-family="${sans}" font-size="128" font-weight="700" fill="#f3f3ee" letter-spacing="-5">Dohsray</text>
  <text x="100" y="488" font-family="${khmer}" font-size="40" font-weight="700" fill="#9db1ff">ដោះស្រាយ</text>
  <text x="300" y="484" font-family="${sans}" font-size="30" fill="#a3a39a">“to solve” in Khmer</text>
  <text x="100" y="568" font-family="${sans}" font-size="40" font-weight="600" fill="#f3f3ee">Real problems. <tspan fill="#a3a39a" font-weight="400">Practical solutions.</tspan></text>
  <g font-family="${sans}" font-size="22" font-weight="600" fill="#f3f3ee">
    <rect x="100" y="612" width="150" height="48" rx="24" fill="#ffffff" fill-opacity=".08" stroke="#ffffff" stroke-opacity=".16"/><text x="175" y="643" text-anchor="middle">Projects</text>
    <rect x="262" y="612" width="130" height="48" rx="24" fill="#ffffff" fill-opacity=".08" stroke="#ffffff" stroke-opacity=".16"/><text x="327" y="643" text-anchor="middle">About</text>
    <rect x="404" y="612" width="150" height="48" rx="24" fill="#2f5bff"/><text x="479" y="643" text-anchor="middle">Contact</text>
  </g>
  <g font-family="${sans}" font-size="24">
    <rect x="760" y="170" width="420" height="380" rx="32" fill="#ffffff" fill-opacity=".05" stroke="#ffffff" stroke-opacity=".12"/>
    <circle cx="806" cy="214" r="7" fill="#22c55e"/><text x="824" y="222" font-size="20" fill="#a3a39a">Dohsray bot · online</text>
    <rect x="790" y="256" width="300" height="64" rx="22" fill="#ffffff" fill-opacity=".1"/><text x="814" y="296" fill="#f3f3ee">I have a problem to solve…</text>
    <rect x="856" y="340" width="296" height="64" rx="22" fill="#2f5bff"/><text x="880" y="380" fill="#ffffff">Let&#39;s solve it together.</text>
    <rect x="790" y="424" width="248" height="64" rx="22" fill="#ffffff" fill-opacity=".1"/><text x="814" y="464" fill="#f3f3ee">Problem solved</text>
    <path d="M994 456l8 8 16-18" fill="none" stroke="#22c55e" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <text x="1184" y="660" text-anchor="end" font-family="${sans}" font-size="24" fill="#a3a39a">@dohsray_bot</text>
</svg>`;

const avatar = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="640" height="640">
  <defs><radialGradient id="a" cx="30%" cy="20%" r="90%"><stop offset="0" stop-color="#1c2340"/><stop offset="1" stop-color="#0b0c0a"/></radialGradient></defs>
  <rect width="640" height="640" fill="url(#a)"/>
  <g transform="translate(140 132) scale(3.6)">${logo}</g>
</svg>`;

await sharp(Buffer.from(banner)).png().toFile("public/brand/telegram-welcome.png");
await sharp(Buffer.from(banner)).resize(640, 360).png().toFile("public/brand/telegram-description.png");
await sharp(Buffer.from(avatar)).png().toFile("public/brand/telegram-avatar.png");
console.log("Telegram images written to public/brand/");
