// L5 — Newsletter. SURYA_CACAO_BUILD_PLAN.md §3.3
"use client";

import { useState } from "react";

import { Button, Input } from "@/components/primitives";

/**
 * "Framed as joining the ritual, never 'subscribe'" — plan L5.
 *
 * Phase 2 is presentation only: the POST target (`/api/notify`) arrives in
 * Phase 5. Until then the form validates, shows its success state, and does
 * not pretend to have stored anything — it says so plainly rather than
 * claiming a subscription that never happened.
 */
export function Newsletter({
  /* Passed in rather than read here: this is a client component and the content
     loader is server-only. L4 Footer supplies them from newsletter.mdx. */
  title,
  lead,
}: {
  title: string;
  lead?: string;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="w-full max-w-md">
      <p className="text-ink font-body text-h3">{title}</p>
      {lead ? (
        <p className="text-muted font-body text-caption mt-2">{lead}</p>
      ) : null}

      {done ? (
        <p className="text-emphasis font-body text-body mt-6" role="status">
          Thank you — we&rsquo;ll be in touch.
          <span className="text-muted block text-caption">
            (Not yet wired to a mailing list — Phase 5.)
          </span>
        </p>
      ) : (
        <form
          className="mt-6 flex items-end gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            setDone(true);
          }}
        >
          <Input
            label="Email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" variant="secondary" size="sm" className="mb-1">
            Join
          </Button>
        </form>
      )}
    </div>
  );
}
