import { communityProof } from "@content/community-proof";
import Section from "@/components/layout/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

/**
 * Section 7 — Community Proof.
 *
 * MISSING CONTENT: communityProof.testimonials is empty. There are no real
 * testimonials, DMs or reviews yet, and none are invented here.
 *
 * The section renders nothing at all in that state rather than shipping a
 * headline with a void under it. It appears the moment real quotes exist. If
 * none ever do, this section needs a different treatment — the three-family
 * story or the ritual itself — which is a content decision, not a build one.
 */
export default function CommunityProof() {
  if (communityProof.testimonials.length === 0) return null;

  return (
    <Section>
      <Reveal index={0}>
        <Eyebrow>Community</Eyebrow>
      </Reveal>

      <Reveal index={1}>
        <h2 className="font-display text-h2 tracking-h2 leading-h2 mt-4">
          {communityProof.headline}
        </h2>
      </Reveal>

      <ul className="mt-[var(--space-block)] grid gap-8 md:grid-cols-2">
        {communityProof.testimonials.map((t, i) => (
          <Reveal as="li" key={i} index={i + 2}>
            <blockquote className="bg-warm-ivory border-gilded-gold border p-7">
              <p className="text-body leading-body">{t.quote}</p>
              <footer className="text-caption tracking-caption mt-4 uppercase opacity-70">
                {t.attribution}
              </footer>
            </blockquote>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
