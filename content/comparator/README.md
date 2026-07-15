# Where to put your comparator data

The "Where to buy" tables on molecule pages read **two CSV files in this
folder**:

- `merchants.csv` — the sellers
- `offers.csv` — one row per price/offer

While these files are **absent**, the site shows a small **DEMO** dataset with
a "demo" badge. The moment both files exist with real rows, the demo badge
disappears and your data goes live.

## 1. `merchants.csv`

```
id,name,domain,link_domains,ships_to_italy,affiliate
mymerchant,My Merchant Srl,mymerchant.it,awin1.com,true,false
```

- `domain` — the seller's site (also used to allow outbound links).
- `link_domains` — **optional**, pipe-separated extra hosts your outbound
  links may use, e.g. an affiliate network tracker `awin1.com`. Without this,
  an affiliate deep-link on a different host would be blocked by the redirect.
- `affiliate` — set to `true` **only** if you have a signed program with that
  merchant. `false` = plain external link, and the disclosure says so.

## 2. `offers.csv`

```
id,molecule_slug,merchant_id,product_title,price,currency,shipping,url,size_value,size_unit,status,sourced_at
mymerchant-nmn-1,nmn,mymerchant,NMN 500 mg 60 caps,32.90,EUR,4.90,https://mymerchant.it/nmn-500,60,caps,active,2026-07-15
```

- `molecule_slug` — must match a molecule file in `content/molecules/`
  (e.g. `nmn`, `creatine`, `magnesium`, `omega-3`, `vitamin-d`, `spermidina`).
- `shipping` — leave **empty** if unknown (shown as "to verify").
- `size_value` + `size_unit` (`g`, `ml`, `caps`, `servings`) → drives the
  €/100 g or €/cap unit price. Optional.
- `status` — `active`, `stale` (shown greyed, "price to verify") or
  `unavailable` (hidden + not redirectable).
- `sourced_at` — the date you recorded the price (YYYY-MM-DD).
- If `affiliate = true` on the merchant, put your **affiliate deep-link** in
  `url`; otherwise put the normal product URL.

## Where the data comes from (legally — no scraping)

1. Join an affiliate network (**Awin, Tradedoubler, Webgains**), **Amazon
   Associates** (PA-API), or sign a direct deal with a brand.
2. Download that merchant's **product feed** (CSV/XML) — it already contains
   price, EAN, image (with usage rights) and your affiliate deep-link.
3. Map its columns to the columns above, save here as `offers.csv` /
   `merchants.csv`, commit → the site rebuilds and offers go live.

Start with templates in `sample-data/comparator/`.
`AFFILIATE AGREEMENT REQUIRED` before setting any `affiliate = true`.
