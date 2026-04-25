import { deriveTerms } from "@/lib/scoring/term-analysis";
import type { TermsBuckets } from "@/lib/scoring/types";

export interface SerpTopResult {
  title: string;
  url: string;
  snippet: string;
}

export interface KeywordResearch {
  keyword: string;
  topResults: SerpTopResult[];
  terms: TermsBuckets;
  source: "heuristic";
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildHeuristicResults(keyword: string): SerpTopResult[] {
  const slug = slugify(keyword);

  return [
    {
      title: `${keyword} guide`,
      url: `https://example.com/${slug}`,
      snippet: `Editorial guide covering ${keyword} with definitions, examples, and implementation advice.`,
    },
    {
      title: `${keyword} examples`,
      url: `https://example.com/${slug}-examples`,
      snippet: `Examples, comparisons, and score-driving patterns related to ${keyword}.`,
    },
    {
      title: `${keyword} checklist`,
      url: `https://example.com/${slug}-checklist`,
      snippet: `Checklist for improving ${keyword} performance across search and AI answer engines.`,
    },
  ];
}

export async function analyzeKeyword(keyword: string): Promise<KeywordResearch> {
  const normalizedKeyword = keyword.trim().toLowerCase();
  const syntheticContext = `${normalizedKeyword}. editorial system. citations. internal links. named entities. ai search visibility.`;

  return {
    keyword: normalizedKeyword,
    topResults: buildHeuristicResults(normalizedKeyword),
    terms: deriveTerms(normalizedKeyword, syntheticContext),
    source: "heuristic",
  };
}
