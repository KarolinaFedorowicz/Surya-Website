// M2 — Reveal. SURYA_CACAO_BUILD_PLAN.md §3.2
"use client";

import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react";

import { useReducedMotion } from "./ReducedMotionProvider";
import { REVEAL, EASE_SURYA_CSS } from "@/config/motion";
import { cn } from "@/lib/utils";

/**
 * Fade up 8–12px on entry. `stagger` sequences children ~80ms apart.
 *
 * The workhorse — the plan expects it ~80 times across the site, which drove
 * three decisions:
 *
 * · IntersectionObserver, not scroll maths. It costs nothing when idle and
 *   doesn't add a subscriber to the shared rAF loop for something that fires
 *   once. scrollProgress is for continuous values; this is a threshold event.
 *
 * · The transition is CSS, not GSAP. 80 GSAP tweens for a fade is waste, and
 *   CSS transitions are interruptible and compositor-friendly. GSAP is
 *   reserved for pinning and scrubbing, where it earns its weight.
 *
 * · It unobserves after firing. Reveals do not replay on scroll-back —
 *   brief §4.1 asks for consistency, and re-animating text someone has already
 *   read is noise.
 *
 * Reduced motion renders the final state immediately, with no transition.
 */
export function Reveal({
  children,
  stagger = false,
  as: Tag = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  /** Sequence direct children ~80ms apart instead of revealing as one block. */
  stagger?: boolean;
  as?: "div" | "section" | "ul" | "ol" | "li" | "p";
  /** Extra seconds before this element begins. */
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (reduced) {
      setShown(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: REVEAL.threshold, rootMargin: REVEAL.rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  const base = {
    transitionProperty: reduced ? "none" : "opacity, transform",
    transitionDuration: `${REVEAL.duration}s`,
    transitionTimingFunction: EASE_SURYA_CSS,
  } as const;

  // `Tag` is a union of intrinsic elements, so TS wants the intersection of
  // all their ref types. The node is only ever read as an HTMLElement.
  const attachRef = ref as React.Ref<never>;

  if (!stagger) {
    return (
      <Tag
        ref={attachRef}
        className={cn(className)}
        style={{
          ...base,
          transitionDelay: `${delay}s`,
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : `translateY(${REVEAL.distance}px)`,
          willChange: shown ? undefined : "opacity, transform",
        }}
      >
        {children}
      </Tag>
    );
  }

  return (
    <Tag ref={attachRef} className={cn(className)}>
      {Children.map(children, (child, i) => {
        const style: CSSProperties = {
          ...base,
          // Consistent, never randomised — brief §4.1.
          transitionDelay: `${delay + i * REVEAL.stagger}s`,
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : `translateY(${REVEAL.distance}px)`,
          willChange: shown ? undefined : "opacity, transform",
        };

        // Merge onto the child rather than wrapping it. Wrapping would put a
        // <div> between a <ul> and its <li>s, which is invalid HTML and breaks
        // list semantics for screen readers.
        if (isValidElement(child)) {
          const el = child as ReactElement<{ style?: CSSProperties }>;
          return cloneElement(el, {
            style: { ...style, ...(el.props.style ?? {}) },
          });
        }

        // Text nodes have nowhere to put a style; leave them be.
        return child;
      })}
    </Tag>
  );
}
