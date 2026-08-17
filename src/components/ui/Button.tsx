"use client";

import Link from "next/link";
import { useRef, type MouseEvent } from "react";
import { buttonBase, buttonSize, buttonSkin } from "./buttonStyles";

/**
 * The one button in the system. Two variants, one shape (square, per the
 * radius decision), one interaction: magnetic pull toward the cursor capped
 * at 6px, which is enough to feel weighted without reading as a gimmick.
 *
 * Colors come from tokens only:
 *   primary  — Aubergine fill, Sand Paper text (Aubergine is the primary token)
 *   ghost    — gold hairline, no fill (gold is never a fill)
 *
 * On dark surfaces `onDark` swaps the pairing so contrast holds: gold fill
 * with Night text, since Aubergine on Night is too close to read.
 */

const MAX_PULL = 6;

type ButtonProps = {
  /** Empty string means the destination doesn't exist yet — see below. */
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  onDark?: boolean;
  size?: keyof typeof buttonSize;
  /** Tooltip shown when href is empty. Names what's missing. */
  unavailableReason?: string;
};

export default function Button({
  href,
  children,
  variant = "primary",
  onDark = false,
  size = "default",
  unavailableReason,
}: ButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);

  function pull(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const box = el.getBoundingClientRect();
    const dx = e.clientX - (box.left + box.width / 2);
    const dy = e.clientY - (box.top + box.height / 2);
    const clamp = (n: number, span: number) =>
      Math.max(-MAX_PULL, Math.min(MAX_PULL, (n / span) * MAX_PULL * 2));

    el.style.transform = `translate(${clamp(dx, box.width)}px, ${clamp(dy, box.height)}px)`;
  }

  function release() {
    if (ref.current) ref.current.style.transform = "";
  }

  // A CTA whose destination hasn't been decided yet renders as a disabled
  // control rather than a link to nowhere. Built here, once, so no section has
  // to hand-roll its own version of "not connected".
  if (!href) {
    return (
      <button
        disabled
        title={unavailableReason}
        className={`${buttonBase} ${buttonSize[size]} cursor-not-allowed ${
          onDark
            ? "border-gilded-gold/50 text-gilded-gold/55"
            : "border-gilded-gold/60 text-aubergine-ink/50"
        }`}
      >
        {children}
      </button>
    );
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={`${buttonBase} ${buttonSize[size]} ${buttonSkin(variant, onDark)}`}
      onMouseMove={pull}
      onMouseLeave={release}
      onBlur={release}
    >
      {children}
    </Link>
  );
}
