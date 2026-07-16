# Finder Methodology — Nucleo Longevity

> The Finder (price comparator, `/prezzi`) turns editorial trust into a recurring
> utility. This document defines where offer data comes from, how it is compared,
> and the legal/ethical guardrails — especially around scraping and affiliate
> disclosure. Sources: `src/lib/offers.ts`, `content/comparator/*.csv`,
> `src/app/go/[id]/route.ts`.

## What the Finder does
Given a molecule, it lists **offers** (merchant, price, pack size) and computes a
normalised **price-per-dose** so users can compare honestly across pack sizes.
Filters: minimum grade and maximum price. Every outbound click goes through a
safe redirect.

## Where the data comes from (and scraping)
- **No scraping of sources that prohibit it.** We do not scrape marketplaces or
  sites whose terms forbid automated collection.
- Offer data is **CSV-driven** (`content/comparator/merchants.csv`,
  `offers.csv`) and populated from: (a) official **affiliate/product feeds** and
  APIs we are entitled to use, (b) **manual curation**, and (c) merchant-provided
  data. Provenance is a property of the row, not an afterthought.
- **Demo mode** ships sample data (`sample-data/comparator/`) so the feature is
  demonstrable before any real feed is connected.
- Prices are **point-in-time** and shown with a "last updated" expectation; the
  Finder never guarantees current price — the merchant page is authoritative.

## Comparison logic
- **Price-per-dose** normalises price ÷ (servings or doses) so a cheap large pack
  and an expensive small pack are comparable.
- Sorting/filtering is transparent and deterministic; there is **no paid
  re-ranking** that hides a better objective offer. Any sponsored placement, if
  introduced, must be labelled and must not suppress a cheaper honest result.
- Grade and price are shown **side by side** — a good price on an F-grade
  molecule is still an F-grade molecule.

## Outbound redirect guardrails (`/go/[id]`)
- **Allowlist only:** an id resolves to a pre-approved destination or 404s.
- **302 redirect**, **noindex**, `rel` hygiene on links.
- **No PII** in the redirect: no user identifiers, no query-string leakage of
  personal data.
- Affiliate parameters are appended server-side from config, never from user
  input.

## Affiliate disclosure & independence
- The Finder may earn affiliate commission. This is **disclosed** on `/prezzi`
  and `/confronto`.
- Affiliate economics **never** influence a molecule's grade or its ranking in
  the observatory. Editorial and Finder are separated by the same wall as Connect.

## Data hygiene
- Merchant and offer rows are validated on load; malformed rows are dropped, not
  rendered.
- Broken/expired offers should fail safe (hidden), never show a wrong price.

## Roadmap
- Connect real affiliate feeds behind the existing CSV contract.
- Add "price history" and stock signals where a compliant feed provides them.
- Per-market (EU/IT first) offer sets tied to the bilingual routing.
