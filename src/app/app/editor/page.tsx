import type { Metadata } from "next";

import { DemoWorkspace } from "@/components/demo/demo-workspace";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function EditorPage() {
  return <DemoWorkspace />;
}
