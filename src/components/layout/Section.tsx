import Container from "./Container";

/**
 * Owns the two surface recipes and the anchor id, so the "max three tokens
 * per section" rule has exactly one enforcement point.
 *
 *   light — Sand Paper ground, Aubergine text, gold rule
 *   dark  — Deep Cacao Night ground, Sand Paper text, gold accent
 *
 * A section picks one and stays inside it.
 */
export default function Section({
  children,
  id,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  id?: string;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`py-[var(--space-section)] ${
        tone === "dark"
          ? "bg-deep-cacao-night text-sand-paper"
          : "bg-sand-paper text-aubergine-ink"
      } ${className ?? ""}`}
    >
      <Container>{children}</Container>
    </section>
  );
}
