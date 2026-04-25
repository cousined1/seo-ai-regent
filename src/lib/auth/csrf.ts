import { NextResponse } from "next/server";

import { getServerEnv } from "@/lib/env";

export function requireSameOrigin(request: Request) {
  const originHeader = request.headers.get("origin");
  const refererHeader = request.headers.get("referer");
  const candidate = originHeader ?? refererHeader;

  if (!candidate) {
    return NextResponse.json(
      {
        error: "Missing origin header.",
      },
      { status: 403 },
    );
  }

  const allowedOrigins = new Set<string>();
  const configuredSiteUrl = getServerEnv().siteUrl;

  if (configuredSiteUrl) {
    try {
      allowedOrigins.add(new URL(configuredSiteUrl).origin);
    } catch {
      // Ignore malformed configuration; request origin is still validated below.
    }
  }

  try {
    allowedOrigins.add(new URL(request.url).origin);
  } catch {
    // Request URL should always be parseable, but guard defensively.
  }

  try {
    const requestOrigin = new URL(candidate).origin;

    if (allowedOrigins.has(requestOrigin)) {
      return null;
    }
  } catch {
    return NextResponse.json(
      {
        error: "Invalid request origin.",
      },
      { status: 403 },
    );
  }

  return NextResponse.json(
    {
      error: "Cross-site request blocked.",
    },
    { status: 403 },
  );
}
