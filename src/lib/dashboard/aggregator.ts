export interface KeywordMetrics {
  total: number;
  tracking: number;
  top3: number;
  top10: number;
  top20: number;
  healthPercentage: number;
}

export interface ContentScoreMetrics {
  total: number;
  avgContentScore: number;
  avgGeoScore: number;
  above70: number;
  below50: number;
  passRate: number;
  blockRate: number;
}

export interface CitationMetrics {
  total: number;
  avgScore: number;
  appearing: number;
  notAppearing: number;
  visibilityRate: number;
}

export interface BacklinkMetrics {
  total: number;
  highPriority: number;
  mediumPriority: number;
  lowPriority: number;
  contacted: number;
  contactRate: number;
}

export interface AuditMetrics {
  lastRunAt: string | null;
  totalIssues: number;
  critical: number;
  warning: number;
  info: number;
  isStale: boolean;
}

export interface InventoryMetrics {
  total: number;
  needsRefresh: number;
  outdated: number;
  healthy: number;
  healthPercentage: number;
}

export interface ArticleMetrics {
  total: number;
  published: number;
  draft: number;
  inReview: number;
  publishRate: number;
}

export interface DashboardPayload {
  workspaceId: string;
  keywords: KeywordMetrics;
  contentScores: ContentScoreMetrics;
  citations: CitationMetrics;
  backlinks: BacklinkMetrics;
  audit: AuditMetrics;
  inventory: InventoryMetrics;
  articles: ArticleMetrics;
  overallHealth: number;
}

export interface DashboardInput {
  workspaceId: string;
  keywords: {
    total: number;
    tracking: number;
    top3: number;
    top10: number;
    top20: number;
  };
  contentScores: {
    total: number;
    avgContentScore: number;
    avgGeoScore: number;
    above70: number;
    below50: number;
  };
  citations: {
    total: number;
    avgScore: number;
    appearing: number;
    notAppearing: number;
  };
  backlinks: {
    total: number;
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
    contacted: number;
  };
  audit: {
    lastRunAt: string | null;
    totalIssues: number;
    critical: number;
    warning: number;
    info: number;
  };
  inventory: {
    total: number;
    needsRefresh: number;
    outdated: number;
    healthy: number;
  };
  articles: {
    total: number;
    published: number;
    draft: number;
    inReview: number;
  };
}

function calcPercentage(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

export function aggregateWorkspaceDashboard(input: DashboardInput): DashboardPayload {
  const keywords: KeywordMetrics = {
    ...input.keywords,
    healthPercentage: calcPercentage(input.keywords.top10, input.keywords.tracking || input.keywords.total),
  };

  const contentScores: ContentScoreMetrics = {
    ...input.contentScores,
    passRate: calcPercentage(input.contentScores.above70, input.contentScores.total),
    blockRate: calcPercentage(input.contentScores.below50, input.contentScores.total),
  };

  const citations: CitationMetrics = {
    ...input.citations,
    visibilityRate: calcPercentage(input.citations.appearing, input.citations.total),
  };

  const backlinks: BacklinkMetrics = {
    ...input.backlinks,
    contactRate: calcPercentage(input.backlinks.contacted, input.backlinks.total),
  };

  const audit: AuditMetrics = {
    ...input.audit,
    isStale: input.audit.lastRunAt
      ? (() => {
          const lastRun = new Date(input.audit.lastRunAt);
          const now = new Date();
          const daysSince = (now.getTime() - lastRun.getTime()) / (1000 * 60 * 60 * 24);
          return daysSince > 7;
        })()
      : true,
  };

  const inventory: InventoryMetrics = {
    ...input.inventory,
    healthPercentage: calcPercentage(input.inventory.healthy, input.inventory.total),
  };

  const articles: ArticleMetrics = {
    ...input.articles,
    publishRate: calcPercentage(input.articles.published, input.articles.total),
  };

  const sectionScores = [
    keywords.healthPercentage,
    contentScores.passRate,
    citations.visibilityRate,
    backlinks.contactRate,
    inventory.healthPercentage,
    articles.publishRate,
  ].filter((s) => s > 0 || input.keywords.total + input.contentScores.total + input.citations.total + input.backlinks.total + input.inventory.total + input.articles.total > 0);

  const overallHealth = sectionScores.length === 0
    ? 0
    : Math.round(sectionScores.reduce((a, b) => a + b, 0) / sectionScores.length);

  return {
    workspaceId: input.workspaceId,
    keywords,
    contentScores,
    citations,
    backlinks,
    audit,
    inventory,
    articles,
    overallHealth,
  };
}
