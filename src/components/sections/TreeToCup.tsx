import Image from "next/image";
import { treeToCup } from "@content/tree-to-cup";
import Section from "@/components/layout/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Divider from "@/components/ui/Divider";
import Reveal from "@/components/ui/Reveal";

/**
 * Section 3 — From Tree to Cup.
 *
 * Two columns from lg up, stacked below it: the copy on the left, the growing
 * families on the right. This is the one section whose subject is the people
 * at origin rather than the product, so it gets the only photograph of faces
 * on the home page.
 *
 * The source frame is 1179×2052 — shot on a phone, held vertical. Rather than
 * crop that to a landscape band and lose both men, the column keeps a 4:5
 * portrait and lets object-cover trim the leaf canopy at the top, which is the
 * part of the frame carrying the least information.
 */
export default function TreeToCup() {
  return (
    <Section>
      <div className="grid items-center gap-[var(--space-block)] lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
        <div>
          <Reveal index={0}>
            <Eyebrow>From Tree to Cup</Eyebrow>
          </Reveal>

          <Reveal index={1}>
            <h2 className="font-display text-h2 tracking-h2 leading-h2 mt-4 max-w-[18ch]">
              {treeToCup.headline}
            </h2>
          </Reveal>

          <Reveal index={2}>
            <Divider className="my-[var(--space-block)]" />
          </Reveal>

          <Reveal index={3}>
            <p className="text-body leading-body max-w-[var(--measure)]">
              {treeToCup.body}
            </p>
          </Reveal>
        </div>

        <Reveal index={4}>
          {/* The gold hairline is what makes this read as a plate rather than a
              photo dropped on the ground — same role the rule plays elsewhere. */}
          <div className="ken-burns border-gilded-gold/45 relative aspect-[4/5] w-full border">
            <Image
              src="/assets/photos/Families_Picture.jpg"
              alt="Two growers standing among their cacao trees, each holding a just-opened pod"
              fill
              sizes="(max-width: 1024px) 100vw, 26rem"
              className="object-cover object-top"
            />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
