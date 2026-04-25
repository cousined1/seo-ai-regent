import { appendCacheObservabilityEvent } from "@/lib/observability/cache-log";
import type { SnapshotInvalidationResult } from "@/lib/debug/snapshot-invalidation";

type RecomputeReason = "miss" | "stale" | "version-mismatch" | "missing-meta";

type SerpSource = "memory-cache" | "persisted-keyword-snapshot" | "fresh-analysis";
type ScoreSource =
  | "persisted-score-snapshot"
  | "memory-cache"
  | "persisted-keyword-snapshot"
  | "fresh-analysis";

interface SourceCounters {
  memoryCache: number;
  persistedKeywordSnapshot: number;
  persistedScoreSnapshot: number;
  freshAnalysis: number;
}

interface ReasonCounters {
  miss: number;
  stale: number;
  versionMismatch: number;
  missingMeta: number;
}

interface RouteMetrics {
  sources: SourceCounters;
  recomputeReasons: ReasonCounters;
}

interface CacheMetrics {
  serpAnalyze: RouteMetrics;
  scoreContent: RouteMetrics;
}

const metrics: CacheMetrics = {
  serpAnalyze: createRouteMetrics(),
  scoreContent: createRouteMetrics(),
};

function createRouteMetrics(): RouteMetrics {
  return {
    sources: {
      memoryCache: 0,
      persistedKeywordSnapshot: 0,
      persistedScoreSnapshot: 0,
      freshAnalysis: 0,
    },
    recomputeReasons: {
      miss: 0,
      stale: 0,
      versionMismatch: 0,
      missingMeta: 0,
    },
  };
}

function incrementSource(metricsForRoute: RouteMetrics, source: SerpSource | ScoreSource) {
  switch (source) {
    case "memory-cache":
      metricsForRoute.sources.memoryCache += 1;
      break;
    case "persisted-keyword-snapshot":
      metricsForRoute.sources.persistedKeywordSnapshot += 1;
      break;
    case "persisted-score-snapshot":
      metricsForRoute.sources.persistedScoreSnapshot += 1;
      break;
    case "fresh-analysis":
      metricsForRoute.sources.freshAnalysis += 1;
      break;
  }
}

function incrementReason(metricsForRoute: RouteMetrics, reason: RecomputeReason) {
  switch (reason) {
    case "miss":
      metricsForRoute.recomputeReasons.miss += 1;
      break;
    case "stale":
      metricsForRoute.recomputeReasons.stale += 1;
      break;
    case "version-mismatch":
      metricsForRoute.recomputeReasons.versionMismatch += 1;
      break;
    case "missing-meta":
      metricsForRoute.recomputeReasons.missingMeta += 1;
      break;
  }
}

export function recordRouteCacheOutcome(
  route: keyof CacheMetrics,
  outcome: {
    source: SerpSource | ScoreSource;
    recomputeReason: RecomputeReason | null;
  },
) {
  const routeMetrics = metrics[route];
  incrementSource(routeMetrics, outcome.source);

  if (outcome.recomputeReason) {
    incrementReason(routeMetrics, outcome.recomputeReason);
  }
}

export async function recordRouteCacheEvent(
  route: keyof CacheMetrics,
  outcome: {
    source: SerpSource | ScoreSource;
    recomputeReason: RecomputeReason | null;
  },
) {
  recordRouteCacheOutcome(route, outcome);

  await appendCacheObservabilityEvent({
    timestamp: new Date().toISOString(),
    route,
    source: outcome.source,
    recomputeReason: outcome.recomputeReason,
  });
}

export async function recordSnapshotInvalidationEvent(result: SnapshotInvalidationResult) {
  await appendCacheObservabilityEvent({
    timestamp: new Date().toISOString(),
    route: "debugSnapshotInvalidate",
    source: "manual-invalidation",
    recomputeReason: null,
    target: result.target,
    deleted: result.deleted,
  });
}

export function getRouteCacheMetrics() {
  return structuredClone(metrics);
}

export function resetRouteCacheMetrics() {
  metrics.serpAnalyze = createRouteMetrics();
  metrics.scoreContent = createRouteMetrics();
}
