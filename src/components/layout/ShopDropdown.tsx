// L2 — ShopDropdown. SURYA_CACAO_BUILD_PLAN.md §3.3
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { HairlineRule } from "@/components/primitives";
import { formatPrice } from "@/lib/money";
import type { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

/**
 * Quick-view: the three bag sizes as thumbnails with price.
 *
 * Opens on hover for pointer users and on click/Enter for everyone else, so it
 * is operable from the keyboard and on touch — a hover-only menu would strand
 * both. Escape closes and returns focus to the trigger.
 *
 * Data comes from the mock module (§1.A); the shape is Shopify's, so Phase 5
 * swaps the import and nothing here changes.
 */
export function ShopDropdown({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div
      ref={wrapRef}
      className={cn("relative", className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      // Closes when tabbing out of the whole cluster.
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <Link
        ref={triggerRef}
        href="/shop"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={menuId}
        onClick={(e) => {
          // On touch, the first tap reveals the menu instead of navigating.
          if (window.matchMedia("(hover: none)").matches && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          "bg-btn text-btn-ink border-accent inline-flex items-center rounded-full border",
          "px-6 py-2.5 font-body text-caption uppercase tracking-[0.12em]",
          "[font-variant-caps:all-small-caps] whitespace-nowrap",
          "transition-opacity duration-[600ms] ease-surya hover:opacity-90",
        )}
      >
        Shop
      </Link>

      {/* Rendered always so the transition has something to animate from;
          hidden from AT and pointer events when closed. */}
      <div
        id={menuId}
        data-tone="ivory"
        aria-hidden={!open}
        className={cn(
          "bg-surface border-hairline absolute top-full right-0 z-50 mt-3 w-[19rem] rounded-sm border p-5",
          "transition-all duration-[600ms] ease-surya",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <p className="text-muted font-body text-eyebrow uppercase tracking-[0.15em] [font-variant-caps:all-small-caps]">
          {product.title}
        </p>
        <HairlineRule className="mt-3" />

        <ul className="mt-1">
          {product.variants.map((v) => (
            <li key={v.id}>
              <Link
                href={`/shop/${product.handle}?size=${v.title}`}
                tabIndex={open ? 0 : -1}
                className="hover:bg-ink/5 -mx-2 flex items-center gap-4 rounded-sm px-2 py-3 transition-colors duration-[400ms] ease-surya"
              >
                <span className="bg-ink/5 relative size-14 shrink-0 overflow-hidden rounded-sm">
                  <Image
                    src={product.images[1]?.url ?? product.featuredImage.url}
                    alt=""
                    fill
                    sizes="56px"
                    className="object-contain p-1"
                  />
                </span>
                <span className="text-ink font-body text-body flex-1">
                  {v.title}
                </span>
                <span className="text-muted font-body text-caption">
                  {formatPrice(v.price)}
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <HairlineRule />
        <Link
          href="/shop"
          tabIndex={open ? 0 : -1}
          className="text-emphasis mt-4 inline-block font-body text-caption uppercase tracking-[0.12em] [font-variant-caps:all-small-caps]"
        >
          All formats →
        </Link>
      </div>
    </div>
  );
}
