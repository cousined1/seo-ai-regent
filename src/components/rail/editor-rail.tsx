import React from "react";

import { tokens } from "@/lib/design/tokens";
import type {
  ContentScore,
  GeoScore,
  ScoreBreakdownItem,
  TermsBuckets,
  TopAction,
} from "@/lib/scoring/types";
import type { InlineGuidanceStatus } from "@/lib/scoring/inline-guidance";
import { DualScoreLockup } from "@/components/rail/dual-score-lockup";
import { SignalBreakdown } from "@/components/rail/signal-breakdown";
import { TermsPanel, type TermsPanelProps } from "@/components/rail/terms-panel";
import { TopActionsCard } from "@/components/rail/top-actions-card";

export interface EditorRailProps {
  contentScore: ContentScore;
  geoScore: GeoScore;
  topActions: TopAction[];
  actionStatuses?: Record<string, InlineGuidanceStatus>;
  recentAppliedActions?: Array<{ key: string; title: string }>;
  resolvedActions?: Array<{ key: string; title: string }>;
  actionImpactInsights?: Array<{
    key: string;
    title: string;
    summary: string;
  }>;
  onApplyAction?: (action: TopAction) => void;
  onDismissCompletedAction?: (action: TopAction) => void;
  terms: TermsBuckets;
  contentBreakdown: ScoreBreakdownItem[];
  geoBreakdown: ScoreBreakdownItem[];
}

export function EditorRail({
  contentScore,
  geoScore,
  topActions,
  actionStatuses,
  recentAppliedActions,
  resolvedActions,
  actionImpactInsights,
  onApplyAction,
  onDismissCompletedAction,
  terms,
  contentBreakdown,
  geoBreakdown,
}: EditorRailProps) {
  return (
    <aside
      style={{
        width: "100%",
        maxWidth: "420px",
        display: "grid",
        gap: "14px",
        alignContent: "start",
        padding: "20px",
        borderLeft: `1px solid ${tokens.colors.divider}`,
        backgroundColor: "#0d0d0d",
      }}
    >
      <DualScoreLockup
        contentOverall={contentScore.overall}
        geoOverall={geoScore.overall}
      />
      <TopActionsCard
        topActions={topActions}
        actionStatuses={actionStatuses}
        recentAppliedActions={recentAppliedActions}
        resolvedActions={resolvedActions}
        actionImpactInsights={actionImpactInsights}
        onApplyAction={onApplyAction}
        onDismissCompletedAction={onDismissCompletedAction}
      />
      <TermsPanel terms={terms} />
      <SignalBreakdown
        contentBreakdown={contentBreakdown}
        geoBreakdown={geoBreakdown}
      />
    </aside>
  );
}
