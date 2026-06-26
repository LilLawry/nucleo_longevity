import Image from "next/image";
import type { Author } from "@/lib/authors";
import NucleusMark from "./NucleusMark";

/** Author bio card shown at the end of an article (E-E-A-T signal). */
export default function AuthorCard({ author, lang }: { author: Author; lang: string }) {
  const it = lang !== "en";
  return (
    <div className="card-surface p-6 flex gap-5 items-start">
      <div className="shrink-0">
        {author.avatar ? (
          <Image
            src={author.avatar}
            alt={author.name}
            width={56}
            height={56}
            className="rounded-full object-cover w-14 h-14"
          />
        ) : (
          <div className="w-14 h-14 rounded-full border border-[var(--border)] flex items-center justify-center bg-[var(--bg)]">
            <NucleusMark size={26} className="text-[var(--accent)]" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="font-mono text-[0.6rem] uppercase tracking-widest text-[var(--accent)] mb-1">
          {it ? "Scritto da" : "Written by"}
        </p>
        <p className="font-sans font-medium text-[var(--fg)]">{author.name}</p>
        <p className="font-mono text-[0.65rem] text-[var(--muted)] mb-2">
          {it ? author.role.it : author.role.en}
        </p>
        <p className="font-sans text-sm text-[var(--muted)] leading-relaxed">
          {it ? author.bio.it : author.bio.en}
        </p>
        {author.links && author.links.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {author.links.map((href) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer me"
                className="font-mono text-[0.65rem] text-[var(--accent)] link-underline"
              >
                {new URL(href).hostname.replace("www.", "")} ↗
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
