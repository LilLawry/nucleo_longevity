"use client";
import { useEffect } from "react";

/**
 * Sets <html lang> to the active locale. The root layout can't know the locale
 * (it's above the [lang] segment), so we correct it here for accessibility and
 * for crawlers that execute JS — English pages should not declare lang="it".
 */
export default function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
