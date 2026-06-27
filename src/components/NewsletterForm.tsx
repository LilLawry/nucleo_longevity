"use client";
import { useState } from "react";
import type { Locale } from "@/locales/it";

interface Props {
  lang: string;
  t: Locale;
  compact?: boolean;
  showRole?: boolean;
}

type Status = "idle" | "loading" | "pending" | "error";

export default function NewsletterForm({ lang, t, compact, showRole }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const it = lang !== "en";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || !consent) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, lang, role, consent }),
      });
      if (res.ok) setStatus("pending");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "pending") {
    return (
      <div className="flex items-start gap-2.5 border border-[var(--accent)] rounded bg-[rgba(17,96,95,0.06)] px-4 py-3">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
          <path d="M4 4h16v16H4z" /><polyline points="4 6 12 13 20 6" />
        </svg>
        <div>
          <p className="font-sans text-sm font-medium text-[var(--fg)]">
            {it ? "Controlla la tua email" : "Check your inbox"}
          </p>
          <p className="font-mono text-[0.65rem] text-[var(--muted)] mt-0.5">
            {it
              ? "Ti abbiamo inviato un link di conferma."
              : "We sent you a confirmation link."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {showRole && (
        <div className="flex flex-col gap-1">
          <label className="font-mono text-xs tracking-widest uppercase text-[var(--muted)]">
            {t.capture.role_label}
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--fg)] text-sm px-3 py-2 font-sans focus:outline-none focus:border-[var(--accent)] transition-all"
          >
            <option value="">—</option>
            <option value="medico">{t.capture.role_medico}</option>
            <option value="consumatore">{t.capture.role_consumatore}</option>
          </select>
        </div>
      )}
      <div className={`flex ${compact ? "flex-col gap-2" : "flex-row gap-2"}`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={compact ? t.footer.newsletter_placeholder : t.capture.placeholder}
          className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--fg)] text-sm px-3.5 py-2.5 font-sans placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-all"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="btn-accent font-sans font-medium text-sm px-5 py-2.5 whitespace-nowrap disabled:opacity-60 disabled:cursor-wait"
        >
          {status === "loading"
            ? it ? "Invio…" : "Sending…"
            : compact ? t.footer.newsletter_button : t.capture.button}
        </button>
      </div>
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 accent-[var(--accent)] shrink-0"
        />
        <span className="font-mono text-[0.6rem] leading-relaxed text-[var(--muted)]">
          {it ? "Acconsento a ricevere la newsletter e ho letto la " : "I agree to receive the newsletter and have read the "}
          <a href={`/${lang}/privacy`} className="text-[var(--accent)] link-underline">Privacy Policy</a>.
        </span>
      </label>
      {status === "error" && (
        <p className="font-mono text-[0.65rem] text-[#C45C5C]">
          {it
            ? "Qualcosa è andato storto. Riprova tra poco."
            : "Something went wrong. Please try again shortly."}
        </p>
      )}
      {!compact && status !== "error" && (
        <p className="font-mono text-[0.65rem] text-[var(--muted)]">{t.capture.disclaimer}</p>
      )}
    </form>
  );
}
