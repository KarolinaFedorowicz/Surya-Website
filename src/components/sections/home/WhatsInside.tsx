// S4 — WhatsInside. SURYA_CACAO_BUILD_PLAN.md §3.5
"use client";

import { Display, Eyebrow, HairlineRule, Section } from "@/components/primitives";
import { Scrollytelling } from "@/components/motion";
import { cn } from "@/lib/utils";

/**
 * Pinned scrollytelling: a gold line-art bean opens in cross-section while
 * seven compounds call out in sequence (brief §5.2).
 *
 * ⛔ A6 (the real bean line art) does not exist. The bean here is drawn from
 * primitive SVG geometry — concentric shells and a seed cluster that split
 * apart as progress advances. It is deliberately schematic rather than a
 * pretend illustration: the MECHANICS are real and tested, so dropping in A6
 * means replacing the <BeanDiagram> paths and nothing else.
 *
 * Framed as education, not a supplement label. No clinical claims.
 */
type Compound = { name: string; note: string };

export function WhatsInside({
  title,
  eyebrow,
  compounds,
  lead,
  paragraphs = [],
  closing,
}: {
  title: string;
  eyebrow: string;
  compounds: Compound[];
  lead?: string;
  paragraphs?: string[];
  closing?: string;
}) {
  return (
    <Section tone="ivory" space="none" id="whats-inside" className="py-0">
      <Scrollytelling steps={compounds.length}>
        {({ progress, step, reduced }) => (
          <div className="flex min-h-svh flex-col justify-center py-24">
            <Eyebrow>{eyebrow}</Eyebrow>
            <Display as="h2" size="section" className="mt-4 max-w-[18ch]">
              {title}
            </Display>

            {lead ? (
              <p className="text-muted font-body text-body mt-8 max-w-[52ch]">
                {lead}
              </p>
            ) : null}
            {paragraphs.map((p, i) => (
              <p
                key={i}
                className="text-muted font-body text-body mt-6 max-w-[52ch]"
              >
                {p}
              </p>
            ))}

            <div className="mt-14 grid gap-14 lg:grid-cols-[1fr_1.15fr] lg:gap-20">
              <BeanDiagram progress={progress} />

              <ol className="self-center">
                {compounds.map((c, i) => {
                  // Under reduced motion every step reads as current, so the
                  // list is a plain, fully legible seven-item list.
                  const active = reduced || i === step;
                  const seen = reduced || i <= step;
                  return (
                    <li key={c.name}>
                      <HairlineRule />
                      <div
                        className={cn(
                          "flex gap-6 py-5 transition-opacity duration-[600ms] ease-surya",
                          seen ? "opacity-100" : "opacity-35",
                        )}
                      >
                        <span className="text-emphasis font-body text-caption pt-1.5 tabular-nums">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <h3
                            className={cn(
                              "font-body text-h3 transition-colors duration-[600ms] ease-surya",
                              active ? "text-ink" : "text-muted",
                            )}
                          >
                            {c.name}
                          </h3>
                          <p className="text-muted font-body text-body mt-1 max-w-[46ch]">
                            {c.note}
                          </p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
              <HairlineRule />
            </div>

            {closing ? (
              <p className="text-ink font-body text-body mt-14 max-w-[52ch]">
                {closing}
              </p>
            ) : null}
          </div>
        )}
      </Scrollytelling>
    </Section>
  );
}

/**
 * Placeholder for A6. Halves separate and the seed cluster emerges as progress
 * runs 0 → 1. Pure transform on SVG groups — nothing layout-triggering.
 */
function BeanDiagram({ progress }: { progress: number }) {
  const split = progress * 26;
  const seeds = Math.min(1, Math.max(0, (progress - 0.15) / 0.5));

  return (
    <div className="self-center">
      <svg
        viewBox="0 0 240 240"
        className="text-accent h-auto w-full max-w-[22rem]"
        role="img"
        aria-label="Diagram of a cacao bean opening in cross-section"
      >
        <g fill="none" stroke="currentColor" strokeWidth="1.25">
          <g style={{ transform: `translateX(${-split}px)` }}>
            <path d="M120 26c-34 22-52 54-52 94s18 72 52 94" />
            <path d="M120 44c-27 19-41 46-41 76s14 57 41 76" opacity="0.6" />
            <path d="M120 62c-20 15-31 36-31 58s11 43 31 58" opacity="0.35" />
          </g>
          <g style={{ transform: `translateX(${split}px)` }}>
            <path d="M120 26c34 22 52 54 52 94s-18 72-52 94" />
            <path d="M120 44c27 19 41 46 41 76s-14 57-41 76" opacity="0.6" />
            <path d="M120 62c20 15 31 36 31 58s-11 43-31 58" opacity="0.35" />
          </g>

          <g
            style={{
              opacity: seeds,
              transform: `scale(${0.85 + seeds * 0.15})`,
              transformOrigin: "120px 120px",
            }}
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <ellipse
                key={i}
                cx="120"
                cy={70 + i * 22}
                rx="13"
                ry="9"
                opacity="0.85"
              />
            ))}
          </g>
        </g>
      </svg>

      <p className="text-muted font-body text-caption mt-6 max-w-[28ch]">
        Schematic — pending A6, the drawn bean cross-section.
      </p>
    </div>
  );
}
