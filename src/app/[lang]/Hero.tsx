"use client";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import NucleusMark from "@/components/NucleusMark";
import type { Locale } from "@/locales/it";

interface Mol { id: string; nome: string; nome_en: string; grado: string }

export default function Hero({
  lang,
  t,
  molecules,
}: {
  lang: string;
  t: Locale;
  molecules: Mol[];
}) {
  const reduce = useReducedMotion();
  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] min-h-[94vh] flex flex-col">
      <div className="absolute inset-0 grid-surface" aria-hidden />
      <div className="hero-depth" aria-hidden />

      {/* Animated molecular backdrop (behind content) */}
      {!reduce && (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden>
          {/* concentric pulse rings, centred-right near the nucleus */}
          <div className="absolute top-1/2 right-[14%] -translate-y-1/2 hidden lg:block">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute left-1/2 top-1/2 rounded-full border border-[var(--accent)]"
                style={{ width: 360, height: 360, marginLeft: -180, marginTop: -180 }}
                initial={{ scale: 0.45, opacity: 0 }}
                animate={{ scale: 1.45, opacity: [0, 0.18, 0] }}
                transition={{ duration: 7, delay: i * 2.33, repeat: Infinity, ease: "easeOut" }}
              />
            ))}
          </div>
          {/* slow drifting particles */}
          {[
            { x: "18%", y: "30%", d: 9 },
            { x: "32%", y: "68%", d: 12 },
            { x: "72%", y: "22%", d: 10 },
            { x: "84%", y: "60%", d: 14 },
            { x: "54%", y: "44%", d: 11 },
          ].map((p, i) => (
            <motion.span
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[var(--accent)] opacity-30"
              style={{ left: p.x, top: p.y }}
              animate={{ y: [0, -14, 0], opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
            />
          ))}
        </div>
      )}

      {/* Masthead */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-5 sm:px-8">
        <div className="flex items-center gap-3 sm:gap-4 py-3 border-b border-[var(--border)] font-mono text-[0.6rem] sm:text-[0.65rem] tracking-widest uppercase text-[var(--muted)]">
          {t.home.masthead.map((m, i) => (
            <span key={m} className="flex items-center gap-3 sm:gap-4">
              {i > 0 && <span className="text-[var(--accent)]">/</span>}
              {m}
            </span>
          ))}
          <span className="ml-auto flex items-center gap-2 text-[var(--accent)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="hidden sm:inline">PubMed</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="cropmarks max-w-6xl mx-auto w-full px-5 sm:px-8 py-14 grid lg:grid-cols-[1.25fr_0.75fr] gap-10 items-center">
          <div>
            <motion.div
              {...rise(0)}
              className="inline-flex items-center gap-2.5 mb-8 border border-[var(--border)] rounded-full pl-2 pr-3.5 py-1 bg-[var(--bg-elev)]"
            >
              <NucleusMark size={16} className="text-[var(--accent)]" />
              <span className="font-mono text-[0.62rem] tracking-widest uppercase text-[var(--muted)]">
                Nucleo · Longevity
              </span>
            </motion.div>

            <motion.h1
              {...rise(0.08)}
              className="font-serif font-medium text-[clamp(3.5rem,12vw,9.5rem)] leading-[0.95] tracking-[-0.025em] text-[var(--fg)] mb-6"
            >
              {t.home.big_line}
              <br />
              <span className="italic text-[var(--accent)]">{t.home.big_accent}</span>
            </motion.h1>

            <motion.p
              {...rise(0.16)}
              className="font-sans text-lg sm:text-xl text-[var(--muted)] leading-relaxed max-w-md mb-9 text-pretty"
            >
              {t.home.big_sub}
            </motion.p>

            <motion.div {...rise(0.24)} className="flex flex-wrap items-center gap-3">
              <Link href={`/${lang}/database`} className="btn-accent font-sans font-medium text-sm px-6 py-3">
                {t.home.cta_database} →
              </Link>
              <a
                href="#subscribe"
                className="font-sans font-medium text-sm px-6 py-3 border border-[var(--border)] text-[var(--fg)] hover:border-[var(--accent)] transition-colors"
              >
                {t.hero.cta}
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
            animate={reduce ? undefined : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex items-center justify-center"
          >
            <NucleusMark size={340} animated className="text-[var(--accent)]" />
          </motion.div>
        </div>
      </div>

      {/* Bottom marquee — real graded molecules */}
      <div className="relative z-10 max-w-6xl mx-auto w-full px-5 sm:px-8 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 border-t border-[var(--border)] pt-5">
          <p className="font-mono text-[0.65rem] uppercase tracking-widest text-[var(--muted)] leading-relaxed shrink-0">
            {t.home.marquee_label[0]}
            <br />
            {t.home.marquee_label[1]}
          </p>
          <div className="marquee flex-1 min-w-0">
            <div className="marquee__track">
              {[0, 1].map((dup) => (
                <div key={dup} className="flex items-center">
                  {molecules.map((m) => {
                    const nm = lang === "en" ? m.nome_en : m.nome;
                    return (
                      <span key={dup + m.id} className="flex items-center gap-2.5 pr-8">
                        <span className="liquid-glass w-7 h-7 rounded-lg flex items-center justify-center font-serif font-semibold text-[0.8rem] text-[var(--fg)] shrink-0">
                          {nm[0]}
                        </span>
                        <span className="font-sans text-sm font-semibold text-[var(--fg)] whitespace-nowrap">{nm}</span>
                        <span className="font-mono text-[0.7rem] text-[var(--accent)]">{m.grado}</span>
                      </span>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
