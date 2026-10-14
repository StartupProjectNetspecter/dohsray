"use client";

import Image from "next/image";
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, BriefcaseBusiness, Check, Code2, Menu, Moon, Search, Sun, X } from "lucide-react";
import { useEffect, useState, type CSSProperties, type PointerEvent } from "react";
import { ContactForm } from "@/components/contact-form";
import { CursorFollower } from "@/components/cursor";
import { Logo } from "@/components/logo";
import { SolutionVisual } from "@/components/solution-visual";
import { categories, solutions, type Solution } from "@/data/solutions";

const navItems = [["About", "#about"], ["Solutions", "#work"], ["Process", "#process"]] as const;
const capabilities = ["Telegram bots", "Product strategy", "Security automation", "Interface design", "Message tracking", "Web products", "Founder-built"];
const steps = [
  ["01", "Understand", "Define the real problem, the people involved, and what a useful outcome looks like."],
  ["02", "Shape", "Turn research and constraints into a focused product direction and clear experience."],
  ["03", "Build", "Develop the interface with responsive behavior, accessible patterns, and careful detail."],
  ["04", "Improve", "Test the product, learn from use, and refine what creates the most value."],
];
// Cards shown before "Show all".
const CARD_LIMIT = 9;
const principles = [["Think clearly", "before building quickly."], ["Design with purpose", "from structure to detail."], ["Ship and learn", "from real use."]];

type Pointer = PointerEvent<HTMLElement>;

// Buttons drift slightly toward the cursor.
function magnetMove(event: Pointer) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left - rect.width / 2;
  const y = event.clientY - rect.top - rect.height / 2;
  el.style.translate = `${x * 0.18}px ${y * 0.3}px`;
}
function magnetLeave(event: Pointer) { event.currentTarget.style.translate = ""; }
const magnetic = { onPointerMove: magnetMove, onPointerLeave: magnetLeave };

// A soft light follows the cursor across the card image.
function spotlight(event: Pointer) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${event.clientX - rect.left}px`);
  el.style.setProperty("--my", `${event.clientY - rect.top}px`);
}

// Sections whose background reacts to the mouse (hero glow, contact glow).
function trackPointer(event: Pointer) {
  if (event.pointerType !== "mouse") return;
  const el = event.currentTarget;
  const rect = el.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  el.style.setProperty("--hx", `${x}px`);
  el.style.setProperty("--hy", `${y}px`);
  el.style.setProperty("--px", String(x / rect.width - 0.5));
  el.style.setProperty("--py", String(y / rect.height - 0.5));
}

// Heading whose words slide up from a mask once the section scrolls into view.
function SplitTitle({ lines, muted }: { lines: string[]; muted?: number }) {
  let i = 0;
  return lines.map((line, l) => (
    <span className={l === muted ? "line is-muted" : "line"} key={l}>
      {line.split(" ").map((word, k) => <span className="word" key={k}><span style={{ "--i": i++ } as CSSProperties}>{word}</span></span>)}
    </span>
  ));
}

function Words({ text, offset = 0 }: { text: string; offset?: number }) {
  return text.split(" ").map((word, i) => (
    <span className="word" key={i}><span style={{ "--i": offset + i } as CSSProperties}>{word}</span></span>
  ));
}

export function Portfolio() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [filter, setFilter] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<Solution | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const q = query.trim().toLowerCase();
  const matches = solutions.filter((s) => (filter === "All" || s.category === filter)
    && (!q || [s.title, s.type, s.category, s.solves, ...s.stack].join(" ").toLowerCase().includes(q)));
  const shown = showAll || q ? matches : matches.slice(0, CARD_LIMIT);
  const hasMatches = matches.length > 0;

  useEffect(() => {
    const saved = localStorage.getItem("portfolio-theme");
    const isDark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", isDark);
    const frame = requestAnimationFrame(() => setTheme(isDark ? "dark" : "light"));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [filter, hasMatches]);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      document.documentElement.style.setProperty("--scroll", String(max > 0 ? window.scrollY / max : 0));
      setScrolled(window.scrollY > 48);
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", onScroll); };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("modal-open", Boolean(selected));
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", close);
    return () => { document.body.classList.remove("modal-open"); window.removeEventListener("keydown", close); };
  }, [selected]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next); localStorage.setItem("portfolio-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  function chooseFilter(item: string) { setFilter(item); setShowAll(false); }

  return <div className="site-shell">
    <CursorFollower />
    <div className="scroll-progress" aria-hidden />

    <header className={scrolled ? "nav-shell is-expanded" : "nav-shell"}>
      <div className="site-header">
        <a href="#top" className="brand" aria-label="Dohsray home"><Logo className="brand-mark" />Dohsray</a>
        <nav className={menuOpen ? "nav-links is-open" : "nav-links"} aria-label="Main navigation">
          {navItems.map(([label, href]) => <a key={label} className="nav-link" href={href} onClick={() => setMenuOpen(false)}>{label}</a>)}
          <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)} {...magnetic}>Contact <ArrowUpRight size={15} /></a>
        </nav>
        <button className="icon-button menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>{menuOpen ? <X size={19} /> : <Menu size={19} />}</button>
      </div>
    </header>

    <button className="theme-fab" onClick={toggleTheme} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} {...magnetic}>
      <span className="theme-icon" key={theme}>{theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}</span>
    </button>

    <main id="top">
      <section className="hero" onPointerMove={trackPointer}>
        <div className="hero-bg" aria-hidden><span className="hero-grid" /><span className="hero-spot" /><span className="orb orb-a" /><span className="orb orb-b" /></div>
        <div className="section-wrap hero-inner">
          <p className="hero-badge"><span className="pulse" />Dohsray · ដោះស្រាយ · &ldquo;to solve&rdquo; in Khmer</p>
          <h1 className="hero-title">
            <span className="line"><Words text="Real problems." /></span>
            <span className="line is-muted"><Words text="Practical solutions." offset={2} /></span>
          </h1>
          <div className="hero-bottom">
            <div className="hero-copy">
              <p>I&apos;m Kao Vichet, founder of Dohsray. I build focused digital solutions for real communication, security, and community needs.</p>
              <div className="hero-actions">
                <a href="#work" className="primary-link" {...magnetic}>Explore my solutions <span><ArrowDownRight size={17} /></span></a>
                <a href="#about" className="text-link">More about me <ArrowRight size={16} /></a>
              </div>
            </div>
            <div className="hero-stats">
              <div className="stat"><strong>{solutions.length}</strong><span>Solutions<br />built</span></div>
              <div className="stat"><strong>{categories.length - 1}</strong><span>Product<br />areas</span></div>
            </div>
          </div>
        </div>
        <div className="marquee" aria-hidden>
          <div className="marquee-track">{[...capabilities, ...capabilities].map((item, i) => <span key={i}>{item}</span>)}</div>
        </div>
      </section>

      <section className="work-section" id="work">
        <div className="section-wrap">
          <div className="section-heading-row reveal" data-reveal>
            <div><p className="section-kicker">Every product is a solution</p><h2 className="split-title"><SplitTitle lines={["Built around", "real problems."]} /></h2></div>
            <p className="section-note">Each product I build starts with a real problem people face, and exists to solve it. Open any one to see the problem, the solution, and the impact.</p>
          </div>
          <div className="solutions-toolbar reveal" data-reveal>
            <div className="filter-row" role="group" aria-label="Filter solutions">
              {categories.map((item) => <button key={item} className={filter === item ? "filter-pill active" : "filter-pill"} onClick={() => chooseFilter(item)} aria-pressed={filter === item}>
                {item}<span>{item === "All" ? solutions.length : solutions.filter((s) => s.category === item).length}</span>
              </button>)}
            </div>
            <label className="search-box">
              <Search size={16} />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search solutions" aria-label="Search solutions" />
              {query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={14} /></button>}
            </label>
          </div>

          {hasMatches && <div className="project-grid" data-reveal key={filter}>
            {shown.map((s, i) => <button key={s.id} className="project-card" data-cursor="View" style={{ "--d": `${(i % CARD_LIMIT) * 70}ms` } as CSSProperties} onClick={() => setSelected(s)} aria-label={`Open ${s.title} solution details`}>
              <div className={`card-media ${s.tone}`} onPointerMove={spotlight}>
                <span className="visual-grid" aria-hidden />
                <div className="card-scale"><SolutionVisual solution={s} /></div>
                <span className="visual-sheen" aria-hidden />
                <span className="card-num">{s.id}</span>
                <span className="card-arrow"><ArrowUpRight size={18} /></span>
              </div>
              <div className="card-body">
                <div className="card-head"><h3>{s.title}</h3><span className="card-status">{s.status}</span></div>
                <p className="card-type">{s.type}</p>
                <p className="card-solves"><b>Solves</b>{s.solves}</p>
                <div className="card-tags"><span>{s.category}</span>{s.stack.filter((t) => t !== s.category).slice(0, 2).map((t) => <span key={t}>{t}</span>)}</div>
              </div>
            </button>)}
          </div>}

          {shown.length < matches.length && <div className="show-more"><button onClick={() => setShowAll(true)} {...magnetic}>Show all {matches.length} solutions <ArrowDown size={16} /></button></div>}

          {matches.length === 0 && <div className="empty-state">
            <strong>No solutions match{q ? ` "${query.trim()}"` : ""}</strong>
            <p>Try another word or category.</p>
            <button onClick={() => { setQuery(""); chooseFilter("All"); }}>Show all solutions</button>
          </div>}
        </div>
      </section>

      <section className="about-section section-wrap" id="about">
        <div className="portrait-wrap reveal" data-reveal>
          <div className="portrait-frame" data-cursor="Hello">
            <Image src="/images/Founder.png" alt="Kao Vichet, founder and product builder" fill sizes="(max-width: 900px) 92vw, 40vw" className="portrait" />
            <span className="portrait-caption"><span className="pulse" />Kao Vichet / Founder of Dohsray</span>
          </div>
        </div>
        <div className="about-copy reveal" data-reveal style={{ "--d": "120ms" } as CSSProperties}>
          <p className="section-kicker">About me</p>
          <h2 className="split-title"><SplitTitle lines={["Curious by nature.", "Serious about craft."]} /></h2>
          <p className="about-lead">I work across strategy, interface design, and development to move ideas from uncertainty to a clear, usable product.</p>
          <p>I believe strong products feel obvious in use, even when the thinking behind them is complex. My work focuses on useful structure, thoughtful interaction, and details that earn trust.</p>
          <a className="portfolio-link" data-cursor="Visit" href="https://www.vichetkao.com" target="_blank" rel="noreferrer"><span><small>Portfolio</small>www.vichetkao.com</span><i className="arrow-chip"><ArrowUpRight size={18} /></i></a>
          <div className="principles">{principles.map(([title, text]) => <div key={title}><Check size={16} /><span><b>{title}</b> {text}</span></div>)}</div>
        </div>
      </section>

      <section className="process-section" id="process">
        <div className="section-wrap">
          <div className="process-intro reveal" data-reveal><p className="section-kicker">How I work</p><h2 className="split-title"><SplitTitle lines={["From first question", "to finished product."]} /></h2></div>
          <div className="process-list">{steps.map(([n, title, text], i) => <article key={n} className="process-item reveal" data-reveal style={{ "--d": `${i * 90}ms` } as CSSProperties}>
            <span>{n}</span><h3>{title}</h3><p>{text}</p><i className="step-arrow" aria-hidden><ArrowUpRight size={18} /></i>
          </article>)}</div>
        </div>
      </section>

      <section className="contact-section" id="contact" onPointerMove={trackPointer}>
        <span className="contact-glow" aria-hidden />
        <div className="section-wrap contact-inner reveal" data-reveal>
          <div className="contact-intro">
            <p className="section-kicker">Start a conversation</p>
            <h2 className="split-title"><SplitTitle lines={["Have an idea worth", "building well?"]} muted={1} /></h2>
            <p>Tell me what you are working on, where you are stuck, and what success would look like. Your message comes straight to me.</p>
            <a href="mailto:vichetkao@outlook.com" className="email-link" {...magnetic}>vichetkao@outlook.com <span><ArrowUpRight size={20} /></span></a>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>

    <footer className="site-footer">
      <div className="section-wrap">
        <a href="#top" className="footer-mark" aria-label="Back to top">{"Dohsray".split("").map((c, i) => <span key={i} style={{ "--i": i } as CSSProperties}>{c}</span>)}</a>
        <div className="footer-row">
          <p>© {new Date().getFullYear()} Dohsray. Founded by Kao Vichet in Cambodia.</p>
          <div className="socials"><a href="#" aria-label="Code profile"><Code2 size={18} /></a><a href="#" aria-label="Professional profile"><BriefcaseBusiness size={18} /></a><a href="#top">Back to top <ArrowUpRight size={16} /></a></div>
        </div>
      </div>
    </footer>

    {selected && <div className="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-title" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
      <article className="modal-panel">
        <div className="modal-top"><span>Solution {selected.id} / {selected.status}</span><button className="modal-close" onClick={() => setSelected(null)} aria-label="Close solution details"><X size={20} /></button></div>
        <div className={`modal-visual ${selected.tone}`}><span className="visual-grid" aria-hidden /><SolutionVisual solution={selected} /></div>
        <div className="modal-content">
          <p className="section-kicker">{selected.category} / {selected.type}</p>
          <h2 id="project-title">{selected.title}</h2>
          <p className="modal-summary">{selected.summary}</p>
          <div className="modal-facts"><div><span>Role</span><strong>{selected.role}</strong></div><div><span>Status</span><strong>{selected.status}</strong></div></div>
          <div className="case-grid">
            <div><span>01 / Problem</span><p>{selected.problem}</p></div>
            <div><span>02 / Solution</span><p>{selected.solution}</p></div>
            <div><span>03 / Impact</span><p>{selected.impact}</p></div>
          </div>
          <div className="stack-row">{selected.stack.map((item) => <span key={item}>{item}</span>)}</div>
          <a href="#contact" className="modal-cta" onClick={() => setSelected(null)}>Build something together <ArrowRight size={18} /></a>
        </div>
      </article>
    </div>}
  </div>;
}
