import React from "react";
import Link from "next/link";

import type { SiteRoute } from "@/lib/routes";
import { tokens } from "@/lib/design/tokens";

export function RelatedLinks({ title, links }: { title: string; links: SiteRoute[] }) {
  return (
    <section
      aria-labelledby="related-links-heading"
      style={{
        borderTop: `1px solid ${tokens.colors.divider}`,
        paddingTop: "28px",
        display: "grid",
        gap: "16px",
      }}
    >
      <h2 id="related-links-heading" style={{ margin: 0, fontSize: "1.4rem" }}>
        {title}
      </h2>
      <div className="related-links__grid">
        {links.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            style={{
              border: `1px solid ${tokens.colors.divider}`,
              borderRadius: tokens.radius.card,
              backgroundColor: tokens.colors.surface,
              padding: "18px",
              display: "grid",
              gap: "8px",
            }}
          >
            <span style={{ color: tokens.colors.primary, fontWeight: 700 }}>{route.label}</span>
            <span style={{ color: tokens.colors.textSecondary, fontSize: "14px", lineHeight: 1.5 }}>
              {route.description}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
