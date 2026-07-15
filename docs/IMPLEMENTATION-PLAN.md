# Build-to-Transfer — implementation plan (master index)

Program: turn Nucleo Longevity into a transferable, optionality-preserving asset
(**Build for value. Operate for cash flow. Architect for optionality.**).

Rules honoured: no rebrand, no NUKLEO, not a pure skincare site, not a generalist
blog, no WordPress/WooCommerce, **no automatic production deploys**, **no invented
companies/data/metrics/valuations**, **audit before code changes**.

Working branch: `claude/retention-ui-improvements-8mtfdr`. Docs land on the branch;
`main`/production is NOT touched during this program without explicit approval.

## Phase 0 — Audit & exit-readiness scaffolding (NO code changes)
| Doc | Status |
|---|---|
| IMPLEMENTATION-PLAN.md (this) | ✅ done |
| .gitignore → ignore `private-data-room/` | ✅ done |
| CURRENT-STATE-AUDIT.md | ✅ done |
| EXIT-READINESS-SCORECARD.md | ✅ done |
| THIRD-PARTY-SERVICES-REGISTER.md | ✅ done |
| STRATEGIC-BUYER-MAP.md | ✅ done |
| IP-ASSET-REGISTER.md | ✅ done |
| DATA-ROOM-INDEX.md | ✅ done |
| CONTENT-AUDIT.md | ⏳ pending |
| SCIENTIFIC-RISK-AUDIT.md | ⏳ pending |
| SEO-AUDIT.md | ⏳ pending (partly covered in STRATEGIC-REVIEW.md) |
| TECHNICAL-AUDIT.md | ⏳ pending |
| DESIGN-SYSTEM-AUDIT.md | ⏳ pending |
| CONNECT-AUDIT.md | ⏳ pending |
| TRANSFERABILITY-AUDIT.md | ⏳ pending |
| EXIT-READINESS-AUDIT.md | ⏳ pending (scorecard is the core) |
| ACCEPTANCE-CRITERIA.md | ⏳ pending |
| DATA-PROVENANCE-POLICY.md | ⏳ pending |
| CONTENT-LICENSING-POLICY.md | ⏳ pending |
| STRATEGIC-BUYER-MAP.md | ✅ done |
| EXIT-CHANNEL-DECISION-TREE.md | ⏳ pending |
| VALUATION-FRAMEWORK.md | ⏳ pending |
| KPI-DICTIONARY.md | ⏳ pending |
| VERTICAL-ECONOMICS-MODEL.md | ⏳ pending |
| CARVE-OUT-MAP.md | ⏳ pending |
| RISK-REGISTER.md (incl. TRADEMARK REVIEW REQUIRED) | ⏳ pending |

## Phase 1 — Foundations refactor (code; needs approval, brand-affecting)
Only after audit sign-off. Highest-leverage, ordered:
1. **Taxonomy**: `EntryType` + `deliveryContext`, rename data model away from
   "molecule"-only; keep brand + concept.
2. **Editorial status**: `draft|reviewed|verified|update_required`; `indexable`
   requires `verified`; noindex + sitemap-exclude the rest (YMYL protection).
3. **Grade = a question**: `gradedQuestion` + separate safety flag + "not a
   recommendation" microcopy.
4. **Zod schemas + repository/adapter pattern** for each domain (future-proof to
   Postgres/API without rewrites).
5. **Domain exports** (JSON/CSV) per vertical → carve-out ready.

## Phase 2 — Evidence integrity
Verified-PMID pass on 12–15 pillars (stable PubMed + human sign-off); the rest
keep honest scoped-query links, flagged `review_required`.

## Phase 3 — Distribution & measurement (mostly user-side)
Search Console + Resend live; analytics; KPI capture wired to the KPI dictionary.

## Phase 4 — Transferability hardening
Third-party account ownership → project-dedicated accounts; SOPs; data-room
population (private, off-repo); IP assignment docs.

## Decisions that need the founder (not taken unilaterally)
- Rename of "Indice delle molecole" label (brand-facing).
- Reversing index-everything → index-only-verified (contradicts an earlier ask;
  recommended on YMYL grounds).
- Whether/when to migrate content editing to a visual CMS.
- Account ownership model (personal vs project-dedicated).
