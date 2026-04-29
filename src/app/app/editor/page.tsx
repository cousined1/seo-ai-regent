import type { Metadata } from "next";

import { CheckoutSuccessTracker } from "@/components/analytics/checkout-success-tracker";
import { DemoWorkspace } from "@/components/demo/demo-workspace";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function EditorPage() {
  return (
    <>
      <CheckoutSuccessTracker />
      <DemoWorkspace />
    </>
  );
}
