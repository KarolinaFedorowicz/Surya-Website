"use client";

import { useActionState } from "react";
import { submitRestockWaitlist, type FormState } from "@/app/actions";
import { buttonBase, buttonSize, buttonSkin } from "@/components/ui/buttonStyles";
import Eyebrow from "@/components/ui/Eyebrow";
import Reveal from "@/components/ui/Reveal";

/**
 * The /restock-waitlist form. Same dark-section control styling and
 * success/error pattern as ContactForm.tsx — one form component per page,
 * as elsewhere in this codebase.
 */

const initial: FormState = { status: "idle" };

const fieldBase =
  "w-full border border-gilded-gold/45 bg-transparent px-4 py-3 " +
  "text-body text-sand-paper placeholder-sand-paper/40 " +
  "transition-colors duration-[var(--dur-hover)] ease-[var(--ease-exhale)] " +
  "hover:border-gilded-gold focus:border-gilded-gold focus:outline-none";

const labelBase =
  "text-eyebrow tracking-eyebrow text-gilded-gold mb-2 block uppercase";

export default function RestockWaitlistForm({
  defaultLocation,
}: {
  /** The detected country's name ("Poland"), editable. */
  defaultLocation: string;
}) {
  const [state, action, pending] = useActionState(submitRestockWaitlist, initial);

  if (state.status === "sent") {
    return (
      <Reveal>
        <div className="border-gilded-gold max-w-[var(--measure)] border p-8">
          <p className="font-display text-h3">
            You&rsquo;re on the list. We&rsquo;ll email you as soon as the
            cacao is back.
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <div>
      <Reveal index={0}>
        <Eyebrow onDark>Join the waitlist</Eyebrow>
      </Reveal>

      <form action={action} className="mt-8 max-w-[36rem]">
        <div className="grid gap-6 sm:grid-cols-2">
          <Reveal index={2}>
            <label className="block">
              <span className={labelBase}>Email</span>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                className={fieldBase}
              />
            </label>
          </Reveal>

          <Reveal index={3}>
            <label className="block">
              <span className={labelBase}>Country / region</span>
              <input
                name="location"
                type="text"
                required
                maxLength={100}
                autoComplete="country-name"
                defaultValue={defaultLocation}
                className={fieldBase}
              />
            </label>
          </Reveal>
        </div>

        {state.status === "error" && (
          <p
            role="alert"
            className="text-body text-gilded-gold mt-6 max-w-[var(--measure)]"
          >
            Please check your email and country, then try again.
          </p>
        )}

        <Reveal index={4}>
          <button
            type="submit"
            disabled={pending}
            className={`${buttonBase} ${buttonSize.default} ${buttonSkin("primary", true)} mt-8 disabled:cursor-wait disabled:opacity-60`}
          >
            {pending ? "Signing up…" : "Notify me"}
          </button>
        </Reveal>
      </form>
    </div>
  );
}
