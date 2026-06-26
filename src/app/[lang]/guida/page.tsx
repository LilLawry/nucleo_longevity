import type { Metadata } from "next";
import Link from "next/link";
import { isValidLang } from "@/lib/i18n";
import { MOLECULES } from "@/lib/articles";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import EvidenceBadge from "@/components/EvidenceBadge";

export async function generateStaticParams() {
  return [{ lang: "it" }, { lang: "en" }];
}

export const metadata: Metadata = {
  title: "Guida alle molecole longevity",
  robots: { index: false, follow: false },
};

const GRADE_ORDER = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 } as const;

export default async function GuidaPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const it = lang === "it";

  const sorted = [...MOLECULES].sort(
    (a, b) => GRADE_ORDER[a.grado] - GRADE_ORDER[b.grado]
  );

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <PageHeader
        eyebrow={it ? "Guida riservata agli iscritti" : "Subscriber guide"}
        title={it ? "Molecole longevity: la guida Nucleo" : "Longevity molecules: the Nucleo guide"}
        subtitle={
          it
            ? "Le molecole più discusse, ordinate per solidità dell'evidenza scientifica (A–F). Nessuna promozione: la lettera dice solo quanto è provato, non quanto è pubblicizzato."
            : "The most-discussed molecules, ranked by strength of scientific evidence (A–F). No promotion: the grade reflects how proven, not how marketed."
        }
      />

      <div className="card-surface divide-y divide-[var(--border)]">
        {sorted.map((m, i) => (
          <div key={m.id} className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
            <span className="font-mono text-xs text-[var(--muted)] w-6 shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-sans font-medium text-base text-[var(--fg)]">
                  {it ? m.nome : m.nome_en}
                </h2>
                <EvidenceBadge grade={m.grado} />
              </div>
              <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">
                {it ? m.descrizione : m.descrizione_en}
              </p>
            </div>
            <span className="font-mono text-[0.65rem] uppercase tracking-wider text-[var(--accent)] shrink-0">
              {it ? m.categoria : m.categoria_en}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-10 fact-box">
        <p className="font-sans text-sm text-[var(--fg)] leading-relaxed">
          {it
            ? "Questa guida è un estratto vivo: aggiorniamo i gradi quando escono nuovi studi. Ogni due settimane ricevi un'analisi approfondita su una di queste molecole, con dosaggi studiati e fonti PubMed."
            : "This guide is a living extract: we update grades as new studies appear. Every two weeks you'll get an in-depth analysis of one of these molecules, with studied dosages and PubMed sources."}
        </p>
        <Link
          href={`/${lang}/analisi`}
          className="inline-flex items-center mt-4 font-mono text-xs text-[var(--accent)] link-underline"
        >
          {it ? "Vai alle analisi complete →" : "Go to the full analyses →"}
        </Link>
      </div>
    </div>
  );
}
