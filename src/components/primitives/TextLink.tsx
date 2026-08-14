import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * P6 — TextLink. Inline link with a left-to-right underline draw.
 *
 * The draw is CSS-only (a scaleX'd pseudo-element), deliberately: constraint §6.3
 * keeps GSAP out of primitives, and this has to work before any JS loads. M5
 * `UnderlineLink` wraps this later to add the eased GSAP version; the resting
 * and hover states here are the fallback that survives if that never runs.
 *
 * The rule is drawn in `emphasis`, not gold — a gold underline on Sand Paper is
 * 1.65:1 and the underline IS the affordance that marks this as a link.
 */
const base = cn(
  "relative inline font-body text-ink no-underline",
  "transition-colors duration-[600ms] ease-surya",
  // The drawn rule. `bg-emphasis` + origin-left scaleX gives left-to-right.
  "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px",
  "after:bg-emphasis after:origin-left after:scale-x-0",
  "after:transition-transform after:duration-[600ms] after:ease-surya",
  "hover:after:scale-x-100 focus-visible:after:scale-x-100",
  // Resting state: a faint rule so the link is findable without hovering.
  "before:absolute before:inset-x-0 before:-bottom-0.5 before:h-px",
  "before:bg-emphasis/35",
);

type BaseProps = { children: ReactNode; className?: string };

type AsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseProps> & {
    href: string;
  };
type AsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & {
    href?: undefined;
  };

export type TextLinkProps = AsLink | AsButton;

export function TextLink({ children, className, ...rest }: TextLinkProps) {
  const cls = cn(base, className);

  if (rest.href !== undefined) {
    return (
      <Link {...(rest as Omit<AsLink, keyof BaseProps>)} className={cls}>
        {children}
      </Link>
    );
  }

  return (
    <button
      {...(rest as Omit<AsButton, keyof BaseProps>)}
      type={(rest as AsButton).type ?? "button"}
      className={cls}
    >
      {children}
    </button>
  );
}
