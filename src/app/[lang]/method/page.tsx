import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import NucleusMark from "@/components/NucleusMark";

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
      <PageHeader eyebrow={t.nav.metodo} title={t.metodo.title} subtitle={t.metodo.subtitle} />

      {/* Timeline */}
      <div className="relative max-w-2xl">
        <div className="absolute left-[7px] top-2 bottom-2 w-px bg-[var(--border)]" aria-hidden />
        <div className="flex flex-col gap-10">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 70}>
              <div className="relative flex gap-7 pl-8">
                <span
                  className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-[var(--accent)] bg-[var(--bg)]"
                  aria-hidden
                />
                <div>
                  <span className="font-mono text-xs tracking-widest text-[var(--accent)] block mb-1">
                    {step.n}
                  </span>
                  <h2 className="font-sans font-medium text-lg text-[var(--fg)] mb-2">
                    {step.titolo}
                  </h2>
                  <p className="font-sans text-sm text-[var(--muted)] leading-relaxed whitespace-pre-line">
                    {step.testo}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Independence & conflict of interest */}
      <Reveal className="mt-20 max-w-2xl">
        <div className="border border-[var(--border)] p-7">
          <p className="font-mono text-xs tracking-widest uppercase text-[var(--accent)] mb-4">
            {lang === "it" ? "Dichiarazione d'indipendenza" : "Independence declaration"}
          </p>
          <ul className="flex flex-col gap-3">
            {(lang === "it"
              ? [
                  "Nessun legame con l'industria di integratori, farmaci o dispositivi.",
                  "Nessuna sponsorizzazione: i gradi A–F non sono in vendita e non sono negoziabili.",
                  "Non vendiamo prodotti propri (eventuali link di affiliazione sono segnalati e non influenzano le valutazioni).",
                  "Le fonti sono pubbliche e tracciabili: ogni affermazione rilevante cita il PMID su PubMed.",
                  "Conflitti d'interesse, se presenti, sono dichiarati esplicitamente nella singola analisi.",
                ]
              : [
                  "No ties to the supplement, drug or device industry.",
                  "No sponsorships: A–F grades are not for sale and are non-negotiable.",
                  "We do not sell our own products (any affiliate links are disclosed and never influence ratings).",
                  "Sources are public and traceable: every material claim cites a PubMed PMID.",
                  "Conflicts of interest, if any, are disclosed explicitly within each analysis.",
                ]
            ).map((line) => (
              <li key={line} className="flex gap-3 font-sans text-sm text-[var(--muted)] leading-relaxed">
                <span className="text-[var(--accent)] shrink-0 mt-0.5">—</span>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      {/* Author bio */}
      <Reveal className="mt-8 max-w-2xl">
        <div className="card-surface p-7 flex flex-col sm:flex-row gap-6 items-start">
          <NucleusMark size={40} className="text-[var(--accent)] shrink-0" />
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-[var(--muted)] mb-2">
              {lang === "it" ? "Chi siamo" : "About"}
            </p>
            <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">
              {lang === "it"
                ? "Redazione Nucleo è un team editoriale con formazione in biochimica, medicina e comunicazione scientifica. Per preservare l'indipendenza editoriale, manteniamo l'anonimato degli autori individuali. Ogni analisi è revisionata da almeno due membri del team prima della pubblicazione."
                : "Nucleo editorial team has backgrounds in biochemistry, medicine and science communication. To preserve editorial independence, we maintain author anonymity. Each analysis is reviewed by at least two team members before publication."}
            </p>
            <Link
              href={`/${lang}/chi-siamo`}
              className="inline-flex items-center mt-4 font-mono text-xs text-[var(--accent)] link-underline"
            >
              {lang === "it" ? "Scopri di più →" : "Learn more →"}
            </Link>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
