import { Heart, Link2Off, Lock, MessageCircle, PenLine, ShieldCheck, Trash2, UserX } from "lucide-react";
import type { Solution } from "@/data/solutions";

export function SolutionVisual({ solution }: { solution: Solution }) {
  switch (solution.visual) {
    case "confession": return <ConfessionVisual />;
    case "tracker": return <TrackerVisual />;
    case "shield": return <ShieldVisual />;
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

function WindowVisual() {
  return (
    <div className="mock-window" aria-hidden>
      <div className="mock-top"><i /><i /><i /></div>
      <div className="mock-layout"><span className="mock-sidebar" /><div className="mock-content"><b /><b /><b /></div></div>
    </div>
  );
}
