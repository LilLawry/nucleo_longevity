import { getOffersForMolecule, NKF_DEMO_MODE, type ComputedOffer } from "@/lib/offers";

/**
 * OfferTable — the "Where to buy" price comparator for a molecule.
 * Organic ranking (price/availability), honest disclosure, sourced dates,
 * and demo labelling. Renders nothing when there are no offers.
 */
export default function OfferTable({ slug, lang }: { slug: string; lang: string }) {
  const offers = getOffersForMolecule(slug);
  if (offers.length === 0) return null;
  const it = lang !== "en";

  const anyAffiliate = offers.some((o) => o.merchant.affiliate);

  const L = {
    title: it ? "Dove acquistare" : "Where to buy",
    sub: it
      ? "Confronto di prezzo e reperibilità presso venditori che operano in Italia. Il prezzo mostrato è indicativo: verifica sempre sul sito del venditore."
      : "Price and availability comparison across sellers operating in Italy. Prices are indicative — always verify on the seller's site.",
    merchant: it ? "Venditore" : "Seller",
    price: it ? "Prezzo" : "Price",
    ship: it ? "Spedizione" : "Shipping",
    total: it ? "Totale" : "Total",
    perUnit: it ? "Prezzo unitario" : "Unit price",
    updated: it ? "Aggiornato" : "Updated",
    go: it ? "Vai al negozio" : "Go to store",
    shipUnknown: it ? "da verificare" : "to verify",
    totalUnknown: it ? "n/d" : "n/a",
    stale: it ? "prezzo da verificare" : "price to verify",
    demo: it
      ? "Dati dimostrativi — offerte fittizie a scopo illustrativo, non prezzi reali."
      : "Demo data — fictional offers for illustration, not real prices.",
    disclosureNoAff: it
      ? "Núkleo non ha accordi commerciali con questi venditori: i link sono link esterni normali. Il confronto non include necessariamente tutti i venditori sul mercato."
      : "Núkleo has no commercial agreement with these sellers: links are plain external links. The comparison does not necessarily include every seller on the market.",
    disclosureAff: it
      ? "Núkleo può ricevere una commissione quando acquisti tramite alcuni link. La commissione non aumenta il prezzo pagato e non influenza l'ordine dei risultati. Il confronto non è esaustivo."
      : "Núkleo may earn a commission when you buy through some links. The commission does not raise your price and does not influence the ranking. The comparison is not exhaustive.",
    method: it ? "Come funziona il confronto" : "How the comparison works",
  };

  return (
    <section className="py-8 border-t border-[var(--border)]" id="offers">
      <div className="flex items-baseline justify-between gap-4 mb-1">
        <h2 className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)]">{L.title}</h2>
        {NKF_DEMO_MODE && (
          <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[#B5975D] border border-[#B5975D] px-2 py-0.5">
            demo
          </span>
        )}
      </div>
      <p className="font-sans text-sm text-[var(--muted)] leading-relaxed max-w-2xl mb-5">{L.sub}</p>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm min-w-[640px]">
          <thead>
            <tr className="border-b-2 border-[var(--border)] text-left">
              {[L.merchant, L.price, L.ship, L.total, L.perUnit, L.updated, ""].map((h, i) => (
                <th key={i} className="py-2.5 pr-4 font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {offers.map((o) => (
              <OfferRow key={o.id} o={o} L={L} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Disclosure — honest about the (absence of) commercial relationship */}
      <p className="font-mono text-[0.62rem] text-[var(--muted)] leading-relaxed mt-5 max-w-2xl">
        {NKF_DEMO_MODE ? `${L.demo} ` : ""}
        {anyAffiliate ? L.disclosureAff : L.disclosureNoAff}
      </p>
    </section>
  );
}

function OfferRow({ o, L }: { o: ComputedOffer; L: Record<string, string> }) {
  const stale = o.status === "stale";
  const money = (n: number) => `€${n.toFixed(2)}`;
  return (
    <tr className={`border-b border-[var(--border)] ${stale ? "opacity-60" : ""}`}>
      <td className="py-3 pr-4">
        <div className="font-sans font-medium text-[var(--fg)]">{o.merchant.name}</div>
        <div className="font-mono text-[0.6rem] text-[var(--muted)] mt-0.5">{o.productTitle}</div>
      </td>
      <td className="py-3 pr-4 tabular text-[var(--fg)]">{money(o.price)}</td>
      <td className="py-3 pr-4 tabular text-[var(--muted)]">
        {o.shipping === null ? L.shipUnknown : o.shipping === 0 ? (L.ship === "Spedizione" ? "gratis" : "free") : money(o.shipping)}
      </td>
      <td className="py-3 pr-4 tabular font-medium text-[var(--fg)]">
        {stale ? L.stale : o.totalCalculable ? money(o.total as number) : L.totalUnknown}
      </td>
      <td className="py-3 pr-4 tabular text-[var(--muted)] whitespace-nowrap">
        {o.perUnit ? `${money(o.perUnit.value).replace("€", "€")} ${o.perUnit.label.replace("€/", "/")}` : "—"}
      </td>
      <td className="py-3 pr-4 font-mono text-[0.66rem] text-[var(--muted)] tabular whitespace-nowrap">{o.sourcedAt}</td>
      <td className="py-3">
        <a
          href={`/go/${o.id}`}
          target="_blank"
          rel={o.merchant.affiliate ? "sponsored nofollow noopener" : "nofollow noopener"}
          className="inline-block btn-accent font-sans font-medium text-xs px-4 py-2 whitespace-nowrap"
        >
          {L.go} →
        </a>
      </td>
    </tr>
  );
}
