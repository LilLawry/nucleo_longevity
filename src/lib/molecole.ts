import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

export type Grade = "A" | "B" | "C" | "D" | "E" | "F";
export type EvidenceStrength = "alta" | "media" | "bassa";

/** Precise taxonomy — the database is NOT only "molecules". */
export type EntryType =
  | "molecule"
  | "substance"
  | "drug"
  | "supplement"
  | "nutrient"
  | "topicalIngredient"
  | "ingredientFamily"
  | "intervention"
  | "behaviour"
  | "technology"
  | "protocol";

/** How the entry is used — decoupled from the systemic/topical "domain" lens. */
export type DeliveryContext = "oral" | "topical" | "injectable" | "clinical" | "lifestyle" | "—";

/** Editorial review status. Indexing is reserved to `verified` (YMYL). */
export type ReviewStatus = "draft" | "reviewed" | "verified" | "update_required";

export interface KeyStudy {
  pmid?: string;
  title: string;
  type?: string; // RCT | meta-analisi | preclinico
  takeaway?: string;
  url?: string; // fallback when no single PMID (e.g. a PubMed query)
}

export interface Molecule {
  slug: string;
  name: string;
  aliases: string[];
  class: string;
  primaryUse: string;
  grade: Grade | "";
  evidenceStrength: EvidenceStrength | "";
  claim: string;
  /** one-line bottom line shown prominently near the top */
  bottomLine: string;
  /** "Prescription drug" | "Supplement / dietary" | "Injectable / clinical" ... */
  regulatory: string;
  evidenceSummary: string;
  mechanism: string;
  safety: string;
  dosageContext: string;
  keyStudies: KeyStudy[];
  /** practical, non-prescriptive examples of how the molecule is typically used */
  applications: string[];
  fieldNote: string;
  relatedMolecules: string[];
  lastReviewed: string;
  status: "published" | "draft";
  /** has a real 2D structure image at /public/molecules/<slug>.png */
  structure: boolean;
  /** optional caption override (e.g. "Representative monomer") */
  structureNote: string;
  /** allow search indexing — reserved to reviewStatus === "verified" (YMYL) */
  indexable: boolean;
  /** longevity lens: "systemic" (taken) vs "topical" (applied). Skin longevity
   * is still longevity — this is a facet, not a separate section. */
  domain: "systemic" | "topical";
  entryType: EntryType;
  deliveryContext: DeliveryContext;
  reviewStatus: ReviewStatus;
  /** the specific question the A–F grade answers (not a blanket verdict) */
  gradedQuestion: string;
  /** short safety flag surfaced next to the grade (e.g. drug supervision) */
  safetyFlag: string;
  body: string;
}

const REVIEW_STATUSES: ReviewStatus[] = ["draft", "reviewed", "verified", "update_required"];

/**
 * Zod schema for molecule frontmatter — a DATA-QUALITY gate, not a hard parser.
 * We validate with safeParse and only warn at build time so a single malformed
 * file can never break the 50+ live pages. The hand-written `parse()` below
 * stays the source of truth for defaults; this catches typos (wrong grade
 * letter, non-array keyStudies, unknown reviewStatus) early instead of shipping
 * them silently. Unknown keys are allowed (passthrough) so frontmatter can grow.
 */
const KeyStudySchema = z
  .object({
    title: z.string().optional(),
    type: z.string().optional(),
    takeaway: z.string().optional(),
    url: z.string().optional(),
    pmid: z.union([z.string(), z.number()]).optional(),
  })
  .passthrough();

export const MoleculeFrontmatterSchema = z
  .object({
    slug: z.string().optional(),
    name: z.string().optional(),
    aliases: z.array(z.string()).optional(),
    class: z.string().optional(),
    primaryUse: z.string().optional(),
    grade: z.enum(["A", "B", "C", "D", "E", "F", ""]).optional(),
    // Data currently carries English values (high/medium/low); Italian variants
    // are accepted too so the gate flags genuine typos, not the whole corpus.
    evidenceStrength: z.enum(["high", "medium", "low", "alta", "media", "bassa", ""]).optional(),
    keyStudies: z.array(KeyStudySchema).optional(),
    applications: z.array(z.string()).optional(),
    relatedMolecules: z.array(z.string()).optional(),
    reviewStatus: z.enum(["draft", "reviewed", "verified", "update_required"]).optional(),
    status: z.enum(["published", "draft"]).optional(),
    index: z.boolean().optional(),
    domain: z.enum(["systemic", "topical"]).optional(),
    deliveryContext: z.enum(["oral", "topical", "injectable", "clinical", "lifestyle", "—"]).optional(),
  })
  .passthrough();

/** Validate frontmatter and warn (never throw) on data-quality problems. */
function validateFrontmatter(file: string, data: Record<string, unknown>): void {
  const res = MoleculeFrontmatterSchema.safeParse(data);
  if (!res.success && process.env.NODE_ENV !== "production") {
    const issues = res.error.issues.map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`).join("; ");
    console.warn(`[molecole] frontmatter warning in ${file}: ${issues}`);
  }
}

function deriveEntryType(data: Record<string, unknown>): EntryType {
  if (typeof data.entryType === "string") return data.entryType as EntryType;
  const cls = String(data.class || "");
  const reg = String(data.regulatory || "");
  if (/topical|skincare/i.test(cls)) return "topicalIngredient";
  if (/injectable|procedure|aesthetic/i.test(reg)) return "intervention";
  if (/prescription|drug|farmaco/i.test(reg)) return "drug";
  if (/vitamin|mineral/i.test(cls)) return "nutrient";
  return "supplement";
}

const DIR = path.join(process.cwd(), "content/molecules");

function parse(file: string): Molecule {
  const slug = file.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  validateFrontmatter(file, data);
  // Default to "draft": nothing is treated as verified until a human review
  // sets `reviewStatus: verified` in frontmatter.
  const reviewStatus: ReviewStatus = REVIEW_STATUSES.includes(data.reviewStatus)
    ? (data.reviewStatus as ReviewStatus)
    : "draft";
  return {
    slug: data.slug || slug,
    name: data.name || slug,
    aliases: data.aliases || [],
    class: data.class || "—",
    primaryUse: data.primaryUse || "—",
    grade: (data.grade || "") as Molecule["grade"],
    evidenceStrength: (data.evidenceStrength || "") as Molecule["evidenceStrength"],
    claim: data.claim || "",
    bottomLine: data.bottomLine || "",
    regulatory: data.regulatory || "",
    evidenceSummary: data.evidenceSummary || "",
    mechanism: data.mechanism || "",
    safety: data.safety || "",
    dosageContext: data.dosageContext || "",
    keyStudies: data.keyStudies || [],
    applications: data.applications || [],
    fieldNote: data.fieldNote || data.notaDalCampo || "",
    relatedMolecules: data.relatedMolecules || [],
    lastReviewed: data.lastReviewed || "",
    status: data.status === "draft" ? "draft" : "published",
    structure: data.structure !== false,
    structureNote: data.structureNote || "",
    domain: /topical|skincare/i.test(String(data.class || "")) || data.domain === "topical" ? "topical" : "systemic",
    entryType: deriveEntryType(data),
    deliveryContext: ((): DeliveryContext => {
      if (typeof data.deliveryContext === "string") return data.deliveryContext as DeliveryContext;
      if (/topical|skincare/i.test(String(data.class || ""))) return "topical";
      if (/injectable/i.test(String(data.regulatory || ""))) return "injectable";
      return "oral";
    })(),
    reviewStatus,
    // Indexing: currently keyed off the existing `index` flag so we don't drop
    // already-indexed pages on deploy. The stricter YMYL gate (require
    // reviewStatus === "verified") is staged and can be switched on deliberately
    // alongside the pillar-verification pass — see docs/STRATEGIC-REVIEW.md.
    indexable: data.index === true,
    gradedQuestion:
      data.gradedQuestion ||
      `What does the human evidence support for: ${data.primaryUse || data.name || slug}?`,
    safetyFlag:
      data.safetyFlag ||
      (/prescription|drug|farmaco/i.test(String(data.regulatory || ""))
        ? "Prescription drug — use only under medical supervision"
        : ""),
    body: content.trim(),
  };
}

export function getAllMolecules(): Molecule[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map(parse)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getMoleculeBySlug(slug: string): Molecule | null {
  const all = getAllMolecules();
  return all.find((m) => m.slug === slug) || null;
}

export const GRADE_RANK: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, "": 9 };
