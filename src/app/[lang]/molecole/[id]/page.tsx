import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocale, isValidLang, langs } from "@/lib/i18n";
import { getAllArticles, MOLECULES } from "@/lib/articles";
import PageHeader from "@/components/PageHeader";
import EvidenceBadge from "@/components/EvidenceBadge";
import JsonLd from "@/components/JsonLd";

const SITE = "https://www.nucleolongevity.com";

export function generateStaticParams() {
  return langs.flatMap((lang) => MOLECULES.map((m) => ({ lang, id: m.id })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}): Promise<Metadata> {
  const { lang, id } = await params;
  const m = MOLECULES.find((x) => x.id === id);
  if (!m) return {};
  const name = lang === "en" ? m.nome_en : m.nome;
  const desc = lang === "en" ? m.descrizione_en : m.descrizione;
  return {
    title: `${name} — evidenza e analisi`,
    description: desc,
    alternates: {
      canonical: `/${lang}/molecole/${id}`,
      languages: { it: `/it/molecole/${id}`, en: `/en/molecole/${id}`, "x-default": `/it/molecole/${id}` },
    },
  };
}

export default async function MoleculePage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!isValidLang(lang)) notFound();
  const m = MOLECULES.find((x) => x.id === id);
  if (!m) notFound();
  const t = getLocale(lang);
  const it = lang === "it";

  const name = it ? m.nome : m.nome_en;
  const desc = it ? m.descrizione : m.descrizione_en;
  const categoria = it ? m.categoria : m.categoria_en;

  const related = getAllArticles().filter(
    (a) => a.frontmatter.molecola.toLowerCase() === m.nome.toLowerCase()
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    name,
    description: desc,
    inDefinedTermSet: `${SITE}/${lang}/molecole`,
    url: `${SITE}/${lang}/molecole/${id}`,
  };

  return (
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <JsonLd data={jsonLd} />

      <nav className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)] mb-6">
        <Link href={`/${lang}/molecole`} className="link-underline">{t.nav.molecole}</Link>
        <span className="mx-2 text-[var(--border)]">/</span>
        <span className="text-[var(--fg)]">{name}</span>
      </nav>

      <PageHeader eyebrow={categoria} title={name} subtitle={desc} />

      <div className="card-surface p-6 flex flex-wrap items-center gap-x-8 gap-y-4 mb-12">
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-1.5">
            {it ? "Grado di evidenza" : "Evidence grade"}
          </p>
          <EvidenceBadge grade={m.grado} label={t.grades[m.grado]} />
        </div>
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-1.5">
            {it ? "Categoria" : "Category"}
          </p>
          <p className="font-sans text-sm text-[var(--fg)]">{categoria}</p>
        </div>
        <div>
          <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-1.5">
            {it ? "Analisi pubblicate" : "Published analyses"}
          </p>
          <p className="font-sans text-sm text-[var(--fg)]">{related.length}</p>
        </div>
      </div>

      <h2 className="font-sans font-medium text-xs tracking-widest uppercase text-[var(--muted)] mb-6">
        {it ? "Analisi su questa molecola" : "Analyses on this molecule"}
      </h2>

      {related.length === 0 ? (
        <div className="card-surface p-6">
          <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">
            {it
              ? "Non abbiamo ancora pubblicato un'analisi dedicata. Iscriviti: ti avvisiamo appena esce."
              : "We haven't published a dedicated analysis yet. Subscribe and we'll let you know when it's out."}
          </p>
          <Link href={`/${lang}`} className="inline-flex items-center mt-4 font-mono text-xs text-[var(--accent)] link-underline">
            {it ? "Iscriviti agli aggiornamenti →" : "Subscribe for updates →"}
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {related.map((a) => (
            <Link
              key={a.slug}
              href={`/${lang}/analisi/${a.slug}`}
              className="group card-surface p-5 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <h3 className="font-sans font-medium text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                  {lang === "en" && a.frontmatter.title_en ? a.frontmatter.title_en : a.frontmatter.titolo}
                </h3>
                <p className="font-mono text-[0.65rem] text-[var(--muted)] mt-1">
                  {a.frontmatter.data} · {a.readingTime} {t.article.reading_time}
                </p>
              </div>
              <EvidenceBadge grade={a.frontmatter.grado} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
