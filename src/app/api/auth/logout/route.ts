import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth/access";
import { requireSameOrigin } from "@/lib/auth/csrf";
import { buildExpiredSessionCookie } from "@/lib/auth/cookie";
import { incrementUserSessionVersion } from "@/lib/auth/store";

export async function POST(request: Request) {
  const originCheck = requireSameOrigin(request);

  if (originCheck) {
    return originCheck;
  }

  const authenticated = await getAuthenticatedUser(request);

  if (authenticated) {
    try {
      await incrementUserSessionVersion(authenticated.user.id);
    } catch {
      // Persistence failure must not block cookie clearing.
    }
  }

  return NextResponse.json(
    {
      ok: true,
    },
    {
      headers: {
        "Set-Cookie": buildExpiredSessionCookie(),
      },
    },
  );
}
