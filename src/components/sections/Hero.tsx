import { hero } from "@content/hero";
import Container from "@/components/layout/Container";
import BackgroundVideo from "@/components/ui/BackgroundVideo";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import Reveal from "@/components/ui/Reveal";

/**
 * Section 1 — Hero.
 *
 * The footage is the ground here, so this section does NOT use <Section>.
 * Section owns exactly two surface recipes (Sand Paper / Deep Cacao Night) and
 * a full-bleed moving image is a third; rather than widen that component for
 * one caller, the hero composes its own <section> and reuses Container so the
 * type still lands on the same measure and gutters as every other section.
 *
 * Three stacked layers, back to front:
 *   1. the Cacao_hero3 loop, object-fit: cover, full bleed. No .ken-burns —
 *      the footage already moves, and drifting it as well reads as a wobble.
 *
 *      Served as cacao_hero3.mp4, transcoded from the supplied Cacao_hero3.mov.
 *      That source is HEVC/H.265 in a QuickTime container, which Safari plays
 *      and Chrome and Firefox generally do not — shipping it directly would
 *      have left most visitors on the poster frame. The MP4 is H.264 High,
 *      same 1920×1080 and duration, audio stripped (the loop is muted anyway,
 *      so the track was only weight), and +faststart so playback begins before
 *      the file finishes downloading. 8.3MB → 4.0MB.
 *   2. a Deep Cacao Night scrim — heavier at the left where the type sits,
 *      lighter at the right so the bowl reads. This is what buys the contrast;
 *      Warm Ivory over the scrimmed left edge clears AA comfortably.
 *   3. the type, on the dark recipe (Warm Ivory heading, Sand Paper body,
 *      gold rule, onDark buttons).
 *
 * The scrim is not decoration, but it is tuned per clip and it has to come
 * DOWN for this one. The previous runway cut opened on a sunlit yellow pod and
 * needed 86% at the left stop to keep Warm Ivory legible. This footage is beans
 * on a comal over a fire — already dark, already low-key — and carrying the
 * bright-clip scrim over it crushed the beans and the flame into brown mud.
 * The stops are pulled back so the footage reads as an image rather than a
 * texture, while the left edge still holds the headline comfortably clear of
 * the embers. Retune these whenever the clip changes; they are not a constant.
 */
export default function Hero() {
  const night = "var(--color-deep-cacao-night)";
  const scrim = (pct: number) => `color-mix(in srgb, ${night} ${pct}%, transparent)`;

  return (
    <section className="text-sand-paper relative isolate flex min-h-[100svh] items-center overflow-hidden">
      {/* 1 — footage */}
      <div className="absolute inset-0 -z-20">
        <BackgroundVideo
          src="/assets/cacao_hero3.mp4"
          poster="/assets/cacao_hero_poster.jpg"
          alt="Cacao beans roasting on a clay comal over an open fire, smoke rising"
        />
      </div>

      {/* 2 — scrim */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background: [
            `linear-gradient(to right, ${scrim(74)} 0%, ${scrim(30)} 55%, ${scrim(10)} 100%)`,
            `linear-gradient(to bottom, ${scrim(46)} 0%, ${scrim(8)} 38%, ${scrim(44)} 100%)`,
          ].join(", "),
        }}
      />

      {/* 3 — type */}
      {/*
       * No --space-section here, unlike every other section. This box is
       * already a full-viewport flex-centered frame, so section rhythm on top
       * of that just inflates the hero past the fold: with it, the hero was a
       * fixed ~945px tall whatever the viewport, which pushed the CTAs out of
       * sight on any laptop shorter than 800px. The padding only has to clear
       * the fixed header and announcement bar, and keep a block of air at the
       * bottom; centering does the rest.
       */}
      <Container className="pt-[calc(var(--header-h)+var(--banner-h))] pb-[var(--space-block)]">
        <Reveal index={0}>
          <h1 className="font-display text-h1 tracking-h1 leading-h1 text-warm-ivory max-w-[14ch]">
            {hero.headline}
          </h1>
        </Reveal>

        <Reveal index={1}>
          <Divider className="my-[var(--space-block)]" />
        </Reveal>

        <Reveal index={2}>
          <p className="font-display text-h3 text-warm-ivory max-w-[var(--measure)]">
            {hero.subhead}
          </p>
        </Reveal>

        <Reveal index={3}>
          <p className="text-body leading-body mt-6 max-w-[var(--measure)]">
            {hero.body}
          </p>
        </Reveal>

        <Reveal index={4}>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={hero.primaryCta.href} onDark>
              {hero.primaryCta.label}
            </Button>
            <Button href={hero.secondaryCta.href} variant="ghost" onDark>
              {hero.secondaryCta.label}
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
