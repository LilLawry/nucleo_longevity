# Information Architecture — Nucleo Longevity

> Canonical map of routes, their purpose, indexing intent, and how the three
> pillars (Observatory / Finder / Connect) connect. Bilingual: every route is
> served under `/en/…` and `/it/…` with hreflang + canonical.

## Route map

| Route | Pillar | Purpose | Index |
|---|---|---|---|
| `/[lang]` | Observatory | Home: hero, stats, evidence legend, Finder entry, latest analyses, molecules, report card, method, newsletter | yes |
| `/[lang]/database` | Observatory | **Longevity Database** — filterable index of all molecule entries (search, grade, class, Inside/Outside, type) | yes |
| `/[lang]/molecule/[slug]` | Observatory | Molecule entry: grade-as-question, safety flag, applications, studies, offers | yes (per `index: true`) |
| `/[lang]/analisi` + `/[lang]/analisi/[slug]` | Observatory | Editorial analyses / articles | yes |
| `/[lang]/method` | Observatory | Grading methodology + independence disclosure | yes |
| `/[lang]/confronto` | Observatory | Transparency: how grades, Finder, and Connect relate | yes |
| `/[lang]/prezzi` | Finder | Price comparator hub (grade + max-price filters, price-per-dose) | yes |
| `/go/[id]` | Finder | Safe outbound redirect (allowlist, 302, noindex, no PII) | no |
| `/[lang]/report-card` | Observatory | Lead magnet (printable report card) | yes |
| `/[lang]/connect` | Connect | Connect overview + entry cards | yes |
| `/[lang]/connect/directory` | Connect | Curated directory + digital fair (filters) | yes |
| `/[lang]/connect/companies/[slug]` | Connect | Company profile (mediated contact) | **no while demo/unverified** |
| `/[lang]/connect/join` | Connect | Apply to the directory (manual review) | yes |
| `/[lang]/connect/brands` · `/reps` | Connect | Advisory intake forms | yes |
| `/[lang]/chi-siamo` · `/contatti` · `/contribuisci` | Trust | About / contact / contribute | yes |
| `/[lang]/privacy` · `/termini` · `/disclaimer` | Legal | Policies | yes |
| `/sitemap.xml` · `/robots.txt` · `/rss.xml` | System | Discovery feeds | n/a |

## Indexing policy
- Molecule entries are indexed when frontmatter sets `index: true` (currently 53
  of 54 indexed). The editorial `reviewStatus` model exists and can gate
  indexing to `verified` later, but is **not** gating today to preserve SEO
  coverage. See `src/lib/molecole.ts`.
- Connect company profiles are **noindex** while `demo` or not `verified`
  (`robots.index = !c.demo && c.status === "verified"`). This prevents fictional
  demo data from entering the index.
- `/go/[id]` and all outbound redirects are **noindex** and carry no PII.

## Cross-pillar links (the flywheel)
- Molecule entry → **Finder** (OfferTable → `/go/[id]`) → affiliate.
- Molecule entry ↔ **Connect** (related entries on company profiles; companies
  reference the molecules they touch).
- Method / confronto pages anchor **independence**: every commercial surface
  links back to the disclosure that grades are never for sale.

## Taxonomy
- **EntryType** (derived): systemic vs topical, plus finer class.
- **DeliveryContext:** how a molecule is taken/applied.
- **ReviewStatus:** `draft → reviewRequired → reviewed → verified` (+
  `updateRequired`, `archived`).
- **Inside/Outside facet:** UI-level systemic vs topical toggle on the database.

## Naming
- Consumer-facing pillar names: **Observatory**, **Finder**, **Connect**.
- Never expose internal codenames (NKF, NUKLEO) in UI copy.
