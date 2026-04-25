import { NextResponse } from "next/server";

import { evaluateDebugAccess } from "@/lib/debug/access";

export function toDebugAccessDeniedResponse(
  access: Extract<
    Awaited<ReturnType<typeof evaluateDebugAccess>>,
    { ok: false }
  >,
) {
  return NextResponse.json(
    {
      error: access.error,
      reason: access.reason,
    },
    { status: access.status },
  );
}

export async function withDebugAccess<T>(
  request: Request,
  getPayload: () => T | Response | Promise<T | Response>,
) {
  const access = await evaluateDebugAccess(request);

  if (!access.ok) {
    return toDebugAccessDeniedResponse(access);
  }

  const payload = await getPayload();

  if (payload instanceof Response) {
    return payload;
  }

  return NextResponse.json(payload);
}
