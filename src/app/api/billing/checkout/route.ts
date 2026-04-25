import { NextResponse } from "next/server";

import { requireAuthenticatedUser } from "@/lib/auth/access";
import { requireSameOrigin } from "@/lib/auth/csrf";
import { getBillingPlan, getPlanPriceId, type BillingPlanId } from "@/lib/billing/plans";
import { requireStripeClient } from "@/lib/billing/stripe";
import { setStripeCustomerId } from "@/lib/auth/store";
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

  let body: { planId?: unknown };

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

  const planId =
    typeof body.planId === "string" ? (body.planId as BillingPlanId) : null;

  if (!planId || !getBillingPlan(planId)) {
    return NextResponse.json(
      {
        error: "A valid planId is required.",
      },
      { status: 400 },
    );
  }

  const priceId = getPlanPriceId(planId);

  if (!priceId) {
    return NextResponse.json(
      {
        error: `Missing Stripe price configuration for ${planId}.`,
      },
      { status: 503 },
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
  const customer =
    authenticated.user.stripeId
      ? { customer: authenticated.user.stripeId }
      : {
          customer_email: authenticated.user.email,
        };
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${siteUrl}/app/editor?checkout=success`,
    cancel_url: `${siteUrl}/?checkout=cancelled`,
    metadata: {
      userId: authenticated.user.id,
      planId,
    },
    subscription_data: {
      metadata: {
        userId: authenticated.user.id,
        planId,
      },
    },
    ...customer,
  });

  if (!authenticated.user.stripeId && session.customer && typeof session.customer === "string") {
    await setStripeCustomerId(authenticated.user.id, session.customer);
  }

  return NextResponse.json({
    checkoutUrl: session.url,
  });
}
