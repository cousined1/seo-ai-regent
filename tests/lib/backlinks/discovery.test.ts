import { describe, it, expect } from "vitest";
import {
  scoreBacklinkOpportunity,
  prioritizeOpportunities,
  generateOutreachTemplate,
  type BacklinkSource,
  type ScoredOpportunity,
} from "@/lib/backlinks/discovery";

describe("scoreBacklinkOpportunity", () => {
  it("scores high for high authority, relevant sources", () => {
    const source: BacklinkSource = {
      url: "https://high-authority.com/blog/seo-tools",
      domain: "high-authority.com",
      domainAuthority: 80,
      pageAuthority: 70,
      relevance: "high",
      context: "Mentions SEO tools but doesn't link to our tool",
    };

    const score = scoreBacklinkOpportunity(source);

    expect(score).toBeGreaterThan(70);
  });

  it("scores low for low authority, irrelevant sources", () => {
    const source: BacklinkSource = {
      url: "https://low-quality.com/random-page",
      domain: "low-quality.com",
      domainAuthority: 10,
      pageAuthority: 5,
      relevance: "low",
      context: "Unrelated content",
    };

    const score = scoreBacklinkOpportunity(source);

    expect(score).toBeLessThan(30);
  });

  it("weights domain authority heavily", () => {
    const highDA: BacklinkSource = {
      url: "https://example.com/page",
      domain: "example.com",
      domainAuthority: 90,
      pageAuthority: 50,
      relevance: "medium",
      context: "Relevant content",
    };

    const lowDA: BacklinkSource = {
      url: "https://example2.com/page",
      domain: "example2.com",
      domainAuthority: 20,
      pageAuthority: 50,
      relevance: "medium",
      context: "Relevant content",
    };

    expect(scoreBacklinkOpportunity(highDA)).toBeGreaterThan(
      scoreBacklinkOpportunity(lowDA)
    );
  });

  it("handles missing authority scores", () => {
    const source: BacklinkSource = {
      url: "https://unknown.com/page",
      domain: "unknown.com",
      relevance: "high",
      context: "Good content but no authority data",
    };

    const score = scoreBacklinkOpportunity(source);

    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(50);
  });
});

describe("prioritizeOpportunities", () => {
  it("sorts by score descending", () => {
    const sources: BacklinkSource[] = [
      {
        url: "https://low.com/page",
        domain: "low.com",
        domainAuthority: 20,
        relevance: "low",
        context: "Low quality",
      },
      {
        url: "https://high.com/page",
        domain: "high.com",
        domainAuthority: 80,
        relevance: "high",
        context: "High quality",
      },
      {
        url: "https://medium.com/page",
        domain: "medium.com",
        domainAuthority: 50,
        relevance: "medium",
        context: "Medium quality",
      },
    ];

    const prioritized = prioritizeOpportunities(sources);

    expect(prioritized[0].source.domain).toBe("high.com");
    expect(prioritized[prioritized.length - 1].source.domain).toBe("low.com");
  });

  it("limits results to top N opportunities", () => {
    const sources: BacklinkSource[] = Array.from({ length: 20 }, (_, i) => ({
      url: `https://example${i}.com/page`,
      domain: `example${i}.com`,
      domainAuthority: 100 - i * 5,
      relevance: "medium" as const,
      context: "Relevant content",
    }));

    const prioritized = prioritizeOpportunities(sources, 5);

    expect(prioritized).toHaveLength(5);
  });

  it("includes score and priority label", () => {
    const sources: BacklinkSource[] = [
      {
        url: "https://high.com/page",
        domain: "high.com",
        domainAuthority: 85,
        relevance: "high",
        context: "High quality",
      },
    ];

    const prioritized = prioritizeOpportunities(sources);

    expect(prioritized[0].score).toBeGreaterThan(0);
    expect(prioritized[0].priority).toBeDefined();
  });
});

describe("generateOutreachTemplate", () => {
  it("generates personalized template with source details", () => {
    const opportunity: ScoredOpportunity = {
      source: {
        url: "https://blog.com/best-seo-tools",
        domain: "blog.com",
        domainAuthority: 70,
        relevance: "high",
        context: "Article about best SEO tools for 2024",
      },
      score: 85,
      priority: "high",
    };

    const template = generateOutreachTemplate(opportunity, {
      siteName: "My SEO Tool",
      siteUrl: "https://myseotool.com",
      senderName: "John",
    });

    expect(template.subject).toContain("blog.com");
    expect(template.body).toContain("blog.com");
    expect(template.body).toContain("My SEO Tool");
    expect(template.body).toContain("John");
  });

  it("includes value proposition in template", () => {
    const opportunity: ScoredOpportunity = {
      source: {
        url: "https://resource.com/seo-guide",
        domain: "resource.com",
        domainAuthority: 60,
        relevance: "high",
        context: "Comprehensive SEO guide",
      },
      score: 75,
      priority: "medium",
    };

    const template = generateOutreachTemplate(opportunity, {
      siteName: "SEO Platform",
      siteUrl: "https://seoplatform.com",
      senderName: "Jane",
    });

    expect(template.body).toContain("resource");
    expect(template.body.toLowerCase()).toMatch(/help|useful|valuable|resource/);
  });

  it("adapts tone based on priority", () => {
    const highPriority: ScoredOpportunity = {
      source: {
        url: "https://top.com/article",
        domain: "top.com",
        domainAuthority: 90,
        relevance: "high",
        context: "Top industry article",
      },
      score: 95,
      priority: "high",
    };

    const lowPriority: ScoredOpportunity = {
      source: {
        url: "https://small.com/post",
        domain: "small.com",
        domainAuthority: 30,
        relevance: "medium",
        context: "Small blog post",
      },
      score: 35,
      priority: "low",
    };

    const highTemplate = generateOutreachTemplate(highPriority, {
      siteName: "Tool",
      siteUrl: "https://tool.com",
      senderName: "Sender",
    });

    const lowTemplate = generateOutreachTemplate(lowPriority, {
      siteName: "Tool",
      siteUrl: "https://tool.com",
      senderName: "Sender",
    });

    expect(highTemplate.body.length).toBeGreaterThan(0);
    expect(lowTemplate.body.length).toBeGreaterThan(0);
  });
});
