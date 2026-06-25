"use client";
import { useState } from "react";
import type { Locale } from "@/locales/it";

interface Props {
  lang: string;
  t: Locale;
  compact?: boolean;
  showRole?: boolean;
}

export default function NewsletterForm({ t, compact, showRole }: Props) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Integration point for email service
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="font-mono text-xs text-[var(--accent)] tracking-wide">
        ✓ Iscrizione confermata
      </p>
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
            className="bg-transparent border border-[var(--border)] text-[var(--fg)] text-sm px-3 py-2 font-sans focus:outline-none focus:border-[var(--accent)] transition-colors"
          >
            <option value="">—</option>
            <option value="medico">{t.capture.role_medico}</option>
            <option value="consumatore">{t.capture.role_consumatore}</option>
          </select>
        </div>
      )}
      <div className={`flex ${compact ? "flex-col gap-2" : "flex-row gap-0"}`}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={compact ? t.footer.newsletter_placeholder : t.capture.placeholder}
          className="flex-1 bg-transparent border border-[var(--border)] text-[var(--fg)] text-sm px-3 py-2.5 font-sans placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        <button
          type="submit"
          className="bg-[var(--accent)] text-white font-sans font-medium text-sm px-5 py-2.5 hover:bg-[var(--accent-dark)] transition-colors whitespace-nowrap"
          style={{ color: "#fff" }}
        >
          {compact ? t.footer.newsletter_button : t.capture.button}
        </button>
      </div>
      {!compact && (
        <p className="font-mono text-[0.65rem] text-[var(--muted)]">{t.capture.disclaimer}</p>
      )}
    </form>
  );
}
