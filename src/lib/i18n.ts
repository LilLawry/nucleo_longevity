import it from "@/locales/it";
import en from "@/locales/en";

export type Lang = "it" | "en";
export const defaultLang: Lang = "en";
export const langs: Lang[] = ["en", "it"];

const locales = { it, en };

export function getLocale(lang: Lang) {
  return locales[lang] ?? locales[defaultLang];
}

export function isValidLang(lang: string): lang is Lang {
  return langs.includes(lang as Lang);
}
