# Affiliate Integration — Nucleo Finder

> How affiliate/offer data enters the Finder and how outbound clicks are handled.
> See also FINDER-METHODOLOGY.md. Principle: **commission never influences
> ranking or evidence.**

## Data flow
```
authorised feed / API / manual curation
  → content/comparator/merchants.csv + offers.csv (validated on load)
  → src/lib/offers.ts (repository: getOffersForMolecule, NKF_DEMO_MODE)
  → OfferTable / PricesHubClient (render, price-per-unit, ranking)
  → /go/[id] (safe outbound redirect)
```

## Sources allowed
- Official **affiliate feeds** and product **APIs** we are entitled to use.
- **Manual curation** with recorded provenance.
- Merchant-provided data under agreement.
- **No scraping** of sources that prohibit it. **AGREEMENT REQUIRED** before any
  real merchant/affiliate feed is switched on.

## Demo mode
`NKF_DEMO_MODE` ships fictional sample offers (`sample-data/comparator/`) so the
Finder is demonstrable before any real feed exists. Demo offers are labelled.

## Outbound redirect (`src/app/go/[id]/route.ts`)
- **Allowlist only** — unknown id → 404, never an open redirect.
- **302**, **noindex**, `rel` hygiene.
- **No PII** in the URL; affiliate params appended server-side from config.

## Ranking rules (must hold)
- Sort by relevance + price. **Never** by commission.
- A cheaper non-affiliate offer is never hidden or demoted.
- Any sponsored placement (future) must be labelled and must not suppress a
  cheaper honest result.

## Disclosure
Affiliate earning is disclosed on `/prezzi`, `/confronto`, and
`/funding-and-affiliations`. The editorial grade is independent of all of it.

## To connect a real programme (checklist)
1. Confirm the programme's terms permit our use (**AGREEMENT REQUIRED**).
2. Map its feed to the `merchants.csv` / `offers.csv` columns.
3. Store affiliate IDs in **Vercel env vars**, never in the repo.
4. Keep demo rows out of production once real data lands; flip `NKF_DEMO_MODE`.
5. Re-verify `/go/[id]` allowlist covers only approved destinations.
