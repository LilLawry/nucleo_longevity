import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang, langs } from "@/lib/i18n";
import ConnectForm from "../ConnectForm";

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const it = lang === "it";
  return {
    title: it ? "Candidati — Nucleo Connect" : "Join — Nucleo Connect",
    description: it
      ? "Candida la tua azienda o il tuo profilo professionale alla directory Nucleo Connect. Revisione manuale, nessuna pubblicazione automatica."
      : "Apply to add your company or professional profile to the Nucleo Connect directory. Manual review, no auto-publishing.",
    robots: { index: true, follow: true },
    alternates: { canonical: `/${lang}/connect/join`, languages: { it: "/it/connect/join", en: "/en/connect/join", "x-default": "/en/connect/join" } },
  };
}

export default async function JoinPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const it = lang === "it";

  const fields = [
    { key: "organisation", label: it ? "Organizzazione" : "Organisation", required: true },
    { key: "role", label: it ? "Ruolo" : "Role" },
    { key: "website", label: it ? "Sito web" : "Website" },
    { key: "country", label: it ? "Paese" : "Country", required: true },
    { key: "category", label: it ? "Categoria (produttore, laboratorio, distributore…)" : "Category (manufacturer, lab, distributor…)", required: true },
    { key: "reason", label: it ? "Descrizione e motivo della candidatura" : "Description and reason for applying", type: "textarea" as const, required: true },
  ];

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <nav className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--muted)] mb-8">
        <Link href={`/${lang}/connect`} className="link-underline">Connect</Link>
        <span className="mx-2 text-[var(--border)]">/</span><span className="text-[var(--fg)]">Join</span>
      </nav>
      <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)] mb-4">Nucleo Connect</p>
      <h1 className="font-serif font-medium text-4xl sm:text-5xl tracking-[-0.02em] text-[var(--fg)] mb-5 text-balance">
        {it ? "Candidati alla directory" : "Join the directory"}
      </h1>
      <p className="font-sans text-lg text-[var(--muted)] leading-relaxed mb-3 text-pretty">
        {it
          ? "Aziende e professionisti dell'ecosistema longevity. Raccogliamo solo dati professionali necessari."
          : "Companies and professionals of the longevity ecosystem. We collect only the professional data needed."}
      </p>
      <p className="font-mono text-[0.62rem] text-[var(--muted)] leading-relaxed mb-10">
        {it
          ? "Nessun account, nessun pagamento, nessuna pubblicazione automatica. Revisione manuale prima dell'inserimento. Niente dati sanitari."
          : "No account, no payment, no auto-publishing. Manual review before listing. No health data."}
      </p>

      <ConnectForm lang={lang} variant="brand" fields={fields} />
    </div>
  );
}
