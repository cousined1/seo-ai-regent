export interface ContentNode {
  type: string;
  attrs?: Record<string, unknown>;
  text?: string;
  marks?: Array<{ type: string }>;
  content?: ContentNode[];
}

export interface ArticleMetadata {
  id: string;
  title: string;
  keyword: string;
  contentScore?: number;
}

export interface LinkTarget {
  articleId: string;
  title: string;
  matchedKeyword: string;
  matchType: "exact" | "partial";
}

export interface LinkSuggestion {
  sourceId: string;
  targetId: string;
  anchorText: string;
  rationale: string;
  confidence: number;
  context?: string;
  scoreImpact?: number;
}

interface ConfidenceFactors {
  matchType: "exact" | "partial";
  keywordRelevance: number;
  contentScore: number;
  existingLinks: number;
}

const STOP_WORDS = new Set([
  "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for",
  "of", "with", "by", "from", "is", "are", "was", "were", "be", "been",
  "being", "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "must", "shall", "can", "this",
  "that", "these", "those", "it", "its", "they", "them", "their", "we",
  "our", "you", "your", "he", "she", "his", "her", "i", "my", "me",
  "not", "no", "so", "if", "then", "than", "too", "very", "just",
  "about", "up", "out", "into", "over", "after", "before", "between",
  "under", "again", "further", "here", "there", "when", "where", "why",
  "how", "all", "each", "few", "more", "most", "other", "some", "such",
  "only", "own", "same", "as", "also",
]);

const CONFIDENCE_THRESHOLD = 0.3;
const MAX_SUGGESTIONS = 10;

export function extractKeywordsFromContent(content: ContentNode): string[] {
  const text = extractText(content);
  const words = text.toLowerCase().split(/\s+/);

  const phrases: string[] = [];
  let currentPhrase: string[] = [];

  for (const word of words) {
    const cleaned = word.replace(/[^a-z0-9]/g, "");
    if (cleaned && !STOP_WORDS.has(cleaned)) {
      currentPhrase.push(cleaned);
    } else {
      if (currentPhrase.length >= 2) {
        phrases.push(currentPhrase.join(" "));
      }
      currentPhrase = [];
    }
  }

  if (currentPhrase.length >= 2) {
    phrases.push(currentPhrase.join(" "));
  }

  return [...new Set(phrases)];
}

function extractText(node: ContentNode): string {
  if (node.text) {
    return node.text;
  }

  if (node.content) {
    return node.content.map(extractText).join(" ");
  }

  return "";
}

export function findLinkTargets(
  keywords: string[],
  articles: ArticleMetadata[],
  excludeId: string
): LinkTarget[] {
  const targets: LinkTarget[] = [];
  const seen = new Set<string>();

  for (const article of articles) {
    if (article.id === excludeId) continue;
    if (seen.has(article.id)) continue;

    const articleKeyword = article.keyword.toLowerCase();

    for (const keyword of keywords) {
      if (keyword === articleKeyword) {
        targets.push({
          articleId: article.id,
          title: article.title,
          matchedKeyword: keyword,
          matchType: "exact",
        });
        seen.add(article.id);
        break;
      }

      if (keyword.includes(articleKeyword) || articleKeyword.includes(keyword)) {
        targets.push({
          articleId: article.id,
          title: article.title,
          matchedKeyword: keyword,
          matchType: "partial",
        });
        seen.add(article.id);
        break;
      }
    }
  }

  return targets;
}

export function calculateConfidence(factors: ConfidenceFactors): number {
  let score = 0;

  // Match type weight
  score += factors.matchType === "exact" ? 0.4 : 0.2;

  // Keyword relevance (0-1 scale)
  score += factors.keywordRelevance * 0.3;

  // Content score bonus (normalized to 0-1)
  score += (factors.contentScore / 100) * 0.2;

  // Penalize for many existing links
  const linkPenalty = Math.min(factors.existingLinks * 0.02, 0.2);
  score -= linkPenalty;

  return Math.max(0, Math.min(1, score));
}

function generateAnchorText(keyword: string, context: string): string {
  const sentences = context.split(/[.!?]+/);
  for (const sentence of sentences) {
    if (sentence.toLowerCase().includes(keyword.toLowerCase())) {
      const words = sentence.trim().split(/\s+/);
      const keywordIndex = words.findIndex((w) =>
        w.toLowerCase().includes(keyword.split(" ")[0])
      );

      if (keywordIndex >= 0) {
        const start = Math.max(0, keywordIndex - 1);
        const end = Math.min(words.length, keywordIndex + keyword.split(" ").length + 1);
        return words.slice(start, end).join(" ").replace(/[.,;:!?]/g, "");
      }
    }
  }

  return keyword;
}

function estimateScoreImpact(
  confidence: number,
  targetContentScore?: number
): number {
  const baseImpact = confidence * 5;
  const qualityBonus = targetContentScore && targetContentScore > 70 ? 2 : 0;
  return Math.round(baseImpact + qualityBonus);
}

export function generateLinkSuggestions(
  content: ContentNode,
  articles: ArticleMetadata[],
  sourceId: string
): LinkSuggestion[] {
  const keywords = extractKeywordsFromContent(content);
  const targets = findLinkTargets(keywords, articles, sourceId);
  const fullText = extractText(content);

  const suggestions: LinkSuggestion[] = [];

  for (const target of targets) {
    const anchorText = generateAnchorText(target.matchedKeyword, fullText);
    const context = fullText
      .split(/[.!?]+/)
      .find((s) => s.toLowerCase().includes(target.matchedKeyword.toLowerCase()));

    const confidence = calculateConfidence({
      matchType: target.matchType,
      keywordRelevance: target.matchType === "exact" ? 0.9 : 0.5,
      contentScore: articles.find((a) => a.id === target.articleId)?.contentScore || 50,
      existingLinks: 0,
    });

    if (confidence < CONFIDENCE_THRESHOLD) continue;

    const targetArticle = articles.find((a) => a.id === target.articleId);
    const scoreImpact = estimateScoreImpact(confidence, targetArticle?.contentScore);

    suggestions.push({
      sourceId,
      targetId: target.articleId,
      anchorText,
      rationale: `Link to "${target.title}" which targets "${target.matchedKeyword}" (${target.matchType} match).`,
      confidence,
      context: context?.trim(),
      scoreImpact,
    });
  }

  suggestions.sort((a, b) => b.confidence - a.confidence);

  return suggestions.slice(0, MAX_SUGGESTIONS);
}
