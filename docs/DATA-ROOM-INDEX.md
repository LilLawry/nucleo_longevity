# Data-room index (structure only — sensitive files stay OUT of the repo)

The actual documents live in `private-data-room/` (git-ignored) or an external
secure store. This index defines the structure and what belongs where. Populate
with **real** documents only; never place secrets/financials in the public repo.

```
private-data-room/
├── 01_CORPORATE/            # entity, ownership, registrations  [LEGAL REVIEW REQUIRED]
├── 02_IP_AND_BRAND/         # trademark search/filings, logo/font licences, IP assignments
├── 03_PRODUCT/              # product overview, roadmap, screenshots, SOPs
├── 04_TECHNOLOGY/           # architecture, deploy runbook, security, dependencies, backups
├── 05_CONTENT_AND_DATA/     # content inventory, provenance, taxonomy, DB export
├── 06_TRAFFIC_AND_AUDIENCE/ # Search Console exports, analytics, newsletter stats
├── 07_FINANCIALS/           # P&L, invoices/receipts, software costs, revenue records
├── 08_CONTRACTS/            # any supplier/partner agreements
├── 09_AFFILIATES_AND_MERCHANTS/ # network approvals, feed agreements, terms
├── 10_CONNECT_AND_B2B/      # directory listings, leads, agreements
├── 11_PRIVACY_AND_LEGAL/    # privacy policy, DPA, consent records, cookie policy
├── 12_SECURITY/             # security posture, incident log
├── 13_OPERATIONS/           # SOPs, vendor list, calendars
├── 14_TEAM_AND_CONTRIBUTORS/# roles, contributor IP assignments
├── 15_RISKS/                # risk register (copy)
└── 16_DEAL_PREPARATION/     # exit-readiness scorecard history, buyer map, valuation notes
```

## Rules
- `private-data-room/` is in `.gitignore` (done). Never commit its contents.
- Every document: dated, source-attributed, marked verified/unverified.
- Financials/traffic: only **real** figures with source exports. `DATA NOT
  AVAILABLE` otherwise — never invent.
- Legal/tax/IP items carry `LEGAL/TAX REVIEW REQUIRED` until a professional signs off.

## Mapping to in-repo (public) docs
Public, non-sensitive scaffolding already in `docs/`: implementation plan,
audits, exit-readiness scorecard, third-party register, buyer map, IP register,
site overview, strategic review. Sensitive evidence for each goes into the
matching `private-data-room/` folder.
