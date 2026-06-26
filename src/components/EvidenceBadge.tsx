const gradeColors: Record<string, { border: string; text: string; bg: string }> = {
  A: { border: "#11605F", text: "#11605F", bg: "rgba(17,96,95,0.08)" },
  B: { border: "#2E7D7C", text: "#2E7D7C", bg: "rgba(17,96,95,0.06)" },
  C: { border: "#5C9897", text: "#5C9897", bg: "rgba(17,96,95,0.04)" },
  D: { border: "#8A9295", text: "#8A9295", bg: "rgba(138,146,149,0.06)" },
  E: { border: "#B5975D", text: "#B5975D", bg: "rgba(181,151,93,0.06)" },
  F: { border: "#C45C5C", text: "#C45C5C", bg: "rgba(196,92,92,0.06)" },
};

interface Props {
  grade: string;
  label?: string;
  onClick?: () => void;
  active?: boolean;
}

export default function EvidenceBadge({ grade, label, onClick, active }: Props) {
  const colors = gradeColors[grade] ?? gradeColors["D"];
  const style = {
    borderColor: colors.border,
    color: colors.text,
    backgroundColor: active ? colors.border : colors.bg,
  };

  const Tag = onClick ? "button" : "span";

  return (
    <Tag
      onClick={onClick}
      style={{ ...style, ...(active ? { color: "#fff" } : {}) }}
      className={`badge transition-opacity ${onClick ? "cursor-pointer hover:opacity-80" : ""}`}
    >
      {grade}{label ? ` — ${label}` : ""}
    </Tag>
  );
}
