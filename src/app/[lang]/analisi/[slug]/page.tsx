import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, isValidLang } from "@/lib/i18n";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import ArticleShell from "./ArticleShell";
import MDXRenderer from "./MDXRenderer";
import JsonLd from "@/components/JsonLd";

const SITE = "https://www.nucleolongevity.com";

export async function generateStaticParams() {
  const articles = getAllArticles();
  const langs = ["it", "en"];
  return langs.flatMap((lang) =>
    articles.map((a) => ({ lang, slug: a.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};
  const { frontmatter: f } = article;
  const title = lang === "en" && f.title_en ? f.title_en : f.titolo;
  const description = lang === "en" && f.excerpt_en ? f.excerpt_en : f.excerpt;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: f.data,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isValidLang(lang)) notFound();
  const t = getLocale(lang);
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const allArticles = getAllArticles();
  const related = allArticles
    .filter(
      (a) =>
        a.slug !== slug &&
        (a.frontmatter.molecola === article.frontmatter.molecola ||
          a.frontmatter.categoria === article.frontmatter.categoria)
    )
    .slice(0, 3);

  const { frontmatter: f } = article;
  const title = lang === "en" && f.title_en ? f.title_en : f.titolo;
  const description = lang === "en" && f.excerpt_en ? f.excerpt_en : f.excerpt;
  const pageUrl = `${SITE}/${lang}/analisi/${slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    headline: title,
    description,
    datePublished: f.data,
    dateModified: f.data,
    inLanguage: lang,
    mainEntityOfPage: pageUrl,
    url: pageUrl,
    author: {
      "@type": f.autore ? "Person" : "Organization",
      name: f.autore || "Redazione Nucleo",
    },
    publisher: {
      "@type": "Organization",
      name: "Nucleo Longevity",
      logo: { "@type": "ImageObject", url: `${SITE}/apple-touch-icon.png` },
    },
    about: { "@type": "Thing", name: f.molecola },
    citation: (f.fonte_PMID || []).map((pmid) => ({
      "@type": "CreativeWork",
      "@id": `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
      url: `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`,
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Nucleo Longevity", item: `${SITE}/${lang}` },
      { "@type": "ListItem", position: 2, name: t.nav.analisi, item: `${SITE}/${lang}/analisi` },
      { "@type": "ListItem", position: 3, name: title, item: pageUrl },
    ],
  };

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <ArticleShell lang={lang} t={t} article={article} related={related}>
        <MDXRenderer content={article.content} />
      </ArticleShell>
    </>
  );
}
