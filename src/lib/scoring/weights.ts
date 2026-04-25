import type { ContentScore, GeoScore } from "@/lib/scoring/types";

export const contentWeights: Record<keyof Omit<ContentScore, "overall">, number> = {
  termFrequency: 0.2,
  entityCoverage: 0.16,
  headingStructure: 0.14,
  wordCount: 0.1,
  readability: 0.12,
  internalLinks: 0.1,
  geoSignals: 0.18,
};

export const geoWeights: Record<keyof Omit<GeoScore, "overall">, number> = {
  entityAuthority: 0.22,
  factualDensity: 0.24,
  answerFormat: 0.2,
  sourceCredibility: 0.18,
  freshness: 0.16,
};
