import { describe, expect, it } from "vitest";

import {
  ANALYSIS_SNAPSHOT_MAX_AGE_MS,
  ANALYSIS_SNAPSHOT_VERSION,
  KEYWORD_SNAPSHOT_MAX_AGE_MS,
  KEYWORD_SNAPSHOT_VERSION,
  getSnapshotPolicyStatus,
} from "@/lib/persistence/policy";

describe("snapshot freshness policy", () => {
  it("accepts a fresh snapshot on the current version", () => {
    const result = getSnapshotPolicyStatus({
      storedAt: new Date(Date.now() - 60_000).toISOString(),
      storedVersion: KEYWORD_SNAPSHOT_VERSION,
      maxAgeMs: KEYWORD_SNAPSHOT_MAX_AGE_MS,
      currentVersion: KEYWORD_SNAPSHOT_VERSION,
    });

    expect(result.valid).toBe(true);
    expect(result.reason).toBe("fresh");
  });

  it("rejects a stale snapshot when age exceeds the policy window", () => {
    const result = getSnapshotPolicyStatus({
      storedAt: new Date(Date.now() - ANALYSIS_SNAPSHOT_MAX_AGE_MS - 1_000).toISOString(),
      storedVersion: ANALYSIS_SNAPSHOT_VERSION,
      maxAgeMs: ANALYSIS_SNAPSHOT_MAX_AGE_MS,
      currentVersion: ANALYSIS_SNAPSHOT_VERSION,
    });

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("stale");
  });

  it("rejects a snapshot when the schema version changes", () => {
    const result = getSnapshotPolicyStatus({
      storedAt: new Date().toISOString(),
      storedVersion: "analysis-v0",
      maxAgeMs: ANALYSIS_SNAPSHOT_MAX_AGE_MS,
      currentVersion: ANALYSIS_SNAPSHOT_VERSION,
    });

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("version-mismatch");
  });
});
