import React from "react";
import type { Metadata } from "next";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Login",
  description: "Authenticate into SEO AI Regent and manage resets, sessions, and account access.",
  alternates: {
    canonical: "/login",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default async function LoginPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : undefined;
  const resetTokenValue = searchParams?.resetToken;
  const resetToken =
    typeof resetTokenValue === "string" ? resetTokenValue : Array.isArray(resetTokenValue) ? resetTokenValue[0] : undefined;

  return (
    <AuthShell
      eyebrow="Account access"
      title="Sign in to SEO AI Regent"
      description="Use the live account surfaces to authenticate, request resets, and access billing management."
      alternateHref="/register"
      alternateLabel="Create an account"
    >
      <LoginForm resetToken={resetToken} />
    </AuthShell>
  );
}
