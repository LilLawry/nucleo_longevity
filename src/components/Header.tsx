"use client";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import type { Locale } from "@/locales/it";
import type { Lang } from "@/lib/i18n";
import Wordmark from "./Wordmark";

export default function Header({ lang, t }: { lang: string; t: Locale }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const otherLang: Lang = lang === "it" ? "en" : "it";
  const navLinks = [
    { href: `/${lang}/molecole`, label: t.nav.molecole },
    { href: `/${lang}/analisi`, label: t.nav.analisi },
    { href: `/${lang}/metodo`, label: t.nav.metodo },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)] shadow-[0_4px_24px_-16px_var(--glow)]"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-14 flex items-center justify-between gap-6">
        {/* Logo */}
        <Link
          href={`/${lang}`}
          className="group flex items-center shrink-0"
          aria-label="Nucleo Longevity — home"
        >
          <Wordmark className="text-sm [&_svg]:transition-transform [&_svg]:duration-500 group-hover:[&_svg]:rotate-180" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-sans text-sm font-medium text-[var(--muted)] hover:text-[var(--fg)] transition-colors tracking-wide link-underline"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <Link
            href={`/${otherLang}`}
            className="font-mono text-xs tracking-widest uppercase text-[var(--muted)] hover:text-[var(--accent)] hover:border-[var(--accent)] transition-colors border border-[var(--border)] rounded px-2.5 py-1"
          >
            {otherLang}
          </Link>

          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Cambia tema"
              className="w-8 h-8 flex items-center justify-center text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            >
              {theme === "dark" ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          )}

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-[var(--muted)]"
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-[var(--border)] bg-[var(--bg)] px-5 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="font-sans text-sm font-medium text-[var(--fg)] py-1 tracking-wide"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
