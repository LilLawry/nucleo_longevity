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

## Going live with real offers (no code)
Data is loaded from two CSV files: `content/comparator/merchants.csv` and
`content/comparator/offers.csv`. While they're absent, a labelled DEMO dataset
is shown. Add the files and the demo badge disappears automatically
(`NKF_DEMO_MODE` is derived from their presence).

1. Join an affiliate network (Awin/Tradedoubler/Webgains), Amazon Associates,
   or a direct brand deal — no scraping.
2. Download the merchant **product feed** (CSV/XML): it already contains price,
   EAN, image (with rights) and your affiliate deep-link.
3. Map its columns to the schema in `content/comparator/README.md`, save as
   `offers.csv` / `merchants.csv`, commit. The `ALLOWED_DOMAINS` allowlist is
   derived automatically from `domain` + `link_domains`.
4. Set `affiliate: true` on a merchant ONLY where a signed program exists
   (`AFFILIATE AGREEMENT REQUIRED`); otherwise links stay plain external.

Templates: `sample-data/comparator/`. Full column reference:
`content/comparator/README.md`.

## Deliberately NOT in v1
Cart/checkout/payments, user accounts, price alerts, sponsored placements,
feed auto-import, medical claims — all out of scope by design.
