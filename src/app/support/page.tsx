import React from "react";

import { MarketingInfoPage, getInfoPageMetadata } from "@/components/marketing/marketing-info-page";
import { routes } from "@/lib/routes";

export const metadata = getInfoPageMetadata(routes.support);

export default function SupportPage() {
  return (
    <MarketingInfoPage
      route={routes.support}
      eyebrow="Support"
      title="Support paths for scoring, account, and billing issues."
      description="Use these routes to recover momentum while a production deployment finalizes its monitored support channel."
      sections={[
        {
          title: "Scoring questions",
          body: "Review documentation and the demo when a score, term recommendation, or action rail item needs interpretation.",
        },
        {
          title: "Account access",
          body: "Use login and registration for authentication. Password reset support starts from the login surface.",
        },
        {
          title: "Billing support",
          body: "Authenticated users can manage checkout and customer portal access from the billing page.",
        },
      ]}
      related={[routes.help, routes.docs, routes.login, routes.billing]}
      ctaHref={routes.help.href}
      ctaLabel="Open help center"
    />
  );
}
