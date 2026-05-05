import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { RelatedLinks } from "@/components/navigation/related-links";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteNav } from "@/components/navigation/site-nav";
import { tokens } from "@/lib/design/tokens";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of service for SEO AI Regent.",
  alternates: {
    canonical: "/terms",
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

export default function TermsPage() {
  return (
    <>
      <SiteNav />
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
          <Breadcrumbs items={[routes.terms]} />
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.6rem, 6vw, 4rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            Terms of Service
          </h1>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            These terms describe the baseline usage expectations for the public SEO AI Regent application.
          </p>
        </div>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Service Scope</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            SEO AI Regent provides keyword analysis, content scoring, editorial guidance, and billing-backed
            access to those workflows. The product is delivered on a best-effort basis and may evolve as the
            scoring system changes.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Accounts and Security</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            Users are responsible for safeguarding account credentials. Administrative routes are reserved for
            authenticated, MFA-verified operators and must not be used to perform unauthorized actions.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Acceptable Use</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            You may not abuse the scoring endpoints, interfere with the service, circumvent rate limits, or
            submit content you do not have the right to process. Access can be suspended for security or
            platform-protection reasons.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Billing</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            Paid access, checkout, and customer-portal functions depend on the configured billing provider.
            Subscription details, renewals, and cancellations should match the live plan configuration used at
            deployment time.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Disclaimers</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            Scores and editorial guidance are decision-support outputs, not guarantees of ranking, traffic, or
            AI citation outcomes. Operators should review live outputs, pricing, and legal commitments before
            commercial launch.
          </p>
        </section>
        <RelatedLinks title="Related policies and product pages" links={[routes.privacy, routes.cookies, routes.pricing]} />
      </div>
      </main>
      <SiteFooter />
    </>
  );
}
