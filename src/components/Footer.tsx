import Link from "next/link";
import type { Locale } from "@/locales/it";
import NewsletterForm from "./NewsletterForm";

export default function Footer({ lang, t }: { lang: string; t: Locale }) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg)] mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <p className="font-sans font-medium text-sm tracking-[0.18em] uppercase text-[var(--fg)] mb-2">
            Nucleo Longevity
          </p>
          <p className="text-sm text-[var(--muted)] leading-relaxed">{t.footer.tagline}</p>
        </div>

        {/* Newsletter */}
        <div className="md:col-span-1">
          <p className="font-mono text-xs tracking-widest uppercase text-[var(--muted)] mb-4">
            {t.footer.newsletter_label}
          </p>
          <NewsletterForm lang={lang} t={t} compact />
        </div>

        {/* Links */}
        <div className="md:col-span-1 flex flex-col gap-2">
          <p className="font-mono text-xs tracking-widest uppercase text-[var(--muted)] mb-2">Link</p>
          <Link href={`/${lang}/privacy`} className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
            {t.footer.privacy}
          </Link>
          <Link href={`/${lang}/metodo`} className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors">
            {t.nav.metodo}
          </Link>
        </div>
      </div>

      {/* Affiliate disclosure */}
      <div className="border-t border-[var(--border)]">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-6">
          <p className="font-mono text-[0.68rem] text-[var(--muted)] leading-relaxed">
            {t.footer.affiliate}
          </p>
          <p className="font-mono text-[0.65rem] text-[var(--muted)] mt-3">{t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
