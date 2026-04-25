import { NextResponse } from "next/server";

import { getAuthenticatedUser } from "@/lib/auth/access";

export async function GET(request: Request) {
  const authenticated = await getAuthenticatedUser(request);

  if (!authenticated) {
    return NextResponse.json({
      authenticated: false,
      user: null,
    });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: authenticated.user.id,
      email: authenticated.user.email,
      role: authenticated.user.role,
      plan: authenticated.user.plan,
    },
  });
}
