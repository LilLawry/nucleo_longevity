import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang, getLocale, langs } from "@/lib/i18n";
import { getAllMolecules, GRADE_RANK } from "@/lib/molecole";
import NewsletterForm from "@/components/NewsletterForm";
import NucleusMark from "@/components/NucleusMark";
import PrintButton from "@/components/PrintButton";

const GRADES = ["A", "B", "C", "D", "E", "F"] as const;
const GRADE_COLOR: Record<string, string> = {
  A: "#11605F", B: "#2E7D7C", C: "#5C9897", D: "#8A9295", E: "#B5975D", F: "#C45C5C",
};

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const it = lang === "it";
  const title = it ? "La Pagella delle Molecole Longevity" : "The Longevity Molecule Report Card";
  const description = it
    ? "Ogni molecola per la longevità con un voto A–F basato sull'evidenza. Scarica o stampa la pagella completa, gratis."
    : "Every longevity molecule with an evidence-based A–F grade. Download or print the full report card, free.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/report-card`,
      languages: { it: "/it/report-card", en: "/en/report-card", "x-default": "/en/report-card" },
    },
    openGraph: { title, description, type: "article" },
  };
}

export default async function ReportCardPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const t = getLocale(lang);
  const it = lang === "it";

  // Only published, graded molecules — this is a "best of the evidence" sheet.
  const molecules = getAllMolecules()
    .filter((m) => m.grade && m.status === "published")
    .sort((a, b) => GRADE_RANK[a.grade] - GRADE_RANK[b.grade] || a.name.localeCompare(b.name));

  const byGrade = GRADES.map((g) => ({ g, list: molecules.filter((m) => m.grade === g) })).filter((x) => x.list.length);

  const L = {
    eyebrow: it ? "Risorsa gratuita" : "Free resource",
    title: it ? "La Pagella delle Molecole" : "The Molecule Report Card",
    intro: it
      ? `${molecules.length} molecole per la longevità, ciascuna con un voto da A a F basato solo sugli studi clinici — non sul marketing. Stampala o salvala in PDF.`
      : `${molecules.length} longevity molecules, each with an A-to-F grade based only on the clinical studies — not the marketing. Print it or save it as a PDF.`,
    print: it ? "Stampa / Salva PDF" : "Print / Save as PDF",
    legend: it ? "A = evidenza forte · F = insufficiente" : "A = strong evidence · F = insufficient",
    grade: it ? "Voto" : "Grade",
    ctaTitle: it ? "Ricevi gli aggiornamenti della pagella" : "Get report-card updates",
    ctaSub: it
      ? "Nuove molecole e revisioni dei voti, ogni due settimane. Niente spam, niente promesse miracolose."
      : "New molecules and grade revisions, every two weeks. No spam, no miracle promises.",
    disclaimer: it
      ? "A scopo informativo. Non è un consiglio medico: parla con un professionista prima di iniziare qualsiasi integratore o farmaco."
      : "For information only. Not medical advice: talk to a professional before starting any supplement or drug.",
    updated: it ? "Aggiornata" : "Updated",
    openLabel: it ? "Scheda completa" : "Full sheet",
  };

  const lastUpdated = molecules
    .map((m) => m.lastReviewed)
    .filter(Boolean)
    .sort()
    .slice(-1)[0] || "";

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-14 md:py-20">
      {/* Header */}
      <header className="text-center mb-12 report-header">
        <div className="flex justify-center mb-6">
          <NucleusMark size={54} className="text-[var(--accent)]" />
        </div>
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)] mb-4">{L.eyebrow}</p>
        <h1 className="font-serif font-medium text-4xl sm:text-5xl md:text-6xl tracking-[-0.02em] text-[var(--fg)] mb-5 text-balance">
          {L.title}
        </h1>
        <p className="font-sans text-lg text-[var(--muted)] leading-relaxed max-w-2xl mx-auto text-pretty mb-8">
          {L.intro}
        </p>
        <div className="flex items-center justify-center gap-3">
          <PrintButton label={L.print} />
          <Link
            href={`/${lang}/database`}
            className="no-print font-sans font-medium text-sm px-6 py-3 border border-[var(--border)] text-[var(--fg)] hover:border-[var(--accent)] transition-colors"
          >
            {it ? "Apri il database →" : "Open the database →"}
          </Link>
        </div>
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] mt-6">
          {L.legend}{lastUpdated ? ` · ${L.updated} ${lastUpdated}` : ""}
        </p>
      </header>

      {/* Grade groups */}
      <div className="border-t border-[var(--border)]">
        {byGrade.map(({ g, list }) => (
          <section key={g} className="py-8 border-b border-[var(--border)] grade-group">
            <div className="flex items-center gap-3 mb-5">
              <span
                className="inline-flex items-center justify-center font-sans font-semibold text-lg w-9 h-9 border tabular"
                style={{ color: GRADE_COLOR[g], borderColor: GRADE_COLOR[g] }}
              >
                {g}
              </span>
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)]">
                {t.grades[g]} · {list.length}
              </span>
            </div>
            <ul className="flex flex-col divide-y divide-[var(--border)]">
              {list.map((m) => (
                <li key={m.slug} className="py-3.5 grade-row">
                  <Link
                    href={`/${lang}/molecule/${m.slug}`}
                    className="group grid grid-cols-[1fr] sm:grid-cols-[minmax(0,14rem)_1fr] gap-1 sm:gap-6 items-baseline"
                  >
                    <div className="flex items-baseline gap-2">
                      <span className="font-sans font-medium text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                        {m.name}
                      </span>
                      {m.regulatory && (
                        <span className="font-mono text-[0.55rem] uppercase tracking-wide text-[var(--muted)] hidden sm:inline">
                          {/drug|prescription|farmaco/i.test(m.regulatory) ? (it ? "farmaco" : "drug") : ""}
                        </span>
                      )}
                    </div>
                    <span className="font-sans text-sm text-[var(--muted)] leading-snug text-pretty">
                      {m.bottomLine || m.claim}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="font-mono text-[0.62rem] text-[var(--muted)] leading-relaxed mt-8 max-w-2xl">
        {L.disclaimer}
      </p>

      {/* Newsletter capture */}
      <section className="no-print mt-14 card-surface px-6 sm:px-10 py-12 text-center">
        <div className="max-w-md mx-auto">
          <h2 className="font-sans font-medium text-2xl tracking-[-0.02em] text-[var(--fg)] mb-2 text-balance">
            {L.ctaTitle}
          </h2>
          <p className="font-sans text-sm text-[var(--muted)] leading-relaxed mb-6 text-pretty">{L.ctaSub}</p>
          <NewsletterForm lang={lang} t={t} />
        </div>
      </section>
    </div>
  );
}
