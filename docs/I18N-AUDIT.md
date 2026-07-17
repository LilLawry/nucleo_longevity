# i18n Audit — EN/IT parity + language switch

> Audit of where English leaked into the Italian experience, and how the
> language switch behaved. Status after this pass. Anything still needing a human
> translator is marked **TRANSLATION REQUIRED**.

## Problem 1 — language switch (FIXED)
- **Was:** `src/components/Header.tsx` used `href={`/${otherLang}`}` — switching
  language always jumped to the **other language's homepage**, losing the current
  page. No path preservation.
- **Now:** the switch swaps only the `/[lang]` segment of the current
  `usePathname()`, so it stays on the **same page** across all routes, including
  dynamic ones (`/molecule/[slug]`, `/connect/companies/[slug]`,
  `/connect/professionals/[slug]`, `/analisi/[slug]`). Root falls back cleanly.
- **UX:** the toggle now shows a globe icon + the target language code, with an
  explicit `aria-label`/`title` ("Passa a English" / "Switch to Italiano"),
  visible focus ring, larger hit area, `hrefLang` set. Present on mobile too.

## Problem 2 — English inside /it (data layer) 
UI copy already used `lang === "it" ? … : …` correctly. The leaks were in the
**data layers and label maps**, which had no IT variant.

| Source | Field(s) | Status |
|---|---|---|
| `src/lib/connect.ts` companies | `description` | ✅ `descriptionIt` added + used |
| `src/lib/connect.ts` professionals | `headline` | ✅ `headlineIt` added + used |
| `src/lib/connect.ts` opportunities | `title`, `summary` | ✅ `titleIt`/`summaryIt` added + used |
| `src/lib/connect.ts` showcases | `title`, `theme`, `blurb` | ✅ IT variants added + used |
| Org-type labels | `ORG_TYPE_LABEL` | ✅ `orgTypeLabel(t, lang)` (IT map) |
| Verification labels | `VERIFICATION_LABEL` | ✅ `verificationLabel(v, lang)` (IT map) |
| Role labels | `ROLE_LABEL` | ✅ `roleLabel(r, lang)` (IT map) |

**Mechanism:** a single `pick(lang, en, it?)` helper (falls back to EN when the IT
value is absent) plus `orgTypeLabel` / `verificationLabel` / `roleLabel`
accessors. New localized fields are optional in the Zod schema, so nothing breaks
if a translation is missing — it falls back, it never shows a blank.

Pages updated: `/connect/directory`, `/connect/companies/[slug]`,
`/connect/professionals` (+ `/[slug]`), `/connect/opportunities`, `/connect/expo`.

## Remaining — long-form content (TRANSLATION REQUIRED)
- **Molecule bodies** (`content/molecules/*.mdx`) and **articles**
  (`content/**`) have a single body, not one per language. Where an entry's body
  is only in one language, the other locale shows that language's prose.
  Translating scientific/YMYL bodies must be done by a human — **TRANSLATION
  REQUIRED / HUMAN REVIEW REQUIRED**; do not auto-translate graded claims.
- Recommended next step: add `body_it` / `.it.mdx` variants for the 15 pillar
  entries first (see CONTENT-REVIEW-PLAN.md), same pattern already used for the
  bilingual article.

## Invariants
- No `/it/*` page shows unintended English UI/labels/demo data after this pass.
- Missing IT translations fall back to EN (never blank), and are catalogued here.
- hreflang/canonical unchanged and correct; no URLs broken; aesthetic unchanged.
