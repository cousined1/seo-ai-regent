import { beforeEach, describe, expect, it, vi } from "vitest";

const getPrismaClientMock = vi.fn();

vi.mock("@/lib/db", () => ({
  getPrismaClient: getPrismaClientMock,
}));

describe("content analysis snapshot persistence", () => {
  beforeEach(() => {
    getPrismaClientMock.mockReset();
  });

  it("returns an explicit non-persisted result when Prisma is unavailable", async () => {
    getPrismaClientMock.mockReturnValue(null);

    const { persistContentAnalysisSnapshot } = await import("@/lib/analysis/snapshots");

    const result = await persistContentAnalysisSnapshot(
      {
        keyword: "content optimization strategies",
        content: "short persisted content block",
        contentScore: {
          overall: 74,
          termFrequency: 78,
          entityCoverage: 68,
          headingStructure: 62,
          wordCount: 80,
          readability: 84,
          internalLinks: 35,
          geoSignals: 58,
        },
        geoScore: {
          overall: 64,
          entityAuthority: 61,
          factualDensity: 48,
          answerFormat: 75,
          sourceCredibility: 66,
          freshness: 52,
        },
        citability: {
          wordCount: 24,
          totalScore: 52,
          grade: "C",
          label: "Moderate Citability",
          breakdown: {
            answerBlockQuality: 18,
            selfContainment: 14,
            structuralReadability: 10,
            statisticalDensity: 6,
            uniquenessSignals: 4,
          },
          preview: "persisted preview",
        },
        contentBreakdown: [],
        geoBreakdown: [],
        terms: {
          required: ["content optimization"],
          recommended: ["search intent"],
          optional: ["internal links"],
        },
        topActions: [],
      },
      {
        source: "fresh-analysis",
      },
    );

    expect(result.persisted).toBe(false);
    expect(result.reason).toMatch(/database_url/i);
  });

  it("writes a content analysis snapshot through Prisma when the client is available", async () => {
    const createMock = vi.fn().mockResolvedValue({
      id: "score_snapshot_123",
    });

    getPrismaClientMock.mockReturnValue({
      scoreSnapshot: {
        create: createMock,
      },
    });

    const { persistContentAnalysisSnapshot } = await import("@/lib/analysis/snapshots");
    type ContentAnalysisSnapshotPayload = Parameters<typeof persistContentAnalysisSnapshot>[0];

    const payload: ContentAnalysisSnapshotPayload = {
      keyword: "content optimization strategies",
      content: "short persisted content block",
      contentScore: {
        overall: 74,
        termFrequency: 78,
        entityCoverage: 68,
        headingStructure: 62,
        wordCount: 80,
        readability: 84,
        internalLinks: 35,
        geoSignals: 58,
      },
      geoScore: {
        overall: 64,
        entityAuthority: 61,
        factualDensity: 48,
        answerFormat: 75,
        sourceCredibility: 66,
        freshness: 52,
      },
      citability: {
        wordCount: 24,
        totalScore: 52,
        grade: "C",
        label: "Moderate Citability",
        breakdown: {
          answerBlockQuality: 18,
          selfContainment: 14,
          structuralReadability: 10,
          statisticalDensity: 6,
          uniquenessSignals: 4,
        },
        preview: "persisted preview",
      },
      contentBreakdown: [],
      geoBreakdown: [],
      terms: {
        required: ["content optimization"],
        recommended: ["search intent"],
        optional: ["internal links"],
      },
      topActions: [],
    };

    const result = await persistContentAnalysisSnapshot(payload, {
      source: "fresh-analysis",
      keywordSnapshot: {
        snapshotId: "kw_snapshot_456",
        computedAt: "2026-04-22T12:00:00.000Z",
        version: "keyword-v1",
        source: "memory-cache",
      },
    });

    expect(createMock).toHaveBeenCalledWith({
      data: {
        keyword: "content optimization strategies",
        contentHash: expect.any(String),
        resultData: expect.objectContaining({
          meta: expect.objectContaining({
            version: "analysis-v1",
            source: "fresh-analysis",
            computedAt: expect.any(String),
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
          }),
        }),
      },
      select: {
        id: true,
      },
    });
    expect(result).toEqual({
      persisted: true,
      snapshotId: "score_snapshot_123",
      provenance: {
        computedAt: expect.any(String),
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
  });

  it("loads the latest stored content analysis snapshot by keyword and content hash", async () => {
    const findFirstMock = vi.fn().mockResolvedValue({
      id: "score_snapshot_456",
      resultData: {
        meta: {
          storedAt: new Date().toISOString(),
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
        keyword: "content optimization strategies",
        contentScore: {
          overall: 88,
          termFrequency: 90,
          entityCoverage: 84,
          headingStructure: 86,
          wordCount: 82,
          readability: 85,
          internalLinks: 77,
          geoSignals: 79,
        },
        geoScore: {
          overall: 81,
          entityAuthority: 80,
          factualDensity: 82,
          answerFormat: 79,
          sourceCredibility: 83,
          freshness: 78,
        },
        citability: {
          wordCount: 30,
          totalScore: 77,
          grade: "B",
          label: "Good Citability",
          breakdown: {
            answerBlockQuality: 25,
            selfContainment: 18,
            structuralReadability: 15,
            statisticalDensity: 11,
            uniquenessSignals: 8,
          },
          preview: "persisted preview",
        },
        contentBreakdown: [],
        geoBreakdown: [],
        terms: {
          required: ["persisted term"],
          recommended: ["persisted recommendation"],
          optional: ["persisted optional"],
        },
        topActions: [],
      },
    });

    getPrismaClientMock.mockReturnValue({
      scoreSnapshot: {
        findFirst: findFirstMock,
      },
    });

    const {
      createContentAnalysisCacheKey,
      readContentAnalysisSnapshot,
    } = await import("@/lib/analysis/snapshots");

    const keyword = "content optimization strategies";
    const content = "short persisted content block";

    const result = await readContentAnalysisSnapshot(keyword, content);

    expect(findFirstMock).toHaveBeenCalledWith({
      where: {
        keyword,
        contentHash: createContentAnalysisCacheKey(keyword, content),
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        resultData: true,
      },
    });
    expect(result).toMatchObject({
      status: "hit",
      snapshotId: "score_snapshot_456",
    });
    expect(result?.status === "hit" ? result.analysis.contentScore.overall : null).toBe(88);
    expect(result?.status === "hit" ? result.policy : null).toEqual({
      valid: true,
      reason: "fresh",
    });
    expect(result?.status === "hit" ? result.provenance : null).toEqual({
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
  });

  it("rejects stored content analysis snapshots when the version no longer matches", async () => {
    const findFirstMock = vi.fn().mockResolvedValue({
      id: "score_snapshot_999",
      resultData: {
        meta: {
          storedAt: new Date().toISOString(),
          version: "analysis-v0",
        },
        keyword: "content optimization strategies",
        contentScore: {
          overall: 88,
          termFrequency: 90,
          entityCoverage: 84,
          headingStructure: 86,
          wordCount: 82,
          readability: 85,
          internalLinks: 77,
          geoSignals: 79,
        },
        geoScore: {
          overall: 81,
          entityAuthority: 80,
          factualDensity: 82,
          answerFormat: 79,
          sourceCredibility: 83,
          freshness: 78,
        },
        citability: {
          wordCount: 30,
          totalScore: 77,
          grade: "B",
          label: "Good Citability",
          breakdown: {
            answerBlockQuality: 25,
            selfContainment: 18,
            structuralReadability: 15,
            statisticalDensity: 11,
            uniquenessSignals: 8,
          },
          preview: "persisted preview",
        },
        contentBreakdown: [],
        geoBreakdown: [],
        terms: {
          required: ["persisted term"],
          recommended: ["persisted recommendation"],
          optional: ["persisted optional"],
        },
        topActions: [],
      },
    });

    getPrismaClientMock.mockReturnValue({
      scoreSnapshot: {
        findFirst: findFirstMock,
      },
    });

    const { readContentAnalysisSnapshot } = await import("@/lib/analysis/snapshots");

    const result = await readContentAnalysisSnapshot(
      "content optimization strategies",
      "short persisted content block",
    );

    expect(result).toEqual({
      status: "invalid",
      reason: "version-mismatch",
    });
  });

  it("keeps older content analysis snapshots readable when provenance metadata is missing", async () => {
    const findFirstMock = vi.fn().mockResolvedValue({
      id: "score_snapshot_legacy",
      resultData: {
        meta: {
          storedAt: new Date().toISOString(),
          version: "analysis-v1",
        },
        keyword: "content optimization strategies",
        contentScore: {
          overall: 88,
          termFrequency: 90,
          entityCoverage: 84,
          headingStructure: 86,
          wordCount: 82,
          readability: 85,
          internalLinks: 77,
          geoSignals: 79,
        },
        geoScore: {
          overall: 81,
          entityAuthority: 80,
          factualDensity: 82,
          answerFormat: 79,
          sourceCredibility: 83,
          freshness: 78,
        },
        citability: {
          wordCount: 30,
          totalScore: 77,
          grade: "B",
          label: "Good Citability",
          breakdown: {
            answerBlockQuality: 25,
            selfContainment: 18,
            structuralReadability: 15,
            statisticalDensity: 11,
            uniquenessSignals: 8,
          },
          preview: "persisted preview",
        },
        contentBreakdown: [],
        geoBreakdown: [],
        terms: {
          required: ["persisted term"],
          recommended: ["persisted recommendation"],
          optional: ["persisted optional"],
        },
        topActions: [],
      },
    });

    getPrismaClientMock.mockReturnValue({
      scoreSnapshot: {
        findFirst: findFirstMock,
      },
    });

    const { readContentAnalysisSnapshot } = await import("@/lib/analysis/snapshots");

    const result = await readContentAnalysisSnapshot(
      "content optimization strategies",
      "short persisted content block",
    );

    expect(result).toMatchObject({
      status: "hit",
      snapshotId: "score_snapshot_legacy",
      provenance: null,
    });
  });
});
