import { describe, expect, it } from "vitest";

import { POST } from "@/app/api/score/geo/route";

describe("geo score route", () => {
  it("returns GEO score, explanation breakdown, and citability", async () => {
    const request = new Request("http://localhost/api/score/geo", {
      method: "POST",
      body: JSON.stringify({
        content:
          "Content optimization helps teams improve AI-search visibility. According to Gartner 2025 guidance, cited evidence and named entities improve retrieval quality for systems like ChatGPT and Perplexity.",
      }),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.geoScore.overall).toBeGreaterThan(0);
    expect(payload.geoBreakdown.length).toBeGreaterThan(0);
    expect(payload.citability.totalScore).toBeGreaterThan(0);
  });

  it("returns a clear validation error when content is missing", async () => {
    const request = new Request("http://localhost/api/score/geo", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(response.status).toBe(400);
    expect(payload.error).toMatch(/content is required/i);
  });
});
