import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang, langs } from "@/lib/i18n";
import { getProfessionals, getProfessionalBySlug, roleLabel, verificationLabel, pick } from "@/lib/connect";

export function generateStaticParams() {
  return langs.flatMap((lang) => getProfessionals().map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = getProfessionalBySlug(slug);
  if (!p) return {};
  return {
    title: `${p.name} — Nucleo Connect`,
    description: pick(lang === "it" ? "it" : "en", p.headline, p.headlineIt),
    // Fictional demo individuals stay noindex until real, consented profiles exist.
    robots: { index: !p.demo && p.status === "verified", follow: true },
    alternates: { canonical: `/${lang}/connect/professionals/${slug}` },
  };
}

export default async function ProfessionalPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isValidLang(lang)) notFound();
  const p = getProfessionalBySlug(slug);
  if (!p) notFound();
  const it = lang === "it";
  const isSponsored = p.commercialStatus === "sponsored";

  const Row = ({ k, v }: { k: string; v: React.ReactNode }) =>
    v ? (
      <div className="py-3 border-t border-[var(--border)] grid grid-cols-[9rem_1fr] gap-4">
        <dt className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)]">{k}</dt>
        <dd className="font-sans text-sm text-[var(--fg)]">{v}</dd>
      </div>
    ) : null;

  return (
    <article className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <nav className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] mb-8">
        <Link href={`/${lang}/connect`} className="link-underline">Connect</Link>
        <span className="mx-2 text-[var(--border)]">/</span>
        <Link href={`/${lang}/connect/professionals`} className="link-underline">Professionals</Link>
        <span className="mx-2 text-[var(--border)]">/</span><span className="text-[var(--fg)]">{p.name}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-mono text-[0.55rem] uppercase tracking-widest border border-[var(--border)] px-2 py-0.5 text-[var(--muted)]">{verificationLabel(p.verificationStatus, lang)}</span>
        {isSponsored && <span className="font-mono text-[0.55rem] uppercase tracking-widest border border-[#B5975D] text-[#B5975D] px-2 py-0.5">Sponsored profile</span>}
        {p.demo && <span className="font-mono text-[0.55rem] uppercase tracking-widest border border-[#B5975D] text-[#B5975D] px-2 py-0.5">demo</span>}
      </div>

      <h1 className="font-sans font-medium text-4xl sm:text-5xl tracking-[-0.03em] text-[var(--fg)] mb-3">{p.name}</h1>
      <p className="font-mono text-[0.7rem] uppercase tracking-wide text-[var(--muted)] mb-5">{roleLabel(p.role, lang)} · {p.country}</p>
      <p className="font-sans text-lg text-[var(--muted)] leading-relaxed max-w-xl mb-8 text-pretty">{pick(lang, p.headline, p.headlineIt)}</p>

      <dl className="border-b border-[var(--border)]">
        <Row k={it ? "Competenze" : "Expertise"} v={p.expertise.join(", ")} />
        <Row k={it ? "Mercati" : "Markets"} v={p.markets.join(", ")} />
        <Row k={it ? "Lingue" : "Languages"} v={p.languages?.join(", ")} />
      </dl>

      {/* Mediated contact — no personal emails / no fabricated credentials */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/${lang}/connect/join`} className="btn-accent font-sans font-medium text-sm px-6 py-3">
          {it ? "Richiedi un'introduzione" : "Request an introduction"}
        </Link>
      </div>

      <p className="mt-10 font-mono text-[0.6rem] text-[var(--muted)] leading-relaxed">
        {it
          ? "Profilo dimostrativo e fittizio. Nessuna credenziale è verificata da Núkleo; nessun endorsement è implicito. \"Sponsored\" non implica \"verified\"."
          : "Fictional demo profile. No credential is verified by Núkleo; no endorsement is implied. \"Sponsored\" does not imply \"verified\"."}
        {" "}
        <Link href={`/${lang}/funding-and-affiliations`} className="text-[var(--accent)] link-underline">{it ? "Indipendenza e affiliazioni" : "Independence & affiliations"}</Link>.
      </p>
    </article>
  );
}
