import React from "react";
import { tokens } from "@/lib/design/tokens";

const rows = [
  ["Content Score", "Traditional search ranking signal", "Yes", "Yes", "Yes", "Yes"],
  ["GEO Score", "AI-mediated retrieval native peer metric", "Yes", "No", "No", "No"],
  ["SERP Analyzer", "Live top-10 corpus scoring", "Yes", "Yes", "Yes", "Yes"],
  ["AI Writer", "Drafting inside the canonical loop", "Yes", "Yes", "Limited", "Yes"],
] as const;

function valueTone(value: string, brand = false) {
  if (brand) {
    return { color: tokens.colors.primary };
  }

  if (value === "Yes") {
    return { color: tokens.scoreRamp.excellent };
  }

  if (value === "No") {
    return { color: tokens.scoreRamp.poor };
  }

  return { color: tokens.scoreRamp.fair };
}

export function ComparisonTable() {
  return (
    <section
      id="compare"
      style={{
        border: `1px solid ${tokens.colors.divider}`,
        borderRadius: tokens.radius.card,
        overflow: "hidden",
        backgroundColor: tokens.colors.surface,
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr repeat(4, 1fr)",
          backgroundColor: "#0d0d0d",
          borderBottom: `1px solid ${tokens.colors.divider}`,
        }}
      >
        {["Feature", "SEO AI Regent", "Surfer", "Clearscope", "Frase"].map(
          (label, index) => (
            <div
              key={label}
              style={{
                padding: "18px 20px",
                fontFamily: index === 0 ? tokens.typography.mono : tokens.typography.body,
                fontSize: index <= 1 ? "15px" : "14px",
                fontWeight: index === 1 ? 700 : index === 0 ? 500 : 600,
                letterSpacing: index === 0 ? "0.08em" : "-0.01em",
                textTransform: index === 0 ? "uppercase" : "none",
                color: index === 1 ? tokens.colors.primary : tokens.colors.text,
              }}
            >
              {label}
            </div>
          ),
        )}
      </div>

      {rows.map(([feature, description, seoAiRegent, surfer, clearscope, frase]) => {
        const isAnchor = feature === "GEO Score";

        return (
          <div
            key={feature}
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr repeat(4, 1fr)",
              borderTop: `1px solid ${
                isAnchor ? "rgba(6, 182, 212, 0.25)" : tokens.colors.divider
              }`,
              background: isAnchor
                ? "linear-gradient(90deg, rgba(6, 182, 212, 0.06) 0%, rgba(6, 182, 212, 0.02) 100%)"
                : "transparent",
            }}
          >
            <div style={{ padding: "22px 20px" }}>
              <div style={{ fontSize: "15px", fontWeight: 600 }}>{feature}</div>
              <div
                style={{
                  marginTop: "4px",
                  color: isAnchor ? tokens.colors.primary : tokens.colors.textFaint,
                  fontFamily: tokens.typography.mono,
                  fontSize: "12px",
                  textTransform: "uppercase",
                }}
              >
                {description}
              </div>
            </div>

            {[seoAiRegent, surfer, clearscope, frase].map((value, index) => (
              <div
                key={`${feature}-${value}-${index}`}
                style={{
                  padding: "22px 20px",
                  fontFamily: tokens.typography.mono,
                  fontSize: "13px",
                  fontWeight: index === 0 ? 700 : 500,
                  ...valueTone(value, index === 0),
                }}
              >
                {value}
              </div>
            ))}
          </div>
        );
      })}
    </section>
  );
}
