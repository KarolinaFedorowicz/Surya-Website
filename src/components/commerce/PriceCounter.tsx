// C3 — PriceCounter. SURYA_CACAO_BUILD_PLAN.md §3.4
"use client";

import { useEffect, useRef, useState } from "react";

import { formatPrice } from "@/lib/money";
import type { Money } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

/**
 * Price and weight count up on size change — never a hard swap. brief §5.4
 *
 * The tween runs inside requestAnimationFrame (constraint §6.6) and animates
 * text content only, so nothing here triggers layout beyond the number itself.
 * Tabular figures keep the digits from jittering as they change width.
 *
 * Reduced motion is handled locally rather than by importing a motion
 * primitive: this is a number tween, not a transform, so the global CSS brake
 * in globals.css can't reach it. It snaps to the final value instead.
 */
const DURATION = 600;

function useCountUp(target: number) {
  const [value, setValue] = useState(target);
  const from = useRef(target);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      from.current = target;
      setValue(target);
      return;
    }

    const start = performance.now();
    const origin = from.current;
    const delta = target - origin;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      // Matches --ease-surya's shape: fast out, long settle.
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(origin + delta * eased);
      if (t < 1) {
        raf.current = requestAnimationFrame(tick);
      } else {
        from.current = target;
      }
    };

    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
      from.current = target;
    };
  }, [target]);

  return value;
}

export function PriceCounter({
  price,
  weight,
  className,
}: {
  price: Money;
  weight: number;
  className?: string;
}) {
  const amount = useCountUp(Number(price.amount));
  const grams = useCountUp(weight);

  return (
    <p className={cn("flex items-baseline gap-4 tabular-nums", className)}>
      <span className="text-ink font-display text-h2">
        {formatPrice({ ...price, amount: amount.toFixed(2) })}
      </span>
      <span className="text-muted font-body text-caption">
        {Math.round(grams)}g
      </span>
    </p>
  );
}
