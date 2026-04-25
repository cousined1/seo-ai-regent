import { createContentAnalysisCacheKey } from "@/lib/analysis/snapshots";
import { getPrismaClient } from "@/lib/db";
import { getConfigErrorMessage } from "@/lib/env";

export const DEBUG_SNAPSHOT_INVALIDATION_CONTRACT = {
  path: "/api/debug/snapshots/invalidate",
  method: "POST",
  contractVersion: "snapshot-invalidation.v1",
  summary: "Invalidate persisted keyword or analysis snapshots for a keyword.",
  responseFields: ["target", "deleted"],
  responseSchema: {
    target: "object",
    deleted: "object",
  },
} as const;

export interface SnapshotInvalidationInput {
  keyword: string;
  content?: string;
}

export interface SnapshotInvalidationResult {
  target: {
    keyword: string;
    scope: "keyword" | "analysis";
  };
  deleted: {
    keywordSnapshots: number;
    analysisSnapshots: number;
  };
}

export interface SnapshotInvalidationFailure {
  error: string;
  status: 503;
}

function normalizeKeywordVariants(keyword: string) {
  const trimmedKeyword = keyword.trim();
  const normalizedKeyword = trimmedKeyword.toLowerCase();

  return {
    trimmedKeyword,
    normalizedKeyword,
    keywordVariants: Array.from(new Set([trimmedKeyword, normalizedKeyword])),
  };
}

export async function invalidateSnapshots(
  input: SnapshotInvalidationInput,
): Promise<SnapshotInvalidationResult | SnapshotInvalidationFailure> {
  const client = getPrismaClient();

  if (!client) {
    return {
      error: getConfigErrorMessage("DATABASE_URL"),
      status: 503,
    };
  }

  const { trimmedKeyword, normalizedKeyword, keywordVariants } = normalizeKeywordVariants(
    input.keyword,
  );

  if (input.content?.trim()) {
    const deletedAnalysisSnapshots = await client.scoreSnapshot.deleteMany({
      where: {
        keyword: {
          in: keywordVariants,
        },
        contentHash: createContentAnalysisCacheKey(trimmedKeyword, input.content),
      },
    });

    return {
      target: {
        keyword: normalizedKeyword,
        scope: "analysis",
      },
      deleted: {
        keywordSnapshots: 0,
        analysisSnapshots: deletedAnalysisSnapshots.count,
      },
    };
  }

  const deletedKeywordSnapshots = await client.keyword.deleteMany({
    where: {
      query: normalizedKeyword,
    },
  });
  const deletedAnalysisSnapshots = await client.scoreSnapshot.deleteMany({
    where: {
      keyword: {
        in: keywordVariants,
      },
    },
  });

  return {
    target: {
      keyword: normalizedKeyword,
      scope: "keyword",
    },
    deleted: {
      keywordSnapshots: deletedKeywordSnapshots.count,
      analysisSnapshots: deletedAnalysisSnapshots.count,
    },
  };
}
