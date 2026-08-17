/**
 * Small-caps label above a headline.
 *
 * Aubergine on light surfaces, gold on dark. That split is deliberate and
 * documented in DESIGN_SYSTEM.md: gold at this size measures 1.65:1 on Sand
 * Paper, so it is a rule on light ground and lettering only on dark ground.
 */
export default function Eyebrow({
  children,
  onDark = false,
}: {
  children: React.ReactNode;
  onDark?: boolean;
}) {
  return (
    <p
      className={`text-eyebrow uppercase tracking-eyebrow ${
        onDark ? "text-gilded-gold" : "text-aubergine-ink/75"
      }`}
    >
      {children}
    </p>
  );
}
