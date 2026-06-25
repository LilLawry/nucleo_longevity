"use client";
import { useState } from "react";
import type { Locale } from "@/locales/it";
import type { MOLECULES } from "@/lib/articles";
import EvidenceBadge from "@/components/EvidenceBadge";

const ALL_GRADES = ["A", "B", "C", "D", "E", "F"];

interface Props {
  lang: string;
  t: Locale;
  molecules: typeof MOLECULES;
}

export default function MolecoleClient({ lang, t, molecules }: Props) {
  const [query, setQuery] = useState("");
  const [activeGrade, setActiveGrade] = useState<string | null>(null);

  const filtered = molecules.filter((m) => {
    const name = lang === "en" ? m.nome_en : m.nome;
    const desc = lang === "en" ? m.descrizione_en : m.descrizione;
    const matchQuery =
      !query ||
      name.toLowerCase().includes(query.toLowerCase()) ||
      desc.toLowerCase().includes(query.toLowerCase());
    const matchGrade = !activeGrade || m.grado === activeGrade;
    return matchQuery && matchGrade;
  });

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.molecole.search_placeholder}
          className="flex-1 bg-transparent border border-[var(--border)] text-[var(--fg)] text-sm px-4 py-2.5 font-sans placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs text-[var(--muted)] tracking-widest uppercase">
            {t.molecole.grade_label}:
          </span>
          {ALL_GRADES.map((g) => (
            <EvidenceBadge
              key={g}
              grade={g}
              onClick={() => setActiveGrade(activeGrade === g ? null : g)}
              active={activeGrade === g}
            />
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="font-sans text-sm text-[var(--muted)] py-8">{t.molecole.empty}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((mol) => (
            <div
              key={mol.id}
              className="border border-[var(--border)] p-5 flex flex-col gap-3 hover:border-[var(--accent)] transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-sans font-medium text-base text-[var(--fg)]">
                  {lang === "en" ? mol.nome_en : mol.nome}
                </h3>
                <EvidenceBadge grade={mol.grado} />
              </div>
              <p className="font-sans text-sm text-[var(--muted)] leading-relaxed flex-1">
                {lang === "en" ? mol.descrizione_en : mol.descrizione}
              </p>
              <p className="font-mono text-[0.65rem] text-[var(--accent)] uppercase tracking-wider">
                {lang === "en" ? mol.categoria_en : mol.categoria}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
