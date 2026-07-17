import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang, langs } from "@/lib/i18n";
import { getCompanies, getCompanyBySlug, orgTypeLabel, verificationLabel, pick } from "@/lib/connect";
import { getMoleculeBySlug } from "@/lib/molecole";

export function generateStaticParams() {
  return langs.flatMap((lang) => getCompanies().map((c) => ({ lang, slug: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = getCompanyBySlug(slug);
  if (!c) return {};
  return {
    title: `${c.name} — Nucleo Connect`,
    description: pick(lang === "it" ? "it" : "en", c.description, c.descriptionIt),
    // Demo/unverified profiles are noindex until real, verified data exists.
    robots: { index: !c.demo && c.status === "verified", follow: true },
    alternates: { canonical: `/${lang}/connect/companies/${slug}` },
  };
}

export default async function CompanyPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isValidLang(lang)) notFound();
  const c = getCompanyBySlug(slug);
  if (!c) notFound();
  const it = lang === "it";

  const related = (c.relatedEntries || []).map((s) => getMoleculeBySlug(s)).filter(Boolean);
  const isSponsored = c.commercialStatus === "sponsored";

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
        <Link href={`/${lang}/connect/directory`} className="link-underline">Directory</Link>
        <span className="mx-2 text-[var(--border)]">/</span><span className="text-[var(--fg)]">{c.name}</span>
      </nav>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="font-mono text-[0.55rem] uppercase tracking-widest border border-[var(--border)] px-2 py-0.5 text-[var(--muted)]">{verificationLabel(c.verificationStatus, lang)}</span>
        {isSponsored && <span className="font-mono text-[0.55rem] uppercase tracking-widest border border-[#B5975D] text-[#B5975D] px-2 py-0.5">Sponsored profile</span>}
        {c.demo && <span className="font-mono text-[0.55rem] uppercase tracking-widest border border-[#B5975D] text-[#B5975D] px-2 py-0.5">demo</span>}
      </div>

      <h1 className="font-sans font-medium text-4xl sm:text-5xl tracking-[-0.03em] text-[var(--fg)] mb-3">{c.name}</h1>
      <p className="font-mono text-[0.7rem] uppercase tracking-wide text-[var(--muted)] mb-5">
        {c.organisationType.map((t) => orgTypeLabel(t, lang)).join(" · ")} · {c.country}
      </p>
      <p className="font-sans text-lg text-[var(--muted)] leading-relaxed max-w-xl mb-8 text-pretty">{pick(lang, c.description, c.descriptionIt)}</p>

      <dl className="border-b border-[var(--border)]">
        <Row k={it ? "Fondata" : "Founded"} v={c.foundedYear} />
        <Row k={it ? "Sedi" : "Cities"} v={c.cities?.join(", ")} />
        <Row k={it ? "Mercati" : "Markets"} v={c.marketsServed.join(", ")} />
        <Row k={it ? "Categorie" : "Categories"} v={c.categories.join(", ")} />
        <Row k={it ? "Servizi" : "Services"} v={c.services.join(", ")} />
        <Row k={it ? "MOQ dichiarato" : "Declared MOQ"} v={c.minimumOrderQuantity} />
        <Row k={it ? "Certificazioni (dichiarate)" : "Certifications (declared)"} v={c.certificationsDeclared?.join(", ")} />
        <Row k={it ? "Lingue" : "Languages"} v={c.languages?.join(", ")} />
        <Row k={it ? "Ultimo controllo" : "Last checked"} v={c.lastCheckedAt} />
      </dl>

      {/* Mediated contact — no personal emails exposed */}
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={`/${lang}/connect/join`} className="btn-accent font-sans font-medium text-sm px-6 py-3">
          {it ? "Richiedi un'introduzione" : "Request an introduction"}
        </Link>
        {c.website && (
          <a href={c.website} target="_blank" rel="nofollow noopener" className="font-sans font-medium text-sm px-6 py-3 border border-[var(--border)] text-[var(--fg)] hover:border-[var(--accent)] transition-colors">
            {it ? "Sito web" : "Visit website"} ↗
          </a>
        )}
      </div>

      {related.length > 0 && (
        <div className="mt-12 border-t border-[var(--border)] pt-6">
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-3">{it ? "Voci collegate" : "Related entries"}</p>
          <div className="flex flex-wrap gap-3">
            {related.map((m) => (
              <Link key={m!.slug} href={`/${lang}/molecule/${m!.slug}`} className="border border-[var(--border)] px-4 py-2 hover:border-[var(--accent)] transition-colors font-sans text-sm">
                {m!.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      <p className="mt-10 font-mono text-[0.6rem] text-[var(--muted)] leading-relaxed">
        {it
          ? "Profilo dimostrativo e fittizio. Núkleo non dichiara partnership ufficiali senza contratto. \"Sponsored\" non implica \"verified\"."
          : "Fictional demo profile. Núkleo asserts no official partnership without an agreement. \"Sponsored\" does not imply \"verified\"."}
        {" "}
        <Link href={`/${lang}/confronto`} className="text-[var(--accent)] link-underline">{it ? "Come funziona" : "How it works"}</Link>.
      </p>
    </article>
  );
}
