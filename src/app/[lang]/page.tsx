import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getLocale, isValidLang } from "@/lib/i18n";
import { getAllArticles, MOLECULES } from "@/lib/articles";
import { notFound } from "next/navigation";
import NewsletterForm from "@/components/NewsletterForm";
import EvidenceBadge from "@/components/EvidenceBadge";
import NucleusMark from "@/components/NucleusMark";
import Reveal from "@/components/Reveal";
import Hero from "./Hero";

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
      languages: { it: "/it", en: "/en", "x-default": "/en" },
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
      <Hero lang={lang} t={t} molecules={MOLECULES} />

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
                  href={`/${lang}/molecule/${mol.id}`}
                  className="group py-4 px-4 flex items-center justify-between gap-4 hover:bg-[var(--bg)] transition-colors first:rounded-t-lg last:rounded-b-lg"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="shrink-0 w-10 h-10 border border-[var(--border)] bg-white flex items-center justify-center">
                      <Image
                        src={`/molecules/${mol.id}.png`}
                        alt=""
                        width={40}
                        height={40}
                        className="w-8 h-8 object-contain"
                      />
                    </span>
                    <div className="min-w-0">
                      <p className="font-sans font-medium text-sm text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors truncate">
                        {lang === "en" ? mol.nome_en : mol.nome}
                      </p>
                      <p className="font-mono text-[0.65rem] text-[var(--muted)] mt-0.5 truncate">
                        {lang === "en" ? mol.categoria_en : mol.categoria}
                      </p>
                    </div>
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
              href={`/${lang}/method`}
              className="inline-flex items-center font-mono text-sm text-[var(--accent)] link-underline"
            >
              {t.home.method_cta}
            </Link>
          </Reveal>
          <Reveal delay={120} className="flex justify-center lg:justify-end">
            <NucleusMark size={170} animated className="text-[var(--accent)]" />
          </Reveal>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section id="subscribe" className="max-w-6xl mx-auto px-5 sm:px-8 py-24 scroll-mt-20">
        <Reveal className="relative card-surface overflow-hidden px-6 sm:px-12 py-14 text-center">
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
