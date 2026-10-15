// Public products designed and built by Kao Vichet, each presented as a solution:
// the problem it solves, how it solves it, and the impact. Private or client work is not listed.
// To add a new product, append an entry below. Filters and counts update automatically from `category`.

export type Tone = "violet" | "sky" | "cobalt" | "lime" | "coral" | "mint" | "amber" | "pink" | "orange" | "indigo";

/** Illustration shown on the card. Leave it out to use the generic product window. */
export type Visual = "confession" | "tracker" | "shield" | "portfolio" | "health";

export type Solution = {
  id: string;
  title: string;
  category: string;
  type: string;
  tone: Tone;
  visual?: Visual;
  status: string;
  role: string;
  /** Product website, shown as a "Visit website" button. */
  url?: string;
  /** Telegram bot link (https://t.me/...), shown as an "Open bot" button. */
  bot?: string;
  /** Screenshot of the live site (public/projects/*.webp, made by `npm run shots`). Falls back to the illustration. */
  image?: string;
  /** Phone screenshot of the live site, shown in a phone frame beside the desktop one. */
  imageMobile?: string;
  /** One line shown on the card: what this product solves. */
  solves: string;
  summary: string;
  problem: string;
  solution: string;
  impact: string;
  stack: string[];
};

export const solutions: Solution[] = [
  {
    id: "01", title: "Arorm", category: "Web", type: "Anonymous confession platform", tone: "violet", visual: "confession", status: "Live", role: "Founder and Builder",
    url: "https://www.arorm.site", image: "/projects/arorm.webp", imageMobile: "/projects/arorm-mobile.webp",
    solves: "People need a safe place to share what's on their mind without revealing who they are.",
    summary: "An anonymous, judgment-free space to share confessions and ask questions, without revealing your identity.",
    problem: "Many people carry thoughts, stories and questions they never share, because saying them under their own name feels risky or embarrassing.",
    solution: "Arorm lets anyone submit a confession or question anonymously, or keep it private. The community can read and explore posts sorted by newest, most popular or at random.",
    impact: "A judgment-free community space that puts user privacy first and makes it easier to be honest.",
    stack: ["Web", "Anonymous", "Community"],
  },
  {
    id: "02", title: "Snamdan", category: "Telegram", type: "Chat evidence for Telegram Business", tone: "sky", visual: "tracker", status: "Live", role: "Founder and Developer",
    url: "https://www.snamdan.com", image: "/projects/snamdan.webp", imageMobile: "/projects/snamdan-mobile.webp",
    solves: "Customers delete messages or change the agreed price, and sellers lose the proof of a sale.",
    summary: "Chat evidence and order tracking for Telegram businesses. Deleted messages stay readable and every edit keeps its history.",
    problem: "Online sellers close deals in Telegram chats, but a customer can delete a message or quietly edit the agreed price, leaving no proof when an order is denied or disputed.",
    solution: "Snamdan connects to a Telegram Business account and saves every chat the moment it arrives: deleted messages, full edit history, voice notes, photos and files. Sellers can find payment slips, reply from the dashboard and export dispute packets with exact timestamps.",
    impact: "Sellers never lose the proof of a sale, with a secure, zero-access record they can bring to any dispute or chargeback.",
    stack: ["Telegram Business", "Chat evidence", "Security"],
  },
  {
    id: "03", title: "Komnot", category: "Telegram", type: "Telegram scam checker", tone: "cobalt", visual: "shield", status: "Live", role: "Founder and Developer",
    url: "https://komnot.org", image: "/projects/komnot.webp", imageMobile: "/projects/komnot-mobile.webp", bot: "https://t.me/komnot_dec_bot",
    solves: "Scam links, messages and files spread through Telegram chats before anyone can check them.",
    summary: "Scam checks for Telegram, in Khmer and English. Forward a suspicious message, link, image or file and get a clear verdict and next step.",
    problem: "Fake prize and delivery links, scam messages and malicious files spread fast in Telegram chats and groups, and most people can't easily tell what is safe, especially in Khmer.",
    solution: "Forward anything suspicious to the Komnot bot and it explains the warning signs with a clear verdict in Khmer or English. In groups, Komnot automatically removes scam files and, on Team and Business plans, bans suspicious accounts.",
    impact: "Safer Telegram chats and communities, with monthly reports on scans, threats found and which members are targeted most.",
    stack: ["Telegram", "Scam detection", "Khmer & English"],
  },
  {
    id: "04", title: "Kao Vichet Portfolio", category: "Web", type: "Live developer portfolio", tone: "mint", visual: "portfolio", status: "Live", role: "Designer and Developer",
    url: "https://www.vichetkao.com", image: "/projects/vichetkao.webp", imageMobile: "/projects/vichetkao-mobile.webp",
    solves: "A static CV can't show how a developer actually thinks, builds and keeps improving.",
    summary: "A live portfolio that shows real engineering work across the full stack, AI and data science, not just a static CV.",
    problem: "Recruiters and partners usually only see a PDF résumé, which hides the projects, research and craft behind a developer's skills.",
    solution: "One modern web app that brings together 15+ projects, certificates, published papers, a blog and a running Career Uptime clock, with a downloadable résumé and direct contact.",
    impact: "A single, always-up-to-date place to explore work from Khmer OCR to event platforms and personal finance tools, and get in touch.",
    stack: ["Web", "Full stack", "AI & Data Science"],
  },
  {
    id: "05", title: "Sokhapheap", category: "Health", type: "Family health and food safety app", tone: "coral", visual: "health", status: "Live", role: "Founder and Developer",
    url: "https://sokhapheap.vercel.app", image: "/projects/sokhapheap.webp", imageMobile: "/projects/sokhapheap-mobile.webp",
    solves: "Families can't easily tell if a meal is safe for someone with allergies or active medicines.",
    summary: "Family care support for safer food and medicine decisions, with shared health updates, allergy awareness and medicine reminders.",
    problem: "People with allergies or active prescriptions have to judge every meal on their own, and the family and caregivers who want to help rarely see the right information in time.",
    solution: "Sokhapheap keeps a health profile of allergies and medicines, reviews a meal photo with AI for allergy and interaction risks, and shares clear danger, caution and safe alerts with trusted family members under privacy controls.",
    impact: "Calmer, safer decisions at the table, with doctor-ready notes and a family circle that can follow along.",
    stack: ["Health", "AI meal scan", "Family care"],
  },
  {
    id: "06", title: "Khmer Music Live", category: "Web", type: "Daily YouTube music bot for Telegram", tone: "orange", status: "Live", role: "Founder and Developer",
    url: "https://www.khmermusic.live/", image: "/projects/khmermusic.webp", imageMobile: "/projects/khmermusic-mobile.webp",
    solves: "Music listeners need a simple way to request YouTube songs and follow a consistent daily playlist on Telegram.",
    summary: "A community music request platform that sends selected YouTube tracks to a Telegram channel every day.",
    problem: "Song requests can become scattered, repeated or hard to follow when they are collected directly through chat.",
    solution: "Khmer Music Live lets listeners submit a YouTube URL, add their name optionally, search for a song in the posted history or waiting queue, and follow the daily Telegram delivery at 8:00 PM Cambodia time.",
    impact: "One organized place for collecting requests, finding songs and sharing a fresh daily playlist with the community.",
    stack: ["Next.js", "YouTube", "Telegram", "Music queue"],
  },
];

export const categories = ["All", ...Array.from(new Set(solutions.map((s) => s.category)))];
