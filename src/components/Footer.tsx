import Link from "next/link";
import type { Locale } from "@/locales/it";
import NewsletterForm from "./NewsletterForm";
import Wordmark from "./Wordmark";

export default function Footer({ lang, t }: { lang: string; t: Locale }) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-elev)] mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-2 md:grid-cols-12 gap-10 md:gap-8">
        {/* Brand */}
        <div className="col-span-2 md:col-span-4">
          <Link href={`/${lang}`} className="inline-flex items-center mb-4 hover:opacity-80 transition-opacity">
            <Wordmark className="h-10 w-auto" />
          </Link>
          <p className="text-sm text-[var(--muted)] leading-relaxed max-w-xs">{t.footer.tagline}</p>
        </div>

        {/* Explore */}
        <nav className="md:col-span-2 flex flex-col gap-2.5" aria-label={t.footer.explore_label}>
          <p className="font-mono text-xs tracking-widest uppercase text-[var(--muted)] mb-1.5">
            {t.footer.explore_label}
          </p>
          {[
            { href: `/${lang}/database`, label: t.nav.database },
            { href: `/${lang}/molecole`, label: t.nav.molecole },
            { href: `/${lang}/analisi`, label: t.nav.analisi },
            { href: `/${lang}/method`, label: t.nav.metodo },
            { href: `/${lang}/chi-siamo`, label: t.footer.about },
            { href: `/${lang}/contribuisci`, label: t.footer.contribute },
            { href: `/${lang}/connect`, label: t.nav.connect },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors w-fit">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Resources / legal */}
        <nav className="md:col-span-2 flex flex-col gap-2.5" aria-label={t.footer.legal_label}>
          <p className="font-mono text-xs tracking-widest uppercase text-[var(--muted)] mb-1.5">
            {t.footer.legal_label}
          </p>
          {[
            { href: `/${lang}/contatti`, label: t.footer.contact },
            { href: `/${lang}/confronto`, label: t.footer.comparator },
            { href: `/${lang}/disclaimer`, label: t.footer.disclaimer },
            { href: `/${lang}/privacy`, label: t.footer.privacy },
            { href: `/${lang}/termini`, label: t.footer.terms },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors w-fit">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Newsletter */}
        <div className="col-span-2 md:col-span-4">
          <p className="font-mono text-xs tracking-widest uppercase text-[var(--muted)] mb-4">
            {t.footer.newsletter_label}
          </p>
          <NewsletterForm lang={lang} t={t} compact />
        </div>
      </div>

      {/* Affiliate disclosure */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6">
          <p className="font-mono text-[0.68rem] text-[var(--muted)] leading-relaxed">
            {t.footer.affiliate}
          </p>
          <p className="font-mono text-[0.65rem] text-[var(--muted)] mt-3">{t.footer.rights}</p>
          <p className="font-mono text-[0.6rem] text-[var(--muted)] mt-4 opacity-70">
            {lang === "it"
              ? "Composto in Hanken Grotesk, Newsreader e IBM Plex Mono. Evidenza da PubMed. Fatto a mano in Italia."
              : "Set in Hanken Grotesk, Newsreader and IBM Plex Mono. Evidence from PubMed. Handmade in Italy."}
          </p>
        </div>
      </div>
    </footer>
  );
}
