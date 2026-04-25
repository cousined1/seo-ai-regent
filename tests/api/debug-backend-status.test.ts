import { afterEach, describe, expect, it } from "vitest";

import { GET } from "@/app/api/debug/backend-status/route";
import {
  resetCacheDebugRouteOverride,
  resetCacheObservabilityLogRetentionOverride,
  setCacheDebugRouteOverride,
  setCacheObservabilityLogRetentionOverride,
} from "@/lib/observability/cache-log";
import { createSessionCookieHeader } from "../helpers/auth";

describe("debug backend status route", () => {
  afterEach(() => {
    resetCacheDebugRouteOverride();
    resetCacheObservabilityLogRetentionOverride();
  });

  it("rejects the route when debug access is disabled", async () => {
    const response = await GET(new Request("http://localhost/api/debug/backend-status"));
    const payload = await response.json();

    expect(response.status).toBe(404);
    expect(payload.reason).toBe("disabled");
  });

  it("rejects the route when the admin session is missing", async () => {
    setCacheDebugRouteOverride(true);

    const response = await GET(new Request("http://localhost/api/debug/backend-status"));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.reason).toBe("auth-required");
  });

  it("returns a safe backend status snapshot when the admin session is valid", async () => {
    setCacheDebugRouteOverride(true);
    setCacheObservabilityLogRetentionOverride(321);

    const previousDatabaseUrl = process.env.DATABASE_URL;
    const previousSerperApiKey = process.env.SERPER_API_KEY;

    process.env.DATABASE_URL = "postgresql://demo:demo@localhost:5432/rankforge";
    process.env.SERPER_API_KEY = "serper-demo-key";

    try {
      const response = await GET(
        new Request("http://localhost/api/debug/backend-status", {
          headers: {
            cookie: createSessionCookieHeader(),
          },
        }),
      );
      const payload = await response.json();

      expect(response.status).toBe(200);
      expect(payload.persistence).toMatchObject({
        provider: "prisma",
        configured: true,
      });
      expect(payload.integrations).toEqual({
        serper: {
          configured: true,
          reason:
            "SERPER_API_KEY is configured; Serper client is not yet wired and SERP analysis is served from the heuristic fallback.",
        },
      });
      expect(payload.snapshotPolicy).toEqual({
        keyword: {
          version: "keyword-v1",
          maxAgeMs: 43200000,
        },
        analysis: {
          version: "analysis-v1",
          maxAgeMs: 7200000,
        },
      });
      expect(payload.observability).toEqual({
        debugRouteEnabled: true,
        logRetentionLines: 321,
      });
    } finally {
      if (previousDatabaseUrl === undefined) {
        delete process.env.DATABASE_URL;
      } else {
        process.env.DATABASE_URL = previousDatabaseUrl;
      }

      if (previousSerperApiKey === undefined) {
        delete process.env.SERPER_API_KEY;
      } else {
        process.env.SERPER_API_KEY = previousSerperApiKey;
      }
    }
  });
});
