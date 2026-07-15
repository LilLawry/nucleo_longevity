# Third-party services register

Purpose: transferability. For each service: owner, plan, cost, role,
transferability, hand-over, dependencies, export, lock-in. **Fill owner/plan/cost
with real values — do not invent.** `DATA NOT AVAILABLE` where unknown to the repo.

> Secrets never live in the repo. Env vars live only in Vercel project settings.

| Service | Role | Account owner | Plan | Cost | Transferable? | Hand-over | Export | Lock-in |
|---|---|---|---|---|---|---|---|---|
| **Vercel** | Hosting/deploy/DNS | DATA NOT AVAILABLE (likely personal) | DATA NOT AVAILABLE | DATA NOT AVAILABLE | Yes (transfer project/team) | Transfer project to buyer team, or redeploy repo | Repo is source of truth | Low (any Node host) |
| **GitHub** | Source repo | `LilLawry` (Observed) | DATA NOT AVAILABLE | DATA NOT AVAILABLE | Yes (transfer repo) | Transfer repo ownership | `git` clone | Low |
| **Domain** `nucleolongevity.com` | Brand/URL | DATA NOT AVAILABLE (registrar unknown) | — | DATA NOT AVAILABLE | Yes | Registrar transfer (auth code) | — | Low, but critical asset |
| **Resend** | Newsletter email | `lorenzogennai99` (Observed from screenshot) | DATA NOT AVAILABLE | DATA NOT AVAILABLE | Partial | Recreate under project account; move audience | Audience export (Resend) | Med (rewire) |
| **Plausible** | Analytics | DATA NOT AVAILABLE (env not confirmed) | — | — | Yes | Add buyer as owner | CSV/stats export | Low |
| **Google Search Console** | SEO data | DATA NOT AVAILABLE (not confirmed live) | free | 0 | Yes | Add buyer as owner/property | Performance export | Low |
| **PubMed / NCBI** | Source links | Public | — | 0 | n/a | n/a | n/a | None |
| **Affiliate networks** (Awin/Amazon/…) | Future revenue | NOT YET (no accounts) | — | — | Often NON-transferable | Buyer re-applies | Feeds re-map | HIGH (approvals are per-owner) |

## Recommendations (transferability)
1. **Move to project-dedicated accounts** where reasonable (a `nucleo` Google
   account owning Search Console/Analytics/Resend), so the sale doesn't hinge on
   the founder's personal logins. `LEGAL/OPS ACTION`.
2. **Register the domain owner clearly** and keep the registrar + auth-code
   process documented in the (private) data room.
3. **Affiliate accounts are usually NOT transferable** — record this as a real
   deal risk; a buyer typically re-applies. Note it in RISK-REGISTER.
4. Keep this register updated whenever a service is added/changed.
