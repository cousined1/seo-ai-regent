import type { Metadata } from "next";

import { DemoWorkspace } from "@/components/demo/demo-workspace";

export const metadata: Metadata = {
  title: "Live Demo",
  description:
    "Run SEO AI Regent's canonical scoring model against a sample draft and inspect Content Score, GEO Score, and action-level guidance.",
  alternates: {
    canonical: "/demo",
  },
  openGraph: {
    title: "SEO AI Regent Demo",
    description:
      "Inspect the live scoring loop for Google and AI-search performance before you publish.",
    url: "https://seoairegent.com/demo",
  },
  twitter: {
    title: "SEO AI Regent Demo",
    description:
      "Inspect the live scoring loop for Google and AI-search performance before you publish.",
  },
};

export default function DemoPage() {
  return <DemoWorkspace />;
}
