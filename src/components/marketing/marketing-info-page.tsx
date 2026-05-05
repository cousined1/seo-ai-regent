import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

import { Breadcrumbs } from "@/components/navigation/breadcrumbs";
import { RelatedLinks } from "@/components/navigation/related-links";
import { SiteFooter } from "@/components/navigation/site-footer";
import { SiteNav } from "@/components/navigation/site-nav";
import { routes, type SiteRoute } from "@/lib/routes";
import { tokens } from "@/lib/design/tokens";

export interface MarketingInfoPageSection {
  title: string;
  body: string;
}

export interface MarketingInfoPageProps {
  route: SiteRoute;
  eyebrow: string;
  title: string;
  description: string;
  sections: MarketingInfoPageSection[];
  related: SiteRoute[];
  ctaHref?: string;
  ctaLabel?: string;
}

export function getInfoPageMetadata(route: SiteRoute): Metadata {
  return {
    title: route.label,
    description: route.description,
    alternates: {
      canonical: route.href,
    },
    openGraph: {
      title: `SEO AI Regent ${route.label}`,
      description: route.description,
      url: `https://seoairegent.com${route.href}`,
    },
    twitter: {
      title: `SEO AI Regent ${route.label}`,
      description: route.description,
    },
  };
}

export function MarketingInfoPage({
  route,
  eyebrow,
  title,
  description,
  sections,
  related,
  ctaHref = routes.register.href,
  ctaLabel = "Get started",
}: MarketingInfoPageProps) {
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
            width: "min(920px, 100%)",
            margin: "0 auto",
            display: "grid",
            gap: "34px",
          }}
        >
          <div>
            <Breadcrumbs items={[route]} />
            <div
              style={{
                color: tokens.colors.primary,
                fontFamily: tokens.typography.mono,
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </div>
            <h1
              style={{
                margin: "16px 0 0",
                fontSize: "clamp(2.7rem, 6vw, 4.4rem)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: "20px 0 0",
                color: tokens.colors.textSecondary,
                fontSize: "18px",
                lineHeight: 1.65,
                maxWidth: "760px",
              }}
            >
              {description}
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "24px" }}>
              <Link
                href={ctaHref}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "44px",
                  padding: "0 16px",
                  borderRadius: tokens.radius.control,
                  backgroundColor: tokens.colors.primary,
                  color: "#001418",
                  fontWeight: 700,
                }}
              >
                {ctaLabel}
              </Link>
              <Link
                href={routes.demo.href}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "44px",
                  padding: "0 16px",
                  borderRadius: tokens.radius.control,
                  border: `1px solid ${tokens.colors.border}`,
                  color: tokens.colors.text,
                  fontWeight: 600,
                }}
              >
                Try live demo
              </Link>
            </div>
          </div>

          <div className="info-page__sections">
            {sections.map((section) => (
              <section
                key={section.title}
                style={{
                  border: `1px solid ${tokens.colors.divider}`,
                  borderRadius: tokens.radius.card,
                  backgroundColor: tokens.colors.surface,
                  padding: "24px",
                  display: "grid",
                  gap: "12px",
                }}
              >
                <h2 style={{ margin: 0, fontSize: "1.5rem", lineHeight: 1.2 }}>
                  {section.title}
                </h2>
                <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
                  {section.body}
                </p>
              </section>
            ))}
          </div>

          <RelatedLinks title="Related pages" links={related} />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
