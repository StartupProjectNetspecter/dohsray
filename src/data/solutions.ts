// Every product is presented as a solution: the problem it solves, how it solves it, and the impact.
// To add a new product, append an entry below. Filters and counts update automatically from `category`.

export type Tone = "violet" | "sky" | "cobalt" | "lime" | "coral" | "mint" | "amber" | "pink" | "orange" | "indigo";

/** Illustration shown on the card. Leave it out to use the generic product window. */
export type Visual = "confession" | "tracker" | "shield";

export type Solution = {
  id: string;
  title: string;
  category: string;
  type: string;
  tone: Tone;
  visual?: Visual;
  status: string;
  role: string;
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
    id: "01", title: "Confession", category: "Product", type: "Digital confession platform", tone: "violet", visual: "confession", status: "Active", role: "Founder and Builder",
    solves: "People need a safe, simple place to say what they can't say elsewhere.",
    summary: "A product centered on digital confession and personal expression.",
    problem: "People have things they want to share but no focused, low-pressure space to express them.",
    solution: "A clear product flow designed around the central act of writing and sharing a confession.",
    impact: "A purpose-built space that keeps personal expression direct and easy.",
    stack: ["Product", "Web", "Founder-built"],
  },
  {
    id: "02", title: "Snamdan", category: "Telegram", type: "Message tracking integration", tone: "sky", visual: "tracker", status: "Active", role: "Founder and Developer",
    solves: "Telegram messages disappear or change without a trace when edited or deleted.",
    summary: "A Telegram integration that tracks messages when they are edited or deleted.",
    problem: "Important Telegram message history can disappear or change when a message is edited or removed.",
    solution: "Snamdan monitors those message events and preserves visibility into what was changed or deleted.",
    impact: "A practical accountability layer for Telegram conversations and communities.",
    stack: ["Telegram", "Bot Integration", "Message Tracking"],
  },
  {
    id: "03", title: "Komnot", category: "Telegram", type: "Security Telegram bot", tone: "cobalt", visual: "shield", status: "Active", role: "Founder and Developer",
    solves: "Telegram communities lack security tools that work inside the chat itself.",
    summary: "A Telegram security bot built to help protect conversations and communities.",
    problem: "Telegram communities need focused security tools that work directly inside their existing communication flow.",
    solution: "Komnot brings security-focused bot functionality into Telegram for easier monitoring and protection.",
    impact: "A dedicated security solution designed around the way Telegram communities operate.",
    stack: ["Telegram", "Security", "Automation"],
  },
];

export const categories = ["All", ...Array.from(new Set(solutions.map((s) => s.category)))];
