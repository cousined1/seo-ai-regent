import { afterEach, describe, expect, it } from "vitest";

import { GET } from "@/app/api/debug/route";
import { withDebugAccess } from "@/lib/debug/responses";
import { toDebugAccessDeniedResponse } from "@/lib/debug/responses";
import { DEBUG_ROUTE_CONTRACTS } from "@/lib/debug/manifest";
import {
  resetCacheDebugRouteOverride,
  setCacheDebugRouteOverride,
} from "@/lib/observability/cache-log";
import { createSessionCookieHeader } from "../helpers/auth";

describe("debug manifest route", () => {
  afterEach(() => {
    resetCacheDebugRouteOverride();
  });

  it("rejects the manifest route when debug access is disabled", async () => {
    const response = await GET(new Request("http://localhost/api/debug"));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.reason).toBe("disabled");
  });

  it("uses the shared denied response envelope", async () => {
    const response = toDebugAccessDeniedResponse({
      ok: false,
      status: 401,
      reason: "auth-required",
      error: "Authentication required.",
    });
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload).toEqual({
      error: "Authentication required.",
      reason: "auth-required",
    });
  });

  it("uses the shared success wrapper to serialize an authorized payload", async () => {
    setCacheDebugRouteOverride(true);

    const response = await withDebugAccess(
      new Request("http://localhost/api/debug", {
        headers: {
          cookie: createSessionCookieHeader(),
        },
      }),
      () => ({
        ok: true,
        route: "debug",
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toEqual({
      ok: true,
      route: "debug",
    });
  });

  it("rejects the manifest route when the admin session is missing", async () => {
    setCacheDebugRouteOverride(true);

    const response = await GET(new Request("http://localhost/api/debug"));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.reason).toBe("auth-required");
  });

  it("returns the current guarded debug surfaces and their top-level contract fields", async () => {
    setCacheDebugRouteOverride(true);

    const response = await GET(
      new Request("http://localhost/api/debug", {
        headers: {
          cookie: createSessionCookieHeader(),
        },
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.namespace).toBe("debug");
    expect(payload.routes).toHaveLength(DEBUG_ROUTE_CONTRACTS.length);
    expect(payload.routes).toEqual([
      {
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
      },
      {
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
      },
      {
        path: "/api/debug/snapshots/invalidate",
        method: "POST",
        contractVersion: "snapshot-invalidation.v1",
        summary: "Invalidate persisted keyword or analysis snapshots for a keyword.",
        responseFields: ["target", "deleted"],
        responseSchema: {
          target: "object",
          deleted: "object",
        },
      },
    ]);
  });
});
