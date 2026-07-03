import fs from "fs";
import path from "path";
import matter from "gray-matter";

export type Grade = "A" | "B" | "C" | "D" | "E" | "F";
export type EvidenceStrength = "alta" | "media" | "bassa";

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
  fieldNote: string;
  relatedMolecules: string[];
  lastReviewed: string;
  status: "published" | "draft";
  /** has a real 2D structure image at /public/molecules/<slug>.png */
  structure: boolean;
  /** optional caption override (e.g. "Representative monomer") */
  structureNote: string;
  /** allow search indexing — only once the page meets the NMN quality bar */
  indexable: boolean;
  body: string;
}

const DIR = path.join(process.cwd(), "content/molecules");

function parse(file: string): Molecule {
  const slug = file.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
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
    fieldNote: data.fieldNote || data.notaDalCampo || "",
    relatedMolecules: data.relatedMolecules || [],
    lastReviewed: data.lastReviewed || "",
    status: data.status === "draft" ? "draft" : "published",
    structure: data.structure !== false,
    structureNote: data.structureNote || "",
    indexable: data.index === true,
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
