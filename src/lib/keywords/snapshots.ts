import type { Prisma } from "@prisma/client";

import { getConfigErrorMessage } from "@/lib/env";
import { getPrismaClient } from "@/lib/db";
import {
  getSnapshotPolicyStatus,
  KEYWORD_SNAPSHOT_MAX_AGE_MS,
  KEYWORD_SNAPSHOT_VERSION,
  type SnapshotPolicyStatus,
} from "@/lib/persistence/policy";
import type { KeywordResearch } from "@/lib/serp/serper";

export interface KeywordSnapshotProvenance {
  computedAt: string;
  source: "fresh-analysis" | "memory-cache";
  version: string;
}

export interface KeywordSnapshotWriteOptions {
  source: KeywordSnapshotProvenance["source"];
  computedAt?: string;
}

export interface KeywordSnapshotResult {
  persisted: boolean;
  snapshotId?: string;
  reason?: string;
  provenance?: KeywordSnapshotProvenance;
}

export interface StoredKeywordSnapshot {
  snapshotId: string;
  research: KeywordResearch;
  policy: SnapshotPolicyStatus;
  provenance: KeywordSnapshotProvenance | null;
}

export type KeywordSnapshotLookupResult =
  | ({
      status: "hit";
    } & StoredKeywordSnapshot)
  | {
      status: "miss";
    }
  | {
      status: "invalid";
      reason: Exclude<SnapshotPolicyStatus["reason"], "fresh">;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function toStoredKeywordResearch(
  research: KeywordResearch,
  options: KeywordSnapshotWriteOptions,
): Prisma.InputJsonObject {
  const computedAt = options.computedAt ?? new Date().toISOString();

  return {
    meta: {
      storedAt: new Date().toISOString(),
      computedAt,
      source: options.source,
      version: KEYWORD_SNAPSHOT_VERSION,
    },
    keyword: research.keyword,
    topResults: research.topResults.map((result) => ({
      title: result.title,
      url: result.url,
      snippet: result.snippet,
    })),
    terms: {
      required: [...research.terms.required],
      recommended: [...research.terms.recommended],
      optional: [...research.terms.optional],
    },
    source: research.source,
  };
}

function toKeywordSnapshotProvenance(meta: Record<string, unknown> | null) {
  if (
    !meta ||
    typeof meta.computedAt !== "string" ||
    typeof meta.version !== "string" ||
    (meta.source !== "fresh-analysis" && meta.source !== "memory-cache")
  ) {
    return null;
  }

  return {
    computedAt: meta.computedAt,
    source: meta.source,
    version: meta.version,
  } satisfies KeywordSnapshotProvenance;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function toKeywordResearch(
  value: unknown,
): { research: KeywordResearch; policy: SnapshotPolicyStatus } | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const candidate = value as Record<string, unknown>;
  const meta = isRecord(candidate.meta) ? candidate.meta : null;
  const topResults = candidate.topResults;
  const terms = candidate.terms;
  const policy = getSnapshotPolicyStatus({
    storedAt: typeof meta?.storedAt === "string" ? meta.storedAt : null,
    storedVersion: typeof meta?.version === "string" ? meta.version : null,
    maxAgeMs: KEYWORD_SNAPSHOT_MAX_AGE_MS,
    currentVersion: KEYWORD_SNAPSHOT_VERSION,
  });

  if (
    typeof candidate.keyword !== "string" ||
    (candidate.source !== "heuristic" && candidate.source !== "configured") ||
    !Array.isArray(topResults) ||
    !terms ||
    typeof terms !== "object" ||
    Array.isArray(terms)
  ) {
    return null;
  }

  if (!policy.valid) {
    return {
      research: null as never,
      policy,
    };
  }

  const normalizedTopResults = [];

  for (const result of topResults) {
    if (!result || typeof result !== "object" || Array.isArray(result)) {
      return null;
    }

    const record = result as Record<string, unknown>;

    if (
      typeof record.title !== "string" ||
      typeof record.url !== "string" ||
      typeof record.snippet !== "string"
    ) {
      return null;
    }

    normalizedTopResults.push({
      title: record.title,
      url: record.url,
      snippet: record.snippet,
    });
  }

  const termRecord = terms as Record<string, unknown>;

  if (
    !isStringArray(termRecord.required) ||
    !isStringArray(termRecord.recommended) ||
    !isStringArray(termRecord.optional)
  ) {
    return null;
  }

  return {
    research: {
      keyword: candidate.keyword,
      topResults: normalizedTopResults,
      terms: {
        required: termRecord.required,
        recommended: termRecord.recommended,
        optional: termRecord.optional,
      },
      source: "heuristic",
    },
    policy,
  };
}

export async function persistKeywordSnapshot(
  research: KeywordResearch,
  options: KeywordSnapshotWriteOptions,
): Promise<KeywordSnapshotResult> {
  const client = getPrismaClient();
  const computedAt = options.computedAt ?? new Date().toISOString();

  if (!client) {
    return {
      persisted: false,
      reason: getConfigErrorMessage("DATABASE_URL"),
    };
  }

  const snapshot = await client.keyword.create({
    data: {
      query: research.keyword,
      serpData: toStoredKeywordResearch(research, {
        ...options,
        computedAt,
      }),
    },
    select: {
      id: true,
    },
  });

  return {
    persisted: true,
    snapshotId: snapshot.id,
    provenance: {
      computedAt,
      source: options.source,
      version: KEYWORD_SNAPSHOT_VERSION,
    },
  };
}

export async function readKeywordSnapshot(
  keyword: string,
): Promise<KeywordSnapshotLookupResult> {
  const client = getPrismaClient();

  if (!client) {
    return {
      status: "miss",
    };
  }

  const snapshot = await client.keyword.findFirst({
    where: {
      query: keyword.trim().toLowerCase(),
    },
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      serpData: true,
    },
  });

  if (!snapshot?.serpData) {
    return {
      status: "miss",
    };
  }

  const parsed = toKeywordResearch(snapshot.serpData);

  if (!parsed) {
    return {
      status: "miss",
    };
  }

  if (!parsed.policy.valid) {
    return {
      status: "invalid",
      reason: parsed.policy.reason as Exclude<SnapshotPolicyStatus["reason"], "fresh">,
    };
  }

  return {
    status: "hit",
    snapshotId: snapshot.id,
    research: parsed.research,
    policy: parsed.policy,
    provenance: toKeywordSnapshotProvenance(
      isRecord(snapshot.serpData) && isRecord(snapshot.serpData.meta)
        ? snapshot.serpData.meta
        : null,
    ),
  };
}
