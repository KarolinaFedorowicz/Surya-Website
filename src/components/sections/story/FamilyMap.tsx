// S8 — FamilyMap. SURYA_CACAO_BUILD_PLAN.md §3.5
"use client";

import { Display, Eyebrow, Section } from "@/components/primitives";
import { Scrollytelling } from "@/components/motion";
import { mapRange } from "@/lib/motion/easings";
import type { Family } from "@/lib/mdx";
import { cn } from "@/lib/utils";

/**
 * Thin gold-line world map. Each point pauses into a vignette on scroll —
 * built on M11, the same wrapper S4 uses (plan §4).
 *
 * ⛔ A7 (the map linework) does not exist. The plate is a graticule rather
 * than invented coastlines: honest about being a placeholder, while the
 * waypoints project from the families' real coordinates. When A7 lands it
 * replaces the <Graticule> group and the points do not move.
 *
 * The connecting arcs draw themselves with stroke-dashoffset as progress
 * advances — the one place that technique genuinely works here, because these
 * are real open paths with strokes, unlike the traced logo (see M8's notes).
 */
const W = 1000;
const H = 500;

/** Equirectangular — the projection A7 must be drawn in to match. */
function project([lat, lng]: [number, number]) {
  return { x: ((lng + 180) / 360) * W, y: ((90 - lat) / 180) * H };
}

export function FamilyMap({ families }: { families: Family[] }) {
  const points = families.map((f) => ({ ...f, ...project(f.coordinates) }));

  return (
    <Section tone="dark" space="none" id="map" className="py-0">
      <Scrollytelling steps={families.length}>
        {({ progress, step, reduced }) => (
          <div className="flex min-h-svh flex-col justify-center py-24">
            <Eyebrow>Three continents</Eyebrow>
            <Display as="h2" size="section" className="mt-4 max-w-[16ch]">
              Where it comes from
            </Display>

            <div className="mt-12">
              <svg
                viewBox={`0 0 ${W} ${H}`}
                className="text-accent h-auto w-full"
                role="img"
                aria-label={`World map showing ${families
                  .map((f) => f.country)
                  .join(", ")}`}
              >
                <Graticule />

                {/* Arcs draw in sequence as the visitor scrolls. */}
                <g stroke="currentColor" strokeWidth="1.25" fill="none">
                  {points.slice(0, -1).map((p, i) => {
                    const q = points[i + 1];
                    const mx = (p.x + q.x) / 2;
                    const my = (p.y + q.y) / 2 - Math.abs(q.x - p.x) * 0.18;
                    const len = 900;
                    const drawn = reduced
                      ? 1
                      : mapRange(progress, i / points.length, (i + 1) / points.length, 0, 1);
                    return (
                      <path
                        key={`arc-${p.slug}`}
                        d={`M ${p.x} ${p.y} Q ${mx} ${my} ${q.x} ${q.y}`}
                        strokeDasharray={len}
                        strokeDashoffset={len * (1 - drawn)}
                        opacity="0.85"
                      />
                    );
                  })}
                </g>

                {points.map((p, i) => {
                  const active = reduced || i <= step;
                  return (
                    <g
                      key={p.slug}
                      className="transition-opacity duration-[600ms] ease-surya"
                      opacity={active ? 1 : 0.3}
                    >
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={active ? 16 : 10}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="0.75"
                        opacity="0.5"
                        style={{ transition: "r 600ms var(--ease-surya)" }}
                      />
                      <circle cx={p.x} cy={p.y} r="4.5" fill="currentColor" />
                      <text
                        x={p.x}
                        y={p.y - 28}
                        textAnchor="middle"
                        fill="currentColor"
                        className="font-body"
                        fontSize="20"
                        letterSpacing="2"
                      >
                        {p.country}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* The vignette each point pauses into. Stacked absolutely so
                they cross-fade in place — which needs `relative` here, or they
                anchor to some ancestor and vanish off-layout. Under reduced
                motion they stack normally and all three simply read. */}
            <div className={cn("mt-10 min-h-[6rem]", !reduced && "relative")}>
              {points.map((p, i) => (
                <p
                  key={p.slug}
                  aria-hidden={!reduced && i !== step}
                  className={cn(
                    "text-muted font-body text-body max-w-[46ch] transition-opacity duration-[600ms] ease-surya",
                    reduced ? "mt-3" : "absolute inset-x-0 top-0",
                    reduced || i === step ? "opacity-100" : "opacity-0",
                  )}
                >
                  <span className="text-emphasis">{p.country}</span> —{" "}
                  {p.narrative}
                </p>
              ))}
            </div>

            <p className="text-muted font-body text-caption mt-8">
              Waypoints project from the real coordinates. The plate is a
              graticule pending A7 — the points will not move when it lands.
            </p>
          </div>
        )}
      </Scrollytelling>
    </Section>
  );
}

function Graticule() {
  return (
    <g stroke="currentColor" strokeWidth="0.5" opacity="0.2" fill="none">
      {Array.from({ length: 11 }, (_, i) => (
        <line key={`h${i}`} x1="0" x2={W} y1={(i * H) / 10} y2={(i * H) / 10} />
      ))}
      {Array.from({ length: 13 }, (_, i) => (
        <line key={`v${i}`} y1="0" y2={H} x1={(i * W) / 12} x2={(i * W) / 12} />
      ))}
    </g>
  );
}
