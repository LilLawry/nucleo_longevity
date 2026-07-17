# Acceptance Criteria — Nucleo Longevity refactor

> The work is acceptable only if every line below holds. Status reflects the
> current `main`. ✅ met · ⚠️ met with a deliberate, documented deviation ·
> ⏳ pending external/human action.

| # | Criterion | Status |
|---|---|---|
| 1 | NUCLEO LONGEVITY remains the brand | ✅ |
| 2 | Everything revolves around longevity | ✅ |
| 3 | Skin longevity stays integrated (Inside/Outside facet), not a separate brand | ✅ |
| 4 | Existing design respected (clinical/editorial, no forbidden elements) | ✅ |
| 5 | Database is more rigorous (EntryType, delivery context, review status) | ✅ |
| 6 | A–F system is explained (`/method`, `/evidence`, grade-as-question) | ✅ |
| 7 | Safety and grade are separate (`safetyContext` decoupled) | ✅ |
| 8 | The 54 entries are not auto-inflated | ✅ |
| 9 | Connect is a curated digital fair | ✅ |
| 10 | Connect does not pretend to be a transactional marketplace | ✅ |
| 11 | No invented companies or partners | ✅ (all demo, labelled) |
| 12 | Demo data is marked | ✅ |
| 13 | No scraping | ✅ (CSV/feeds/manual only) |
| 14 | No automatic medical claims | ✅ |
| 15 | No copied abstracts | ✅ (link-out + original summaries) |
| 16 | No health data collected | ✅ |
| 17 | Commission never influences ranking or evidence | ✅ |
| 18 | Sponsorship and verification are separate | ✅ (enforced in code) |
| 19 | Build passes | ✅ |
| 20 | TypeScript passes | ✅ (strict, green) |
| 21 | Critical tests pass | ⚠️ frontmatter validator green (54/54); formal test suite is backlog (see MVP-HANDOFF) |
| 22 | Accessible on mobile | ✅ responsive; full WCAG 2.2 AA audit is backlog |
| 23 | EN/IT pages consistent | ✅ |
| 24 | No automatic production deploy | ⚠️ **deliberate deviation** — the operator explicitly instructed continuous deploy of each milestone ("deploya al volo"); kept 53 pages indexed rather than gating to verified-only |

## Deliberate deviations (owner-approved)
- **#24 auto-deploy:** the GPT spec said "no automatic production deploy". The
  project owner directly and repeatedly overrode this in chat, asking to deploy
  each milestone immediately. Documented here so the deviation is explicit.
- **Indexing gate:** the verified-only YMYL index gate is staged (not active) to
  avoid dropping 53 already-indexed pages; flip it with the pillar-verification
  pass.

## Pending (external / human)
- ⏳ PMID single-record verification on the 15 pillars (HUMAN EVIDENCE REVIEW).
- ⏳ Resend domain verification + env vars (operator).
- ⏳ Google Search Console verification + sitemap submission (operator).
- ⏳ Legal + regulatory sign-off (see LEGAL-REVIEW-CHECKLIST.md).
