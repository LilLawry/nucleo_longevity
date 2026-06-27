import type { Metadata } from "next";
import Link from "next/link";
import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import NucleusMark from "@/components/NucleusMark";

export async function generateStaticParams() {
  return [{ lang: "it" }, { lang: "en" }];
}

const COPY = {
  it: {
    eyebrow: "Chi siamo",
    title: "Indipendenti per principio.",
    subtitle:
      "Nucleo Longevity nasce da un'idea semplice: la longevità merita informazione onesta, non marketing travestito da scienza.",
    values: [
      {
        h: "La nostra missione",
        p: "Tradurre la letteratura scientifica sulla longevità in valutazioni chiare e verificabili. Per ogni molecola diciamo cosa sappiamo davvero, con quanta sicurezza, e quali sono i limiti degli studi.",
      },
      {
        h: "Come lavoriamo",
        p: "Partiamo dagli studi sull'uomo, privilegiamo gli RCT, e gradiamo l'evidenza con uno schema GRADE adattato (A–F). Ogni analisi cita i PMID delle fonti, così puoi verificare tutto su PubMed.",
      },
      {
        h: "Come ci finanziamo",
        p: "Alcuni link sono di affiliazione e possono generare una commissione, senza costi aggiuntivi per te. Le commissioni non influenzano mai i gradi di evidenza: il giudizio scientifico viene prima del business.",
      },
      {
        h: "Il team",
        p: "La redazione riunisce competenze in biochimica, medicina e comunicazione scientifica. Per preservare l'indipendenza manteniamo l'anonimato degli autori; ogni analisi è revisionata da almeno due persone prima della pubblicazione.",
      },
    ],
    cta: "Leggi il metodo completo →",
  },
  en: {
    eyebrow: "About",
    title: "Independent on principle.",
    subtitle:
      "Nucleo Longevity started from a simple idea: longevity deserves honest information, not marketing dressed up as science.",
    values: [
      {
        h: "Our mission",
        p: "Translate the scientific literature on longevity into clear, verifiable assessments. For each molecule we say what we actually know, how confidently, and where the studies fall short.",
      },
      {
        h: "How we work",
        p: "We start from human studies, prioritise RCTs, and grade the evidence with an adapted GRADE schema (A–F). Every analysis cites the source PMIDs so you can verify everything on PubMed.",
      },
      {
        h: "How we are funded",
        p: "Some links are affiliate links and may earn a commission, at no extra cost to you. Commissions never influence evidence grades: scientific judgement comes before business.",
      },
      {
        h: "The team",
        p: "Our editorial team combines backgrounds in biochemistry, medicine and science communication. To preserve independence we keep authors anonymous; each analysis is reviewed by at least two people before publication.",
      },
    ],
    cta: "Read the full method →",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const c = COPY[(lang as "it" | "en")] ?? COPY.it;
  return { title: c.eyebrow, description: c.subtitle };
}

export default async function ChiSiamoPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const c = COPY[lang];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <PageHeader eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />

      <div className="grid sm:grid-cols-2 gap-px bg-[var(--border)] border border-[var(--border)] rounded-lg overflow-hidden">
        {c.values.map((v) => (
          <div key={v.h} className="bg-[var(--bg-elev)] p-7 flex flex-col gap-2">
            <div className="flex items-center gap-2.5 mb-1">
              <NucleusMark size={16} className="text-[var(--accent)]" />
              <h2 className="font-sans font-medium text-base text-[var(--fg)]">{v.h}</h2>
            </div>
            <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">{v.p}</p>
          </div>
        ))}
      </div>

      <Link
        href={`/${lang}/method`}
        className="inline-flex items-center mt-10 font-mono text-sm text-[var(--accent)] link-underline"
      >
        {c.cta}
      </Link>
    </div>
  );
}
