# Deployment — Nucleo Longevity

> How the site is built and shipped. Next.js 14 (App Router) on Vercel.

## Environments
- **Production:** `main` → https://www.nucleolongevity.com (auto-deploy on push).
- **Preview:** every branch / PR gets a Vercel preview URL.
- Work happens on feature branches (e.g. `claude/retention-ui-improvements-*`),
  merged `--no-ff` into `main`.

## Build
```bash
npm install
npm run build      # next build — must pass (TypeScript strict + ESLint)
```
The build prerenders all static routes + molecule/company/professional pages and
generates the sitemap. A red build must never be merged to `main`.

## Pre-merge gate
1. `npm run build` green.
2. Molecule frontmatter validator: 0 warnings (all 54 entries).
3. Manual/spot check of the changed routes on a preview or locally.
4. Demo data stays labelled; noindex holds on demo Connect profiles.

## Env vars (Vercel → Settings → Environment Variables)
`RESEND_API_KEY`, `RESEND_AUDIENCE_ID`, `NEWSLETTER_FROM`, `SITE_URL`, affiliate
IDs. Never commit these; set for Production + Preview. Redeploy after changes.

## Release flow (what has been used this program)
```bash
git checkout -b <branch>            # or reuse the designated branch
# ...edits...
npm run build                       # verify
git commit -m "…"
git push -u origin <branch>
git checkout main && git pull origin main
git merge --no-ff <branch>
git push origin main                # triggers production deploy
```
Then verify live routes return 200 (edge propagation ~1–2 min).

## Rollback
Redeploy a previous good deployment in the Vercel dashboard, or
`git revert` the offending commit on `main` and push.

## Notes
- The container/session is ephemeral — commit + push anything worth keeping.
- Do not migrate to WordPress/WooCommerce; do not add a DB until the repository
  interfaces prove it necessary.
