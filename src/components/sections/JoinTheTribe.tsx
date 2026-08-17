import { joinTheTribe } from "@content/join-the-tribe";
import Section from "@/components/layout/Section";
import Divider from "@/components/ui/Divider";
import Reveal from "@/components/ui/Reveal";
import { buttonBase, buttonSize, buttonSkin } from "@/components/ui/buttonStyles";

/**
 * Section 8 — Join our community.
 *
 * A 300×250 medium rectangle, centred on the dark ground. Exactly those
 * dimensions: it is an ad unit size, and the whole point of asking for one is
 * that it stays that size, so the box is fixed rather than fluid. The only
 * concession is `max-w-full`, which lets it shrink on a phone narrower than
 * 300px rather than pushing the page sideways.
 *
 * It keeps id="join-our-tribe" even though the nav no longer links here, so
 * the hero's secondary CTA and any link already in the wild still land.
 *
 * NOT the <Button> component: this leaves the site for a WhatsApp invite, and
 * Button renders a next/link with no way to pass target/rel. It uses Button's
 * exported shape instead — the same escape hatch the retreat form's submit
 * uses — so an outbound link is visibly identical to every other CTA while
 * still opening in a new tab. `rel="noopener"` is not optional on a
 * target="_blank" link: without it the opened page gets a handle back to this
 * one via window.opener.
 */
export default function JoinTheTribe() {
  return (
    <Section id={joinTheTribe.id} tone="dark">
      <Reveal index={0}>
        <div className="border-gilded-gold/50 mx-auto flex h-[250px] w-[300px] max-w-full flex-col items-center justify-center border p-8 text-center">
          <h2 className="font-display text-h3 text-warm-ivory leading-h3">
            {joinTheTribe.headline}
          </h2>

          <Divider className="my-6" />

          <a
            href={joinTheTribe.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${buttonBase} ${buttonSize.compact} ${buttonSkin("primary", true)}`}
          >
            {joinTheTribe.cta.label}
          </a>

          <p className="text-caption text-sand-paper/55 mt-4">
            Opens WhatsApp
          </p>
        </div>
      </Reveal>
    </Section>
  );
}
