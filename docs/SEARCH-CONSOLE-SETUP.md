# Search Console Setup

> Operator guide to get Nucleo Longevity indexed cleanly. Most steps are in
> Google's dashboard (**HUMAN ACTION REQUIRED**); the repo already ships the
> feeds they need.

## What the repo already provides
- `src/app/sitemap.ts` → `/sitemap.xml` (all indexable routes + molecule pages;
  demo Connect profiles, `/go/[id]`, and noindex demo routes are excluded).
- `robots.txt` and `rss.xml`.
- Per-page `canonical` + `hreflang` (en / it / x-default).
- Open Graph + per-entry OG images.
- Structured data where justified (Article, Organization, DefinedTerm, ItemList).
  **No** fake AggregateRating/Review; **no** MerchantListing (we don't sell); the
  A–F grade is never emitted as a commercial rating.

## Operator steps
1. Add the property (Domain property `nucleolongevity.com`) in Google Search
   Console.
2. Verify via DNS TXT record. **HUMAN ACTION REQUIRED.**
3. Submit `https://www.nucleolongevity.com/sitemap.xml`.
4. Request indexing for the homepage and the 15 pillar entries first.
5. Check Coverage for: excluded-by-noindex (expected on demo Connect profiles,
   professionals, opportunities), duplicate canonical, hreflang errors.
6. Repeat for Bing Webmaster Tools if desired.

## Indexing policy (already enforced in code)
- Molecule entries index when frontmatter `index: true` (53/54 today).
- Connect company/professional profiles index only when `!demo && verified`.
- Opportunities & professionals list pages are noindex while demo.
- The stricter YMYL gate (index only `reviewStatus === "verified"`) is staged in
  `src/lib/molecole.ts` and can be switched on with the pillar-verification pass.

## Reports to keep an eye on
Orphan pages, hreflang mismatches, duplicate metadata, broken links. Re-run after
each significant content change.
