import { NextResponse } from "next/server";

import { buildSessionCookieValue } from "@/lib/auth/cookie";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSignedSession } from "@/lib/auth/session";
import { findUserByEmail } from "@/lib/auth/store";
import { verifyTotpToken } from "@/lib/auth/totp";
import { enforceRateLimit } from "@/lib/http/rate-limit";

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, {
    bucket: "auth-login",
    limit: 5,
    windowMs: 60_000,
  });

  if (limited) {
    return limited;
  }

  let body: { email?: unknown; password?: unknown; otp?: unknown };

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
  const password = typeof body.password === "string" ? body.password.trim() : "";
  const otp = typeof body.otp === "string" ? body.otp.trim() : "";

  if (!email || !password) {
    return NextResponse.json(
      {
        error: "email and password are required.",
      },
      { status: 400 },
    );
  }

  const user = await findUserByEmail(email);

  if (!user?.passwordHash) {
    await hashPassword(password);
    return NextResponse.json(
      {
        error: "Invalid credentials.",
      },
      { status: 401 },
    );
  }

  const passwordMatches = await verifyPassword(password, user.passwordHash);

  if (!passwordMatches) {
    return NextResponse.json(
      {
        error: "Invalid credentials.",
      },
      { status: 401 },
    );
  }

  const requiresMfa = user.role === "ADMIN" || user.mfaEnabled;

  if (requiresMfa) {
    if (!user.mfaSecret || !verifyTotpToken(user.mfaSecret, otp)) {
      return NextResponse.json(
        {
          error: "A valid MFA code is required for this account.",
        },
        { status: 401 },
      );
    }
  }

  const sessionValue = createSignedSession({
    userId: user.id,
    email: user.email,
    role: user.role,
    mfaVerified: requiresMfa,
    sessionVersion: user.sessionVersion,
  });

  return NextResponse.json(
    {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        plan: user.plan,
      },
    },
    {
      headers: {
        "Set-Cookie": buildSessionCookieValue(sessionValue),
      },
    },
  );
}
