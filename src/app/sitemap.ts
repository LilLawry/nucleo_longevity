import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";
import { langs } from "@/lib/i18n";

const BASE_URL = "https://nucleolongevity.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles();
  const staticPages = [
    "",
    "/molecole",
    "/analisi",
    "/metodo",
    "/chi-siamo",
    "/contatti",
    "/disclaimer",
    "/termini",
    "/privacy",
  ];

  const staticEntries = langs.flatMap((lang) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${lang}${page}`,
      lastModified: new Date(),
      alternates: {
        languages: Object.fromEntries(
          langs.map((l) => [l, `${BASE_URL}/${l}${page}`])
        ),
      },
    }))
  );

  const articleEntries = langs.flatMap((lang) =>
    articles.map((article) => ({
      url: `${BASE_URL}/${lang}/analisi/${article.slug}`,
      lastModified: new Date(article.frontmatter.data),
      alternates: {
        languages: Object.fromEntries(
          langs.map((l) => [l, `${BASE_URL}/${l}/analisi/${article.slug}`])
        ),
      },
    }))
  );

  return [...staticEntries, ...articleEntries];
}
