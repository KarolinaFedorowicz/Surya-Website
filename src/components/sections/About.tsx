import Image from "next/image";
import { about } from "@content/about";
import Section from "@/components/layout/Section";
import Eyebrow from "@/components/ui/Eyebrow";
import Divider from "@/components/ui/Divider";
import Reveal from "@/components/ui/Reveal";

/**
 * Section 5 — Founder / Brand Voice. Scroll target for "About Us".
 *
 * Two columns from lg, stacked below it: the copy on the left, the two Karo
 * cup frames stacked on the right.
 *
 * The two photographs are near-identical in crop (both 1179×~1545 portrait,
 * both the same white dress in the same meadow at the same hour), so setting
 * them side by side would read as a duplicate. Stacked and offset — the first
 * hung left, the second dropped over its lower edge and pushed right — they
 * read as two moments from one sitting, which is what they are.
 *
 * The overlap is what makes it a stack rather than a list. Both plates carry
 * the gold hairline, so the seam where they cross stays legible instead of
 * dissolving into one shape.
 *
 * MISSING ASSET: three portraits, one per family, per the art direction.
 * These two are of one person, so the "three families" claim in the copy is
 * still carried by the words alone.
 */

const plate =
  "ken-burns border-gilded-gold/45 relative aspect-[4/5] w-[78%] overflow-hidden border";

export default function About() {
  return (
    <Section id={about.id}>
      <div className="grid items-center gap-[var(--space-block)] lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16">
        <div>
          <Reveal index={0}>
            <Eyebrow>About Us</Eyebrow>
          </Reveal>

          {about.headline && (
            <Reveal index={1}>
              <h2 className="font-display text-h2 tracking-h2 leading-h2 mt-4">
                {about.headline}
              </h2>
            </Reveal>
          )}

          <Reveal index={2}>
            <Divider className="my-[var(--space-block)]" />
          </Reveal>

          <div className="max-w-[var(--measure)] space-y-6">
            {about.body.map((para, i) => (
              <Reveal key={i} index={i + 3}>
                <p className="text-body leading-body">{para}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal index={about.body.length + 3}>
          <div className="mx-auto w-full max-w-[22rem] lg:mx-0">
            <div className={plate}>
              <Image
                src="/assets/photos/Karo_cup.jpg"
                alt="Drinking cacao from a dark glazed cup in a meadow at golden hour"
                fill
                sizes="(max-width: 1024px) 78vw, 17rem"
                className="object-cover"
              />
            </div>

            {/* Negative margin resolves against the wrapper's width, so the
                overlap scales with the column instead of fixing at one size. */}
            <div className={`${plate} -mt-[18%] ml-auto`}>
              <Image
                src="/assets/photos/Karo_cup2.jpg"
                alt="Sitting among wildflowers with the same cup, seen from above"
                fill
                sizes="(max-width: 1024px) 78vw, 17rem"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
