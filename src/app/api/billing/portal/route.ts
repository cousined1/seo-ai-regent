import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { requireSameOrigin } from "@/lib/auth/csrf";
import { requireStripeClient } from "@/lib/billing/stripe";
import { getConfigErrorMessage, getServerEnv } from "@/lib/env";

export async function POST(request: Request) {
  const originCheck = requireSameOrigin(request);

  if (originCheck) {
    return originCheck;
  }

  const authenticated = await requireAuthenticatedUser(request);

  if (authenticated instanceof Response) {
    return authenticated;
  }

  if (!authenticated.user.stripeId) {
    return NextResponse.json(
      {
        error: "No Stripe customer is attached to this account.",
      },
      { status: 400 },
    );
  }

  const siteUrl = getServerEnv().siteUrl;

  if (!siteUrl) {
    return NextResponse.json(
      {
        error: getConfigErrorMessage("NEXT_PUBLIC_SITE_URL"),
      },
      { status: 503 },
    );
  }

  const stripe = requireStripeClient();
  const session = await stripe.billingPortal.sessions.create({
    customer: authenticated.user.stripeId,
    return_url: `${siteUrl}/app/editor`,
  });

  return NextResponse.json({
    portalUrl: session.url,
  });
}
