import React from "react";

import { MarketingInfoPage, getInfoPageMetadata } from "@/components/marketing/marketing-info-page";
import { routes } from "@/lib/routes";

export const metadata = getInfoPageMetadata(routes.features);

export default function FeaturesPage() {
  return (
    <MarketingInfoPage
      route={routes.features}
      eyebrow="Product features"
      title="One scoring system for ranking work and AI retrieval readiness."
      description="SEO AI Regent connects Content Score, GEO Score, SERP context, and editorial next actions so teams can improve drafts without splitting their workflow across disconnected tools."
      sections={[
        {
          title: "Content Score",
          body: "Evaluate coverage, structure, readability, and editorial completeness against the keyword surface a draft is trying to enter.",
        },
        {
          title: "GEO Score",
          body: "Expose extractability, entity clarity, source credibility, and answer format as first-class signals for AI-mediated search.",
        },
        {
          title: "Action Rail",
          body: "Turn score movement into prioritized next steps, missing-term visibility, and signal explanations writers can act on.",
        },
        {
          title: "SERP-Grounded Analysis",
          body: "Keep scoring tied to persisted keyword snapshots and live-result context instead of generic optimization folklore.",
        },
      ]}
      related={[routes.pricing, routes.demo, routes.docs, routes.faq]}
      ctaHref={routes.pricing.href}
      ctaLabel="View pricing"
    />
  );
}
