import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang } from "@/lib/i18n";
import { getAllMolecules, type Grade } from "@/lib/molecole";
import PageHeader from "@/components/PageHeader";
import EvidenceBadge from "@/components/EvidenceBadge";

export async function generateStaticParams() {
  return [{ lang: "it" }, { lang: "en" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const it = lang === "it";
  return {
    title: it ? "Evidenza — Nucleo Longevity" : "Evidence — Nucleo Longevity",
    description: it
      ? "Come leggiamo l'evidenza: la gerarchia degli studi, la scala A–F e cosa risponde davvero ogni grado. Il voto è una risposta a una domanda, non un consiglio."
      : "How we read the evidence: the study hierarchy, the A–F scale, and what each grade actually answers. The grade answers a question — it is not advice.",
    alternates: {
      canonical: `/${lang}/evidence`,
      languages: { it: "/it/evidence", en: "/en/evidence", "x-default": "/en/evidence" },
    },
  };
}

const GRADE_MEANING: Record<Grade, { en: string; it: string }> = {
  A: { en: "Consistent high-quality human evidence supports the specific claim.", it: "Evidenza umana solida e coerente a supporto del claim specifico." },
  B: { en: "Good human evidence, with some limitations.", it: "Buona evidenza umana, con alcune limitazioni." },
  C: { en: "Mixed or preliminary human evidence; plausible but unproven.", it: "Evidenza umana mista o preliminare; plausibile ma non provata." },
  D: { en: "Weak, mostly indirect human evidence.", it: "Evidenza umana debole, per lo più indiretta." },
  E: { en: "Little credible human evidence for the claim as marketed.", it: "Poca evidenza umana credibile per il claim come promosso." },
  F: { en: "Evidence contradicts the claim, or a safety concern dominates.", it: "L'evidenza contraddice il claim, o prevale un problema di sicurezza." },
};

const HIERARCHY: { en: string; it: string }[] = [
  { en: "Meta-analyses & systematic reviews of human RCTs", it: "Meta-analisi e revisioni sistematiche di RCT sull'uomo" },
  { en: "Well-powered, pre-registered RCTs with meaningful endpoints", it: "RCT ben dimensionati e pre-registrati con endpoint rilevanti" },
  { en: "Smaller or surrogate-endpoint RCTs", it: "RCT più piccoli o con endpoint surrogati" },
  { en: "Prospective human cohort / observational data", it: "Dati di coorte / osservazionali prospettici sull'uomo" },
  { en: "Mechanistic, animal or in-vitro — context only, never sufficient", it: "Meccanismo, animale o in-vitro — solo contesto, mai sufficiente" },
];

export default async function EvidencePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const it = lang === "it";

  const mols = getAllMolecules(lang);
  const grades: Grade[] = ["A", "B", "C", "D", "E", "F"];
  const byGrade = grades.map((g) => ({
    grade: g,
    items: mols
      .filter((m) => m.grade === g)
      .sort((a, b) => a.name.localeCompare(b.name)),
  }));
  const graded = mols.filter((m) => m.grade).length;

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <PageHeader
        eyebrow={it ? "Evidenza" : "Evidence"}
        title={it ? "Come leggiamo l'evidenza" : "How we read the evidence"}
        subtitle={
          it
            ? "Il voto A–F risponde a una domanda precisa — «cosa supporta l'evidenza umana per questo uso?» — non è un consiglio d'acquisto. Ecco la gerarchia degli studi e cosa significa ogni grado."
            : "The A–F grade answers a precise question — “what does the human evidence support for this use?” — it is not a purchase recommendation. Here is the study hierarchy and what each grade means."
        }
      />

      {/* Evidence hierarchy */}
      <section className="mb-16">
        <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)] mb-5">
          {it ? "Gerarchia dell'evidenza" : "Evidence hierarchy"}
        </h2>
        <ol className="border-t border-[var(--border)]">
          {HIERARCHY.map((h, i) => (
            <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-4 py-4 border-b border-[var(--border)]">
              <span className="font-mono text-[0.7rem] text-[var(--muted)] tabular pt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-sans text-sm text-[var(--fg)] leading-relaxed">{it ? h.it : h.en}</span>
            </li>
          ))}
        </ol>
        <p className="font-mono text-[0.62rem] text-[var(--muted)] leading-relaxed mt-4 max-w-2xl">
          {it
            ? "Il marketing, le testimonianze e la letteratura del produttore hanno peso zero e non sono mai citati come evidenza."
            : "Marketing, testimonials and manufacturer literature carry zero weight and are never cited as evidence."}
        </p>
      </section>

      {/* Grade scale + counts */}
      <section className="mb-16">
        <div className="flex items-baseline justify-between gap-4 mb-5">
          <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)]">
            {it ? "Scala A–F" : "A–F scale"}
          </h2>
          <span className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] tabular">
            {graded} {it ? "voci graduate" : "graded entries"}
          </span>
        </div>
        <div className="border-t border-[var(--border)]">
          {byGrade.map(({ grade, items }) => (
            <div key={grade} className="grid grid-cols-[3rem_1fr_3rem] gap-4 items-center py-4 border-b border-[var(--border)]">
              <EvidenceBadge grade={grade} />
              <span className="font-sans text-sm text-[var(--muted)] leading-relaxed">{it ? GRADE_MEANING[grade].it : GRADE_MEANING[grade].en}</span>
              <span className="font-mono text-[0.7rem] text-[var(--muted)] tabular text-right">{items.length}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Entries grouped by grade */}
      <section className="mb-16">
        <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)] mb-5">
          {it ? "Voci per grado" : "Entries by grade"}
        </h2>
        <div className="flex flex-col gap-8">
          {byGrade.filter((g) => g.items.length).map(({ grade, items }) => (
            <div key={grade}>
              <div className="flex items-center gap-3 mb-3">
                <EvidenceBadge grade={grade} />
                <span className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] tabular">{items.length}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((m) => (
                  <Link
                    key={m.slug}
                    href={`/${lang}/molecule/${m.slug}`}
                    className="border border-[var(--border)] px-3 py-1.5 hover:border-[var(--accent)] transition-colors font-sans text-sm text-[var(--fg)]"
                  >
                    {m.name}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Cross-links */}
      <div className="flex flex-col sm:flex-row gap-4 border-t border-[var(--border)] pt-8">
        <Link href={`/${lang}/method`} className="flex-1 border border-[var(--border)] hover:border-[var(--accent)] transition-colors p-5">
          <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] mb-1">{it ? "Metodo" : "Method"}</p>
          <p className="font-sans font-medium text-[var(--fg)]">{it ? "Come assegniamo i voti e perché siamo indipendenti →" : "How grades are assigned and why we stay independent →"}</p>
        </Link>
        <Link href={`/${lang}/database`} className="flex-1 border border-[var(--border)] hover:border-[var(--accent)] transition-colors p-5">
          <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] mb-1">{it ? "Database" : "Database"}</p>
          <p className="font-sans font-medium text-[var(--fg)]">{it ? "Sfoglia tutte le voci, filtra e ordina →" : "Browse every entry, filter and sort →"}</p>
        </Link>
      </div>

      <p className="font-mono text-[0.6rem] text-[var(--muted)] leading-relaxed mt-8 max-w-2xl">
        {it
          ? "Il voto non è un consiglio medico né una raccomandazione d'acquisto. La stessa molecola può avere voti diversi per claim diversi. Le citazioni linkano a record PubMed specifici dove un PMID è stato verificato; altrimenti usiamo una query PubMed circoscritta e segnaliamo la voce come da revisionare."
          : "A grade is not medical advice or a purchase recommendation. The same molecule can hold different grades for different claims. Citations link to specific PubMed records where a PMID is verified; otherwise we use a scoped PubMed query and flag the entry as review-required."}
      </p>
    </div>
  );
}
