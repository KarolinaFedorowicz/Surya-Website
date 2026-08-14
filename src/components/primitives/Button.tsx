// P5 — Button. SURYA_CACAO_BUILD_PLAN.md §3.1
import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * brief §3.1: Gilded Gold is "accent only — never used as a fill." So the only
 * filled style is `primary`, which uses the tone's `--btn-bg` (Aubergine on
 * light, Sand on dark). Gold appears on buttons as a hairline border or as
 * text — never as a background.
 *
 * NOTE — resolved conflict: the build prompt §3 describes the nav Shop button
 * as "a filled gold/aubergine pill". Read literally that would fill with gold,
 * which §3.1 forbids. Resolution: the pill is Aubergine-filled with a Gold
 * hairline. Flagged for confirmation in the Phase 1 summary.
 *
 * Magnetic hover pull (brief §4.1) is NOT here — it arrives in Phase 6 as
 * <MagneticButton> wrapping this, keeping GSAP out of primitives entirely.
 */
const VARIANT = {
  primary: "bg-btn text-btn-ink border border-transparent hover:opacity-90",
  secondary:
    "bg-transparent text-ink border border-accent hover:bg-accent/10",
  /** Text-only, for "Our story ↓" style secondary actions. */
  quiet:
    "bg-transparent text-ink border-0 px-0 underline decoration-accent decoration-1 underline-offset-[0.4em] hover:decoration-[1.5px]",
} as const;

const SIZE = {
  sm: "text-caption px-5 py-2.5",
  md: "text-caption px-7 py-3.5",
  lg: "text-body px-9 py-4",
} as const;

type BaseProps = {
  children: ReactNode;
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  className?: string;
};

/* A pill, not a rounded rect — echoes the sun disc rather than a UI chrome box.
   `quiet` opts out of the pill since it has no fill to shape. */
function classes({
  variant = "primary",
  size = "md",
  className,
}: Omit<BaseProps, "children">) {
  return cn(
    "inline-flex items-center justify-center gap-2 font-body uppercase",
    "tracking-[0.12em] [font-variant-caps:all-small-caps] whitespace-nowrap",
    "transition-all duration-[600ms] ease-surya cursor-pointer",
    "disabled:pointer-events-none disabled:opacity-45",
    variant !== "quiet" && "rounded-full",
    SIZE[size],
    VARIANT[variant],
    className,
  );
}

type ButtonAsButton = BaseProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps> & {
    href?: undefined;
  };

type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, keyof BaseProps> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({
  children,
  variant,
  size,
  className,
  ...rest
}: ButtonProps) {
  const cls = classes({ variant, size, className });

  if (rest.href !== undefined) {
    const linkProps = rest as Omit<ButtonAsLink, keyof BaseProps>;
    return (
      <Link {...linkProps} className={cls}>
        {children}
      </Link>
    );
  }

  const buttonProps = rest as Omit<ButtonAsButton, keyof BaseProps>;
  return (
    <button {...buttonProps} type={buttonProps.type ?? "button"} className={cls}>
      {children}
    </button>
  );
}
