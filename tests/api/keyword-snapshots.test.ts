import { beforeEach, describe, expect, it, vi } from "vitest";

import type { KeywordResearch } from "@/lib/serp/serper";

const getPrismaClientMock = vi.fn();

vi.mock("@/lib/db", () => ({
  getPrismaClient: getPrismaClientMock,
}));

describe("keyword snapshot persistence", () => {
  beforeEach(() => {
    getPrismaClientMock.mockReset();
  });

  it("returns an explicit non-persisted result when Prisma is unavailable", async () => {
    getPrismaClientMock.mockReturnValue(null);

    const { persistKeywordSnapshot } = await import("@/lib/keywords/snapshots");

    const result = await persistKeywordSnapshot(
      {
        keyword: "content optimization strategies",
        topResults: [],
        terms: {
          required: ["content optimization"],
          recommended: ["search intent"],
          optional: ["internal links"],
        },
        source: "heuristic",
      },
      {
        source: "fresh-analysis",
      },
    );

    expect(result.persisted).toBe(false);
    expect(result.reason).toMatch(/database_url/i);
  });

  it("writes a keyword snapshot through Prisma when the client is available", async () => {
    const createMock = vi.fn().mockResolvedValue({
      id: "kw_snapshot_123",
    });

    getPrismaClientMock.mockReturnValue({
      keyword: {
        create: createMock,
      },
    });

    const { persistKeywordSnapshot } = await import("@/lib/keywords/snapshots");

    const research: KeywordResearch = {
      keyword: "content optimization strategies",
      topResults: [
        {
          title: "content optimization strategies guide",
          url: "https://example.com/content-optimization-strategies",
          snippet: "Guide",
        },
      ],
      terms: {
        required: ["content optimization"],
        recommended: ["retrieval pattern"],
        optional: ["supporting citation"],
      },
      source: "heuristic",
    };

    const result = await persistKeywordSnapshot(research, {
      source: "fresh-analysis",
    });

    expect(createMock).toHaveBeenCalledWith({
      data: {
        query: "content optimization strategies",
        serpData: {
          meta: expect.objectContaining({
            version: "keyword-v1",
            source: "fresh-analysis",
            computedAt: expect.any(String),
          }),
          keyword: "content optimization strategies",
          topResults: research.topResults,
          terms: research.terms,
          source: research.source,
        },
      },
      select: {
        id: true,
      },
    });
    expect(result).toEqual({
      persisted: true,
      snapshotId: "kw_snapshot_123",
      provenance: {
        computedAt: expect.any(String),
        source: "fresh-analysis",
        version: "keyword-v1",
      },
    });
  });

  it("loads the latest stored keyword snapshot before recomputing", async () => {
    const findFirstMock = vi.fn().mockResolvedValue({
      id: "kw_snapshot_456",
      serpData: {
        meta: {
          storedAt: new Date().toISOString(),
          computedAt: "2026-04-22T12:00:00.000Z",
          source: "memory-cache",
          version: "keyword-v1",
        },
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
    });

    getPrismaClientMock.mockReturnValue({
      keyword: {
        findFirst: findFirstMock,
      },
    });

    const { readKeywordSnapshot } = await import("@/lib/keywords/snapshots");

    const result = await readKeywordSnapshot("content optimization strategies");

    expect(findFirstMock).toHaveBeenCalledWith({
      where: {
        query: "content optimization strategies",
      },
      orderBy: {
        updatedAt: "desc",
      },
      select: {
        id: true,
        serpData: true,
      },
    });
    expect(result).toEqual({
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
  });

  it("keeps older keyword snapshots readable when provenance metadata is missing", async () => {
    const findFirstMock = vi.fn().mockResolvedValue({
      id: "kw_snapshot_legacy",
      serpData: {
        meta: {
          storedAt: new Date().toISOString(),
          version: "keyword-v1",
        },
        keyword: "content optimization strategies",
        topResults: [],
        terms: {
          required: ["persisted term"],
          recommended: ["persisted recommendation"],
          optional: ["persisted optional"],
        },
        source: "heuristic",
      },
    });

    getPrismaClientMock.mockReturnValue({
      keyword: {
        findFirst: findFirstMock,
      },
    });

    const { readKeywordSnapshot } = await import("@/lib/keywords/snapshots");

    const result = await readKeywordSnapshot("content optimization strategies");

    expect(result).toEqual({
      status: "hit",
      snapshotId: "kw_snapshot_legacy",
      research: {
        keyword: "content optimization strategies",
        topResults: [],
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
      provenance: null,
    });
  });

  it("rejects stored keyword snapshots when policy marks them stale", async () => {
    const findFirstMock = vi.fn().mockResolvedValue({
      id: "kw_snapshot_789",
      serpData: {
        meta: {
          storedAt: "2020-01-01T00:00:00.000Z",
          version: "keyword-v1",
        },
        keyword: "content optimization strategies",
        topResults: [],
        terms: {
          required: ["persisted term"],
          recommended: ["persisted recommendation"],
          optional: ["persisted optional"],
        },
        source: "heuristic",
      },
    });

    getPrismaClientMock.mockReturnValue({
      keyword: {
        findFirst: findFirstMock,
      },
    });

    const { readKeywordSnapshot } = await import("@/lib/keywords/snapshots");

    const result = await readKeywordSnapshot("content optimization strategies");

    expect(result).toEqual({
      status: "invalid",
      reason: "stale",
    });
  });
});
