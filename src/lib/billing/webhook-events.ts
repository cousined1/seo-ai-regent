import type Stripe from "stripe";

import { getPrismaClient } from "@/lib/db";

function summarizeEvent(event: Stripe.Event, planId: string | null, userId: string | null) {
  return {
    id: event.id,
    type: event.type,
    livemode: event.livemode,
    planId,
    userId,
  };
}

export async function recordProcessedWebhookEvent(input: {
  event: Stripe.Event;
  userId: string | null;
  planId: string | null;
}) {
  const client = getPrismaClient();

  if (!client) {
    return {
      created: false,
      reason: "persistence-unavailable" as const,
    };
  }

  try {
    await client.stripeWebhookEvent.create({
      data: {
        eventId: input.event.id,
        eventType: input.event.type,
        userId: input.userId && input.userId !== "env-admin" ? input.userId : null,
        payloadSummary: summarizeEvent(input.event, input.planId, input.userId),
      },
    });

    return {
      created: true,
      reason: null,
    };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return {
        created: false,
        reason: "duplicate" as const,
      };
    }

    throw error;
  }
}

export async function deleteWebhookEventRecord(eventId: string) {
  const client = getPrismaClient();

  if (!client) {
    return;
  }

  try {
    await client.stripeWebhookEvent.delete({
      where: {
        eventId,
      },
    });
  } catch {
    // Best-effort rollback — if the row no longer exists we proceed silently.
  }
}
