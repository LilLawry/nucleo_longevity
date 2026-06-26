/**
 * NucleusMark — the Nucleo brand symbol: a heavy ring with a small centred core
 * (brand spec: ring r43 / stroke 14, core r6.5 on a 100×100 grid). No orbits,
 * no electrons — the mark is exactly the symbol from the brand system. Inherits
 * color via `currentColor`, so it themes automatically in light/dark.
 *
 * `animated` gives the core a gentle pulse (decorative placements only).
 */
export default function NucleusMark({
  size = 40,
  animated = false,
  className = "",
  glow = false,
}: {
  size?: number | string;
  animated?: boolean;
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      className={className}
      style={glow ? { filter: "drop-shadow(0 0 12px rgba(17,96,95,0.35))" } : undefined}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="43" stroke="currentColor" strokeWidth="14" />
      <circle cx="50" cy="50" r="6.5" fill="currentColor" className={animated ? "nucleus-core" : ""} />
    </svg>
  );
}
