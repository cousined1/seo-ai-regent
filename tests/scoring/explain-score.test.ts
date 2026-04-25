import { describe, expect, it } from "vitest";

import { explainScore } from "@/lib/scoring/explain-score";

describe("explainScore", () => {
  it("excludes overall and returns weighted contributions for content scores", () => {
    const result = explainScore({
      overall: 74,
      termFrequency: 80,
      entityCoverage: 60,
      headingStructure: 40,
      wordCount: 75,
      readability: 90,
      internalLinks: 20,
      geoSignals: 65,
    });

    expect(result.find((item) => item.signal === "overall")).toBeUndefined();
    expect(result.find((item) => item.signal === "termFrequency")?.contribution).toBe(
      16,
    );
    expect(result.find((item) => item.signal === "internalLinks")?.status).toBe(
      "critical",
    );
  });

  it("supports GEO scores and preserves score-specific signals", () => {
    const result = explainScore({
      overall: 68,
      entityAuthority: 70,
      factualDensity: 82,
      answerFormat: 64,
      sourceCredibility: 58,
      freshness: 44,
    });

    expect(result).toHaveLength(5);
    expect(result.find((item) => item.signal === "factualDensity")?.contribution).toBe(
      19.68,
    );
  });
});
