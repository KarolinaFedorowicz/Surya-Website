import { ritual } from "@content/ritual";
import Section from "@/components/layout/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Divider from "@/components/ui/Divider";
import Reveal from "@/components/ui/Reveal";

/**
 * Section 2 — Beyond Cacao. Dark section, and deliberately imageless: the art
 * direction keeps this one text-only so the manifesto carries it.
 */
export default function RitualMeaning() {
  return (
    <Section id={ritual.id} tone="dark">
      <Reveal index={0}>
        <Eyebrow onDark>Our Ritual</Eyebrow>
      </Reveal>

      <Reveal index={1}>
        <h2 className="font-display text-h2 tracking-h2 leading-h2 text-warm-ivory mt-4">
          {ritual.headline}
        </h2>
      </Reveal>

      <Reveal index={2}>
        <Divider className="my-[var(--space-block)]" />
      </Reveal>

      <Reveal index={3}>
        <p className="text-body leading-body max-w-[var(--measure)]">
          {ritual.body}
        </p>
      </Reveal>
    </Section>
  );
}
