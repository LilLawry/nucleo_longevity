import type { Metadata } from "next";
import { getLocale, isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getLocale(lang as "it" | "en");
  return { title: t.metodo.title, description: t.metodo.subtitle };
}

export default async function MetodoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const t = getLocale(lang);

  const steps =
    lang === "it"
      ? [
          {
            n: "01",
            titolo: "Identificazione della domanda",
            testo:
              "Partiamo da una domanda clinicamente rilevante: questa molecola ha effetti misurabili su outcome di salute negli esseri umani? Escludiamo a priori studi su modelli in vitro e animali come evidenza primaria.",
          },
          {
            n: "02",
            titolo: "Ricerca sistematica su PubMed",
            testo:
              'Utilizziamo PubMed (NCBI) come fonte primaria. Filtri applicati: studi umani, peer-reviewed, ultimi 10 anni (salvo letteratura fondamentale), tipi di studio RCT > studi osservazionali > case series. Ogni analisi riporta i PMID delle fonti principali.',
          },
          {
            n: "03",
            titolo: "Grading dell'evidenza (A–F)",
            testo:
              "Adattiamo lo schema GRADE (Grading of Recommendations Assessment, Development and Evaluation):\nA = RCT multipli, alta qualità, effetti consistenti\nB = RCT limitati o eterogeneità moderata\nC = Studi osservazionali di buona qualità\nD = Evidenza debole o inconsistente\nE = Solo studi preliminari / modelli animali\nF = Assenza di evidenza o evidenza contraddittoria",
          },
          {
            n: "04",
            titolo: "Dichiarazione del conflitto di interessi",
            testo:
              "Gli autori dichiarano eventuali interessi economici legati alle molecole trattate. I link di affiliazione sono segnalati esplicitamente. Le valutazioni editoriali sono indipendenti da relazioni commerciali.",
          },
          {
            n: "05",
            titolo: "Aggiornamento periodico",
            testo:
              "La letteratura sulla longevità evolve rapidamente. Ogni analisi include la data di ultima revisione. Le pagine Molecole vengono aggiornate al pubblicarsi di nuovi RCT significativi.",
          },
        ]
      : [
          {
            n: "01",
            titolo: "Question identification",
            testo:
              "We start with a clinically relevant question: does this molecule have measurable effects on human health outcomes? We exclude in vitro and animal studies as primary evidence.",
          },
          {
            n: "02",
            titolo: "Systematic PubMed search",
            testo:
              "We use PubMed (NCBI) as our primary source. Filters applied: human studies, peer-reviewed, last 10 years (except foundational literature), study types: RCT > observational > case series. Each analysis reports the PMIDs of main sources.",
          },
          {
            n: "03",
            titolo: "Evidence grading (A–F)",
            testo:
              "We adapt the GRADE schema:\nA = Multiple high-quality RCTs, consistent effects\nB = Limited RCTs or moderate heterogeneity\nC = Good quality observational studies\nD = Weak or inconsistent evidence\nE = Only preliminary / animal studies\nF = No evidence or contradictory evidence",
          },
          {
            n: "04",
            titolo: "Conflict of interest disclosure",
            testo:
              "Authors disclose any economic interests related to the molecules discussed. Affiliate links are explicitly marked. Editorial ratings are independent of commercial relationships.",
          },
          {
            n: "05",
            titolo: "Periodic updates",
            testo:
              "Longevity literature evolves rapidly. Each analysis includes a last-revised date. Molecule pages are updated when significant new RCTs are published.",
          },
        ];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <div className="max-w-2xl mb-16">
        <p className="font-mono text-xs tracking-widest uppercase text-[var(--accent)] mb-4">
          {t.nav.metodo}
        </p>
        <h1 className="font-sans font-medium text-4xl sm:text-5xl tracking-[-0.03em] text-[var(--fg)] mb-4">
          {t.metodo.title}
        </h1>
        <p className="font-sans text-lg text-[var(--muted)] leading-relaxed">
          {t.metodo.subtitle}
        </p>
      </div>

      <div className="flex flex-col gap-12 max-w-2xl">
        {steps.map((step) => (
          <div key={step.n} className="flex gap-8">
            <div className="shrink-0 pt-0.5">
              <span className="font-mono text-xs tracking-widest text-[var(--accent)]">
                {step.n}
              </span>
            </div>
            <div>
              <h2 className="font-sans font-medium text-lg text-[var(--fg)] mb-2">
                {step.titolo}
              </h2>
              <p className="font-sans text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">
                {step.testo}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Author bio */}
      <div className="mt-20 max-w-2xl border-t border-[var(--border)] pt-10">
        <p className="font-mono text-xs tracking-widest uppercase text-[var(--muted)] mb-3">
          {lang === "it" ? "Chi siamo" : "About"}
        </p>
        <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">
          {lang === "it"
            ? "Redazione Nucleo è un team editoriale con formazione in biochimica, medicina e comunicazione scientifica. Per preservare l'indipendenza editoriale, manteniamo l'anonimato degli autori individuali. Ogni analisi è revisionata da almeno due membri del team prima della pubblicazione."
            : "Nucleo editorial team has backgrounds in biochemistry, medicine and science communication. To preserve editorial independence, we maintain author anonymity. Each analysis is reviewed by at least two team members before publication."}
        </p>
      </div>
    </div>
  );
}
