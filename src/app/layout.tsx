import type { Metadata } from "next";
import { Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const SITE = "https://www.nucleolongevity.com";
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nucleo Longevity",
  url: SITE,
  logo: `${SITE}/apple-touch-icon.png`,
  description:
    "Analisi indipendente di studi su molecole e integratori per la longevità. Evidenza graduata A–F, fonti PubMed.",
  slogan: "Dati clinici. Zero filtri di marketing.",
};
const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Nucleo Longevity",
  url: SITE,
  inLanguage: ["it", "en"],
};

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nucleolongevity.com"),
  title: {
    default: "Nucleo Longevity — Dati clinici. Zero filtri di marketing.",
    template: "%s · Nucleo Longevity",
  },
  description:
    "Analisi indipendente di studi su molecole e integratori per la longevità. Evidenza graduata, niente hype.",
  openGraph: {
    type: "website",
    locale: "it_IT",
    alternateLocale: "en_US",
    siteName: "Nucleo Longevity",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body className={`${hanken.variable} ${plexMono.variable}`}>
        <JsonLd data={orgJsonLd} />
        <JsonLd data={siteJsonLd} />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
