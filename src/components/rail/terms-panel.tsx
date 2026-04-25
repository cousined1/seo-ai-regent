import React from "react";

import { tokens } from "@/lib/design/tokens";
import type { TermsBuckets } from "@/lib/scoring/types";

export interface TermsPanelProps {
  terms: TermsBuckets;
}

function toneForBucket(bucket: keyof TermsPanelProps["terms"]) {
  if (bucket === "required") {
    return tokens.scoreRamp.poor;
  }

  if (bucket === "recommended") {
    return tokens.scoreRamp.fair;
  }

  return tokens.scoreRamp.good;
}

export function TermsPanel({ terms }: TermsPanelProps) {
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
      <h3 style={{ margin: 0, fontSize: "18px" }}>Terms</h3>
      {(Object.keys(terms) as Array<keyof TermsPanelProps["terms"]>).map((bucket) => (
        <div key={bucket} style={{ display: "grid", gap: "8px" }}>
          <div
            style={{
              color: tokens.colors.textFaint,
              fontFamily: tokens.typography.mono,
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {bucket}
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {terms[bucket].map((term) => (
              <span
                key={term}
                style={{
                  border: `1px solid ${tokens.colors.border}`,
                  borderRadius: tokens.radius.pill,
                  padding: "6px 10px",
                  color: toneForBucket(bucket),
                  fontSize: "13px",
                }}
              >
                {term}
              </span>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
