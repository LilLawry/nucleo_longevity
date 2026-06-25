import type { Metadata } from "next";
import { Hanken_Grotesk, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://nucleolongevity.com"),
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
        {children}
      </body>
    </html>
  );
}
