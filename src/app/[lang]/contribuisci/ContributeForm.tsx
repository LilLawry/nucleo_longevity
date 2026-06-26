"use client";
import { useState } from "react";

type Status = "idle" | "loading" | "ok" | "error";

export default function ContributeForm({ lang }: { lang: string }) {
  const it = lang !== "en";
  const [form, setForm] = useState({ name: "", email: "", type: "esperto", links: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    try {
      const res = await fetch("/api/contribute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      setStatus(res.ok ? "ok" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "ok") {
    return (
      <div className="card-surface p-6 flex items-start gap-3">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
          <polyline points="20 6 9 17 4 12" />
        </svg>
        <div>
          <p className="font-sans font-medium text-[var(--fg)]">{it ? "Candidatura inviata." : "Application sent."}</p>
          <p className="font-mono text-[0.7rem] text-[var(--muted)] mt-1">
            {it ? "Ti rispondiamo entro pochi giorni." : "We'll get back to you within a few days."}
          </p>
        </div>
      </div>
    );
  }

  const field = "w-full bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--fg)] text-sm px-3.5 py-2.5 font-sans placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--glow)] transition-all";
  const label = "font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] mb-1.5 block";

  return (
    <form onSubmit={submit} className="card-surface p-6 flex flex-col gap-4 max-w-lg">
      <div>
        <label className={label}>{it ? "Sono" : "I am"}</label>
        <select value={form.type} onChange={(e) => set("type", e.target.value)} className={field}>
          <option value="esperto">{it ? "Esperto / KOL (voglio contribuire)" : "Expert / KOL (want to contribute)"}</option>
          <option value="professionista">{it ? "Professionista (network)" : "Professional (network)"}</option>
          <option value="partner">{it ? "Brand / Partner" : "Brand / Partner"}</option>
        </select>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={label}>{it ? "Nome" : "Name"}</label>
          <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={field} />
        </div>
        <div>
          <label className={label}>Email</label>
          <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={field} />
        </div>
      </div>
      <div>
        <label className={label}>{it ? "Link (LinkedIn, sito, pubblicazioni)" : "Links (LinkedIn, site, publications)"}</label>
        <input value={form.links} onChange={(e) => set("links", e.target.value)} className={field} placeholder="https://" />
      </div>
      <div>
        <label className={label}>{it ? "Raccontaci di te" : "Tell us about you"}</label>
        <textarea required rows={4} value={form.message} onChange={(e) => set("message", e.target.value)} className={`${field} resize-y`} />
      </div>
      {status === "error" && (
        <p className="font-mono text-[0.65rem] text-[#C45C5C]">
          {it ? "Invio non riuscito. Riprova tra poco." : "Submission failed. Try again shortly."}
        </p>
      )}
      <button type="submit" disabled={status === "loading"} className="btn-accent font-sans font-medium text-sm px-5 py-2.5 self-start disabled:opacity-60 disabled:cursor-wait">
        {status === "loading" ? (it ? "Invio…" : "Sending…") : it ? "Invia candidatura" : "Send application"}
      </button>
    </form>
  );
}
