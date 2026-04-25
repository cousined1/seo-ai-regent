import { afterEach, describe, expect, it } from "vitest";

import { evaluateDebugAccess } from "@/lib/debug/access";
import {
  resetCacheDebugRouteOverride,
  setCacheDebugRouteOverride,
} from "@/lib/observability/cache-log";
import { createSessionCookieHeader } from "../helpers/auth";

describe("debug access boundary", () => {
  afterEach(() => {
    resetCacheDebugRouteOverride();
  });

  it("returns a disabled denial when the route is not enabled", async () => {
    setCacheDebugRouteOverride(false);

    const result = await evaluateDebugAccess(
      new Request("http://localhost/api/debug/cache-metrics"),
    );

    expect(result).toEqual({
      ok: false,
      status: 404,
      reason: "disabled",
      error: "Cache debug route is not enabled.",
    });
  });

  it("returns an auth-required denial when debug access is enabled without a session", async () => {
    setCacheDebugRouteOverride(true);

    const result = await evaluateDebugAccess(
      new Request("http://localhost/api/debug/cache-metrics"),
    );

    expect(result).toEqual({
      ok: false,
      status: 401,
      reason: "auth-required",
      error: "Authentication required.",
    });
  });

  it("returns an admin-required denial when the session is not MFA-verified", async () => {
    setCacheDebugRouteOverride(true);

    const result = await evaluateDebugAccess(
      new Request("http://localhost/api/debug/cache-metrics", {
        headers: {
          cookie: createSessionCookieHeader({
            mfaVerified: false,
          }),
        },
      }),
    );

    expect(result).toEqual({
      ok: false,
      status: 403,
      reason: "admin-required",
      error: "Admin authorization required.",
    });
  });

  it("allows access when the route is enabled and the admin session is valid", async () => {
    setCacheDebugRouteOverride(true);

    const result = await evaluateDebugAccess(
      new Request("http://localhost/api/debug/cache-metrics", {
        headers: {
          cookie: createSessionCookieHeader(),
        },
      }),
    );

    expect(result).toEqual({
      ok: true,
      userId: "env-admin",
      role: "ADMIN",
    });
  });
});
