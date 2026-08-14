// L1 — Nav. SURYA_CACAO_BUILD_PLAN.md §3.3
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { Container } from "./Container";
import { Mark } from "./Mark";
import { MobileMenu } from "./MobileMenu";
import { ShopDropdown } from "./ShopDropdown";
import { CartButton } from "@/components/commerce/CartButton";
import { SunriseProgress } from "@/components/motion";
import { NAV_LINKS, isOverlayRoute } from "@/config/site";
import type { Product } from "@/lib/shopify/types";
import { cn } from "@/lib/utils";

/** Distance scrolled before the nav commits to its solid state. */
const SOLID_AT = 64;

/**
 * The bar's height, fixed rather than derived from its contents. The tallest
 * child (the Shop pill) would otherwise set it, so the spacer below could not
 * be written down correctly — it was 7px short. One constant, used by both.
 */
const NAV_H = "h-20";

/**
 * Sticky, transparent over the hero → solid on scroll.
 *
 * Two details worth knowing:
 *
 * 1. Transparency is route-driven, not assumed. Only routes listed in
 *    `OVERLAY_ROUTES` have a dark full-bleed hero for the nav to sit on;
 *    everywhere else it is solid from first paint, because a transparent nav
 *    over Sand Paper is unreadable. Phase 4 adds routes as heroes are built.
 *
 * 2. The scroll listener is passive and coalesced into a single
 *    requestAnimationFrame — constraint §6.6, "no animation logic outside
 *    requestAnimationFrame". It sets one boolean; it does not animate
 *    per-frame. The visual change is a CSS transition.
 *
 * The nav progress ring (M8) lands here in Phase 8.
 */
export function Nav({ product }: { product: Product }) {
  const pathname = usePathname();
  const canOverlay = isOverlayRoute(pathname);

  const [solid, setSolid] = useState(!canOverlay);
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const ticking = useRef(false);

  useEffect(() => {
    if (!canOverlay) {
      setSolid(true);
      return;
    }

    const read = () => {
      setSolid(window.scrollY > SOLID_AT);
      ticking.current = false;
    };
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [canOverlay]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  return (
    <>
      <header
        // Overlaid on a dark hero the nav borrows the dark tone; once solid it
        // becomes a Sand Paper surface. Either way it only names tone roles.
        data-tone={solid ? "sand" : "dark"}
        className={cn(
          "fixed inset-x-0 top-0 z-50",
          "transition-colors duration-[600ms] ease-surya",
          solid
            ? "bg-surface border-hairline border-b"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <Container className={cn("flex items-center justify-between gap-6", NAV_H)}>
          {/* M8's progress ring sits around the mark — "the rays fill in as
              you descend" (brief §4.4). */}
          <span className="relative inline-flex items-center">
            <Mark
              href="/"
              variant="emblem"
              className={cn(
                "w-auto transition-all duration-[600ms] ease-surya",
                solid ? "h-9" : "h-11",
              )}
            />
            <SunriseProgress className="pointer-events-none absolute -right-8 size-7" />
          </span>

          <nav aria-label="Main" className="hidden items-center gap-9 md:flex">
            {NAV_LINKS.filter((l) => !l.emphasis).map((link) => {
              // "/" has to match exactly. startsWith would mark Home active on
              // every route in the site, which is how the nav ends up with two
              // current pages at once.
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative font-body text-caption uppercase tracking-[0.12em]",
                    "[font-variant-caps:all-small-caps] transition-colors duration-[600ms] ease-surya",
                    // The underline is a scaleX'd rule, matching P6 TextLink.
                    "after:bg-emphasis after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px",
                    "after:origin-left after:transition-transform after:duration-[600ms] after:ease-surya",
                    active
                      ? "text-emphasis after:scale-x-100"
                      : "text-ink after:scale-x-0 hover:after:scale-x-100",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <ShopDropdown product={product} />
            <CartButton />
          </nav>

          <div className="flex items-center gap-1 md:hidden">
            <CartButton />
            <button
            ref={burgerRef}
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="text-ink -mr-2 p-2"
          >
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M3 7h18M3 12h18M3 17h18" />
              )}
            </svg>
            </button>
          </div>
        </Container>
      </header>

      {/* The header is fixed, so it reserves no layout space. On overlay
          routes that's the point — the hero sits under it. Everywhere else
          the page would slide beneath the bar, so reserve its height here
          rather than making every Phase 4 section remember a top padding. */}
      {!canOverlay ? <div aria-hidden="true" className={NAV_H} /> : null}

      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        triggerRef={burgerRef}
      />
    </>
  );
}
