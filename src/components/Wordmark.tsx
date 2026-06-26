import NucleusMark from "./NucleusMark";

/**
 * Wordmark — the Nucleo lockup with the brand symbol forming the "O" of NUCLEO.
 * "NUCLE◉ · LONGEVITY". Uses currentColor for the text; the symbol picks up the
 * accent. Sizes scale from the surrounding font-size.
 */
export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center font-sans font-medium uppercase tracking-[0.18em] leading-none text-[var(--fg)] ${className}`}
    >
      <span>NUCLE</span>
      <NucleusMark size="1em" className="mx-[0.04em] -translate-y-[0.01em] text-[var(--accent)]" />
      <span className="text-[var(--accent)] mx-[0.35em]">·</span>
      <span>LONGEVITY</span>
    </span>
  );
}
