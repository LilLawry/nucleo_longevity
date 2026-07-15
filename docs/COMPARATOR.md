# Nucleo price comparator ("Where to buy")

A lightweight, ethics-first offer comparator adapted from the Núkleoskin
Finder brief and fitted to the existing Next.js site (no WordPress, no
WooCommerce, no cart/checkout).

## What it does
On each molecule page, a **"Where to buy"** table compares seller offers for
that molecule by **price and availability**, and links out via a safe
redirect. It is currently in **DEMO mode** with clearly-labelled fictional
offers.

## Files
- `src/lib/offers.ts` — data + logic. `NKF_DEMO_MODE`, `Merchant`/`Offer`
  types, seed demo data, `ALLOWED_DOMAINS`, `getOffersForMolecule()` (organic
  ranking), unit-price + total-price computation, `isAllowedOfferUrl()`.
- `src/components/OfferTable.tsx` — the table UI + disclosure + demo badge.
- `src/app/go/[id]/route.ts` — outbound redirect (302, allowlist, noindex,
  no-referrer, minimal non-PII click log).
- Rendered from `src/app/[lang]/molecule/[slug]/page.tsx`.

## Non-negotiable rules enforced
- **No scraping.** Offers come only from the seed file today; later from
  authorised feeds / manual entry.
- **Ranking never uses commission.** Sort = active-first → total price (or
  base price when shipping unknown) → most recently sourced.
- **No invented commissions.** `Merchant.affiliate` defaults to `false`; while
  false, links are plain external links and the disclosure says exactly that.
  Set `affiliate: true` ONLY where a real contract exists (`AFFILIATE
  AGREEMENT REQUIRED`).
- **No open redirect.** `/go/[id]` only forwards to hosts in `ALLOWED_DOMAINS`.
- **Every offer has `sourcedAt`.** Prices are shown as indicative.
- **Stale offers** are de-emphasised and labelled "price to verify", never
  shown as a firm price.
- `/go/` is disallowed in `robots.txt` and returns `X-Robots-Tag: noindex`.
- Click log is minimised: offer/molecule/merchant/timestamp only — no IP, no
  query, no PII.

## Going live with real offers
1. Add real merchants to `SEED_MERCHANTS` (or move to a DB/feed) and their
   domains to `ALLOWED_DOMAINS`.
2. Add real offers with a real `sourcedAt`; keep `affiliate: false` until a
   signed program exists, then set the affiliate URL + `affiliate: true`.
3. Set `NKF_DEMO_MODE = false` to drop the demo labelling.
4. (v2) Replace the seed arrays with an authorised CSV/XML/JSON/API feed
   importer; the components and `/go` redirect stay unchanged.

## Deliberately NOT in v1
Cart/checkout/payments, user accounts, price alerts, sponsored placements,
feed auto-import, medical claims — all out of scope by design.
