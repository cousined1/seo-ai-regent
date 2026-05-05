export interface SearchConsoleRow {
  query: string;
  page: string;
  impressions: number;
  clicks: number;
  ctr: number;
  position: number;
}

export interface SearchConsoleApiResponse {
  rows?: Array<{
    keys: string[];
    impressions: number;
    clicks: number;
    ctr: number;
    position: number;
  }>;
}

export interface Opportunity {
  type:
    | "HIGH_IMPRESSION_LOW_CTR"
    | "DECLINING_PAGE"
    | "CANNIBALIZED_QUERY"
    | "POSITION_4_TO_10"
    | "NEW_QUERY";
  query: string;
  page: string;
  metric: string;
  value: number;
  rationale: string;
}

const HIGH_IMPRESSION_THRESHOLD = 1000;
const LOW_CTR_THRESHOLD = 0.02;
const DECLINING_CTR_THRESHOLD = 0.005;
const DECLINING_IMPRESSION_THRESHOLD = 5000;

export function parseSearchConsoleResponse(
  apiResponse: SearchConsoleApiResponse
): SearchConsoleRow[] {
  if (!apiResponse.rows || apiResponse.rows.length === 0) {
    return [];
  }

  return apiResponse.rows.map((row) => ({
    query: row.keys[0] || "",
    page: row.keys[1] || "",
    impressions: row.impressions,
    clicks: row.clicks,
    ctr: row.ctr,
    position: row.position,
  }));
}

export function detectOpportunities(
  rows: SearchConsoleRow[]
): Opportunity[] {
  const opportunities: Opportunity[] = [];

  // Group by query to detect cannibalization
  const queryMap = new Map<string, SearchConsoleRow[]>();
  for (const row of rows) {
    const existing = queryMap.get(row.query) || [];
    existing.push(row);
    queryMap.set(row.query, existing);
  }

  for (const row of rows) {
    // High impression, low CTR
    if (
      row.impressions >= HIGH_IMPRESSION_THRESHOLD &&
      row.ctr < LOW_CTR_THRESHOLD
    ) {
      opportunities.push({
        type: "HIGH_IMPRESSION_LOW_CTR",
        query: row.query,
        page: row.page,
        metric: "ctr",
        value: row.ctr,
        rationale: `High impressions (${row.impressions.toLocaleString()}) but low CTR (${(row.ctr * 100).toFixed(1)}%). Improve title/meta to capture more clicks.`,
      });
    }

    // Position 4-10 (page 2 opportunities)
    if (row.position >= 4 && row.position <= 10) {
      opportunities.push({
        type: "POSITION_4_TO_10",
        query: row.query,
        page: row.page,
        metric: "position",
        value: row.position,
        rationale: `Ranking #${row.position.toFixed(1)} for "${row.query}". Small improvements could push to page 1.`,
      });
    }

    // Declining pages (high impressions, very low CTR, poor position)
    if (
      row.impressions >= DECLINING_IMPRESSION_THRESHOLD &&
      row.ctr < DECLINING_CTR_THRESHOLD &&
      row.position > 10
    ) {
      opportunities.push({
        type: "DECLINING_PAGE",
        query: row.query,
        page: row.page,
        metric: "ctr",
        value: row.ctr,
        rationale: `Page has ${row.impressions.toLocaleString()} impressions but CTR of ${(row.ctr * 100).toFixed(2)}% at position ${row.position.toFixed(1)}. Consider content refresh or optimization.`,
      });
    }
  }

  // Cannibalized queries (same query, multiple pages)
  for (const [query, queryRows] of queryMap) {
    if (queryRows.length > 1) {
      const totalImpressions = queryRows.reduce(
        (sum, r) => sum + r.impressions,
        0
      );
      const pages = queryRows.map((r) => r.page).join(", ");

      opportunities.push({
        type: "CANNIBALIZED_QUERY",
        query,
        page: queryRows[0].page,
        metric: "impressions",
        value: totalImpressions,
        rationale: `${queryRows.length} pages compete for "${query}" (${totalImpressions.toLocaleString()} total impressions). Pages: ${pages}. Consolidate or differentiate.`,
      });
    }
  }

  return opportunities;
}

export async function fetchSearchConsoleData(
  accessToken: string,
  propertyUrl: string,
  startDate: string,
  endDate: string
): Promise<SearchConsoleApiResponse> {
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(propertyUrl)}/searchAnalytics/query`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      startDate,
      endDate,
      dimensions: ["query", "page"],
      rowLimit: 25000,
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Search Console API error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}
