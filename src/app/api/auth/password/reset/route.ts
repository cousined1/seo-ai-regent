import { NextResponse } from "next/server";

import { finalizePasswordReset, consumePasswordResetToken } from "@/lib/auth/store";
import { hashPassword } from "@/lib/auth/password";
import { hashPasswordResetToken } from "@/lib/auth/reset-token";
import { getConfigErrorMessage } from "@/lib/env";
import { enforceRateLimit } from "@/lib/http/rate-limit";

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, {
    bucket: "auth-password-reset",
    limit: 5,
    windowMs: 60_000,
  });

  if (limited) {
    return limited;
  }

  let body: { token?: unknown; password?: unknown };

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

  const token = typeof body.token === "string" ? body.token.trim() : "";
  const password = typeof body.password === "string" ? body.password.trim() : "";

  if (!token || !password) {
    return NextResponse.json(
      {
        error: "token and password are required.",
      },
      { status: 400 },
    );
  }

  if (password.length < 12) {
    return NextResponse.json(
      {
        error: "password must be at least 12 characters.",
      },
      { status: 400 },
    );
  }

  const resetRecord = await consumePasswordResetToken(hashPasswordResetToken(token));

  if (!resetRecord) {
    return NextResponse.json(
      {
        error: "Invalid or expired reset token.",
      },
      { status: 400 },
    );
  }

  const updated = await finalizePasswordReset({
    resetTokenId: resetRecord.token.id,
    userId: resetRecord.user.id,
    passwordHash: await hashPassword(password),
  });

  if (!updated) {
    return NextResponse.json(
      {
        error: getConfigErrorMessage("DATABASE_URL"),
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    ok: true,
  });
}
