export interface RefreshCandidate {
  url: string;
  title: string | null;
  contentScore: number;
  geoScore: number;
  issues: string[];
  impactScore: number;
}

export interface RefreshImpactInput {
  contentScore: number;
  geoScore: number;
  issueCount: number;
  hasTraffic: boolean;
}

export function calculateRefreshImpact(input: RefreshImpactInput): number {
  if (input.contentScore >= 90 && input.geoScore >= 90 && input.issueCount === 0) {
    return 0;
  }

  const scoreGap = (100 - input.contentScore) * 0.4 + (100 - input.geoScore) * 0.3;
  const issueWeight = Math.min(input.issueCount * 8, 32);
  const trafficBoost = input.hasTraffic ? 1.3 : 1;

  const rawImpact = (scoreGap + issueWeight) * trafficBoost;

  return Math.min(Math.round(rawImpact), 100);
}

export function prioritizeRefreshOpportunities(
  candidates: RefreshCandidate[],
): RefreshCandidate[] {
  return candidates
    .filter((c) => c.issues.length > 0)
    .sort((a, b) => b.impactScore - a.impactScore);
}

export interface RefreshBriefRecommendation {
  type: string;
  description: string;
  expectedLift: string;
  effort: "low" | "medium" | "high";
}

export function generateRefreshRecommendations(
  contentScore: number,
  geoScore: number,
  issues: string[],
): RefreshBriefRecommendation[] {
  const recommendations: RefreshBriefRecommendation[] = [];

  if (issues.includes("THIN_CONTENT") || issues.includes("LOW_WORD_COUNT")) {
    recommendations.push({
      type: "content_expansion",
      description: "Expand content to at least 300 words with relevant details, examples, and supporting evidence.",
      expectedLift: "+15-25 Content Score pts",
      effort: "medium",
    });
  }

  if (issues.includes("MISSING_TITLE") || issues.includes("SHORT_TITLE")) {
    recommendations.push({
      type: "title_optimization",
      description: "Add or rewrite title tag to be 30-60 characters, include target keyword near the beginning.",
      expectedLift: "+5-10 Content Score pts",
      effort: "low",
    });
  }

  if (issues.includes("MISSING_META_DESCRIPTION") || issues.includes("SHORT_META_DESCRIPTION")) {
    recommendations.push({
      type: "meta_description",
      description: "Add or expand meta description to 120-160 characters with a clear value proposition.",
      expectedLift: "+3-8 Content Score pts",
      effort: "low",
    });
  }

  if (geoScore < 50) {
    recommendations.push({
      type: "geo_improvement",
      description: "Add authoritative entity references, factual data points, and answer-first paragraphs to improve AI-search visibility.",
      expectedLift: "+15-30 GEO Score pts",
      effort: "high",
    });
  }

  if (contentScore < 50 && geoScore < 50) {
    recommendations.push({
      type: "full_refresh",
      description: "This page needs comprehensive refresh. Consider rewriting with current data, proper structure, and AI-search optimization.",
      expectedLift: "+30-50 combined pts",
      effort: "high",
    });
  }

  return recommendations;
}
