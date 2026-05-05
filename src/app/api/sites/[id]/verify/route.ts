import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { getSiteWithVerification, startVerification, completeVerification, verifyHtmlTag } from "@/lib/sites/verification";
import { safeFetchText } from "@/lib/http/safe-fetch";
import type { VerificationMethod } from "@prisma/client";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  const siteId = (await params).id;

  const site = await getSiteWithVerification(siteId, authenticated.user.id);
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  const body = await request.json();
  const action = body.action as "start" | "check" | undefined;

  try {
    if (action === "start") {
      const method = body.method as VerificationMethod;
      if (!["HTML_TAG", "DNS_TXT", "FILE_UPLOAD"].includes(method)) {
        return NextResponse.json(
          { error: "Invalid verification method" },
          { status: 400 },
        );
      }

      const verification = await startVerification(siteId, method);
      return NextResponse.json({ verification });
    }

    if (action === "check") {
      if (!site.verification) {
        return NextResponse.json(
          { error: "No verification started. Call with action=start first." },
          { status: 400 },
        );
      }

      let verified = false;

      if (site.verification.method === "HTML_TAG") {
        try {
          const html = await safeFetchText(site.url, { timeoutMs: 10000 });
          verified = await verifyHtmlTag(html, site.verification.token);
        } catch {
          verified = false;
        }
      }

      if (verified) {
        const { site: updatedSite, verification } = await completeVerification(siteId);
        return NextResponse.json({
          verified: true,
          site: updatedSite,
          verification,
        });
      }

      return NextResponse.json({
        verified: false,
        message: "Verification not found. Please ensure the verification token is correctly placed.",
      });
    }

    return NextResponse.json(
      { error: "Invalid action. Use 'start' or 'check'." },
      { status: 400 },
    );
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await requireAuthenticatedUser(request);
  if (authenticated instanceof NextResponse) {
    return authenticated;
  }

  const siteId = (await params).id;

  const site = await getSiteWithVerification(siteId, authenticated.user.id);
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  return NextResponse.json({
    site: {
      id: site.id,
      url: site.url,
      status: site.status,
      verifiedAt: site.verifiedAt,
    },
    verification: site.verification
      ? {
          method: site.verification.method,
          token: site.verification.token,
          verifiedAt: site.verification.verifiedAt,
        }
      : null,
  });
}
