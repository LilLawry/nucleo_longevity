import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang, langs } from "@/lib/i18n";
import ConnectForm from "../ConnectForm";

// Total founding cohort cap. Real, honest number — not a fake "already claimed"
// counter. Lower this as real founding partners are onboarded.
const FOUNDING_SLOTS = 50;

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const it = lang === "it";
  return {
    title: it ? "Founding Partners — Nucleo Connect" : "Founding Partners — Nucleo Connect",
    description: it
      ? "Programma Founding Partner: profilo vetrina gratuito ora nell'ecosistema longevity, con condizioni di favore quando la directory diventerà premium. Posti limitati."
      : "Founding Partner programme: a free showcase profile in the longevity ecosystem now, with preferential terms when the directory goes premium. Limited spots.",
    alternates: {
      canonical: `/${lang}/connect/founding`,
      languages: { it: "/it/connect/founding", en: "/en/connect/founding", "x-default": "/en/connect/founding" },
    },
  };
}

const COPY = {
  en: {
    eyebrow: "Nucleo Connect · Founding Partners",
    title: "Be one of the first in the directory.",
    subtitle:
      "We're building the curated directory and digital fair of the longevity ecosystem. Founding Partners get a free showcase profile now — and preferential terms for the long run when Connect introduces premium tiers.",
    benefitsT: "What Founding Partners get",
    benefits: [
      { h: "Free showcase now", p: "A curated public profile — company or professional — while the directory is free to join." },
      { h: "Preferential terms later", p: "When premium tiers launch, founding profiles keep long-term preferential conditions. Early in, better terms." },
      { h: "Editorial linking", p: "Your profile is linked to the relevant graded entries, evidence and analyses — real discovery, not a static listing." },
      { h: "Independence, kept", p: "Being a Founding Partner never buys, changes or influences an A–F grade. Presence is curated, verification is earned." },
    ],
    slotsLabel: "Founding spots in this cohort",
    howT: "How it works",
    how: [
      "Apply below or ask for an introduction — it takes a minute.",
      "We review manually. No accounts, no payment, no auto-publishing.",
      "If it fits, we prepare your profile and you approve it before it goes live.",
    ],
    disclosureT: "Honest terms",
    disclosure:
      "\"Founding Partner\" describes early participation and preferential terms — not a verification badge, and not an endorsement. Sponsored and verified stay separate. Nothing here affects editorial grades.",
    ctaT: "Apply as a Founding Partner",
    formNote: "Professional data only — no accounts, no payment, manual review before anything is published. No health data.",
  },
  it: {
    eyebrow: "Nucleo Connect · Founding Partners",
    title: "Sii tra i primi nella directory.",
    subtitle:
      "Stiamo costruendo la directory curata e la fiera digitale dell'ecosistema longevity. I Founding Partner ottengono un profilo vetrina gratuito ora — e condizioni di favore nel lungo periodo quando Connect introdurrà i piani premium.",
    benefitsT: "Cosa ottengono i Founding Partner",
    benefits: [
      { h: "Vetrina gratis ora", p: "Un profilo pubblico curato — azienda o professionista — finché l'ingresso nella directory è gratuito." },
      { h: "Condizioni di favore dopo", p: "Quando arriveranno i piani premium, i profili fondatori mantengono condizioni di favore nel tempo. Chi entra prima, condizioni migliori." },
      { h: "Collegamento editoriale", p: "Il tuo profilo è collegato alle voci graduate, all'evidenza e alle analisi pertinenti — scoperta reale, non un elenco statico." },
      { h: "Indipendenza, sempre", p: "Essere Founding Partner non compra, cambia o influenza un voto A–F. La presenza è curata, la verifica si guadagna." },
    ],
    slotsLabel: "Posti fondatori in questa coorte",
    howT: "Come funziona",
    how: [
      "Candidati qui sotto o chiedi un'introduzione — ci vuole un minuto.",
      "Revisioniamo manualmente. Nessun account, nessun pagamento, nessuna pubblicazione automatica.",
      "Se c'è affinità, prepariamo il tuo profilo e lo approvi tu prima che vada online.",
    ],
    disclosureT: "Condizioni oneste",
    disclosure:
      "\"Founding Partner\" descrive la partecipazione iniziale e condizioni di favore — non è un badge di verifica né un endorsement. Sponsorizzato e verificato restano separati. Nulla qui influenza i voti editoriali.",
    ctaT: "Candidati come Founding Partner",
    formNote: "Solo dati professionali — nessun account, nessun pagamento, revisione manuale prima di ogni pubblicazione. Nessun dato sanitario.",
  },
};

export default async function FoundingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const it = lang === "it";
  const c = COPY[lang];

  const fields = [
    { key: "organisation", label: it ? "Organizzazione" : "Organisation", required: true },
    { key: "role", label: it ? "Ruolo" : "Role" },
    { key: "website", label: it ? "Sito web" : "Website" },
    { key: "country", label: it ? "Paese" : "Country", required: true },
    { key: "category", label: it ? "Categoria (produttore, laboratorio, clinica, distributore…)" : "Category (manufacturer, lab, clinic, distributor…)", required: true },
    { key: "reason", label: it ? "Descrizione e perché vuoi entrare come founding partner" : "Description and why you want to join as a founding partner", type: "textarea" as const, required: true },
  ];

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <nav className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] mb-8">
        <Link href={`/${lang}/connect`} className="link-underline">Connect</Link>
        <span className="mx-2 text-[var(--border)]">/</span><span className="text-[var(--fg)]">Founding Partners</span>
      </nav>

      <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)] mb-4">{c.eyebrow}</p>
      <h1 className="font-serif font-medium text-4xl sm:text-5xl tracking-[-0.02em] text-[var(--fg)] mb-5 text-balance">{c.title}</h1>
      <p className="font-sans text-lg text-[var(--muted)] leading-relaxed mb-8 text-pretty">{c.subtitle}</p>

      {/* Founding slots — honest cap, no fake "claimed" count */}
      <div className="flex items-center gap-4 border-y border-[var(--border)] py-5 mb-12">
        <span className="font-serif text-5xl text-[var(--accent)] tabular leading-none">{FOUNDING_SLOTS}</span>
        <span className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] leading-relaxed">{c.slotsLabel}</span>
      </div>

      <section className="mb-12">
        <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)] mb-5">{c.benefitsT}</h2>
        <div className="grid sm:grid-cols-2 border-t border-l border-[var(--border)]">
          {c.benefits.map((b) => (
            <div key={b.h} className="border-b border-r border-[var(--border)] p-5">
              <h3 className="font-sans font-medium text-base text-[var(--fg)] mb-1.5">{b.h}</h3>
              <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">{b.p}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)] mb-5">{c.howT}</h2>
        <ol className="border-t border-[var(--border)]">
          {c.how.map((h, i) => (
            <li key={i} className="grid grid-cols-[2.5rem_1fr] gap-4 py-4 border-b border-[var(--border)]">
              <span className="font-mono text-[0.7rem] text-[var(--muted)] tabular pt-0.5">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-sans text-sm text-[var(--fg)] leading-relaxed">{h}</span>
            </li>
          ))}
        </ol>
      </section>

      <div className="border-l-2 border-[var(--accent)] pl-5 mb-14">
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-2">{c.disclosureT}</p>
        <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">{c.disclosure}</p>
      </div>

      <section>
        <h2 className="font-serif font-medium text-2xl text-[var(--fg)] mb-2">{c.ctaT}</h2>
        <p className="font-mono text-[0.62rem] text-[var(--muted)] leading-relaxed mb-8">{c.formNote}</p>
        <ConnectForm lang={lang} variant="brand" fields={fields} />
      </section>
    </div>
  );
}
