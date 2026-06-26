/**
 * FieldNote — a first-person "Esperienza sul campo" callout for use inside MDX
 * articles. First-hand experience is the "E" of E-E-A-T; surfacing it visually
 * tells both readers and Google the content is lived, not generated.
 *
 * Usage in MDX:
 *   <FieldNote>Nella mia esperienza con la NMN per 6 mesi…</FieldNote>
 */
export default function FieldNote({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <aside className="not-prose my-8 rounded-lg border border-[var(--accent)] bg-[rgba(17,96,95,0.05)] p-5 sm:p-6">
      <div className="flex items-center gap-2.5 mb-2.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
        </svg>
        <span className="font-mono text-[0.62rem] uppercase tracking-widest text-[var(--accent)]">
          {title || "Esperienza sul campo"}
        </span>
      </div>
      <div className="font-sans text-sm sm:text-[0.95rem] text-[var(--fg)] leading-relaxed [&>p]:mb-3 [&>p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}
