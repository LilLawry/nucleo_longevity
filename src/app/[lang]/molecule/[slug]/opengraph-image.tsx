import { ImageResponse } from "next/og";
import { getAllMolecules, getMoleculeBySlug } from "@/lib/molecole";

export const alt = "Nucleo Longevity — molecule";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return ["en", "it"].flatMap((lang) => getAllMolecules().map((m) => ({ lang, slug: m.slug })));
}

const INK = "#0E1214";
const BASE = "#EEF1F1";
const TEAL_300 = "#9FBEBC";
const MUTED = "#8A9295";
const GRADE_COLOR: Record<string, string> = { A: "#9FBEBC", B: "#9FBEBC", C: "#9FBEBC", D: "#8A9295", E: "#B5975D", F: "#C45C5C" };

export default async function Image({ params }: { params: { lang: string; slug: string } }) {
  const { lang, slug } = params;
  const m = getMoleculeBySlug(slug);
  const name = m?.name ?? "Nucleo Longevity";
  const grade = m?.grade ?? "";
  const klass = m?.class ?? "";
  const use = m?.primaryUse ?? "";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: INK, padding: 72, fontFamily: "sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", border: `10px solid ${TEAL_300}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: TEAL_300 }} />
            </div>
            <div style={{ fontSize: 26, letterSpacing: 6, color: BASE, fontWeight: 600 }}>NUCLEO · LONGEVITY</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, border: `2px solid ${grade ? GRADE_COLOR[grade] : MUTED}`, borderRadius: 8, padding: "10px 18px" }}>
            <span style={{ fontSize: 22, color: MUTED, letterSpacing: 2 }}>{lang === "it" ? "GRADO" : "GRADE"}</span>
            <span style={{ fontSize: 34, color: grade ? GRADE_COLOR[grade] : MUTED, fontWeight: 700 }}>{grade || "—"}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 24, color: TEAL_300, letterSpacing: 3, textTransform: "uppercase", display: "flex" }}>
            {`${klass}${use ? ` · ${use}` : ""}`}
          </div>
          <div style={{ fontSize: 68, lineHeight: 1.05, color: BASE, fontWeight: 600, letterSpacing: -1.5, display: "flex" }}>
            {name.length > 60 ? name.slice(0, 60) + "…" : name}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ height: 4, width: 56, background: "#11605F", borderRadius: 99 }} />
          <div style={{ fontSize: 22, color: MUTED, letterSpacing: 1 }}>
            {lang === "it" ? "Evidenza graduata · Fonti PubMed" : "Graded evidence · PubMed sources"}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
