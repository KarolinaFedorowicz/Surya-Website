// C2 — SizeSelector. SURYA_CACAO_BUILD_PLAN.md §3.4
"use client";

import type { ProductVariant } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

/**
 * 150g / 300g / 500g as one control, not three cards.
 *
 * A radiogroup rather than buttons: arrow keys move between sizes, which is
 * what a keyboard user expects from a set of mutually exclusive options, and
 * it announces "2 of 3" instead of reading three unrelated buttons.
 *
 * The photography cross-fade this drives lives in C1 ProductBlock — this
 * component owns selection only.
 */
export function SizeSelector({
  variants,
  selected,
  onSelect,
  className,
}: {
  variants: ProductVariant[];
  selected: ProductVariant;
  onSelect: (v: ProductVariant) => void;
  className?: string;
}) {
  const move = (dir: 1 | -1) => {
    const i = variants.findIndex((v) => v.id === selected.id);
    onSelect(variants[(i + dir + variants.length) % variants.length]);
  };

  return (
    <div
      role="radiogroup"
      aria-label="Size"
      className={cn("border-hairline inline-flex rounded-full border p-1", className)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowDown") {
          e.preventDefault();
          move(1);
        } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
          e.preventDefault();
          move(-1);
        }
      }}
    >
      {variants.map((v) => {
        const active = v.id === selected.id;
        return (
          <button
            key={v.id}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={active ? 0 : -1}
            disabled={!v.availableForSale}
            onClick={() => onSelect(v)}
            className={cn(
              "rounded-full px-6 py-2.5 font-body text-caption uppercase tracking-[0.12em]",
              "[font-variant-caps:all-small-caps] transition-all duration-[600ms] ease-surya",
              "disabled:cursor-not-allowed disabled:opacity-40",
              active ? "bg-btn text-btn-ink" : "text-muted hover:text-ink",
            )}
          >
            {v.title}
          </button>
        );
      })}
    </div>
  );
}
