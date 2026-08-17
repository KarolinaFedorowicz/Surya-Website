"use client";

import { useRef, type MouseEvent } from "react";

/**
 * Subtle 3D tilt, capped at 4deg. Used on the product panel — the one card
 * type on the site. Square corners and the gold hairline come from the caller,
 * so this primitive owns interaction only, not shape.
 */

const MAX_TILT = 4;

export default function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function tilt(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const box = el.getBoundingClientRect();
    const px = (e.clientX - box.left) / box.width - 0.5;
    const py = (e.clientY - box.top) / box.height - 0.5;

    el.style.transform = `perspective(900px) rotateY(${px * MAX_TILT * 2}deg) rotateX(${-py * MAX_TILT * 2}deg)`;
  }

  function release() {
    if (ref.current) ref.current.style.transform = "";
  }

  return (
    <div
      ref={ref}
      className={`tilt ${className ?? ""}`}
      onMouseMove={tilt}
      onMouseLeave={release}
    >
      {children}
    </div>
  );
}
