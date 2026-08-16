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
 * ONE component, config-driven. Retreats and Partnerships pass different field
 * sets and copy — plan §4: "saves 2 near-identical components and 2 API
 * routes." The studio-stocking audience from the dropped /studio page is a
 * collaboration-type option here rather than a third form.
 *
 * Phase 4 is presentation: it validates and shows a success state but does not
 * claim to have sent anything. /api/inquiry is Phase 5, and the confirmation
 * says so rather than lying about delivery.
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
  const [sent, setSent] = useState(false);

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
            <p className="text-muted font-body text-caption mt-4 max-w-[40ch]">
              Not yet delivered anywhere: the inquiry endpoint is wired in
              Phase 5. Nothing has been stored.
            </p>
          </div>
        ) : (
          <form
            className="grid gap-8"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
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
              <Button type="submit" size="lg">
                {config.submitLabel}
              </Button>
            </div>
          </form>
        )}
      </div>
    </Section>
  );
}
