import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { tokens } from "@/lib/design/tokens";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How SEO AI Regent uses cookies and how to manage your preferences.",
  alternates: {
    canonical: "/cookies",
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

const cookieTable = [
  {
    name: "seo-ai-regent-session",
    category: "Strictly Necessary",
    purpose: "Maintains your authenticated session.",
    duration: "7 days",
  },
  {
    name: "consent_preferences",
    category: "Strictly Necessary",
    purpose: "Stores your cookie consent choices.",
    duration: "365 days",
  },
  {
    name: "_ga, _ga_*",
    category: "Analytics",
    purpose: "Google Analytics tracking. Only set if you consent to analytics cookies.",
    duration: "2 years",
  },
  {
    name: "Preference cookies",
    category: "Preferences",
    purpose: "Remember your UI settings and choices. Only set if you consent to preference cookies.",
    duration: "1 year",
  },
  {
    name: "Marketing / chat widget cookies",
    category: "Marketing",
    purpose: "Support chat, retargeting, and advertising. Only set if you consent to marketing cookies.",
    duration: "Varies",
  },
];

export default function CookiesPage() {
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
            Cookie Policy
          </h1>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            Last updated: April 2026. This policy describes how SEO AI Regent uses cookies and how
            you can manage your preferences.
          </p>
        </div>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>What Cookies We Use</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            We categorize cookies into four groups: strictly necessary, analytics, preferences, and
            marketing. Only strictly necessary cookies are set by default. All other categories
            require your consent.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              <thead>
                <tr style={{ borderBottom: `1px solid ${tokens.colors.divider}` }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Cookie</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Category</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Purpose</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {cookieTable.map((row) => (
                  <tr key={row.name} style={{ borderBottom: `1px solid ${tokens.colors.divider}` }}>
                    <td style={{ padding: "8px 12px", color: tokens.colors.text, whiteSpace: "nowrap" }}>
                      {row.name}
                    </td>
                    <td style={{ padding: "8px 12px", color: tokens.colors.textSecondary }}>{row.category}</td>
                    <td style={{ padding: "8px 12px", color: tokens.colors.textSecondary }}>{row.purpose}</td>
                    <td style={{ padding: "8px 12px", color: tokens.colors.textSecondary, whiteSpace: "nowrap" }}>
                      {row.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Managing Your Preferences</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            When you first visit our site, a consent banner will appear. You can accept all cookies,
            reject non-essential cookies, or open the preferences manager to customize your choices.
            At any time, you can reopen the preferences manager using the &quot;Cookies&quot; link in the site
            footer. Withdrawing consent is as easy as granting it.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Global Privacy Control (GPC)</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            We honor Global Privacy Control signals. If your browser sends a GPC signal
            (navigator.globalPrivacyControl = true), we will automatically reject all non-essential
            cookies on your behalf.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Changes to This Policy</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            If we change the cookies we use, we will update this policy and increment the policy
            version stored in your consent preferences. You may be shown the consent banner again to
            re-confirm your choices.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Contact</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            For broader privacy questions, see our{" "}
            <Link href="/privacy" style={{ color: tokens.colors.primary }}>
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}