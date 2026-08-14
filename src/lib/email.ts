import "server-only";

/**
 * Outbound email / list subscription.
 *
 * DELIBERATELY NOT IMPLEMENTED. No provider has been chosen (Resend, Klaviyo,
 * Shopify's own marketing list are all plausible and the choice affects GDPR
 * handling for EU subscribers). Rather than wire a provider nobody has agreed
 * to, this records the payload server-side and reports that it was accepted
 * but not delivered — and every caller surfaces that honestly.
 *
 * When a provider is chosen, this is the only file that changes.
 */
export type Submission = {
  kind: "notify" | "inquiry";
  payload: Record<string, unknown>;
};

export async function deliver({ kind, payload }: Submission) {
  console.info(`[${kind}] captured (not delivered — no provider configured)`, payload);
  return { delivered: false as const };
}
