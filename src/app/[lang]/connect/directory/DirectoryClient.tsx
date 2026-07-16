"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

export interface DirRow {
  slug: string;
  name: string;
  country: string;
  types: string[];
  typeLabels: string[];
  categories: string[];
  verification: string;
  verificationLabel: string;
  commercial: string;
  demo: boolean;
}

interface Labels {
  search: string; type: string; country: string; all: string;
  sponsored: string; results: string; empty: string; view: string;
}

export default function DirectoryClient({
  rows, lang, L, typeOptions, countryOptions,
}: {
  rows: DirRow[]; lang: string; L: Labels; typeOptions: [string, string][]; countryOptions: string[];
}) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("");
  const [country, setCountry] = useState("");

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    return rows.filter((r) => {
      const mq = !t || r.name.toLowerCase().includes(t) || r.categories.join(" ").toLowerCase().includes(t);
      const mt = !type || r.types.includes(type);
      const mc = !country || r.country === country;
      return mq && mt && mc;
    });
  }, [rows, q, type, country]);

  const sel = "bg-[var(--bg)] border border-[var(--border)] text-[var(--fg)] text-xs px-3 py-2 font-mono uppercase tracking-wide focus:outline-none focus:border-[var(--accent)]";

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3 mb-8 pb-6 border-b border-[var(--border)]">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--accent)]">{L.search}</label>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="…"
            className="bg-[var(--bg)] border border-[var(--border)] text-[var(--fg)] text-sm px-3 py-2 font-sans w-60 max-w-full placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--accent)]">{L.type}</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className={sel}>
            <option value="">{L.all}</option>
            {typeOptions.map(([v, lab]) => <option key={v} value={v}>{lab}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--accent)]">{L.country}</label>
          <select value={country} onChange={(e) => setCountry(e.target.value)} className={sel}>
            <option value="">{L.all}</option>
            {countryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <span className="ml-auto font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] tabular">
          {filtered.length} / {rows.length} {L.results}
        </span>
      </div>

      {filtered.length === 0 ? (
        <p className="font-sans text-sm text-[var(--muted)] py-10">{L.empty}</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {filtered.map((r) => (
            <Link key={r.slug} href={`/${lang}/connect/companies/${r.slug}`}
              className="group card-surface p-5 flex flex-col gap-2 hover:border-[var(--accent)] transition-colors">
              <div className="flex items-center justify-between gap-3">
                <span className="font-sans font-medium text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">{r.name}</span>
                <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] shrink-0">{r.country}</span>
              </div>
              <p className="font-mono text-[0.6rem] uppercase tracking-wide text-[var(--muted)]">{r.typeLabels.join(" · ")}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-[0.55rem] uppercase tracking-widest border border-[var(--border)] px-1.5 py-0.5 text-[var(--muted)]">{r.verificationLabel}</span>
                {r.commercial === "sponsored" && (
                  <span className="font-mono text-[0.55rem] uppercase tracking-widest border border-[#B5975D] text-[#B5975D] px-1.5 py-0.5">{L.sponsored}</span>
                )}
                {r.demo && <span className="font-mono text-[0.55rem] uppercase tracking-widest border border-[#B5975D] text-[#B5975D] px-1.5 py-0.5">demo</span>}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
