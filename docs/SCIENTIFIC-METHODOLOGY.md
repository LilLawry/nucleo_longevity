# Scientific Methodology — Nucleo Longevity

> How evidence is gathered, read, and separated from safety. This complements
> `GRADING-METHODOLOGY.md` (which defines the A–F scale) by describing the
> upstream scientific process. It is core IP and is written to be auditable.

## Scope of a grade
A grade is attached to a **specific evaluated question** — a molecule + outcome +
population + context — never to "the substance" in the abstract. The same entry
can hold different grades for different questions.

## Human vs preclinical evidence (kept separate)
- **Human evidence** drives the grade: RCTs, meta-analyses, prospective cohorts,
  in the relevant population and outcome.
- **Preclinical evidence** (animal, in-vitro, ex-vivo, mechanistic) is presented
  in its own section and **never sufficient for a high grade**. It provides
  mechanism and context only.

## Grade components (how a letter is reasoned)
Seven components inform the letter (see `GRADING-METHODOLOGY.md` for the scale):
1. Human evidence (quantity + quality)
2. Outcome relevance (surrogate vs clinical)
3. Replication
4. Consistency across studies
5. Applicability (population, dose, real-world)
6. Bias & conflicts of interest
7. Recency

## Evidence tiers (for "how much support exists")
`high` / `medium` / `low` — stored per entry in `evidenceStrength`. This is the
strength of the underlying human evidence base, distinct from the A–F letter.

## Grade status
Not every entry is gradeable. `gradeStatus` ∈ `graded | insufficient |
notEvaluated | underReview`. **Absence of studies never defaults to F** — it maps
to `insufficient`/`notEvaluated`. F is reserved for evidence that contradicts the
claim, or disproportionate risk.

## Safety is separate
`safetyContext` ∈ `generallyConsumerAppropriate | professionalGuidanceSuggested |
medicalSupervisionRequired | prescriptionOnly | insufficientSafetyData |
notApplicable`. A strong grade **never** softens the safety context. Prescription
and injectable entries carry supervision language and no purchase CTA.

## Studies
Each cited study should carry: PMID, PMCID, DOI, title, authors, journal, year,
design, population, sample size, intervention, comparator, duration, outcomes,
results, limitations, conflicts, relevance. We **do not** copy abstracts.

## Search strategy & honesty
- Where a single stable PMID is human-verified, the entry links the record.
- Where it is not, the entry links a **scoped PubMed query**, is labelled *"PubMed
  search, not curated bibliography"*, is not used to justify a high grade, and is
  `reviewRequired`.
- We never invent PMIDs, studies, doses, or conflicts.

## Doses
We report **studied doses** (dose, population, duration, source) — never
"recommended doses". No protocol, no prescription.

## Change control
Grades change only after human review. Material changes carry a visible updated
date and a changelog entry with the reason. **HUMAN EVIDENCE REVIEW REQUIRED**
marks any conclusion still awaiting a person.
