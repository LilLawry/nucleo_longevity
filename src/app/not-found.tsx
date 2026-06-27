import Link from "next/link";
import NucleusMark from "@/components/NucleusMark";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden">
      <div className="absolute inset-0 grid-surface" aria-hidden />
      <div className="relative text-center max-w-md">
        <NucleusMark size={80} animated className="text-[var(--accent)] mx-auto mb-8" />
        <p className="font-mono text-xs tracking-widest uppercase text-[var(--accent)] mb-3">
          Error 404
        </p>
        <h1 className="font-sans font-medium text-3xl sm:text-4xl tracking-[-0.02em] text-[var(--fg)] mb-3 text-balance">
          Orbit not found
        </h1>
        <p className="font-sans text-base text-[var(--muted)] leading-relaxed mb-8">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/en" className="btn-accent font-sans font-medium text-sm px-5 py-2.5">
            Home
          </Link>
          <Link
            href="/en/database"
            className="font-sans font-medium text-sm px-5 py-2.5 border border-[var(--border)] text-[var(--fg)] hover:border-[var(--accent)] transition-colors"
          >
            Database
          </Link>
        </div>
      </div>
    </main>
  );
}
