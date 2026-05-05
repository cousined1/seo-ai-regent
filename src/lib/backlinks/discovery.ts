export interface BacklinkSource {
  url: string;
  domain: string;
  domainAuthority?: number;
  pageAuthority?: number;
  relevance?: "high" | "medium" | "low";
  context: string;
  contactEmail?: string;
  contactName?: string;
}

export interface ScoredOpportunity {
  source: BacklinkSource;
  score: number;
  priority: "high" | "medium" | "low";
}

export interface OutreachTemplate {
  subject: string;
  body: string;
}

interface OutreachConfig {
  siteName: string;
  siteUrl: string;
  senderName: string;
}

const DA_WEIGHT = 0.4;
const RELEVANCE_WEIGHT = 0.35;
const PA_WEIGHT = 0.25;

const RELEVANCE_SCORES: Record<string, number> = {
  high: 100,
  medium: 60,
  low: 20,
};

export function scoreBacklinkOpportunity(source: BacklinkSource): number {
  const daScore = (source.domainAuthority || 0) / 100;
  const paScore = (source.pageAuthority || 0) / 100;
  const relevanceScore = (RELEVANCE_SCORES[source.relevance || "medium"] || 50) / 100;

  const weightedScore =
    daScore * DA_WEIGHT +
    relevanceScore * RELEVANCE_WEIGHT +
    paScore * PA_WEIGHT;

  return Math.round(weightedScore * 100);
}

export function getPriorityLabel(score: number): "high" | "medium" | "low" {
  if (score >= 70) return "high";
  if (score >= 40) return "medium";
  return "low";
}

export function prioritizeOpportunities(
  sources: BacklinkSource[],
  limit = 20
): ScoredOpportunity[] {
  const scored = sources.map((source) => ({
    source,
    score: scoreBacklinkOpportunity(source),
    priority: getPriorityLabel(scoreBacklinkOpportunity(source)),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, limit);
}

export function generateOutreachTemplate(
  opportunity: ScoredOpportunity,
  config: OutreachConfig
): OutreachTemplate {
  const { source, score, priority } = opportunity;
  const domain = source.domain;

  const subject = `Quick question about your ${source.relevance === "high" ? "excellent" : "great"} content on ${domain}`;

  const tone = priority === "high" ? "professional" : "friendly";
  const opening =
    tone === "professional"
      ? `I recently came across your article on ${domain} and was impressed by the quality of your content.`
      : `Hi there! I was reading your post on ${domain} and really enjoyed it.`;

  const context = source.context
    ? `Specifically, your piece about "${source.context}" caught my attention.`
    : "";

  const valueProp = `I thought you might find ${config.siteName} (${config.siteUrl}) useful for your readers. It's a tool that helps with SEO analysis and optimization, which aligns well with your content.`;

  const ask = `Would you be open to considering adding a mention or link to ${config.siteName} in your article? I'd be happy to provide any additional information or resources that might be helpful.`;

  const closing = `Thanks for your time and for creating such valuable content.\n\nBest regards,\n${config.senderName}`;

  const body = [opening, context, valueProp, ask, closing]
    .filter(Boolean)
    .join("\n\n");

  return { subject, body };
}

export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}
