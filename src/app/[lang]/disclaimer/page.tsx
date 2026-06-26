import type { Metadata } from "next";
import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";

export async function generateStaticParams() {
  return [{ lang: "it" }, { lang: "en" }];
}

const COPY = {
  it: {
    eyebrow: "Disclaimer medico",
    title: "Informazione, non prescrizione.",
    subtitle:
      "Nucleo Longevity ha finalità esclusivamente informative ed educative. Non sostituisce il parere di un medico.",
    body: [
      ["Nessun rapporto medico-paziente", "I contenuti di questo sito non costituiscono consulenza medica, diagnosi o trattamento. La lettura di queste pagine non instaura alcun rapporto medico-paziente."],
      ["Consulta un professionista", "Prima di iniziare, interrompere o modificare l'assunzione di qualsiasi integratore, farmaco o protocollo, consulta un medico qualificato, soprattutto in caso di patologie, gravidanza, allattamento o terapie in corso."],
      ["Gradi di evidenza", "I gradi A–F descrivono la solidità della letteratura scientifica disponibile, non una raccomandazione all'uso. Un grado alto non significa \"sicuro per te\"; un grado basso non significa necessariamente inefficace."],
      ["Nessuna garanzia", "Ci impegniamo per l'accuratezza, ma la scienza evolve e possono esserci errori od omissioni. I contenuti sono forniti \"così come sono\", senza garanzie di completezza o aggiornamento."],
      ["Emergenze", "In caso di emergenza medica contatta i servizi di emergenza locali. Non utilizzare questo sito per gestire situazioni urgenti."],
    ],
    revised: "Ultima revisione: 2026-01-01",
  },
  en: {
    eyebrow: "Medical disclaimer",
    title: "Information, not prescription.",
    subtitle:
      "Nucleo Longevity is for informational and educational purposes only. It is not a substitute for professional medical advice.",
    body: [
      ["No doctor-patient relationship", "The content on this site does not constitute medical advice, diagnosis or treatment. Reading these pages does not create any doctor-patient relationship."],
      ["Consult a professional", "Before starting, stopping or changing any supplement, medication or protocol, consult a qualified physician — especially if you have medical conditions, are pregnant or breastfeeding, or are on ongoing therapy."],
      ["Evidence grades", "The A–F grades describe the strength of the available scientific literature, not a recommendation to use. A high grade does not mean \"safe for you\"; a low grade does not necessarily mean ineffective."],
      ["No warranty", "We strive for accuracy, but science evolves and errors or omissions may occur. Content is provided \"as is\", without warranty of completeness or currency."],
      ["Emergencies", "In a medical emergency, contact your local emergency services. Do not use this site to manage urgent situations."],
    ],
    revised: "Last revised: 2026-01-01",
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

export default async function DisclaimerPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const c = COPY[lang];

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <PageHeader eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />

      <div className="flex flex-col gap-8">
        {c.body.map(([h, p]) => (
          <div key={h} className="border-l-2 border-[var(--accent)] pl-5">
            <h2 className="font-sans font-medium text-base text-[var(--fg)] mb-1.5">{h}</h2>
            <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">{p}</p>
          </div>
        ))}
      </div>

      <p className="mt-12 font-mono text-xs text-[var(--muted)] border-t border-[var(--border)] pt-6">
        {c.revised}
      </p>
    </div>
  );
}
