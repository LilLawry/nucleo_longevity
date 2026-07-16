/**
 * connect.ts — NUCLEO CONNECT data layer (B2B directory + digital fair).
 *
 * v1 is a CURATED DIRECTORY, not a transactional marketplace: no accounts,
 * payments, orders or auto-publishing. Zod-validated, repository-pattern so it
 * can migrate to a DB/API later without rewriting pages.
 *
 * All companies here are FICTIONAL DEMO data (NKF_CONNECT_DEMO = true). No real
 * company, partnership or certification is asserted. "Sponsored" and "verified"
 * are separate concepts — a paid profile is never implied to be verified.
 */
import { z } from "zod";

export const NKF_CONNECT_DEMO = true;

export const OrganisationType = z.enum([
  "manufacturer", "brand", "laboratory", "cdmo", "ingredientSupplier",
  "packagingSupplier", "testingProvider", "regulatoryProvider", "softwareProvider",
  "researchOrganisation", "clinic", "retailer", "distributor", "investor", "publisher", "other",
]);
export type OrganisationType = z.infer<typeof OrganisationType>;

export const VerificationStatus = z.enum(["unverified", "selfDeclared", "sourceChecked", "verifiedPartner"]);
export type VerificationStatus = z.infer<typeof VerificationStatus>;

export const CommercialStatus = z.enum(["organic", "sponsored", "premium"]);
export type CommercialStatus = z.infer<typeof CommercialStatus>;

export const EditorialStatus = z.enum(["draft", "reviewRequired", "reviewed", "verified", "updateRequired", "archived"]);
export type EditorialStatus = z.infer<typeof EditorialStatus>;

export const CompanyProfile = z.object({
  slug: z.string().min(1),
  locale: z.enum(["en", "it"]).default("en"),
  name: z.string().min(1),
  demo: z.boolean().default(true),
  organisationType: z.array(OrganisationType).min(1),
  description: z.string().min(1),
  country: z.string().min(2),
  cities: z.array(z.string()).optional(),
  foundedYear: z.number().int().optional(),
  website: z.string().url().optional(),
  marketsServed: z.array(z.string()).default([]),
  categories: z.array(z.string()).default([]),
  services: z.array(z.string()).default([]),
  products: z.array(z.string()).optional(),
  minimumOrderQuantity: z.string().optional(),
  certificationsDeclared: z.array(z.string()).optional(),
  certificationSources: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  verificationStatus: VerificationStatus.default("unverified"),
  commercialStatus: CommercialStatus.default("organic"),
  lastCheckedAt: z.string().optional(),
  contactMode: z.enum(["external", "mediatedForm"]).default("mediatedForm"),
  relatedEntries: z.array(z.string()).optional(),
  status: EditorialStatus.default("draft"),
});
export type CompanyProfile = z.infer<typeof CompanyProfile>;

// ── DEMO seed (fictional; names clearly placeholder) ────────────────────────
const RAW: z.input<typeof CompanyProfile>[] = [
  {
    slug: "demo-nord-actives", locale: "en", name: "Nord Actives (demo)", demo: true,
    organisationType: ["ingredientSupplier", "manufacturer"], country: "IT", cities: ["Milano"],
    foundedYear: 2015, description: "Demo ingredient supplier for cosmetic actives and barrier lipids. Fictional profile for illustration.",
    marketsServed: ["EU", "IT"], categories: ["ceramides", "niacinamide", "barrier"],
    services: ["ingredient supply", "technical documentation"], minimumOrderQuantity: "25 kg",
    certificationsDeclared: ["ISO 9001 (self-declared)"], certificationSources: [], languages: ["it", "en"],
    verificationStatus: "selfDeclared", commercialStatus: "organic", contactMode: "mediatedForm",
    relatedEntries: ["ceramides", "niacinamide"], status: "reviewRequired",
  },
  {
    slug: "demo-sunlab", locale: "en", name: "SunLab Formulations (demo)", demo: true,
    organisationType: ["cdmo", "laboratory"], country: "IT", cities: ["Bologna"],
    foundedYear: 2011, description: "Demo contract manufacturer specialising in photoprotection formulations. Fictional profile.",
    marketsServed: ["EU"], categories: ["spf", "photoprotection", "private-label"],
    services: ["contract manufacturing", "private label", "stability testing"], minimumOrderQuantity: "3,000 units",
    certificationsDeclared: ["GMP (self-declared)"], languages: ["it", "en"],
    verificationStatus: "unverified", commercialStatus: "organic", contactMode: "mediatedForm",
    relatedEntries: ["sunscreen-spf"], status: "reviewRequired",
  },
  {
    slug: "demo-longevis-distribution", locale: "en", name: "Longevis Distribution (demo)", demo: true,
    organisationType: ["distributor", "retailer"], country: "IT", cities: ["Roma"],
    foundedYear: 2019, description: "Demo distributor of evidence-oriented supplements across Italian pharmacies. Fictional profile.",
    marketsServed: ["IT"], categories: ["supplements", "distribution"],
    services: ["distribution", "retail placement"], languages: ["it"],
    verificationStatus: "sourceChecked", commercialStatus: "sponsored", contactMode: "mediatedForm",
    relatedEntries: ["creatine", "omega-3"], status: "reviewRequired", lastCheckedAt: "2026-07-01",
  },
  {
    slug: "demo-pack-clean", locale: "en", name: "PackClean Airless (demo)", demo: true,
    organisationType: ["packagingSupplier"], country: "DE", cities: ["Berlin"],
    foundedYear: 2013, description: "Demo airless-packaging supplier for sensitive cosmetic formulations. Fictional profile.",
    marketsServed: ["EU", "DE", "IT"], categories: ["packaging", "airless"],
    services: ["airless packaging", "custom tooling"], minimumOrderQuantity: "10,000 units",
    languages: ["de", "en"], verificationStatus: "unverified", commercialStatus: "organic",
    contactMode: "mediatedForm", status: "reviewRequired",
  },
  {
    slug: "demo-derma-testing", locale: "en", name: "DermaTest Europe (demo)", demo: true,
    organisationType: ["testingProvider", "researchOrganisation"], country: "FR", cities: ["Lyon"],
    foundedYear: 2009, description: "Demo testing provider for skin-barrier and photoprotection endpoints. Fictional profile.",
    marketsServed: ["EU"], categories: ["testing", "barrier", "photoprotection"],
    services: ["in-vivo testing", "TEWL measurement", "SPF testing"], languages: ["fr", "en"],
    verificationStatus: "unverified", commercialStatus: "organic", contactMode: "mediatedForm",
    relatedEntries: ["ceramides", "sunscreen-spf"], status: "reviewRequired",
  },
];

const COMPANIES: CompanyProfile[] = RAW.map((c) => CompanyProfile.parse(c));

export function getCompanies(): CompanyProfile[] {
  return COMPANIES.slice();
}
export function getCompanyBySlug(slug: string): CompanyProfile | undefined {
  return COMPANIES.find((c) => c.slug === slug);
}
export function getCompanyCountries(): string[] {
  return Array.from(new Set(COMPANIES.map((c) => c.country))).sort();
}
export function getCompanyTypes(): OrganisationType[] {
  return Array.from(new Set(COMPANIES.flatMap((c) => c.organisationType))).sort() as OrganisationType[];
}

export const ORG_TYPE_LABEL: Record<OrganisationType, string> = {
  manufacturer: "Manufacturer", brand: "Brand", laboratory: "Laboratory", cdmo: "CDMO",
  ingredientSupplier: "Ingredient supplier", packagingSupplier: "Packaging supplier",
  testingProvider: "Testing provider", regulatoryProvider: "Regulatory", softwareProvider: "Software",
  researchOrganisation: "Research", clinic: "Clinic", retailer: "Retailer", distributor: "Distributor",
  investor: "Investor", publisher: "Publisher", other: "Other",
};

export const VERIFICATION_LABEL: Record<VerificationStatus, string> = {
  unverified: "Unverified", selfDeclared: "Self-declared", sourceChecked: "Source-checked", verifiedPartner: "Verified partner",
};

// ── Professionals (individual profiles; same guardrails as companies) ────────
export const ProfessionalRole = z.enum([
  "formulator", "regulatoryConsultant", "salesAgent", "distributorContact",
  "researcher", "clinician", "qualityLead", "other",
]);
export type ProfessionalRole = z.infer<typeof ProfessionalRole>;

export const ProfessionalProfile = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  demo: z.boolean().default(true),
  role: ProfessionalRole,
  headline: z.string().min(1),
  country: z.string().min(2),
  expertise: z.array(z.string()).default([]),
  markets: z.array(z.string()).default([]),
  languages: z.array(z.string()).optional(),
  verificationStatus: VerificationStatus.default("unverified"),
  commercialStatus: CommercialStatus.default("organic"),
  contactMode: z.enum(["external", "mediatedForm"]).default("mediatedForm"),
  status: EditorialStatus.default("draft"),
});
export type ProfessionalProfile = z.infer<typeof ProfessionalProfile>;

const RAW_PROS: z.input<typeof ProfessionalProfile>[] = [
  {
    slug: "demo-formulator-ele", name: "E. Ricci (demo)", demo: true, role: "formulator",
    headline: "Cosmetic formulator — barrier & photoprotection systems. Fictional demo profile.",
    country: "IT", expertise: ["barrier repair", "SPF systems", "sensitive skin"], markets: ["EU", "IT"],
    languages: ["it", "en"], verificationStatus: "selfDeclared", status: "reviewRequired",
  },
  {
    slug: "demo-regulatory-marc", name: "M. Conti (demo)", demo: true, role: "regulatoryConsultant",
    headline: "EU cosmetics & supplements regulatory consultant. Fictional demo profile.",
    country: "IT", expertise: ["CPNP", "claims substantiation", "novel food"], markets: ["EU"],
    languages: ["it", "en"], verificationStatus: "unverified", status: "reviewRequired",
  },
  {
    slug: "demo-agent-sof", name: "S. Bianchi (demo)", demo: true, role: "salesAgent",
    headline: "Sales agent — pharmacy & derma channel, Northern Italy. Fictional demo profile.",
    country: "IT", expertise: ["pharmacy channel", "key accounts"], markets: ["IT"],
    languages: ["it"], verificationStatus: "sourceChecked", commercialStatus: "sponsored", status: "reviewRequired",
  },
];
const PROFESSIONALS: ProfessionalProfile[] = RAW_PROS.map((p) => ProfessionalProfile.parse(p));

export function getProfessionals(): ProfessionalProfile[] { return PROFESSIONALS.slice(); }
export function getProfessionalBySlug(slug: string): ProfessionalProfile | undefined {
  return PROFESSIONALS.find((p) => p.slug === slug);
}
export const ROLE_LABEL: Record<ProfessionalRole, string> = {
  formulator: "Formulator", regulatoryConsultant: "Regulatory consultant", salesAgent: "Sales agent",
  distributorContact: "Distributor contact", researcher: "Researcher", clinician: "Clinician",
  qualityLead: "Quality lead", other: "Other",
};

// ── Opportunities (curated briefs; mediated only, never transactional) ───────
export const Opportunity = z.object({
  slug: z.string().min(1),
  demo: z.boolean().default(true),
  kind: z.enum(["seeking", "offering"]),
  title: z.string().min(1),
  summary: z.string().min(1),
  country: z.string().min(2),
  categories: z.array(z.string()).default([]),
  postedAt: z.string().optional(),
  status: EditorialStatus.default("draft"),
});
export type Opportunity = z.infer<typeof Opportunity>;

const RAW_OPPS: z.input<typeof Opportunity>[] = [
  {
    slug: "demo-opp-distributor-spf", demo: true, kind: "seeking",
    title: "Distributor seeks evidence-graded SPF line (IT pharmacy channel)",
    summary: "A demo distributor is looking for a photoprotection line with documented human testing to place in Italian pharmacies. Fictional brief for illustration.",
    country: "IT", categories: ["spf", "photoprotection", "distribution"], postedAt: "2026-07-05",
    status: "reviewRequired",
  },
  {
    slug: "demo-opp-cdmo-capacity", demo: true, kind: "offering",
    title: "CDMO offering free capacity for barrier-repair formulations",
    summary: "A demo contract manufacturer has open capacity for barrier/ceramide formulations, EU GMP declared. Fictional brief for illustration.",
    country: "IT", categories: ["cdmo", "barrier", "manufacturing"], postedAt: "2026-07-02",
    status: "reviewRequired",
  },
  {
    slug: "demo-opp-testing-partner", demo: true, kind: "offering",
    title: "Testing provider offering TEWL / SPF study slots",
    summary: "A demo testing lab is offering in-vivo barrier and SPF study slots for Q4. Fictional brief for illustration.",
    country: "FR", categories: ["testing", "barrier", "photoprotection"], postedAt: "2026-06-28",
    status: "reviewRequired",
  },
];
const OPPORTUNITIES: Opportunity[] = RAW_OPPS.map((o) => Opportunity.parse(o));

export function getOpportunities(): Opportunity[] { return OPPORTUNITIES.slice(); }

// ── Expo (digital fair): curated, time-boxed themed showcases ────────────────
export interface ExpoShowcase {
  slug: string;
  title: string;
  theme: string;
  blurb: string;
  companySlugs: string[];
}
const SHOWCASES: ExpoShowcase[] = [
  {
    slug: "photoprotection", title: "Photoprotection", theme: "Outside",
    blurb: "Ingredient suppliers, formulators and testing labs working on evidence-based sun protection.",
    companySlugs: ["demo-sunlab", "demo-derma-testing", "demo-nord-actives"],
  },
  {
    slug: "barrier-repair", title: "Barrier repair", theme: "Outside",
    blurb: "Ceramides, barrier lipids and the labs that test them.",
    companySlugs: ["demo-nord-actives", "demo-derma-testing", "demo-pack-clean"],
  },
  {
    slug: "distribution", title: "Distribution & channel", theme: "Inside & Outside",
    blurb: "Distributors and channel partners for evidence-graded molecules.",
    companySlugs: ["demo-longevis-distribution"],
  },
];
export function getShowcases(): ExpoShowcase[] { return SHOWCASES.slice(); }
export function getShowcaseBySlug(slug: string): ExpoShowcase | undefined {
  return SHOWCASES.find((s) => s.slug === slug);
}
