import type { Metadata } from "next";

import { CmsConnectionsPage } from "@/components/cms/connections-page";

export const metadata: Metadata = {
  title: "CMS Connections",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function CmsSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return <CmsConnectionsPage workspaceId={id} />;
}
