// P11 — Input. SURYA_CACAO_BUILD_PLAN.md §3.1
"use client";

import { useId, type ComponentPropsWithoutRef } from "react";

import { Field } from "./Field";
import { cn } from "@/lib/utils";

/**
 * Underline-only, never a boxed control — the same hairline language as
 * <HairlineRule> and the sun mark's linework. brief §3.4 rules out shadows and
 * chrome for depth, and a bordered rectangle would read as generic form UI.
 *
 * Client component because it generates its own id via `useId` to guarantee
 * the label association. Pass `id` explicitly to override.
 */
export const inputStyles = cn(
  "w-full bg-transparent font-body text-body text-ink",
  // `border-muted`, not `border-hairline`: the resting underline is what tells
  // a user this is a control, so it is load-bearing and must clear 3:1.
  "border-0 border-b border-muted rounded-none px-0 py-3",
  "transition-colors duration-[600ms] ease-surya",
  "placeholder:text-muted placeholder:opacity-60",
  // State change uses `emphasis`, not gold: a gold border on Sand Paper is
  // 1.65:1 and would make focus/hover effectively invisible.
  "hover:border-emphasis focus:border-emphasis focus:outline-none",
  "focus-visible:outline-2 focus-visible:outline-ink focus-visible:outline-offset-4",
  "aria-[invalid=true]:border-b-2 aria-[invalid=true]:border-ink",
  "disabled:opacity-45 disabled:cursor-not-allowed",
);

type Props = Omit<ComponentPropsWithoutRef<"input">, "className"> & {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
};

export function Input({ label, hint, error, className, id, ...rest }: Props) {
  const generatedId = useId();
  const fieldId = id ?? generatedId;

  return (
    <Field
      htmlFor={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={rest.required}
      className={className}
    >
      <input
        {...rest}
        id={fieldId}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        className={inputStyles}
      />
    </Field>
  );
}
