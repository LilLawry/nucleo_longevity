import type { Metadata } from "next";
import { getLocale, isValidLang } from "@/lib/i18n";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const t = getLocale(lang as "it" | "en");
  return { title: t.privacy.title };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <h1 className="font-sans font-medium text-4xl tracking-[-0.03em] text-[var(--fg)] mb-10">
        {lang === "it" ? "Privacy & Cookie Policy" : "Privacy & Cookie Policy"}
      </h1>
      <div className="prose prose-sm max-w-none dark:prose-invert font-sans">
        {lang === "it" ? (
          <>
            <h2>1. Titolare del trattamento</h2>
            <p>Nucleo Longevity — nucleolongevity.com</p>

            <h2>2. Dati raccolti</h2>
            <p>Raccogliamo indirizzi email forniti volontariamente tramite il modulo di iscrizione alla newsletter. Non raccogliamo dati sensibili.</p>

            <h2>3. Cookie</h2>
            <p><strong>Cookie tecnici</strong> (sempre attivi): necessari per il funzionamento del sito.</p>
            <p><strong>Cookie analitici</strong> (richiedono consenso): utilizziamo analytics anonimi per capire come viene utilizzato il sito.</p>
            <p>Puoi revocare il consenso in qualsiasi momento svuotando i dati del browser.</p>

            <h2>4. Link di affiliazione</h2>
            <p>Alcuni link presenti sul sito sono link di affiliazione. Guadagniamo una commissione se effettui un acquisto tramite questi link, senza costi aggiuntivi per te. Questo non influenza le nostre valutazioni editoriali.</p>

            <h2>5. Diritti dell&apos;interessato</h2>
            <p>Hai diritto di accesso, rettifica, cancellazione e portabilità dei tuoi dati. Per esercitare i tuoi diritti: privacy@nucleolongevity.com</p>

            <h2>6. Aggiornamenti</h2>
            <p>Questa policy può essere aggiornata. La data di ultima modifica è indicata in fondo alla pagina.</p>
            <p className="text-[var(--muted)] font-mono text-xs">Ultima revisione: 2026-01-01</p>
          </>
        ) : (
          <>
            <h2>1. Data controller</h2>
            <p>Nucleo Longevity — nucleolongevity.com</p>

            <h2>2. Data collected</h2>
            <p>We collect email addresses voluntarily provided via the newsletter signup form. We do not collect sensitive data.</p>

            <h2>3. Cookies</h2>
            <p><strong>Technical cookies</strong> (always active): necessary for site operation.</p>
            <p><strong>Analytics cookies</strong> (require consent): we use anonymous analytics to understand how the site is used.</p>
            <p>You can withdraw consent at any time by clearing your browser data.</p>

            <h2>4. Affiliate links</h2>
            <p>Some links on the site are affiliate links. We earn a commission if you make a purchase through these links, at no extra cost to you. This does not influence our editorial ratings.</p>

            <h2>5. Your rights</h2>
            <p>You have the right of access, rectification, deletion and portability of your data. To exercise your rights: privacy@nucleolongevity.com</p>

            <h2>6. Updates</h2>
            <p>This policy may be updated. The last modification date is shown below.</p>
            <p className="text-[var(--muted)] font-mono text-xs">Last revised: 2026-01-01</p>
          </>
        )}
      </div>
    </div>
  );
}
