/**
 * The gold hairline. Gold's only permitted appearance on a light surface —
 * linework, never a fill and never lettering.
 */
export default function Divider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`bg-gilded-gold h-px w-[var(--rule-length)] ${className ?? ""}`}
    />
  );
}
