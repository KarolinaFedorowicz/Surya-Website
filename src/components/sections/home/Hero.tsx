// S1 — Hero. SURYA_CACAO_BUILD_PLAN.md §3.5
import { Button, Display, Section } from "@/components/primitives";
import { HeroPour, MagneticButton, SunriseMark } from "@/components/motion";
import { getCopy } from "@/lib/mdx";

/**
 * Full-bleed opener. "Beyond cacao." — the one headline the brief fixes.
 *
 * M9 HeroPour owns the media layer — an autoplay loop of the pour, with
 * hero-poster.jpg as its required static fallback. Not pinned: this section
 * scrolls away like any other. M8 SunriseMark draws the mark on load.
 */
export function Hero() {
  const copy = getCopy("hero");

  return (
    <Section
      tone="dark"
      space="none"
      width="full"
      bleed
      className="relative flex min-h-[100svh] items-end"
    >
      {/* M9 — autoplay loop, declarative playback. Poster is the fallback. */}
      <HeroPour className="absolute inset-0" />
      {/* Two scrims, not one. The lower gradient protects the headline; the
          upper one protects the NAV, which overlays this hero transparently
          and would otherwise sit on golden-hour highlights. Without it the
          nav links measure well under AA on the bright right-hand side.

          The 70% stop is held out to 65% of the hero height rather than the
          default 50%. Measured against the footage: the brightest 8×8 block in
          the whole clip is rgb(194,171,149) at t=3.2s (the blurred sand
          background), and Sand Paper ink on it needs 0.63 Night to clear 4.5:1.
          At the default midpoint the gradient fell under that threshold before
          it cleared the top of the headline block. Opacity only — no type or
          layout change. */}
      <div
        aria-hidden="true"
        className="from-surface via-surface/70 absolute inset-0 bg-gradient-to-t to-transparent via-65%"
      />
      <div
        aria-hidden="true"
        className="from-surface/85 absolute inset-x-0 top-0 h-48 bg-gradient-to-b to-transparent"
      />

      <div className="relative mx-auto w-full max-w-[76rem] px-6 pb-24 md:px-10 md:pb-32">
        {/* Deliberately NOT wrapped in M2 Reveal. The hero copy is above the
            fold, so fading it in makes the subhead the LCP element and pushed
            Largest Contentful Paint to 4.1s on mobile — measured. The entrance
            is carried by M8's draw-on instead, which is what brief §4.4 asks
            for anyway. Reveal is for content arriving on scroll. */}
        <div>
          <SunriseMark className="text-accent mb-10 h-16 w-auto md:h-20" />

          <Display as="h1" size="hero" className="max-w-[14ch]">
            {copy.headline ?? copy.title}
          </Display>

          {copy.lead ? (
            <p className="text-muted font-body text-body mt-8 max-w-[46ch]">
              {copy.lead}
            </p>
          ) : null}

          {/* A CTA without an href is a copy line whose destination is still an
              open item — recorded in the content file, not rendered as a dead
              button. */}
          <div className="mt-12 flex flex-wrap items-center gap-4">
            {(copy.ctas ?? [])
              .filter((c) => c.href)
              .map((c) => {
                const external = (c.href as string).startsWith("http");
                return (
                  <MagneticButton key={c.label}>
                    <Button
                      href={c.href as string}
                      size="lg"
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {c.label}
                    </Button>
                  </MagneticButton>
                );
              })}
          </div>
        </div>
      </div>
    </Section>
  );
}
