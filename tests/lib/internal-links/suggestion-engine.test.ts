import { describe, it, expect } from "vitest";
import {
  generateLinkSuggestions,
  extractKeywordsFromContent,
  findLinkTargets,
  calculateConfidence,
  type LinkSuggestion,
  type ContentNode,
  type ArticleMetadata,
} from "@/lib/internal-links/suggestion-engine";

describe("extractKeywordsFromContent", () => {
  it("extracts keywords from TipTap JSON content", () => {
    const content: ContentNode = {
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 1 },
          content: [{ type: "text", text: "SEO Tools Guide" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "The best keyword research tools help you find opportunities." },
          ],
        },
      ],
    };

    const keywords = extractKeywordsFromContent(content);

    expect(keywords).toContain("seo tools guide");
    expect(keywords.length).toBeGreaterThan(0);
  });

  it("handles empty content", () => {
    const content: ContentNode = { type: "doc", content: [] };
    const keywords = extractKeywordsFromContent(content);
    expect(keywords).toHaveLength(0);
  });

  it("extracts keywords from nested content", () => {
    const content: ContentNode = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              marks: [{ type: "bold" }],
              text: "Backlink analysis",
            },
            { type: "text", text: " is important for " },
            {
              type: "text",
              marks: [{ type: "italic" }],
              text: "link building strategy",
            },
          ],
        },
      ],
    };

    const keywords = extractKeywordsFromContent(content);

    expect(keywords).toContain("backlink analysis");
    expect(keywords).toContain("link building strategy");
  });
});

describe("findLinkTargets", () => {
  it("finds articles that match extracted keywords", () => {
    const keywords = ["seo tools", "keyword research", "backlink analysis"];
    const articles: ArticleMetadata[] = [
      { id: "1", title: "Best SEO Tools for 2024", keyword: "seo tools" },
      { id: "2", title: "Keyword Research Guide", keyword: "keyword research" },
      { id: "3", title: "Content Writing Tips", keyword: "content writing" },
    ];

    const targets = findLinkTargets(keywords, articles, "current-article");

    expect(targets).toHaveLength(2);
    expect(targets[0].articleId).toBe("1");
    expect(targets[0].matchedKeyword).toBe("seo tools");
  });

  it("excludes the current article from targets", () => {
    const keywords = ["seo tools"];
    const articles: ArticleMetadata[] = [
      { id: "current", title: "SEO Tools Overview", keyword: "seo tools" },
    ];

    const targets = findLinkTargets(keywords, articles, "current");

    expect(targets).toHaveLength(0);
  });

  it("handles no matching articles", () => {
    const keywords = ["unique keyword"];
    const articles: ArticleMetadata[] = [
      { id: "1", title: "Different Topic", keyword: "different topic" },
    ];

    const targets = findLinkTargets(keywords, articles, "current");

    expect(targets).toHaveLength(0);
  });
});

describe("calculateConfidence", () => {
  it("returns high confidence for exact keyword match", () => {
    const confidence = calculateConfidence({
      matchType: "exact",
      keywordRelevance: 0.9,
      contentScore: 75,
      existingLinks: 2,
    });

    expect(confidence).toBeGreaterThanOrEqual(0.7);
  });

  it("returns medium confidence for partial match", () => {
    const confidence = calculateConfidence({
      matchType: "partial",
      keywordRelevance: 0.6,
      contentScore: 60,
      existingLinks: 5,
    });

    expect(confidence).toBeGreaterThanOrEqual(0.3);
    expect(confidence).toBeLessThan(0.7);
  });

  it("returns low confidence for weak signals", () => {
    const confidence = calculateConfidence({
      matchType: "partial",
      keywordRelevance: 0.2,
      contentScore: 40,
      existingLinks: 10,
    });

    expect(confidence).toBeLessThan(0.3);
  });

  it("penalizes pages with many existing links", () => {
    const highLinks = calculateConfidence({
      matchType: "exact",
      keywordRelevance: 0.9,
      contentScore: 75,
      existingLinks: 15,
    });

    const lowLinks = calculateConfidence({
      matchType: "exact",
      keywordRelevance: 0.9,
      contentScore: 75,
      existingLinks: 1,
    });

    expect(highLinks).toBeLessThan(lowLinks);
  });
});

describe("generateLinkSuggestions", () => {
  it("generates suggestions with anchor text and rationale", () => {
    const content: ContentNode = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Use keyword research tools to find opportunities." },
          ],
        },
      ],
    };

    const articles: ArticleMetadata[] = [
      { id: "1", title: "Keyword Research Guide", keyword: "keyword research" },
    ];

    const suggestions = generateLinkSuggestions(content, articles, "current");

    expect(suggestions).toHaveLength(1);
    expect(suggestions[0].targetId).toBe("1");
    expect(suggestions[0].anchorText).toContain("keyword research");
    expect(suggestions[0].rationale).toContain("keyword research");
  });

  it("does not suggest links to the same article", () => {
    const content: ContentNode = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "This is about seo tools." }],
        },
      ],
    };

    const articles: ArticleMetadata[] = [
      { id: "current", title: "SEO Tools", keyword: "seo tools" },
    ];

    const suggestions = generateLinkSuggestions(content, articles, "current");

    expect(suggestions).toHaveLength(0);
  });

  it("limits suggestions by confidence threshold", () => {
    const content: ContentNode = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Some weak match content here." }],
        },
      ],
    };

    const articles: ArticleMetadata[] = [
      { id: "1", title: "Unrelated Topic", keyword: "unrelated" },
    ];

    const suggestions = generateLinkSuggestions(content, articles, "current");

    expect(suggestions).toHaveLength(0);
  });

  it("includes score impact estimate", () => {
    const content: ContentNode = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Learn about keyword research and seo tools." }],
        },
      ],
    };

    const articles: ArticleMetadata[] = [
      { id: "1", title: "Keyword Research Guide", keyword: "keyword research" },
      { id: "2", title: "SEO Tools Review", keyword: "seo tools" },
    ];

    const suggestions = generateLinkSuggestions(content, articles, "current");

    for (const suggestion of suggestions) {
      expect(suggestion.scoreImpact).toBeDefined();
      expect(suggestion.scoreImpact).toBeGreaterThan(0);
    }
  });
});
