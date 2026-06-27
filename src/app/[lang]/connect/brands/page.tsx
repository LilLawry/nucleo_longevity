import type { Metadata } from "next";
import Link from "next/link";
import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import ConnectForm from "../ConnectForm";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "it" }];
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const it = lang === "it";
  const title = it ? "Connect — Brand & produttori" : "Connect — Brands & manufacturers";
  const description = it
    ? "Produci una molecola evidence-based? Ti aiutiamo a trovare distribuzione e partner nei mercati giusti."
    : "Make an evidence-based molecule? We help you find distribution and partners in the right markets.";
  return { title, description, alternates: { canonical: `/${lang}/connect/brands`, languages: { en: "/en/connect/brands", it: "/it/connect/brands", "x-default": "/en/connect/brands" } } };
}

export default async function BrandsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const it = lang === "it";

  const fields = it
    ? [
        { key: "Azienda", label: "Azienda", required: true },
        { key: "Prodotto", label: "Prodotto", required: true },
        { key: "Categoria", label: "Categoria" },
        { key: "Molecole", label: "Molecola/e" },
        { key: "Mercati", label: "Mercati di interesse" },
      ]
    : [
        { key: "Company", label: "Company", required: true },
        { key: "Product", label: "Product", required: true },
        { key: "Category", label: "Category" },
        { key: "Molecules", label: "Molecule(s)" },
        { key: "Markets", label: "Target markets" },
      ];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <nav className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] mb-6">
        <Link href={`/${lang}/connect`} className="link-underline">Connect</Link>
        <span className="mx-2 text-[var(--border)]">/</span>
        <span className="text-[var(--fg)]">{it ? "Brand" : "Brands"}</span>
      </nav>
      <PageHeader
        eyebrow={it ? "Connect · Brand" : "Connect · Brands"}
        title={it ? "Porta la tua molecola nei mercati giusti." : "Take your molecule to the right markets."}
        subtitle={
          it
            ? "Se produci una molecola con evidenza reale, ti colleghiamo a distributori e agenti selezionati. Compila e ti ricontattiamo."
            : "If you make a molecule with real evidence, we connect you to vetted distributors and reps. Fill in the form and we'll get back to you."
        }
      />
      <ConnectForm lang={lang} variant="brand" fields={fields} />
    </div>
  );
}
