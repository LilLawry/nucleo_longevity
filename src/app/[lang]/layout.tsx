import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isValidLang, getLocale } from "@/lib/i18n";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import ThemeProvider from "@/components/ThemeProvider";
import BackToTop from "@/components/BackToTop";
import HtmlLang from "@/components/HtmlLang";

export async function generateStaticParams() {
  return [{ lang: "it" }, { lang: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isIt = lang === "it";
  return {
    alternates: {
      languages: {
        it: "/it",
        en: "/en",
        "x-default": "/it",
      },
    },
    openGraph: {
      locale: isIt ? "it_IT" : "en_US",
      alternateLocale: isIt ? "en_US" : "it_IT",
    },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isValidLang(lang)) notFound();
  const t = getLocale(lang);

  return (
    <ThemeProvider>
      <HtmlLang lang={lang} />
      <Header lang={lang} t={t} />
      <main className="min-h-screen">{children}</main>
      <Footer lang={lang} t={t} />
      <BackToTop />
      <CookieBanner t={t} />
    </ThemeProvider>
  );
}
