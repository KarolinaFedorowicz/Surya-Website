"use client";

import { useActionState } from "react";
import { retreats } from "@content/retreats";
import {
  submitRetreatEnquiry,
  type FormState,
} from "@/app/retreats/actions";
import { buttonBase, buttonSize, buttonSkin } from "@/components/ui/buttonStyles";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

/**
 * Retreat booking form.
 *
 * Sits on a dark section, so every control follows the dark recipe: Sand Paper
 * text, gold hairlines, gold focus ring. Square corners like every other
 * element on the site — inputs get the same zero radius as buttons.
 *
 * Fields and destination are both confirmed. Delivery needs SMTP credentials
 * in .env.local; without them the error state names the fallback address so a
 * submission is never silently lost.
 */

const initial: FormState = { status: "idle" };

const fieldBase =
  "w-full border border-gilded-gold/45 bg-transparent px-4 py-3 " +
  "text-body text-sand-paper placeholder-sand-paper/40 " +
  "transition-colors duration-[var(--dur-hover)] ease-[var(--ease-exhale)] " +
  "hover:border-gilded-gold focus:border-gilded-gold focus:outline-none";

export default function RetreatForm() {
  const [state, action, pending] = useActionState(
    submitRetreatEnquiry,
    initial,
  );

  if (state.status === "sent") {
    return (
      <Reveal>
        <div className="border-gilded-gold max-w-[var(--measure)] border p-8">
          <p className="font-display text-h3">
            {retreats.form.successMessage}
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <div>
      <Reveal index={0}>
        <Eyebrow onDark>{retreats.form.eyebrow}</Eyebrow>
      </Reveal>

      {/* No hairline here — the intro above already carries one, and two rules
          in a short vertical run reads as noise rather than structure. */}

      <form action={action} className="mt-8 max-w-[36rem]">
        {/* Honeypot — hidden from people, not from bots. */}
        <div aria-hidden="true" className="absolute left-[-9999px]">
          <label>
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {retreats.form.fields.map((field, i) => (
            <Reveal
              key={field.name}
              index={i + 2}
              className={field.type === "textarea" ? "sm:col-span-2" : ""}
            >
              <label className="block">
                <span className="text-eyebrow tracking-eyebrow text-gilded-gold mb-2 block uppercase">
                  {field.label}
                  {!field.required && (
                    <span className="text-sand-paper/45"> (optional)</span>
                  )}
                </span>

                {field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    required={field.required}
                    rows={5}
                    className={`${fieldBase} resize-y`}
                  />
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    required={field.required}
                    autoComplete={field.autoComplete}
                    className={fieldBase}
                  />
                )}
              </label>
            </Reveal>
          ))}
        </div>

        {state.status === "error" && (
          <p
            role="alert"
            className="text-body text-gilded-gold mt-6 max-w-[var(--measure)]"
          >
            {retreats.form.errorMessage}
          </p>
        )}

        <Reveal index={retreats.form.fields.length + 2}>
          <button
            type="submit"
            disabled={pending}
            className={`${buttonBase} ${buttonSize.default} ${buttonSkin("primary", true)} mt-8 disabled:cursor-wait disabled:opacity-60`}
          >
            {pending ? "Sending…" : retreats.form.submit.label}
          </button>
        </Reveal>
      </form>
    </div>
  );
}
