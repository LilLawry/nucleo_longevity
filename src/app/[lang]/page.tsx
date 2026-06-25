import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, isValidLang } from "@/lib/i18n";
import { getAllArticles, MOLECULES } from "@/lib/articles";
import { notFound } from "next/navigation";
import NewsletterForm from "@/components/NewsletterForm";
import EvidenceBadge from "@/components/EvidenceBadge";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getLocale(lang as "it" | "en");
  return {
    title: `Nucleo Longevity — ${t.hero.headline.replace("\n", " ")}`,
    description: t.hero.subline,
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const t = getLocale(lang);
  const articles = getAllArticles().slice(0, 4);
  const molecules = MOLECULES.slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-2xl">
          <p className="font-mono text-xs tracking-widest uppercase text-[var(--accent)] mb-6">
            Nucleo · Longevity
          </p>
          <h1 className="font-sans font-medium text-4xl sm:text-5xl md:text-6xl leading-[1.08] tracking-[-0.03em] text-[var(--fg)] mb-6 whitespace-pre-line">
            {t.hero.headline}
          </h1>
          <p className="font-sans text-lg text-[var(--muted)] leading-relaxed max-w-lg mb-10">
            {t.hero.subline}
          </p>

          {/* Email capture */}
          <div className="max-w-md">
            <NewsletterForm lang={lang} t={t} showRole />
          </div>
        </div>

        {/* Decorative rule */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <div className="w-2 h-2 rounded-full border border-[var(--accent)] bg-transparent" style={{ boxShadow: "0 0 0 1.5px var(--accent)" }} />
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>
      </section>

      {/* Two-column preview */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Latest analisi */}
          <div>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-sans font-medium text-xs tracking-widest uppercase text-[var(--muted)]">
                {t.sections.latest_analisi}
              </h2>
              <Link
                href={`/${lang}/analisi`}
                className="font-mono text-xs text-[var(--accent)] hover:opacity-70 transition-opacity"
              >
                {t.sections.view_all}
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-[var(--border)]">
              {articles.length === 0 ? (
                <p className="text-sm text-[var(--muted)] py-4">—</p>
              ) : (
                articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/${lang}/analisi/${article.slug}`}
                    className="group py-4 flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <EvidenceBadge grade={article.frontmatter.grado} />
                      <span className="font-mono text-[0.65rem] text-[var(--muted)] uppercase tracking-wider">
                        {article.frontmatter.molecola}
                      </span>
                    </div>
                    <p className="font-sans font-medium text-sm text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                      {lang === "en" && article.frontmatter.title_en
                        ? article.frontmatter.title_en
                        : article.frontmatter.titolo}
                    </p>
                    <p className="font-mono text-[0.65rem] text-[var(--muted)]">
                      {article.frontmatter.data} · {article.readingTime} {t.article.reading_time}
                    </p>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Molecules */}
          <div>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-sans font-medium text-xs tracking-widest uppercase text-[var(--muted)]">
                {t.sections.latest_molecole}
              </h2>
              <Link
                href={`/${lang}/molecole`}
                className="font-mono text-xs text-[var(--accent)] hover:opacity-70 transition-opacity"
              >
                {t.sections.view_all}
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-[var(--border)]">
              {molecules.map((mol) => (
                <div key={mol.id} className="py-4 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-sans font-medium text-sm text-[var(--fg)]">
                      {lang === "en" ? mol.nome_en : mol.nome}
                    </p>
                    <p className="font-mono text-[0.65rem] text-[var(--muted)] mt-0.5">
                      {lang === "en" ? mol.categoria_en : mol.categoria}
                    </p>
                  </div>
                  <EvidenceBadge grade={mol.grado} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
