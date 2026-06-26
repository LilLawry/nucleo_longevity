import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/it/guida", "/en/guida", "/it/grazie", "/en/grazie"] },
    sitemap: "https://www.nucleolongevity.com/sitemap.xml",
    host: "https://www.nucleolongevity.com",
  };
}
