import { NextResponse } from "next/server";
import { z } from "zod";

import { deliver } from "@/lib/email";

const Body = z.object({
  email: z.email(),
  handle: z.string().min(1).max(120),
});

/** C10's target. 202, not 200 — accepted, not yet delivered anywhere. */
export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }

  const { delivered } = await deliver({
    kind: "notify",
    subject: `Newsletter signup: ${parsed.data.email}`,
    payload: parsed.data,
  });
  return NextResponse.json({ accepted: true, delivered }, { status: 202 });
}
