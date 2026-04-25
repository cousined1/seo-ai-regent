import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import {
  getRouteCacheMetrics,
  recordRouteCacheEvent,
  recordRouteCacheOutcome,
  resetRouteCacheMetrics,
} from "@/lib/observability/cache-metrics";
import {
  resetCacheObservabilityLogPath,
  resetCacheObservabilityLogRetentionOverride,
  setCacheObservabilityLogPath,
  setCacheObservabilityLogRetentionOverride,
} from "@/lib/observability/cache-log";

describe("route cache metrics", () => {
  let tempDir: string | null = null;

  afterEach(async () => {
    resetRouteCacheMetrics();
    resetCacheObservabilityLogPath();
    resetCacheObservabilityLogRetentionOverride();

    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it("tracks source and recompute counters per route", () => {
    resetRouteCacheMetrics();

    recordRouteCacheOutcome("serpAnalyze", {
      source: "fresh-analysis",
      recomputeReason: "stale",
    });
    recordRouteCacheOutcome("scoreContent", {
      source: "persisted-score-snapshot",
      recomputeReason: null,
    });

    const metrics = getRouteCacheMetrics();

    expect(metrics.serpAnalyze.sources.freshAnalysis).toBe(1);
    expect(metrics.serpAnalyze.recomputeReasons.stale).toBe(1);
    expect(metrics.scoreContent.sources.persistedScoreSnapshot).toBe(1);
    expect(metrics.scoreContent.recomputeReasons.stale).toBe(0);
  });

  it("persists structured cache events to a JSONL log", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "rankforge-cache-metrics-"));
    const logPath = path.join(tempDir, "cache-observability.jsonl");
    setCacheObservabilityLogPath(logPath);

    await recordRouteCacheEvent("serpAnalyze", {
      source: "fresh-analysis",
      recomputeReason: "stale",
    });

    const file = await readFile(logPath, "utf8");
    const [line] = file.trim().split("\n");
    const event = JSON.parse(line) as {
      route: string;
      source: string;
      recomputeReason: string | null;
    };

    expect(event.route).toBe("serpAnalyze");
    expect(event.source).toBe("fresh-analysis");
    expect(event.recomputeReason).toBe("stale");
  });

  it("keeps the log append-only and lets readers apply the retention window", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "rankforge-cache-prune-"));
    const logPath = path.join(tempDir, "cache-observability.jsonl");
    setCacheObservabilityLogPath(logPath);
    setCacheObservabilityLogRetentionOverride(2);

    await recordRouteCacheEvent("serpAnalyze", {
      source: "fresh-analysis",
      recomputeReason: "miss",
    });
    await recordRouteCacheEvent("serpAnalyze", {
      source: "fresh-analysis",
      recomputeReason: "stale",
    });
    await recordRouteCacheEvent("scoreContent", {
      source: "persisted-score-snapshot",
      recomputeReason: null,
    });

    const file = await readFile(logPath, "utf8");
    const lines = file.trim().split("\n").map((line) => JSON.parse(line) as { route: string; recomputeReason: string | null });

    expect(lines).toHaveLength(3);
    expect(lines[1]).toMatchObject({
      route: "serpAnalyze",
      recomputeReason: "stale",
    });
    expect(lines[2]).toMatchObject({
      route: "scoreContent",
      recomputeReason: null,
    });
  });
});
