import type { Intent } from "@prisma/client";

const informationalSignals = [
  "what", "how", "why", "when", "where", "who", "which",
  "guide", "tutorial", "learn", "explain", "definition",
  "example", "examples", "tips", "ideas", "meaning",
];

const transactionalSignals = [
  "buy", "purchase", "order", "price", "pricing", "cost",
  "discount", "deal", "coupon", "subscribe", "download",
  "sign up", "register", "hire", "book", "shop",
];

const navigationalSignals = [
  "login", "sign in", "signin", "signup", "account",
  "dashboard", "portal", "app", "website", "homepage",
  "contact", "support", "help center",
];

const commercialSignals = [
  "best", "top", "vs", "versus", "compare", "comparison",
  "review", "reviews", "alternative", "alternatives",
  "rating", "ranked", "recommended",
];

const informationalSerpFeatures = [
  "featured_snippet", "people_also_ask", "how_to", "knowledge_panel",
];

const transactionalSerpFeatures = [
  "shopping_results", "product_listing", "local_pack",
];

const navigationalSerpFeatures = [
  "site_links", "knowledge_panel", "brand_result",
];

const commercialSerpFeatures = [
  "comparison", "review_stars", "carousel", "top_stories",
];

function scoreFromSignals(query: string, signals: string[]): number {
  const normalized = query.toLowerCase();
  return signals.filter((signal) => normalized.includes(signal)).length;
}

function scoreFromSerpFeatures(features: string[], featureSet: string[]): number {
  return features.filter((f) => featureSet.includes(f)).length;
}

export function classifyIntent(query: string, serpFeatures: string[] = []): Intent {
  const queryLower = query.toLowerCase();

  const informationalSerpScore = scoreFromSerpFeatures(serpFeatures, informationalSerpFeatures);
  const transactionalSerpScore = scoreFromSerpFeatures(serpFeatures, transactionalSerpFeatures);
  const navigationalSerpScore = scoreFromSerpFeatures(serpFeatures, navigationalSerpFeatures);
  const commercialSerpScore = scoreFromSerpFeatures(serpFeatures, commercialSerpFeatures);

  const hasStrongSerpSignal =
    informationalSerpScore > 0 ||
    transactionalSerpScore > 0 ||
    navigationalSerpScore > 0 ||
    commercialSerpScore > 0;

  if (hasStrongSerpSignal) {
    const scores = {
      INFORMATIONAL: informationalSerpScore,
      TRANSACTIONAL: transactionalSerpScore,
      NAVIGATIONAL: navigationalSerpScore,
      COMMERCIAL: commercialSerpScore,
    } as const;

    let maxIntent: Intent = "INFORMATIONAL";
    let maxScore = 0;

    for (const [intent, score] of Object.entries(scores)) {
      if (score > maxScore) {
        maxScore = score;
        maxIntent = intent as Intent;
      }
    }

    return maxIntent;
  }

  const informationalQueryScore = scoreFromSignals(queryLower, informationalSignals);
  const transactionalQueryScore = scoreFromSignals(queryLower, transactionalSignals);
  const navigationalQueryScore = scoreFromSignals(queryLower, navigationalSignals);
  const commercialQueryScore = scoreFromSignals(queryLower, commercialSignals);

  const scores: Record<Intent, number> = {
    INFORMATIONAL: informationalQueryScore,
    TRANSACTIONAL: transactionalQueryScore,
    NAVIGATIONAL: navigationalQueryScore,
    COMMERCIAL: commercialQueryScore,
  };

  let maxIntent: Intent = "INFORMATIONAL";
  let maxScore = 0;

  for (const [intent, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxIntent = intent as Intent;
    }
  }

  return maxIntent;
}

export interface DiscoveredKeyword {
  keyword: string;
  intent: Intent;
  volume: number;
  difficulty: number;
}

export interface KeywordClusterResult {
  name: string;
  intent: Intent;
  keywords: DiscoveredKeyword[];
}

export function clusterByIntent(keywords: DiscoveredKeyword[]): KeywordClusterResult[] {
  if (keywords.length === 0) {
    return [];
  }

  const clusters = new Map<Intent, DiscoveredKeyword[]>();

  for (const kw of keywords) {
    const existing = clusters.get(kw.intent) ?? [];
    existing.push(kw);
    clusters.set(kw.intent, existing);
  }

  const results: KeywordClusterResult[] = [];

  for (const [intent, kws] of clusters) {
    const sortedByVolume = [...kws].sort((a, b) => b.volume - a.volume);
    const dominantKeyword = sortedByVolume[0]?.keyword ?? intent.toLowerCase();
    const name = `${dominantKeyword} (${intent.toLowerCase()})`;

    results.push({
      name,
      intent,
      keywords: sortedByVolume,
    });
  }

  return results;
}
