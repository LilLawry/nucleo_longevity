import type { Metadata } from "next";
import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { getAllMolecules } from "@/lib/molecole";
import PageHeader from "@/components/PageHeader";
import DatabaseClient, { type Row } from "./DatabaseClient";

export async function generateStaticParams() {
  return [{ lang: "it" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const it = lang === "it";
  const title = it ? "Database molecole" : "Molecule database";
  const description = it
    ? "Indice clinico delle molecole per la longevità: classe, grado di evidenza A–F, uso e ultima revisione. Filtra e ordina."
    : "Clinical index of longevity molecules: class, A–F evidence grade, use and last review. Filter and sort.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/database`,
      languages: { it: "/it/database", en: "/en/database", "x-default": "/en/database" },
    },
  };
}

export default async function DatabasePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const it = lang === "it";

  const rows: Row[] = getAllMolecules().map((m) => ({
    slug: m.slug,
    name: m.name,
    class: m.class,
    grade: m.grade,
    primaryUse: m.primaryUse,
    evidenceStrength: m.evidenceStrength,
    lastReviewed: m.lastReviewed,
    status: m.status,
  }));

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <PageHeader
        eyebrow={it ? "Database" : "Database"}
        title={it ? "Indice delle molecole" : "Molecule index"}
        subtitle={
          it
            ? "Ogni molecola con classe, grado di evidenza (A–F) e ultima revisione. Filtra, cerca e ordina come in un reference clinico."
            : "Every molecule with class, evidence grade (A–F) and last review. Filter, search and sort like a clinical reference."
        }
      />
      <DatabaseClient rows={rows} lang={lang} />
    </div>
  );
}
