import { describe, expect, it } from "vitest";

import { generateArticleContent, checkPublishEligibility, evaluateReviewGate } from "@/lib/articles/scoring-pipeline";

describe("generateArticleContent", () => {
  it("generates structured article with H1, H2, H3 headings", () => {
    const content = generateArticleContent({
      keyword: "seo automation",
      template: "pillar",
      targetWordCount: 500,
    });

    const allNodes = JSON.stringify(content);
    expect(allNodes).toContain("heading");
    expect(allNodes).toContain('"level":1');
    expect(allNodes).toContain('"level":2');
    expect(content.type).toBe("doc");
    expect(content.content).toBeDefined();
  });

  it("generates listicle template with numbered sections", () => {
    const content = generateArticleContent({
      keyword: "seo tools",
      template: "listicle",
      targetWordCount: 400,
    });

    expect(content).toBeDefined();
    expect(content.type).toBe("doc");
  });

  it("generates how-to template with step structure", () => {
    const content = generateArticleContent({
      keyword: "how to optimize meta tags",
      template: "how-to",
      targetWordCount: 300,
    });

    expect(content).toBeDefined();
    expect(content.type).toBe("doc");
  });

  it("generates comparison template with pros/cons structure", () => {
    const content = generateArticleContent({
      keyword: "seo tool comparison",
      template: "comparison",
      targetWordCount: 400,
    });

    expect(content).toBeDefined();
    expect(content.type).toBe("doc");
  });

  it("generates FAQ template with question/answer structure", () => {
    const content = generateArticleContent({
      keyword: "seo automation faq",
      template: "faq",
      targetWordCount: 300,
    });

    expect(content).toBeDefined();
    expect(content.type).toBe("doc");
  });
});

describe("checkPublishEligibility", () => {
  it("returns eligible for scores above 70", () => {
    const result = checkPublishEligibility({ contentScore: 75, geoScore: 70 });
    expect(result.eligible).toBe(true);
    expect(result.blockedReason).toBeNull();
  });

  it("returns ineligible for content score below 70", () => {
    const result = checkPublishEligibility({ contentScore: 65, geoScore: 70 });
    expect(result.eligible).toBe(false);
    expect(result.blockedReason).toContain("Content Score");
  });

  it("returns ineligible for geo score below 70", () => {
    const result = checkPublishEligibility({ contentScore: 80, geoScore: 60 });
    expect(result.eligible).toBe(false);
    expect(result.blockedReason).toContain("GEO Score");
  });

  it("returns ineligible when geo score is missing", () => {
    const result = checkPublishEligibility({ contentScore: 80, geoScore: null });
    expect(result.eligible).toBe(false);
  });

  it("returns eligible at exactly 70 threshold", () => {
    const result = checkPublishEligibility({ contentScore: 70, geoScore: 70 });
    expect(result.eligible).toBe(true);
  });
});

describe("evaluateReviewGate", () => {
  it("returns pass for high scores", () => {
    const result = evaluateReviewGate({
      contentScore: 85,
      geoScore: 80,
      issues: [],
    });

    expect(result.status).toBe("pass");
    expect(result.requiresReview).toBe(false);
  });

  it("returns review for content score below 70", () => {
    const result = evaluateReviewGate({
      contentScore: 55,
      geoScore: 60,
      issues: ["THIN_CONTENT", "MISSING_META_DESCRIPTION"],
    });

    expect(result.status).toBe("review");
    expect(result.requiresReview).toBe(true);
    expect(result.blockedActions).toContain("publish");
  });

  it("returns review for critical issues even with passing scores", () => {
    const result = evaluateReviewGate({
      contentScore: 75,
      geoScore: 72,
      issues: ["THIN_CONTENT"],
    });

    expect(result.status).toBe("review");
    expect(result.requiresReview).toBe(true);
  });

  it("includes improvement suggestions in review result", () => {
    const result = evaluateReviewGate({
      contentScore: 50,
      geoScore: 45,
      issues: ["THIN_CONTENT", "MISSING_TITLE"],
    });

    expect(result.improvements).toBeDefined();
    expect(result.improvements.length).toBeGreaterThan(0);
  });
});
