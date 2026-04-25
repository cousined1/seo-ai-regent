import React from "react";

import { tokens } from "@/lib/design/tokens";

function scoreColor(value: number) {
  if (value >= 90) {
    return tokens.scoreRamp.excellent;
  }

  if (value >= 70) {
    return tokens.scoreRamp.good;
  }

  if (value >= 50) {
    return tokens.scoreRamp.fair;
  }

  return tokens.scoreRamp.poor;
}

function scoreStatus(value: number) {
  if (value >= 90) {
    return "Excellent";
  }

  if (value >= 70) {
    return "Strong";
  }

  if (value >= 50) {
    return "Needs work";
  }

  return "Critical";
}

export function DualScoreLockup({
  contentOverall,
  geoOverall,
}: {
  contentOverall: number;
  geoOverall: number;
}) {
  return (
    <section
      style={{
        display: "grid",
        gap: "12px",
        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      }}
    >
      {[
        ["Content Score", contentOverall],
        ["GEO Score", geoOverall],
      ].map(([label, value]) => (
        <article
          key={label}
          style={{
            border: `1px solid ${tokens.colors.border}`,
            borderRadius: tokens.radius.card,
            backgroundColor: tokens.colors.surface,
            padding: "18px",
            display: "grid",
            gap: "10px",
          }}
        >
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
          <div
            style={{
              fontSize: "40px",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: scoreColor(Number(value)),
            }}
          >
            {Math.round(Number(value))}
          </div>
          <div
            style={{
              color: scoreColor(Number(value)),
              fontFamily: tokens.typography.mono,
              fontSize: "12px",
              textTransform: "uppercase",
            }}
          >
            {scoreStatus(Number(value))}
          </div>
        </article>
      ))}
    </section>
  );
}
