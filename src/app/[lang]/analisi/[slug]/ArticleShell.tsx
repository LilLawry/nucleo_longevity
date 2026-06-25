"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/locales/it";
import type { Article } from "@/lib/articles";
import EvidenceBadge from "@/components/EvidenceBadge";
import NewsletterForm from "@/components/NewsletterForm";

interface Props {
  lang: string;
  t: Locale;
  article: Article;
  related: Article[];
  children: React.ReactNode;
}

export default function ArticleShell({ lang, t, article, related, children }: Props) {
  const { frontmatter: f } = article;
  const [progress, setProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const el = contentRef.current;
      const top = el.getBoundingClientRect().top;
      const total = el.offsetHeight;
      const scrolled = Math.max(0, -top);
      setProgress(Math.min(100, (scrolled / total) * 100));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const title = lang === "en" && f.title_en ? f.title_en : f.titolo;

  return (
    <>
      {/* Progress bar */}
      <div className="progress-bar" style={{ width: `${progress}%` }} />

      <article className="max-w-6xl mx-auto px-5 sm:px-8 py-12 md:py-20">
        {/* Fact box */}
        <div className="fact-box mb-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <EvidenceBadge grade={f.grado} label={t.grades[f.grado]} />
            <span className="font-mono text-[0.65rem] text-[var(--muted)] uppercase tracking-wider">
              {f.molecola} · {f.categoria}
            </span>
          </div>
          <h1 className="font-sans font-medium text-2xl sm:text-3xl tracking-[-0.02em] text-[var(--fg)] mb-6 leading-tight">
            {title}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
            {[
              { label: lang === "it" ? "A cosa serve" : "Purpose", value: f.a_cosa_serve },
              { label: lang === "it" ? "Quanto è provato" : "Evidence level", value: f.quanto_e_provato },
              { label: lang === "it" ? "Campione studi" : "Study sample", value: f.campione_studi },
              { label: lang === "it" ? "Effetto misurato" : "Measured effect", value: f.effetto_misurato },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-0.5">
                  {label}
                </p>
                <p className="font-sans text-sm text-[var(--fg)] leading-snug">{value}</p>
              </div>
            ))}
          </div>
          {f.fonte_PMID && f.fonte_PMID.length > 0 && (
            <div className="mt-4 pt-4 border-t border-[var(--border)]">
              <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-1.5">
                PMID
              </p>
              <div className="flex flex-wrap gap-2">
                {f.fonte_PMID.map((pmid) => (
                  <a
                    key={pmid}
                    href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[0.65rem] text-[var(--accent)] hover:underline"
                  >
                    {pmid}
                  </a>
                ))}
              </div>
            </div>
          )}
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-1">
              {lang === "it" ? "Verdetto" : "Verdict"}
            </p>
            <p className="font-sans text-sm font-medium text-[var(--fg)] leading-snug">{f.verdetto}</p>
          </div>
        </div>

        {/* Layout: content + sticky sidebar */}
        <div className="flex gap-12 lg:gap-16 items-start" ref={contentRef}>
          <div className="flex-1 min-w-0">
            {/* Article body */}
            <div className="prose prose-sm sm:prose max-w-none dark:prose-invert">
              {children}
            </div>

            {/* Mid-article newsletter */}
            <div className="my-12 p-6 border border-[var(--accent)] bg-[rgba(17,96,95,0.04)]">
              <p className="font-sans font-medium text-base text-[var(--fg)] mb-1">
                {t.article.newsletter_prompt}
              </p>
              <p className="font-mono text-xs text-[var(--muted)] mb-4">{t.article.newsletter_sub}</p>
              <NewsletterForm lang={lang} t={t} compact />
            </div>

            {/* Affiliate disclosure */}
            <p className="font-mono text-[0.65rem] text-[var(--muted)] leading-relaxed border-t border-[var(--border)] pt-6 mt-8">
              {t.article.affiliate_disclosure}
            </p>
          </div>

          {/* Sticky ToC — desktop only */}
          <aside className="hidden xl:block w-56 shrink-0 sticky top-20 self-start">
            <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--muted)] mb-3">
              {t.article.toc_title}
            </p>
            <TocLinks content={article.content} />
          </aside>
        </div>

        {/* Related articles */}
        {related.length > 0 && (
          <div className="mt-16 border-t border-[var(--border)] pt-10">
            <p className="font-mono text-xs uppercase tracking-widest text-[var(--muted)] mb-6">
              {t.article.related}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {related.map((a) => (
                <Link
                  key={a.slug}
                  href={`/${lang}/analisi/${a.slug}`}
                  className="group border border-[var(--border)] p-4 hover:border-[var(--accent)] transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <EvidenceBadge grade={a.frontmatter.grado} />
                    <span className="font-mono text-[0.6rem] text-[var(--muted)] uppercase tracking-wider">
                      {a.frontmatter.molecola}
                    </span>
                  </div>
                  <p className="font-sans text-sm font-medium text-[var(--fg)] group-hover:text-[var(--accent)] transition-colors leading-snug">
                    {lang === "en" && a.frontmatter.title_en ? a.frontmatter.title_en : a.frontmatter.titolo}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </>
  );
}

function TocLinks({ content }: { content: string }) {
  const headings = content.match(/^#{2,3}\s+.+$/gm) ?? [];
  if (headings.length === 0) return null;

  return (
    <nav className="flex flex-col gap-2">
      {headings.map((h, i) => {
        const level = h.match(/^(#{2,3})/)?.[1].length ?? 2;
        const text = h.replace(/^#{2,3}\s+/, "");
        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        return (
          <a
            key={i}
            href={`#${id}`}
            className={`font-sans text-xs leading-snug text-[var(--muted)] hover:text-[var(--accent)] transition-colors ${
              level === 3 ? "pl-3" : ""
            }`}
          >
            {text}
          </a>
        );
      })}
    </nav>
  );
}
