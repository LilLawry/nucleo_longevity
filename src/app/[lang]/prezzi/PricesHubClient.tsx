"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import EvidenceBadge from "@/components/EvidenceBadge";

export interface HubRow {
  slug: string;
  name: string;
  grade: string;
  count: number;
  from: number;
  perUnitLabel: string | null;
  perUnitValue: number | null;
}

interface Labels {
  molecule: string; grade: string; sellers: string; from: string; perDose: string;
  view: string; gradeAll: string; maxPrice: string; empty: string; results: string;
}

const GRADES = ["A", "B", "C", "D", "E", "F"] as const;

export default function PricesHubClient({ rows, lang, L }: { rows: HubRow[]; lang: string; L: Labels }) {
  const [grade, setGrade] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = useMemo(() => {
    const max = maxPrice.trim() ? Number(maxPrice.replace(",", ".")) : null;
    return rows.filter((r) => (!grade || r.grade === grade) && (max === null || r.from <= max));
  }, [rows, grade, maxPrice]);

  const presentGrades = useMemo(() => new Set(rows.map((r) => r.grade)), [rows]);

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-end gap-x-2 gap-y-3 mb-6 pb-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setGrade("")}
            className={`font-mono text-[0.62rem] uppercase tracking-widest px-2.5 py-1 border transition-colors ${
              grade === "" ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]"
            }`}
          >
            {L.gradeAll}
          </button>
          {GRADES.filter((g) => presentGrades.has(g)).map((g) => (
            <button
              key={g}
              onClick={() => setGrade(grade === g ? "" : g)}
              className={`font-mono text-[0.62rem] px-2.5 py-1 border transition-colors ${
                grade === g ? "border-[var(--accent)] text-[var(--accent)]" : "border-[var(--border)] text-[var(--muted)] hover:text-[var(--fg)]"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
        <div className="flex flex-col gap-1 ml-auto">
          <label className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)]">{L.maxPrice}</label>
          <input
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value.replace(/[^0-9.,]/g, ""))}
            inputMode="decimal"
            placeholder="€"
            className="bg-[var(--bg)] border border-[var(--border)] text-[var(--fg)] text-sm px-3 py-1.5 font-sans w-24 focus:outline-none focus:border-[var(--accent)]"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="font-sans text-sm text-[var(--muted)] py-10">{L.empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[620px]">
            <thead>
              <tr className="border-b-2 border-[var(--border)] text-left">
                {[L.molecule, L.grade, L.sellers, L.from, L.perDose, ""].map((h, i) => (
                  <th key={i} className="py-2.5 pr-4 font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.slug} className="border-b border-[var(--border)] hover:bg-[var(--bg-elev)] transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={`/${lang}/molecule/${r.slug}#offers`} className="font-sans font-medium text-[var(--fg)] hover:text-[var(--accent)] transition-colors">
                      {r.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">{r.grade ? <EvidenceBadge grade={r.grade} /> : "—"}</td>
                  <td className="py-3 pr-4 tabular text-[var(--muted)]">{r.count}</td>
                  <td className="py-3 pr-4 tabular font-medium text-[var(--fg)]">€{r.from.toFixed(2)}</td>
                  <td className="py-3 pr-4 tabular text-[var(--muted)] whitespace-nowrap">
                    {r.perUnitValue != null ? `€${r.perUnitValue.toFixed(2)} ${r.perUnitLabel}` : "—"}
                  </td>
                  <td className="py-3">
                    <Link href={`/${lang}/molecule/${r.slug}#offers`} className="font-mono text-[0.66rem] text-[var(--accent)] link-underline whitespace-nowrap">
                      {L.view} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] mt-4">
            {filtered.length} / {rows.length} · {L.results}
          </p>
        </div>
      )}
    </div>
  );
}
