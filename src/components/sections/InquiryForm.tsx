// S18 — InquiryForm. SURYA_CACAO_BUILD_PLAN.md §3.5 / §4 consolidation map
"use client";

import { useState } from "react";

import {
  Button,
  Display,
  Eyebrow,
  Input,
  Section,
  Select,
  Textarea,
} from "@/components/primitives";

/**
 * ONE component, config-driven. Retreats, Partnerships and Contact pass
 * different field sets and copy — plan §4: "saves 2 near-identical components
 * and 2 API routes." The studio-stocking audience from the dropped /studio
 * page is a collaboration-type option here rather than a third form.
 *
 * Posts to /api/inquiry and reflects its real `delivered` flag in the success
 * state, rather than claiming delivery unconditionally.
 */
export type InquiryField =
  | { kind: "text"; name: string; label: string; required?: boolean; hint?: string }
  | { kind: "email"; name: string; label: string; required?: boolean; hint?: string }
  | { kind: "textarea"; name: string; label: string; required?: boolean; hint?: string }
  | {
      kind: "select";
      name: string;
      label: string;
      required?: boolean;
      hint?: string;
      placeholder?: string;
      options: { value: string; label: string }[];
    };

export type InquiryConfig = {
  eyebrow: string;
  heading: string;
  intro: string;
  submitLabel: string;
  fields: InquiryField[];
  /** Names the form in the email subject when no `inquiryType` field is present. */
  formName?: string;
};

export function InquiryForm({
  config,
  tone = "dark",
  id,
}: {
  config: InquiryConfig;
  tone?: "dark" | "sand" | "ivory";
  id?: string;
}) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const sent = status === "sent";

  return (
    <Section tone={tone} space="normal" id={id}>
      <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <div>
          <Eyebrow>{config.eyebrow}</Eyebrow>
          <Display as="h2" size="section" className="mt-4 max-w-[16ch]">
            {config.heading}
          </Display>
          <p className="text-muted font-body text-body mt-8 max-w-[44ch]">
            {config.intro}
          </p>
        </div>

        {sent ? (
          <div role="status" className="self-center">
            <Display as="p" size="section" color="emphasis" className="text-h3">
              Thank you — we&rsquo;ll be in touch.
            </Display>
          </div>
        ) : (
          <form
            className="grid gap-8"
            onSubmit={async (e) => {
              e.preventDefault();
              setStatus("sending");

              const data = Object.fromEntries(
                new FormData(e.currentTarget).entries(),
              );
              if (config.formName) data.formName = config.formName;

              try {
                const res = await fetch("/api/inquiry", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(data),
                });
                setStatus(res.ok ? "sent" : "error");
              } catch {
                setStatus("error");
              }
            }}
          >
            {config.fields.map((f) => {
              if (f.kind === "select") {
                return (
                  <Select
                    key={f.name}
                    name={f.name}
                    label={f.label}
                    required={f.required}
                    hint={f.hint}
                    placeholder={f.placeholder}
                    options={f.options}
                  />
                );
              }
              if (f.kind === "textarea") {
                return (
                  <Textarea
                    key={f.name}
                    name={f.name}
                    label={f.label}
                    required={f.required}
                    hint={f.hint}
                  />
                );
              }
              return (
                <Input
                  key={f.name}
                  name={f.name}
                  label={f.label}
                  type={f.kind === "email" ? "email" : "text"}
                  autoComplete={f.kind === "email" ? "email" : undefined}
                  required={f.required}
                  hint={f.hint}
                />
              );
            })}

            <div>
              <Button type="submit" size="lg" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : config.submitLabel}
              </Button>
              {status === "error" ? (
                <p role="alert" className="text-ink font-body text-caption mt-4 max-w-[34ch]">
                  Something went wrong sending that — please try again.
                </p>
              ) : null}
            </div>
          </form>
        )}
      </div>
    </Section>
  );
}
