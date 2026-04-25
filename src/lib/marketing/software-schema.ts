import { BILLING_PLANS } from "@/lib/billing/plans";

export function getSoftwareApplicationSchema() {
  const pricedPlans = BILLING_PLANS.filter((plan) => plan.amountUsd !== null);
  const customPlan = BILLING_PLANS.find((plan) => plan.amountUsd === null);

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://seoairegent.com/#software",
    name: "SEO AI Regent",
    url: "https://seoairegent.com",
    description:
      "Editorial-grade content scoring for Google and AI search, with Content Score, GEO Score, citability analysis, and SERP intelligence.",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: String(Math.min(...pricedPlans.map((plan) => plan.amountUsd ?? 0))),
      highPrice: String(Math.max(...pricedPlans.map((plan) => plan.amountUsd ?? 0))),
      priceCurrency: "USD",
      offerCount: String(BILLING_PLANS.length),
      offers: BILLING_PLANS.map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        ...(plan.amountUsd === null
          ? {
              description: `${plan.name} is sold through custom pricing and assisted onboarding.`,
            }
          : {
              price: String(plan.amountUsd),
              priceCurrency: "USD",
            }),
        availability: "https://schema.org/InStock",
      })),
    },
    featureList: [
      "Content Score",
      "GEO Score",
      "AI Citability scoring",
      "SERP Analyzer",
      "AI Writer",
      "Canonical signal breakdown",
      "llms.txt guidance",
      "Software schema discoverability",
    ],
    author: {
      "@type": "Organization",
      "@id": "https://seoairegent.com/#organization",
      name: "SEO AI Regent",
    },
    sameAs: ["https://github.com/cousined1"],
    isAccessibleForFree: false,
    additionalProperty: customPlan
      ? [
          {
            "@type": "PropertyValue",
            name: customPlan.name,
            value: "Custom pricing via assisted sales process",
          },
        ]
      : [],
  };
}
