import { NextResponse } from "next/server";

import { hashPassword } from "@/lib/auth/password";
import { registerUser } from "@/lib/auth/store";
import { getConfigErrorMessage } from "@/lib/env";
import { enforceRateLimit } from "@/lib/http/rate-limit";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  const limited = await enforceRateLimit(request, {
    bucket: "auth-register",
    limit: 5,
    windowMs: 60_000,
  });

  if (limited) {
    return limited;
  }

  let body: { email?: unknown; password?: unknown; name?: unknown };

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
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!email || !password) {
    return NextResponse.json(
      {
        error: "email and password are required.",
      },
      { status: 400 },
    );
  }

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json(
      {
        error: "A valid email is required.",
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

  const result = await registerUser({
    email,
    passwordHash: await hashPassword(password),
    name: name || null,
  });

  if (!result.ok) {
    if (result.reason === "duplicate") {
      return NextResponse.json(
        {
          error: "An account with that email already exists.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        error: getConfigErrorMessage("DATABASE_URL"),
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    id: result.user.id,
    email: result.user.email,
    role: result.user.role,
    plan: result.user.plan,
  });
}
