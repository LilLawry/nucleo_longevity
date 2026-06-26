import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";

export interface ArticleFrontmatter {
  titolo: string;
  title_en?: string;
  molecola: string;
  categoria: string;
  a_cosa_serve: string;
  quanto_e_provato: string;
  campione_studi: string;
  effetto_misurato: string;
  fonte_PMID: string[];
  verdetto: string;
  grado: "A" | "B" | "C" | "D" | "E" | "F";
  data: string;
  autore?: string;
  revisore?: string;
  excerpt?: string;
  excerpt_en?: string;
  tags?: string[];
  faq?: { q: string; a: string }[];
  faq_en?: { q: string; a: string }[];
}

export interface Article {
  slug: string;
  frontmatter: ArticleFrontmatter;
  readingTime: string;
  content: string;
}

const CONTENT_DIR = path.join(process.cwd(), "content/analisi");

export function getAllArticles(): Article[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data, content } = matter(raw);
      const rt = readingTime(content);
      return {
        slug,
        frontmatter: data as ArticleFrontmatter,
        readingTime: Math.ceil(rt.minutes).toString(),
        content,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.frontmatter.data).getTime() -
        new Date(a.frontmatter.data).getTime()
    );
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(raw);
  const rt = readingTime(content);
  return {
    slug,
    frontmatter: data as ArticleFrontmatter,
    readingTime: Math.ceil(rt.minutes).toString(),
    content,
  };
}

export const MOLECULES = [
  {
    id: "nmn",
    nome: "NMN",
    nome_en: "NMN",
    descrizione: "Nicotinamide Mononucleotide — precursore del NAD⁺",
    descrizione_en: "Nicotinamide Mononucleotide — NAD⁺ precursor",
    grado: "B" as const,
    categoria: "Metabolismo cellulare",
    categoria_en: "Cellular metabolism",
  },
  {
    id: "resveratrolo",
    nome: "Resveratrolo",
    nome_en: "Resveratrol",
    descrizione: "Polifenolo con attività sirtuinica",
    descrizione_en: "Polyphenol with sirtuin activity",
    grado: "C" as const,
    categoria: "Antiossidanti",
    categoria_en: "Antioxidants",
  },
  {
    id: "spermidina",
    nome: "Spermidina",
    nome_en: "Spermidine",
    descrizione: "Poliammina che induce autofagia",
    descrizione_en: "Polyamine that induces autophagy",
    grado: "B" as const,
    categoria: "Autofagia",
    categoria_en: "Autophagy",
  },
  {
    id: "rapamicina",
    nome: "Rapamicina",
    nome_en: "Rapamycin",
    descrizione: "Inibitore di mTOR, forte evidenza in modelli animali",
    descrizione_en: "mTOR inhibitor, strong evidence in animal models",
    grado: "A" as const,
    categoria: "mTOR / Autofagia",
    categoria_en: "mTOR / Autophagy",
  },
  {
    id: "metformina",
    nome: "Metformina",
    nome_en: "Metformin",
    descrizione: "Biguanide con effetti anti-invecchiamento studiati",
    descrizione_en: "Biguanide with studied anti-aging effects",
    grado: "B" as const,
    categoria: "Metabolismo glucosio",
    categoria_en: "Glucose metabolism",
  },
  {
    id: "quercetina",
    nome: "Quercetina",
    nome_en: "Quercetin",
    descrizione: "Flavonoide con azione senolitica",
    descrizione_en: "Flavonoid with senolytic action",
    grado: "C" as const,
    categoria: "Senolytics",
    categoria_en: "Senolytics",
  },
];
