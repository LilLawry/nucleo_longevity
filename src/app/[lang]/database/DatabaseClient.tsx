"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import EvidenceBadge from "@/components/EvidenceBadge";

export interface Row {
  slug: string;
  name: string;
  class: string;
  grade: string;
  primaryUse: string;
  evidenceStrength: string;
  lastReviewed: string;
  status: string;
}

const GRADE_RANK: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, "": 9 };
type SortKey = "grade" | "lastReviewed" | "name";

export default function DatabaseClient({ rows, lang }: { rows: Row[]; lang: string }) {
  const it = lang !== "en";
  const [q, setQ] = useState("");
  const [grade, setGrade] = useState("");
  const [klass, setKlass] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("grade");
  const [asc, setAsc] = useState(true);

  const classes = useMemo(() => Array.from(new Set(rows.map((r) => r.class))).sort(), [rows]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    const out = rows.filter((r) => {
      const mq = !t || r.name.toLowerCase().includes(t) || r.primaryUse.toLowerCase().includes(t) || r.class.toLowerCase().includes(t);
      const mg = !grade || r.grade === grade;
      const mc = !klass || r.class === klass;
      return mq && mg && mc;
    });
    out.sort((a, b) => {
      let d = 0;
      if (sortKey === "grade") d = GRADE_RANK[a.grade] - GRADE_RANK[b.grade];
      else if (sortKey === "lastReviewed") d = (a.lastReviewed || "").localeCompare(b.lastReviewed || "");
      else d = a.name.localeCompare(b.name);
      return asc ? d : -d;
    });
    return out;
  }, [rows, q, grade, klass, sortKey, asc]);

  const setSort = (k: SortKey) => {
    if (k === sortKey) setAsc((v) => !v);
    else { setSortKey(k); setAsc(true); }
  };
  const arrow = (k: SortKey) => (sortKey === k ? (asc ? "↑" : "↓") : "");

  const sel = "bg-[var(--bg)] border border-[var(--border)] text-[var(--fg)] text-xs px-3 py-2 font-mono uppercase tracking-wide focus:outline-none focus:border-[var(--accent)]";

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-end gap-3 mb-8 pb-6 border-b border-[var(--border)]">
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--accent)]">{it ? "Cerca" : "Search"}</label>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={it ? "molecola, uso, classe…" : "molecule, use, class…"}
            className="bg-[var(--bg)] border border-[var(--border)] text-[var(--fg)] text-sm px-3 py-2 font-sans w-60 max-w-full placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--accent)]">{it ? "Grado" : "Grade"}</label>
          <select value={grade} onChange={(e) => setGrade(e.target.value)} className={sel}>
            <option value="">{it ? "Tutti" : "All"}</option>
            {["A", "B", "C", "D", "E", "F"].map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--accent)]">{it ? "Classe" : "Class"}</label>
          <select value={klass} onChange={(e) => setKlass(e.target.value)} className={sel}>
            <option value="">{it ? "Tutte" : "All"}</option>
            {classes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <span className="ml-auto font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] tabular">
          {filtered.length} / {rows.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm min-w-[680px]">
          <thead>
            <tr className="border-b-2 border-[var(--border)] text-left">
              <Th onClick={() => setSort("name")} label={it ? "Molecola" : "Molecule"} arrow={arrow("name")} />
              <Th label={it ? "Classe" : "Class"} />
              <Th onClick={() => setSort("grade")} label={it ? "Grado" : "Grade"} arrow={arrow("grade")} />
              <Th label={it ? "Uso principale" : "Primary use"} />
              <Th label={it ? "Evidenza" : "Evidence"} />
              <Th onClick={() => setSort("lastReviewed")} label={it ? "Revisione" : "Reviewed"} arrow={arrow("lastReviewed")} />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.slug} className="border-b border-[var(--border)] hover:bg-[var(--bg-elev)] transition-colors">
                <td className="py-3 pr-4">
                  <Link href={`/${lang}/molecule/${r.slug}`} className="font-sans font-medium text-[var(--fg)] hover:text-[var(--accent)] transition-colors">
                    {r.name}
                  </Link>
                </td>
                <td className="py-3 pr-4 font-mono text-[0.7rem] uppercase tracking-wide text-[var(--muted)]">{r.class}</td>
                <td className="py-3 pr-4">{r.grade ? <EvidenceBadge grade={r.grade} /> : <span className="font-mono text-[0.68rem] text-[var(--muted)]">{it ? "in revisione" : "under review"}</span>}</td>
                <td className="py-3 pr-4 text-[var(--muted)]">{r.primaryUse}</td>
                <td className="py-3 pr-4 font-mono text-[0.7rem] uppercase tracking-wide text-[var(--muted)]">{r.evidenceStrength || "—"}</td>
                <td className="py-3 font-mono text-[0.72rem] text-[var(--muted)] tabular">{r.lastReviewed || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="font-sans text-sm text-[var(--muted)] py-10">{it ? "Nessuna molecola trovata." : "No molecule found."}</p>
        )}
      </div>
    </div>
  );
}

function Th({ label, onClick, arrow }: { label: string; onClick?: () => void; arrow?: string }) {
  return (
    <th className="py-2.5 pr-4 font-mono text-[0.58rem] uppercase tracking-widest text-[var(--accent)] font-medium">
      {onClick ? (
        <button onClick={onClick} className="inline-flex items-center gap-1 hover:text-[var(--fg)] transition-colors uppercase tracking-widest">
          {label} <span className="tabular">{arrow}</span>
        </button>
      ) : label}
    </th>
  );
}
