# NUCLEO CONNECT — Product Spec

> Connect is a **curated B2B directory + digital fair** for the longevity
> ecosystem. It is deliberately **not** a marketplace. This spec defines scope,
> guardrails, and the MVP that currently ships.

## Purpose
Turn the observatory's independent, evidence-literate position into a trusted
place where the supply side of longevity (manufacturers, labs, CDMOs, ingredient
and packaging suppliers, testing/regulatory providers, distributors, retailers,
clinics, services) is **discoverable and comparable** — and where curated,
mediated introductions can happen.

## Hard guardrails (non-negotiable)
- **No accounts, no login, no payments, no orders, no checkout.**
- **No auto-publishing.** Every listing is manually reviewed before it appears.
- **Curated, not transactional.** Connect mediates introductions; it never
  handles a transaction between parties.
- **Sponsored ≠ verified.** Commercial status and verification status are
  orthogonal and always shown separately. A paid profile is never implied to be
  trustworthy because it paid.
- **No health data.** Only professional/business data is collected.
- **Editorial independence.** Presence or spend in Connect never affects any
  molecule grade.
- **Mediated contact only.** No personal emails are exposed; contact happens via
  a "request an introduction" form.

## MVP (shipped)
- **Directory** (`/connect/directory`): searchable, filterable by organisation
  type and country. Cards show verification chip, sponsored chip (when
  applicable), and a demo chip.
- **Company profile** (`/connect/companies/[slug]`): declared fields (markets,
  categories, services, MOQ, declared certifications with sources, languages,
  last-checked date), mediated contact, related molecule entries. Demo/unverified
  profiles are **noindex**.
- **Join** (`/connect/join`): application form (organisation, role, website,
  country, category, reason). Manual review; no auto-publish.
- **Overview** (`/connect`): explains the model + independence disclosure.
- All seed companies are **fictional demo data** (`NKF_CONNECT_DEMO = true`),
  clearly labelled.

## Verification model
`unverified → selfDeclared → sourceChecked → verifiedPartner`.
Verification describes **what we checked**, transparently:
- **self-declared:** the company stated it; we did not check.
- **source-checked:** we found an independent source for key claims.
- **verified partner:** an agreement and identity check exist.
Certifications are shown as **declared** with optional sources — never asserted
as fact without a source.

## Roadmap (not built yet)
- `/connect/professionals` — individual professional profiles (formulators,
  reps, regulatory consultants), same guardrails.
- `/connect/expo` — the "digital fair": time-boxed themed showcases.
- `/connect/opportunities` — curated briefs (a distributor seeks X; a lab offers
  capacity Y), mediated only.
- Real (non-demo) verified profiles, which flips them indexable.

## Success = trust, not volume
Connect is judged by the quality and independence of what it surfaces, not by
listing count. A small, genuinely-verified directory beats a large unvetted one.
