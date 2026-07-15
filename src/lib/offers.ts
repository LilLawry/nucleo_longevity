/**
 * offers.ts — the price/availability comparator data layer for Nucleo.
 *
 * Ethics baked in (adapted from the Núkleoskin Finder spec):
 *  - NO scraping. Offers come only from this seed file today; later from
 *    authorised merchant feeds / manual entry. Everything here is DEMO data.
 *  - Ranking is by price/availability ONLY, never by affiliate commission.
 *  - We never claim a commission from a merchant we have no contract with:
 *    `affiliate` defaults to false, so links are plain external links.
 *  - Every offer carries a `sourcedAt` date; prices are indicative and must
 *    be verified on the merchant's site.
 *  - The redirect endpoint (/go/[id]) only sends users to domains on
 *    ALLOWED_DOMAINS, preventing open redirects.
 *
 * When real feeds arrive, replace SEED_OFFERS / SEED_MERCHANTS (or load them
 * from a DB) — the components and redirect logic stay the same.
 */

/** Master switch. Demo data is clearly labelled in the UI while this is true. */
export const NKF_DEMO_MODE = true;

export type OfferStatus = "active" | "stale" | "unavailable";
export type SizeUnit = "g" | "ml" | "caps" | "servings";

export interface Merchant {
  id: string;
  name: string;
  domain: string;
  shipsToItaly: boolean;
  /** true ONLY where a real affiliate contract exists. Demo: always false. */
  affiliate: boolean;
}

export interface Offer {
  id: string;
  moleculeSlug: string;
  merchantId: string;
  productTitle: string;
  price: number;
  currency: "EUR";
  /** null = shipping unknown → total is not calculable, shown as such. */
  shipping: number | null;
  url: string;
  size?: { value: number; unit: SizeUnit };
  status: OfferStatus;
  /** ISO date the price was recorded/verified. */
  sourcedAt: string;
}

/** Domains the /go redirect is allowed to send users to (anti open-redirect). */
export const ALLOWED_DOMAINS = ["example.com", "example.org", "example.net"];

/** DEMO merchants — fictional, reserved example.* domains, no real brands. */
const SEED_MERCHANTS: Merchant[] = [
  { id: "demo-a", name: "Demo Store A", domain: "example.com", shipsToItaly: true, affiliate: false },
  { id: "demo-b", name: "Demo Store B", domain: "example.org", shipsToItaly: true, affiliate: false },
  { id: "demo-c", name: "Demo Store C", domain: "example.net", shipsToItaly: false, affiliate: false },
];

/** DEMO offers — illustrative prices only. Not real products or prices. */
const SEED_OFFERS: Offer[] = [
  // NMN
  { id: "nmn-a", moleculeSlug: "nmn", merchantId: "demo-a", productTitle: "NMN 500 mg — 60 caps (demo)", price: 34.9, currency: "EUR", shipping: 3.9, url: "https://example.com/nmn", size: { value: 60, unit: "caps" }, status: "active", sourcedAt: "2026-07-10" },
  { id: "nmn-b", moleculeSlug: "nmn", merchantId: "demo-b", productTitle: "NMN 500 mg — 60 caps (demo)", price: 29.9, currency: "EUR", shipping: null, url: "https://example.org/nmn", size: { value: 60, unit: "caps" }, status: "active", sourcedAt: "2026-07-09" },
  { id: "nmn-c", moleculeSlug: "nmn", merchantId: "demo-c", productTitle: "NMN 500 mg — 90 caps (demo)", price: 44.0, currency: "EUR", shipping: 6.0, url: "https://example.net/nmn", size: { value: 90, unit: "caps" }, status: "stale", sourcedAt: "2026-05-30" },
  // Creatine
  { id: "cr-a", moleculeSlug: "creatine", merchantId: "demo-a", productTitle: "Creatine monohydrate — 300 g (demo)", price: 19.9, currency: "EUR", shipping: 3.9, url: "https://example.com/creatine", size: { value: 300, unit: "g" }, status: "active", sourcedAt: "2026-07-10" },
  { id: "cr-b", moleculeSlug: "creatine", merchantId: "demo-b", productTitle: "Creatine monohydrate — 500 g (demo)", price: 26.5, currency: "EUR", shipping: 0, url: "https://example.org/creatine", size: { value: 500, unit: "g" }, status: "active", sourcedAt: "2026-07-08" },
  // Magnesium
  { id: "mg-a", moleculeSlug: "magnesium", merchantId: "demo-b", productTitle: "Magnesium glycinate — 120 caps (demo)", price: 15.9, currency: "EUR", shipping: null, url: "https://example.org/magnesium", size: { value: 120, unit: "caps" }, status: "active", sourcedAt: "2026-07-07" },
  { id: "mg-b", moleculeSlug: "magnesium", merchantId: "demo-a", productTitle: "Magnesium glycinate — 90 caps (demo)", price: 12.9, currency: "EUR", shipping: 3.9, url: "https://example.com/magnesium", size: { value: 90, unit: "caps" }, status: "active", sourcedAt: "2026-07-10" },
  // Omega-3
  { id: "o3-a", moleculeSlug: "omega-3", merchantId: "demo-a", productTitle: "Omega-3 EPA/DHA — 120 softgels (demo)", price: 22.0, currency: "EUR", shipping: 3.9, url: "https://example.com/omega3", size: { value: 120, unit: "caps" }, status: "active", sourcedAt: "2026-07-10" },
  { id: "o3-b", moleculeSlug: "omega-3", merchantId: "demo-b", productTitle: "Omega-3 EPA/DHA — 90 softgels (demo)", price: 18.5, currency: "EUR", shipping: null, url: "https://example.org/omega3", size: { value: 90, unit: "caps" }, status: "active", sourcedAt: "2026-07-06" },
  // Vitamin D
  { id: "vd-a", moleculeSlug: "vitamin-d", merchantId: "demo-b", productTitle: "Vitamin D3 1000 IU — 180 caps (demo)", price: 9.9, currency: "EUR", shipping: null, url: "https://example.org/vitamin-d", size: { value: 180, unit: "caps" }, status: "active", sourcedAt: "2026-07-05" },
  { id: "vd-b", moleculeSlug: "vitamin-d", merchantId: "demo-a", productTitle: "Vitamin D3 2000 IU — 120 caps (demo)", price: 11.9, currency: "EUR", shipping: 3.9, url: "https://example.com/vitamin-d", size: { value: 120, unit: "caps" }, status: "active", sourcedAt: "2026-07-10" },
  // Spermidine
  { id: "sp-a", moleculeSlug: "spermidina", merchantId: "demo-a", productTitle: "Spermidine wheat-germ extract — 60 caps (demo)", price: 39.9, currency: "EUR", shipping: 3.9, url: "https://example.com/spermidine", size: { value: 60, unit: "caps" }, status: "active", sourcedAt: "2026-07-10" },
];

const MERCHANTS = new Map(SEED_MERCHANTS.map((m) => [m.id, m]));

export function getMerchant(id: string): Merchant | undefined {
  return MERCHANTS.get(id);
}

export function getOfferById(id: string): Offer | undefined {
  return SEED_OFFERS.find((o) => o.id === id);
}

export interface ComputedOffer extends Offer {
  merchant: Merchant;
  total: number | null; // price + shipping, null when shipping unknown
  totalCalculable: boolean;
  perUnit: { label: string; value: number } | null; // €/serving or €/100 g etc.
}

function perUnit(o: Offer): ComputedOffer["perUnit"] {
  if (!o.size) return null;
  const { value, unit } = o.size;
  if (value <= 0) return null;
  if (unit === "caps" || unit === "servings") return { label: unit === "caps" ? "€/cap" : "€/dose", value: o.price / value };
  if (unit === "g") return { label: "€/100 g", value: (o.price / value) * 100 };
  if (unit === "ml") return { label: "€/100 ml", value: (o.price / value) * 100 };
  return null;
}

/**
 * Offers for a molecule, ranked ORGANICALLY: active first, then by total
 * price when calculable (else base price), then most recently sourced.
 * Affiliate status is never a ranking input.
 */
export function getOffersForMolecule(slug: string): ComputedOffer[] {
  const rows = SEED_OFFERS.filter((o) => o.moleculeSlug === slug).map((o): ComputedOffer => {
    const merchant = MERCHANTS.get(o.merchantId)!;
    const totalCalculable = o.shipping !== null;
    const total = totalCalculable ? +(o.price + (o.shipping ?? 0)).toFixed(2) : null;
    return { ...o, merchant, total, totalCalculable, perUnit: perUnit(o) };
  });

  const statusRank: Record<OfferStatus, number> = { active: 0, stale: 1, unavailable: 2 };
  rows.sort((a, b) => {
    if (statusRank[a.status] !== statusRank[b.status]) return statusRank[a.status] - statusRank[b.status];
    const av = a.total ?? a.price;
    const bv = b.total ?? b.price;
    if (av !== bv) return av - bv;
    return b.sourcedAt.localeCompare(a.sourcedAt);
  });
  return rows;
}

/** True if the offer's URL host is allowed (used by the /go redirect). */
export function isAllowedOfferUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return ALLOWED_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
}
