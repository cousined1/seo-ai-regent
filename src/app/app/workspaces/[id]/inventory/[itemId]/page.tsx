import type { Metadata } from "next";

import { RefreshBriefView } from "@/components/inventory/refresh-brief-view";

export const metadata: Metadata = {
  title: "Refresh Brief",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function BriefPage({ params }: { params: Promise<{ id: string; itemId: string }> }) {
  const { itemId } = await params;

  return <RefreshBriefView itemId={itemId} />;
}
