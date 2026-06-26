import type { Metadata } from "next";
import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";

export async function generateStaticParams() {
  return [{ lang: "it" }, { lang: "en" }];
}

const COPY = {
  it: {
    eyebrow: "Contatti",
    title: "Parliamone.",
    subtitle:
      "Domande sulle nostre analisi, segnalazioni di studi, proposte editoriali o richieste sulla privacy: scrivici al canale giusto.",
    cards: [
      { h: "Redazione", d: "Segnalazioni di studi, correzioni, proposte di analisi.", e: "redazione@nucleolongevity.com" },
      { h: "Stampa & partnership", d: "Collaborazioni, citazioni, richieste media.", e: "press@nucleolongevity.com" },
      { h: "Privacy & dati", d: "Accesso, rettifica o cancellazione dei tuoi dati.", e: "privacy@nucleolongevity.com" },
    ],
    note: "Rispondiamo di norma entro 3 giorni lavorativi. Nucleo Longevity non fornisce consulenza medica individuale.",
    write: "Scrivi",
  },
  en: {
    eyebrow: "Contact",
    title: "Let's talk.",
    subtitle:
      "Questions about our analyses, study tips, editorial proposals or privacy requests: reach the right channel below.",
    cards: [
      { h: "Editorial", d: "Study tips, corrections, analysis proposals.", e: "redazione@nucleolongevity.com" },
      { h: "Press & partnerships", d: "Collaborations, citations, media requests.", e: "press@nucleolongevity.com" },
      { h: "Privacy & data", d: "Access, rectify or delete your data.", e: "privacy@nucleolongevity.com" },
    ],
    note: "We usually reply within 3 business days. Nucleo Longevity does not provide individual medical advice.",
    write: "Email",
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

export default async function ContattiPage({
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

      <div className="grid sm:grid-cols-3 gap-4">
        {c.cards.map((card) => (
          <div key={card.h} className="card-surface p-6 flex flex-col gap-3">
            <h2 className="font-sans font-medium text-base text-[var(--fg)]">{card.h}</h2>
            <p className="font-sans text-sm text-[var(--muted)] leading-relaxed flex-1">{card.d}</p>
            <a
              href={`mailto:${card.e}`}
              className="font-mono text-xs text-[var(--accent)] link-underline w-fit"
            >
              {c.write} →
            </a>
          </div>
        ))}
      </div>

      <p className="mt-10 max-w-2xl font-mono text-[0.7rem] text-[var(--muted)] leading-relaxed border-t border-[var(--border)] pt-6">
        {c.note}
      </p>
    </div>
  );
}
