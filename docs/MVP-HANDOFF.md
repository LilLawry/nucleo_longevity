# MVP Handoff — Nucleo Longevity

> Final report for the refactor program. What existed, what changed, what was
> added, what remains. Pairs with ACCEPTANCE-CRITERIA.md.

## 1. What existed
Next.js 14 editorial observatory: homepage, `/database` (54 entries),
`/molecule/[slug]`, `/prezzi` (demo comparator), `/confronto`, `/report-card`,
`/analisi`, `/method`, `/connect` (advisory intake), legal pages. Bilingual EN/IT,
MDX content, A–F grades, clinical aesthetic.

## 2. What was kept
Brand, concept ("inside and out"), aesthetic, Next.js/Vercel/MDX stack, the 54
entries and their grades (no auto-changes), bilingual routing, EvidenceBadge,
existing components.

## 3. What was changed
- Database → **"Longevity Database"** with EntryType + Inside/Outside + Type
  filter; molecule pages show grade-as-question + safety flag + applications +
  clickable studies.
- `/prezzi` presented as **Finder**; price-per-dose, grade/price filters,
  safe `/go/[id]` redirect.
- `/connect` overview expanded into an ecosystem hub.
- Molecule data layer hardened with a **Zod frontmatter validator** (warn-only)
  and `safetyContext` / `gradeStatus` derivation.

## 4. What was added (routes)
- `/evidence` — evidence hub.
- `/funding-and-affiliations` — independence disclosure.
- `/connect/directory`, `/connect/companies/[slug]`, `/connect/join`,
  `/connect/expo`, `/connect/professionals`, `/connect/professionals/[slug]`,
  `/connect/opportunities` — curated directory + digital fair (all demo).
- Nav: Evidence added; Finder + Connect directory surfaced; sitemap updated.

## 5. Data models
- `src/lib/molecole.ts`: EntryType, DeliveryContext, ReviewStatus, SafetyContext,
  GradeStatus, `MoleculeFrontmatterSchema` (Zod), repository accessors.
- `src/lib/connect.ts`: CompanyProfile, ProfessionalProfile, Opportunity,
  ExpoShowcase (Zod, `z.input` seeds), repository accessors + label maps.
- `src/lib/offers.ts`: Finder offer/merchant repository (demo mode).

## 6. Tests
- Frontmatter validator run across all 54 entries: **0 warnings**.
- Formal suite (Playwright/axe/unit) is **backlog** — see §11.

## 7. Problems / risks
- PMID citations partly scoped queries, not single verified records
  (HUMAN EVIDENCE REVIEW REQUIRED).
- Full WCAG 2.2 AA audit not yet run.
- CSP/security headers to be documented before commercial launch.

## 8. Demo content (must stay labelled / noindex)
All Connect companies, professionals, opportunities, and Finder offers are
fictional demo data. Demo/unverified Connect profiles are noindex.

## 9. Missing real data / config (operator)
Resend domain + env vars; Google Search Console; real affiliate feeds
(AGREEMENT REQUIRED); real verified Connect partners.

## 10. Legal / scientific gates
See LEGAL-REVIEW-CHECKLIST.md and CONTENT-REVIEW-PLAN.md. Regulated-substance
content needs REGULATORY REVIEW.

## 11. Next five operational tasks
1. **PMID verification** on the 15 pillars; then enable the verified-only index
   gate.
2. **Resend** domain verification + env vars; ship the weekly review.
3. **Search Console** verification + submit sitemap; watch coverage.
4. **Formal test suite** (build/frontmatter/redirect-allowlist/hreflang/a11y) +
   WCAG 2.2 AA pass.
5. **Legal + regulatory sign-off** (LEGAL-REVIEW-CHECKLIST) before any commercial
   launch or real Connect/affiliate data.
