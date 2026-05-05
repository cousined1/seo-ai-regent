import React from "react";

import { MarketingInfoPage, getInfoPageMetadata } from "@/components/marketing/marketing-info-page";
import { routes } from "@/lib/routes";

export const metadata = getInfoPageMetadata(routes.about);

export default function AboutPage() {
  return (
    <MarketingInfoPage
      route={routes.about}
      eyebrow="About"
      title="Built for teams that publish into two search systems at once."
      description="SEO AI Regent exists because editorial teams now need to understand traditional ranking performance and AI retrieval readiness before publication, not after traffic or citations disappear."
      sections={[
        {
          title: "Canonical scoring language",
          body: "The product keeps Content Score and GEO Score separate but comparable, so teams can discuss ranking and retrieval tradeoffs without inventing a new checklist for every draft.",
        },
        {
          title: "Editorial-first workflow",
          body: "The interface is shaped around writing, revising, and explaining score movement instead of burying teams in analytics surfaces they cannot act on.",
        },
        {
          title: "Launch-ready operations",
          body: "Account access, billing, consent, structured data, and crawler-facing surfaces are treated as part of the product system.",
        },
      ]}
      related={[routes.features, routes.docs, routes.contact, routes.privacy]}
    />
  );
}
