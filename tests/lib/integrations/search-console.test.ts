import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  parseSearchConsoleResponse,
  detectOpportunities,
  type SearchConsoleRow,
  type Opportunity,
} from "@/lib/integrations/search-console/service";

describe("parseSearchConsoleResponse", () => {
  it("parses API response rows into SearchConsoleRow objects", () => {
    const apiResponse = {
      rows: [
        {
          keys: ["seo tools", "https://example.com/tools"],
          impressions: 1000,
          clicks: 50,
          ctr: 0.05,
          position: 3.2,
        },
        {
          keys: ["best seo software", "https://example.com/tools"],
          impressions: 500,
          clicks: 10,
          ctr: 0.02,
          position: 8.5,
        },
      ],
    };

    const rows = parseSearchConsoleResponse(apiResponse);

    expect(rows).toHaveLength(2);
    expect(rows[0].query).toBe("seo tools");
    expect(rows[0].page).toBe("https://example.com/tools");
    expect(rows[0].impressions).toBe(1000);
    expect(rows[0].clicks).toBe(50);
    expect(rows[0].ctr).toBe(0.05);
    expect(rows[0].position).toBe(3.2);
  });

  it("handles empty response", () => {
    const apiResponse = { rows: [] };
    const rows = parseSearchConsoleResponse(apiResponse);
    expect(rows).toHaveLength(0);
  });

  it("handles response with missing fields", () => {
    const apiResponse = {
      rows: [
        {
          keys: ["test query", "https://example.com/page"],
          impressions: 0,
          clicks: 0,
          ctr: 0,
          position: 0,
        },
      ],
    };

    const rows = parseSearchConsoleResponse(apiResponse);
    expect(rows).toHaveLength(1);
    expect(rows[0].impressions).toBe(0);
  });
});

describe("detectOpportunities", () => {
  it("detects high impression, low CTR opportunities", () => {
    const rows: SearchConsoleRow[] = [
      {
        query: "seo tools",
        page: "https://example.com/tools",
        impressions: 5000,
        clicks: 50,
        ctr: 0.01,
        position: 4.5,
      },
    ];

    const opportunities = detectOpportunities(rows);
    const lowCtr = opportunities.filter(
      (o) => o.type === "HIGH_IMPRESSION_LOW_CTR"
    );

    expect(lowCtr).toHaveLength(1);
    expect(lowCtr[0].query).toBe("seo tools");
    expect(lowCtr[0].value).toBe(0.01);
    expect(lowCtr[0].rationale).toContain("High impressions");
  });

  it("detects pages in position 4-10 range (page 2 opportunities)", () => {
    const rows: SearchConsoleRow[] = [
      {
        query: "seo software",
        page: "https://example.com/software",
        impressions: 2000,
        clicks: 30,
        ctr: 0.015,
        position: 6.2,
      },
      {
        query: "rank tracker",
        page: "https://example.com/tracker",
        impressions: 1000,
        clicks: 100,
        ctr: 0.1,
        position: 2.1,
      },
    ];

    const opportunities = detectOpportunities(rows);
    const page2 = opportunities.filter(
      (o) => o.type === "POSITION_4_TO_10"
    );

    expect(page2).toHaveLength(1);
    expect(page2[0].query).toBe("seo software");
    expect(page2[0].rationale).toContain("#6.2");
  });

  it("detects cannibalized queries (same query, multiple pages)", () => {
    const rows: SearchConsoleRow[] = [
      {
        query: "best seo tools",
        page: "https://example.com/tools",
        impressions: 3000,
        clicks: 100,
        ctr: 0.033,
        position: 5.0,
      },
      {
        query: "best seo tools",
        page: "https://example.com/alternatives",
        impressions: 2000,
        clicks: 50,
        ctr: 0.025,
        position: 7.0,
      },
    ];

    const opportunities = detectOpportunities(rows);
    const cannibalized = opportunities.filter(
      (o) => o.type === "CANNIBALIZED_QUERY"
    );

    expect(cannibalized).toHaveLength(1);
    expect(cannibalized[0].query).toBe("best seo tools");
    expect(cannibalized[0].rationale).toContain("2 pages compete");
  });

  it("detects declining pages (simulated with low recent CTR vs historical)", () => {
    const rows: SearchConsoleRow[] = [
      {
        query: "old blog post",
        page: "https://example.com/blog/old",
        impressions: 10000,
        clicks: 20,
        ctr: 0.002,
        position: 12.5,
      },
    ];

    const opportunities = detectOpportunities(rows);
    const declining = opportunities.filter(
      (o) => o.type === "DECLINING_PAGE"
    );

    expect(declining).toHaveLength(1);
    expect(declining[0].page).toBe("https://example.com/blog/old");
  });

  it("does not flag healthy pages", () => {
    const rows: SearchConsoleRow[] = [
      {
        query: "healthy page",
        page: "https://example.com/good",
        impressions: 1000,
        clicks: 100,
        ctr: 0.1,
        position: 1.5,
      },
    ];

    const opportunities = detectOpportunities(rows);
    expect(opportunities).toHaveLength(0);
  });

  it("returns multiple opportunity types for the same page", () => {
    const rows: SearchConsoleRow[] = [
      {
        query: "struggling page",
        page: "https://example.com/struggle",
        impressions: 8000,
        clicks: 40,
        ctr: 0.005,
        position: 7.5,
      },
    ];

    const opportunities = detectOpportunities(rows);

    // Should be flagged for both high impression low CTR and position 4-10
    const types = opportunities.map((o) => o.type);
    expect(types).toContain("HIGH_IMPRESSION_LOW_CTR");
    expect(types).toContain("POSITION_4_TO_10");
  });
});
