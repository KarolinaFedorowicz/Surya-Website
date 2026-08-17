import { ritualSteps } from "@content/ritual-steps";
import Section from "@/components/layout/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Divider from "@/components/ui/Divider";
import Reveal from "@/components/ui/Reveal";

/**
 * Section 4 — The Ritual, Step by Step.
 *
 * MISSING ASSET: three images, one per step — whisking, the pause, the first
 * sip. None exist. Steps render as numbered type. Deliberately not filled with
 * icons: an icon set would read as a supplement brand, which the copy denies.
 */
export default function RitualSteps() {
  return (
    <Section>
      <Reveal index={0}>
        <Eyebrow>The Ritual</Eyebrow>
      </Reveal>

      <Reveal index={1}>
        <h2 className="font-display text-h2 tracking-h2 leading-h2 mt-4">
          {ritualSteps.headline}
        </h2>
      </Reveal>

      <ol className="mt-[var(--space-block)] grid gap-10 md:grid-cols-3">
        {ritualSteps.steps.map((step, i) => (
          <Reveal as="li" key={step.label} index={i + 2}>
            <Divider className="mb-5" />
            <p className="text-eyebrow tracking-eyebrow uppercase opacity-60">
              Step {i + 1}
            </p>
            <h3 className="text-h3 tracking-h3 leading-h3 mt-2">
              {step.label}
            </h3>
            <p className="text-body leading-body mt-3">{step.body}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
