import Link from "next/link";
import type { Author } from "@/lib/authors";

/** Compact byline shown near the top of an article (E-E-A-T signal). */
export default function AuthorByline({
  author,
  reviewer,
  date,
  readingTime,
  readingLabel,
  lang,
}: {
  author: Author;
  reviewer?: Author;
  date: string;
  readingTime: string;
  readingLabel: string;
  lang: string;
}) {
  const it = lang !== "en";
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.7rem] text-[var(--muted)]">
      <Link href={`/${lang}/chi-siamo`} className="text-[var(--fg)] hover:text-[var(--accent)] transition-colors">
        {author.name}
      </Link>
      <span className="text-[var(--border)]">·</span>
      <span>{it ? author.role.it : author.role.en}</span>
      <span className="text-[var(--border)]">·</span>
      <time>{date}</time>
      <span className="text-[var(--border)]">·</span>
      <span>{readingTime} {readingLabel}</span>
      {reviewer && (
        <>
          <span className="text-[var(--border)]">·</span>
          <span>
            {it ? "Revisione: " : "Reviewed by: "}
            <span className="text-[var(--fg)]">{reviewer.name}</span>
          </span>
        </>
      )}
    </div>
  );
}
