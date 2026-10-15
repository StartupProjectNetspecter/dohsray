// Captures each project's live website with headless Chrome:
//   public/projects/<slug>.webp          desktop, 1280 wide and tall (it scrolls inside the thumbnail on hover)
//   public/projects/<slug>-mobile.webp   phone view, 480 wide and tall
// Run again whenever a project's site changes:
//   npm run shots            all projects
//   npm run shots komnot     one project
import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";

// wait: extra time for slow pages or intro animations before capturing.
// reveal: force scroll-in animations to their visible state (for pages that hide them again off-screen).
const SITES = [
  { slug: "arorm", url: "https://www.arorm.site/" },
  { slug: "snamdan", url: "https://www.snamdan.com/", reveal: true },
  { slug: "komnot", url: "https://komnot.org/", wait: 7000 },
  { slug: "vichetkao", url: "https://www.vichetkao.com/" },
  { slug: "sokhapheap", url: "https://sokhapheap.vercel.app/" },
  { slug: "khmermusic", url: "https://www.khmermusic.live/" },
];
const DESKTOP = { width: 1440, height: 900, scale: 1, maxHeight: 2700 };
const MOBILE = { width: 390, height: 844, scale: 2, maxHeight: 1700 };
const IPHONE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";

// Runs in the page: scroll through once so lazy content and reveal animations load,
// hide cookie banners (without accepting anything), then return to the top.
const prepare = (reveal) => `(async () => {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  document.documentElement.style.scrollBehavior = "auto";
  for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await sleep(160); }
  scrollTo(0, 0);
  await sleep(1500);
  for (const el of document.querySelectorAll("body *")) {
    const style = getComputedStyle(el);
    if ((style.position === "fixed" || style.position === "sticky") && /cookie/i.test(el.textContent || "") && el.getBoundingClientRect().top > innerHeight / 2) el.style.display = "none";
  }
  if (${reveal}) {
    for (const el of document.querySelectorAll("body *")) {
      const style = getComputedStyle(el);
      if (Number(style.opacity) < 1 && style.display !== "none") { el.style.opacity = "1"; el.style.transform = "none"; el.style.filter = "none"; el.style.transition = "none"; }
    }
    await sleep(300);
  }
  return document.documentElement.scrollHeight;
})()`;

const CHROME = [
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error("Chrome or Edge not found");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "project-shots-"));
const port = 9300 + Math.floor(Math.random() * 500);
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--no-first-run", `--remote-debugging-port=${port}`, `--user-data-dir=${tmp}`, "about:blank"], { stdio: "ignore" });

try {
  let target;
  for (let i = 0; i < 60 && !target; i++) {
    await sleep(250);
    target = await fetch(`http://127.0.0.1:${port}/json`).then((r) => r.json()).then((list) => list.find((t) => t.type === "page")).catch(() => null);
  }
  if (!target) throw new Error("Could not connect to Chrome");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener("open", r));
  let nextId = 0;
  const pending = new Map();
  ws.addEventListener("message", (e) => {
    const msg = JSON.parse(e.data);
    if (msg.id && pending.has(msg.id)) { pending.get(msg.id)(msg); pending.delete(msg.id); }
  });
  const send = (method, params = {}) => new Promise((resolve) => { const id = ++nextId; pending.set(id, resolve); ws.send(JSON.stringify({ id, method, params })); });

  const desktopUA = (await send("Browser.getVersion")).result.userAgent.replace("HeadlessChrome", "Chrome");
  fs.mkdirSync("public/projects", { recursive: true });

  for (const site of SITES.filter((s) => !process.argv[2] || s.slug === process.argv[2])) {
    for (const [mode, view] of [["desktop", DESKTOP], ["mobile", MOBILE]]) {
      const mobile = mode === "mobile";
      await send("Emulation.setDeviceMetricsOverride", { width: view.width, height: view.height, deviceScaleFactor: view.scale, mobile });
      await send("Emulation.setTouchEmulationEnabled", { enabled: mobile });
      await send("Network.setUserAgentOverride", { userAgent: mobile ? IPHONE_UA : desktopUA });
      await send("Page.navigate", { url: site.url });
      await sleep(site.wait ?? 4500);
      const evaluated = await send("Runtime.evaluate", { expression: prepare(Boolean(site.reveal)), awaitPromise: true, returnByValue: true });
      const height = Math.min(evaluated.result?.result?.value ?? view.height, view.maxHeight);
      const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: { x: 0, y: 0, width: view.width, height, scale: 1 } });
      const out = `public/projects/${site.slug}${mobile ? "-mobile" : ""}.webp`;
      await sharp(Buffer.from(shot.result.data, "base64")).resize(mobile ? 480 : 1280).webp({ quality: 80 }).toFile(out);
      const meta = await sharp(out).metadata();
      console.log(`✓ ${out}  ${meta.width}x${meta.height}`);
    }
  }
  ws.close();
} finally {
  chrome.kill();
  await sleep(500);
  fs.rmSync(tmp, { recursive: true, force: true, maxRetries: 5, retryDelay: 300 });
}
