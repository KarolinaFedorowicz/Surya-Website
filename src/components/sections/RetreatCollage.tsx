import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

/**
 * The three retreat photographs, stacked as a collage beside the booking form.
 *
 * Deliberately not a tidy grid. The three frames are different shapes and
 * different qualities — a phone snap of the veranda, a proper architectural
 * shot of the villa, a flash photo of a group at night — and lining them up in
 * equal boxes would only draw attention to the mismatch. Staggering them
 * reads as a pinned-up set instead, where uneven is the point.
 *
 * Structure: the villa carries the right column at full height because it is
 * the strongest frame and the only true portrait; the veranda and the group
 * stack on the left, pushed down so the two columns interlock rather than
 * start on the same line.
 *
 * Every plate takes the gold hairline, which is the same job the rule does
 * elsewhere on the site — it defines an edge without becoming a fill.
 */

const plate =
  "ken-burns border-gilded-gold/45 relative overflow-hidden border";

export default function RetreatCollage() {
  return (
    <Reveal index={1}>
      <div className="flex gap-4 sm:gap-5">
        {/* Left — the two landscape frames, dropped to interlock with the villa */}
        <div className="flex w-[45%] flex-col gap-4 pt-10 sm:gap-5 sm:pt-16">
          <div className={`${plate} aspect-[5/4]`}>
            <Image
              src="/assets/photos/Retreat_Experience1.png"
              alt="The open veranda, cane chairs and potted palms looking out over the treetops"
              fill
              sizes="(max-width: 1024px) 45vw, 15rem"
              className="object-cover"
            />
          </div>

          <div className={`${plate} aspect-[5/4]`}>
            <Image
              src="/assets/photos/Retreat_Experience4.png"
              alt="Guests together under the trees at night at the close of a retreat"
              fill
              sizes="(max-width: 1024px) 45vw, 15rem"
              className="object-cover"
            />
          </div>
        </div>

        {/* Right — the villa, the anchor of the set */}
        <div className={`${plate} aspect-[2/3] w-[55%]`}>
          <Image
            src="/assets/photos/Retreat_Experience3.jpg"
            alt="The thatched-roof retreat house at dusk, open to the hillside on every side"
            fill
            sizes="(max-width: 1024px) 55vw, 18rem"
            className="object-cover"
          />
        </div>
      </div>
    </Reveal>
  );
}
