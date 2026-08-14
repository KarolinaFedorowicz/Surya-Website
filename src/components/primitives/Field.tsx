// P10 — Field. SURYA_CACAO_BUILD_PLAN.md §3.1
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export type FieldProps = {
  /** Must match the control's `id`. Input/Textarea wire this automatically. */
  htmlFor: string;
  label: string;
  children: ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
};

/**
 * Label + control + hint/error, in the tone's own colors.
 *
 * NOTE — open question flagged for the Phase 1 review: the palette has five
 * colors and none of them is an error red. Rather than invent a sixth token,
 * errors are signalled by text, `aria-invalid`, and a doubled ink underline —
 * never by color alone. That is stricter than WCAG 1.4.1 requires and reads as
 * restraint rather than an alarm, which suits the brand. If you want a real
 * error color, it needs to be a brand decision, not a component default.
 */
export function Field({
  htmlFor,
  label,
  children,
  hint,
  error,
  required,
  className,
}: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={htmlFor}
        className="font-body text-eyebrow text-muted uppercase [font-variant-caps:all-small-caps]"
      >
        {label}
        {required ? (
          <span aria-hidden="true" className="text-emphasis ml-1">
            *
          </span>
        ) : null}
      </label>

      {children}

      {hint && !error ? (
        <p id={`${htmlFor}-hint`} className="font-body text-caption text-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p
          id={`${htmlFor}-error`}
          className="font-body text-caption text-ink"
          /* Announced on change without stealing focus. */
          role="status"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
