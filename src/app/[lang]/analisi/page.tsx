import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, isValidLang } from "@/lib/i18n";
import { getAllArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import EvidenceBadge from "@/components/EvidenceBadge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getLocale(lang as "it" | "en");
  return { title: t.analisi.title, description: t.analisi.subtitle };
}

export default async function AnalisiPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const t = getLocale(lang);
  const articles = getAllArticles();

  const categories = [
    t.analisi.all,
    ...Array.from(new Set(articles.map((a) => a.frontmatter.categoria))),
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <div className="max-w-2xl mb-12">
        <p className="font-mono text-xs tracking-widest uppercase text-[var(--accent)] mb-4">
          {t.nav.analisi}
        </p>
        <h1 className="font-sans font-medium text-4xl sm:text-5xl tracking-[-0.03em] text-[var(--fg)] mb-4">
          {t.analisi.title}
        </h1>
        <p className="font-sans text-lg text-[var(--muted)] leading-relaxed">
          {t.analisi.subtitle}
        </p>
      </div>

      {/* Category tags */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <span
            key={cat}
            className="font-mono text-[0.65rem] uppercase tracking-widest px-3 py-1.5 border border-[var(--border)] text-[var(--muted)] cursor-default"
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Article list */}
      <div className="flex flex-col divide-y divide-[var(--border)]">
        {articles.length === 0 ? (
          <p className="font-sans text-sm text-[var(--muted)] py-8">—</p>
        ) : (
          articles.map((article) => (
            <Link
              key={article.slug}
              href={`/${lang}/analisi/${article.slug}`}
              className="group py-6 flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-8"
            >
              <div className="shrink-0 sm:w-32">
                <EvidenceBadge grade={article.frontmatter.grado} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)] mb-1.5">
                  {article.frontmatter.molecola} · {article.frontmatter.categoria}
                </p>
                <h2 className="font-sans font-medium text-lg text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors leading-snug mb-2">
                  {lang === "en" && article.frontmatter.title_en
                    ? article.frontmatter.title_en
                    : article.frontmatter.titolo}
                </h2>
                <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">
                  {lang === "en" && article.frontmatter.excerpt_en
                    ? article.frontmatter.excerpt_en
                    : article.frontmatter.excerpt}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="font-mono text-[0.65rem] text-[var(--muted)]">
                  {article.frontmatter.data}
                </p>
                <p className="font-mono text-[0.65rem] text-[var(--muted)]">
                  {article.readingTime} {t.article.reading_time}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
