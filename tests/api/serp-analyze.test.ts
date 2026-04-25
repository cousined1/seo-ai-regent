import { beforeEach, describe, expect, it, vi } from "vitest";

import { getRouteCacheMetrics, resetRouteCacheMetrics } from "@/lib/observability/cache-metrics";
import { clearSerpCache } from "@/lib/serp/cache";
import * as serpModule from "@/lib/serp/serper";
import * as snapshotsModule from "@/lib/keywords/snapshots";
import { POST } from "@/app/api/serp/analyze/route";

describe("serp analyze route", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearSerpCache();
    resetRouteCacheMetrics();
  });

  it("returns normalized keyword research with term buckets", async () => {
    const request = new Request("http://localhost/api/serp/analyze", {
      method: "POST",
      body: JSON.stringify({
        keyword: "content optimization strategies",
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.keyword).toBe("content optimization strategies");
    expect(Array.isArray(payload.topResults)).toBe(true);
    expect(payload.terms.required).toContain("content optimization");
    expect(payload.terms.recommended.length).toBeGreaterThan(0);
    expect(payload.terms.optional.length).toBeGreaterThan(0);
    expect(payload.cache.status).toMatch(/miss|hit|snapshot/i);
    expect(payload.snapshot.persisted).toBe(false);
    expect(payload.snapshot.reason).toMatch(/database_url/i);
    expect(payload.observability).toEqual({
      source: "fresh-analysis",
      recomputeReason: "miss",
    });
    expect(getRouteCacheMetrics().serpAnalyze.recomputeReasons.miss).toBe(1);
  });

  it("reads from persisted snapshots before recomputing when memory cache misses", async () => {
    vi.spyOn(snapshotsModule, "readKeywordSnapshot").mockResolvedValue({
      status: "hit",
      snapshotId: "kw_snapshot_456",
      research: {
        keyword: "content optimization strategies",
        topResults: [
          {
            title: "Persisted guide",
            url: "https://example.com/persisted-guide",
            snippet: "Persisted snippet",
          },
        ],
        terms: {
          required: ["persisted term"],
          recommended: ["persisted recommendation"],
          optional: ["persisted optional"],
        },
        source: "heuristic",
      },
      policy: {
        valid: true,
        reason: "fresh",
      },
      provenance: {
        computedAt: "2026-04-22T12:00:00.000Z",
        source: "memory-cache",
        version: "keyword-v1",
      },
    });
    const analyzeSpy = vi.spyOn(serpModule, "analyzeKeyword");

    const request = new Request("http://localhost/api/serp/analyze", {
      method: "POST",
      body: JSON.stringify({
        keyword: "content optimization strategies",
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(analyzeSpy).not.toHaveBeenCalled();
    expect(payload.topResults[0].title).toBe("Persisted guide");
    expect(payload.terms.required).toEqual(["persisted term"]);
    expect(payload.cache.status).toBe("snapshot");
    expect(payload.snapshot.persisted).toBe(true);
    expect(payload.snapshot.snapshotId).toBe("kw_snapshot_456");
    expect(payload.snapshot.policy).toEqual({
      valid: true,
      reason: "fresh",
    });
    expect(payload.snapshot.provenance).toEqual({
      computedAt: "2026-04-22T12:00:00.000Z",
      source: "memory-cache",
      version: "keyword-v1",
    });
    expect(payload.observability).toEqual({
      source: "persisted-keyword-snapshot",
      recomputeReason: null,
    });
    expect(getRouteCacheMetrics().serpAnalyze.sources.persistedKeywordSnapshot).toBe(1);
  });

  it("exposes stale as the recompute reason when a stored keyword snapshot is rejected", async () => {
    vi.spyOn(snapshotsModule, "readKeywordSnapshot").mockResolvedValue({
      status: "invalid",
      reason: "stale",
    });
    vi.spyOn(serpModule, "analyzeKeyword").mockResolvedValue({
      keyword: "content optimization strategies",
      topResults: [],
      terms: {
        required: ["fresh term"],
        recommended: ["fresh recommendation"],
        optional: ["fresh optional"],
      },
      source: "heuristic",
    });

    const request = new Request("http://localhost/api/serp/analyze", {
      method: "POST",
      body: JSON.stringify({
        keyword: "content optimization strategies",
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.observability).toEqual({
      source: "fresh-analysis",
      recomputeReason: "stale",
    });
    expect(getRouteCacheMetrics().serpAnalyze.recomputeReasons.stale).toBe(1);
  });

  it("returns a clear validation error when keyword is missing", async () => {
    const request = new Request("http://localhost/api/serp/analyze", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toMatch(/keyword is required/i);
  });
});
