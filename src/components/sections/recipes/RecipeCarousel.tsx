// S12 — RecipeCarousel. SURYA_CACAO_BUILD_PLAN.md §3.5
"use client";

import { useRef } from "react";

import { Display, Eyebrow, Section } from "@/components/primitives";
import { RecipeCard } from "./RecipeCard";
import type { Recipe } from "@/lib/mdx";

/**
 * Horizontal drag/swipe rather than a grid — plan S12.
 *
 * Phase 4 builds it on native scroll-snap: pointer drag, touch swipe, shift+
 * wheel and keyboard arrows all work with no JS beyond the drag handler, and
 * it degrades to a plain scroller if that JS never runs. The magnetic snap
 * easing is Phase 6's job (GSAP stays out of sections entirely).
 *
 * Native scroll also keeps this accessible for free: the track is a focusable
 * region so keyboard users can arrow through it, which a transform-based
 * carousel would have to reimplement.
 */
export function RecipeCarousel({
  recipes,
  eyebrow,
  headline,
  lead,
  guideHref,
}: {
  recipes: Recipe[];
  eyebrow: string;
  headline: string;
  lead?: string;
  /** When set, every card links here instead of its own `/recipes/[slug]`. */
  guideHref?: string;
}) {
  const track = useRef<HTMLUListElement>(null);
  const drag = useRef({ active: false, startX: 0, startLeft: 0 });

  const onPointerDown = (e: React.PointerEvent) => {
    // Let touch use the platform's own momentum scrolling.
    if (e.pointerType === "touch" || !track.current) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startLeft: track.current.scrollLeft,
    };
    track.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active || !track.current) return;
    track.current.scrollLeft =
      drag.current.startLeft - (e.clientX - drag.current.startX);
  };

  const endDrag = (e: React.PointerEvent) => {
    if (!drag.current.active || !track.current) return;
    drag.current.active = false;
    track.current.releasePointerCapture(e.pointerId);
  };

  return (
    <Section tone="sand" space="normal" width="full" bleed>
      <div className="mx-auto max-w-[var(--container-max)] px-[var(--gutter)]">
        <Eyebrow>{eyebrow}</Eyebrow>
        <Display as="h1" size="hero" className="mt-6 max-w-[12ch]">
          {headline}
        </Display>
        {lead ? (
          <p className="text-muted font-body text-body mt-8 max-w-[46ch]">
            {lead}
          </p>
        ) : null}
        {/* Interaction affordance, not brand copy — kept out of the content
            layer deliberately. It describes how this control works, so it
            belongs to the component the way a button's aria-label does. */}
        <p className="text-muted font-body text-caption mt-4">
          Drag, swipe, or use the arrow keys.
        </p>
      </div>

      <ul
        ref={track}
        tabIndex={0}
        aria-label="Signature drinks"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        /* Full-bleed scroller, but the first card has to line up with the
           heading above it or the page looks broken. Computed from the same
           tokens L8 Container uses, so the two cannot drift. Cards still run
           off the right edge, which is what signals the track scrolls. */
        style={{
          paddingInlineStart:
            "calc(max(0px, (100% - var(--container-max)) / 2) + var(--gutter))",
          paddingInlineEnd: "var(--gutter)",
          scrollPaddingInlineStart:
            "calc(max(0px, (100% - var(--container-max)) / 2) + var(--gutter))",
        }}
        className="mt-16 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {recipes.map((r) => (
          <li
            key={r.slug}
            className="w-[78vw] shrink-0 snap-start sm:w-[46vw] lg:w-[30vw] xl:w-[24rem]"
          >
            <RecipeCard recipe={r} href={guideHref} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
