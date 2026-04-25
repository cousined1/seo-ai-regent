import { describe, expect, it } from "vitest";

import { evaluateInternalRouteAccess } from "@/lib/internal-route/access";

describe("internal route access", () => {
  const config = {
    routeLabel: "Metrics admin route",
    headerName: "x-admin-token",
  } as const;

  it("returns a disabled denial when the route is not enabled", () => {
    const result = evaluateInternalRouteAccess(
      new Request("http://localhost/api/admin/metrics"),
      {
        ...config,
        isEnabled: () => false,
        getExpectedSecret: () => "secret",
      },
    );

    expect(result).toEqual({
      ok: false,
      status: 404,
      reason: "disabled",
      error: "Metrics admin route is not enabled.",
    });
  });

  it("returns a missing-secret denial when the route token is not configured", () => {
    const result = evaluateInternalRouteAccess(
      new Request("http://localhost/api/admin/metrics"),
      {
        ...config,
        isEnabled: () => true,
        getExpectedSecret: () => null,
      },
    );

    expect(result).toEqual({
      ok: false,
      status: 401,
      reason: "missing-secret",
      error: "Metrics admin route token is not configured.",
    });
  });

  it("returns a token mismatch denial when the request header is wrong", () => {
    const result = evaluateInternalRouteAccess(
      new Request("http://localhost/api/admin/metrics", {
        headers: {
          "x-admin-token": "wrong",
        },
      }),
      {
        ...config,
        isEnabled: () => true,
        getExpectedSecret: () => "secret",
      },
    );

    expect(result).toEqual({
      ok: false,
      status: 401,
      reason: "token-mismatch",
      error: "Unauthorized metrics admin request.",
    });
  });

  it("returns the configured header name on success", () => {
    const result = evaluateInternalRouteAccess(
      new Request("http://localhost/api/admin/metrics", {
        headers: {
          "x-admin-token": "secret",
        },
      }),
      {
        ...config,
        isEnabled: () => true,
        getExpectedSecret: () => "secret",
      },
    );

    expect(result).toEqual({
      ok: true,
      headerName: "x-admin-token",
    });
  });
});
