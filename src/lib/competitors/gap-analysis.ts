export interface CompetitorKeyword {
  query: string;
  volume?: number;
  difficulty?: number;
}

export interface SharedKeyword {
  query: string;
  ourPosition?: number;
  competitorPosition?: number;
}

export interface GapAnalysis {
  missingKeywords: CompetitorKeyword[];
  sharedKeywords: SharedKeyword[];
  totalOpportunityVolume: number;
}

export interface ContentPattern {
  mostCommonType: string;
  avgWordCount: number;
  typeDistribution: Record<string, number>;
}

export interface GapRecommendation {
  type: "new_content" | "content_refresh";
  query?: string;
  volume?: number;
  priority: "high" | "medium" | "low";
  rationale: string;
}

export function extractKeywords(
  snapshotData: Array<Record<string, unknown>>
): CompetitorKeyword[] {
  return snapshotData.map((item) => ({
    query: (item.query as string) || "",
    volume: (item.volume as number) || 0,
    difficulty: (item.difficulty as number) || 0,
  }));
}

export function analyzeCompetitorGap(
  competitorKeywords: CompetitorKeyword[],
  ourKeywords: string[]
): GapAnalysis {
  const ourKeywordSet = new Set(ourKeywords.map((k) => k.toLowerCase()));

  const missingKeywords: CompetitorKeyword[] = [];
  const sharedKeywords: SharedKeyword[] = [];

  for (const kw of competitorKeywords) {
    if (ourKeywordSet.has(kw.query.toLowerCase())) {
      sharedKeywords.push({ query: kw.query });
    } else {
      missingKeywords.push(kw);
    }
  }

  const totalOpportunityVolume = missingKeywords.reduce(
    (sum, kw) => sum + (kw.volume || 0),
    0
  );

  return {
    missingKeywords,
    sharedKeywords,
    totalOpportunityVolume,
  };
}

export function detectContentPatterns(
  topPages: Array<Record<string, unknown>>
): ContentPattern {
  if (topPages.length === 0) {
    return {
      mostCommonType: "unknown",
      avgWordCount: 0,
      typeDistribution: {},
    };
  }

  const typeCounts: Record<string, number> = {};
  let totalWordCount = 0;

  for (const page of topPages) {
    const type = (page.type as string) || "unknown";
    typeCounts[type] = (typeCounts[type] || 0) + 1;
    totalWordCount += (page.wordCount as number) || 0;
  }

  const mostCommonType = Object.entries(typeCounts).sort(
    (a, b) => b[1] - a[1]
  )[0][0];

  const avgWordCount = Math.round(totalWordCount / topPages.length);

  return {
    mostCommonType,
    avgWordCount,
    typeDistribution: typeCounts,
  };
}

export function generateGapRecommendations(
  gap: GapAnalysis
): GapRecommendation[] {
  const recommendations: GapRecommendation[] = [];

  for (const kw of gap.missingKeywords) {
    const volume = kw.volume || 0;
    let priority: "high" | "medium" | "low" = "low";

    if (volume >= 5000) {
      priority = "high";
    } else if (volume >= 1000) {
      priority = "medium";
    }

    recommendations.push({
      type: "new_content",
      query: kw.query,
      volume,
      priority,
      rationale: `Create content targeting "${kw.query}" (volume: ${volume.toLocaleString()}, difficulty: ${kw.difficulty || "unknown"}).`,
    });
  }

  for (const shared of gap.sharedKeywords) {
    if (
      shared.ourPosition &&
      shared.competitorPosition &&
      shared.ourPosition > shared.competitorPosition
    ) {
      recommendations.push({
        type: "content_refresh",
        query: shared.query,
        priority: shared.ourPosition > 5 ? "high" : "medium",
        rationale: `Refresh existing content for "${shared.query}" to close gap (our position: ${shared.ourPosition}, competitor: ${shared.competitorPosition}).`,
      });
    }
  }

  recommendations.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return recommendations;
}
