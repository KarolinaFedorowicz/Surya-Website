// L3 — MobileMenu. SURYA_CACAO_BUILD_PLAN.md §3.3
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { HairlineRule } from "@/components/primitives";
import { Mark } from "./Mark";
import { SocialLinks } from "./SocialLinks";
import { LEGAL_LINKS, NAV_LINKS, SITE } from "@/config/site";
import { cn } from "@/lib/utils";

/**
 * Full-screen overlay. Gold linework, generous spacing — plan L3.
 *
 * Focus is trapped while open and returned to the trigger on close, and body
 * scroll is locked. The panel is kept mounted so the 600ms ease has something
 * to run against, but it is `inert` when closed so neither the keyboard nor a
 * screen reader can reach it.
 */
export function MobileMenu({
  open,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Any navigation closes the menu.
  useEffect(() => {
    if (open) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;

      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, triggerRef]);

  return (
    <div
      ref={panelRef}
      data-tone="dark"
      id="mobile-menu"
      // `inert` removes the whole subtree from tab order and the a11y tree.
      inert={!open}
      className={cn(
        "bg-surface fixed inset-0 z-40 flex flex-col overflow-y-auto px-6 pt-28 pb-12 md:hidden",
        "transition-opacity duration-[600ms] ease-surya",
        open ? "opacity-100" : "pointer-events-none opacity-0",
      )}
    >
      <nav aria-label="Main">
        <ul>
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <HairlineRule />
              <Link
                href={link.href}
                className={cn(
                  "font-display text-h2 block py-5",
                  link.href === pathname ? "text-emphasis" : "text-ink",
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <HairlineRule />
      </nav>

      <div className="mt-auto pt-16">
        <Mark variant="emblem" className="text-accent h-12 w-auto" />

        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
          {LEGAL_LINKS.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-muted font-body text-caption"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-muted font-body text-caption mt-6">
          Ships to {SITE.shippingRegions.join(" and the ")}
        </p>

        <SocialLinks className="mt-8" />
      </div>
    </div>
  );
}
