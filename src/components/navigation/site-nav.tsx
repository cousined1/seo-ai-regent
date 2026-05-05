"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { authNavigation, primaryNavigation, routes } from "@/lib/routes";
import { tokens } from "@/lib/design/tokens";

export function SiteNav() {
  const pathname = usePathname();

  return (
    <header
      className="site-nav"
      style={{
        borderBottom: `1px solid ${tokens.colors.divider}`,
        backgroundColor: "rgba(10, 10, 10, 0.92)",
      }}
    >
      <div className="site-nav__inner">
        <Link
          href={routes.home.href}
          aria-label="SEO AI Regent home"
          style={{
            display: "grid",
            gap: "2px",
          }}
        >
          <span
            style={{
              color: tokens.colors.text,
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            SEO AI Regent
          </span>
          <span
            style={{
              color: tokens.colors.textFaint,
              fontFamily: tokens.typography.mono,
              fontSize: "10px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Content + GEO scoring
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="site-nav__links">
          {primaryNavigation.map((route) => {
            const active = pathname === route.href;

            return (
              <Link
                key={route.href}
                href={route.href}
                aria-current={active ? "page" : undefined}
                className="site-nav__link"
                style={{
                  color: active ? tokens.colors.primary : tokens.colors.textSecondary,
                }}
              >
                {route.label}
              </Link>
            );
          })}
        </nav>

        <div className="site-nav__actions">
          <Link
            href={authNavigation[0].href}
            className="site-nav__link"
            style={{ color: tokens.colors.textSecondary }}
          >
            {authNavigation[0].label}
          </Link>
          <Link
            href={authNavigation[1].href}
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "40px",
              padding: "0 14px",
              borderRadius: tokens.radius.control,
              backgroundColor: tokens.colors.primary,
              color: "#001418",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            {authNavigation[1].label}
          </Link>
        </div>
      </div>
    </header>
  );
}
