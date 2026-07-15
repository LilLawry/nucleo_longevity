import { NextResponse } from "next/server";
import { getOfferById, getMerchant, isAllowedOfferUrl } from "@/lib/offers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * /go/[id] — outbound redirect to a merchant offer.
 *
 * Safety (from the comparator spec):
 *  - the offer must exist and be active;
 *  - its destination host must be on the domain allowlist (no open redirect);
 *  - the response is noindex and the referrer is stripped;
 *  - it 302-redirects (temporary) so the affiliate/commercial URL is never
 *    treated as canonical.
 * Click logging here is intentionally minimal (no IP, no query, no PII).
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const offer = getOfferById(id);

  if (!offer || offer.status === "unavailable" || !isAllowedOfferUrl(offer.url)) {
    return new NextResponse("Offer not available", {
      status: 404,
      headers: { "X-Robots-Tag": "noindex, nofollow" },
    });
  }

  const merchant = getMerchant(offer.merchantId);
  // Minimised, non-identifying click signal only.
  console.info("[nkf-click]", JSON.stringify({
    offer: offer.id,
    molecule: offer.moleculeSlug,
    merchant: merchant?.id ?? "unknown",
    affiliate: Boolean(merchant?.affiliate),
    at: new Date().toISOString(),
  }));

  return NextResponse.redirect(offer.url, {
    status: 302,
    headers: {
      "X-Robots-Tag": "noindex, nofollow",
      "Referrer-Policy": "no-referrer",
      "Cache-Control": "no-store",
    },
  });
}
