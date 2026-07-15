# Current-state audit (observed in repo, not browsed live)

Method: derived from the repository. "Observed" = verifiable in code/content.
Inference/To-verify flagged. No live crawl, no live PubMed verification this pass.

## Stack (Observed)
Next.js 14 App Router, TypeScript, Tailwind, deploy Vercel. Content in MDX/JSON
in-repo (gray-matter). i18n EN primary + IT, hreflang/canonical. No WordPress,
no remote DB. Newsletter via Resend (double opt-in, GDPR consent log). Plausible
referenced (To-verify if env set). `motion` used for hero.

## Routes (Observed)
`/[lang]` home; `/database`; `/molecule/[slug]`; `/prezzi`; `/confronto`;
`/report-card`; `/analisi` + `/analisi/[slug]`; `/method`; `/connect` (+/brands,
/reps); legal (chi-siamo, contatti, disclaimer, privacy, termini); `/go/[id]`
redirect; sitemap/robots/rss; OG images.

## Content (Observed)
- 54 entries in `content/molecules/*.mdx`. Fields include: name, aliases, class,
  primaryUse, grade A–F, evidenceStrength, regulatory, bottomLine, evidenceSummary,
  keyStudies[], mechanism, safety, dosageContext, applications[], fieldNote,
  relatedMolecules, lastReviewed, status (published/draft), structure, index,
  domain (systemic/topical derived).
- 1 long analysis (NMN), EN+IT body. Report Card aggregates published+graded.
- Skincare topicals included (SPF, retinoids, niacinamide, etc.) under a
  "Skincare / topical" class + Inside/Outside facet.

## Findings (issues / risks)
1. **Taxonomy imprecise (Observed):** the label "Indice delle molecole" and the
   `Molecule` type cover non-molecules (SPF category, interventions to come).
   → introduce `EntryType`.
2. **Index discipline (Observed):** ~53 entries set `index:true`, many drafted by
   AI with **scoped-query PubMed links, not verified single PMIDs**. Mass-indexing
   thin/unverified YMYL pages is a sitewide risk (Inference, high-confidence).
3. **Single A–F grade (Observed):** one grade per entry; not tied to a specific
   question/outcome; reads as advice. Needs `gradedQuestion` + safety flag split.
4. **Evidence provenance (Observed):** only NMN uses real PMIDs; most entries use
   scoped-query links. Honest but not verification-grade.
5. **E-E-A-T (Observed):** authorship anonymous ("Redazione Nucleo"); no named
   credentialed authors, no corrections policy page. Weak for YMYL.
6. **Comparator (Observed):** DEMO data (example.com), clearly labelled; ranking
   by price not commission; `/go` allowlist + noindex + minimal click log. Good
   guardrails; no real offers yet.
7. **Distribution (Observed):** Resend domain "pending" (not verified) → newsletter
   returns 503 until env set; Search Console not confirmed. No live traffic engine.
8. **Data model coupling (Observed):** content read directly via gray-matter with
   loose typing (no Zod). Fine now; harden before scale/carve-out.
9. **Founder dependence (Inference):** all content authored by founder + Claude;
   no SOPs; single-person throughput.
10. **Transferability (Observed):** accounts likely personal (Vercel/Resend/domain);
    no third-party register, no IP assignment docs, trademark status unknown.

## Strengths (Observed)
Clean clinical design system honoured; sitemap/canonical/hreflang/schema present;
secure outbound redirect; honest disclosures; portable content (MDX) + WordPress
export exists; contrarian, anti-hype editorial voice; comparator architecture
feed-ready.

## Not verified this pass (To-verify)
Live Lighthouse/perf, real indexation status, PMID correctness, competitor SERPs,
Plausible/env presence, accessibility audit (WCAG), actual account ownership.
