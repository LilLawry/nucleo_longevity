# Grading Methodology — Nucleo Longevity

> How an A–F grade is assigned. The grade answers a **question**, not a
> recommendation: _"What does the human evidence support for this use?"_ This
> document is the public, auditable basis for every grade and is the core IP of
> the observatory.

## The grade is a question, not advice
Each entry carries a `gradedQuestion` (e.g. _"What does the human evidence
support for: NAD+ restoration via NMN?"_). The A–F chip answers **that specific
question about that specific use** — it is not a purchase recommendation, dosing
instruction, or medical advice. UI copy states this explicitly under every grade.

## Evidence hierarchy (what counts)
Ranked, strongest first. Grades are driven by the **best available human
evidence for the specific claim**, down-weighted for risk of bias.

1. Meta-analyses / systematic reviews of RCTs in the relevant human population.
2. Well-powered, pre-registered RCTs with clinically meaningful endpoints.
3. Smaller or surrogate-endpoint RCTs.
4. Prospective human cohort / observational data.
5. Mechanistic, animal, or in-vitro data — **supporting context only; never
   sufficient for a high grade.**

Marketing claims, influencer testimony, and manufacturer literature carry **zero
grade weight** and are never cited as evidence.

## Grade scale

| Grade | Meaning |
|---|---|
| **A** | Consistent high-quality human evidence supports the specific claim. |
| **B** | Good human evidence; some limitations (size, endpoints, consistency). |
| **C** | Mixed or preliminary human evidence; plausible but unproven. |
| **D** | Weak / mostly indirect human evidence; mechanistic optimism only. |
| **E** | Little credible human evidence for the claim as marketed. |
| **F** | Human evidence contradicts the claim, or a clear safety concern dominates. |

A grade is always paired with the **specific use** it applies to. The same
molecule can hold different grades for different claims.

## Safety flags
Independently of the grade, entries carry a `safetyFlag` when relevant (e.g.
_"Prescription drug — use only under medical supervision"_), auto-derived for
regulated substances and editable per entry. A strong grade never overrides a
safety flag.

## Editorial review status
Every entry moves through a review lifecycle, tracked in `reviewStatus`:

`draft → reviewRequired → reviewed → verified` (plus `updateRequired`,
`archived`).

Only `verified` entries are eligible to be gated for indexing/highlighting once
that gate is enabled. Today the gate is off to preserve SEO coverage; the field
is populated so it can be switched on without a data migration.

## Citations & honesty
- Citations link to **specific PubMed records** where a stable PMID has been
  human-verified. Where a PMID has **not** yet been verified, the entry uses a
  clearly-scoped PubMed **query link** and is marked review-required — we do
  **not** invent PMIDs.
- Conflicts of interest in cited studies are noted where known.
- "Sponsored" (Connect) and "verified" are separate concepts and never conflated.

## Independence
Grades are produced by the editorial process described here and are **never** for
sale. Participation in Finder (affiliate) or Connect (directory/advisory) does
not buy, change, or influence any grade. This is restated on `/method` and
`/confronto`.

## Change control
Methodology changes are versioned in git. A material change to how grades are
computed requires a note in the entry's history and, where it changes a public
grade, a visible "updated" timestamp.
