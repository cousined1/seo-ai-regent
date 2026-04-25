import type { Plan } from "@prisma/client";

import { getServerEnv } from "@/lib/env";

export const BILLING_PLANS = [
  {
    id: "EDITOR",
    name: "Editor Plan",
    price: "$49",
    amountUsd: 49,
    frequency: "month",
  },
  {
    id: "EDITORIAL",
    name: "Editorial Plan",
    price: "$149",
    amountUsd: 149,
    frequency: "month",
  },
  {
    id: "SYNDICATE",
    name: "Syndicate Plan",
    price: "Custom",
    amountUsd: null,
    frequency: "custom",
  },
] as const;

export type BillingPlanId = (typeof BILLING_PLANS)[number]["id"];

export function getBillingPlan(planId: BillingPlanId) {
  return BILLING_PLANS.find((plan) => plan.id === planId) ?? null;
}

export function getPlanPriceId(planId: BillingPlanId) {
  const env = getServerEnv();

  switch (planId) {
    case "EDITOR":
      return env.stripeEditorPriceId;
    case "EDITORIAL":
      return env.stripeEditorialPriceId;
    case "SYNDICATE":
      return env.stripeSyndicatePriceId;
  }
}

export function resolveBillingPlanIdFromPriceId(priceId: string | null): BillingPlanId | null {
  if (!priceId) {
    return null;
  }

  const env = getServerEnv();

  if (env.stripeEditorPriceId && priceId === env.stripeEditorPriceId) {
    return "EDITOR";
  }

  if (env.stripeEditorialPriceId && priceId === env.stripeEditorialPriceId) {
    return "EDITORIAL";
  }

  if (env.stripeSyndicatePriceId && priceId === env.stripeSyndicatePriceId) {
    return "SYNDICATE";
  }

  return null;
}

export function toUserPlan(planId: BillingPlanId): Plan {
  return planId;
}
