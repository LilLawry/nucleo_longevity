import type { Metadata } from "next";
import { getLocale, isValidLang } from "@/lib/i18n";
import { MOLECULES } from "@/lib/articles";
import { notFound } from "next/navigation";
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
      <div className="max-w-2xl mb-12">
        <p className="font-mono text-xs tracking-widest uppercase text-[var(--accent)] mb-4">
          {t.nav.molecole}
        </p>
        <h1 className="font-sans font-medium text-4xl sm:text-5xl tracking-[-0.03em] text-[var(--fg)] mb-4">
          {t.molecole.title}
        </h1>
        <p className="font-sans text-lg text-[var(--muted)] leading-relaxed">
          {t.molecole.subtitle}
        </p>
      </div>
      <MolecoleClient lang={lang} t={t} molecules={MOLECULES} />
    </div>
  );
}
