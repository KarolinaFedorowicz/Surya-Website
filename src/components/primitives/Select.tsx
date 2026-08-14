"use client";

import { useId, type ComponentPropsWithoutRef } from "react";

import { Field } from "./Field";
import { inputStyles } from "./Input";
import { cn } from "@/lib/utils";

/**
 * P13 — Select. Space type, group size, collaboration type.
 *
 * A native <select>, styled to match <Input>'s underline rather than replaced
 * with a custom listbox: the native control gets keyboard behaviour, mobile
 * pickers and screen-reader semantics correct for free, and none of that is
 * worth reimplementing for three short option lists.
 *
 * `appearance-none` strips the platform chevron so we can draw our own in
 * `emphasis` — the stock one arrives in a system blue we have no token for.
 */
export type SelectOption = { value: string; label: string };

type Props = Omit<ComponentPropsWithoutRef<"select">, "className" | "children"> & {
  label: string;
  options: SelectOption[];
  /** Shown as a disabled first option, since a native select has no empty state. */
  placeholder?: string;
  hint?: string;
  error?: string;
  className?: string;
};

export function Select({
  label,
  options,
  placeholder,
  hint,
  error,
  className,
  id,
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
      <div className="relative">
        <select
          {...rest}
          id={fieldId}
          defaultValue={rest.defaultValue ?? (placeholder ? "" : undefined)}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined
          }
          className={cn(inputStyles, "cursor-pointer appearance-none pr-8")}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {/* Decorative — the select itself carries the semantics. */}
        <svg
          aria-hidden="true"
          viewBox="0 0 12 8"
          className="text-emphasis pointer-events-none absolute top-1/2 right-1 h-2 w-3 -translate-y-1/2"
        >
          <path
            d="M1 1.5 6 6.5 11 1.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </Field>
  );
}
