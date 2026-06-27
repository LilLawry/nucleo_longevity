import type { MetadataRoute } from "next";
import { getAllArticles, MOLECULES } from "@/lib/articles";
import { langs } from "@/lib/i18n";

const BASE_URL = "https://www.nucleolongevity.com";

const langAlternates = (page: string) => ({
  languages: Object.fromEntries(langs.map((l) => [l, `${BASE_URL}/${l}${page}`])),
});

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  // Stable "freshness" baseline = date of the most recent analysis, so static
  // pages don't report a new lastmod on every deploy.
  const siteUpdated = new Date(articles[0]?.frontmatter.data ?? "2026-01-01");

  const staticPages = [
    "", "/molecole", "/analisi", "/metodo", "/chi-siamo",
    "/contatti", "/contribuisci", "/disclaimer", "/termini", "/privacy",
  ];

  const staticEntries = langs.flatMap((lang) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${lang}${page}`,
      lastModified: siteUpdated,
      alternates: langAlternates(page),
    }))
  );

  // Molecule pages: freshness = most recent related analysis, else baseline.
  const moleculeEntries = langs.flatMap((lang) =>
    MOLECULES.map((m) => {
      const related = articles.filter(
        (a) => a.frontmatter.molecola.toLowerCase() === m.nome.toLowerCase()
      );
      const last = related[0]?.frontmatter.data;
      return {
        url: `${BASE_URL}/${lang}/molecole/${m.id}`,
        lastModified: last ? new Date(last) : siteUpdated,
        alternates: langAlternates(`/molecole/${m.id}`),
      };
    })
  );

  const articleEntries = langs.flatMap((lang) =>
    articles.map((article) => ({
      url: `${BASE_URL}/${lang}/analisi/${article.slug}`,
      lastModified: new Date(article.frontmatter.data),
      alternates: langAlternates(`/analisi/${article.slug}`),
    }))
  );

  return [...staticEntries, ...moleculeEntries, ...articleEntries];
}
