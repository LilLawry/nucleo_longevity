/**
 * NucleusMark — the Nucleo brand symbol.
 *
 * Canonical mark = a heavy ring with a small centred core (matches the brand
 * system: ring r43 / stroke 14, core r6.5 on a 100×100 grid). Inherits color
 * via `currentColor`, so it themes automatically in light/dark.
 *
 * `orbits` adds the ambient orbital shells + travelling electrons used only as
 * a large decorative graphic (hero / CTA). The symbol itself is unchanged.
 */

// Ellipse traced by each electron, in the expanded -30…130 viewBox.
const ORBIT_PATH =
  "M -22,50 a 72,26 0 1,0 144,0 a 72,26 0 1,0 -144,0";
const TILTS = [0, 60, 120];

export default function NucleusMark({
  size = 40,
  orbits = false,
  animated = false,
  className = "",
  glow = false,
}: {
  size?: number | string;
  orbits?: boolean;
  animated?: boolean;
  className?: string;
  glow?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox={orbits ? "-30 -30 160 160" : "0 0 100 100"}
      fill="none"
      className={className}
      style={glow ? { filter: "drop-shadow(0 0 12px rgba(17,96,95,0.4))" } : undefined}
      aria-hidden="true"
    >
      {orbits && (
        <>
          {/* Orbital shells */}
          <g stroke="currentColor" strokeWidth="1" opacity="0.28">
            {TILTS.map((t) => (
              <ellipse key={t} cx="50" cy="50" rx="72" ry="26" transform={`rotate(${t} 50 50)`} />
            ))}
          </g>
          {/* Electrons */}
          <g fill="currentColor">
            {TILTS.map((t, i) =>
              animated ? (
                <g key={t} transform={`rotate(${t} 50 50)`}>
                  <circle
                    r="4.5"
                    className="nucleus-electron"
                    style={{ offsetPath: `path('${ORBIT_PATH}')`, animationDelay: `${i * -2.7}s` }}
                  />
                </g>
              ) : (
                <circle key={t} cx="122" cy="50" r="4.5" transform={`rotate(${t} 50 50)`} />
              )
            )}
          </g>
        </>
      )}

      {/* Canonical brand symbol */}
      <circle cx="50" cy="50" r="43" stroke="currentColor" strokeWidth="14" />
      <circle
        cx="50"
        cy="50"
        r="6.5"
        fill="currentColor"
        className={orbits && animated ? "nucleus-core" : ""}
      />
    </svg>
  );
}
