import type { ContentScore } from "@/lib/scoring/types";
import { contentWeights } from "@/lib/scoring/weights";

function clamp(value: number) {
  return Math.max(0, Math.min(100, value));
}

function round(value: number) {
  return Number(value.toFixed(2));
}

function scoreTermFrequency(content: string, keyword: string) {
  const normalized = content.toLowerCase();
  const phraseMatches = normalized.match(
    new RegExp(keyword.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
  );

  if (phraseMatches && phraseMatches.length > 0) {
    return clamp(55 + phraseMatches.length * 20);
  }

  const keywordTerms = keyword.toLowerCase().split(/\s+/).filter(Boolean);
  const presentTerms = keywordTerms.filter((term) => normalized.includes(term)).length;

  return clamp((presentTerms / Math.max(keywordTerms.length, 1)) * 100);
}

function scoreEntityCoverage(content: string) {
  const properNouns = content.match(/\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\b/g) ?? [];
  const uniqueEntities = new Set(properNouns.map((item) => item.trim()));

  return clamp(uniqueEntities.size * 18 + (/\b(?:ChatGPT|Perplexity|Google|OpenAI)\b/.test(content) ? 18 : 0));
}

function scoreHeadingStructure(content: string) {
  if (/^\s*#{1,3}\s/m.test(content) || /^\s*[A-Z][A-Z\s]{8,}$/m.test(content)) {
    return 85;
  }

  if (content.includes(":")) {
    return 62;
  }

  return 45;
}

function scoreWordCount(content: string) {
  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;

  if (wordCount >= 120 && wordCount <= 220) {
    return 88;
  }

  if (wordCount >= 80 && wordCount <= 260) {
    return 72;
  }

  if (wordCount >= 45) {
    return 58;
  }

  return 34;
}

function scoreReadability(content: string) {
  const sentences = content.split(/[.!?]+/).map((part) => part.trim()).filter(Boolean);
  const words = content.trim().split(/\s+/).filter(Boolean);
  const averageSentenceLength = sentences.length > 0 ? words.length / sentences.length : words.length;

  if (averageSentenceLength >= 10 && averageSentenceLength <= 22) {
    return 82;
  }

  if (averageSentenceLength >= 8 && averageSentenceLength <= 28) {
    return 70;
  }

  return 52;
}

function scoreInternalLinks(content: string) {
  const markdownLinks = (content.match(/\[[^\]]+\]\(\/[a-z0-9][a-z0-9/_-]*\)/gi) ?? []).length;
  const anchorLinks = (content.match(/href=["']\/[a-z0-9][^"']*["']/gi) ?? []).length;
  const linkCount = markdownLinks + anchorLinks;

  return clamp(linkCount * 35);
}

export function scoreContent(keyword: string, content: string, geoOverall: number): ContentScore {
  const score: ContentScore = {
    termFrequency: scoreTermFrequency(content, keyword),
    entityCoverage: scoreEntityCoverage(content),
    headingStructure: scoreHeadingStructure(content),
    wordCount: scoreWordCount(content),
    readability: scoreReadability(content),
    internalLinks: scoreInternalLinks(content),
    geoSignals: clamp(Math.round(geoOverall)),
    overall: 0,
  };

  const overall = Object.entries(contentWeights).reduce((sum, [signal, weight]) => {
    return sum + score[signal as keyof Omit<ContentScore, "overall">] * weight;
  }, 0);

  score.overall = round(overall);
  return score;
}
