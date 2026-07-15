/**
 * offers.ts — the price/availability comparator data layer for Nucleo.
 *
 * WHERE THE DATA COMES FROM
 *  Real offers/merchants are loaded from two CSV files you control:
 *    content/comparator/merchants.csv
 *    content/comparator/offers.csv
 *  Drop rows in (e.g. mapped from an affiliate-network product feed) and they
 *  appear on the site — no code. If the files are missing/empty, a labelled
 *  DEMO dataset is used instead, and the UI shows a "demo" badge.
 *
 * Ethics baked in (from the Núkleoskin Finder brief):
 *  - NO scraping. Data comes only from authorised feeds / manual CSV entry.
 *  - Ranking is by price/availability ONLY, never by affiliate commission.
 *  - We never claim a commission from a merchant we have no contract with:
 *    `affiliate` defaults to false → plain external links + honest disclosure.
 *  - Every offer carries a `sourcedAt` date; prices are indicative.
 *  - /go/[id] only redirects to hosts on ALLOWED_DOMAINS (no open redirect).
 */
import fs from "fs";
import path from "path";

export type OfferStatus = "active" | "stale" | "unavailable";
export type SizeUnit = "g" | "ml" | "caps" | "servings";

export interface Merchant {
  id: string;
  name: string;
  domain: string;
  /** extra hosts allowed for this merchant's outbound URLs (e.g. affiliate network trackers) */
  linkDomains: string[];
  shipsToItaly: boolean;
  /** true ONLY where a real affiliate contract exists. */
  affiliate: boolean;
}

export interface Offer {
  id: string;
  moleculeSlug: string;
  merchantId: string;
  productTitle: string;
  price: number;
  currency: "EUR";
  /** null = shipping unknown → total not calculable. */
  shipping: number | null;
  url: string;
  size?: { value: number; unit: SizeUnit };
  status: OfferStatus;
  sourcedAt: string; // ISO date
}

// ── minimal RFC4180-ish CSV parser (no deps) ────────────────────────────────
function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;
  const src = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (inQuotes) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  const nonEmpty = rows.filter((r) => r.some((v) => v.trim() !== ""));
  if (nonEmpty.length < 2) return [];
  const headers = nonEmpty[0].map((h) => h.trim());
  return nonEmpty.slice(1).map((r) => {
    const o: Record<string, string> = {};
    headers.forEach((h, idx) => (o[h] = (r[idx] ?? "").trim()));
    return o;
  });
}

const DIR = path.join(process.cwd(), "content/comparator");
const readCsv = (file: string): Record<string, string>[] => {
  try {
    const p = path.join(DIR, file);
    if (!fs.existsSync(p)) return [];
    return parseCsv(fs.readFileSync(p, "utf8"));
  } catch {
    return [];
  }
};

const truthy = (v: string) => /^(1|true|yes|si|sì)$/i.test(v.trim());
const numOrNull = (v: string) => (v.trim() === "" ? null : Number(v.replace(",", ".")));

// ── DEMO fallback (fictional, reserved example.* domains) ───────────────────
const DEMO_MERCHANTS: Merchant[] = [
  { id: "demo-a", name: "Demo Store A", domain: "example.com", linkDomains: [], shipsToItaly: true, affiliate: false },
  { id: "demo-b", name: "Demo Store B", domain: "example.org", linkDomains: [], shipsToItaly: true, affiliate: false },
  { id: "demo-c", name: "Demo Store C", domain: "example.net", linkDomains: [], shipsToItaly: false, affiliate: false },
];
const DEMO_OFFERS: Offer[] = [
  { id: "nmn-a", moleculeSlug: "nmn", merchantId: "demo-a", productTitle: "NMN 500 mg — 60 caps (demo)", price: 34.9, currency: "EUR", shipping: 3.9, url: "https://example.com/nmn", size: { value: 60, unit: "caps" }, status: "active", sourcedAt: "2026-07-10" },
  { id: "nmn-b", moleculeSlug: "nmn", merchantId: "demo-b", productTitle: "NMN 500 mg — 60 caps (demo)", price: 29.9, currency: "EUR", shipping: null, url: "https://example.org/nmn", size: { value: 60, unit: "caps" }, status: "active", sourcedAt: "2026-07-09" },
  { id: "nmn-c", moleculeSlug: "nmn", merchantId: "demo-c", productTitle: "NMN 500 mg — 90 caps (demo)", price: 44.0, currency: "EUR", shipping: 6.0, url: "https://example.net/nmn", size: { value: 90, unit: "caps" }, status: "stale", sourcedAt: "2026-05-30" },
  { id: "cr-a", moleculeSlug: "creatine", merchantId: "demo-a", productTitle: "Creatine monohydrate — 300 g (demo)", price: 19.9, currency: "EUR", shipping: 3.9, url: "https://example.com/creatine", size: { value: 300, unit: "g" }, status: "active", sourcedAt: "2026-07-10" },
  { id: "cr-b", moleculeSlug: "creatine", merchantId: "demo-b", productTitle: "Creatine monohydrate — 500 g (demo)", price: 26.5, currency: "EUR", shipping: 0, url: "https://example.org/creatine", size: { value: 500, unit: "g" }, status: "active", sourcedAt: "2026-07-08" },
  { id: "mg-a", moleculeSlug: "magnesium", merchantId: "demo-b", productTitle: "Magnesium glycinate — 120 caps (demo)", price: 15.9, currency: "EUR", shipping: null, url: "https://example.org/magnesium", size: { value: 120, unit: "caps" }, status: "active", sourcedAt: "2026-07-07" },
  { id: "mg-b", moleculeSlug: "magnesium", merchantId: "demo-a", productTitle: "Magnesium glycinate — 90 caps (demo)", price: 12.9, currency: "EUR", shipping: 3.9, url: "https://example.com/magnesium", size: { value: 90, unit: "caps" }, status: "active", sourcedAt: "2026-07-10" },
  { id: "o3-a", moleculeSlug: "omega-3", merchantId: "demo-a", productTitle: "Omega-3 EPA/DHA — 120 softgels (demo)", price: 22.0, currency: "EUR", shipping: 3.9, url: "https://example.com/omega3", size: { value: 120, unit: "caps" }, status: "active", sourcedAt: "2026-07-10" },
  { id: "o3-b", moleculeSlug: "omega-3", merchantId: "demo-b", productTitle: "Omega-3 EPA/DHA — 90 softgels (demo)", price: 18.5, currency: "EUR", shipping: null, url: "https://example.org/omega3", size: { value: 90, unit: "caps" }, status: "active", sourcedAt: "2026-07-06" },
  { id: "vd-a", moleculeSlug: "vitamin-d", merchantId: "demo-b", productTitle: "Vitamin D3 1000 IU — 180 caps (demo)", price: 9.9, currency: "EUR", shipping: null, url: "https://example.org/vitamin-d", size: { value: 180, unit: "caps" }, status: "active", sourcedAt: "2026-07-05" },
  { id: "vd-b", moleculeSlug: "vitamin-d", merchantId: "demo-a", productTitle: "Vitamin D3 2000 IU — 120 caps (demo)", price: 11.9, currency: "EUR", shipping: 3.9, url: "https://example.com/vitamin-d", size: { value: 120, unit: "caps" }, status: "active", sourcedAt: "2026-07-10" },
  { id: "sp-a", moleculeSlug: "spermidina", merchantId: "demo-a", productTitle: "Spermidine wheat-germ extract — 60 caps (demo)", price: 39.9, currency: "EUR", shipping: 3.9, url: "https://example.com/spermidine", size: { value: 60, unit: "caps" }, status: "active", sourcedAt: "2026-07-10" },
];

// ── load real CSV data, else fall back to demo ──────────────────────────────
function loadMerchants(): Merchant[] {
  const rows = readCsv("merchants.csv");
  if (!rows.length) return DEMO_MERCHANTS;
  return rows
    .filter((r) => r.id && r.domain)
    .map((r) => ({
      id: r.id,
      name: r.name || r.id,
      domain: r.domain.replace(/^www\./, ""),
      linkDomains: (r.link_domains || "").split("|").map((d) => d.trim().replace(/^www\./, "")).filter(Boolean),
      shipsToItaly: truthy(r.ships_to_italy || "true"),
      affiliate: truthy(r.affiliate || "false"),
    }));
}

function loadOffers(): Offer[] {
  const rows = readCsv("offers.csv");
  if (!rows.length) return DEMO_OFFERS;
  return rows
    .filter((r) => r.id && r.molecule_slug && r.merchant_id && r.price && r.url)
    .map((r): Offer => {
      const sizeValue = numOrNull(r.size_value || "");
      const unit = (r.size_unit || "").trim() as SizeUnit;
      const status = (["active", "stale", "unavailable"].includes(r.status) ? r.status : "active") as OfferStatus;
      return {
        id: r.id,
        moleculeSlug: r.molecule_slug,
        merchantId: r.merchant_id,
        productTitle: r.product_title || "",
        price: Number((r.price || "0").replace(",", ".")),
        currency: "EUR",
        shipping: numOrNull(r.shipping || ""),
        url: r.url,
        size: sizeValue && unit ? { value: sizeValue, unit } : undefined,
        status,
        sourcedAt: r.sourced_at || "",
      };
    });
}

const USING_CSV = readCsv("offers.csv").length > 0 && readCsv("merchants.csv").length > 0;
/** Demo badge/disclosure show while we're on the fallback dataset. */
export const NKF_DEMO_MODE = !USING_CSV;

const MERCHANT_LIST = loadMerchants();
const OFFER_LIST = loadOffers();
const MERCHANTS = new Map(MERCHANT_LIST.map((m) => [m.id, m]));

/** Redirect allowlist: every merchant domain + declared link domains. */
export const ALLOWED_DOMAINS: string[] = Array.from(
  new Set(MERCHANT_LIST.flatMap((m) => [m.domain, ...m.linkDomains]))
);

export function getMerchant(id: string): Merchant | undefined {
  return MERCHANTS.get(id);
}
export function getOfferById(id: string): Offer | undefined {
  return OFFER_LIST.find((o) => o.id === id);
}

export interface ComputedOffer extends Offer {
  merchant: Merchant;
  total: number | null;
  totalCalculable: boolean;
  perUnit: { label: string; value: number } | null;
}

function perUnit(o: Offer): ComputedOffer["perUnit"] {
  if (!o.size || o.size.value <= 0) return null;
  const { value, unit } = o.size;
  if (unit === "caps") return { label: "€/cap", value: o.price / value };
  if (unit === "servings") return { label: "€/dose", value: o.price / value };
  if (unit === "g") return { label: "€/100 g", value: (o.price / value) * 100 };
  if (unit === "ml") return { label: "€/100 ml", value: (o.price / value) * 100 };
  return null;
}

/**
 * Offers for a molecule, ranked ORGANICALLY: active first, then by total price
 * when calculable (else base price), then most recently sourced. Affiliate
 * status is never a ranking input.
 */
export function getOffersForMolecule(slug: string): ComputedOffer[] {
  const rows = OFFER_LIST.filter((o) => o.moleculeSlug === slug && MERCHANTS.has(o.merchantId)).map(
    (o): ComputedOffer => {
      const merchant = MERCHANTS.get(o.merchantId)!;
      const totalCalculable = o.shipping !== null;
      const total = totalCalculable ? +(o.price + (o.shipping ?? 0)).toFixed(2) : null;
      return { ...o, merchant, total, totalCalculable, perUnit: perUnit(o) };
    }
  );
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

/** True if the offer's URL host is on the allowlist (used by /go). */
export function isAllowedOfferUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return ALLOWED_DOMAINS.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
}
