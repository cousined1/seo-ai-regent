import { describe, expect, it } from "vitest";

import { GET } from "@/app/api/demo/article/route";

describe("demo article route", () => {
  it("returns the preloaded article plus canonical rail data", async () => {
    const response = await GET();
    const payload = await response.json();

    expect(payload.article.title).toMatch(/how to start a blog/i);
    expect(payload.article.keyword).toMatch(/how to start a blog/i);
    expect(payload.contentScore.overall).toBeGreaterThan(0);
    expect(payload.geoScore.overall).toBeGreaterThan(0);
    expect(payload.topActions).toHaveLength(3);
    expect(payload.terms.required.length).toBeGreaterThan(0);
    expect(payload.contentBreakdown.length).toBeGreaterThan(0);
    expect(payload.geoBreakdown.length).toBeGreaterThan(0);
  });
});
