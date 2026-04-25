export const DEBUG_CACHE_METRICS_CONTRACT = {
  path: "/api/debug/cache-metrics",
  method: "GET",
  contractVersion: "cache-metrics.v2",
  summary: "Live cache metrics plus recent persisted cache events.",
  responseFields: ["metrics", "recentEvents"],
  responseSchema: {
    metrics: "object",
    recentEvents: {
      type: "array",
      item: {
        timestamp: "string",
        route: ["serpAnalyze", "scoreContent", "debugSnapshotInvalidate"],
        source: [
          "memory-cache",
          "persisted-keyword-snapshot",
          "persisted-score-snapshot",
          "fresh-analysis",
          "manual-invalidation",
        ],
        recomputeReason: [
          "miss",
          "stale",
          "version-mismatch",
          "missing-meta",
          null,
        ],
        target: {
          type: "object|optional",
          fields: {
            keyword: "string",
            scope: ["keyword", "analysis"],
          },
        },
        deleted: {
          type: "object|optional",
          fields: {
            keywordSnapshots: "number",
            analysisSnapshots: "number",
          },
        },
      },
    },
  },
} as const;
