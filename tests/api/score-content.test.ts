import { beforeEach, describe, expect, it, vi } from "vitest";

import { getRouteCacheMetrics, resetRouteCacheMetrics } from "@/lib/observability/cache-metrics";
import { clearSerpCache } from "@/lib/serp/cache";
import * as analysisSnapshotsModule from "@/lib/analysis/snapshots";
import * as serpModule from "@/lib/serp/serper";
import { POST } from "@/app/api/score/content/route";

describe("content score route", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    clearSerpCache();
    resetRouteCacheMetrics();
  });

  it("returns canonical score output and GEO reacts to citability", async () => {
    const request = new Request("http://localhost/api/score/content", {
      method: "POST",
      body: JSON.stringify({
        keyword: "content optimization strategies",
        content:
          "Content optimization strategies are editorial systems that improve rankings and AI-search visibility. According to Gartner's 2025 guidance, answer-first passages with explicit data improve retrieval quality, and teams that add citations and named entities make content more extractable for systems like ChatGPT and Perplexity.",
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(payload.contentScore.overall).toBeGreaterThan(0);
    expect(payload.geoScore.overall).toBeGreaterThan(0);
    expect(payload.contentBreakdown.length).toBeGreaterThan(0);
    expect(payload.geoBreakdown.length).toBeGreaterThan(0);
    expect(payload.topActions).toHaveLength(3);
    expect(payload.terms.required.length).toBeGreaterThan(0);
    expect(payload.terms.recommended.length).toBeGreaterThan(0);
    expect(payload.terms.optional.length).toBeGreaterThan(0);
    expect(payload.terms.required).toContain("content optimization");
    expect(payload.citability.totalScore).toBeGreaterThanOrEqual(60);
    expect(payload.geoScore.factualDensity).toBeGreaterThanOrEqual(60);
    expect(payload.analysis.persisted).toBe(false);
    expect(payload.observability).toEqual({
      analysisSource: "fresh-analysis",
      keywordSource: "fresh-analysis",
      recomputeReason: "miss",
    });
    expect(getRouteCacheMetrics().scoreContent.recomputeReasons.miss).toBe(1);
  });

  it("consumes shared SERP analysis internally for term buckets", async () => {
    vi.spyOn(serpModule, "analyzeKeyword").mockResolvedValue({
      keyword: "content optimization strategies",
      topResults: [
        {
          title: "content optimization strategies guide",
          url: "https://example.com/content-optimization-strategies",
          snippet: "Guide",
        },
      ],
      terms: {
        required: ["shared serp term"],
        recommended: ["retrieval pattern"],
        optional: ["supporting citation"],
      },
      source: "heuristic",
    });

    const request = new Request("http://localhost/api/score/content", {
      method: "POST",
      body: JSON.stringify({
        keyword: "content optimization strategies",
        content:
          "Content optimization strategies are editorial systems that improve rankings and AI-search visibility.",
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(serpModule.analyzeKeyword).toHaveBeenCalledWith("content optimization strategies");
    expect(payload.terms.required).toEqual(["shared serp term"]);
    expect(payload.terms.recommended).toEqual(["retrieval pattern"]);
    expect(payload.terms.optional).toEqual(["supporting citation"]);
  });

  it("reads a persisted score snapshot before recomputing on cold requests", async () => {
    vi.spyOn(analysisSnapshotsModule, "readContentAnalysisSnapshot").mockResolvedValue({
      status: "hit",
      snapshotId: "score_snapshot_123",
      analysis: {
        keyword: "content optimization strategies",
        contentScore: {
          overall: 91,
          termFrequency: 92,
          entityCoverage: 89,
          headingStructure: 90,
          wordCount: 88,
          readability: 93,
          internalLinks: 79,
          geoSignals: 87,
        },
        geoScore: {
          overall: 87,
          entityAuthority: 84,
          factualDensity: 88,
          answerFormat: 90,
          sourceCredibility: 85,
          freshness: 86,
        },
        citability: {
          wordCount: 36,
          totalScore: 88,
          grade: "A",
          label: "Highly Citable",
          breakdown: {
            answerBlockQuality: 29,
            selfContainment: 22,
            structuralReadability: 17,
            statisticalDensity: 12,
            uniquenessSignals: 8,
          },
          preview: "persisted preview",
        },
        contentBreakdown: [
          {
            signal: "termFrequency",
            score: 92,
            weight: 0.2,
            contribution: 18.4,
            status: "strong",
          },
        ],
        geoBreakdown: [
          {
            signal: "factualDensity",
            score: 88,
            weight: 0.24,
            contribution: 21.12,
            status: "strong",
          },
        ],
        terms: {
          required: ["persisted content term"],
          recommended: ["persisted recommended term"],
          optional: ["persisted optional term"],
        },
        topActions: [
          {
            area: "Content",
            signal: "internalLinks",
            title: "Add internal navigation paths",
            detail: "Persisted detail",
            lift: 3.1,
            liftLabel: "+3.1 Content pts",
          },
        ],
      },
      policy: {
        valid: true,
        reason: "fresh",
      },
      provenance: {
        computedAt: "2026-04-22T12:15:00.000Z",
        source: "fresh-analysis",
        version: "analysis-v1",
        pipeline: {
          analysisVersion: "analysis-v1",
          keywordVersion: "keyword-v1",
        },
        keywordSnapshot: {
          snapshotId: "kw_snapshot_456",
          computedAt: "2026-04-22T12:00:00.000Z",
          version: "keyword-v1",
          source: "memory-cache",
        },
      },
    });
    const analyzeSpy = vi.spyOn(serpModule, "analyzeKeyword");

    const request = new Request("http://localhost/api/score/content", {
      method: "POST",
      body: JSON.stringify({
        keyword: "content optimization strategies",
        content:
          "Content optimization strategies are editorial systems that improve rankings and AI-search visibility.",
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(analyzeSpy).not.toHaveBeenCalled();
    expect(payload.contentScore.overall).toBe(91);
    expect(payload.geoScore.overall).toBe(87);
    expect(payload.terms.required).toEqual(["persisted content term"]);
    expect(payload.analysis.persisted).toBe(true);
    expect(payload.analysis.snapshotId).toBe("score_snapshot_123");
    expect(payload.analysis.policy).toEqual({
      valid: true,
      reason: "fresh",
    });
    expect(payload.analysis.provenance).toEqual({
      computedAt: "2026-04-22T12:15:00.000Z",
      source: "fresh-analysis",
      version: "analysis-v1",
      pipeline: {
        analysisVersion: "analysis-v1",
        keywordVersion: "keyword-v1",
      },
      keywordSnapshot: {
        snapshotId: "kw_snapshot_456",
        computedAt: "2026-04-22T12:00:00.000Z",
        version: "keyword-v1",
        source: "memory-cache",
      },
    });
    expect(payload.observability).toEqual({
      analysisSource: "persisted-score-snapshot",
      keywordSource: null,
      recomputeReason: null,
    });
    expect(getRouteCacheMetrics().scoreContent.sources.persistedScoreSnapshot).toBe(1);
  });

  it("exposes version-mismatch when a stored score snapshot is bypassed", async () => {
    vi.spyOn(analysisSnapshotsModule, "readContentAnalysisSnapshot").mockResolvedValue({
      status: "invalid",
      reason: "version-mismatch",
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

    const request = new Request("http://localhost/api/score/content", {
      method: "POST",
      body: JSON.stringify({
        keyword: "content optimization strategies",
        content: "Fresh content block for recompute",
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.observability.recomputeReason).toBe("version-mismatch");
    expect(getRouteCacheMetrics().scoreContent.recomputeReasons.versionMismatch).toBe(1);
  });
});
