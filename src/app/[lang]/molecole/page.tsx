import type { Metadata } from "next";
import { getLocale, isValidLang } from "@/lib/i18n";
import { MOLECULES } from "@/lib/articles";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import MolecoleClient from "./MolecoleClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getLocale(lang as "it" | "en");
  return { title: t.molecole.title, description: t.molecole.subtitle };
}

export default async function MolecolePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const t = getLocale(lang);

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <PageHeader eyebrow={t.nav.molecole} title={t.molecole.title} subtitle={t.molecole.subtitle} />
      <MolecoleClient lang={lang} t={t} molecules={MOLECULES} />
    </div>
  );
}
