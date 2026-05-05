import { describe, expect, it } from "vitest";

import { classifyIntent, clusterByIntent } from "@/lib/keywords/cluster";
import type { Intent } from "@prisma/client";

describe("classifyIntent", () => {
  it("classifies informational queries from SERP signals", () => {
    const serpFeatures = ["featured_snippet", "people_also_ask", "how_to"];
    const result = classifyIntent("what is seo", serpFeatures);
    expect(result).toBe("INFORMATIONAL");
  });

  it("classifies transactional queries from SERP signals", () => {
    const serpFeatures = ["shopping_results", "product_listing"];
    const result = classifyIntent("buy seo tool", serpFeatures);
    expect(result).toBe("TRANSACTIONAL");
  });

  it("classifies navigational queries from SERP signals", () => {
    const serpFeatures = ["site_links", "knowledge_panel"];
    const result = classifyIntent("google search console login", serpFeatures);
    expect(result).toBe("NAVIGATIONAL");
  });

  it("classifies commercial queries from SERP signals", () => {
    const serpFeatures = ["comparison", "review_stars"];
    const result = classifyIntent("best seo tool 2026", serpFeatures);
    expect(result).toBe("COMMERCIAL");
  });

  it("defaults to INFORMATIONAL when no strong signals", () => {
    const serpFeatures: string[] = [];
    const result = classifyIntent("seo basics", serpFeatures);
    expect(result).toBe("INFORMATIONAL");
  });

  it("classifies from query keywords when SERP features are empty", () => {
    expect(classifyIntent("how to fix", [])).toBe("INFORMATIONAL");
    expect(classifyIntent("buy now", [])).toBe("TRANSACTIONAL");
    expect(classifyIntent("login page", [])).toBe("NAVIGATIONAL");
    expect(classifyIntent("best vs", [])).toBe("COMMERCIAL");
  });
});

describe("clusterByIntent", () => {
  it("groups keywords by their intent", () => {
    const keywords = [
      { keyword: "what is seo", intent: "INFORMATIONAL" as Intent, volume: 1000, difficulty: 45 },
      { keyword: "seo guide", intent: "INFORMATIONAL" as Intent, volume: 800, difficulty: 50 },
      { keyword: "buy seo tool", intent: "TRANSACTIONAL" as Intent, volume: 500, difficulty: 60 },
      { keyword: "seo software pricing", intent: "TRANSACTIONAL" as Intent, volume: 300, difficulty: 55 },
    ];

    const clusters = clusterByIntent(keywords);

    expect(clusters).toHaveLength(2);
    expect(clusters.find((c) => c.intent === "INFORMATIONAL")?.keywords).toHaveLength(2);
    expect(clusters.find((c) => c.intent === "TRANSACTIONAL")?.keywords).toHaveLength(2);
  });

  it("handles empty keyword list", () => {
    const clusters = clusterByIntent([]);
    expect(clusters).toHaveLength(0);
  });

  it("handles single keyword", () => {
    const keywords = [
      { keyword: "seo basics", intent: "INFORMATIONAL" as Intent, volume: 200, difficulty: 30 },
    ];

    const clusters = clusterByIntent(keywords);

    expect(clusters).toHaveLength(1);
    expect(clusters[0].intent).toBe("INFORMATIONAL");
    expect(clusters[0].keywords).toHaveLength(1);
  });

  it("generates cluster name from dominant keyword", () => {
    const keywords = [
      { keyword: "what is seo", intent: "INFORMATIONAL" as Intent, volume: 1000, difficulty: 45 },
      { keyword: "seo guide", intent: "INFORMATIONAL" as Intent, volume: 800, difficulty: 50 },
    ];

    const clusters = clusterByIntent(keywords);

    expect(clusters[0].name).toContain("seo");
  });
});
