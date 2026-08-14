import "server-only";

import { SITE } from "@/config/site";

/**
 * Outbound email, via Resend's HTTP API directly (no SDK — one fetch call
 * doesn't earn a dependency).
 *
 * Gated on RESEND_API_KEY: unset, this still records the payload server-side
 * and reports it as accepted-but-not-delivered, exactly as before. Set it and
 * mail actually goes out. RESEND_FROM_EMAIL must be an address on a domain
 * verified in the Resend dashboard — until one is verified, Resend only lets
 * you send to the account's own signup address, which is enough to test.
 */
export type Submission = {
  kind: "notify" | "inquiry";
  subject: string;
  payload: Record<string, unknown>;
};

function renderBody(payload: Record<string, unknown>): string {
  return Object.entries(payload)
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

export async function deliver({ kind, subject, payload }: Submission) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.info(`[${kind}] "${subject}" captured (not delivered — RESEND_API_KEY unset)`, payload);
    return { delivered: false as const };
  }

  const from = process.env.RESEND_FROM_EMAIL ?? "Surya Cacao <onboarding@resend.dev>";

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: SITE.contactEmail,
      subject,
      text: renderBody(payload),
    }),
  });

  if (!res.ok) {
    console.error(`[${kind}] Resend delivery failed`, res.status, await res.text().catch(() => ""));
    return { delivered: false as const };
  }

  return { delivered: true as const };
}
