"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-triggered reveal: fade up 10px on entry, 80ms stagger per index.
 * Consistent and ordered, never randomized.
 *
 * Fires once and disconnects — re-animating on every scroll pass is the thing
 * that makes reveal effects feel cheap. The CSS resting state is visible, so
 * content is readable if this never runs.
 */

type RevealProps = {
  children: React.ReactNode;
  /** Position in a staggered group. Multiplied by 80ms. */
  index?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
};

export default function Reveal({
  children,
  index = 0,
  className,
  as = "div",
}: RevealProps) {
  // Widened so the element union doesn't collapse the ref type to an
  // impossible intersection of div/li/section refs.
  const Tag = as as React.ElementType;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal={shown ? "shown" : ""}
      style={{ "--reveal-delay": `${index * 80}ms` } as React.CSSProperties}
      className={className}
    >
      {children}
    </Tag>
  );
}
