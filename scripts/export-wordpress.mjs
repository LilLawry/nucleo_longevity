#!/usr/bin/env node
/**
 * export-wordpress.mjs
 * ---------------------------------------------------------------------------
 * Turns the Nucleo content (content/molecules/*.mdx + content/analisi/*.mdx)
 * into a WordPress eXtended RSS (WXR) file that WordPress can import directly
 * via  Tools → Import → WordPress.
 *
 * It is a one-way *migration aid*: it lets you move the whole library to
 * WordPress whenever you want, without re-typing anything. The Next.js site
 * stays the source of truth; re-run this whenever you need a fresh export.
 *
 *   npm run export:wp     →  export/nucleo-wordpress-export.xml
 *
 * What it produces:
 *   - one WP post per molecule           (category "Molecules")
 *   - one WP post per analysis, per lang (category "Analysis")
 *   - grade / class / evidence etc. are also written as WP custom fields
 *     (postmeta), so a developer can later map them to a custom post type.
 * ---------------------------------------------------------------------------
 */
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { marked } from "marked";

const ROOT = process.cwd();
const MOL_DIR = path.join(ROOT, "content/molecules");
const ART_DIR = path.join(ROOT, "content/analisi");
const OUT_DIR = path.join(ROOT, "export");
const OUT_FILE = path.join(OUT_DIR, "nucleo-wordpress-export.xml");
const SITE = "https://www.nucleolongevity.com";

marked.setOptions({ gfm: true, breaks: false });

// ---- small helpers --------------------------------------------------------
const cdata = (s) => `<![CDATA[${String(s ?? "").replace(/]]>/g, "]]]]><![CDATA[>")}]]>`;
const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
const p = (s) => (s ? `<p>${esc(s)}</p>` : "");
const h2 = (s) => `<h2>${esc(s)}</h2>`;
const wpDate = (d) => {
  const dt = d ? new Date(d) : new Date();
  const iso = (isNaN(dt) ? new Date() : dt).toISOString().slice(0, 19).replace("T", " ");
  return iso;
};

/** MDX body → import-safe HTML (maps the custom components we use). */
function mdxToHtml(body) {
  let src = body
    // <FieldNote title="X">…</FieldNote>  →  labelled blockquote
    .replace(
      /<FieldNote(?:\s+title="([^"]*)")?\s*>([\s\S]*?)<\/FieldNote>/g,
      (_m, title, inner) =>
        `\n\n> **${(title || "From the field").toUpperCase()}**\n>\n> ${inner.trim().replace(/\n+/g, " ")}\n\n`
    )
    // React attribute → HTML attribute
    .replace(/className=/g, "class=");
  return marked.parse(src);
}

let POST_ID = 1000;
const items = [];

// ---- molecules ------------------------------------------------------------
function moleculeHtml(m) {
  const meta = [
    ["Class", m.class],
    ["Primary use", m.primaryUse],
    ["Grade", m.grade],
    ["Evidence strength", m.evidenceStrength],
    ["Type", m.regulatory],
    ["Last reviewed", m.lastReviewed],
  ].filter(([, v]) => v);

  const studies = (m.keyStudies || [])
    .map((s) => {
      const href = s.pmid ? `https://pubmed.ncbi.nlm.nih.gov/${s.pmid}/` : s.url;
      const label = s.pmid ? `PMID ${s.pmid}` : "PubMed";
      const type = s.type ? ` <em>(${esc(s.type)})</em>` : "";
      const link = href ? ` — <a href="${esc(href)}" rel="noopener">${esc(label)} ↗</a>` : "";
      return `<li><strong>${esc(s.title)}</strong>${type}${s.takeaway ? `<br>${esc(s.takeaway)}` : ""}${link}</li>`;
    })
    .join("");

  return [
    p(m.claim),
    m.bottomLine ? `<blockquote class="nucleo-bottom-line"><p><strong>Bottom line —</strong> ${esc(m.bottomLine)}</p></blockquote>` : "",
    `<ul class="nucleo-meta">${meta.map(([k, v]) => `<li><strong>${esc(k)}:</strong> ${esc(v)}</li>`).join("")}</ul>`,
    m.evidenceSummary ? h2("What the evidence says") + p(m.evidenceSummary) : "",
    studies ? h2("Key studies") + `<ol>${studies}</ol>` : "",
    m.mechanism ? h2("Mechanism") + p(m.mechanism) : "",
    m.safety ? h2("Safety") + p(m.safety) : "",
    m.dosageContext ? h2("Dosage context") + p(m.dosageContext) : "",
    m.fieldNote ? `<blockquote class="nucleo-field-note"><p><strong>FROM THE FIELD</strong></p><p>${esc(m.fieldNote)}</p></blockquote>` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

for (const file of fs.readdirSync(MOL_DIR).filter((f) => f.endsWith(".mdx"))) {
  const { data } = matter(fs.readFileSync(path.join(MOL_DIR, file), "utf8"));
  const slug = data.slug || file.replace(/\.mdx$/, "");
  const m = {
    slug,
    name: data.name || slug,
    class: data.class || "",
    primaryUse: data.primaryUse || "",
    grade: data.grade || "",
    evidenceStrength: data.evidenceStrength || "",
    regulatory: data.regulatory || "",
    claim: data.claim || "",
    bottomLine: data.bottomLine || "",
    evidenceSummary: data.evidenceSummary || "",
    mechanism: data.mechanism || "",
    safety: data.safety || "",
    dosageContext: data.dosageContext || "",
    keyStudies: data.keyStudies || [],
    fieldNote: data.fieldNote || "",
    lastReviewed: data.lastReviewed || "",
    status: data.status === "draft" ? "draft" : "publish",
  };
  items.push({
    id: POST_ID++,
    title: `${m.name} — evidence, safety, grade`,
    slug: `molecule-${slug}`,
    link: `${SITE}/en/molecule/${slug}`,
    date: m.lastReviewed,
    status: m.status,
    category: { nicename: "molecules", name: "Molecules" },
    excerpt: m.claim,
    content: moleculeHtml(m),
    meta: {
      nucleo_grade: m.grade,
      nucleo_class: m.class,
      nucleo_primary_use: m.primaryUse,
      nucleo_evidence_strength: m.evidenceStrength,
      nucleo_regulatory: m.regulatory,
      nucleo_last_reviewed: m.lastReviewed,
      nucleo_source_lang: "en",
    },
  });
}

// ---- analyses (one post per language) -------------------------------------
for (const file of fs.readdirSync(ART_DIR).filter((f) => f.endsWith(".mdx") && !f.endsWith(".en.mdx"))) {
  const raw = fs.readFileSync(path.join(ART_DIR, file), "utf8");
  const { data: f, content: itBody } = matter(raw);
  const slug = file.replace(/\.mdx$/, "");

  const enPath = path.join(ART_DIR, `${slug}.en.mdx`);
  const enBody = fs.existsSync(enPath) ? matter(fs.readFileSync(enPath, "utf8")).content : null;

  const langs = [
    { lang: "it", title: f.titolo, body: itBody, verdict: f.verdetto, excerpt: f.excerpt },
    enBody ? { lang: "en", title: f.title_en || f.titolo, body: enBody, verdict: f.verdetto_en || f.verdetto, excerpt: f.excerpt_en || f.excerpt } : null,
  ].filter(Boolean);

  for (const v of langs) {
    const factbox = v.verdict
      ? `<blockquote class="nucleo-verdict"><p><strong>${v.lang === "it" ? "Verdetto" : "Verdict"} —</strong> ${esc(v.verdict)}</p></blockquote>`
      : "";
    items.push({
      id: POST_ID++,
      title: v.title,
      slug: `${slug}-${v.lang}`,
      link: `${SITE}/${v.lang}/analisi/${slug}`,
      date: f.data,
      status: "publish",
      category: { nicename: "analysis", name: "Analysis" },
      excerpt: v.excerpt || "",
      content: factbox + "\n" + mdxToHtml(v.body),
      meta: {
        nucleo_grade: f.grado || "",
        nucleo_molecule: f.molecola || "",
        nucleo_pmids: (f.fonte_PMID || []).join(", "),
        nucleo_source_lang: v.lang,
      },
    });
  }
}

// ---- assemble WXR ---------------------------------------------------------
const now = new Date().toUTCString();
const itemXml = (it) => `
    <item>
      <title>${esc(it.title)}</title>
      <link>${esc(it.link)}</link>
      <pubDate>${new Date(it.date || Date.now()).toUTCString()}</pubDate>
      <dc:creator>${cdata("Redazione Nucleo")}</dc:creator>
      <guid isPermaLink="false">nucleo-${it.id}</guid>
      <description></description>
      <content:encoded>${cdata(it.content)}</content:encoded>
      <excerpt:encoded>${cdata(it.excerpt)}</excerpt:encoded>
      <wp:post_id>${it.id}</wp:post_id>
      <wp:post_date>${cdata(wpDate(it.date))}</wp:post_date>
      <wp:post_date_gmt>${cdata(wpDate(it.date))}</wp:post_date_gmt>
      <wp:comment_status>${cdata("closed")}</wp:comment_status>
      <wp:ping_status>${cdata("closed")}</wp:ping_status>
      <wp:post_name>${cdata(it.slug)}</wp:post_name>
      <wp:status>${cdata(it.status)}</wp:status>
      <wp:post_parent>0</wp:post_parent>
      <wp:menu_order>0</wp:menu_order>
      <wp:post_type>${cdata("post")}</wp:post_type>
      <wp:post_password>${cdata("")}</wp:post_password>
      <wp:is_sticky>0</wp:is_sticky>
      <category domain="category" nicename="${esc(it.category.nicename)}">${cdata(it.category.name)}</category>
${Object.entries(it.meta)
  .filter(([, val]) => val !== "" && val != null)
  .map(([k, val]) => `      <wp:postmeta><wp:meta_key>${cdata(k)}</wp:meta_key><wp:meta_value>${cdata(val)}</wp:meta_value></wp:postmeta>`)
  .join("\n")}
    </item>`;

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:excerpt="http://wordpress.org/export/1.2/excerpt/"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:wfw="http://wellformedweb.org/CommentAPI/"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:wp="http://wordpress.org/export/1.2/">
  <channel>
    <title>Nucleo Longevity</title>
    <link>${SITE}</link>
    <description>Evidence-graded longevity molecules — content export</description>
    <pubDate>${now}</pubDate>
    <language>en</language>
    <wp:wxr_version>1.2</wp:wxr_version>
    <wp:base_site_url>${SITE}</wp:base_site_url>
    <wp:base_blog_url>${SITE}</wp:base_blog_url>
    <wp:category>
      <wp:term_id>10</wp:term_id>
      <wp:category_nicename>${cdata("molecules")}</wp:category_nicename>
      <wp:category_parent>${cdata("")}</wp:category_parent>
      <wp:cat_name>${cdata("Molecules")}</wp:cat_name>
    </wp:category>
    <wp:category>
      <wp:term_id>11</wp:term_id>
      <wp:category_nicename>${cdata("analysis")}</wp:category_nicename>
      <wp:category_parent>${cdata("")}</wp:category_parent>
      <wp:cat_name>${cdata("Analysis")}</wp:cat_name>
    </wp:category>
${items.map(itemXml).join("\n")}
  </channel>
</rss>
`;

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(OUT_FILE, xml, "utf8");
const mol = items.filter((i) => i.category.nicename === "molecules").length;
const ana = items.filter((i) => i.category.nicename === "analysis").length;
console.log(`✓ WordPress export written: ${path.relative(ROOT, OUT_FILE)}`);
console.log(`  ${items.length} posts (${mol} molecules, ${ana} analyses) · ${(xml.length / 1024).toFixed(0)} KB`);
