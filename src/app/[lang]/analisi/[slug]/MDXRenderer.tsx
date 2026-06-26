import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import FieldNote from "@/components/FieldNote";

const components = {
  FieldNote,
  div: (props: React.HTMLAttributes<HTMLDivElement>) => <div {...props} />,
  table: (props: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="overflow-x-auto my-6">
      <table {...props} className="w-full font-mono text-xs border-collapse" />
    </div>
  ),
  th: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      {...props}
      className="border border-[var(--border)] px-3 py-2 text-left font-medium text-[var(--accent)] uppercase tracking-wider text-[0.6rem]"
    />
  ),
  td: (props: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td {...props} className="border border-[var(--border)] px-3 py-2 text-[var(--fg)]" />
  ),
  blockquote: (props: React.HTMLAttributes<HTMLElement>) => (
    <blockquote
      {...props}
      className="border-l-2 border-[var(--accent)] pl-4 text-[var(--muted)] italic my-4"
    />
  ),
};

export default function MDXRenderer({ content }: { content: string }) {
  return (
    <MDXRemote
      source={content}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [rehypeSlug],
        },
        parseFrontmatter: false,
      }}
      components={components}
    />
  );
}
