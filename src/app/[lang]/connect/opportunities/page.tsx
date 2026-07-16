import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang, langs } from "@/lib/i18n";
import { getOpportunities, NKF_CONNECT_DEMO } from "@/lib/connect";

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const it = lang === "it";
  return {
    title: it ? "Opportunità — Nucleo Connect" : "Opportunities — Nucleo Connect",
    description: it
      ? "Brief curati dell'ecosistema longevity: chi cerca e chi offre. Solo introduzioni mediate — mai transazioni dirette."
      : "Curated longevity-ecosystem briefs: who's seeking and who's offering. Mediated introductions only — never direct transactions.",
    robots: { index: false, follow: true },
    alternates: { canonical: `/${lang}/connect/opportunities`, languages: { it: "/it/connect/opportunities", en: "/en/connect/opportunities", "x-default": "/en/connect/opportunities" } },
  };
}

export default async function OpportunitiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const it = lang === "it";
  const opps = getOpportunities();
  const kindLabel = (k: string) => (it ? (k === "seeking" ? "Cerca" : "Offre") : (k === "seeking" ? "Seeking" : "Offering"));

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <nav className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] mb-8">
        <Link href={`/${lang}/connect`} className="link-underline">Connect</Link>
        <span className="mx-2 text-[var(--border)]">/</span><span className="text-[var(--fg)]">Opportunities</span>
      </nav>
      <div className="flex items-baseline gap-3 mb-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)]">Nucleo Connect</p>
        {NKF_CONNECT_DEMO && <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[#B5975D] border border-[#B5975D] px-2 py-0.5">demo</span>}
      </div>
      <h1 className="font-serif font-medium text-4xl sm:text-5xl tracking-[-0.02em] text-[var(--fg)] mb-5 text-balance">
        {it ? "Opportunità e brief" : "Opportunities & briefs"}
      </h1>
      <p className="font-sans text-lg text-[var(--muted)] leading-relaxed max-w-2xl mb-4 text-pretty">
        {it
          ? "Chi cerca e chi offre nell'ecosistema longevity. Ogni brief è curato; ogni contatto è mediato. Núkleo non gestisce mai la transazione tra le parti."
          : "Who's seeking and who's offering across the longevity ecosystem. Every brief is curated; every contact is mediated. Núkleo never handles the transaction between parties."}
      </p>
      <p className="font-mono text-[0.62rem] text-[var(--muted)] leading-relaxed max-w-2xl mb-10">
        {it ? "Dati dimostrativi: brief fittizi a scopo illustrativo." : "Demo data: fictional briefs for illustration."}
      </p>

      <div className="border-t border-[var(--border)]">
        {opps.map((o) => (
          <div key={o.slug} className="py-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-mono text-[0.55rem] uppercase tracking-widest px-2 py-0.5 border ${o.kind === "seeking" ? "border-[var(--accent)] text-[var(--accent)]" : "border-[#B5975D] text-[#B5975D]"}`}>{kindLabel(o.kind)}</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)]">{o.country}</span>
              {o.postedAt && <span className="font-mono text-[0.6rem] text-[var(--muted)] tabular ml-auto">{o.postedAt}</span>}
            </div>
            <h2 className="font-sans font-medium text-lg text-[var(--fg)] mb-1.5">{o.title}</h2>
            <p className="font-sans text-sm text-[var(--muted)] leading-relaxed mb-3">{o.summary}</p>
            {o.categories.length > 0 && (
              <p className="font-mono text-[0.6rem] text-[var(--muted)] mb-3">{o.categories.join(" · ")}</p>
            )}
            <Link href={`/${lang}/connect/join`} className="font-sans text-sm text-[var(--accent)] link-underline">
              {it ? "Richiedi un'introduzione →" : "Request an introduction →"}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-12 border-l-2 border-[var(--accent)] pl-5 max-w-2xl">
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-2">{it ? "Come funziona" : "How it works"}</p>
        <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">
          {it
            ? "Pubblichiamo solo brief revisionati manualmente. Nessun account, nessun pagamento, nessuna transazione tra le parti. Le introduzioni avvengono via modulo mediato."
            : "We publish only manually-reviewed briefs. No accounts, no payments, no transaction between parties. Introductions happen through a mediated form."}
        </p>
      </div>
    </div>
  );
}
