import React from "react";

import { MarketingInfoPage, getInfoPageMetadata } from "@/components/marketing/marketing-info-page";
import { BILLING_PLANS } from "@/lib/billing/plans";
import { routes } from "@/lib/routes";

export const metadata = getInfoPageMetadata(routes.pricing);

export default function PricingPage() {
  return (
    <MarketingInfoPage
      route={routes.pricing}
      eyebrow="Pricing"
      title="Plans for operators, teams, and editorial programs."
      description="Choose the operating range that matches how many people need the scoring loop, billing access, and rollout support."
      sections={BILLING_PLANS.map((plan) => ({
        title: `${plan.name} / ${plan.price}`,
        body: `Use this plan when the team needs ${plan.name.toLowerCase()} access to the Content Score and GEO Score workflow, billed on a ${plan.frequency} cadence.`,
      }))}
      related={[routes.features, routes.faq, routes.contact, routes.register]}
      ctaHref={routes.register.href}
      ctaLabel="Get started"
    />
  );
}
