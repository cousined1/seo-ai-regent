import { NextResponse } from "next/server";

import { readSessionCookie } from "@/lib/auth/cookie";
import { readSignedSession } from "@/lib/auth/session";
import { findUserById } from "@/lib/auth/store";

export async function getAuthenticatedUser(request: Request) {
  const session = readSignedSession(readSessionCookie(request));

  if (!session) {
    return null;
  }

  const user = await findUserById(session.userId);

  if (!user || user.sessionVersion !== session.sessionVersion) {
    return null;
  }

  return {
    session,
    user,
  };
}

export async function requireAuthenticatedUser(request: Request) {
  const authenticated = await getAuthenticatedUser(request);

  if (!authenticated) {
    return NextResponse.json(
      {
        error: "Authentication required.",
      },
      { status: 401 },
    );
  }

  return authenticated;
}

export async function requireAdminUser(request: Request) {
  const authenticated = await getAuthenticatedUser(request);

  if (!authenticated) {
    return NextResponse.json(
      {
        error: "Authentication required.",
      },
      { status: 401 },
    );
  }

  if (authenticated.user.role !== "ADMIN" || !authenticated.session.mfaVerified) {
    return NextResponse.json(
      {
        error: "Admin authorization required.",
      },
      { status: 403 },
    );
  }

  return authenticated;
}
