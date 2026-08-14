// P12 — Textarea. SURYA_CACAO_BUILD_PLAN.md §3.1
"use client";

import { useId, type ComponentPropsWithoutRef } from "react";

import { Field } from "./Field";
import { inputStyles } from "./Input";
import { cn } from "@/lib/utils";

type Props = Omit<ComponentPropsWithoutRef<"textarea">, "className"> & {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
};

/** Shares <Input>'s underline treatment so a mixed form reads as one control set. */
export function Textarea({
  label,
  hint,
  error,
  className,
  id,
  rows = 4,
  ...rest
}: Props) {
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
      <textarea
        {...rest}
        id={fieldId}
        rows={rows}
        aria-invalid={error ? true : undefined}
        aria-describedby={
          error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
        }
        className={cn(inputStyles, "resize-y leading-relaxed")}
      />
    </Field>
  );
}
