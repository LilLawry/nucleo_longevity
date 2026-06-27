"use client";
import { useState } from "react";

type Status = "idle" | "loading" | "ok" | "error";
type Field = { key: string; label: string; type?: "textarea"; required?: boolean; placeholder?: string };

export default function ConnectForm({
  lang,
  variant,
  fields,
}: {
  lang: string;
  variant: "brand" | "rep";
  fields: Field[];
}) {
  const it = lang !== "en";
  const [values, setValues] = useState<Record<string, string>>({});
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");

  const set = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || !consent) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variant, email, consent, fields: values }),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "ok") {
    return (
      <div className="border border-[var(--accent)] p-6">
        <p className="font-sans font-medium text-[var(--fg)]">{it ? "Richiesta inviata." : "Request sent."}</p>
        <p className="font-mono text-[0.7rem] text-[var(--muted)] mt-1">
          {it ? "Ti rispondiamo entro pochi giorni lavorativi." : "We'll reply within a few business days."}
        </p>
      </div>
    );
  }

  const field = "w-full bg-[var(--bg)] border border-[var(--border)] text-[var(--fg)] text-sm px-3.5 py-2.5 font-sans placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors";
  const label = "font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-1.5 block";

  return (
    <form onSubmit={submit} className="border border-[var(--border)] p-6 flex flex-col gap-4 max-w-xl">
      {fields.map((f) => (
        <div key={f.key}>
          <label className={label}>{f.label}</label>
          {f.type === "textarea" ? (
            <textarea rows={3} required={f.required} value={values[f.key] || ""} onChange={(e) => set(f.key, e.target.value)} className={`${field} resize-y`} placeholder={f.placeholder} />
          ) : (
            <input required={f.required} value={values[f.key] || ""} onChange={(e) => set(f.key, e.target.value)} className={field} placeholder={f.placeholder} />
          )}
        </div>
      ))}
      <div>
        <label className={label}>{it ? "Email di contatto" : "Contact email"}</label>
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
      </div>
      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" required checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-[var(--accent)] shrink-0" />
        <span className="font-mono text-[0.6rem] leading-relaxed text-[var(--muted)]">
          {it
            ? "Acconsento al trattamento dei dati per essere ricontattato e ho letto la "
            : "I consent to the processing of my data to be contacted and have read the "}
          <a href={`/${lang}/privacy`} className="text-[var(--accent)] link-underline">Privacy Policy</a>.
        </span>
      </label>
      {status === "error" && (
        <p className="font-mono text-[0.65rem] text-[#C45C5C]">
          {it ? "Invio non riuscito. Riprova tra poco." : "Submission failed. Try again shortly."}
        </p>
      )}
      <button type="submit" disabled={status === "loading"} className="btn-accent font-sans font-medium text-sm px-5 py-2.5 self-start disabled:opacity-60 disabled:cursor-wait">
        {status === "loading" ? (it ? "Invio…" : "Sending…") : it ? "Invia" : "Send"}
      </button>
    </form>
  );
}
