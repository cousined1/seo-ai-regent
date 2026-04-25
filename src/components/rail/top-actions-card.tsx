import React from "react";

import { tokens } from "@/lib/design/tokens";
import type { TopAction } from "@/lib/scoring/types";
import type { InlineGuidanceStatus } from "@/lib/scoring/inline-guidance";

function getStatusMeta(status: InlineGuidanceStatus) {
  if (status === "completed") {
    return {
      label: "Completed",
      border: "rgba(132, 204, 22, 0.35)",
      background: "rgba(132, 204, 22, 0.12)",
      color: "#BEF264",
    };
  }

  if (status === "reduced") {
    return {
      label: "Reduced",
      border: "rgba(245, 158, 11, 0.35)",
      background: "rgba(245, 158, 11, 0.12)",
      color: "#FCD34D",
    };
  }

  return {
    label: "Pending",
    border: "rgba(6, 182, 212, 0.3)",
    background: "rgba(6, 182, 212, 0.1)",
    color: tokens.colors.primary,
  };
}

export function TopActionsCard({
  topActions,
  actionStatuses,
  recentAppliedActions,
  resolvedActions,
  actionImpactInsights,
  onApplyAction,
  onDismissCompletedAction,
}: {
  topActions: TopAction[];
  actionStatuses?: Record<string, InlineGuidanceStatus>;
  recentAppliedActions?: Array<{ key: string; title: string }>;
  resolvedActions?: Array<{ key: string; title: string }>;
  actionImpactInsights?: Array<{ key: string; title: string; summary: string }>;
  onApplyAction?: (action: TopAction) => void;
  onDismissCompletedAction?: (action: TopAction) => void;
}) {
  return (
    <section
      style={{
        border: `1px solid ${tokens.colors.border}`,
        borderRadius: tokens.radius.card,
        backgroundColor: tokens.colors.surface,
        padding: "20px",
        display: "grid",
        gap: "14px",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "18px" }}>Top 3 Actions</h3>
      {recentAppliedActions?.length ? (
        <div style={{ display: "grid", gap: "8px" }}>
          <div
            style={{
              color: tokens.colors.textFaint,
              fontFamily: tokens.typography.mono,
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Recent Applied
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {recentAppliedActions.map((action) => (
              <span
                key={action.key}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: `1px solid ${tokens.colors.border}`,
                  borderRadius: tokens.radius.pill,
                  backgroundColor: "rgba(17, 17, 17, 0.92)",
                  color: tokens.colors.textSecondary,
                  fontFamily: tokens.typography.mono,
                  fontSize: "11px",
                  letterSpacing: "0.04em",
                  padding: "5px 9px",
                }}
              >
                {action.title}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {resolvedActions?.length ? (
        <div style={{ display: "grid", gap: "8px" }}>
          <div
            style={{
              color: tokens.colors.textFaint,
              fontFamily: tokens.typography.mono,
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Resolved This Session
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {resolvedActions.map((action) => (
              <span
                key={action.key}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  border: "1px solid rgba(132, 204, 22, 0.35)",
                  borderRadius: tokens.radius.pill,
                  backgroundColor: "rgba(132, 204, 22, 0.12)",
                  color: "#BEF264",
                  fontFamily: tokens.typography.mono,
                  fontSize: "11px",
                  letterSpacing: "0.04em",
                  padding: "5px 9px",
                }}
              >
                {action.title}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      {actionImpactInsights?.length ? (
        <div style={{ display: "grid", gap: "8px" }}>
          <div
            style={{
              color: tokens.colors.textFaint,
              fontFamily: tokens.typography.mono,
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            What Worked Here
          </div>
          <div style={{ display: "grid", gap: "8px" }}>
            {actionImpactInsights.map((action) => (
              <div
                key={action.key}
                style={{
                  border: "1px solid rgba(6, 182, 212, 0.24)",
                  borderRadius: tokens.radius.card,
                  backgroundColor: "rgba(6, 182, 212, 0.06)",
                  padding: "10px 12px",
                  display: "grid",
                  gap: "4px",
                }}
              >
                <div style={{ fontWeight: 600, fontSize: "13px" }}>{action.title}</div>
                <div
                  style={{
                    color: tokens.colors.textSecondary,
                    fontFamily: tokens.typography.mono,
                    fontSize: "11px",
                    letterSpacing: "0.04em",
                  }}
                >
                  {action.summary}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {topActions.map((action) => {
        const actionKey = `${action.area}-${action.signal}`;
        const status = actionStatuses?.[actionKey] ?? "pending";
        const statusMeta = getStatusMeta(status);

        return (
          <article
            key={actionKey}
            style={{
              borderTop: `1px solid ${tokens.colors.divider}`,
              paddingTop: "14px",
              display: "grid",
              gap: "6px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                alignItems: "baseline",
              }}
            >
              <div style={{ fontWeight: 600 }}>{action.title}</div>
              <div
                style={{
                  color: action.area === "GEO" ? tokens.colors.primary : tokens.scoreRamp.good,
                  fontFamily: tokens.typography.mono,
                  fontSize: "12px",
                }}
              >
                {action.liftLabel}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  width: "fit-content",
                  border: `1px solid ${statusMeta.border}`,
                  borderRadius: tokens.radius.pill,
                  backgroundColor: statusMeta.background,
                  color: statusMeta.color,
                  fontFamily: tokens.typography.mono,
                  fontSize: "11px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  padding: "5px 9px",
                }}
              >
                {statusMeta.label}
              </span>
              {status === "completed" ? (
                <button
                  type="button"
                  aria-label={`Dismiss completed action ${action.title}`}
                  onClick={() => onDismissCompletedAction?.(action)}
                  style={{
                    border: `1px solid ${tokens.colors.border}`,
                    borderRadius: tokens.radius.pill,
                    backgroundColor: "rgba(17, 17, 17, 0.92)",
                    color: tokens.colors.textSecondary,
                    fontFamily: tokens.typography.mono,
                    fontSize: "11px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    padding: "5px 9px",
                  }}
                >
                  Dismiss
                </button>
              ) : (
                <button
                  type="button"
                  aria-label={`Apply rail action ${action.title}`}
                  onClick={() => onApplyAction?.(action)}
                  style={{
                    border: `1px solid ${tokens.colors.border}`,
                    borderRadius: tokens.radius.pill,
                    backgroundColor: "rgba(17, 17, 17, 0.92)",
                    color: tokens.colors.text,
                    fontFamily: tokens.typography.mono,
                    fontSize: "11px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    padding: "5px 9px",
                  }}
                >
                  {status === "reduced" ? "Refine" : "Apply"}
                </button>
              )}
            </div>
            <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.55 }}>
              {action.detail}
            </p>
          </article>
        );
      })}
    </section>
  );
}
