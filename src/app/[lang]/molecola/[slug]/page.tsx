import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang, getLocale, langs } from "@/lib/i18n";
import { getAllMolecules, getMoleculeBySlug } from "@/lib/molecole";
import EvidenceBadge from "@/components/EvidenceBadge";
import JsonLd from "@/components/JsonLd";

const SITE = "https://www.nucleolongevity.com";

export function generateStaticParams() {
  return langs.flatMap((lang) => getAllMolecules().map((m) => ({ lang, slug: m.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const m = getMoleculeBySlug(slug);
  if (!m) return {};
  const title = `${m.name} — evidenza, sicurezza, grado`;
  return {
    title,
    description: m.claim || m.evidenceSummary,
    alternates: {
      canonical: `/${lang}/molecola/${slug}`,
      languages: { it: `/it/molecola/${slug}`, en: `/en/molecola/${slug}`, "x-default": `/it/molecola/${slug}` },
    },
    openGraph: { title, description: m.claim || m.evidenceSummary, type: "article" },
  };
}

const PUBMED = (pmid: string) => `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;

export default async function MoleculePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isValidLang(lang)) notFound();
  const m = getMoleculeBySlug(slug);
  if (!m) notFound();
  const t = getLocale(lang);
  const it = lang === "it";

  const L = {
    db: it ? "Database" : "Database",
    grade: it ? "Grado" : "Grade",
    underReview: it ? "In revisione" : "Under review",
    claimT: it ? "Cosa promette" : "The claim",
    evidenceT: it ? "Cosa dice l'evidenza" : "What the evidence says",
    studiesT: it ? "Studi chiave" : "Key studies",
    mechanismT: it ? "Meccanismo" : "Mechanism",
    safetyT: it ? "Sicurezza" : "Safety",
    dosageT: it ? "Contesto dosaggio" : "Dosage context",
    fieldT: it ? "Nota dal campo" : "From the field",
    relatedT: it ? "Molecole correlate" : "Related molecules",
    reviewed: it ? "Ultima revisione" : "Last reviewed",
    strength: it ? "Forza evidenza" : "Evidence strength",
    classL: it ? "Classe" : "Class",
    useL: it ? "Uso principale" : "Primary use",
    draftNote: it
      ? "Revisione in corso: il grado verrà assegnato a chiusura dell'analisi delle fonti."
      : "Review in progress: the grade will be assigned once the source analysis is complete.",
  };

  const related = m.relatedMolecules
    .map((s) => getMoleculeBySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getMoleculeBySlug>>[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${m.name} — ${L.evidenceT}`,
    description: m.claim || m.evidenceSummary,
    inLanguage: lang,
    url: `${SITE}/${lang}/molecola/${slug}`,
    lastReviewed: m.lastReviewed || undefined,
    audience: { "@type": "MedicalAudience", audienceType: "Patient" },
    about: { "@type": "Substance", name: m.name, alternateName: m.aliases },
    author: { "@type": "Organization", name: "Redazione Nucleo", url: `${SITE}/${lang}/chi-siamo` },
    publisher: { "@type": "Organization", name: "Nucleo Longevity", logo: { "@type": "ImageObject", url: `${SITE}/apple-touch-icon.png` } },
    citation: m.keyStudies.filter((s) => s.pmid).map((s) => ({ "@type": "CreativeWork", "@id": PUBMED(s.pmid as string), url: PUBMED(s.pmid as string), name: s.title })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L.db, item: `${SITE}/${lang}/database` },
      { "@type": "ListItem", position: 2, name: m.name, item: `${SITE}/${lang}/molecola/${slug}` },
    ],
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) =>
    children ? (
      <section className="py-8 border-t border-[var(--border)]">
        <h2 className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-3">{title}</h2>
        <div className="font-sans text-[0.95rem] text-[var(--fg)] leading-relaxed max-w-2xl">{children}</div>
      </section>
    ) : null;

  return (
    <article className="max-w-5xl mx-auto px-5 sm:px-8 py-14 md:py-20">
      <JsonLd data={jsonLd} />
      <JsonLd data={breadcrumb} />

      {/* Breadcrumb */}
      <nav className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] mb-8">
        <Link href={`/${lang}/database`} className="link-underline">{L.db}</Link>
        <span className="mx-2 text-[var(--border)]">/</span>
        <span className="text-[var(--fg)]">{m.name}</span>
      </nav>

      {/* Masthead */}
      <header className="grid md:grid-cols-[1fr_auto] gap-6 md:gap-12 items-start pb-8">
        <div>
          <h1 className="font-sans font-medium text-4xl sm:text-5xl tracking-[-0.03em] text-[var(--fg)] mb-3">
            {m.name}
          </h1>
          {m.aliases.length > 0 && (
            <p className="font-mono text-[0.7rem] text-[var(--muted)] mb-4">{m.aliases.join(" · ")}</p>
          )}
          <p className="font-sans text-lg text-[var(--muted)] leading-relaxed max-w-xl">{m.claim}</p>
        </div>
        {/* Grade block */}
        <div className="shrink-0 border border-[var(--border)] p-5 min-w-[150px]">
          <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)] mb-2">{L.grade}</p>
          {m.grade ? (
            <div className="font-sans font-medium text-5xl text-[var(--accent)] tabular leading-none mb-1">{m.grade}</div>
          ) : (
            <div className="font-mono text-xs text-[var(--muted)] mb-2">{L.underReview}</div>
          )}
          {m.grade && <p className="font-mono text-[0.6rem] uppercase tracking-wide text-[var(--muted)]">{t.grades[m.grade as keyof typeof t.grades]}</p>}
        </div>
      </header>

      {/* Meta strip */}
      <dl className="grid grid-cols-2 sm:grid-cols-4 border-t border-b border-[var(--border)] divide-x divide-[var(--border)]">
        {[
          [L.classL, m.class],
          [L.useL, m.primaryUse],
          [L.strength, m.evidenceStrength || "—"],
          [L.reviewed, m.lastReviewed || "—"],
        ].map(([k, v]) => (
          <div key={k} className="py-4 px-4 first:pl-0">
            <dt className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] mb-1">{k}</dt>
            <dd className="font-sans text-sm text-[var(--fg)] tabular">{v}</dd>
          </div>
        ))}
      </dl>

      {m.status === "draft" && (
        <p className="mt-6 border-l-2 border-[var(--accent)] pl-4 font-mono text-[0.72rem] text-[var(--muted)] leading-relaxed">
          {L.draftNote}
        </p>
      )}

      <Section title={L.claimT}>{m.claim}</Section>
      <Section title={L.evidenceT}>{m.evidenceSummary}</Section>

      {/* Key studies — footnote style */}
      {m.keyStudies.length > 0 && (
        <section className="py-8 border-t border-[var(--border)]">
          <h2 className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-4">{L.studiesT}</h2>
          <ol className="flex flex-col gap-4 max-w-2xl">
            {m.keyStudies.map((s, i) => {
              const href = s.pmid ? PUBMED(s.pmid) : s.url;
              return (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-[0.7rem] text-[var(--muted)] tabular pt-0.5">[{i + 1}]</span>
                  <div>
                    <p className="font-sans text-sm text-[var(--fg)] leading-snug">
                      {s.title}
                      {s.type ? <span className="font-mono text-[0.62rem] uppercase tracking-wide text-[var(--muted)]"> · {s.type}</span> : null}
                    </p>
                    {s.takeaway && <p className="font-sans text-sm text-[var(--muted)] leading-relaxed mt-0.5">{s.takeaway}</p>}
                    {href && (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="font-mono text-[0.66rem] text-[var(--accent)] link-underline">
                        {s.pmid ? `PMID ${s.pmid}` : "PubMed"} ↗
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      <Section title={L.mechanismT}>{m.mechanism}</Section>
      <Section title={L.safetyT}>{m.safety}</Section>
      <Section title={L.dosageT}>{m.dosageContext}</Section>

      {m.notaDalCampo && (
        <section className="py-8 border-t border-[var(--border)]">
          <h2 className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-3">{L.fieldT}</h2>
          <blockquote className="border-l-2 border-[var(--accent)] pl-5 font-serif text-lg text-[var(--fg)] leading-relaxed max-w-2xl">
            {m.notaDalCampo}
          </blockquote>
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="py-8 border-t border-[var(--border)]">
          <h2 className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-4">{L.relatedT}</h2>
          <div className="flex flex-wrap gap-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/${lang}/molecola/${r.slug}`} className="border border-[var(--border)] px-4 py-2 hover:border-[var(--accent)] transition-colors flex items-center gap-3">
                <span className="font-sans text-sm text-[var(--fg)]">{r.name}</span>
                {r.grade && <EvidenceBadge grade={r.grade} />}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Method link */}
      <div className="mt-10 pt-6 border-t border-[var(--border)]">
        <Link href={`/${lang}/metodo`} className="font-mono text-[0.7rem] uppercase tracking-widest text-[var(--accent)] link-underline">
          {it ? "Come assegniamo i gradi → Metodo" : "How we assign grades → Method"}
        </Link>
      </div>
    </article>
  );
}
