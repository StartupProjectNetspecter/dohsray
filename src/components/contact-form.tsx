"use client";

import { CircleAlert, ArrowRight, LoaderCircle, RotateCcw } from "lucide-react";
import { useState, type FormEvent } from "react";
import { CONTACT_LIMITS, EMAIL_RE, SUBJECT_SUGGESTIONS } from "@/lib/contact";

type Fields = { name: string; email: string; subject: string; message: string };
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "sent" | "error";

const empty: Fields = { name: "", email: "", subject: "", message: "" };

function validate(f: Fields): Errors {
  const errors: Errors = {};
  if (!f.name.trim()) errors.name = "Please enter your name.";
  if (!EMAIL_RE.test(f.email.trim())) errors.email = "Please enter a valid email.";
  if (!f.subject.trim()) errors.subject = "Please add a subject.";
  if (f.message.trim().length < 10) errors.message = "Please write at least 10 characters.";
  return errors;
}

export function ContactForm() {
  const [fields, setFields] = useState<Fields>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");
  const [sent, setSent] = useState<(Fields & { sentAt: string }) | null>(null);
  const [honeypot, setHoneypot] = useState("");

  function update(key: keyof Fields, value: string) {
    setFields((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length) return;

    setStatus("sending"); setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...fields, website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (data.errors) setErrors(data.errors);
        setServerError(data.error ?? "Please check the highlighted fields.");
        setStatus("error");
        return;
      }
      setSent({ ...fields, sentAt: data.sentAt ?? new Date().toLocaleString() });
      setStatus("sent");
    } catch {
      setServerError("Couldn't reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  function reset() { setFields(empty); setErrors({}); setSent(null); setStatus("idle"); setServerError(""); }

  if (status === "sent" && sent) {
    return <div className="contact-card is-sent" role="status" aria-live="polite">
      <svg className="sent-check" viewBox="0 0 52 52" aria-hidden><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg>
      <h3>Message sent</h3>
      <p className="sent-lead">Thanks, {sent.name.split(" ")[0]}. I&apos;ve received your message and will reply to <b>{sent.email}</b> soon.</p>
      <dl className="sent-summary">
        <div><dt>From</dt><dd>{sent.name} · {sent.email}</dd></div>
        <div><dt>Subject</dt><dd>{sent.subject}</dd></div>
        <div><dt>Message</dt><dd className="sent-message">{sent.message}</dd></div>
        <div><dt>Sent</dt><dd>{sent.sentAt}</dd></div>
      </dl>
      <button type="button" className="ghost-button" onClick={reset}><RotateCcw size={15} /> Send another message</button>
    </div>;
  }

  const sending = status === "sending";
  const remaining = CONTACT_LIMITS.message - fields.message.length;

  return <form className="contact-card" onSubmit={submit} noValidate>
    <div className="contact-card-head"><span className="pulse" /><p>Usually replies within 24 hours</p></div>

    <div className="field-row">
      <Field label="Your name" error={errors.name}>
        <input value={fields.name} onChange={(e) => update("name", e.target.value)} placeholder=" " autoComplete="name" maxLength={CONTACT_LIMITS.name} aria-invalid={Boolean(errors.name)} disabled={sending} />
      </Field>
      <Field label="Email address" error={errors.email}>
        <input type="email" value={fields.email} onChange={(e) => update("email", e.target.value)} placeholder=" " autoComplete="email" maxLength={CONTACT_LIMITS.email} aria-invalid={Boolean(errors.email)} disabled={sending} />
      </Field>
    </div>

    <Field label="Subject" error={errors.subject}>
      <input value={fields.subject} onChange={(e) => update("subject", e.target.value)} placeholder=" " maxLength={CONTACT_LIMITS.subject} aria-invalid={Boolean(errors.subject)} disabled={sending} />
    </Field>
    <div className="subject-chips" role="group" aria-label="Quick subjects">
      {SUBJECT_SUGGESTIONS.map((s) => <button type="button" key={s} className={fields.subject === s ? "chip active" : "chip"} onClick={() => update("subject", s)} disabled={sending}>{s}</button>)}
    </div>

    <Field label="Your message" error={errors.message} counter={remaining < 300 ? `${remaining} left` : undefined}>
      <textarea value={fields.message} onChange={(e) => update("message", e.target.value)} placeholder=" " rows={5} maxLength={CONTACT_LIMITS.message} aria-invalid={Boolean(errors.message)} disabled={sending} />
    </Field>

    {/* Hidden from people; catches spam bots. */}
    <input className="hp-field" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} aria-hidden name="website" />

    {serverError && <p className="form-alert" role="alert"><CircleAlert size={16} /> {serverError}</p>}

    <button type="submit" className="send-button" disabled={sending}>
      {sending ? <><LoaderCircle size={18} className="spin" /> Sending…</> : <>Send message <span><ArrowRight size={18} /></span></>}
    </button>
  </form>;
}

function Field({ label, error, counter, children }: { label: string; error?: string; counter?: string; children: React.ReactNode }) {
  return <label className={error ? "field has-error" : "field"}>
    {children}
    <span className="field-label">{label}</span>
    {counter && <span className="field-counter">{counter}</span>}
    {error && <em className="field-error">{error}</em>}
  </label>;
}
