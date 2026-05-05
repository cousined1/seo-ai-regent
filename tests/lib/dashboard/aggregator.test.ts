import { describe, it, expect } from "vitest";
import { aggregateWorkspaceDashboard } from "@/lib/dashboard/aggregator";

describe("aggregateWorkspaceDashboard", () => {
  it("returns a complete dashboard payload with all metric sections", () => {
    const dashboard = aggregateWorkspaceDashboard({
      workspaceId: "test-workspace",
      keywords: { total: 50, tracking: 30, top3: 5, top10: 12, top20: 20 },
      contentScores: { total: 15, avgContentScore: 72.5, avgGeoScore: 68.3, above70: 10, below50: 2 },
      citations: { total: 25, avgScore: 0.78, appearing: 18, notAppearing: 7 },
      backlinks: { total: 40, highPriority: 8, mediumPriority: 15, lowPriority: 17, contacted: 12 },
      audit: { lastRunAt: "2024-06-01T00:00:00Z", totalIssues: 15, critical: 2, warning: 8, info: 5 },
      inventory: { total: 30, needsRefresh: 5, outdated: 3, healthy: 22 },
      articles: { total: 20, published: 15, draft: 3, inReview: 2 },
    });

    expect(dashboard.workspaceId).toBe("test-workspace");
    expect(dashboard.keywords.total).toBe(50);
    expect(dashboard.contentScores.avgContentScore).toBe(72.5);
    expect(dashboard.citations.appearing).toBe(18);
    expect(dashboard.backlinks.highPriority).toBe(8);
    expect(dashboard.audit.critical).toBe(2);
    expect(dashboard.inventory.needsRefresh).toBe(5);
    expect(dashboard.articles.published).toBe(15);
  });

  it("handles empty keyword data gracefully", () => {
    const dashboard = aggregateWorkspaceDashboard({
      workspaceId: "empty-workspace",
      keywords: { total: 0, tracking: 0, top3: 0, top10: 0, top20: 0 },
      contentScores: { total: 0, avgContentScore: 0, avgGeoScore: 0, above70: 0, below50: 0 },
      citations: { total: 0, avgScore: 0, appearing: 0, notAppearing: 0 },
      backlinks: { total: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0, contacted: 0 },
      audit: { lastRunAt: null, totalIssues: 0, critical: 0, warning: 0, info: 0 },
      inventory: { total: 0, needsRefresh: 0, outdated: 0, healthy: 0 },
      articles: { total: 0, published: 0, draft: 0, inReview: 0 },
    });

    expect(dashboard.workspaceId).toBe("empty-workspace");
    expect(dashboard.keywords.total).toBe(0);
    expect(dashboard.contentScores.avgContentScore).toBe(0);
  });

  it("calculates keyword health percentage correctly", () => {
    const dashboard = aggregateWorkspaceDashboard({
      workspaceId: "health-workspace",
      keywords: { total: 100, tracking: 80, top3: 20, top10: 35, top20: 50 },
      contentScores: { total: 0, avgContentScore: 0, avgGeoScore: 0, above70: 0, below50: 0 },
      citations: { total: 0, avgScore: 0, appearing: 0, notAppearing: 0 },
      backlinks: { total: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0, contacted: 0 },
      audit: { lastRunAt: null, totalIssues: 0, critical: 0, warning: 0, info: 0 },
      inventory: { total: 0, needsRefresh: 0, outdated: 0, healthy: 0 },
      articles: { total: 0, published: 0, draft: 0, inReview: 0 },
    });

    expect(dashboard.keywords.healthPercentage).toBe(44);
  });

  it("calculates content score health correctly", () => {
    const dashboard = aggregateWorkspaceDashboard({
      workspaceId: "content-workspace",
      keywords: { total: 0, tracking: 0, top3: 0, top10: 0, top20: 0 },
      contentScores: { total: 20, avgContentScore: 65, avgGeoScore: 70, above70: 12, below50: 3 },
      citations: { total: 0, avgScore: 0, appearing: 0, notAppearing: 0 },
      backlinks: { total: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0, contacted: 0 },
      audit: { lastRunAt: null, totalIssues: 0, critical: 0, warning: 0, info: 0 },
      inventory: { total: 0, needsRefresh: 0, outdated: 0, healthy: 0 },
      articles: { total: 0, published: 0, draft: 0, inReview: 0 },
    });

    expect(dashboard.contentScores.passRate).toBe(60);
    expect(dashboard.contentScores.blockRate).toBe(15);
  });

  it("calculates citation visibility rate correctly", () => {
    const dashboard = aggregateWorkspaceDashboard({
      workspaceId: "citation-workspace",
      keywords: { total: 0, tracking: 0, top3: 0, top10: 0, top20: 0 },
      contentScores: { total: 0, avgContentScore: 0, avgGeoScore: 0, above70: 0, below50: 0 },
      citations: { total: 50, avgScore: 0.65, appearing: 35, notAppearing: 15 },
      backlinks: { total: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0, contacted: 0 },
      audit: { lastRunAt: null, totalIssues: 0, critical: 0, warning: 0, info: 0 },
      inventory: { total: 0, needsRefresh: 0, outdated: 0, healthy: 0 },
      articles: { total: 0, published: 0, draft: 0, inReview: 0 },
    });

    expect(dashboard.citations.visibilityRate).toBe(70);
  });

  it("calculates backlink outreach progress correctly", () => {
    const dashboard = aggregateWorkspaceDashboard({
      workspaceId: "backlink-workspace",
      keywords: { total: 0, tracking: 0, top3: 0, top10: 0, top20: 0 },
      contentScores: { total: 0, avgContentScore: 0, avgGeoScore: 0, above70: 0, below50: 0 },
      citations: { total: 0, avgScore: 0, appearing: 0, notAppearing: 0 },
      backlinks: { total: 100, highPriority: 20, mediumPriority: 30, lowPriority: 50, contacted: 45 },
      audit: { lastRunAt: null, totalIssues: 0, critical: 0, warning: 0, info: 0 },
      inventory: { total: 0, needsRefresh: 0, outdated: 0, healthy: 0 },
      articles: { total: 0, published: 0, draft: 0, inReview: 0 },
    });

    expect(dashboard.backlinks.contactRate).toBe(45);
  });

  it("marks audit as stale when last run is older than 7 days", () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 8);

    const dashboard = aggregateWorkspaceDashboard({
      workspaceId: "audit-workspace",
      keywords: { total: 0, tracking: 0, top3: 0, top10: 0, top20: 0 },
      contentScores: { total: 0, avgContentScore: 0, avgGeoScore: 0, above70: 0, below50: 0 },
      citations: { total: 0, avgScore: 0, appearing: 0, notAppearing: 0 },
      backlinks: { total: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0, contacted: 0 },
      audit: { lastRunAt: sevenDaysAgo.toISOString(), totalIssues: 5, critical: 1, warning: 2, info: 2 },
      inventory: { total: 0, needsRefresh: 0, outdated: 0, healthy: 0 },
      articles: { total: 0, published: 0, draft: 0, inReview: 0 },
    });

    expect(dashboard.audit.isStale).toBe(true);
  });

  it("marks audit as fresh when last run is within 7 days", () => {
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const dashboard = aggregateWorkspaceDashboard({
      workspaceId: "audit-workspace",
      keywords: { total: 0, tracking: 0, top3: 0, top10: 0, top20: 0 },
      contentScores: { total: 0, avgContentScore: 0, avgGeoScore: 0, above70: 0, below50: 0 },
      citations: { total: 0, avgScore: 0, appearing: 0, notAppearing: 0 },
      backlinks: { total: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0, contacted: 0 },
      audit: { lastRunAt: threeDaysAgo.toISOString(), totalIssues: 5, critical: 1, warning: 2, info: 2 },
      inventory: { total: 0, needsRefresh: 0, outdated: 0, healthy: 0 },
      articles: { total: 0, published: 0, draft: 0, inReview: 0 },
    });

    expect(dashboard.audit.isStale).toBe(false);
  });

  it("calculates inventory health percentage correctly", () => {
    const dashboard = aggregateWorkspaceDashboard({
      workspaceId: "inventory-workspace",
      keywords: { total: 0, tracking: 0, top3: 0, top10: 0, top20: 0 },
      contentScores: { total: 0, avgContentScore: 0, avgGeoScore: 0, above70: 0, below50: 0 },
      citations: { total: 0, avgScore: 0, appearing: 0, notAppearing: 0 },
      backlinks: { total: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0, contacted: 0 },
      audit: { lastRunAt: null, totalIssues: 0, critical: 0, warning: 0, info: 0 },
      inventory: { total: 40, needsRefresh: 8, outdated: 4, healthy: 28 },
      articles: { total: 0, published: 0, draft: 0, inReview: 0 },
    });

    expect(dashboard.inventory.healthPercentage).toBe(70);
  });

  it("calculates article publish rate correctly", () => {
    const dashboard = aggregateWorkspaceDashboard({
      workspaceId: "article-workspace",
      keywords: { total: 0, tracking: 0, top3: 0, top10: 0, top20: 0 },
      contentScores: { total: 0, avgContentScore: 0, avgGeoScore: 0, above70: 0, below50: 0 },
      citations: { total: 0, avgScore: 0, appearing: 0, notAppearing: 0 },
      backlinks: { total: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0, contacted: 0 },
      audit: { lastRunAt: null, totalIssues: 0, critical: 0, warning: 0, info: 0 },
      inventory: { total: 0, needsRefresh: 0, outdated: 0, healthy: 0 },
      articles: { total: 25, published: 18, draft: 5, inReview: 2 },
    });

    expect(dashboard.articles.publishRate).toBe(72);
  });

  it("returns overall health score as weighted average", () => {
    const dashboard = aggregateWorkspaceDashboard({
      workspaceId: "health-workspace",
      keywords: { total: 100, tracking: 80, top3: 20, top10: 35, top20: 50 },
      contentScores: { total: 20, avgContentScore: 75, avgGeoScore: 70, above70: 15, below50: 2 },
      citations: { total: 50, avgScore: 0.7, appearing: 35, notAppearing: 15 },
      backlinks: { total: 100, highPriority: 20, mediumPriority: 30, lowPriority: 50, contacted: 45 },
      audit: { lastRunAt: new Date().toISOString(), totalIssues: 10, critical: 1, warning: 4, info: 5 },
      inventory: { total: 40, needsRefresh: 5, outdated: 3, healthy: 32 },
      articles: { total: 25, published: 20, draft: 3, inReview: 2 },
    });

    expect(dashboard.overallHealth).toBeGreaterThan(0);
    expect(dashboard.overallHealth).toBeLessThanOrEqual(100);
  });

  it("handles zero total gracefully in percentage calculations", () => {
    const dashboard = aggregateWorkspaceDashboard({
      workspaceId: "zero-workspace",
      keywords: { total: 0, tracking: 0, top3: 0, top10: 0, top20: 0 },
      contentScores: { total: 0, avgContentScore: 0, avgGeoScore: 0, above70: 0, below50: 0 },
      citations: { total: 0, avgScore: 0, appearing: 0, notAppearing: 0 },
      backlinks: { total: 0, highPriority: 0, mediumPriority: 0, lowPriority: 0, contacted: 0 },
      audit: { lastRunAt: null, totalIssues: 0, critical: 0, warning: 0, info: 0 },
      inventory: { total: 0, needsRefresh: 0, outdated: 0, healthy: 0 },
      articles: { total: 0, published: 0, draft: 0, inReview: 0 },
    });

    expect(dashboard.keywords.healthPercentage).toBe(0);
    expect(dashboard.contentScores.passRate).toBe(0);
    expect(dashboard.citations.visibilityRate).toBe(0);
    expect(dashboard.backlinks.contactRate).toBe(0);
    expect(dashboard.inventory.healthPercentage).toBe(0);
    expect(dashboard.articles.publishRate).toBe(0);
    expect(dashboard.overallHealth).toBe(0);
  });
});
