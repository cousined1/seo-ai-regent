import React from "react";

import { MarketingInfoPage, getInfoPageMetadata } from "@/components/marketing/marketing-info-page";
import { routes } from "@/lib/routes";

export const metadata = getInfoPageMetadata(routes.docs);

export default function DocsPage() {
  return (
    <MarketingInfoPage
      route={routes.docs}
      eyebrow="Documentation"
      title="Product concepts for the SEO AI Regent scoring loop."
      description="Documentation starts with the concepts every evaluator and operator needs to understand before wiring the product into an editorial workflow."
      sections={[
        {
          title: "Content Score",
          body: "Content Score describes how well a draft matches the traditional ranking surface for a target keyword.",
        },
        {
          title: "GEO Score",
          body: "GEO Score describes how ready a draft is for AI retrieval, citation, and answer extraction.",
        },
        {
          title: "Action Rail",
          body: "The action rail prioritizes changes likely to improve score movement and explains which signal each action affects.",
        },
        {
          title: "Machine-readable support",
          body: "The product includes sitemap, robots, llms.txt, schema, and canonical metadata surfaces for public crawlability.",
        },
      ]}
      related={[routes.features, routes.demo, routes.help, routes.faq]}
      ctaHref={routes.demo.href}
      ctaLabel="Open demo"
    />
  );
}
