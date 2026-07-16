import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang, langs } from "@/lib/i18n";
import { getShowcases, getCompanyBySlug, ORG_TYPE_LABEL, NKF_CONNECT_DEMO } from "@/lib/connect";

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const it = lang === "it";
  return {
    title: it ? "Fiera digitale — Nucleo Connect" : "Digital fair — Nucleo Connect",
    description: it
      ? "Showcase tematici curati dell'ecosistema longevity: fotoprotezione, riparazione della barriera, distribuzione. Dentro e fuori."
      : "Curated themed showcases of the longevity ecosystem: photoprotection, barrier repair, distribution. Inside and out.",
    alternates: { canonical: `/${lang}/connect/expo`, languages: { it: "/it/connect/expo", en: "/en/connect/expo", "x-default": "/en/connect/expo" } },
  };
}

export default async function ExpoPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const it = lang === "it";
  const showcases = getShowcases();

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <nav className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] mb-8">
        <Link href={`/${lang}/connect`} className="link-underline">Connect</Link>
        <span className="mx-2 text-[var(--border)]">/</span><span className="text-[var(--fg)]">{it ? "Fiera digitale" : "Digital fair"}</span>
      </nav>
      <div className="flex items-baseline gap-3 mb-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)]">Nucleo Connect</p>
        {NKF_CONNECT_DEMO && <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[#B5975D] border border-[#B5975D] px-2 py-0.5">demo</span>}
      </div>
      <h1 className="font-serif font-medium text-4xl sm:text-5xl tracking-[-0.02em] text-[var(--fg)] mb-5 text-balance">
        {it ? "Fiera digitale" : "Digital fair"}
      </h1>
      <p className="font-sans text-lg text-[var(--muted)] leading-relaxed max-w-2xl mb-4 text-pretty">
        {it
          ? "Showcase tematici curati: raccogliamo le realtà dell'ecosistema per tema, dentro e fuori. Nessun padiglione a pagamento che scavalca la curatela."
          : "Curated themed showcases: we group the ecosystem by theme, inside and out. No paid pavilion overrides the curation."}
      </p>
      <p className="font-mono text-[0.62rem] text-[var(--muted)] leading-relaxed max-w-2xl mb-12">
        {it ? "Dati dimostrativi: aziende fittizie a scopo illustrativo." : "Demo data: fictional companies for illustration."}
      </p>

      <div className="flex flex-col gap-12">
        {showcases.map((s) => {
          const companies = s.companySlugs.map((cs) => getCompanyBySlug(cs)).filter(Boolean);
          return (
            <section key={s.slug}>
              <div className="flex items-baseline gap-3 mb-1">
                <h2 className="font-serif font-medium text-2xl text-[var(--fg)]">{s.title}</h2>
                <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)]">{s.theme}</span>
              </div>
              <p className="font-sans text-sm text-[var(--muted)] leading-relaxed max-w-2xl mb-4">{s.blurb}</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {companies.map((c) => (
                  <Link key={c!.slug} href={`/${lang}/connect/companies/${c!.slug}`}
                    className="group card-surface p-4 flex flex-col gap-1.5 hover:border-[var(--accent)] transition-colors">
                    <span className="font-sans font-medium text-sm text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">{c!.name}</span>
                    <span className="font-mono text-[0.58rem] uppercase tracking-wide text-[var(--muted)]">{c!.organisationType.map((t) => ORG_TYPE_LABEL[t]).join(" · ")}</span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <div className="mt-14 flex flex-col sm:flex-row gap-4 border-t border-[var(--border)] pt-8">
        <Link href={`/${lang}/connect/directory`} className="flex-1 border border-[var(--border)] hover:border-[var(--accent)] transition-colors p-5">
          <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] mb-1">Directory</p>
          <p className="font-sans font-medium text-[var(--fg)]">{it ? "Sfoglia tutte le realtà →" : "Browse the full directory →"}</p>
        </Link>
        <Link href={`/${lang}/connect/opportunities`} className="flex-1 border border-[var(--border)] hover:border-[var(--accent)] transition-colors p-5">
          <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] mb-1">{it ? "Opportunità" : "Opportunities"}</p>
          <p className="font-sans font-medium text-[var(--fg)]">{it ? "Chi cerca e chi offre →" : "Who's seeking and offering →"}</p>
        </Link>
      </div>
    </div>
  );
}
