import { describe, expect, it } from "vitest";

import { prioritizeRefreshOpportunities, calculateRefreshImpact } from "@/lib/inventory/refresh-engine";

describe("prioritizeRefreshOpportunities", () => {
  it("sorts by impact score descending", () => {
    const items = [
      {
        url: "https://example.com/low",
        title: "Low Impact",
        contentScore: 60,
        geoScore: 50,
        issues: ["THIN_CONTENT"],
        impactScore: 30,
      },
      {
        url: "https://example.com/high",
        title: "High Impact",
        contentScore: 20,
        geoScore: 15,
        issues: ["THIN_CONTENT", "MISSING_META_DESCRIPTION", "MISSING_TITLE"],
        impactScore: 85,
      },
      {
        url: "https://example.com/medium",
        title: "Medium Impact",
        contentScore: 40,
        geoScore: 35,
        issues: ["MISSING_META_DESCRIPTION"],
        impactScore: 55,
      },
    ];

    const sorted = prioritizeRefreshOpportunities(items);
    expect(sorted[0].url).toBe("https://example.com/high");
    expect(sorted[1].url).toBe("https://example.com/medium");
    expect(sorted[2].url).toBe("https://example.com/low");
  });

  it("filters out items with no issues", () => {
    const items = [
      {
        url: "https://example.com/healthy",
        title: "Healthy Page",
        contentScore: 85,
        geoScore: 80,
        issues: [] as string[],
        impactScore: 0,
      },
      {
        url: "https://example.com/needs-work",
        title: "Needs Work",
        contentScore: 30,
        geoScore: 25,
        issues: ["THIN_CONTENT"],
        impactScore: 60,
      },
    ];

    const sorted = prioritizeRefreshOpportunities(items);
    expect(sorted).toHaveLength(1);
    expect(sorted[0].url).toBe("https://example.com/needs-work");
  });

  it("handles empty input", () => {
    expect(prioritizeRefreshOpportunities([])).toHaveLength(0);
  });
});

describe("calculateRefreshImpact", () => {
  it("calculates high impact for low scores with many issues", () => {
    const impact = calculateRefreshImpact({
      contentScore: 20,
      geoScore: 15,
      issueCount: 4,
      hasTraffic: true,
    });

    expect(impact).toBeGreaterThan(70);
  });

  it("calculates low impact for high scores with few issues", () => {
    const impact = calculateRefreshImpact({
      contentScore: 80,
      geoScore: 75,
      issueCount: 1,
      hasTraffic: false,
    });

    expect(impact).toBeLessThan(30);
  });

  it("boosts impact for pages with traffic", () => {
    const withTraffic = calculateRefreshImpact({
      contentScore: 40,
      geoScore: 35,
      issueCount: 2,
      hasTraffic: true,
    });

    const withoutTraffic = calculateRefreshImpact({
      contentScore: 40,
      geoScore: 35,
      issueCount: 2,
      hasTraffic: false,
    });

    expect(withTraffic).toBeGreaterThan(withoutTraffic);
  });

  it("returns 0 for perfect scores", () => {
    const impact = calculateRefreshImpact({
      contentScore: 100,
      geoScore: 100,
      issueCount: 0,
      hasTraffic: true,
    });

    expect(impact).toBe(0);
  });
});
