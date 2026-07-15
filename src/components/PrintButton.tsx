"use client";

/** Triggers the browser print dialog (used to "save as PDF" the report card). */
export default function PrintButton({ label }: { label: string }) {
  return (
    <button
      onClick={() => window.print()}
      className="btn-accent font-sans font-medium text-sm px-6 py-3 no-print"
    >
      {label}
    </button>
  );
}
