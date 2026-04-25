import { describe, expect, it } from "vitest";

import { GET } from "@/app/llms.txt/route";

describe("llms.txt route", () => {
  it("returns an llms.txt document with core product surfaces", async () => {
    const response = await GET();
    const body = await response.text();

    expect(response.headers.get("content-type")).toContain("text/plain");
    expect(body).toContain("# SEO AI Regent");
    expect(body).toContain("/demo");
    expect(body).toContain("GEO Score");
    expect(body).toContain("Canonical scoring");
  });
});
