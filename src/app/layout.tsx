import type { Metadata } from "next";
import { Hanken_Grotesk, IBM_Plex_Mono, Newsreader } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import Script from "next/script";
import "./globals.css";

const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

const SITE = "https://www.nucleolongevity.com";
const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nucleo Longevity",
  url: SITE,
  logo: `${SITE}/apple-touch-icon.png`,
  description:
    "Independent analysis of studies on longevity molecules and supplements. A–F graded evidence, PubMed sources.",
  slogan: "Clinical data. Zero marketing filters.",
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

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.nucleolongevity.com"),
  title: {
    default: "Nucleo Longevity — Clinical data. Zero marketing filters.",
    template: "%s · Nucleo Longevity",
  },
  description:
    "Independent analysis of studies on longevity molecules and supplements. Graded evidence, no hype.",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: "it_IT",
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${hanken.variable} ${plexMono.variable} ${newsreader.variable}`}>
        <JsonLd data={orgJsonLd} />
        <JsonLd data={siteJsonLd} />
        {children}
        {PLAUSIBLE_DOMAIN && (
          <Script
            defer
            data-domain={PLAUSIBLE_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
