# NUCLEO CONNECT — Data Model

> The Connect data layer is **Zod-validated** and exposed through a **repository
> interface** so it can migrate from in-repo seed data to a database or API
> without rewriting any page. Source: `src/lib/connect.ts`.

## Design principles
- **Validate at the boundary.** Every profile is parsed through a Zod schema at
  module load; malformed data fails fast, never renders.
- **Repository pattern.** Pages call `getCompanies()` / `getCompanyBySlug()` /
  `getCompanyCountries()` / `getCompanyTypes()` — never the raw array. Swapping
  the backing store means reimplementing those functions only.
- **Demo-safe by construction.** `NKF_CONNECT_DEMO = true` and every seed record
  carries `demo: true`; profile pages force noindex unless a record is both
  non-demo and `verified`.

## Enums
- **OrganisationType:** `manufacturer`, `brand`, `laboratory`, `cdmo`,
  `ingredientSupplier`, `packagingSupplier`, `testingProvider`,
  `regulatoryProvider`, `softwareProvider`, `researchOrganisation`, `clinic`,
  `retailer`, `distributor`, `investor`, `publisher`, `other`.
- **VerificationStatus:** `unverified`, `selfDeclared`, `sourceChecked`,
  `verifiedPartner`.
- **CommercialStatus:** `organic`, `sponsored`, `premium`.
- **EditorialStatus:** `draft`, `reviewRequired`, `reviewed`, `verified`,
  `updateRequired`, `archived`.

## CompanyProfile (fields)

| Field | Type | Notes |
|---|---|---|
| `slug` | string | Stable URL id. |
| `locale` | `en` \| `it` | Default `en`. |
| `name` | string | Display name (demo names suffixed "(demo)"). |
| `demo` | boolean | Default `true`. Forces noindex. |
| `organisationType` | OrganisationType[] | ≥1. |
| `description` | string | Short profile. |
| `country` / `cities` | string / string[] | ISO-ish country + optional cities. |
| `foundedYear` | int | Optional. |
| `website` | url | Optional; rendered `rel="nofollow noopener"`. |
| `marketsServed` / `categories` / `services` / `products` | string[] | Declared. |
| `minimumOrderQuantity` | string | Declared MOQ. |
| `certificationsDeclared` / `certificationSources` | string[] | Declared + sources. |
| `languages` | string[] | Optional. |
| `verificationStatus` | VerificationStatus | Default `unverified`. |
| `commercialStatus` | CommercialStatus | Default `organic`. |
| `lastCheckedAt` | string | ISO date of last review. |
| `contactMode` | `external` \| `mediatedForm` | Default `mediatedForm`. |
| `relatedEntries` | string[] | Molecule slugs; joined to entries at render. |
| `status` | EditorialStatus | Editorial lifecycle. Default `draft`. |

## Repository interface (current)
```ts
getCompanies(): CompanyProfile[]
getCompanyBySlug(slug: string): CompanyProfile | undefined
getCompanyCountries(): string[]
getCompanyTypes(): OrganisationType[]
```
Plus label maps `ORG_TYPE_LABEL` and `VERIFICATION_LABEL` for presentation.

## Migration path
1. **Now:** in-repo `RAW` array → `CompanyProfile.parse` → `COMPANIES`.
2. **Next:** move seed to `content/connect/*.json`, parse the same schema.
3. **Later:** back the four repository functions with a DB/API; the schema is the
   contract, pages don't change.

## Invariants enforced in code
- A profile only indexes if `!demo && status === "verified"`.
- Sponsored is rendered from `commercialStatus`, verification from
  `verificationStatus` — never merged into one badge.
- Related molecule entries are resolved via `getMoleculeBySlug` and silently
  dropped if missing, so a bad slug never breaks a page.
