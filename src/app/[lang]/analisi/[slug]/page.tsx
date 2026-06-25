import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, isValidLang } from "@/lib/i18n";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import ArticleShell from "./ArticleShell";
import MDXRenderer from "./MDXRenderer";

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

  return (
    <ArticleShell lang={lang} t={t} article={article} related={related}>
      <MDXRenderer content={article.content} />
    </ArticleShell>
  );
}
