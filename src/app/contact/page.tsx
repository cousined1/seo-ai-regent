import React from "react";

import { MarketingInfoPage, getInfoPageMetadata } from "@/components/marketing/marketing-info-page";
import { routes } from "@/lib/routes";

export const metadata = getInfoPageMetadata(routes.contact);

export default function ContactPage() {
  return (
    <MarketingInfoPage
      route={routes.contact}
      eyebrow="Contact"
      title="Route sales, support, and rollout questions to the right next step."
      description="Use the public product paths below while a staffed inbox is finalized for production launch."
      sections={[
        {
          title: "Evaluate the product",
          body: "Start with the live demo, then compare features and pricing to decide whether the scoring loop fits your editorial operating model.",
        },
        {
          title: "Account and billing questions",
          body: "Existing users should sign in and use billing management for checkout, invoices, payment methods, and subscription updates.",
        },
        {
          title: "Support readiness",
          body: "Support and help pages collect the current product guidance. A production deployment should replace this placeholder with a monitored contact channel.",
        },
      ]}
      related={[routes.demo, routes.pricing, routes.support, routes.billing]}
      ctaHref={routes.demo.href}
      ctaLabel="Try live demo"
    />
  );
}
