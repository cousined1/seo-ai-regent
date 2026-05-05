import React from "react";
import Link from "next/link";

import { footerGroups, routes } from "@/lib/routes";
import { tokens } from "@/lib/design/tokens";

export function SiteFooter() {
  return (
    <footer
      style={{
        borderTop: `1px solid ${tokens.colors.divider}`,
        padding: "48px 0 56px",
        backgroundColor: tokens.colors.background,
      }}
    >
      <div className="site-footer__inner">
        <div
          style={{
            display: "grid",
            gap: "12px",
            alignContent: "start",
          }}
        >
          <Link
            href={routes.home.href}
            style={{
              color: tokens.colors.text,
              fontSize: "18px",
              fontWeight: 700,
            }}
          >
            SEO AI Regent
          </Link>
          <p
            style={{
              margin: 0,
              color: tokens.colors.textSecondary,
              fontSize: "14px",
              lineHeight: 1.6,
              maxWidth: "320px",
            }}
          >
            Editorial scoring for Google ranking and AI retrieval, from one
            canonical scoring model.
          </p>
        </div>

        {footerGroups.map((group) => (
          <nav key={group.title} aria-label={`${group.title} links`} style={{ display: "grid", gap: "12px" }}>
            <h2
              style={{
                margin: 0,
                color: tokens.colors.textFaint,
                fontFamily: tokens.typography.mono,
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {group.title}
            </h2>
            <div style={{ display: "grid", gap: "10px" }}>
              {group.links.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  style={{
                    color: tokens.colors.textSecondary,
                    fontSize: "14px",
                  }}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </nav>
        ))}
      </div>
    </footer>
  );
}
