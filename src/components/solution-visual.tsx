import { Code2, Heart, Link2Off, Lock, MessageCircle, PenLine, Pill, ShieldCheck, Trash2, TriangleAlert, UserX, Users } from "lucide-react";
import type { Solution } from "@/data/solutions";

export function SolutionVisual({ solution }: { solution: Solution }) {
  switch (solution.visual) {
    case "confession": return <ConfessionVisual />;
    case "tracker": return <TrackerVisual />;
    case "shield": return <ShieldVisual />;
    case "portfolio": return <PortfolioVisual />;
    case "health": return <HealthVisual />;
    default: return <WindowVisual />;
  }
}

function ConfessionVisual() {
  return (
    <div className="v-confession" aria-hidden>
      <span className="cf-card cf-back" />
      <span className="cf-card cf-mid" />
      <div className="cf-card cf-front">
        <div className="cf-head"><span className="cf-avatar" /><div><b>Anonymous</b><small>just now</small></div></div>
        <p>I&apos;ve never told anyone this, but…<span className="cf-caret" /></p>
        <div className="cf-lines"><i /><i /></div>
        <div className="cf-actions"><span className="cf-like"><Heart size={13} fill="currentColor" /> 128</span><span><MessageCircle size={13} /> 24</span></div>
      </div>
      <span className="cf-compose"><PenLine size={18} /></span>
    </div>
  );
}

function TrackerVisual() {
  return (
    <div className="v-tracker" aria-hidden>
      <div className="tg-bubble">Meeting moved to 3pm today.</div>
      <div className="tg-bubble tg-deleted">
        <s>Send the payment to this new account</s>
        <em><Trash2 size={11} /> Deleted · recovered by Snamdan</em>
      </div>
      <div className="tg-bubble out tg-edited">
        <span className="tg-old">Final price is $40</span>
        Final price is $55
        <em>Edited · original kept</em>
      </div>
      <div className="tg-log"><b>Snamdan log</b><span><i className="dot-red" />1 deleted</span><span><i className="dot-amber" />1 edited</span></div>
    </div>
  );
}

function ShieldVisual() {
  return (
    <div className="v-shield" aria-hidden>
      <div className="radar">
        <span className="ring" /><span className="ring r2" /><span className="ring r3" />
        <span className="radar-ping" /><span className="sweep" />
        <span className="shield-core"><ShieldCheck size={36} /></span>
      </div>
      <span className="threat t1"><Link2Off size={13} /> Phishing link blocked</span>
      <span className="threat t2"><UserX size={13} /> Spam bot removed</span>
      <span className="threat t3"><Lock size={13} /> Group protected</span>
    </div>
  );
}

function PortfolioVisual() {
  return (
    <div className="v-portfolio" aria-hidden>
      <div className="pf-window">
        <div className="pf-bar"><i /><i /><i /><span>vichetkao.com</span></div>
        <div className="pf-body">
          <div className="pf-head"><span className="pf-avatar" /><div><b>Kao Vichet</b><small>Software Developer &amp; Data Science</small></div></div>
          <p className="pf-title">I build clean, reliable digital products.</p>
          <div className="pf-stats"><span><b>15+</b> Projects</span><span className="pf-uptime"><i /> Career uptime</span></div>
          <div className="pf-tiles"><span /><span /><span /></div>
        </div>
      </div>
      <span className="pf-badge"><Code2 size={14} /> Full stack · AI</span>
    </div>
  );
}

function HealthVisual() {
  return (
    <div className="v-health" aria-hidden>
      <div className="hl-card">
        <div className="hl-head"><span className="hl-plate" /><div><b>Meal scan</b><small>Fried rice · just now</small></div></div>
        <div className="hl-body">
          <div className="hl-score">
            <svg viewBox="0 0 36 36"><circle cx="18" cy="18" r="15.5" className="hl-track" /><circle cx="18" cy="18" r="15.5" className="hl-ring" /></svg>
            <span><b>72</b><small>Safety</small></span>
          </div>
          <div className="hl-alerts">
            <span className="hl-danger"><TriangleAlert size={13} /> Peanut detected</span>
            <span className="hl-safe"><Pill size={13} /> Medicine safe</span>
          </div>
        </div>
      </div>
      <span className="hl-family"><Users size={14} /> Shared with Mom</span>
    </div>
  );
}

function WindowVisual() {
  return (
    <div className="mock-window" aria-hidden>
      <div className="mock-top"><i /><i /><i /></div>
      <div className="mock-layout"><span className="mock-sidebar" /><div className="mock-content"><b /><b /><b /></div></div>
    </div>
  );
}
