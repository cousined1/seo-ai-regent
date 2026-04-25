import { describe, expect, it } from "vitest";

import { deriveTopActions } from "@/lib/scoring/top-actions";

describe("deriveTopActions", () => {
  it("returns contextual lifts with GEO and content-specific labels", () => {
    const actions = deriveTopActions({
      content: {
        overall: 62,
        termFrequency: 50,
        entityCoverage: 60,
        headingStructure: 40,
        wordCount: 70,
        readability: 76,
        internalLinks: 35,
        geoSignals: 52,
      },
      geo: {
        overall: 58,
        entityAuthority: 55,
        factualDensity: 30,
        answerFormat: 71,
        sourceCredibility: 65,
        freshness: 42,
      },
    });

    expect(actions).toHaveLength(3);
    expect(actions[0]?.liftLabel).toMatch(/Content|GEO|pts/);
    expect(actions[1]?.liftLabel).toMatch(/Content|GEO|pts/);
  });
});
