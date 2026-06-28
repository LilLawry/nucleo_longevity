import { getAllArticles } from "@/lib/articles";

export const dynamic = "force-static";

const SITE = "https://www.nucleolongevity.com";
const esc = (s: string) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export async function GET() {
  const articles = getAllArticles();
  const items = articles
    .map((a) => {
      const f = a.frontmatter;
      const title = f.title_en || f.titolo;
      const desc = f.excerpt_en || f.excerpt || "";
      const url = `${SITE}/en/analisi/${a.slug}`;
      return `<item><title>${esc(title)}</title><link>${url}</link><guid isPermaLink="true">${url}</guid><pubDate>${new Date(f.data).toUTCString()}</pubDate><description>${esc(desc)}</description></item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Nucleo Longevity</title>
<link>${SITE}</link>
<description>Independent analysis of longevity molecules. Graded evidence, PubMed sources.</description>
<language>en</language>
${items}
</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
