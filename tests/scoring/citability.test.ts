import { describe, expect, it } from "vitest";

import {
  analyzeCitabilityBlocks,
  scoreCitabilityPassage,
} from "@/lib/scoring/citability";

describe("citability scoring", () => {
  it("rewards answer-first, fact-rich, self-contained passages", () => {
    const result = scoreCitabilityPassage(
      "Content delivery networks are distributed server systems that cache and serve web content from locations close to end users. A CDN reduces latency by 50-70% on average and improves availability during traffic spikes. According to Gartner's 2025 infrastructure guidance, the largest CDN providers are Cloudflare, Amazon CloudFront, and Akamai.",
      "What is a content delivery network?",
    );

    expect(result.totalScore).toBeGreaterThanOrEqual(70);
    expect(result.grade).toMatch(/[AB]/);
    expect(result.breakdown.answerBlockQuality).toBeGreaterThan(15);
    expect(result.breakdown.statisticalDensity).toBeGreaterThan(5);
  });

  it("penalizes vague narrative passages with no extractable answer", () => {
    const result = scoreCitabilityPassage(
      "If you've ever wondered why some websites load faster than others, the answer might surprise you. There is amazing technology out there and it changes the way people think about performance. Let me explain why it matters for your business.",
      "Performance thoughts",
    );

    expect(result.totalScore).toBeLessThan(55);
    expect(result.breakdown.answerBlockQuality).toBeLessThan(20);
    expect(result.breakdown.statisticalDensity).toBe(0);
  });

  it("summarizes block-level coverage for a page", () => {
    const summary = analyzeCitabilityBlocks([
      {
        heading: "What is GEO scoring?",
        content:
          "GEO scoring is an AI-search visibility model that measures whether a passage can be extracted, trusted, and cited. According to OpenAI and Perplexity retrieval patterns observed in 2025, answer-first passages with explicit facts can improve citation likelihood by 40% compared with vague narrative copy. SEO AI Regent uses explicit answers, statistics, and named entities to improve extractability in systems like ChatGPT and Perplexity.",
      },
      {
        heading: "Loose introduction",
        content:
          "This topic is interesting and there are many things to say about it. People talk about it often, and the nuances matter over time.",
      },
    ]);

    expect(summary.totalBlocksAnalyzed).toBe(2);
    expect(summary.citabilityCoverage).toBeGreaterThanOrEqual(50);
    expect(summary.topBlocks[0]?.heading).toMatch(/geo scoring/i);
  });
});
