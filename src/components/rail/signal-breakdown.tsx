import React from "react";

import { tokens } from "@/lib/design/tokens";
import type { ScoreBreakdownItem } from "@/lib/scoring/types";

function toneForStatus(status: ScoreBreakdownItem["status"]) {
  if (status === "strong") {
    return tokens.scoreRamp.good;
  }

  if (status === "warning") {
    return tokens.scoreRamp.fair;
  }

  return tokens.scoreRamp.poor;
}

export function SignalBreakdown({
  contentBreakdown,
  geoBreakdown,
}: {
  contentBreakdown: ScoreBreakdownItem[];
  geoBreakdown: ScoreBreakdownItem[];
}) {
  return (
    <section
      style={{
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.card,
        backgroundColor: tokens.colors.surface,
        padding: "20px",
        display: "grid",
        gap: "16px",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "18px" }}>Signal Breakdown</h3>
      {[
        { label: "Content", items: contentBreakdown },
        { label: "GEO", items: geoBreakdown },
      ].map(({ label, items }) => (
        <div key={label} style={{ display: "grid", gap: "8px" }}>
          <div
            style={{
              color: tokens.colors.textFaint,
              fontFamily: tokens.typography.mono,
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </div>
          {items.map((item) => (
            <div
              key={`${label}-${item.signal}`}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 0.7fr 0.7fr",
                gap: "8px",
                padding: "10px 0",
                borderTop: `1px solid ${tokens.colors.divider}`,
                fontSize: "13px",
              }}
            >
              <div>{item.signal}</div>
              <div
                style={{
                  color: tokens.colors.textSecondary,
                  fontFamily: tokens.typography.mono,
                }}
              >
                {item.contribution}
              </div>
              <div
                style={{
                  color: toneForStatus(item.status),
                  fontFamily: tokens.typography.mono,
                  textTransform: "uppercase",
                }}
              >
                {item.status}
              </div>
            </div>
          ))}
        </div>
      ))}
    </section>
  );
}
