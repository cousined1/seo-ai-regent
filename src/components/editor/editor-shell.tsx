"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { tokens } from "@/lib/design/tokens";
import { appNavigation, routes } from "@/lib/routes";
import { applyPriorityActionSuggestion } from "@/lib/editor/apply-guidance";
import {
  createActionImpactEntries,
  deriveActionImpactInsights,
  mergeActionImpactEntries,
  type ActionImpactEntry,
} from "@/lib/scoring/action-impact";
import { deriveActionStatus } from "@/lib/scoring/inline-guidance";
import { prioritizeActions } from "@/lib/scoring/prioritize-actions";
import { deriveScoreMovement, type ScoreMovement } from "@/lib/scoring/score-movement";
import type { EditorRailProps } from "@/components/rail/editor-rail";
import { EditorRail } from "@/components/rail/editor-rail";
import { FocusModeToggle } from "@/components/editor/focus-mode-toggle";
import { TiptapEditor } from "@/components/editor/tiptap-editor";

export interface EditorShellProps extends EditorRailProps {
  keyword: string;
  initialContent: string;
}

const DRAFT_SESSION_PREFIX = "seo-ai-regent:draft-session:";

function hashDraftSessionInput(input: string) {
  let hash = 5381;
  for (let index = 0; index < input.length; index += 1) {
    hash = ((hash << 5) + hash + input.charCodeAt(index)) | 0;
  }
  return (hash >>> 0).toString(36);
}

type StoredRailState = Pick<
  EditorRailProps,
  "contentScore" | "geoScore" | "topActions" | "terms" | "contentBreakdown" | "geoBreakdown"
>;

interface StoredScoreSnapshot {
  baseline: {
    contentOverall: number;
    geoOverall: number;
  };
  attributionCursor: {
    contentOverall: number;
    geoOverall: number;
  };
  latest: {
    contentOverall: number;
    geoOverall: number;
  };
}

interface DraftSessionState {
  content: string;
  focusMode: boolean;
  dismissedCompletedActions: string[];
  recentAppliedActions: Array<{ key: string; title: string }>;
  resolvedActions: Array<{ key: string; title: string }>;
  actionImpactHistory: ActionImpactEntry[];
  scores: StoredScoreSnapshot | null;
  rail: StoredRailState | null;
}

function getDraftSessionKey(keyword: string, initialContent: string) {
  const keywordHash = hashDraftSessionInput(keyword);
  const contentHash = hashDraftSessionInput(initialContent);
  return `${DRAFT_SESSION_PREFIX}${keywordHash}:${contentHash}`;
}

function loadDraftSession(key: string): DraftSessionState {
  if (typeof window === "undefined") {
    return {
      content: "",
      focusMode: false,
      dismissedCompletedActions: [],
      recentAppliedActions: [],
      resolvedActions: [],
      actionImpactHistory: [],
      scores: null,
      rail: null,
    };
  }

  try {
    const rawValue = window.localStorage.getItem(key);

    if (!rawValue) {
      return {
        content: "",
        focusMode: false,
        dismissedCompletedActions: [],
        recentAppliedActions: [],
        resolvedActions: [],
        actionImpactHistory: [],
        scores: null,
        rail: null,
      };
    }

    const parsedValue = JSON.parse(rawValue) as Partial<DraftSessionState>;

    return {
      content: typeof parsedValue.content === "string" ? parsedValue.content : "",
      focusMode: parsedValue.focusMode === true,
      dismissedCompletedActions: Array.isArray(parsedValue.dismissedCompletedActions)
        ? parsedValue.dismissedCompletedActions
        : [],
      recentAppliedActions: Array.isArray(parsedValue.recentAppliedActions)
        ? parsedValue.recentAppliedActions
            .filter(
              (item): item is { key: string; title: string } =>
                typeof item?.key === "string" && typeof item?.title === "string",
            )
            .slice(0, 5)
        : [],
      resolvedActions: Array.isArray(parsedValue.resolvedActions)
        ? parsedValue.resolvedActions
            .filter(
              (item): item is { key: string; title: string } =>
                typeof item?.key === "string" && typeof item?.title === "string",
            )
            .slice(0, 5)
        : [],
      actionImpactHistory: Array.isArray(parsedValue.actionImpactHistory)
        ? parsedValue.actionImpactHistory
            .filter(
              (item): item is ActionImpactEntry =>
                typeof item?.key === "string" &&
                typeof item?.title === "string" &&
                typeof item?.signal === "string" &&
                (item?.area === "Content" || item?.area === "GEO") &&
                typeof item?.contentDelta === "number" &&
                typeof item?.geoDelta === "number" &&
                typeof item?.totalDelta === "number",
            )
            .slice(0, 5)
        : [],
      scores:
        parsedValue.scores &&
        typeof parsedValue.scores === "object" &&
        typeof parsedValue.scores.baseline?.contentOverall === "number" &&
        typeof parsedValue.scores.baseline?.geoOverall === "number" &&
        typeof parsedValue.scores.attributionCursor?.contentOverall === "number" &&
        typeof parsedValue.scores.attributionCursor?.geoOverall === "number" &&
        typeof parsedValue.scores.latest?.contentOverall === "number" &&
        typeof parsedValue.scores.latest?.geoOverall === "number"
          ? parsedValue.scores
          : null,
      rail:
        parsedValue.rail &&
        typeof parsedValue.rail === "object" &&
        parsedValue.rail.contentScore &&
        parsedValue.rail.geoScore &&
        Array.isArray(parsedValue.rail.topActions) &&
        parsedValue.rail.terms &&
        Array.isArray(parsedValue.rail.contentBreakdown) &&
        Array.isArray(parsedValue.rail.geoBreakdown)
          ? (parsedValue.rail as StoredRailState)
          : null,
    };
  } catch {
    return {
      content: "",
      focusMode: false,
      dismissedCompletedActions: [],
      recentAppliedActions: [],
      resolvedActions: [],
      actionImpactHistory: [],
      scores: null,
      rail: null,
    };
  }
}

export function EditorShell({
  keyword,
  initialContent,
  ...railProps
}: EditorShellProps) {
  const pathname = usePathname();
  const workspaceNavigation =
    pathname === routes.demo.href
      ? [routes.home, routes.features, routes.pricing, routes.register, routes.help]
      : appNavigation;
  const draftSessionKey = getDraftSessionKey(keyword, initialContent);
  const initialSessionRef = useRef<DraftSessionState>(loadDraftSession(draftSessionKey));
  const defaultRailState = useMemo<StoredRailState>(
    () => ({
      contentScore: railProps.contentScore,
      geoScore: railProps.geoScore,
      topActions: railProps.topActions,
      terms: railProps.terms,
      contentBreakdown: railProps.contentBreakdown,
      geoBreakdown: railProps.geoBreakdown,
    }),
    [railProps.contentBreakdown, railProps.contentScore, railProps.geoBreakdown, railProps.geoScore, railProps.terms, railProps.topActions],
  );
  const defaultScoreSnapshot = useMemo<StoredScoreSnapshot>(
    () => ({
      baseline: {
        contentOverall: railProps.contentScore.overall,
        geoOverall: railProps.geoScore.overall,
      },
      attributionCursor: {
        contentOverall: railProps.contentScore.overall,
        geoOverall: railProps.geoScore.overall,
      },
      latest: {
        contentOverall: railProps.contentScore.overall,
        geoOverall: railProps.geoScore.overall,
      },
    }),
    [railProps.contentScore.overall, railProps.geoScore.overall],
  );
  const [focusMode, setFocusMode] = useState(initialSessionRef.current.focusMode);
  const [content, setContent] = useState(initialSessionRef.current.content || initialContent);
  const [liveRail, setLiveRail] = useState<StoredRailState>(
    initialSessionRef.current.rail ?? defaultRailState,
  );
  const [scoreSnapshot, setScoreSnapshot] = useState<StoredScoreSnapshot>(
    initialSessionRef.current.scores ?? defaultScoreSnapshot,
  );
  const [dismissedCompletedActions, setDismissedCompletedActions] = useState<string[]>(
    initialSessionRef.current.dismissedCompletedActions,
  );
  const [recentAppliedActions, setRecentAppliedActions] = useState<Array<{ key: string; title: string }>>(
    initialSessionRef.current.recentAppliedActions,
  );
  const [resolvedActions, setResolvedActions] = useState<Array<{ key: string; title: string }>>(
    initialSessionRef.current.resolvedActions,
  );
  const [actionImpactHistory, setActionImpactHistory] = useState<ActionImpactEntry[]>(
    initialSessionRef.current.actionImpactHistory,
  );
  const initialContentRef = useRef(initialContent);

  useEffect(() => {
    const session = loadDraftSession(draftSessionKey);
    setContent(session.content || initialContent);
    setFocusMode(session.focusMode);
    setDismissedCompletedActions(session.dismissedCompletedActions);
    setRecentAppliedActions(session.recentAppliedActions);
    setResolvedActions(session.resolvedActions);
    setActionImpactHistory(session.actionImpactHistory);
    setLiveRail(session.rail ?? defaultRailState);
    setScoreSnapshot(session.scores ?? defaultScoreSnapshot);
    initialSessionRef.current = session;
    initialContentRef.current = initialContent;
  }, [defaultRailState, defaultScoreSnapshot, draftSessionKey, initialContent]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      draftSessionKey,
      JSON.stringify({
        content,
        focusMode,
        dismissedCompletedActions,
        recentAppliedActions,
        resolvedActions,
        actionImpactHistory,
        scores: scoreSnapshot,
        rail: liveRail,
      } satisfies DraftSessionState),
    );
  }, [
    content,
    dismissedCompletedActions,
    draftSessionKey,
    focusMode,
    liveRail,
    actionImpactHistory,
    recentAppliedActions,
    resolvedActions,
    scoreSnapshot,
  ]);

  useEffect(() => {
    const trimmedContent = content.trim();

    if (!keyword.trim() || !trimmedContent || trimmedContent === initialContentRef.current.trim()) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/score/content", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            keyword,
            content: trimmedContent,
          }),
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as Pick<
          EditorRailProps,
          | "contentScore"
          | "geoScore"
          | "topActions"
          | "terms"
          | "contentBreakdown"
          | "geoBreakdown"
        >;

        setScoreSnapshot((previous) => ({
          baseline: previous.baseline,
          attributionCursor: previous.attributionCursor,
          latest: {
            contentOverall: payload.contentScore.overall,
            geoOverall: payload.geoScore.overall,
          },
        }));

        setLiveRail({
          contentScore: payload.contentScore,
          geoScore: payload.geoScore,
          topActions: payload.topActions,
          terms: payload.terms,
          contentBreakdown: payload.contentBreakdown,
          geoBreakdown: payload.geoBreakdown,
        });
      } catch {
        // Keep the last successful rail state if rescoring fails.
      }
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [content, keyword]);

  const prioritizedRail = {
    ...liveRail,
    topActions: prioritizeActions({
      content,
      terms: liveRail.terms,
      topActions: liveRail.topActions,
    }),
  };
  const actionStatuses = Object.fromEntries(
    prioritizedRail.topActions.map((action) => [
      `${action.area}-${action.signal}`,
      deriveActionStatus({
        content,
        action,
        terms: prioritizedRail.terms,
      }),
    ]),
  );
  const visibleTopActions = prioritizedRail.topActions.filter((action) => {
    const actionKey = `${action.area}-${action.signal}`;
    const isDismissed = dismissedCompletedActions.includes(actionKey);

    if (!isDismissed) {
      return true;
    }

    return actionStatuses[actionKey] !== "completed";
  });
  const visibleRail = {
    ...prioritizedRail,
    topActions: visibleTopActions,
    recentAppliedActions,
    resolvedActions,
    actionImpactInsights: deriveActionImpactInsights(actionImpactHistory),
  };
  const scoreMovement: ScoreMovement | null =
    scoreSnapshot.baseline.contentOverall === scoreSnapshot.latest.contentOverall &&
    scoreSnapshot.baseline.geoOverall === scoreSnapshot.latest.geoOverall
      ? null
      : deriveScoreMovement({
          previous: scoreSnapshot.baseline,
          current: scoreSnapshot.latest,
        });

  useEffect(() => {
    const nextResolvedActions = prioritizedRail.topActions
      .filter((action) => actionStatuses[`${action.area}-${action.signal}`] === "completed")
      .map((action) => ({
        key: `${action.area}-${action.signal}`,
        title: action.title,
      }));

    if (!nextResolvedActions.length) {
      return;
    }

    setResolvedActions((current) => {
      const merged = [...nextResolvedActions, ...current.filter((item) => !nextResolvedActions.some((next) => next.key === item.key))].slice(0, 5);

      if (
        merged.length === current.length &&
        merged.every((item, index) => item.key === current[index]?.key && item.title === current[index]?.title)
      ) {
        return current;
      }

      return merged;
    });
  }, [actionStatuses, prioritizedRail.topActions]);

  useEffect(() => {
    const completedActions = prioritizedRail.topActions.filter(
      (action) =>
        actionStatuses[`${action.area}-${action.signal}`] === "completed",
    );

    if (!completedActions.length) {
      return;
    }

    if (
      scoreSnapshot.attributionCursor.contentOverall === scoreSnapshot.latest.contentOverall &&
      scoreSnapshot.attributionCursor.geoOverall === scoreSnapshot.latest.geoOverall
    ) {
      return;
    }

    const nextEntries = createActionImpactEntries({
      actions: completedActions,
      previous: scoreSnapshot.attributionCursor,
      current: scoreSnapshot.latest,
    });

    setActionImpactHistory((current) => mergeActionImpactEntries(current, nextEntries));
    setScoreSnapshot((current) => ({
      ...current,
      attributionCursor: current.latest,
    }));
  }, [actionStatuses, prioritizedRail.topActions, scoreSnapshot]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: tokens.colors.background,
        color: tokens.colors.text,
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "16px",
          alignItems: "center",
          flexWrap: "wrap",
          padding: "20px 24px",
          borderBottom: `1px solid ${tokens.colors.divider}`,
        }}
      >
        <div style={{ display: "grid", gap: "4px" }}>
          <div
            style={{
              color: tokens.colors.textFaint,
              fontFamily: tokens.typography.mono,
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Editorial Rail
          </div>
          <div style={{ fontSize: "22px", fontWeight: 600 }}>{keyword}</div>
          <nav
            aria-label="Editor breadcrumb"
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              color: tokens.colors.textFaint,
              fontFamily: tokens.typography.mono,
              fontSize: "11px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <Link href={routes.home.href} style={{ color: tokens.colors.primary }}>
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{pathname === routes.demo.href ? "Live Demo" : "Editor"}</span>
          </nav>
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          <nav aria-label="Workspace navigation" style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {workspaceNavigation.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                style={{
                  color:
                    route.href === pathname || (pathname === routes.demo.href && route.href === routes.home.href)
                      ? tokens.colors.primary
                      : tokens.colors.textSecondary,
                  fontSize: "14px",
                }}
              >
                {route.label}
              </Link>
            ))}
          </nav>
          <FocusModeToggle
            enabled={focusMode}
            onToggle={() => setFocusMode((value) => !value)}
          />
        </div>
      </header>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(340px, 420px)",
          alignItems: "start",
        }}
      >
        <section
          aria-label="Writing canvas"
          style={{
            padding: "24px",
            display: "grid",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gap: "8px",
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
              {focusMode ? "Assisted canvas" : "Clean canvas"}
            </div>
            <div
              style={{
                color: tokens.colors.textSecondary,
                maxWidth: "760px",
                lineHeight: 1.6,
              }}
            >
              {focusMode
                ? "Assisted canvas surfaces editorial guidance while keeping the rail as the source of truth."
                : "Clean canvas protects writing flow and keeps guidance in the right rail until you ask for more help."}
            </div>
          </div>

          <TiptapEditor
            value={content}
            onChange={setContent}
            focusMode={focusMode}
            terms={visibleRail.terms}
            topActions={visibleRail.topActions}
            scoreMovement={scoreMovement}
          />
        </section>

        <EditorRail
          {...visibleRail}
          actionStatuses={actionStatuses}
          onApplyAction={(action) => {
            const actionKey = `${action.area}-${action.signal}`;
            setContent((current) => applyPriorityActionSuggestion(current, action));
            setRecentAppliedActions((current) => [
              { key: actionKey, title: action.title },
              ...current.filter((item) => item.key !== actionKey),
            ].slice(0, 5));
          }}
          onDismissCompletedAction={(action) =>
            setDismissedCompletedActions((current) => {
              const actionKey = `${action.area}-${action.signal}`;

              if (current.includes(actionKey)) {
                return current;
              }

              return [...current, actionKey];
            })
          }
        />
      </div>
    </div>
  );
}
