export const KEYWORD_SNAPSHOT_VERSION = "keyword-v1";
export const ANALYSIS_SNAPSHOT_VERSION = "analysis-v1";

export const KEYWORD_SNAPSHOT_MAX_AGE_MS = 1000 * 60 * 60 * 12;
export const ANALYSIS_SNAPSHOT_MAX_AGE_MS = 1000 * 60 * 60 * 2;

export interface SnapshotPolicyStatus {
  valid: boolean;
  reason: "fresh" | "stale" | "version-mismatch" | "missing-meta";
}

export interface SnapshotPolicyInput {
  storedAt?: string | null;
  storedVersion?: string | null;
  maxAgeMs: number;
  currentVersion: string;
  now?: number;
}

export function getSnapshotPolicyStatus({
  storedAt,
  storedVersion,
  maxAgeMs,
  currentVersion,
  now = Date.now(),
}: SnapshotPolicyInput): SnapshotPolicyStatus {
  if (!storedAt || !storedVersion) {
    return {
      valid: false,
      reason: "missing-meta",
    };
  }

  if (storedVersion !== currentVersion) {
    return {
      valid: false,
      reason: "version-mismatch",
    };
  }

  const parsedTime = Date.parse(storedAt);

  if (Number.isNaN(parsedTime) || now - parsedTime > maxAgeMs) {
    return {
      valid: false,
      reason: "stale",
    };
  }

  return {
    valid: true,
    reason: "fresh",
  };
}
