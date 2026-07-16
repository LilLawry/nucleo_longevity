import fs from "fs";
import path from "path";
import matter from "gray-matter";

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
    // Indexing is EARNED: only entries a human has verified (real, checked
    // sources) are indexable — protects the domain's YMYL quality signal.
    indexable: data.index === true && reviewStatus === "verified",
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
