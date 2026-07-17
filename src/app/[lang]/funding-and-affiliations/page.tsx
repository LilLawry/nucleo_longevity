import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang } from "@/lib/i18n";
import PageHeader from "@/components/PageHeader";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "it" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const it = lang === "it";
  return {
    title: it ? "Finanziamento e affiliazioni" : "Funding & affiliations",
    description: it
      ? "Come Núkleo guadagna e perché resta indipendente: affiliazioni, profili sponsorizzati, contenuti sponsorizzati, conflitti e correzioni. La commissione non influenza mai un voto."
      : "How Núkleo earns and why it stays independent: affiliations, sponsored profiles, sponsored content, conflicts and corrections. Commission never influences a grade.",
    alternates: {
      canonical: `/${lang}/funding-and-affiliations`,
      languages: { en: "/en/funding-and-affiliations", it: "/it/funding-and-affiliations", "x-default": "/en/funding-and-affiliations" },
    },
  };
}

const COPY = {
  en: {
    eyebrow: "Independence",
    title: "Funding & affiliations",
    subtitle:
      "How we earn, and the wall that keeps it away from the science. Commission and sponsorship never buy, change, or influence a molecule's A–F grade.",
    sections: [
      { h: "The wall", ps: [
        "Editorial (the A–F grades, the evidence, the safety notes) is produced independently from any commercial layer.",
        "No advertiser, affiliate, or Connect participant sees a grade before publication or can request a change to one.",
      ] },
      { h: "Affiliate links (Finder)", ps: [
        "The Finder may earn a commission when you buy through an outbound link. This is disclosed on the Finder and on /confronto.",
        "Ranking is by relevance and price — never by commission. A cheaper, non-affiliate offer is never hidden or demoted.",
      ] },
      { h: "Sponsored profiles (Connect)", ps: [
        "A company or professional may pay for a sponsored profile. Sponsored profiles are always labelled \"Sponsored profile\".",
        "\"Sponsored\" and \"verified\" are separate concepts. Paying never produces a \"verified\" badge and never hides competitors.",
      ] },
      { h: "Sponsored content", ps: [
        "If any editorial-format content is ever sponsored, it will be clearly labelled as such and separated from independent analysis.",
        "Sponsorship never removes a limitation, a risk, or a safety note from an entry.",
      ] },
      { h: "Conflicts of interest", ps: [
        "Known conflicts in cited studies are noted on the entry. Our own commercial relationships are disclosed here.",
        "Where a conflict cannot be resolved transparently, we do not publish the claim.",
      ] },
      { h: "Corrections", ps: [
        "We correct errors openly. Material changes to a public grade carry a visible \"updated\" date and a changelog entry.",
      ] },
    ],
    demoNote:
      "Núkleo currently shows demo data in Connect and the Finder while real, authorised feeds and verified partners are onboarded. Demo data is always labelled.",
    legal: "LEGAL REVIEW REQUIRED — this disclosure is a plain-language summary, not legal advice, and is pending review by qualified counsel before any commercial launch.",
  },
  it: {
    eyebrow: "Indipendenza",
    title: "Finanziamento e affiliazioni",
    subtitle:
      "Come guadagniamo e il muro che tiene tutto questo lontano dalla scienza. Commissioni e sponsorizzazioni non comprano, cambiano o influenzano mai il voto A–F di una molecola.",
    sections: [
      { h: "Il muro", ps: [
        "La parte editoriale (i voti A–F, le evidenze, le note di sicurezza) è prodotta in modo indipendente da qualsiasi livello commerciale.",
        "Nessun inserzionista, affiliato o partecipante a Connect vede un voto prima della pubblicazione né può chiederne la modifica.",
      ] },
      { h: "Link affiliati (Finder)", ps: [
        "Il Finder può guadagnare una commissione quando acquisti tramite un link in uscita. Questo è dichiarato nel Finder e su /confronto.",
        "Il ranking è per pertinenza e prezzo — mai per commissione. Un'offerta più economica e non affiliata non viene mai nascosta o penalizzata.",
      ] },
      { h: "Profili sponsorizzati (Connect)", ps: [
        "Un'azienda o un professionista può pagare per un profilo sponsorizzato. I profili sponsorizzati sono sempre marcati \"Sponsored profile\".",
        "\"Sponsored\" e \"verified\" sono concetti separati. Pagare non produce mai un badge \"verified\" e non nasconde i competitor.",
      ] },
      { h: "Contenuti sponsorizzati", ps: [
        "Se un contenuto in formato editoriale fosse mai sponsorizzato, sarà chiaramente marcato come tale e separato dall'analisi indipendente.",
        "La sponsorizzazione non rimuove mai un limite, un rischio o una nota di sicurezza da una voce.",
      ] },
      { h: "Conflitti di interesse", ps: [
        "I conflitti noti negli studi citati sono segnalati nella voce. Le nostre relazioni commerciali sono dichiarate qui.",
        "Quando un conflitto non può essere risolto in modo trasparente, non pubblichiamo il claim.",
      ] },
      { h: "Correzioni", ps: [
        "Correggiamo gli errori apertamente. Le modifiche sostanziali a un voto pubblico portano una data di aggiornamento visibile e una voce nel changelog.",
      ] },
    ],
    demoNote:
      "Attualmente Núkleo mostra dati demo in Connect e nel Finder mentre vengono attivati feed autorizzati e partner verificati reali. I dati demo sono sempre marcati.",
    legal: "LEGAL REVIEW REQUIRED — questa disclosure è una sintesi in linguaggio semplice, non un parere legale, ed è in attesa di revisione da parte di un legale qualificato prima di qualsiasi lancio commerciale.",
  },
};

export default async function FundingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const c = COPY[lang];

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <PageHeader eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />

      <div className="flex flex-col gap-10 mt-4">
        {c.sections.map((s, i) => (
          <section key={s.h}>
            <h2 className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)] mb-3">
              {String(i + 1).padStart(2, "0")} · {s.h}
            </h2>
            <div className="flex flex-col gap-3 border-l border-[var(--border)] pl-5">
              {s.ps.map((p, j) => (
                <p key={j} className="font-sans text-[0.95rem] text-[var(--muted)] leading-relaxed">{p}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-12 border border-[var(--border)] p-5">
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[#B5975D] mb-2">Demo</p>
        <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">{c.demoNote}</p>
      </div>

      <p className="mt-8 font-mono text-[0.6rem] text-[var(--muted)] leading-relaxed">{c.legal}</p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href={`/${lang}/method`} className="font-sans font-medium text-sm px-6 py-3 border border-[var(--border)] hover:border-[var(--accent)] transition-colors text-[var(--fg)]">
          {lang === "it" ? "Metodo di valutazione →" : "Grading method →"}
        </Link>
        <Link href={`/${lang}/confronto`} className="font-sans font-medium text-sm px-6 py-3 border border-[var(--border)] hover:border-[var(--accent)] transition-colors text-[var(--fg)]">
          {lang === "it" ? "Trasparenza del Finder →" : "Finder transparency →"}
        </Link>
      </div>
    </div>
  );
}
