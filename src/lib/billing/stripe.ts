import Stripe from "stripe";

import { getConfigErrorMessage, getServerEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  const { stripeSecretKey } = getServerEnv();

  if (!stripeSecretKey) {
    return null;
  }

  if (!stripeClient) {
    stripeClient = new Stripe(stripeSecretKey, {
      apiVersion: "2026-03-25.dahlia",
    });
  }

  return stripeClient;
}

export function requireStripeClient() {
  const client = getStripeClient();

  if (!client) {
    throw new Error(getConfigErrorMessage("STRIPE_SECRET_KEY"));
  }

  return client;
}
