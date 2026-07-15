import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLang, langs } from "@/lib/i18n";
import { getAllMolecules } from "@/lib/molecole";
import { getOffersForMolecule, NKF_DEMO_MODE } from "@/lib/offers";
import EvidenceBadge from "@/components/EvidenceBadge";

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
  const title = it ? "Confronta prezzi" : "Compare prices";
  const description = it
    ? "Confronta prezzo e disponibilità delle molecole presso venditori che operano in Italia. Prezzi indicativi, ranking per prezzo, fonti trasparenti."
    : "Compare price and availability of molecules across sellers operating in Italy. Indicative prices, price-based ranking, transparent sources.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/prezzi`,
      languages: { it: "/it/prezzi", en: "/en/prezzi", "x-default": "/en/prezzi" },
    },
  };
}

export default async function PricesHubPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const it = lang === "it";

  // Molecules that actually have at least one offer, with their cheapest.
  const rows = getAllMolecules()
    .map((m) => {
      const offers = getOffersForMolecule(m.slug).filter((o) => o.status !== "unavailable");
      if (offers.length === 0) return null;
      const active = offers.filter((o) => o.status === "active");
      const cheapest = (active.length ? active : offers).reduce((best, o) => {
        const v = o.total ?? o.price;
        const bv = best.total ?? best.price;
        return v < bv ? o : best;
      });
      return { m, count: offers.length, from: cheapest.total ?? cheapest.price };
    })
    .filter(Boolean) as { m: ReturnType<typeof getAllMolecules>[number]; count: number; from: number }[];

  rows.sort((a, b) => b.count - a.count || a.from - b.from);

  const L = {
    eyebrow: it ? "Confronto prezzi" : "Price comparison",
    title: it ? "Confronta prezzi e disponibilità" : "Compare prices & availability",
    intro: it
      ? "Prezzo e reperibilità delle molecole presso venditori che operano in Italia. Il prezzo è indicativo: verifica sempre sul sito del venditore. La commissione non influenza l'ordine."
      : "Price and availability of molecules across sellers operating in Italy. Prices are indicative — always verify on the seller's site. Commission never influences the order.",
    molecule: it ? "Molecola" : "Molecule",
    sellers: it ? "Venditori" : "Sellers",
    from: it ? "Da" : "From",
    grade: it ? "Grado" : "Grade",
    empty: it ? "Nessuna offerta ancora disponibile." : "No offers available yet.",
    method: it ? "Come funziona il confronto" : "How the comparison works",
    view: it ? "Vedi offerte" : "View offers",
  };

  return (
    <div className="max-w-5xl mx-auto px-5 sm:px-8 py-16 md:py-24">
      <div className="flex items-baseline gap-3 mb-4">
        <p className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)]">{L.eyebrow}</p>
        {NKF_DEMO_MODE && (
          <span className="font-mono text-[0.55rem] uppercase tracking-widest text-[#B5975D] border border-[#B5975D] px-2 py-0.5">
            demo
          </span>
        )}
      </div>
      <h1 className="font-serif font-medium text-4xl sm:text-5xl tracking-[-0.02em] text-[var(--fg)] mb-5 text-balance">
        {L.title}
      </h1>
      <p className="font-sans text-lg text-[var(--muted)] leading-relaxed max-w-2xl mb-4 text-pretty">{L.intro}</p>
      <Link href={`/${lang}/confronto`} className="inline-block font-mono text-xs text-[var(--accent)] link-underline mb-10">
        {L.method} →
      </Link>

      {rows.length === 0 ? (
        <p className="font-sans text-sm text-[var(--muted)] py-10">{L.empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[560px]">
            <thead>
              <tr className="border-b-2 border-[var(--border)] text-left">
                {[L.molecule, L.grade, L.sellers, L.from, ""].map((h, i) => (
                  <th key={i} className="py-2.5 pr-4 font-mono text-[0.55rem] uppercase tracking-widest text-[var(--accent)] font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ m, count, from }) => (
                <tr key={m.slug} className="border-b border-[var(--border)] hover:bg-[var(--bg-elev)] transition-colors">
                  <td className="py-3 pr-4">
                    <Link href={`/${lang}/molecule/${m.slug}#offers`} className="font-sans font-medium text-[var(--fg)] hover:text-[var(--accent)] transition-colors">
                      {m.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4">{m.grade ? <EvidenceBadge grade={m.grade} /> : "—"}</td>
                  <td className="py-3 pr-4 tabular text-[var(--muted)]">{count}</td>
                  <td className="py-3 pr-4 tabular font-medium text-[var(--fg)]">€{from.toFixed(2)}</td>
                  <td className="py-3">
                    <Link href={`/${lang}/molecule/${m.slug}#offers`} className="font-mono text-[0.66rem] text-[var(--accent)] link-underline whitespace-nowrap">
                      {L.view} →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
