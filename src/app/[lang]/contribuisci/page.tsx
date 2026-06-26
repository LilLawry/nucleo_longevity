import type { Metadata } from "next";
import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import NucleusMark from "@/components/NucleusMark";
import ContributeForm from "./ContributeForm";

export async function generateStaticParams() {
  return [{ lang: "it" }, { lang: "en" }];
}

const COPY = {
  it: {
    eyebrow: "Contribuisci",
    title: "Costruiamo la voce più affidabile sulla longevità.",
    subtitle:
      "Nucleo è una piattaforma che studia, condivide e connette. Cerchiamo esperti, professionisti e partner che mettano competenza vera dove di solito c'è solo hype.",
    cards: [
      { h: "Esperti & KOL", p: "Medici, ricercatori, divulgatori: proponi un'analisi o entra come revisore. La tua firma alza il valore (e il ranking) di ogni contenuto." },
      { h: "Professionisti", p: "Nutrizionisti, personal trainer, cliniche: entra nel network. Connettiamo domanda e competenza nel mondo longevity." },
      { h: "Brand & Partner", p: "Collaborazioni editoriali trasparenti, sempre con disclosure. Nessuna valutazione in vendita." },
    ],
    formTitle: "Candidati",
  },
  en: {
    eyebrow: "Contribute",
    title: "Let's build the most trusted voice in longevity.",
    subtitle:
      "Nucleo is a platform that studies, shares and connects. We're looking for experts, professionals and partners who bring real expertise where there's usually only hype.",
    cards: [
      { h: "Experts & KOLs", p: "Physicians, researchers, communicators: pitch an analysis or join as a reviewer. Your byline raises the value (and ranking) of every piece." },
      { h: "Professionals", p: "Nutritionists, trainers, clinics: join the network. We connect demand and expertise across longevity." },
      { h: "Brands & Partners", p: "Transparent editorial collaborations, always disclosed. No ratings for sale." },
    ],
    formTitle: "Apply",
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

export default async function ContribuisciPage({
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

      <div className="grid sm:grid-cols-3 gap-4 mb-14">
        {c.cards.map((card) => (
          <div key={card.h} className="card-surface p-6 flex flex-col gap-3">
            <NucleusMark size={20} className="text-[var(--accent)]" />
            <h2 className="font-sans font-medium text-base text-[var(--fg)]">{card.h}</h2>
            <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">{card.p}</p>
          </div>
        ))}
      </div>

      <h2 className="font-sans font-medium text-xs tracking-widest uppercase text-[var(--muted)] mb-6">
        {c.formTitle}
      </h2>
      <ContributeForm lang={lang} />
    </div>
  );
}
