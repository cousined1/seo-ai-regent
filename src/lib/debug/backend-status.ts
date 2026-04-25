import { getDatabaseBoundary } from "@/lib/db";
import { getConfigErrorMessage, getServerEnv } from "@/lib/env";
import {
  ANALYSIS_SNAPSHOT_MAX_AGE_MS,
  ANALYSIS_SNAPSHOT_VERSION,
  KEYWORD_SNAPSHOT_MAX_AGE_MS,
  KEYWORD_SNAPSHOT_VERSION,
} from "@/lib/persistence/policy";
import {
  getCacheObservabilityRetentionLimit,
  isCacheDebugRouteEnabled,
} from "@/lib/observability/cache-log";

export const DEBUG_BACKEND_STATUS_CONTRACT = {
  path: "/api/debug/backend-status",
  method: "GET",
  contractVersion: "backend-status.v1",
  summary: "Safe backend readiness, policy, and observability status snapshot.",
  responseFields: ["persistence", "integrations", "snapshotPolicy", "observability"],
  responseSchema: {
    persistence: "object",
    integrations: "object",
    snapshotPolicy: "object",
    observability: "object",
  },
} as const;

export function getDebugBackendStatus() {
  const env = getServerEnv();
  const database = getDatabaseBoundary(env);

  return {
    persistence: {
      provider: database.provider,
      configured: database.configured,
      reason: database.reason,
    },
    integrations: {
      serper: {
        configured: Boolean(env.serperApiKey),
        reason: env.serperApiKey
          ? "SERPER_API_KEY is configured; Serper client is not yet wired and SERP analysis is served from the heuristic fallback."
          : getConfigErrorMessage("SERPER_API_KEY"),
      },
    },
    snapshotPolicy: {
      keyword: {
        version: KEYWORD_SNAPSHOT_VERSION,
        maxAgeMs: KEYWORD_SNAPSHOT_MAX_AGE_MS,
      },
      analysis: {
        version: ANALYSIS_SNAPSHOT_VERSION,
        maxAgeMs: ANALYSIS_SNAPSHOT_MAX_AGE_MS,
      },
    },
    observability: {
      debugRouteEnabled: isCacheDebugRouteEnabled(),
      logRetentionLines: getCacheObservabilityRetentionLimit(),
    },
  };
}
