export default function PageHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-2xl mb-14">
      <p className="font-mono text-xs tracking-widest uppercase text-[var(--accent)] mb-4">
        {eyebrow}
      </p>
      <h1 className="font-sans font-medium text-4xl sm:text-5xl tracking-[-0.03em] text-[var(--fg)] mb-4 text-balance">
        {title}
      </h1>
      {subtitle && (
        <p className="font-sans text-lg text-[var(--muted)] leading-relaxed text-pretty">
          {subtitle}
        </p>
      )}
    </div>
  );
}
