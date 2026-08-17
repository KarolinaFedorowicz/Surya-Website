import { retreats } from "@content/retreats";
import Section from "@/components/layout/Section";
import Divider from "@/components/ui/Divider";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";
import RetreatCollage from "./RetreatCollage";
import RetreatForm from "./RetreatForm";

/**
 * /retreats — the page opener and, below it, the enquiry block.
 *
 * The opener is the only H1 on the route and the only place outside the home
 * hero that uses text-h1: "Retreats" is one word, so it can carry the display
 * size without wrapping into a wall the way a sentence-length headline would.
 * The enquiry block below keeps text-h2, which preserves the hierarchy — one
 * page title, one section heading under it.
 *
 * The Contact button is an in-page jump to #retreat-enquiry rather than a
 * route: the form is one screen down, and sending someone to a separate
 * contact page to reach a form this page already has would be a detour.
 *
 * The form and the photographs split into two columns from lg up. The collage
 * is sticky in its column because the form is roughly twice its height —
 * without that, the reader fills in the lower fields against a blank right
 * side.
 *
 * STILL OPEN: no dates and no pricing anywhere on the page.
 */
export default function RetreatsIntro() {
  return (
    <>
      <Section
        tone="dark"
        className="pt-[calc(var(--header-h)+var(--space-section))]"
      >
        <Reveal index={0}>
          <h1 className="font-display text-h1 tracking-h1 leading-h1 text-warm-ivory">
            {retreats.pageTitle}
          </h1>
        </Reveal>

        <Reveal index={1}>
          <Divider className="my-[var(--space-block)]" />
        </Reveal>

        <div className="max-w-[var(--measure)] space-y-6">
          {retreats.body.map((para, i) => (
            <Reveal key={i} index={i + 2}>
              <p className="text-body leading-body">{para}</p>
            </Reveal>
          ))}
        </div>

        <Reveal index={retreats.body.length + 2}>
          <p className="text-body leading-body mt-[var(--space-block)]">
            {retreats.contactPrompt}
          </p>
        </Reveal>

        <Reveal index={retreats.body.length + 3}>
          <div className="mt-6">
            <Button href={retreats.contactCta.href} onDark>
              {retreats.contactCta.label}
            </Button>
          </div>
        </Reveal>
      </Section>

      <Section id="retreat-enquiry" tone="dark">
        <Reveal index={0}>
          <h2 className="font-display text-h2 tracking-h2 leading-h2 text-warm-ivory">
            {retreats.headline}
          </h2>
        </Reveal>

        <Reveal index={1}>
          <Divider className="my-[var(--space-block)]" />
        </Reveal>

        <div className="mt-[var(--space-block)] grid gap-[var(--space-block)] lg:grid-cols-[minmax(0,36rem)_minmax(0,1fr)] lg:items-start lg:gap-16">
          <RetreatForm />

          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)]">
            <RetreatCollage />
          </div>
        </div>
      </Section>
    </>
  );
}
