import { scoreCitabilityPassage, type CitabilityScore } from "@/lib/scoring/citability";
import type { GeoScore } from "@/lib/scoring/types";
import { geoWeights } from "@/lib/scoring/weights";

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function round(value: number) {
  return Number(value.toFixed(2));
}

function scoreEntityAuthority(content: string) {
  const entities = content.match(/\b(?:Google|OpenAI|Anthropic|Perplexity|Gartner|Microsoft|Stanford|MIT|Harvard)\b/g) ?? [];
  const unique = new Set(entities);
  return clamp(unique.size * 20 + (/\baccording to\b/i.test(content) ? 20 : 0));
}

function scoreAnswerFormat(content: string) {
  const firstSentence = content.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean)[0] ?? "";
  let score = 35;

  if (/\b(?:is|are|refers to|means|helps|improve)\b/i.test(firstSentence)) {
    score += 25;
  }

  if (/\baccording to\b/i.test(content)) {
    score += 10;
  }

  if (/\b\d{4}\b/.test(content)) {
    score += 10;
  }

  return clamp(score);
}

function scoreSourceCredibility(content: string) {
  let score = 30;

  if (/\baccording to\b/i.test(content)) {
    score += 20;
  }

  if (/\b(?:Gartner|Forrester|McKinsey|Google|Microsoft|OpenAI|Stanford|MIT|Harvard)\b/.test(content)) {
    score += 30;
  }

  return clamp(score);
}

function scoreFreshness(content: string) {
  const currentYear = new Date().getFullYear();
  const match = content.match(/\b(20\d{2})\b/);

  if (!match) {
    return 45;
  }

  const year = Number(match[1]);
  const age = currentYear - year;

  if (age <= 1) {
    return 88;
  }

  if (age <= 3) {
    return 72;
  }

  if (age <= 5) {
    return 58;
  }

  return 42;
}

export interface GeoScoreResult {
  score: GeoScore;
  citability: CitabilityScore;
}

export function scoreGeo(content: string): GeoScoreResult {
  const citability = scoreCitabilityPassage(content);

  const score: GeoScore = {
    entityAuthority: scoreEntityAuthority(content),
    factualDensity: clamp(citability.totalScore),
    answerFormat: scoreAnswerFormat(content),
    sourceCredibility: scoreSourceCredibility(content),
    freshness: scoreFreshness(content),
    overall: 0,
  };

  const overall = Object.entries(geoWeights).reduce((sum, [signal, weight]) => {
    return sum + score[signal as keyof Omit<GeoScore, "overall">] * weight;
  }, 0);

  score.overall = round(overall);

  return {
    score,
    citability,
  };
}
