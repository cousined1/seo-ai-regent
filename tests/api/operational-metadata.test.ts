import { describe, expect, it } from "vitest";
import type { NextConfig } from "next";

// @ts-expect-error -- .mjs config has no declaration file; typed via explicit cast below.
import nextConfigModule from "@/../next.config.mjs";
import { metadata as editorMetadata } from "@/app/app/editor/page";
import { GET as healthRoute } from "@/app/api/health/route";
import { GET as readyRoute } from "@/app/api/ready/route";
import sitemap from "@/app/sitemap";

const nextConfig = nextConfigModule as NextConfig;

describe("operational production surface", () => {
  it("publishes health and readiness endpoints for deployment probes", async () => {
    const healthResponse = await healthRoute();
    const healthPayload = await healthResponse.json();
    const readyResponse = await readyRoute();
    const readyPayload = await readyResponse.json();

    expect(healthResponse.status).toBe(200);
    expect(healthPayload.status).toBe("ok");
    expect(readyResponse.status).toBe(200);
    expect(readyPayload.status).toBe("ready");
  });

  it("exposes hardened security headers through Next config", async () => {
    const headers = await nextConfig.headers?.();
    const rootHeaders = headers?.find((entry: { source: string }) => entry.source === "/:path*");

    expect(rootHeaders?.headers).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: "Content-Security-Policy",
        }),
        expect.objectContaining({
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        }),
        expect.objectContaining({
          key: "X-Content-Type-Options",
          value: "nosniff",
        }),
        expect.objectContaining({
          key: "X-Frame-Options",
          value: "DENY",
        }),
        expect.objectContaining({
          key: "Strict-Transport-Security",
        }),
      ]),
    );
  });

  it("keeps the sitemap focused on public crawl targets only", () => {
    const entries = sitemap();

    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://seoairegent.com/",
        }),
        expect.objectContaining({
          url: "https://seoairegent.com/demo",
        }),
      ]),
    );
    expect(entries).not.toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          url: "https://seoairegent.com/app/editor",
        }),
      ]),
    );
  });

  it("marks the editor workspace as non-indexable", () => {
    expect(editorMetadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });
});
