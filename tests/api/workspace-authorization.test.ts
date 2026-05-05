import { describe, expect, it } from "vitest";

import { GET as dashboardGet } from "@/app/api/dashboard/route";
import { GET as backlinksGet, POST as backlinksPost } from "@/app/api/backlinks/route";
import { GET as competitorsGet, POST as competitorsPost, DELETE as competitorsDelete } from "@/app/api/competitors/route";
import { POST as citationsCheckPost } from "@/app/api/citations/check/route";
import { GET as internalLinksGet } from "@/app/api/internal-links/route";
import { POST as internalLinksSuggestPost } from "@/app/api/internal-links/suggest/route";
import { POST as searchConsoleConnectPost, GET as searchConsoleConnectGet } from "@/app/api/search-console/connect/route";
import { POST as rankTrackingCheckPost } from "@/app/api/rank-tracking/check/route";
import { POST as auditRunPost } from "@/app/api/audit/run/route";

function jsonRequest(url: string, body: unknown, method = "POST") {
  return new Request(url, {
    method,
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

function getRequest(url: string) {
  return new Request(url);
}

async function expectUnauthorized(response: Response) {
  expect(response.status).toBe(401);
  const payload = await response.json();
  expect(payload.error).toMatch(/authentication required/i);
}

describe("workspace-scoped API routes reject unauthenticated callers", () => {
  it("rejects GET /api/dashboard without a session", async () => {
    // @ts-expect-error -- NextRequest type compatibility; route accepts standard Request.
    await expectUnauthorized(await dashboardGet(getRequest("http://localhost/api/dashboard?workspaceId=w1")));
  });

  it("rejects GET and POST /api/backlinks without a session", async () => {
    // @ts-expect-error -- NextRequest type compatibility.
    await expectUnauthorized(await backlinksGet(getRequest("http://localhost/api/backlinks?workspaceId=w1")));
    await expectUnauthorized(
      // @ts-expect-error -- NextRequest type compatibility.
      await backlinksPost(jsonRequest("http://localhost/api/backlinks", { workspaceId: "w1", sources: [] })),
    );
  });

  it("rejects /api/competitors without a session", async () => {
    // @ts-expect-error -- NextRequest type compatibility.
    await expectUnauthorized(await competitorsGet(getRequest("http://localhost/api/competitors?workspaceId=w1")));
    await expectUnauthorized(
      // @ts-expect-error -- NextRequest type compatibility.
      await competitorsPost(jsonRequest("http://localhost/api/competitors", { workspaceId: "w1", domain: "x.com" })),
    );
    await expectUnauthorized(
      // @ts-expect-error -- NextRequest type compatibility.
      await competitorsDelete(jsonRequest("http://localhost/api/competitors", { competitorId: "c1" }, "DELETE")),
    );
  });

  it("rejects POST /api/citations/check without a session", async () => {
    await expectUnauthorized(
      // @ts-expect-error -- NextRequest type compatibility.
      await citationsCheckPost(jsonRequest("http://localhost/api/citations/check", { workspaceId: "w1", checks: [] })),
    );
  });

  it("rejects internal-links endpoints without a session", async () => {
    // @ts-expect-error -- NextRequest type compatibility.
    await expectUnauthorized(await internalLinksGet(getRequest("http://localhost/api/internal-links?workspaceId=w1")));
    await expectUnauthorized(
      // @ts-expect-error -- NextRequest type compatibility.
      await internalLinksSuggestPost(
        jsonRequest("http://localhost/api/internal-links/suggest", {
          workspaceId: "w1",
          articleId: "a1",
          content: { type: "doc" },
        }),
      ),
    );
  });

  it("rejects /api/search-console/connect without a session", async () => {
    await expectUnauthorized(
      // @ts-expect-error -- NextRequest type compatibility.
      await searchConsoleConnectGet(getRequest("http://localhost/api/search-console/connect?workspaceId=w1")),
    );
    await expectUnauthorized(
      // @ts-expect-error -- NextRequest type compatibility.
      await searchConsoleConnectPost(
        jsonRequest("http://localhost/api/search-console/connect", {
          workspaceId: "w1",
          propertyUrl: "https://example.com",
          accessToken: "a",
          refreshToken: "b",
        }),
      ),
    );
  });

  it("rejects POST /api/rank-tracking/check without a session", async () => {
    await expectUnauthorized(
      // @ts-expect-error -- NextRequest type compatibility.
      await rankTrackingCheckPost(jsonRequest("http://localhost/api/rank-tracking/check", { keywordId: "k1", position: 1 })),
    );
  });

  it("rejects POST /api/audit/run without a session", async () => {
    await expectUnauthorized(
      // @ts-expect-error -- NextRequest type compatibility.
      await auditRunPost(jsonRequest("http://localhost/api/audit/run", { siteId: "s1", urls: ["https://example.com"] })),
    );
  });
});
