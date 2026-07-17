# Content Review Plan — the 54 entries

> Classification and human-review plan for the existing database. **No grade or
> safety conclusion in this file is auto-approved.** Claude may prepare drafts,
> metadata and reports; a human must approve every grade and every safety note.
> Where a conclusion still needs a person, it is marked **HUMAN EVIDENCE REVIEW
> REQUIRED**.

## Principles
- Deepen existing entries before adding new ones.
- Max 1–2 new entries per week, human-reviewed.
- Do not inflate the 54 entries automatically.
- Grades change only after human review, with a changelog entry.

## Pillars (deepen first — 15 selected)
The spec's pillar shortlist mapped to entries that exist in the repo:

| Pillar | Slug | Current grade | Note |
|---|---|---|---|
| Creatine | `creatine` | B | Strong human base; keep. |
| Omega-3 | `omega-3` | C | Human RCTs; revisit outcome scoping. |
| Vitamin D | `vitamin-d` | C | Broad; split by outcome. |
| Spermidine | `spermidina` | B | Verify pillar PMIDs. |
| NMN | `nmn` | B | Only `verified` reviewStatus today. |
| NR | `nicotinamide-riboside` | B | Pair with NMN comparison. |
| Rapamycin | `rapamicina` | A | Highest grade — **HUMAN EVIDENCE REVIEW REQUIRED** on the A. |
| Metformin | `metformina` | B | YMYL-sensitive; safety = medicalSupervisionRequired. |
| Photoprotection (SPF) | `sunscreen-spf` | A | Strong; confirm claim scoping. |
| Retinoids | `retinoids` | B | Prescription variants: supervision. |
| Ceramides | `ceramides` | B | Barrier outcome; ingredient-vs-product. |
| Niacinamide | `niacinamide` | B | Multiple outcomes; split. |
| PHA / lactobionic | `pha-lactobionic` | C | Preliminary; keep C. |
| Peptides (topical) | `peptides-topical` | C | Heterogeneous; scope per peptide. |
| Strength exercise | — | — | **Missing as an entry** — behaviour entryType to add (human-reviewed). |

## Grade distribution (actual, 54 entries)
- **A:** 2 — `rapamicina`, `sunscreen-spf`
- **B:** 10 — `aha`, `ceramides`, `creatine`, `metformina`, `niacinamide`, `nicotinamide-riboside`, `nmn`, `retinoids`, `spermidina`, `vitamin-c-topical`
- **C:** 40 (the long tail — supporting entries)
- **D:** 1 — `lithium-low-dose`
- **F:** 1 — `polynucleotides` (editor's call: independent evidence insufficient vs marketing)

## Buckets
- **Pillar (15):** table above — deepen, verify PMIDs, changelog.
- **Supporting (~37):** the C-grade tail — keep concise, ensure each has a graded question + human-evidence section.
- **High-risk YMYL:** `metformina`, `rapamicina`, `lithium-low-dose`, prescription `retinoids` — safety context must dominate; no purchase CTA.
- **Commercial (skin):** `ceramides`, `niacinamide`, `sunscreen-spf`, `retinoids`, `pha-lactobionic`, `peptides-topical`, `bakuchiol`, topical vitamins — link to Finder + Connect.
- **Requires taxonomy correction:** entries that are ingredient families or interventions, not single molecules (`peptides-topical`, `ceramides`, `sunscreen-spf`) — set precise `entryType`.

## PubMed / PMID status
Many entries still cite **scoped PubMed queries**, not single verified PMIDs. Any
page that carries only a query link is labelled *"PubMed search, not curated
bibliography"*, is **not** used to justify a high grade, and its entry is
`reviewRequired`. Verifying single PMIDs on the 15 pillars is the first
human-review batch. **HUMAN EVIDENCE REVIEW REQUIRED.**

## Cadence
1. Verify pillar PMIDs + confirm A/B grades (human).
2. Scope graded questions per outcome on multi-outcome entries.
3. Add `strength-exercise` (behaviour) as a pillar, human-reviewed.
4. Then, at most 1–2 new entries/week.
