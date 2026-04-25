import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/debug/snapshots/invalidate/route";
import {
  resetCacheDebugRouteOverride,
  resetCacheObservabilityLogPath,
  setCacheDebugRouteOverride,
  setCacheObservabilityLogPath,
} from "@/lib/observability/cache-log";
import { createSessionCookieHeader } from "../helpers/auth";

const { getPrismaClientMock } = vi.hoisted(() => ({
  getPrismaClientMock: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  getPrismaClient: getPrismaClientMock,
}));

describe("debug snapshot invalidation route", () => {
  let tempDir: string | null = null;

  beforeEach(() => {
    getPrismaClientMock.mockReset();
  });

  afterEach(async () => {
    resetCacheDebugRouteOverride();
    resetCacheObservabilityLogPath();

    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
      tempDir = null;
    }
  });

  it("rejects the route when debug access is disabled", async () => {
    const response = await POST(
      new Request("http://localhost/api/debug/snapshots/invalidate", {
        method: "POST",
        headers: {
          origin: "http://localhost",
        },
        body: JSON.stringify({
          keyword: "content optimization strategies",
        }),
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.reason).toBe("disabled");
  });

  it("requires a keyword before attempting invalidation", async () => {
    setCacheDebugRouteOverride(true);

    const response = await POST(
      new Request("http://localhost/api/debug/snapshots/invalidate", {
        method: "POST",
        headers: {
          origin: "http://localhost",
          cookie: createSessionCookieHeader(),
        },
        body: JSON.stringify({}),
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload).toEqual({
      error: "keyword is required. Provide a keyword to invalidate persisted snapshots.",
    });
  });

  it("purges all persisted snapshots for a keyword when no content is provided", async () => {
    const keywordDeleteManyMock = vi.fn().mockResolvedValue({ count: 2 });
    const scoreDeleteManyMock = vi.fn().mockResolvedValue({ count: 5 });

    getPrismaClientMock.mockReturnValue({
      keyword: {
        deleteMany: keywordDeleteManyMock,
      },
      scoreSnapshot: {
        deleteMany: scoreDeleteManyMock,
      },
    });

    setCacheDebugRouteOverride(true);

    const response = await POST(
      new Request("http://localhost/api/debug/snapshots/invalidate", {
        method: "POST",
        headers: {
          origin: "http://localhost",
          cookie: createSessionCookieHeader(),
        },
        body: JSON.stringify({
          keyword: "Content Optimization Strategies",
        }),
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(keywordDeleteManyMock).toHaveBeenCalledWith({
      where: {
        query: "content optimization strategies",
      },
    });
    expect(scoreDeleteManyMock).toHaveBeenCalledWith({
      where: {
        keyword: {
          in: ["Content Optimization Strategies", "content optimization strategies"],
        },
      },
    });
    expect(payload).toEqual({
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

  it("purges only the exact score snapshot when content is provided", async () => {
    const keywordDeleteManyMock = vi.fn().mockResolvedValue({ count: 99 });
    const scoreDeleteManyMock = vi.fn().mockResolvedValue({ count: 1 });

    getPrismaClientMock.mockReturnValue({
      keyword: {
        deleteMany: keywordDeleteManyMock,
      },
      scoreSnapshot: {
        deleteMany: scoreDeleteManyMock,
      },
    });

    setCacheDebugRouteOverride(true);

    const response = await POST(
      new Request("http://localhost/api/debug/snapshots/invalidate", {
        method: "POST",
        headers: {
          origin: "http://localhost",
          cookie: createSessionCookieHeader(),
        },
        body: JSON.stringify({
          keyword: "Content Optimization Strategies",
          content: "Short exact content block",
        }),
      }),
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(keywordDeleteManyMock).not.toHaveBeenCalled();
    expect(scoreDeleteManyMock).toHaveBeenCalledWith({
      where: {
        keyword: {
          in: ["Content Optimization Strategies", "content optimization strategies"],
        },
        contentHash: expect.any(String),
      },
    });
    expect(payload).toEqual({
      target: {
        keyword: "content optimization strategies",
        scope: "analysis",
      },
      deleted: {
        keywordSnapshots: 0,
        analysisSnapshots: 1,
      },
    });
  });

  it("emits a structured invalidation event when a manual purge succeeds", async () => {
    tempDir = await mkdtemp(path.join(os.tmpdir(), "rankforge-snapshot-invalidation-"));
    setCacheObservabilityLogPath(path.join(tempDir, "cache-observability.jsonl"));

    const keywordDeleteManyMock = vi.fn().mockResolvedValue({ count: 2 });
    const scoreDeleteManyMock = vi.fn().mockResolvedValue({ count: 5 });

    getPrismaClientMock.mockReturnValue({
      keyword: {
        deleteMany: keywordDeleteManyMock,
      },
      scoreSnapshot: {
        deleteMany: scoreDeleteManyMock,
      },
    });

    setCacheDebugRouteOverride(true);

    const response = await POST(
      new Request("http://localhost/api/debug/snapshots/invalidate", {
        method: "POST",
        headers: {
          origin: "http://localhost",
          cookie: createSessionCookieHeader(),
        },
        body: JSON.stringify({
          keyword: "Content Optimization Strategies",
        }),
      }),
    );

    expect(response.status).toBe(200);

    const logFile = await readFile(path.join(tempDir, "cache-observability.jsonl"), "utf8");
    const [line] = logFile.trim().split("\n");
    const event = JSON.parse(line) as {
      route: string;
      source: string;
      recomputeReason: string | null;
      prevHash?: string | null;
      hash?: string;
      target?: {
        keyword: string;
        scope: string;
      };
      deleted?: {
        keywordSnapshots: number;
        analysisSnapshots: number;
      };
    };

    expect(event).toEqual({
      route: "debugSnapshotInvalidate",
      source: "manual-invalidation",
      recomputeReason: null,
      prevHash: null,
      target: {
        keyword: "content optimization strategies",
        scope: "keyword",
      },
      deleted: {
        keywordSnapshots: 2,
        analysisSnapshots: 5,
      },
      timestamp: expect.any(String),
      hash: expect.any(String),
    });
  });
});
