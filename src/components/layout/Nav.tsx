"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation } from "@content/navigation";
import Button from "@/components/ui/Button";
import CartButton from "@/components/cart/CartButton";

/**
 * The link list, plus the mobile drawer.
 *
 * Split from Header because this is the part that needs client state — the
 * drawer, the escape key, the scroll lock — while the bar itself is chrome.
 *
 * Every href here is verified against a section that actually exists: the
 * anchors #our-ritual, #about-us and #join-our-tribe are rendered by
 * RitualMeaning, About and JoinTheTribe respectively, and /shop and /retreats
 * are real routes. Nothing links to a planned-but-unbuilt section.
 */

const linkClass =
  "link-draw text-caption uppercase tracking-caption whitespace-nowrap";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change, so tapping a drawer link doesn't leave it hanging.
  // Adjusted during render (React's documented pattern for resetting state
  // off a changed prop) rather than in an effect, which would cost an extra
  // render pass for the same result.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    if (href.startsWith("/#")) return false; // anchors aren't a route state
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden items-center gap-8 lg:flex">
        <ul className="flex items-center gap-7">
          {navigation.links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={`${linkClass} ${
                  isActive(link.href) ? "text-gilded-gold" : ""
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <CartButton />

        <Button href={navigation.cta.href} size="compact">
          {navigation.cta.label}
        </Button>
      </div>

      {/* Mobile trigger */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((v) => !v)}
        className="text-caption tracking-caption uppercase lg:hidden"
      >
        {open ? "Close" : "Menu"}
      </button>

      {/* Mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="bg-deep-cacao-night text-sand-paper fixed inset-0 z-50 flex flex-col justify-center px-[var(--gutter)] lg:hidden"
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="text-caption tracking-caption absolute top-[1.9rem] right-[var(--gutter)] uppercase"
        >
          Close
        </button>

        <ul className="flex flex-col gap-6">
          {navigation.links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-h3"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex items-center gap-6">
          <Button href={navigation.cta.href} onDark>
            {navigation.cta.label}
          </Button>

          {/* CartButton opens the drawer via context; this wrapper also
              closes the mobile menu, since both are full-screen overlays and
              having them stack looks like a bug. */}
          <div onClick={() => setOpen(false)}>
            <CartButton />
          </div>
        </div>
      </div>
    </>
  );
}
