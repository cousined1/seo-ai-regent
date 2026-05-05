import type { Metadata } from "next";

import { WorkspaceForm } from "@/components/workspaces/workspace-form";

export const metadata: Metadata = {
  title: "Create Workspace",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NewWorkspacePage() {
  return <WorkspaceForm />;
}
