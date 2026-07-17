# Design System Audit — Nucleo Longevity

> Extracted design tokens and component inventory for the clinical/editorial
> aesthetic. This is the reference for keeping the look consistent and for any
> future token centralisation. The aesthetic is **non-negotiable** (see
> PROJECT-VISION.md).

## Tokens (from `src/app/globals.css`, CSS custom properties)
Theme-aware via `--bg`, `--fg`, `--muted`, `--border`, `--accent`,
`--accent-dark`, `--bg-elev`. Light and dark are both first-class.

- **Accent (teal):** `#11605F` family — used for eyebrows, links, primary CTAs.
- **Gold flag:** `#B5975D` — demo / sponsored markers only (never decorative).
- **Danger:** `#C45C5C` — F grade, safety flags.
- **Borders:** 1px hairline `var(--border)`; radius kept minimal (~2px).

## Type
- **Serif** (Newsreader) — editorial body + display headings.
- **Sans** (Hanken Grotesk) — UI, labels, table text.
- **Mono** (IBM Plex Mono) — micro-labels, eyebrows, tabular numbers.
- Tabular numerals for all counts/prices. Uppercase mono eyebrows with wide
  tracking are the signature label style.

## Grade chips
Single source: `src/components/EvidenceBadge.tsx` — per-grade border/text/bg
colours A→F (teal shades down to gold/red). **Grade is never colour-only**: the
letter is always present (accessibility). Reuse this component everywhere a grade
is shown; do not hand-roll grade colours (an earlier draft used non-existent
`.grade-*` classes — removed).

## Component inventory
| Component | Role | Keep/Adapt |
|---|---|---|
| `Header` / `Footer` | Nav (≤6 primary items + Connect) | Keep |
| `PageHeader` | Eyebrow + serif title + subtitle | Keep — reused across hubs |
| `EvidenceBadge` | A–F chip | Keep — canonical |
| `OfferTable` | Finder offers | Keep |
| `Wordmark` | Logo | Keep |
| `Reveal` | Light entrance motion | Keep (respect reduced-motion) |
| `DatabaseClient` / `DirectoryClient` / `PricesHubClient` | Client filter tables | Keep — same filter idiom |

## Forbidden (enforced)
No gradients, glow, decorative blur, glassmorphism, soft shadows, Inter, emoji in
UI, fake brand logos, stock medical photos, 3D DNA/cells, generic SaaS
dashboards, over-rounded cards, heavy decorative animation.

## Consistency rules for new pages
1. Start from `PageHeader` (eyebrow / serif title / subtitle).
2. Sections led by a mono uppercase accent label.
3. Hairline `border-[var(--border)]` dividers; `card-surface` for cards.
4. Filters use the shared `sel` input style seen in the client tables.
5. Demo/sponsored → gold chip; verification → neutral bordered chip; never merge
   the two.
6. Style both light and dark; wide tables scroll inside `overflow-x:auto`.
