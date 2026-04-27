import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { tokens } from "@/lib/design/tokens";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy practices for SEO AI Regent.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sectionStyle = {
  display: "grid",
  gap: "10px",
} satisfies React.CSSProperties;

export default function PrivacyPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: tokens.colors.background,
        color: tokens.colors.text,
        padding: "72px 24px 96px",
      }}
    >
      <div
        style={{
          width: "min(760px, 100%)",
          margin: "0 auto",
          display: "grid",
          gap: "28px",
        }}
      >
        <div style={{ display: "grid", gap: "14px" }}>
          <Link
            href="/"
            style={{
              color: tokens.colors.primary,
              fontFamily: tokens.typography.mono,
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            SEO AI Regent
          </Link>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.6rem, 6vw, 4rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            Privacy Policy
          </h1>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            This policy describes how SEO AI Regent handles account, billing, and product-usage data for the
            public application surfaces in this repository.
          </p>
        </div>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Information We Process</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            We process account identifiers, authentication state, billing references, keyword inputs, draft
            content submitted for scoring, and operational logs needed to secure and operate the service.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Why We Use It</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            Data is used to authenticate users, fulfill subscription workflows, score content, troubleshoot
            abuse or delivery failures, and maintain auditability for privileged administrative actions.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Processors and Infrastructure</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            The current production design assumes third-party processors for billing, password-reset email, and
            keyword-analysis dependencies. Deployments should disclose the exact providers and regions used in
            their operator-facing documentation.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Retention and Security</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            Authentication records, billing references, webhook receipts, and audit logs are retained only as
            long as needed for account security, financial reconciliation, and incident review. Security
            controls include session signing, MFA-gated admin access, request-origin checks, and rate limiting.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>User Requests</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            Operators should provide a working contact path for access, deletion, correction, and compliance
            inquiries before public launch. The repository currently documents the required environment and
            deployment checks but not a staffed support inbox.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Cookies and Tracking</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            We use strictly necessary cookies to maintain your session and remember your consent
            preferences. For analytics, preference, and marketing cookies, we ask for your consent first.
            See our{" "}
            <Link href="/cookies" style={{ color: tokens.colors.primary }}>
              Cookie Policy
            </Link>{" "}
            for the full list and your rights.
          </p>
        </section>
      </div>
    </main>
  );
}
