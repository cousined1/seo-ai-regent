import React from "react";

import { MarketingInfoPage, getInfoPageMetadata } from "@/components/marketing/marketing-info-page";
import { routes } from "@/lib/routes";

export const metadata = getInfoPageMetadata(routes.faq);

export default function FaqPage() {
  return (
    <MarketingInfoPage
      route={routes.faq}
      eyebrow="FAQ"
      title="Common questions before teams adopt dual-surface scoring."
      description="Answers focus on product fit, score interpretation, account access, and production readiness."
      sections={[
        {
          title: "Why split Content Score and GEO Score?",
          body: "They overlap, but they are not the same outcome. Splitting them helps teams see when a draft is ranking-ready, retrieval-ready, or strong on one surface but weak on the other.",
        },
        {
          title: "Can I try it without an account?",
          body: "Yes. The live demo exposes the same scoring posture with sample content so evaluators can inspect the workflow before signing up.",
        },
        {
          title: "Where do billing actions live?",
          body: "Checkout and customer portal actions live under account billing and require authentication before the billing provider is opened.",
        },
        {
          title: "Is this legal advice or ranking guarantee?",
          body: "No. The scoring output is decision support for editorial teams, not a guarantee of rankings, traffic, or AI citations.",
        },
      ]}
      related={[routes.pricing, routes.features, routes.support, routes.terms]}
      ctaHref={routes.register.href}
      ctaLabel="Create account"
    />
  );
}
