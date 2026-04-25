import { scoreContent } from "@/lib/scoring/content-score";
import { explainScore } from "@/lib/scoring/explain-score";
import { scoreGeo } from "@/lib/scoring/geo-score";
import { deriveTerms } from "@/lib/scoring/term-analysis";
import { deriveTopActions } from "@/lib/scoring/top-actions";

export const demoArticle = {
  title: "How to Start a Blog in 2026",
  keyword: "how to start a blog",
  content:
    "How to start a blog in 2026 begins with a tight niche, a publishing system, and a content model that can rank in Google while remaining extractable for AI search. According to Gartner's 2025 guidance, answer-first sections with named entities and cited evidence improve retrieval quality across systems like ChatGPT and Perplexity.",
};

const { score: computedGeoScore } = scoreGeo(demoArticle.content);
const computedContentScore = scoreContent(
  demoArticle.keyword,
  demoArticle.content,
  computedGeoScore.overall,
);

export const demoContentScore = computedContentScore;
export const demoGeoScore = computedGeoScore;

export const demoTopActions = deriveTopActions({
  content: demoContentScore,
  geo: demoGeoScore,
});

export const demoTerms = deriveTerms(demoArticle.keyword, demoArticle.content);

export const demoContentBreakdown = explainScore(demoContentScore);
export const demoGeoBreakdown = explainScore(demoGeoScore);

export function getDemoWorkspacePayload() {
  return {
    article: demoArticle,
    contentScore: demoContentScore,
    geoScore: demoGeoScore,
    topActions: demoTopActions,
    terms: demoTerms,
    contentBreakdown: demoContentBreakdown,
    geoBreakdown: demoGeoBreakdown,
  };
}
