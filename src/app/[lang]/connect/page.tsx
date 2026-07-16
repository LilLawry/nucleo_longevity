import type { Metadata } from "next";
import Link from "next/link";
import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "it" }];
}

const COPY = {
  en: {
    eyebrow: "Connect",
    title: "Where evidence meets the market.",
    subtitle:
      "Nucleo Connect is our advisory service that links manufacturers of evidence-based molecules with vetted distribution and sales partners across markets.",
    how: [
      { h: "We study", p: "We already read the literature daily for the observatory. We know which molecules hold up and which are pure marketing." },
      { h: "We connect", p: "We introduce manufacturers to distributors and sales reps in the right territories — and vice versa." },
      { h: "Transparent fees", p: "Advisory and introduction fees are agreed upfront. No hidden margins, no pay-to-play." },
    ],
    brands: "I'm a brand / manufacturer →",
    reps: "I'm a sales rep / agent →",
    disclosureT: "Independence",
    disclosure: "Editorial grades are independent from the Connect service. Participation in Connect never buys, changes or influences a molecule's A–F grade.",
  },
  it: {
    eyebrow: "Connect",
    title: "Dove l'evidenza incontra il mercato.",
    subtitle:
      "Nucleo Connect è il nostro servizio di advisory che collega i produttori di molecole evidence-based con partner di distribuzione e vendita selezionati nei vari mercati.",
    how: [
      { h: "Studiamo", p: "Leggiamo già la letteratura ogni giorno per l'osservatorio. Sappiamo quali molecole reggono e quali sono solo marketing." },
      { h: "Connettiamo", p: "Presentiamo i produttori a distributori e agenti nei territori giusti — e viceversa." },
      { h: "Fee trasparenti", p: "Le fee di advisory e introduzione sono concordate in anticipo. Nessun margine nascosto, nessun pay-to-play." },
    ],
    brands: "Sono un brand / produttore →",
    reps: "Sono un agente / commerciale →",
    disclosureT: "Indipendenza",
    disclosure: "I gradi editoriali sono indipendenti dal servizio Connect. Partecipare a Connect non compra, cambia o influenza il grado A–F di una molecola.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const c = COPY[(lang as "en" | "it")] ?? COPY.en;
  return {
    title: c.eyebrow,
    description: c.subtitle,
    alternates: { canonical: `/${lang}/connect`, languages: { en: "/en/connect", it: "/it/connect", "x-default": "/en/connect" } },
  };
}

export default async function ConnectPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const c = COPY[lang];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <PageHeader eyebrow={c.eyebrow} title={c.title} subtitle={c.subtitle} />

      <div className="grid sm:grid-cols-3 border-y border-[var(--border)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)] mb-12">
        {c.how.map((b, i) => (
          <div key={b.h} className="p-6">
            <span className="font-mono text-[0.6rem] text-[var(--muted)] tabular">{String(i + 1).padStart(2, "0")}</span>
            <h2 className="font-sans font-medium text-base text-[var(--fg)] mt-2 mb-1.5">{b.h}</h2>
            <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">{b.p}</p>
          </div>
        ))}
      </div>

      {/* Directory + digital fair */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Link href={`/${lang}/connect/directory`} className="flex-1 border border-[var(--border)] hover:border-[var(--accent)] transition-colors p-6">
          <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] mb-1">{lang === "en" ? "Directory & digital fair" : "Directory & fiera digitale"}</p>
          <p className="font-sans font-medium text-lg text-[var(--fg)]">
            {lang === "en" ? "Browse the longevity ecosystem →" : "Esplora l'ecosistema longevity →"}
          </p>
          <p className="font-sans text-sm text-[var(--muted)] mt-1">
            {lang === "en" ? "Manufacturers, labs, ingredient suppliers, distributors, services." : "Produttori, laboratori, fornitori di ingredienti, distributori, servizi."}
          </p>
        </Link>
        <Link href={`/${lang}/connect/join`} className="flex-1 border border-[var(--border)] hover:border-[var(--accent)] transition-colors p-6">
          <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] mb-1">{lang === "en" ? "Join" : "Candidati"}</p>
          <p className="font-sans font-medium text-lg text-[var(--fg)]">
            {lang === "en" ? "Add your company or profile →" : "Aggiungi la tua azienda o profilo →"}
          </p>
          <p className="font-sans text-sm text-[var(--muted)] mt-1">
            {lang === "en" ? "Curated, mediated contact. No accounts, no payments." : "Contatto curato e mediato. Nessun account, nessun pagamento."}
          </p>
        </Link>
      </div>

      {/* Digital fair surfaces */}
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <Link href={`/${lang}/connect/expo`} className="border border-[var(--border)] hover:border-[var(--accent)] transition-colors p-5">
          <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] mb-1">{lang === "en" ? "Digital fair" : "Fiera digitale"}</p>
          <p className="font-sans font-medium text-[var(--fg)]">{lang === "en" ? "Themed showcases →" : "Showcase tematici →"}</p>
        </Link>
        <Link href={`/${lang}/connect/professionals`} className="border border-[var(--border)] hover:border-[var(--accent)] transition-colors p-5">
          <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] mb-1">{lang === "en" ? "Professionals" : "Professionisti"}</p>
          <p className="font-sans font-medium text-[var(--fg)]">{lang === "en" ? "Formulators, consultants, agents →" : "Formulatori, consulenti, agenti →"}</p>
        </Link>
        <Link href={`/${lang}/connect/opportunities`} className="border border-[var(--border)] hover:border-[var(--accent)] transition-colors p-5">
          <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] mb-1">{lang === "en" ? "Opportunities" : "Opportunità"}</p>
          <p className="font-sans font-medium text-[var(--fg)]">{lang === "en" ? "Who's seeking and offering →" : "Chi cerca e chi offre →"}</p>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-14">
        <Link href={`/${lang}/connect/brands`} className="flex-1 border border-[var(--border)] hover:border-[var(--accent)] transition-colors p-6">
          <p className="font-sans font-medium text-lg text-[var(--fg)]">{c.brands}</p>
        </Link>
        <Link href={`/${lang}/connect/reps`} className="flex-1 border border-[var(--border)] hover:border-[var(--accent)] transition-colors p-6">
          <p className="font-sans font-medium text-lg text-[var(--fg)]">{c.reps}</p>
        </Link>
      </div>

      <div className="border-l-2 border-[var(--accent)] pl-5 max-w-2xl">
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-2">{c.disclosureT}</p>
        <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">{c.disclosure}</p>
      </div>
    </div>
  );
}
