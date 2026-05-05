import { describe, it, expect } from "vitest";
import {
  analyzeCompetitorGap,
  extractKeywords,
  detectContentPatterns,
  generateGapRecommendations,
  type CompetitorKeyword,
  type GapAnalysis,
  type GapRecommendation,
} from "@/lib/competitors/gap-analysis";

describe("extractKeywords", () => {
  it("extracts keywords from competitor snapshot JSON", () => {
    const snapshotKeywords = [
      { query: "seo tools", volume: 5000, difficulty: 45 },
      { query: "keyword research", volume: 3000, difficulty: 60 },
      { query: "backlink checker", volume: 2000, difficulty: 55 },
    ];

    const keywords = extractKeywords(snapshotKeywords);

    expect(keywords).toHaveLength(3);
    expect(keywords[0].query).toBe("seo tools");
    expect(keywords[0].volume).toBe(5000);
    expect(keywords[0].difficulty).toBe(45);
  });

  it("handles empty keyword list", () => {
    const keywords = extractKeywords([]);
    expect(keywords).toHaveLength(0);
  });

  it("handles missing optional fields", () => {
    const snapshotKeywords = [
      { query: "seo tools" },
      { query: "keyword research", volume: 3000 },
    ];

    const keywords = extractKeywords(snapshotKeywords);

    expect(keywords).toHaveLength(2);
    expect(keywords[0].volume).toBe(0);
    expect(keywords[0].difficulty).toBe(0);
    expect(keywords[1].volume).toBe(3000);
  });
});

describe("analyzeCompetitorGap", () => {
  it("finds keywords competitors rank for but we don't", () => {
    const competitorKeywords: CompetitorKeyword[] = [
      { query: "seo tools", volume: 5000, difficulty: 45 },
      { query: "keyword research", volume: 3000, difficulty: 60 },
      { query: "backlink checker", volume: 2000, difficulty: 55 },
    ];

    const ourKeywords = ["seo tools", "rank tracker"];

    const gap = analyzeCompetitorGap(competitorKeywords, ourKeywords);

    expect(gap.missingKeywords).toHaveLength(2);
    expect(gap.missingKeywords.map((k) => k.query)).toContain(
      "keyword research"
    );
    expect(gap.missingKeywords.map((k) => k.query)).toContain(
      "backlink checker"
    );
  });

  it("identifies shared keywords for comparison", () => {
    const competitorKeywords: CompetitorKeyword[] = [
      { query: "seo tools", volume: 5000, difficulty: 45 },
      { query: "keyword research", volume: 3000, difficulty: 60 },
    ];

    const ourKeywords = ["seo tools", "keyword research"];

    const gap = analyzeCompetitorGap(competitorKeywords, ourKeywords);

    expect(gap.sharedKeywords).toHaveLength(2);
  });

  it("calculates total gap opportunity volume", () => {
    const competitorKeywords: CompetitorKeyword[] = [
      { query: "gap keyword 1", volume: 5000, difficulty: 45 },
      { query: "gap keyword 2", volume: 3000, difficulty: 60 },
    ];

    const ourKeywords: string[] = [];

    const gap = analyzeCompetitorGap(competitorKeywords, ourKeywords);

    expect(gap.totalOpportunityVolume).toBe(8000);
  });

  it("returns empty gap when we cover all competitor keywords", () => {
    const competitorKeywords: CompetitorKeyword[] = [
      { query: "seo tools", volume: 5000, difficulty: 45 },
    ];

    const ourKeywords = ["seo tools"];

    const gap = analyzeCompetitorGap(competitorKeywords, ourKeywords);

    expect(gap.missingKeywords).toHaveLength(0);
    expect(gap.totalOpportunityVolume).toBe(0);
  });
});

describe("detectContentPatterns", () => {
  it("detects common content types from competitor pages", () => {
    const topPages = [
      { url: "/blog/seo-guide", type: "guide", wordCount: 3000 },
      { url: "/blog/best-tools", type: "listicle", wordCount: 2500 },
      { url: "/blog/seo-guide-2", type: "guide", wordCount: 2800 },
    ];

    const patterns = detectContentPatterns(topPages);

    expect(patterns.mostCommonType).toBe("guide");
    expect(patterns.avgWordCount).toBe(2767);
    expect(patterns.typeDistribution).toHaveProperty("guide", 2);
    expect(patterns.typeDistribution).toHaveProperty("listicle", 1);
  });

  it("handles empty page list", () => {
    const patterns = detectContentPatterns([]);
    expect(patterns.mostCommonType).toBe("unknown");
    expect(patterns.avgWordCount).toBe(0);
  });
});

describe("generateGapRecommendations", () => {
  it("recommends new content for high-volume missing keywords", () => {
    const gap: GapAnalysis = {
      missingKeywords: [
        { query: "high volume gap", volume: 10000, difficulty: 40 },
        { query: "low volume gap", volume: 100, difficulty: 20 },
      ],
      sharedKeywords: [],
      totalOpportunityVolume: 10100,
    };

    const recommendations = generateGapRecommendations(gap);

    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations[0].type).toBe("new_content");
    expect(recommendations[0].priority).toBe("high");
  });

  it("recommends content refresh for shared keywords with lower performance", () => {
    const gap: GapAnalysis = {
      missingKeywords: [],
      sharedKeywords: [
        { query: "shared keyword", ourPosition: 8, competitorPosition: 2 },
      ],
      totalOpportunityVolume: 0,
    };

    const recommendations = generateGapRecommendations(gap);

    const refreshRecs = recommendations.filter(
      (r) => r.type === "content_refresh"
    );
    expect(refreshRecs.length).toBeGreaterThan(0);
  });

  it("returns no recommendations when no gaps exist", () => {
    const gap: GapAnalysis = {
      missingKeywords: [],
      sharedKeywords: [],
      totalOpportunityVolume: 0,
    };

    const recommendations = generateGapRecommendations(gap);
    expect(recommendations).toHaveLength(0);
  });

  it("prioritizes recommendations by opportunity volume", () => {
    const gap: GapAnalysis = {
      missingKeywords: [
        { query: "medium volume", volume: 5000, difficulty: 40 },
        { query: "high volume", volume: 15000, difficulty: 50 },
        { query: "low volume", volume: 500, difficulty: 20 },
      ],
      sharedKeywords: [],
      totalOpportunityVolume: 20500,
    };

    const recommendations = generateGapRecommendations(gap);

    expect(recommendations[0].priority).toBe("high");
    expect(recommendations[recommendations.length - 1].priority).toBe("low");
  });
});
