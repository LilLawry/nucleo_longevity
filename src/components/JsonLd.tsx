/**
 * JsonLd — renders a JSON-LD <script> for structured data (SEO / rich results).
 * Inline JSON is data, not executable; allowed by the site CSP.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
