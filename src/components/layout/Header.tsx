"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { navigation } from "@content/navigation";
import LogoMark from "@/components/ui/LogoMark";
import Container from "./Container";
import Nav from "./Nav";

/**
 * The bar. Fixed, transparent over the hero, resolving to a Sand Paper surface
 * with a gold hairline once the reader scrolls past it.
 *
 * The mark is a CSS-masked SVG so it inherits the surrounding color token, and
 * "Surya" sits beside it rather than repeating the full wordmark — the mark
 * already carries "CEREMONIAL CACAO".
 */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`text-aubergine-ink fixed inset-x-0 top-0 z-40 h-[var(--header-h)] transition-[background-color,border-color] duration-[var(--dur-hover)] ease-[var(--ease-exhale)] ${
        scrolled
          ? "bg-sand-paper border-gilded-gold/40 border-b"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <Container className="flex h-full items-center justify-between gap-8">
        <Link
          href="/"
          aria-label={`${navigation.wordmark} — home`}
          className="flex items-center gap-3"
        >
          <LogoMark className="text-h3 h-8 w-[3.6rem] -translate-y-[0.142em]" />
          <span className="font-display text-h3 leading-none">
            {navigation.wordmark}
          </span>
        </Link>

        <Nav />
      </Container>
    </header>
  );
}
