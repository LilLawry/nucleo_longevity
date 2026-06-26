import type { Metadata } from "next";
import Link from "next/link";
import { isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";
import NucleusMark from "@/components/NucleusMark";

export async function generateStaticParams() {
  return [{ lang: "it" }, { lang: "en" }];
}

export const metadata: Metadata = {
  title: "Grazie",
  robots: { index: false, follow: false },
};

const COPY = {
  it: {
    ok: { eyebrow: "Iscrizione confermata", title: "Ci sei.", body: "Trovi la guida alle molecole longevity nella tua casella di posta. Da oggi ricevi una nuova analisi ogni due settimane — solo dati, zero hype.", cta: "Apri la guida", cta2: "Leggi le analisi" },
    error: { eyebrow: "Quasi fatto", title: "Qualcosa non ha funzionato.", body: "Non siamo riusciti a completare la conferma. Riprova a iscriverti dalla home: bastano pochi secondi.", cta: "Torna alla home", cta2: "Scrivici" },
    invalid: { eyebrow: "Link non valido", title: "Questo link è scaduto.", body: "Il link di conferma vale 48 ore. Iscriviti di nuovo per riceverne uno fresco.", cta: "Torna alla home", cta2: "Scrivici" },
    pending: { eyebrow: "Controlla l'email", title: "Manca un passo.", body: "Ti abbiamo inviato un link di conferma. Aprilo per completare l'iscrizione e ricevere la guida.", cta: "Torna alla home", cta2: "Leggi le analisi" },
  },
  en: {
    ok: { eyebrow: "Subscription confirmed", title: "You're in.", body: "Your longevity molecules guide is in your inbox. From today you'll get a new analysis every two weeks — only data, zero hype.", cta: "Open the guide", cta2: "Read the analyses" },
    error: { eyebrow: "Almost there", title: "Something went wrong.", body: "We couldn't complete the confirmation. Try subscribing again from the home page — it takes seconds.", cta: "Back home", cta2: "Contact us" },
    invalid: { eyebrow: "Invalid link", title: "This link has expired.", body: "Confirmation links last 48 hours. Subscribe again to get a fresh one.", cta: "Back home", cta2: "Contact us" },
    pending: { eyebrow: "Check your email", title: "One more step.", body: "We sent you a confirmation link. Open it to complete your subscription and get the guide.", cta: "Back home", cta2: "Read the analyses" },
  },
};

export default async function GraziePage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const { status } = await searchParams;
  const key = (status === "error" || status === "invalid" || status === "ok" ? status : "pending") as
    | "ok" | "error" | "invalid" | "pending";
  const c = COPY[lang][key];

  const primaryHref = key === "ok" ? `/${lang}/guida` : `/${lang}`;
  const secondaryHref = c.cta2 === "Scrivici" || c.cta2 === "Contact us" ? `/${lang}/contatti` : `/${lang}/analisi`;

  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center">
      <div className="absolute inset-0 grid-surface" aria-hidden />
      <div className="glow-orb top-0 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem]" aria-hidden />
      <div className="relative max-w-xl mx-auto px-5 sm:px-8 py-20 text-center">
        <NucleusMark size={64} animated glow className="text-[var(--accent)] mx-auto mb-7" />
        <p className="font-mono text-xs tracking-widest uppercase text-[var(--accent)] mb-3">{c.eyebrow}</p>
        <h1 className="font-sans font-medium text-3xl sm:text-4xl tracking-[-0.02em] text-[var(--fg)] mb-4 text-balance">
          {c.title}
        </h1>
        <p className="font-sans text-base text-[var(--muted)] leading-relaxed mb-8 text-pretty">{c.body}</p>
        <div className="flex items-center justify-center gap-3">
          <Link href={primaryHref} className="btn-accent font-sans font-medium text-sm px-5 py-2.5">
            {c.cta}
          </Link>
          <Link
            href={secondaryHref}
            className="font-sans font-medium text-sm px-5 py-2.5 border border-[var(--border)] rounded text-[var(--fg)] hover:border-[var(--accent)] transition-colors"
          >
            {c.cta2}
          </Link>
        </div>
      </div>
    </section>
  );
}
