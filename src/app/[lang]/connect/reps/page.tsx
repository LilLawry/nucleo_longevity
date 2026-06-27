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
  const title = it ? "Connect — Agenti & commerciali" : "Connect — Sales reps & agents";
  const description = it
    ? "Sei un agente o commerciale del settore? Entra nel network e ricevi mandati da brand evidence-based."
    : "Are you a sector sales rep or agent? Join the network and receive mandates from evidence-based brands.";
  return { title, description, alternates: { canonical: `/${lang}/connect/reps`, languages: { en: "/en/connect/reps", it: "/it/connect/reps", "x-default": "/en/connect/reps" } } };
}

export default async function RepsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const it = lang === "it";

  const fields = it
    ? [
        { key: "Nome", label: "Nome", required: true },
        { key: "Settori", label: "Settori", required: true },
        { key: "Territorio", label: "Territorio / mercati" },
        { key: "Portfolio", label: "Portfolio / esperienza", type: "textarea" as const },
      ]
    : [
        { key: "Name", label: "Name", required: true },
        { key: "Sectors", label: "Sectors", required: true },
        { key: "Territory", label: "Territory / markets" },
        { key: "Portfolio", label: "Portfolio / experience", type: "textarea" as const },
      ];

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <nav className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] mb-6">
        <Link href={`/${lang}/connect`} className="link-underline">Connect</Link>
        <span className="mx-2 text-[var(--border)]">/</span>
        <span className="text-[var(--fg)]">{it ? "Agenti" : "Reps"}</span>
      </nav>
      <PageHeader
        eyebrow={it ? "Connect · Agenti" : "Connect · Reps"}
        title={it ? "Rappresenta molecole che reggono alla scienza." : "Represent molecules that hold up to science."}
        subtitle={
          it
            ? "Se vendi nel settore longevity/estetica, entra nel network: ti mettiamo in contatto con brand evidence-based che cercano distribuzione."
            : "If you sell in the longevity/aesthetics sector, join the network: we connect you with evidence-based brands looking for distribution."
        }
      />
      <ConnectForm lang={lang} variant="rep" fields={fields} />
    </div>
  );
}
