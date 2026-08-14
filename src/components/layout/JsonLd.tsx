// L9 — SeoHead (structured data half). SURYA_CACAO_BUILD_PLAN.md §3.3
/**
 * Emits a JSON-LD block. Server component, so the payload is in the initial
 * HTML where crawlers read it.
 *
 * `JSON.stringify` output is escaped for `<` to close off the classic
 * `</script>`-in-a-string injection, since schema fields will eventually carry
 * product copy from Shopify.
 */
export function JsonLd({ schema }: { schema: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
      }}
    />
  );
}
