import crypto from "node:crypto";

import type { Prisma } from "@prisma/client";

import { getPrismaClient } from "@/lib/db";
import { getConfigErrorMessage } from "@/lib/env";
import {
  ANALYSIS_SNAPSHOT_MAX_AGE_MS,
  ANALYSIS_SNAPSHOT_VERSION,
  KEYWORD_SNAPSHOT_VERSION,
  getSnapshotPolicyStatus,
  type SnapshotPolicyStatus,
} from "@/lib/persistence/policy";
import type { CitabilityScore } from "@/lib/scoring/citability";
import type {
  ContentScore,
  GeoScore,
  ScoreBreakdownItem,
  TermsBuckets,
  TopAction,
} from "@/lib/scoring/types";

export interface ContentAnalysisSnapshotPayload {
  keyword: string;
  content: string;
  contentScore: ContentScore;
  geoScore: GeoScore;
  citability: CitabilityScore;
  contentBreakdown: ScoreBreakdownItem[];
  geoBreakdown: ScoreBreakdownItem[];
  terms: TermsBuckets;
  topActions: TopAction[];
}

export interface ContentAnalysisSnapshotKeywordProvenance {
  snapshotId: string;
  computedAt: string;
  version: string;
  source: "fresh-analysis" | "memory-cache";
}

export interface ContentAnalysisSnapshotProvenance {
  computedAt: string;
  source: "fresh-analysis";
  version: string;
  pipeline: {
    analysisVersion: string;
    keywordVersion: string;
  };
  keywordSnapshot: ContentAnalysisSnapshotKeywordProvenance | null;
}

export interface ContentAnalysisSnapshotWriteOptions {
  source: ContentAnalysisSnapshotProvenance["source"];
  computedAt?: string;
  keywordSnapshot?: ContentAnalysisSnapshotKeywordProvenance | null;
}

export interface ContentAnalysisSnapshotResult {
  persisted: boolean;
  snapshotId?: string;
  reason?: string;
  provenance?: ContentAnalysisSnapshotProvenance;
}

export interface StoredContentAnalysisSnapshot {
  snapshotId: string;
  analysis: Omit<ContentAnalysisSnapshotPayload, "content">;
  policy: SnapshotPolicyStatus;
  provenance: ContentAnalysisSnapshotProvenance | null;
}

export type ContentAnalysisSnapshotLookupResult =
  | ({
      status: "hit";
    } & StoredContentAnalysisSnapshot)
  | {
      status: "miss";
    }
  | {
      status: "invalid";
      reason: Exclude<SnapshotPolicyStatus["reason"], "fresh">;
    };

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((entry) => typeof entry === "string");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isBreakdownItem(value: unknown): value is ScoreBreakdownItem {
  return (
    isRecord(value) &&
    typeof value.signal === "string" &&
    typeof value.score === "number" &&
    typeof value.weight === "number" &&
    typeof value.contribution === "number" &&
    (value.status === "critical" || value.status === "warning" || value.status === "strong")
  );
}

function isTopAction(value: unknown): value is TopAction {
  return (
    isRecord(value) &&
    (value.area === "Content" || value.area === "GEO") &&
    typeof value.signal === "string" &&
    typeof value.title === "string" &&
    typeof value.detail === "string" &&
    typeof value.lift === "number" &&
    typeof value.liftLabel === "string"
  );
}

function isContentScore(value: unknown): value is ContentScore {
  return (
    isRecord(value) &&
    typeof value.overall === "number" &&
    typeof value.termFrequency === "number" &&
    typeof value.entityCoverage === "number" &&
    typeof value.headingStructure === "number" &&
    typeof value.wordCount === "number" &&
    typeof value.readability === "number" &&
    typeof value.internalLinks === "number" &&
    typeof value.geoSignals === "number"
  );
}

function isGeoScore(value: unknown): value is GeoScore {
  return (
    isRecord(value) &&
    typeof value.overall === "number" &&
    typeof value.entityAuthority === "number" &&
    typeof value.factualDensity === "number" &&
    typeof value.answerFormat === "number" &&
    typeof value.sourceCredibility === "number" &&
    typeof value.freshness === "number"
  );
}

function isCitabilityScore(value: unknown): value is CitabilityScore {
  return (
    isRecord(value) &&
    typeof value.wordCount === "number" &&
    typeof value.totalScore === "number" &&
    ["A", "B", "C", "D", "F"].includes(String(value.grade)) &&
    typeof value.label === "string" &&
    typeof value.preview === "string" &&
    isRecord(value.breakdown) &&
    typeof value.breakdown.answerBlockQuality === "number" &&
    typeof value.breakdown.selfContainment === "number" &&
    typeof value.breakdown.structuralReadability === "number" &&
    typeof value.breakdown.statisticalDensity === "number" &&
    typeof value.breakdown.uniquenessSignals === "number"
  );
}

function isTermsBuckets(value: unknown): value is TermsBuckets {
  return (
    isRecord(value) &&
    isStringArray(value.required) &&
    isStringArray(value.recommended) &&
    isStringArray(value.optional)
  );
}

function toStoredAnalysis(
  payload: ContentAnalysisSnapshotPayload,
  options: ContentAnalysisSnapshotWriteOptions,
): Prisma.InputJsonObject {
  const computedAt = options.computedAt ?? new Date().toISOString();

  return {
    meta: {
      storedAt: new Date().toISOString(),
      computedAt,
      source: options.source,
      version: ANALYSIS_SNAPSHOT_VERSION,
      pipeline: {
        analysisVersion: ANALYSIS_SNAPSHOT_VERSION,
        keywordVersion: KEYWORD_SNAPSHOT_VERSION,
      },
      keywordSnapshot: options.keywordSnapshot
        ? ({
            snapshotId: options.keywordSnapshot.snapshotId,
            computedAt: options.keywordSnapshot.computedAt,
            version: options.keywordSnapshot.version,
            source: options.keywordSnapshot.source,
          } satisfies Prisma.InputJsonObject)
        : null,
    },
    keyword: payload.keyword,
    contentScore: {
      ...payload.contentScore,
    },
    geoScore: {
      ...payload.geoScore,
    },
    citability: {
      wordCount: payload.citability.wordCount,
      totalScore: payload.citability.totalScore,
      grade: payload.citability.grade,
      label: payload.citability.label,
      preview: payload.citability.preview,
      breakdown: {
        ...payload.citability.breakdown,
      },
    },
    contentBreakdown: payload.contentBreakdown.map((item) => ({
      ...item,
    })),
    geoBreakdown: payload.geoBreakdown.map((item) => ({
      ...item,
    })),
    terms: {
      required: [...payload.terms.required],
      recommended: [...payload.terms.recommended],
      optional: [...payload.terms.optional],
    },
    topActions: payload.topActions.map((action) => ({
      ...action,
    })),
  };
}

function toKeywordSnapshotProvenance(
  value: unknown,
): ContentAnalysisSnapshotKeywordProvenance | null {
  if (
    !isRecord(value) ||
    typeof value.snapshotId !== "string" ||
    typeof value.computedAt !== "string" ||
    typeof value.version !== "string" ||
    (value.source !== "fresh-analysis" && value.source !== "memory-cache")
  ) {
    return null;
  }

  return {
    snapshotId: value.snapshotId,
    computedAt: value.computedAt,
    version: value.version,
    source: value.source,
  };
}

function toContentAnalysisSnapshotProvenance(
  meta: Record<string, unknown> | null,
): ContentAnalysisSnapshotProvenance | null {
  if (
    !meta ||
    typeof meta.computedAt !== "string" ||
    meta.source !== "fresh-analysis" ||
    typeof meta.version !== "string" ||
    !isRecord(meta.pipeline) ||
    typeof meta.pipeline.analysisVersion !== "string" ||
    typeof meta.pipeline.keywordVersion !== "string"
  ) {
    return null;
  }

  return {
    computedAt: meta.computedAt,
    source: meta.source,
    version: meta.version,
    pipeline: {
      analysisVersion: meta.pipeline.analysisVersion,
      keywordVersion: meta.pipeline.keywordVersion,
    },
    keywordSnapshot: toKeywordSnapshotProvenance(meta.keywordSnapshot),
  };
}

function toAnalysisSnapshot(value: unknown): StoredContentAnalysisSnapshot["analysis"] | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.keyword !== "string" ||
    !isContentScore(value.contentScore) ||
    !isGeoScore(value.geoScore) ||
    !isCitabilityScore(value.citability) ||
    !Array.isArray(value.contentBreakdown) ||
    !Array.isArray(value.geoBreakdown) ||
    !isTermsBuckets(value.terms) ||
    !Array.isArray(value.topActions)
  ) {
    return null;
  }

  if (
    !value.contentBreakdown.every(isBreakdownItem) ||
    !value.geoBreakdown.every(isBreakdownItem) ||
    !value.topActions.every(isTopAction)
  ) {
    return null;
  }

  return {
    keyword: value.keyword,
    contentScore: value.contentScore,
    geoScore: value.geoScore,
    citability: value.citability,
    contentBreakdown: value.contentBreakdown,
    geoBreakdown: value.geoBreakdown,
    terms: value.terms,
    topActions: value.topActions,
  };
}

export function createContentAnalysisCacheKey(keyword: string, content: string) {
  return crypto
    .createHash("sha256")
    .update(`${keyword.trim().toLowerCase()}::${content.trim()}`)
    .digest("hex");
}

export async function persistContentAnalysisSnapshot(
  payload: ContentAnalysisSnapshotPayload,
  options: ContentAnalysisSnapshotWriteOptions,
): Promise<ContentAnalysisSnapshotResult> {
  const client = getPrismaClient();
  const computedAt = options.computedAt ?? new Date().toISOString();

  if (!client) {
    return {
      persisted: false,
      reason: getConfigErrorMessage("DATABASE_URL"),
    };
  }

  const snapshot = await client.scoreSnapshot.create({
    data: {
      keyword: payload.keyword,
      contentHash: createContentAnalysisCacheKey(payload.keyword, payload.content),
      resultData: toStoredAnalysis(payload, {
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
      version: ANALYSIS_SNAPSHOT_VERSION,
      pipeline: {
        analysisVersion: ANALYSIS_SNAPSHOT_VERSION,
        keywordVersion: KEYWORD_SNAPSHOT_VERSION,
      },
      keywordSnapshot: options.keywordSnapshot ?? null,
    },
  };
}

export async function readContentAnalysisSnapshot(
  keyword: string,
  content: string,
): Promise<ContentAnalysisSnapshotLookupResult> {
  const client = getPrismaClient();

  if (!client) {
    return {
      status: "miss",
    };
  }

  const snapshot = await client.scoreSnapshot.findFirst({
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

  if (!snapshot?.resultData) {
    return {
      status: "miss",
    };
  }

  const record = snapshot.resultData as Record<string, unknown>;
  const meta = isRecord(record.meta) ? record.meta : null;
  const policy = getSnapshotPolicyStatus({
    storedAt: typeof meta?.storedAt === "string" ? meta.storedAt : null,
    storedVersion: typeof meta?.version === "string" ? meta.version : null,
    maxAgeMs: ANALYSIS_SNAPSHOT_MAX_AGE_MS,
    currentVersion: ANALYSIS_SNAPSHOT_VERSION,
  });

  if (!policy.valid) {
    return {
      status: "invalid",
      reason: policy.reason as Exclude<SnapshotPolicyStatus["reason"], "fresh">,
    };
  }

  const analysis = toAnalysisSnapshot(snapshot.resultData);

  if (!analysis) {
    return {
      status: "miss",
    };
  }

  return {
    status: "hit",
    snapshotId: snapshot.id,
    analysis,
    policy,
    provenance: toContentAnalysisSnapshotProvenance(meta),
  };
}
