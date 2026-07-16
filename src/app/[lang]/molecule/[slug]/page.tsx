import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { isValidLang, getLocale, langs } from "@/lib/i18n";
import { getAllMolecules, getMoleculeBySlug } from "@/lib/molecole";
import EvidenceBadge from "@/components/EvidenceBadge";
import JsonLd from "@/components/JsonLd";
import OfferTable from "@/components/OfferTable";

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
    // Noindex until the page meets the NMN quality bar (real PMIDs, localized,
    // depth). Keep follow so link equity reaches the database. Flip via
    // `index: true` in the molecule's frontmatter once enriched.
    robots: { index: m.indexable, follow: true },
    alternates: {
      canonical: `/${lang}/molecule/${slug}`,
      languages: { it: `/it/molecule/${slug}`, en: `/en/molecule/${slug}`, "x-default": `/en/molecule/${slug}` },
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
    applicationsT: it ? "Esempi di applicazione" : "Examples of application",
    moreStudies: it ? "Vedi tutti gli studi su PubMed" : "See all studies on PubMed",
    mechanismT: it ? "Meccanismo" : "Mechanism",
    safetyT: it ? "Sicurezza" : "Safety",
    dosageT: it ? "Contesto dosaggio" : "Dosage context",
    fieldT: it ? "Nota dal campo" : "From the field",
    relatedT: it ? "Molecole correlate" : "Related molecules",
    reviewed: it ? "Ultima revisione" : "Last reviewed",
    strength: it ? "Forza evidenza" : "Evidence strength",
    classL: it ? "Classe" : "Class",
    useL: it ? "Uso principale" : "Primary use",
    bottomLineT: it ? "In sintesi" : "Bottom line",
    typeL: it ? "Tipo" : "Type",
    questionL: it ? "Il voto risponde a" : "The grade answers",
    notRec: it
      ? "Il voto misura la qualità dell'evidenza, non è un consiglio ad assumere o acquistare."
      : "The grade rates evidence quality — it is not advice to take or buy.",
    draftNote: it
      ? "Revisione in corso: il grado verrà assegnato a chiusura dell'analisi delle fonti."
      : "Review in progress: the grade will be assigned once the source analysis is complete.",
  };

  const related = m.relatedMolecules
    .map((s) => getMoleculeBySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getMoleculeBySlug>>[];

  // Visual evidence-strength meter: map the qualitative strength to filled cells.
  const STRENGTH_FILL: Record<string, number> = {
    high: 4, alta: 4, medium: 3, media: 3, low: 2, bassa: 2,
  };
  const meterFill = STRENGTH_FILL[m.evidenceStrength] ?? 0;
  const isDrug = /drug|prescription|farmaco/i.test(m.regulatory);
  const searchTerm = (m.aliases[0] || m.name).replace(/\(.*?\)/g, "").trim();
  const allStudiesUrl = `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(searchTerm)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: `${m.name} — ${L.evidenceT}`,
    description: m.claim || m.evidenceSummary,
    inLanguage: lang,
    url: `${SITE}/${lang}/molecule/${slug}`,
    lastReviewed: m.lastReviewed || undefined,
    audience: { "@type": "MedicalAudience", audienceType: "Patient" },
    about: {
      "@type": "Substance",
      name: m.name,
      alternateName: m.aliases,
      ...(m.structure ? { image: `${SITE}/molecules/${m.slug}.png` } : {}),
    },
    author: { "@type": "Organization", name: "Redazione Nucleo", url: `${SITE}/${lang}/chi-siamo` },
    publisher: { "@type": "Organization", name: "Nucleo Longevity", logo: { "@type": "ImageObject", url: `${SITE}/apple-touch-icon.png` } },
    citation: m.keyStudies.filter((s) => s.pmid).map((s) => ({ "@type": "CreativeWork", "@id": PUBMED(s.pmid as string), url: PUBMED(s.pmid as string), name: s.title })),
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: L.db, item: `${SITE}/${lang}/database` },
      { "@type": "ListItem", position: 2, name: m.name, item: `${SITE}/${lang}/molecule/${slug}` },
    ],
  };

  const Meter = ({ fill }: { fill: number }) => (
    <span className="inline-flex gap-[3px] align-middle" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className={`w-2.5 h-2.5 ${i < fill ? "bg-[var(--accent)] border border-[var(--accent)]" : "border border-[var(--border)]"}`}
        />
      ))}
    </span>
  );

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
          {m.regulatory && (
            <div
              className={`mt-5 inline-flex items-center gap-2 border px-3 py-1.5 ${
                isDrug ? "border-[var(--accent)]" : "border-[var(--border)]"
              }`}
            >
              <span className="font-mono text-[0.52rem] uppercase tracking-widest text-[var(--muted)]">{L.typeL}</span>
              <span
                className={`font-mono text-[0.66rem] uppercase tracking-wide ${
                  isDrug ? "text-[var(--accent)]" : "text-[var(--fg)]"
                }`}
              >
                {m.regulatory}
              </span>
            </div>
          )}
          {m.safetyFlag && (
            <p className="mt-3 font-mono text-[0.66rem] text-[#C45C5C] leading-relaxed max-w-md">
              ⚠ {m.safetyFlag}
            </p>
          )}
          {m.gradedQuestion && (
            <p className="mt-4 font-mono text-[0.62rem] text-[var(--muted)] leading-relaxed max-w-lg">
              <span className="uppercase tracking-widest text-[var(--accent)]">{L.questionL}: </span>
              {m.gradedQuestion}
            </p>
          )}
        </div>
        {/* Structure + grade */}
        <div className="flex flex-row md:flex-col gap-4 shrink-0">
          {m.structure && (
            <figure className="border border-[var(--border)] bg-white p-2 w-[150px] shrink-0">
              <Image
                src={`/molecules/${m.slug}.png`}
                alt={`${m.name} — 2D chemical structure`}
                width={500}
                height={500}
                className="w-full h-auto"
              />
              <figcaption className="font-mono text-[0.5rem] uppercase tracking-widest text-[#5C6669] text-center mt-1 pb-0.5">
                {m.structureNote || (it ? "Struttura · PubChem" : "Structure · PubChem")}
              </figcaption>
            </figure>
          )}
          <div className="border border-[var(--border)] p-5 min-w-[120px] self-start">
            <p className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--muted)] mb-2">{L.grade}</p>
            {m.grade ? (
              <div className="font-sans font-medium text-5xl text-[var(--accent)] tabular leading-none mb-1">{m.grade}</div>
            ) : (
              <div className="font-mono text-xs text-[var(--muted)] mb-2">{L.underReview}</div>
            )}
            {m.grade && <p className="font-mono text-[0.6rem] uppercase tracking-wide text-[var(--muted)]">{t.grades[m.grade as keyof typeof t.grades]}</p>}
            <p className="mt-3 font-mono text-[0.5rem] leading-relaxed text-[var(--muted)]">{L.notRec}</p>
          </div>
        </div>
      </header>

      {/* Meta strip */}
      <dl className="grid grid-cols-2 sm:grid-cols-4 border-t border-b border-[var(--border)] divide-x divide-[var(--border)]">
        {[
          [L.classL, m.class],
          [L.useL, m.primaryUse],
          [
            L.strength,
            m.evidenceStrength ? (
              <span className="inline-flex items-center gap-2">
                <Meter fill={meterFill} />
                <span className="uppercase text-[0.8rem]">{m.evidenceStrength}</span>
              </span>
            ) : (
              "—"
            ),
          ],
          [L.reviewed, m.lastReviewed || "—"],
        ].map(([k, v]) => (
          <div key={k as string} className="py-4 px-4 first:pl-0">
            <dt className="font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] mb-1">{k}</dt>
            <dd className="font-sans text-sm text-[var(--fg)] tabular">{v}</dd>
          </div>
        ))}
      </dl>

      {m.bottomLine && (
        <div className="mt-8 border border-[var(--border)] border-l-2 border-l-[var(--accent)] bg-[var(--bg-elev)] p-5 sm:p-6 max-w-3xl">
          <p className="font-mono text-[0.58rem] uppercase tracking-widest text-[var(--accent)] mb-2">{L.bottomLineT}</p>
          <p className="font-serif text-lg sm:text-xl text-[var(--fg)] leading-relaxed text-pretty">{m.bottomLine}</p>
        </div>
      )}

      {m.status === "draft" && (
        <p className="mt-6 border-l-2 border-[var(--accent)] pl-4 font-mono text-[0.72rem] text-[var(--muted)] leading-relaxed">
          {L.draftNote}
        </p>
      )}

      <Section title={L.evidenceT}>{m.evidenceSummary}</Section>

      {/* Key studies — footnote style, each linking to the source */}
      <section className="py-8 border-t border-[var(--border)]">
        <h2 className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-4">{L.studiesT}</h2>
        {m.keyStudies.length > 0 && (
          <ol className="flex flex-col gap-4 max-w-2xl">
            {m.keyStudies.map((s, i) => {
              const href = s.pmid ? PUBMED(s.pmid) : s.url;
              return (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-[0.7rem] text-[var(--muted)] tabular pt-0.5">[{i + 1}]</span>
                  <div>
                    <p className="font-sans text-sm leading-snug">
                      {href ? (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[var(--fg)] hover:text-[var(--accent)] underline decoration-[var(--border)] underline-offset-2 transition-colors">
                          {s.title}
                        </a>
                      ) : (
                        <span className="text-[var(--fg)]">{s.title}</span>
                      )}
                      {s.type ? <span className="font-mono text-[0.62rem] uppercase tracking-wide text-[var(--muted)]"> · {s.type}</span> : null}
                    </p>
                    {s.takeaway && <p className="font-sans text-sm text-[var(--muted)] leading-relaxed mt-0.5">{s.takeaway}</p>}
                    {href && (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="font-mono text-[0.66rem] text-[var(--accent)] link-underline">
                        {s.pmid ? `PMID ${s.pmid} — ${it ? "leggi l'articolo" : "read the article"}` : (it ? "Apri su PubMed" : "Open on PubMed")} ↗
                      </a>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
        <a
          href={allStudiesUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-5 font-mono text-[0.68rem] uppercase tracking-widest text-[var(--accent)] link-underline"
        >
          {L.moreStudies} ↗
        </a>
      </section>

      <Section title={L.mechanismT}>{m.mechanism}</Section>
      <Section title={L.safetyT}>{m.safety}</Section>
      <Section title={L.dosageT}>{m.dosageContext}</Section>

      {/* Examples of application — practical, non-prescriptive */}
      {m.applications.length > 0 && (
        <section className="py-8 border-t border-[var(--border)]">
          <h2 className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-3">{L.applicationsT}</h2>
          <ul className="flex flex-col gap-2.5 max-w-2xl">
            {m.applications.map((a, i) => (
              <li key={i} className="flex gap-3 font-sans text-[0.95rem] text-[var(--fg)] leading-relaxed">
                <span className="text-[var(--accent)] shrink-0" aria-hidden>—</span>
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {m.fieldNote && (
        <section className="py-8 border-t border-[var(--border)]">
          <h2 className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-3">{L.fieldT}</h2>
          <blockquote className="border-l-2 border-[var(--accent)] pl-5 font-serif text-lg text-[var(--fg)] leading-relaxed max-w-2xl">
            {m.fieldNote}
          </blockquote>
        </section>
      )}

      {/* Where to buy — price comparator */}
      <OfferTable slug={slug} lang={lang} />

      {/* Related */}
      {related.length > 0 && (
        <section className="py-8 border-t border-[var(--border)]">
          <h2 className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-4">{L.relatedT}</h2>
          <div className="flex flex-wrap gap-3">
            {related.map((r) => (
              <Link key={r.slug} href={`/${lang}/molecule/${r.slug}`} className="border border-[var(--border)] px-4 py-2 hover:border-[var(--accent)] transition-colors flex items-center gap-3">
                <span className="font-sans text-sm text-[var(--fg)]">{r.name}</span>
                {r.grade && <EvidenceBadge grade={r.grade} />}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Method link */}
      <div className="mt-10 pt-6 border-t border-[var(--border)]">
        <Link href={`/${lang}/method`} className="font-mono text-[0.7rem] uppercase tracking-widest text-[var(--accent)] link-underline">
          {it ? "Come assegniamo i gradi → Metodo" : "How we assign grades → Method"}
        </Link>
      </div>
    </article>
  );
}
