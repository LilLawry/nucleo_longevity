import type { Metadata } from "next";
import { getLocale, isValidLang } from "@/lib/i18n";
import { getAllArticles } from "@/lib/articles";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import AnalisiClient, { type AnalisiItem } from "./AnalisiClient";

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

  const items: AnalisiItem[] = articles.map((a) => ({
    slug: a.slug,
    titolo: a.frontmatter.titolo,
    title_en: a.frontmatter.title_en,
    molecola: a.frontmatter.molecola,
    categoria: a.frontmatter.categoria,
    grado: a.frontmatter.grado,
    data: a.frontmatter.data,
    readingTime: a.readingTime,
    excerpt: a.frontmatter.excerpt,
    excerpt_en: a.frontmatter.excerpt_en,
  }));

  const categories = [
    t.analisi.all,
    ...Array.from(new Set(articles.map((a) => a.frontmatter.categoria))),
  ];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <PageHeader eyebrow={t.nav.analisi} title={t.analisi.title} subtitle={t.analisi.subtitle} />
      <AnalisiClient lang={lang} t={t} items={items} categories={categories} />
    </div>
  );
}
