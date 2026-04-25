import React from "react";
import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { BillingPanel } from "@/components/auth/billing-panel";

export const metadata: Metadata = {
  title: "Account Billing",
  description: "Manage SEO AI Regent plans, Stripe checkout, and customer portal access.",
  alternates: {
    canonical: "/account/billing",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountBillingPage() {
  return (
    <AuthShell
      eyebrow="Billing"
      title="Manage plan and customer billing"
      description="Open checkout for the supported plans or hand off to the Stripe customer portal for invoices, payment methods, and cancellation."
      alternateHref="/app/editor"
      alternateLabel="Return to editor"
    >
      <BillingPanel />
    </AuthShell>
  );
}
