import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { GET } from "@/app/api/debug/cache-metrics/route";
import {
  recordRouteCacheEvent,
  recordSnapshotInvalidationEvent,
  resetRouteCacheMetrics,
} from "@/lib/observability/cache-metrics";
import {
  resetCacheDebugRouteOverride,
  resetCacheObservabilityLogPath,
  setCacheDebugRouteOverride,
  setCacheObservabilityLogPath,
} from "@/lib/observability/cache-log";
import { createSessionCookieHeader } from "../helpers/auth";

describe("debug cache metrics route", () => {
  let tempDir: string | null = null;

  afterEach(async () => {
    resetRouteCacheMetrics();
    resetCacheObservabilityLogPath();
    resetCacheDebugRouteOverride();

    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it("rejects the debug route by default when not explicitly enabled", async () => {
    const response = await GET(new Request("http://localhost/api/debug/cache-metrics"));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.error).toMatch(/not enabled/i);
    expect(payload.reason).toBe("disabled");
  });

  it("rejects the debug route when the admin session is missing", async () => {
    setCacheDebugRouteOverride(true);

    const response = await GET(new Request("http://localhost/api/debug/cache-metrics"));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toMatch(/authentication required/i);
    expect(payload.reason).toBe("auth-required");
  });

  it("returns in-process metrics plus recent persisted events when the admin session is valid", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "rankforge-debug-metrics-"));
    setCacheObservabilityLogPath(path.join(tempDir, "cache-observability.jsonl"));
    setCacheDebugRouteOverride(true);

    await recordRouteCacheEvent("scoreContent", {
      source: "persisted-score-snapshot",
      recomputeReason: null,
    });

    const response = await GET(
      new Request("http://localhost/api/debug/cache-metrics", {
        headers: {
          cookie: createSessionCookieHeader(),
        },
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.metrics.scoreContent.sources.persistedScoreSnapshot).toBe(1);
    expect(payload.recentEvents).toHaveLength(1);
    expect(payload.recentEvents[0]).toMatchObject({
      route: "scoreContent",
      source: "persisted-score-snapshot",
      recomputeReason: null,
    });
  });

  it("returns invalidation events with target and deleted counts in recent events", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "rankforge-debug-metrics-"));
    setCacheObservabilityLogPath(path.join(tempDir, "cache-observability.jsonl"));
    setCacheDebugRouteOverride(true);

    await recordSnapshotInvalidationEvent({
      target: {
        keyword: "content optimization strategies",
        scope: "keyword",
      },
      deleted: {
        keywordSnapshots: 2,
        analysisSnapshots: 5,
      },
    });

    const response = await GET(
      new Request("http://localhost/api/debug/cache-metrics", {
        headers: {
          cookie: createSessionCookieHeader(),
        },
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.recentEvents).toHaveLength(1);
    expect(payload.recentEvents[0]).toMatchObject({
      route: "debugSnapshotInvalidate",
      source: "manual-invalidation",
      recomputeReason: null,
      target: {
        keyword: "content optimization strategies",
        scope: "keyword",
      },
      deleted: {
        keywordSnapshots: 2,
        analysisSnapshots: 5,
      },
    });
  });
});
