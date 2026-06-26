import type { Metadata } from "next";
import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";

export async function generateStaticParams() {
  return [{ lang: "it" }, { lang: "en" }];
}

const COPY = {
  it: {
    eyebrow: "Termini d'uso",
    title: "Le regole, in breve.",
    subtitle: "Utilizzando nucleolongevity.com accetti i termini riportati qui sotto.",
    sections: [
      ["1. Uso del sito", "Puoi consultare e condividere i contenuti per uso personale e non commerciale. È vietato riprodurli su larga scala o ripubblicarli senza attribuzione e consenso scritto."],
      ["2. Proprietà intellettuale", "Testi, grafica, logo e marchio Nucleo Longevity sono protetti. I dati scientifici citati appartengono alle rispettive fonti, indicate tramite PMID."],
      ["3. Natura dei contenuti", "I contenuti hanno finalità informative. Consulta il Disclaimer medico: nessuna informazione su questo sito sostituisce il parere di un professionista sanitario."],
      ["4. Link di affiliazione e terzi", "Il sito può contenere link di affiliazione e collegamenti a siti terzi. Non siamo responsabili dei contenuti o delle politiche dei siti esterni."],
      ["5. Limitazione di responsabilità", "Nei limiti previsti dalla legge, Nucleo Longevity non è responsabile per danni derivanti dall'uso o dall'impossibilità di usare il sito o i suoi contenuti."],
      ["6. Modifiche", "Possiamo aggiornare questi termini in qualsiasi momento. L'uso continuato del sito dopo le modifiche ne costituisce accettazione."],
      ["7. Legge applicabile", "I presenti termini sono regolati dalla legge italiana, fatti salvi i diritti inderogabili dei consumatori."],
    ],
    revised: "Ultima revisione: 2026-01-01",
  },
  en: {
    eyebrow: "Terms of use",
    title: "The rules, in short.",
    subtitle: "By using nucleolongevity.com you accept the terms below.",
    sections: [
      ["1. Use of the site", "You may read and share content for personal, non-commercial use. Large-scale reproduction or republishing without attribution and written consent is prohibited."],
      ["2. Intellectual property", "Nucleo Longevity's text, graphics, logo and trademark are protected. Cited scientific data belongs to the respective sources, referenced via PMID."],
      ["3. Nature of content", "Content is informational. See the Medical Disclaimer: no information on this site replaces the advice of a healthcare professional."],
      ["4. Affiliate and third-party links", "The site may contain affiliate links and links to third-party sites. We are not responsible for the content or policies of external sites."],
      ["5. Limitation of liability", "To the extent permitted by law, Nucleo Longevity is not liable for damages arising from the use of, or inability to use, the site or its content."],
      ["6. Changes", "We may update these terms at any time. Continued use of the site after changes constitutes acceptance."],
      ["7. Governing law", "These terms are governed by Italian law, without prejudice to mandatory consumer rights."],
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

export default async function TerminiPage({
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

      <div className="flex flex-col divide-y divide-[var(--border)]">
        {c.sections.map(([h, p]) => (
          <div key={h} className="py-6 first:pt-0">
            <h2 className="font-sans font-medium text-base text-[var(--fg)] mb-1.5">{h}</h2>
            <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">{p}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 font-mono text-xs text-[var(--muted)] border-t border-[var(--border)] pt-6">
        {c.revised}
      </p>
    </div>
  );
}
