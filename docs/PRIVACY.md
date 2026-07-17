# Privacy (by design) — Nucleo Longevity

> Internal privacy-by-design note. This is not the public privacy policy
> (`/[lang]/privacy`) — it records the design decisions behind it.
> **LEGAL REVIEW REQUIRED** before commercial launch.

## Data we do NOT collect
No health data of any kind: no diagnoses, therapies, photographs, medications
taken, biometrics, or medical history. The Report Card is educational and
non-diagnostic; it stores nothing about the reader.

## Data we do collect (minimal)
- **Newsletter:** email + language, with **double opt-in** (Resend). Purpose:
  sending the weekly review. Unsubscribe in every email.
- **Connect Join / contact:** only professional/business fields — name,
  organisation, role, professional email, website, country, category,
  description, reason, privacy consent. No health data.
- **Contribute:** professional contact details for editorial collaboration.

## Legal bases (GDPR)
- Newsletter: consent (double opt-in), withdrawable.
- Connect/contribute: consent + legitimate interest in B2B curation.
Records of consent are kept; data is not sold.

## Processors
- **Resend** (email delivery) — DPA applies. Domain-verified sender.
- **Vercel** (hosting/edge) — EU-relevant configuration to be confirmed.
- **Plausible** (analytics, if enabled) — cookieless, no personal profiling.

## Retention & rights
- Keep only as long as needed for the stated purpose.
- Access / rectification / erasure / portability honoured on request.
- No profiling, no automated decisions with legal effect.

## Security link
See SECURITY.md — no PII in logs, secrets in env vars only, forms validated +
rate-limited.

## Open items (LEGAL REVIEW REQUIRED)
- Confirm processor list + international transfer safeguards.
- Finalise cookie/analytics banner behaviour.
- Align the public `/privacy` page wording with this note and counsel review.
