import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang, langs } from "@/lib/i18n";
import { getCompanies, getCompanyCountries, getCompanyTypes, orgTypeLabel, verificationLabel, NKF_CONNECT_DEMO } from "@/lib/connect";
import DirectoryClient, { type DirRow } from "./DirectoryClient";

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const it = lang === "it";
  const title = it ? "Directory — Nucleo Connect" : "Directory — Nucleo Connect";
  const description = it
    ? "Directory curata dell'ecosistema longevity: produttori, laboratori, fornitori di ingredienti, distributori e servizi che operano nel settore."
    : "Curated directory of the longevity ecosystem: manufacturers, labs, ingredient suppliers, distributors and services.";
  return {
    title, description,
    alternates: { canonical: `/${lang}/connect/directory`, languages: { it: "/it/connect/directory", en: "/en/connect/directory", "x-default": "/en/connect/directory" } },
  };
}

export default async function DirectoryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const it = lang === "it";

  const rows: DirRow[] = getCompanies().map((c) => ({
    slug: c.slug, name: c.name, country: c.country,
    types: c.organisationType, typeLabels: c.organisationType.map((t) => orgTypeLabel(t, lang)),
    categories: c.categories, verification: c.verificationStatus, verificationLabel: verificationLabel(c.verificationStatus, lang),
    commercial: c.commercialStatus, demo: c.demo,
  }));

  const L = {
    search: it ? "Cerca" : "Search", type: it ? "Tipo" : "Type", country: it ? "Paese" : "Country",
    all: it ? "Tutti" : "All", sponsored: "Sponsored", results: it ? "risultati" : "results",
    empty: it ? "Nessun risultato." : "No results.", view: it ? "Apri profilo" : "Open profile",
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <nav className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] mb-8">
        <Link href={`/${lang}/connect`} className="link-underline">Connect</Link>
        <span className="mx-2 text-[var(--border)]">/</span><span className="text-[var(--fg)]">Directory</span>
      </nav>
      <div className="flex items-baseline gap-3 mb-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)]">Nucleo Connect</p>
        {NKF_CONNECT_DEMO && <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[#B5975D] border border-[#B5975D] px-2 py-0.5">demo</span>}
      </div>
      <h1 className="font-serif font-medium text-4xl sm:text-5xl tracking-[-0.02em] text-[var(--fg)] mb-5 text-balance">
        {it ? "Directory dell'ecosistema longevity" : "Longevity ecosystem directory"}
      </h1>
      <p className="font-sans text-lg text-[var(--muted)] leading-relaxed max-w-2xl mb-4 text-pretty">
        {it
          ? "Produttori, laboratori, fornitori di ingredienti, distributori e servizi. Profili curati, non transazionali."
          : "Manufacturers, labs, ingredient suppliers, distributors and services. Curated, non-transactional profiles."}
      </p>
      <p className="font-mono text-[0.62rem] text-[var(--muted)] leading-relaxed max-w-2xl mb-10">
        {it
          ? "Dati dimostrativi: aziende fittizie a scopo illustrativo. \"Sponsored\" e \"verified\" sono concetti separati — un profilo a pagamento non è verificato."
          : "Demo data: fictional companies for illustration. \"Sponsored\" and \"verified\" are separate — a paid profile is not verified."}
      </p>

      <DirectoryClient
        rows={rows} lang={lang} L={L}
        typeOptions={getCompanyTypes().map((t) => [t, orgTypeLabel(t, lang)] as [string, string])}
        countryOptions={getCompanyCountries()}
      />

      <div className="mt-12 border-t border-[var(--border)] pt-6">
        <Link href={`/${lang}/connect/join`} className="btn-accent font-sans font-medium text-sm px-6 py-3">
          {it ? "Candidati alla directory →" : "Apply to the directory →"}
        </Link>
      </div>
    </div>
  );
}
