# Security — Nucleo Longevity

> Security posture for a static-first Next.js 14 app on Vercel with a few server
> endpoints (subscribe, confirm, connect, contribute) and one outbound redirect.

## Secrets
- All secrets (Resend key, affiliate IDs) live in **Vercel env vars**, never in
  the repo, never in client bundles, never in logs.
- Any secret that has ever left the dashboard (e.g. pasted in chat) must be
  **rotated**.
- Server-only code reads secrets; nothing sensitive is exposed to the client.

## Input handling
- Form inputs validated with **Zod** on the server (subscribe/connect/contribute).
- **Honeypot** field + **rate limiting** on form endpoints.
- No `dangerouslySetInnerHTML` on untrusted input; MDX is repo-authored content.

## Outbound redirect (`/go/[id]`)
- **Allowlist only** — no open redirect. Unknown id → 404.
- 302, noindex, no PII in the URL.

## Redirect / SSRF / injection
- No user-controlled server-side fetches to arbitrary URLs.
- Affiliate params are appended from server config, not from user input.

## Headers / CSP
- Security headers and a documented Content-Security-Policy should be set at the
  Vercel/Next config layer. **LEGAL REVIEW REQUIRED / HARDENING TODO:** document
  the exact CSP before commercial launch; artifacts elsewhere use a strict CSP as
  the reference posture (self + inlined assets, no third-party hosts).

## Data minimisation
- No health data collected (see PRIVACY.md).
- Connect forms collect only professional/business fields.
- No personal data in application logs.

## Dependencies
- Keep `next`, `zod`, and tooling patched. Prefer server components; avoid heavy
  libraries for simple needs to shrink attack surface.

## Incident basics
- Rotate the affected secret first.
- Redeploy from a known-good commit on `main`.
- Note the event and the fix in the changelog / data room.
