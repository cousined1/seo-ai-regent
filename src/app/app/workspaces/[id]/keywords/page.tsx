import type { Metadata } from "next";

import { KeywordDiscoveryForm } from "@/components/keywords/discovery-form";
import { KeywordTable } from "@/components/keywords/keyword-table";

export const metadata: Metadata = {
  title: "Keywords",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function KeywordsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Keywords</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Discover, cluster, and manage keywords for your workspace.
        </p>
      </div>

      <KeywordDiscoveryForm workspaceId={id} onDiscover={() => {}} />
      <KeywordTable workspaceId={id} />
    </div>
  );
}
