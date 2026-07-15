import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang, langs } from "@/lib/i18n";

export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const it = lang === "it";
  const title = it ? "Come funziona il confronto" : "How the comparison works";
  const description = it
    ? "Come Núkleo confronta prezzi e disponibilità: fonti, aggiornamento, ranking, link affiliati e link esterni, e i limiti del confronto."
    : "How Núkleo compares prices and availability: sources, updates, ranking, affiliate vs external links, and the limits of the comparison.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/confronto`,
      languages: { it: "/it/confronto", en: "/en/confronto", "x-default": "/en/confronto" },
    },
  };
}

export default async function ComparisonMethodPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const it = lang === "it";

  const blocks = it
    ? [
        ["Copertura non esaustiva", "Il confronto non include necessariamente tutti i venditori presenti sul mercato. Mostriamo i venditori per cui abbiamo dati affidabili e autorizzati. L'assenza di un negozio non è un giudizio sul negozio."],
        ["Da dove vengono i dati", "I prezzi e la disponibilità provengono da feed autorizzati dei venditori, da programmi di affiliazione o da inserimento manuale verificato. Non facciamo scraping di siti terzi e non copiamo descrizioni, immagini o recensioni altrui."],
        ["Ogni prezzo ha una data", "Ogni offerta riporta la data in cui il prezzo è stato registrato. I prezzi sono indicativi e possono cambiare: verifica sempre il prezzo finale, la spedizione e le condizioni sul sito del venditore prima di acquistare."],
        ["Come ordiniamo i risultati", "L'ordine è organico: prima le offerte disponibili, poi per prezzo totale crescente quando la spedizione è nota (altrimenti per prezzo del prodotto), poi per aggiornamento più recente. La commissione affiliata NON influenza mai l'ordine."],
        ["Link affiliati e link esterni", "Alcuni link sono affiliati: se acquisti tramite quel link, Núkleo può ricevere una commissione, che NON aumenta il prezzo che paghi. Dove non abbiamo un accordo con il venditore, il link è un normale link esterno e non riceviamo nulla. Lo indichiamo con chiarezza."],
        ["Possibili errori", "Nonostante i controlli, un prezzo o una disponibilità possono risultare non aggiornati. Le offerte non aggiornate vengono attenuate e segnalate come 'prezzo da verificare'. Segnalaci eventuali errori e li correggiamo."],
        ["Non è un consiglio medico", "Il confronto riguarda caratteristiche e disponibilità commerciale. Non fornisce diagnosi, prescrizioni o consigli terapeutici. Per decisioni di salute, rivolgiti a un medico o a un professionista sanitario."],
      ]
    : [
        ["Coverage is not exhaustive", "The comparison does not necessarily include every seller on the market. We show sellers for whom we have reliable, authorised data. A shop's absence is not a judgement on that shop."],
        ["Where the data comes from", "Prices and availability come from authorised merchant feeds, affiliate programs, or verified manual entry. We do not scrape third-party sites and we do not copy others' descriptions, images or reviews."],
        ["Every price has a date", "Each offer shows the date the price was recorded. Prices are indicative and can change: always verify the final price, shipping and conditions on the seller's site before buying."],
        ["How results are ranked", "Ranking is organic: available offers first, then by ascending total price when shipping is known (otherwise by product price), then by most recent update. Affiliate commission NEVER influences the order."],
        ["Affiliate vs external links", "Some links are affiliate links: if you buy through one, Núkleo may earn a commission, which does NOT increase the price you pay. Where we have no agreement with the seller, the link is a plain external link and we earn nothing. We label this clearly."],
        ["Possible errors", "Despite checks, a price or availability can be out of date. Stale offers are de-emphasised and flagged 'price to verify'. Tell us about any errors and we'll fix them."],
        ["Not medical advice", "The comparison is about commercial features and availability. It does not provide diagnosis, prescriptions or therapeutic advice. For health decisions, consult a doctor or healthcare professional."],
      ];

  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)] mb-4">
        {it ? "Trasparenza" : "Transparency"}
      </p>
      <h1 className="font-serif font-medium text-4xl sm:text-5xl tracking-[-0.02em] text-[var(--fg)] mb-5 text-balance">
        {it ? "Come funziona il confronto" : "How the comparison works"}
      </h1>
      <p className="font-sans text-lg text-[var(--muted)] leading-relaxed mb-12 text-pretty">
        {it
          ? "Núkleo confronta prezzo e reperibilità di prodotti presso venditori che operano in Italia. Ecco, in chiaro, come lo facciamo e quali sono i limiti."
          : "Núkleo compares the price and availability of products across sellers operating in Italy. Here, in plain terms, is how we do it and where the limits are."}
      </p>

      <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
        {blocks.map(([h, body]) => (
          <section key={h} className="py-7">
            <h2 className="font-sans font-medium text-lg text-[var(--fg)] mb-2">{h}</h2>
            <p className="font-sans text-[0.95rem] text-[var(--muted)] leading-relaxed text-pretty">{body}</p>
          </section>
        ))}
      </div>

      <p className="font-mono text-[0.62rem] text-[var(--muted)] leading-relaxed mt-10">
        {it ? "Domande sul confronto? " : "Questions about the comparison? "}
        <Link href={`/${lang}/contatti`} className="text-[var(--accent)] link-underline">
          {it ? "Contattaci" : "Contact us"}
        </Link>
        .
      </p>
    </div>
  );
}
