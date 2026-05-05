import { classifyIntent, type DiscoveredKeyword } from "@/lib/keywords/cluster";
import type { Intent } from "@prisma/client";

export interface SerperSearchResult {
  organic: Array<{
    title: string;
    link: string;
    snippet: string;
    position: number;
  }>;
  peopleAlsoAsk?: Array<{
    question: string;
    snippet: string;
  }>;
  knowledgeGraph?: {
    title: string;
    type: string;
  };
}

export interface SerperAutocompleteResult {
  suggestions: Array<{
    value: string;
   _relevantTopics?: Array<{ topic: string }>;
  }>;
}

function extractSerpFeatures(result: SerperSearchResult): string[] {
  const features: string[] = [];

  if (result.peopleAlsoAsk && result.peopleAlsoAsk.length > 0) {
    features.push("people_also_ask");
  }

  if (result.knowledgeGraph) {
    features.push("knowledge_panel");
  }

  const hasHowTo = result.organic.some((r) =>
    /how\s+to|guide|tutorial|step/i.test(r.title),
  );
  if (hasHowTo) {
    features.push("how_to");
  }

  const hasFeaturedSnippet = result.organic.some((r) =>
    r.snippet.length > 200,
  );
  if (hasFeaturedSnippet) {
    features.push("featured_snippet");
  }

  return features;
}

function estimateVolume(position: number, hasKnowledgePanel: boolean): number {
  const base = Math.max(100, 5000 - position * 400);
  const boost = hasKnowledgePanel ? 1.5 : 1;
  return Math.round(base * boost);
}

function estimateDifficulty(serpFeatures: string[]): number {
  let difficulty = 30;

  if (serpFeatures.includes("knowledge_panel")) difficulty += 15;
  if (serpFeatures.includes("featured_snippet")) difficulty += 10;
  if (serpFeatures.includes("people_also_ask")) difficulty += 5;

  return Math.min(100, difficulty);
}

export async function discoverKeywords(
  seed: string,
  serperApiKey: string,
  maxResults = 20,
): Promise<DiscoveredKeyword[]> {
  const normalizedSeed = seed.trim().toLowerCase();

  const keywords = new Map<string, DiscoveredKeyword>();

  const queries = [
    normalizedSeed,
    `${normalizedSeed} guide`,
    `how to ${normalizedSeed}`,
    `${normalizedSeed} tools`,
    `best ${normalizedSeed}`,
  ];

  for (const query of queries.slice(0, Math.ceil(maxResults / 4))) {
    try {
      const response = await fetch("https://google.serper.dev/search", {
        method: "POST",
        headers: {
          "X-API-KEY": serperApiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ q: query, num: 10 }),
      });

      if (!response.ok) {
        continue;
      }

      const data = (await response.json()) as SerperSearchResult;
      const serpFeatures = extractSerpFeatures(data);
      const intent = classifyIntent(query, serpFeatures);

      for (const result of data.organic.slice(0, 5)) {
        const titleWords = result.title.toLowerCase().split(/\s+/);
        const relevantKeywords = titleWords.filter(
          (w) => w.length > 3 && !/^(the|and|for|with|from|that|this|your|best|top|how|what|why|when|where|who)$/.test(w),
        );

        for (const kw of relevantKeywords.slice(0, 2)) {
          const fullKeyword = `${kw} ${normalizedSeed}`.trim();
          if (!keywords.has(fullKeyword) && fullKeyword.length > 3) {
            keywords.set(fullKeyword, {
              keyword: fullKeyword,
              intent,
              volume: estimateVolume(result.position, !!data.knowledgeGraph),
              difficulty: estimateDifficulty(serpFeatures),
            });
          }
        }
      }
    } catch {
      continue;
    }

    if (keywords.size >= maxResults) {
      break;
    }
  }

  if (keywords.size === 0) {
    keywords.set(normalizedSeed, {
      keyword: normalizedSeed,
      intent: classifyIntent(normalizedSeed, []),
      volume: 500,
      difficulty: 40,
    });
  }

  return [...keywords.values()]
    .sort((a, b) => b.volume - a.volume)
    .slice(0, maxResults);
}

export async function discoverKeywordsHeuristic(
  seed: string,
  maxResults = 20,
): Promise<DiscoveredKeyword[]> {
  const normalizedSeed = seed.trim().toLowerCase();

  const modifiers = [
    { phrase: "", intent: "INFORMATIONAL" as Intent, volumeBoost: 1.0 },
    { phrase: " guide", intent: "INFORMATIONAL" as Intent, volumeBoost: 0.8 },
    { phrase: " how to", intent: "INFORMATIONAL" as Intent, volumeBoost: 0.9 },
    { phrase: " tools", intent: "TRANSACTIONAL" as Intent, volumeBoost: 0.6 },
    { phrase: " software", intent: "TRANSACTIONAL" as Intent, volumeBoost: 0.7 },
    { phrase: " best", intent: "COMMERCIAL" as Intent, volumeBoost: 0.7 },
    { phrase: " vs", intent: "COMMERCIAL" as Intent, volumeBoost: 0.5 },
    { phrase: " login", intent: "NAVIGATIONAL" as Intent, volumeBoost: 0.4 },
    { phrase: " pricing", intent: "TRANSACTIONAL" as Intent, volumeBoost: 0.5 },
    { phrase: " examples", intent: "INFORMATIONAL" as Intent, volumeBoost: 0.6 },
    { phrase: " tutorial", intent: "INFORMATIONAL" as Intent, volumeBoost: 0.7 },
    { phrase: " checklist", intent: "INFORMATIONAL" as Intent, volumeBoost: 0.5 },
    { phrase: " template", intent: "INFORMATIONAL" as Intent, volumeBoost: 0.5 },
    { phrase: " services", intent: "TRANSACTIONAL" as Intent, volumeBoost: 0.6 },
    { phrase: " agency", intent: "TRANSACTIONAL" as Intent, volumeBoost: 0.4 },
    { phrase: " for beginners", intent: "INFORMATIONAL" as Intent, volumeBoost: 0.8 },
    { phrase: " tips", intent: "INFORMATIONAL" as Intent, volumeBoost: 0.6 },
    { phrase: " strategy", intent: "INFORMATIONAL" as Intent, volumeBoost: 0.7 },
    { phrase: " audit", intent: "INFORMATIONAL" as Intent, volumeBoost: 0.5 },
    { phrase: " comparison", intent: "COMMERCIAL" as Intent, volumeBoost: 0.5 },
  ];

  const keywords: DiscoveredKeyword[] = modifiers
    .slice(0, maxResults)
    .map((modifier) => ({
      keyword: `${normalizedSeed}${modifier.phrase}`.trim(),
      intent: modifier.intent,
      volume: Math.round(1000 * modifier.volumeBoost),
      difficulty: Math.round(30 + Math.random() * 40),
    }));

  return keywords;
}
