"use client";

import { useActionState } from "react";
import { contact } from "@content/contact";
import { submitContactMessage, type FormState } from "@/app/contact/actions";
import { buttonBase, buttonSize, buttonSkin } from "@/components/ui/buttonStyles";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

/**
 * The /contact form — structurally identical to RetreatForm.tsx (same
 * field-driven rendering, same dark-section control styling, same
 * success/error pattern) because it's the same kind of thing: a short form
 * on a dark section, delivered over the same SMTP transport. Kept as its own
 * component rather than a shared one because that's how this codebase
 * already handles it — one form component per page, not a generic abstraction.
 */

const initial: FormState = { status: "idle" };

const fieldBase =
  "w-full border border-gilded-gold/45 bg-transparent px-4 py-3 " +
  "text-body text-sand-paper placeholder-sand-paper/40 " +
  "transition-colors duration-[var(--dur-hover)] ease-[var(--ease-exhale)] " +
  "hover:border-gilded-gold focus:border-gilded-gold focus:outline-none";

export default function ContactForm() {
  const [state, action, pending] = useActionState(submitContactMessage, initial);

  if (state.status === "sent") {
    return (
      <Reveal>
        <div className="border-gilded-gold max-w-[var(--measure)] border p-8">
          <p className="font-display text-h3">{contact.form.successMessage}</p>
        </div>
      </Reveal>
    );
  }

  return (
    <div>
      <Reveal index={0}>
        <Eyebrow onDark>{contact.form.eyebrow}</Eyebrow>
      </Reveal>

      <form action={action} className="mt-8 max-w-[36rem]">
        <div className="grid gap-6 sm:grid-cols-2">
          {contact.form.fields.map((field, i) => (
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
            {contact.form.errorMessage}
          </p>
        )}

        <Reveal index={contact.form.fields.length + 2}>
          <button
            type="submit"
            disabled={pending}
            className={`${buttonBase} ${buttonSize.default} ${buttonSkin("primary", true)} mt-8 disabled:cursor-wait disabled:opacity-60`}
          >
            {pending ? "Sending…" : contact.form.submit.label}
          </button>
        </Reveal>
      </form>
    </div>
  );
}
