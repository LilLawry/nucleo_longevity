import type { Metadata } from "next";
import Link from "next/link";
import { getLocale, isValidLang } from "@/lib/i18n";
import { getAllArticles, MOLECULES } from "@/lib/articles";
import { notFound } from "next/navigation";
import NewsletterForm from "@/components/NewsletterForm";
import EvidenceBadge from "@/components/EvidenceBadge";
import NucleusMark from "@/components/NucleusMark";
import Reveal from "@/components/Reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getLocale(lang as "it" | "en");
  return {
    // The root template appends " · Nucleo Longevity", so don't repeat the brand.
    title: { absolute: `Nucleo Longevity — ${t.hero.headline.replace("\n", " ")}` },
    description: t.hero.subline,
    alternates: {
      canonical: `/${lang}`,
      languages: { it: "/it", en: "/en", "x-default": "/it" },
    },
  };
}

const GRADES = ["A", "B", "C", "D", "E", "F"] as const;

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
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden border-b border-[var(--border)]">
        <div className="absolute inset-0 grid-surface" aria-hidden />
        <div className="glow-orb -top-32 -left-24 w-[34rem] h-[34rem]" aria-hidden />
        <div className="glow-orb top-10 -right-32 w-[28rem] h-[28rem]" aria-hidden />

        {/* Editorial masthead */}
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8">
          <div className="flex items-center gap-3 sm:gap-4 py-3 border-b border-[var(--border)] font-mono text-[0.6rem] sm:text-[0.65rem] tracking-widest uppercase text-[var(--muted)]">
            {t.home.masthead.map((m, i) => (
              <span key={m} className="flex items-center gap-3 sm:gap-4">
                {i > 0 && <span className="text-[var(--accent)]">/</span>}
                {m}
              </span>
            ))}
            <span className="ml-auto flex items-center gap-2 text-[var(--accent)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
              <span className="hidden sm:inline">PubMed</span>
            </span>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-14 pb-20 md:pt-20 md:pb-28">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 items-center">
            {/* Copy */}
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2.5 mb-7 border border-[var(--border)] rounded-full pl-2 pr-3.5 py-1 bg-[var(--bg-elev)]">
                <NucleusMark size={18} className="text-[var(--accent)]" />
                <span className="font-mono text-[0.65rem] tracking-widest uppercase text-[var(--muted)]">
                  Nucleo · Longevity
                </span>
              </div>

              <h1 className="font-sans font-medium text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-[-0.035em] text-[var(--fg)] mb-6 whitespace-pre-line text-balance">
                {t.hero.headline}
              </h1>
              <p className="font-sans text-lg text-[var(--muted)] leading-relaxed max-w-lg mb-9 text-pretty">
                {t.hero.subline}
              </p>

              <div className="max-w-md">
                <NewsletterForm lang={lang} t={t} showRole />
                <p className="mt-3 flex items-start gap-2 font-mono text-[0.65rem] text-[var(--muted)] leading-relaxed">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
                  </svg>
                  {t.home.guide_hook}
                </p>
              </div>

              {/* Trust chips */}
              <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {[t.home.trust_independent, t.home.trust_pubmed, t.home.trust_nohype].map((item) => (
                  <li key={item} className="flex items-center gap-2 font-mono text-[0.68rem] text-[var(--muted)]">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Brand nucleus with radiating aura */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative nucleus-aura">
                <div className="glow-orb inset-0 w-full h-full" aria-hidden />
                <NucleusMark size={300} animated glow className="text-[var(--accent)] relative" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ STATS BAR ============ */}
      <section className="border-b border-[var(--border)] bg-[var(--bg-elev)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--border)]">
          {t.home.stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 80} className="py-8 px-5 text-center md:text-left">
              <p className="font-sans font-medium text-3xl sm:text-4xl tracking-tight text-[var(--accent)]">
                {s.value}
              </p>
              <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)] mt-1.5">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ MOLECULE TICKER ============ */}
      <div className="marquee border-b border-[var(--border)] py-3" aria-hidden>
        <div className="marquee__track">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center">
              {MOLECULES.map((m) => (
                <span key={dup + m.id} className="flex items-center gap-3 px-6 font-mono text-[0.7rem] uppercase tracking-widest text-[var(--muted)]">
                  <span className="text-[var(--fg)]">{lang === "en" ? m.nome_en : m.nome}</span>
                  <span className="text-[var(--accent)]">{m.grado}</span>
                  <span className="text-[var(--border)]">·</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============ EVIDENCE LEGEND ============ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <Reveal className="max-w-2xl mb-10">
          <h2 className="font-sans font-medium text-2xl sm:text-3xl tracking-[-0.02em] text-[var(--fg)] mb-3">
            {t.home.legend_title}
          </h2>
          <p className="font-sans text-base text-[var(--muted)] leading-relaxed text-pretty">
            {t.home.legend_subtitle}
          </p>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {GRADES.map((g, i) => (
            <Reveal key={g} delay={i * 60}>
              <div className="card-surface p-5 h-full flex flex-col gap-3">
                <EvidenceBadge grade={g} />
                <span className="font-sans text-sm font-medium text-[var(--fg)]">
                  {t.grades[g]}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ LATEST ANALYSIS + MOLECULES ============ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Latest analisi */}
          <Reveal>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-sans font-medium text-xs tracking-widest uppercase text-[var(--muted)]">
                {t.sections.latest_analisi}
              </h2>
              <Link
                href={`/${lang}/analisi`}
                className="font-mono text-xs text-[var(--accent)] link-underline"
              >
                {t.sections.view_all}
              </Link>
            </div>
            <div className="flex flex-col gap-3">
              {articles.length === 0 ? (
                <p className="text-sm text-[var(--muted)] py-4">—</p>
              ) : (
                articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/${lang}/analisi/${article.slug}`}
                    className="group card-surface p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-3">
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
          </Reveal>

          {/* Molecules */}
          <Reveal delay={120}>
            <div className="flex items-baseline justify-between mb-6">
              <h2 className="font-sans font-medium text-xs tracking-widest uppercase text-[var(--muted)]">
                {t.sections.latest_molecole}
              </h2>
              <Link
                href={`/${lang}/molecole`}
                className="font-mono text-xs text-[var(--accent)] link-underline"
              >
                {t.sections.view_all}
              </Link>
            </div>
            <div className="card-surface divide-y divide-[var(--border)]">
              {molecules.map((mol) => (
                <Link
                  key={mol.id}
                  href={`/${lang}/molecole`}
                  className="group py-4 px-4 flex items-center justify-between gap-4 hover:bg-[var(--bg)] transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <div>
                    <p className="font-sans font-medium text-sm text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors">
                      {lang === "en" ? mol.nome_en : mol.nome}
                    </p>
                    <p className="font-mono text-[0.65rem] text-[var(--muted)] mt-0.5">
                      {lang === "en" ? mol.categoria_en : mol.categoria}
                    </p>
                  </div>
                  <EvidenceBadge grade={mol.grado} />
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ METHOD PREVIEW ============ */}
      <section className="border-y border-[var(--border)] bg-[var(--bg-elev)] relative overflow-hidden">
        <div className="glow-orb -bottom-40 -left-20 w-[30rem] h-[30rem]" aria-hidden />
        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-20 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="font-mono text-xs tracking-widest uppercase text-[var(--accent)] mb-4">
              {t.home.method_eyebrow}
            </p>
            <h2 className="font-sans font-medium text-2xl sm:text-3xl md:text-4xl tracking-[-0.02em] text-[var(--fg)] mb-4 text-balance">
              {t.home.method_title}
            </h2>
            <p className="font-sans text-base text-[var(--muted)] leading-relaxed mb-7 max-w-lg text-pretty">
              {t.home.method_subtitle}
            </p>
            <Link
              href={`/${lang}/metodo`}
              className="inline-flex items-center font-mono text-sm text-[var(--accent)] link-underline"
            >
              {t.home.method_cta}
            </Link>
          </Reveal>
          <Reveal delay={120} className="flex justify-center lg:justify-end">
            <span className="nucleus-aura">
              <NucleusMark size={180} animated glow className="text-[var(--accent)]" />
            </span>
          </Reveal>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
        <Reveal className="relative card-surface overflow-hidden px-6 sm:px-12 py-14 text-center">
          <div className="glow-orb -top-24 left-1/2 -translate-x-1/2 w-[26rem] h-[26rem]" aria-hidden />
          <div className="relative max-w-xl mx-auto">
            <NucleusMark size={56} animated className="text-[var(--accent)] mx-auto mb-6" />
            <h2 className="font-sans font-medium text-2xl sm:text-3xl tracking-[-0.02em] text-[var(--fg)] mb-3 text-balance">
              {t.home.cta_title}
            </h2>
            <p className="font-sans text-base text-[var(--muted)] leading-relaxed mb-8 text-pretty">
              {t.home.cta_subtitle}
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm lang={lang} t={t} />
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
