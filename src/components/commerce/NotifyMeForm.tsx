// C10 — NotifyMeForm. SURYA_CACAO_BUILD_PLAN.md §3.4
"use client";

import { useState } from "react";

import { Button, Input } from "@/components/primitives";
import { cn } from "@/lib/utils";

/**
 * Email capture for locked products.
 *
 * Posts to /api/notify, which currently logs and returns 202 — there is no
 * mailing-list provider yet. The success copy says the address was recorded
 * for a specific product and nothing more; it does not promise a newsletter
 * or a launch date neither of us can commit to.
 */
export function NotifyMeForm({
  handle,
  title,
  className,
}: {
  handle: string;
  title: string;
  className?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [email, setEmail] = useState("");

  if (state === "done") {
    return (
      <p role="status" className={cn("text-emphasis font-body text-body", className)}>
        We&rsquo;ll write when {title} is ready.
      </p>
    );
  }

  return (
    <form
      className={cn("flex items-end gap-4", className)}
      onSubmit={async (e) => {
        e.preventDefault();
        setState("sending");
        try {
          const res = await fetch("/api/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, handle }),
          });
          setState(res.ok ? "done" : "error");
        } catch {
          setState("error");
        }
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
        error={state === "error" ? "Something went wrong. Try again?" : undefined}
        className="flex-1"
      />
      <Button
        type="submit"
        variant="secondary"
        size="sm"
        disabled={state === "sending"}
        className="mb-1"
      >
        {state === "sending" ? "…" : "Notify me"}
      </Button>
    </form>
  );
}
