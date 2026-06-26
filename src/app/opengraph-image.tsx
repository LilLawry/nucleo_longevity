import { ImageResponse } from "next/og";

export const alt = "Nucleo Longevity — Dati clinici. Zero filtri di marketing.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand palette
const INK = "#0E1214";
const BASE = "#EEF1F1";
const TEAL = "#11605F";
const TEAL_300 = "#9FBEBC";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: INK,
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand row: nucleus + wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: "50%",
              border: `14px solid ${TEAL_300}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: TEAL_300 }} />
          </div>
          <div
            style={{
              fontSize: 34,
              letterSpacing: 8,
              color: BASE,
              fontWeight: 600,
            }}
          >
            NUCLEO · LONGEVITY
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, color: BASE, fontWeight: 600, letterSpacing: -2 }}>
            Dati clinici.
          </div>
          <div style={{ fontSize: 76, lineHeight: 1.05, color: TEAL_300, fontWeight: 600, letterSpacing: -2 }}>
            Zero filtri di marketing.
          </div>
        </div>

        {/* Footer line */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ height: 4, width: 56, background: TEAL, borderRadius: 99 }} />
          <div style={{ fontSize: 26, color: TEAL_300, letterSpacing: 1 }}>
            Evidenza graduata A–F · Fonti PubMed verificate
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
