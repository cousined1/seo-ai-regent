import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import {
  resolveBillingPlanIdFromPriceId,
  toUserPlan,
  type BillingPlanId,
} from "@/lib/billing/plans";
import { requireStripeClient } from "@/lib/billing/stripe";
import {
  findUserIdByStripeCustomerId,
  setStripeCustomerId,
  updateUserPlan,
} from "@/lib/auth/store";
import {
  deleteWebhookEventRecord,
  recordProcessedWebhookEvent,
} from "@/lib/billing/webhook-events";
import { getConfigErrorMessage, getServerEnv } from "@/lib/env";

type StripeEventObject = {
  metadata?: Record<string, string> | null;
  customer?: string | { id?: string | null } | null;
  items?: { data?: Array<{ price?: { id?: string | null } | null }> } | null;
  subscription?: string | { id?: string | null } | null;
  lines?: { data?: Array<{ price?: { id?: string | null } | null }> } | null;
};

function getEventObject(event: Stripe.Event): StripeEventObject {
  return event.data.object as StripeEventObject;
}

function isBillingPlanId(value: unknown): value is BillingPlanId {
  return value === "EDITOR" || value === "EDITORIAL" || value === "SYNDICATE";
}

function extractCustomerId(object: StripeEventObject): string | null {
  const candidate = object.customer;

  if (typeof candidate === "string") {
    return candidate;
  }

  return candidate?.id ?? null;
}

function extractPriceId(object: StripeEventObject): string | null {
  const subscriptionPrice = object.items?.data?.[0]?.price?.id;

  if (subscriptionPrice) {
    return subscriptionPrice;
  }

  const invoicePrice = object.lines?.data?.[0]?.price?.id;

  return invoicePrice ?? null;
}

async function resolveUserId(object: StripeEventObject): Promise<string | null> {
  const fromMetadata = object.metadata?.userId;

  if (fromMetadata) {
    return fromMetadata;
  }

  const customerId = extractCustomerId(object);

  if (!customerId) {
    return null;
  }

  return findUserIdByStripeCustomerId(customerId);
}

function resolvePlanId(object: StripeEventObject): BillingPlanId | null {
  const fromMetadata = object.metadata?.planId;

  if (isBillingPlanId(fromMetadata)) {
    return fromMetadata;
  }

  return resolveBillingPlanIdFromPriceId(extractPriceId(object));
}

const UPGRADE_EVENT_TYPES = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "invoice.paid",
]);

const DOWNGRADE_EVENT_TYPES = new Set([
  "customer.subscription.deleted",
  "invoice.payment_failed",
]);

export async function POST(request: Request) {
  const signature = (await headers()).get("stripe-signature");
  const webhookSecret = getServerEnv().stripeWebhookSecret;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      {
        error: getConfigErrorMessage("STRIPE_WEBHOOK_SECRET"),
      },
      { status: 503 },
    );
  }

  const stripe = requireStripeClient();
  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json(
      {
        error: "Invalid webhook signature.",
      },
      { status: 400 },
    );
  }

  const object = getEventObject(event);
  const userId = await resolveUserId(object);
  const planId = resolvePlanId(object);
  const receipt = await recordProcessedWebhookEvent({
    event,
    userId,
    planId,
  });

  if (receipt.reason === "duplicate") {
    return NextResponse.json({
      received: true,
      duplicate: true,
    });
  }

  try {
    if (userId) {
      const customerId = extractCustomerId(object);

      if (customerId) {
        await setStripeCustomerId(userId, customerId);
      }
    }

    if (userId && planId && UPGRADE_EVENT_TYPES.has(event.type)) {
      await updateUserPlan(userId, toUserPlan(planId));
    } else if (userId && DOWNGRADE_EVENT_TYPES.has(event.type)) {
      await updateUserPlan(userId, "FREE");
    }
  } catch (error) {
    // Roll back the idempotency reservation so Stripe's retry can re-attempt.
    await deleteWebhookEventRecord(event.id);
    throw error;
  }

  return NextResponse.json({
    received: true,
  });
}
