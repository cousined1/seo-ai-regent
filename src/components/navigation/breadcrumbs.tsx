import React from "react";
import Link from "next/link";

import { routes, type SiteRoute } from "@/lib/routes";
import { tokens } from "@/lib/design/tokens";

export function Breadcrumbs({ items }: { items: SiteRoute[] }) {
  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: "18px" }}>
      <ol
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          alignItems: "center",
          color: tokens.colors.textFaint,
          fontFamily: tokens.typography.mono,
          fontSize: "11px",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        <li>
          <Link href={routes.home.href} style={{ color: tokens.colors.primary }}>
            {routes.home.label}
          </Link>
        </li>
        {items.map((item, index) => {
          const current = index === items.length - 1;

          return (
            <li key={item.href} style={{ display: "inline-flex", gap: "8px", alignItems: "center" }}>
              <span aria-hidden="true">/</span>
              {current ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link href={item.href} style={{ color: tokens.colors.primary }}>
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
