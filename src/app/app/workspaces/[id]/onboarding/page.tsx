import type { Metadata } from "next";

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export const metadata: Metadata = {
  title: "Onboarding",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function OnboardingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <OnboardingFlow workspaceId={id} />;
}
