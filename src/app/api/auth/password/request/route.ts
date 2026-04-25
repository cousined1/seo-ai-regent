import { NextResponse } from "next/server";

import { sendPasswordResetEmail } from "@/lib/auth/email";
import { createPasswordResetTokenRecord, findUserByEmail } from "@/lib/auth/store";
import { createPasswordResetToken } from "@/lib/auth/reset-token";
import { getConfigErrorMessage } from "@/lib/env";
import { enforceRateLimit } from "@/lib/http/rate-limit";

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, {
    bucket: "auth-password-request",
    limit: 5,
    windowMs: 60_000,
  });

  if (limited) {
    return limited;
  }

  let body: { email?: unknown };

  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json(
      {
        error: "Invalid JSON body.",
      },
      { status: 400 },
    );
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!email) {
    return NextResponse.json(
      {
        error: "email is required.",
      },
      { status: 400 },
    );
  }

  const user = await findUserByEmail(email);

  if (!user || user.id === "env-admin") {
    return NextResponse.json({
      ok: true,
    });
  }

  const token = createPasswordResetToken();
  const created = await createPasswordResetTokenRecord({
    userId: user.id,
    tokenHash: token.tokenHash,
    expiresAt: new Date(Date.now() + 1000 * 60 * 30),
  });

  if (!created) {
    return NextResponse.json(
      {
        error: getConfigErrorMessage("DATABASE_URL"),
      },
      { status: 503 },
    );
  }

  try {
    await sendPasswordResetEmail({
      to: user.email,
      resetToken: token.token,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Reset email delivery failed.",
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
