"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/locales/it";
import EvidenceBadge from "@/components/EvidenceBadge";

export interface AnalisiItem {
  slug: string;
  titolo: string;
  title_en?: string;
  molecola: string;
  categoria: string;
  grado: string;
  data: string;
  readingTime: string;
  excerpt?: string;
  excerpt_en?: string;
}

interface Props {
  lang: string;
  t: Locale;
  items: AnalisiItem[];
  categories: string[];
}

export default function AnalisiClient({ lang, t, items, categories }: Props) {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState(categories[0]); // "Tutte" / "All"

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((a) => {
      const title = lang === "en" && a.title_en ? a.title_en : a.titolo;
      const matchCat = activeCat === categories[0] || a.categoria === activeCat;
      const matchQuery =
        !q ||
        title.toLowerCase().includes(q) ||
        a.molecola.toLowerCase().includes(q) ||
        a.categoria.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [items, query, activeCat, lang, categories]);

  return (
    <div>
      {/* Search */}
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={lang === "it" ? "Cerca analisi, molecola…" : "Search analysis, molecule…"}
        className="w-full sm:max-w-sm bg-[var(--bg)] border border-[var(--border)] rounded text-[var(--fg)] text-sm px-4 py-2.5 font-sans placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--glow)] transition-all mb-6"
      />

      {/* Category chips */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => {
          const active = cat === activeCat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className={`font-mono text-[0.65rem] uppercase tracking-widest px-3 py-1.5 border rounded transition-colors ${
                active
                  ? "border-[var(--accent)] bg-[var(--accent)] text-white dark:text-[#0E1214]"
                  : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="font-sans text-sm text-[var(--muted)] py-8">
          {lang === "it" ? "Nessuna analisi trovata." : "No analysis found."}
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-[var(--border)]">
          {filtered.map((a) => (
            <Link
              key={a.slug}
              href={`/${lang}/analisi/${a.slug}`}
              className="group py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8 px-4 -mx-4 rounded-lg hover:bg-[var(--bg-elev)] transition-colors"
            >
              <div className="shrink-0 sm:w-32">
                <EvidenceBadge grade={a.grado} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)] mb-1.5">
                  {a.molecola} · {a.categoria}
                </p>
                <h2 className="font-sans font-medium text-lg text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-2">
                  {lang === "en" && a.title_en ? a.title_en : a.titolo}
                </h2>
                <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">
                  {lang === "en" && a.excerpt_en ? a.excerpt_en : a.excerpt}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-[0.65rem] text-[var(--muted)]">{a.data}</p>
                <p className="font-mono text-[0.65rem] text-[var(--muted)]">
                  {a.readingTime} {t.article.reading_time}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
