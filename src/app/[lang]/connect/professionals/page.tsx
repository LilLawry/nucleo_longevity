import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang, langs } from "@/lib/i18n";
import { getProfessionals, ROLE_LABEL, VERIFICATION_LABEL, NKF_CONNECT_DEMO } from "@/lib/connect";

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const it = lang === "it";
  return {
    title: it ? "Professionisti — Nucleo Connect" : "Professionals — Nucleo Connect",
    description: it
      ? "Directory curata di professionisti dell'ecosistema longevity: formulatori, consulenti regolatori, agenti. Contatto mediato, nessun dato personale esposto."
      : "Curated directory of longevity-ecosystem professionals: formulators, regulatory consultants, agents. Mediated contact, no personal data exposed.",
    // Demo people are noindex until real, consented profiles exist.
    robots: { index: false, follow: true },
    alternates: { canonical: `/${lang}/connect/professionals`, languages: { it: "/it/connect/professionals", en: "/en/connect/professionals", "x-default": "/en/connect/professionals" } },
  };
}

export default async function ProfessionalsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const it = lang === "it";
  const pros = getProfessionals();

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <nav className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] mb-8">
        <Link href={`/${lang}/connect`} className="link-underline">Connect</Link>
        <span className="mx-2 text-[var(--border)]">/</span><span className="text-[var(--fg)]">Professionals</span>
      </nav>
      <div className="flex items-baseline gap-3 mb-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)]">Nucleo Connect</p>
        {NKF_CONNECT_DEMO && <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[#B5975D] border border-[#B5975D] px-2 py-0.5">demo</span>}
      </div>
      <h1 className="font-serif font-medium text-4xl sm:text-5xl tracking-[-0.02em] text-[var(--fg)] mb-5 text-balance">
        {it ? "Professionisti dell'ecosistema" : "Ecosystem professionals"}
      </h1>
      <p className="font-sans text-lg text-[var(--muted)] leading-relaxed max-w-2xl mb-4 text-pretty">
        {it
          ? "Formulatori, consulenti regolatori, agenti e altri profili. Contatto sempre mediato: nessuna email personale è esposta."
          : "Formulators, regulatory consultants, agents and other profiles. Contact is always mediated — no personal email is exposed."}
      </p>
      <p className="font-mono text-[0.62rem] text-[var(--muted)] leading-relaxed max-w-2xl mb-10">
        {it
          ? "Dati dimostrativi: profili fittizi. \"Sponsored\" e \"verified\" sono concetti separati. Nessun dato sanitario."
          : "Demo data: fictional profiles. \"Sponsored\" and \"verified\" are separate concepts. No health data."}
      </p>

      <div className="grid sm:grid-cols-2 gap-3">
        {pros.map((p) => (
          <div key={p.slug} className="card-surface p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between gap-3">
              <span className="font-sans font-medium text-[var(--fg)]">{p.name}</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] shrink-0">{p.country}</span>
            </div>
            <p className="font-mono text-[0.6rem] uppercase tracking-wide text-[var(--accent)]">{ROLE_LABEL[p.role]}</p>
            <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">{p.headline}</p>
            {p.expertise.length > 0 && (
              <p className="font-mono text-[0.6rem] text-[var(--muted)]">{p.expertise.join(" · ")}</p>
            )}
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-[0.55rem] uppercase tracking-widest border border-[var(--border)] px-1.5 py-0.5 text-[var(--muted)]">{VERIFICATION_LABEL[p.verificationStatus]}</span>
              {p.commercialStatus === "sponsored" && <span className="font-mono text-[0.55rem] uppercase tracking-widest border border-[#B5975D] text-[#B5975D] px-1.5 py-0.5">Sponsored</span>}
              {p.demo && <span className="font-mono text-[0.55rem] uppercase tracking-widest border border-[#B5975D] text-[#B5975D] px-1.5 py-0.5">demo</span>}
            </div>
            <Link href={`/${lang}/connect/join`} className="font-sans text-sm text-[var(--accent)] link-underline mt-2 w-fit">
              {it ? "Richiedi un'introduzione →" : "Request an introduction →"}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-12 border-t border-[var(--border)] pt-6">
        <Link href={`/${lang}/connect/join`} className="btn-accent font-sans font-medium text-sm px-6 py-3">
          {it ? "Candida il tuo profilo →" : "Add your profile →"}
        </Link>
      </div>
    </div>
  );
}
