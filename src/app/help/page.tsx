import React from "react";

import { MarketingInfoPage, getInfoPageMetadata } from "@/components/marketing/marketing-info-page";
import { routes } from "@/lib/routes";

export const metadata = getInfoPageMetadata(routes.help);

export default function HelpPage() {
  return (
    <MarketingInfoPage
      route={routes.help}
      eyebrow="Help center"
      title="Find the right product, account, or billing path."
      description="This lightweight help center keeps support routes reachable while fuller operator documentation is expanded."
      sections={[
        {
          title: "Scoring workflow",
          body: "Use the demo and feature documentation to understand Content Score, GEO Score, prioritized actions, and score movement.",
        },
        {
          title: "Account access",
          body: "Use login, registration, and password reset flows for account-level access. Protected billing actions require an authenticated session.",
        },
        {
          title: "Billing management",
          body: "Authenticated users can open checkout or customer portal surfaces from the billing page.",
        },
      ]}
      related={[routes.docs, routes.faq, routes.support, routes.billing]}
      ctaHref={routes.docs.href}
      ctaLabel="Read documentation"
    />
  );
}
