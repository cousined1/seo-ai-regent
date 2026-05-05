import { scoreContent } from "@/lib/scoring/content-score";
import { scoreGeo } from "@/lib/scoring/geo-score";
import { explainScore } from "@/lib/scoring/explain-score";
import { deriveTopActions } from "@/lib/scoring/top-actions";
import type { ContentScore, GeoScore, TopAction } from "@/lib/scoring/types";

export type ArticleTemplate = "pillar" | "listicle" | "how-to" | "comparison" | "faq";

export interface GenerateArticleInput {
  keyword: string;
  template: ArticleTemplate;
  targetWordCount?: number;
}

export interface TipTapNode {
  type: string;
  content?: TipTapNode[];
  text?: string;
  attrs?: Record<string, unknown>;
}

export interface GeneratedArticle {
  title: string;
  content: TipTapNode;
  keyword: string;
  metaTitle: string;
  metaDescription: string;
  wordCount: number;
}

const templateStructures: Record<ArticleTemplate, { headings: string[]; sectionType: string }> = {
  pillar: {
    headings: ["Introduction", "What It Is", "Why It Matters", "Key Components", "Best Practices", "Implementation Steps", "Common Mistakes", "Conclusion"],
    sectionType: "comprehensive",
  },
  listicle: {
    headings: ["Introduction", "Top Picks Overview", "Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "How to Choose", "Final Thoughts"],
    sectionType: "numbered",
  },
  "how-to": {
    headings: ["Introduction", "Prerequisites", "Step 1: Preparation", "Step 2: Setup", "Step 3: Implementation", "Step 4: Testing", "Step 5: Optimization", "Troubleshooting", "Conclusion"],
    sectionType: "steps",
  },
  comparison: {
    headings: ["Introduction", "Overview of Options", "Option A Analysis", "Option B Analysis", "Feature Comparison", "Pros and Cons", "Which Is Right for You", "Conclusion"],
    sectionType: "comparison",
  },
  faq: {
    headings: ["Introduction", "Frequently Asked Questions", "What Is It?", "How Does It Work?", "Why Is It Important?", "What Are the Benefits?", "How to Get Started", "Common Issues", "Conclusion"],
    sectionType: "qa",
  },
};

function generateParagraph(text: string): TipTapNode {
  return {
    type: "paragraph",
    content: [{ type: "text", text }],
  };
}

function generateHeading(level: number, text: string): TipTapNode {
  return {
    type: `heading`,
    attrs: { level },
    content: [{ type: "text", text }],
  };
}

function generateSectionContent(keyword: string, heading: string, sectionType: string, index: number): TipTapNode[] {
  const nodes: TipTapNode[] = [];
  nodes.push(generateHeading(2, heading));

  const paragraphs = getSectionParagraphs(keyword, heading, sectionType, index);
  for (const p of paragraphs) {
    nodes.push(generateParagraph(p));
  }

  if (index > 0 && index % 3 === 0) {
    nodes.push(generateHeading(3, `Key Takeaways`));
    nodes.push(generateParagraph(`When considering ${keyword} in the context of ${heading.toLowerCase()}, focus on measurable outcomes and data-driven decisions.`));
  }

  return nodes;
}

function getSectionParagraphs(keyword: string, heading: string, sectionType: string, index: number): string[] {
  const keywordCapitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1);

  const paragraphTemplates: Record<string, string[]> = {
    comprehensive: [
      `${keywordCapitalized} has become a critical consideration for organizations looking to improve their digital presence. Understanding the fundamentals of ${keyword.toLowerCase()} is essential for anyone working in this space.`,
      `The landscape of ${keyword.toLowerCase()} continues to evolve as search engines and AI systems become more sophisticated. Organizations that stay ahead of these changes gain a significant competitive advantage.`,
      `Research shows that effective ${keyword.toLowerCase()} strategies can improve visibility by 40-60% when implemented correctly. The key is to focus on quality, relevance, and user intent.`,
      `Industry leaders recommend a systematic approach to ${keyword.toLowerCase()} that combines technical optimization with content quality. This dual focus ensures both search engine and AI system compatibility.`,
    ],
    numbered: [
      `This ${heading.toLowerCase()} represents one of the most effective approaches to ${keyword.toLowerCase()}. Organizations using this method report measurable improvements in their key metrics.`,
      `When evaluating options for ${keyword.toLowerCase()}, consider factors such as ease of implementation, cost, and expected return on investment. The right choice depends on your specific goals and resources.`,
      `Data from recent studies indicates that ${keywordCapitalized} solutions in this category deliver an average ROI of 3.2x within the first year of implementation.`,
      `The key differentiator for this approach is its focus on sustainable, long-term results rather than short-term gains. This makes it particularly valuable for organizations planning their content strategy.`,
    ],
    steps: [
      `Before beginning this step, ensure you have the necessary prerequisites in place. This includes access to your analytics platform, content management system, and any relevant API keys.`,
      `The implementation process for ${keyword.toLowerCase()} requires careful attention to detail. Follow each sub-step methodically to avoid common pitfalls.`,
      `After completing this step, verify your results using the testing methods described in the next section. Proper validation ensures your ${keyword.toLowerCase()} efforts are producing the intended outcomes.`,
      `Pro tip: Document your process as you go. This creates a reusable template that can be applied to future ${keyword.toLowerCase()} projects across your organization.`,
    ],
    comparison: [
      `When comparing options for ${keyword.toLowerCase()}, it's important to evaluate each solution against your specific requirements. What works for one organization may not be the best fit for another.`,
      `The primary differentiator between these approaches lies in their underlying methodology. Understanding these differences is crucial for making an informed decision about ${keyword.toLowerCase()}.`,
      `Cost analysis shows that while initial investment varies, the long-term value proposition of ${keyword.toLowerCase()} solutions tends to converge around similar ROI thresholds.`,
      `User feedback consistently highlights ease of use and integration capabilities as the most important factors when selecting a ${keyword.toLowerCase()} solution.`,
    ],
    qa: [
      `This is one of the most common questions about ${keyword.toLowerCase()}. The answer depends on several factors including your industry, target audience, and current digital maturity.`,
      `Understanding how ${keyword.toLowerCase()} works requires looking at both the technical and strategic components. At its core, it's about matching user intent with relevant, high-quality content.`,
      `The importance of ${keywordCapitalized} has grown significantly with the rise of AI search systems. Organizations that optimize for both traditional search and AI answer engines see the best results.`,
      `Getting started with ${keyword.toLowerCase()} begins with an audit of your current content and technical setup. This baseline assessment identifies the highest-impact opportunities for improvement.`,
    ],
  };

  const templates = paragraphTemplates[sectionType] ?? paragraphTemplates.comprehensive;
  return [templates[index % templates.length]];
}

export function generateArticleContent(input: GenerateArticleInput): TipTapNode {
  const template = templateStructures[input.template];
  const targetWords = input.targetWordCount ?? 500;
  const content: TipTapNode[] = [];

  content.push(generateHeading(1, `${input.keyword.charAt(0).toUpperCase() + input.keyword.slice(1)}: The Complete Guide`));
  content.push(generateParagraph(`This comprehensive guide covers everything you need to know about ${input.keyword}. Whether you're just getting started or looking to optimize your existing strategy, you'll find actionable insights and data-driven recommendations.`));

  for (let i = 0; i < template.headings.length; i++) {
    const sectionNodes = generateSectionContent(input.keyword, template.headings[i], template.sectionType, i);
    content.push(...sectionNodes);
  }

  content.push(generateHeading(2, "Next Steps"));
  content.push(generateParagraph(`Ready to implement ${input.keyword} in your organization? Start with a content audit, prioritize the highest-impact opportunities, and build a systematic approach to optimization.`));

  return {
    type: "doc",
    content,
  };
}

export interface PublishEligibilityInput {
  contentScore: number;
  geoScore: number | null;
}

export interface PublishEligibilityResult {
  eligible: boolean;
  blockedReason: string | null;
}

export function checkPublishEligibility(input: PublishEligibilityInput): PublishEligibilityResult {
  if (input.contentScore < 70) {
    return {
      eligible: false,
      blockedReason: `Content Score ${input.contentScore}/100 is below the 70-point threshold. Improve content quality before publishing.`,
    };
  }

  if (input.geoScore === null || input.geoScore < 70) {
    const score = input.geoScore ?? "not computed";
    return {
      eligible: false,
      blockedReason: `GEO Score ${score}/100 is below the 70-point threshold. Improve AI-search visibility before publishing.`,
    };
  }

  return {
    eligible: true,
    blockedReason: null,
  };
}

export interface ReviewGateInput {
  contentScore: number;
  geoScore: number;
  issues: string[];
}

export interface ReviewGateResult {
  status: "pass" | "review" | "block";
  requiresReview: boolean;
  blockedActions: string[];
  improvements: string[];
}

export function evaluateReviewGate(input: ReviewGateInput): ReviewGateResult {
  const blockedActions: string[] = [];
  const improvements: string[] = [];
  let status: "pass" | "review" | "block" = "pass";

  const hasCriticalIssues = input.issues.some(
    (i) => i === "THIN_CONTENT" || i === "MISSING_TITLE" || i === "MISSING_META_DESCRIPTION",
  );

  if (input.contentScore < 50 || input.geoScore < 50) {
    status = "block";
    blockedActions.push("publish");
    blockedActions.push("schedule");
  } else if (input.contentScore < 70 || input.geoScore < 70 || hasCriticalIssues) {
    status = "review";
    blockedActions.push("publish");
  }

  if (input.contentScore < 70) {
    improvements.push(`Increase Content Score from ${input.contentScore} to 70+ by improving keyword coverage, entity density, and heading structure.`);
  }

  if (input.geoScore < 70) {
    improvements.push(`Increase GEO Score from ${input.geoScore} to 70+ by adding authoritative citations, factual data, and answer-first paragraphs.`);
  }

  if (input.issues.includes("THIN_CONTENT")) {
    improvements.push("Expand content to at least 300 words with relevant details and supporting evidence.");
  }

  if (input.issues.includes("MISSING_TITLE")) {
    improvements.push("Add a descriptive title tag (30-60 characters) with the target keyword.");
  }

  if (input.issues.includes("MISSING_META_DESCRIPTION")) {
    improvements.push("Add a meta description (120-160 characters) with a clear value proposition.");
  }

  return {
    status,
    requiresReview: status !== "pass",
    blockedActions,
    improvements,
  };
}

export interface ScoreArticleResult {
  contentScore: ContentScore;
  geoScore: GeoScore;
  breakdown: Array<{ signal: string; score: number; weight: number; contribution: number; status: string }>;
  topActions: TopAction[];
  eligibility: PublishEligibilityResult;
  reviewGate: ReviewGateResult;
}

export function scoreArticle(keyword: string, content: TipTapNode): ScoreArticleResult {
  const textContent = extractTextFromTipTap(content);
  const geoResult = scoreGeo(textContent);
  const contentScoreResult = scoreContent(keyword, textContent, geoResult.score.overall);
  const breakdown = explainScore(contentScoreResult);
  const topActions = deriveTopActions({ content: contentScoreResult, geo: geoResult.score });
  const eligibility = checkPublishEligibility({
    contentScore: Math.round(contentScoreResult.overall),
    geoScore: Math.round(geoResult.score.overall),
  });
  const reviewGate = evaluateReviewGate({
    contentScore: Math.round(contentScoreResult.overall),
    geoScore: Math.round(geoResult.score.overall),
    issues: [],
  });

  return {
    contentScore: contentScoreResult,
    geoScore: geoResult.score,
    breakdown,
    topActions,
    eligibility,
    reviewGate,
  };
}

function extractTextFromTipTap(node: TipTapNode): string {
  if (node.text) {
    return node.text;
  }

  if (node.content) {
    return node.content.map(extractTextFromTipTap).join(" ");
  }

  return "";
}
