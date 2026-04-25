import React from "react";
import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Register",
  description: "Create a new SEO AI Regent account for content scoring and billing-managed access.",
  alternates: {
    canonical: "/register",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Account creation"
      title="Create a production account"
      description="Register a real account against the live auth layer instead of relying on demo-only editor state."
      alternateHref="/login"
      alternateLabel="Already have an account?"
    >
      <RegisterForm />
    </AuthShell>
  );
}
