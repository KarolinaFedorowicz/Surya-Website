// C4 — RitualQuantity. SURYA_CACAO_BUILD_PLAN.md §3.4
/**
 * Framing beside the size selector — 150g is "the first pour", 500g is "the
 * standing ritual" (brief §5.4). Quantity described as a length of practice
 * rather than a unit of stock, which is the whole positioning difference
 * between this and a supplement site.
 *
 * The lines used to be a constant here. They now come from the `ritual` field
 * of content/product/*.mdx — §2.4, no real copy in JSX — threaded down from the
 * server page, because C1 ProductBlock is a client component and the content
 * loader is server-only.
 */
export type RitualFraming = { size: string; note: string };

export function RitualQuantity({
  size,
  ritual = [],
}: {
  size: string;
  ritual?: RitualFraming[];
}) {
  const line = ritual.find((r) => r.size === size)?.note;
  if (!line) return null;

  return (
    <p className="text-muted font-body text-body max-w-[34ch] italic">{line}</p>
  );
}
