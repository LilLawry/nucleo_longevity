# Newsletter Setup — Resend

> How the double-opt-in newsletter is wired, and what the operator must do in the
> Resend dashboard. No real emails are used in tests; secrets live only in Vercel
> env vars, never in the repo.

## Promise
"One review a week: new evidence, grade changes and analysis — no hype."
EN and IT variants. No dark patterns, no aggressive popups.

## Code
- Subscribe endpoint: `src/app/api/subscribe` (server action / route).
- Confirm endpoint: `src/app/api/confirm` (double opt-in).
- Form placements: homepage, molecule pages, Evidence, Analysis, Report Card,
  Finder, Connect.
- Protections: Zod validation, honeypot, rate limit, error handling, no PII in
  logs.

## Environment variables (set in Vercel → Project → Settings → Environment
Variables — never commit)
- `RESEND_API_KEY` — server-side only.
- `RESEND_AUDIENCE_ID` — target audience (optional if using tags).
- `NEWSLETTER_FROM` — verified sender, e.g. `Nucleo <hello@nucleolongevity.com>`.
- `SITE_URL` — for confirmation links.

> A Resend API key was once pasted into chat during setup. **Rotate any key that
> has ever left the dashboard.** Keys belong only in Vercel env vars.

## Operator steps (Resend dashboard)
1. Create the account / project.
2. **Verify the domain** `nucleolongevity.com` (DKIM/SPF/DMARC DNS records).
   Until verified, delivery is unreliable. **HUMAN ACTION REQUIRED.**
3. Create the audience; copy its id → `RESEND_AUDIENCE_ID`.
4. Create an API key → `RESEND_API_KEY` in Vercel (Production + Preview).
5. Set `NEWSLETTER_FROM` to a verified sender on the domain.
6. Redeploy so the functions pick up the vars.

## Testing
Use Resend's test mode / a seed inbox. Never send to real user addresses in test.
Mock the client in unit tests.

## Future segmentation
Minimal segments: **Inside**, **Outside / Skin**, **Industry / Connect** — wire as
tags when volume justifies it.
