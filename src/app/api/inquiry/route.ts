import { NextResponse } from "next/server";
import { z } from "zod";

import { deliver } from "@/lib/email";

/**
 * S18's target — one route for both forms, matching the plan's consolidation
 * ("saves 2 near-identical components and 2 API routes").
 *
 * Fields are validated loosely because the two configs differ; `passthrough`
 * keeps whatever the config sent while still requiring the two that always
 * exist. Length caps are the cheap defence against someone posting a novel.
 */
const Body = z
  .object({
    name: z.string().min(1).max(200),
    email: z.email(),
    message: z.string().max(5000).optional(),
    /** Set by the unified /contact form; absent from Retreats/Partnerships. */
    inquiryType: z.string().max(80).optional(),
    /** Set by Retreats/Partnerships so the subject still names the form. */
    formName: z.string().max(80).optional(),
  })
  .catchall(z.string().max(500));

export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const { formName, ...payload } = parsed.data;
  const subject = `${payload.inquiryType ?? formName ?? "Website inquiry"} — ${payload.name}`;

  const { delivered } = await deliver({ kind: "inquiry", subject, payload });
  return NextResponse.json({ accepted: true, delivered }, { status: 202 });
}
