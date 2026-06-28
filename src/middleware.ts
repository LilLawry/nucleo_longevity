import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Keep only the production domain indexable. Any other host (Vercel preview
 * deployments like *.vercel.app, branch aliases) is marked noindex so search
 * engines don't split signals across duplicate copies.
 */
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  const res = NextResponse.next();
  const isProd = host === "www.nucleolongevity.com" || host === "nucleolongevity.com";
  if (!isProd) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow");
  }
  return res;
}

export const config = {
  // Run on pages, skip static assets and image optimizer.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|svg|jpg|jpeg|gif|webp|ico|xml|txt)$).*)"],
};
