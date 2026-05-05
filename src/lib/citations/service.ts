export type CitationEngineType = "CHATGPT" | "PERPLEXITY" | "CLAUDE" | "GEMINI" | "COPILOT";

export interface CitationRecord {
  engine: CitationEngineType;
  found: boolean;
  position?: number;
  snippet?: string;
  url?: string;
  checkedAt?: Date;
}

export interface CitationTrendResult {
  citationScore: number;
  totalChecks: number;
  foundCount: number;
  avgPosition: number | null;
  period: string;
  periodStart: Date;
  periodEnd: Date;
}

export interface CitationChange {
  type: "gained" | "lost" | "improved" | "dropped";
  engine: CitationEngineType;
  previousPosition?: number;
  currentPosition?: number;
  positionChange?: number;
}

const ALL_ENGINES: CitationEngineType[] = [
  "CHATGPT",
  "PERPLEXITY",
  "CLAUDE",
  "GEMINI",
  "COPILOT",
];

export function calculateCitationScore(
  records: CitationRecord[]
): number {
  if (records.length === 0) {
    return 0;
  }

  let totalScore = 0;
  let maxPossible = 0;

  for (const record of records) {
    maxPossible += 1;

    if (record.found) {
      const positionBonus = record.position
        ? Math.max(0, 1 - (record.position - 1) * 0.1)
        : 0.5;
      totalScore += positionBonus;
    }
  }

  if (maxPossible === 0) return 0;

  return Math.round((totalScore / maxPossible) * 100);
}

export function aggregateTrend(
  records: CitationRecord[],
  period: string
): CitationTrendResult {
  const foundRecords = records.filter((r) => r.found);
  const foundCount = foundRecords.length;

  const positions = foundRecords
    .map((r) => r.position)
    .filter((p): p is number => p !== undefined);

  const avgPosition = positions.length > 0
    ? positions.reduce((sum, p) => sum + p, 0) / positions.length
    : null;

  const citationScore = calculateCitationScore(records);

  const dates = records
    .map((r) => r.checkedAt)
    .filter((d): d is Date => d !== undefined);

  const periodStart = dates.length > 0
    ? new Date(Math.min(...dates.map((d) => d.getTime())))
    : new Date();

  const periodEnd = dates.length > 0
    ? new Date(Math.max(...dates.map((d) => d.getTime())))
    : new Date();

  return {
    citationScore,
    totalChecks: records.length,
    foundCount,
    avgPosition: avgPosition ? Math.round(avgPosition * 10) / 10 : null,
    period,
    periodStart,
    periodEnd,
  };
}

export function detectCitationChanges(
  previous: CitationRecord[],
  current: CitationRecord[]
): CitationChange[] {
  const changes: CitationChange[] = [];

  const previousMap = new Map<string, CitationRecord>();
  const currentMap = new Map<string, CitationRecord>();

  for (const record of previous) {
    previousMap.set(record.engine, record);
  }

  for (const record of current) {
    currentMap.set(record.engine, record);
  }

  for (const [engine, currentRecord] of currentMap) {
    const previousRecord = previousMap.get(engine);

    if (!previousRecord || !previousRecord.found) {
      if (currentRecord.found) {
        changes.push({
          type: "gained",
          engine: engine as CitationEngineType,
          currentPosition: currentRecord.position,
        });
      }
      continue;
    }

    if (!currentRecord.found) {
      changes.push({
        type: "lost",
        engine: engine as CitationEngineType,
        previousPosition: previousRecord.position,
      });
      continue;
    }

    if (previousRecord.position && currentRecord.position) {
      const change = previousRecord.position - currentRecord.position;

      if (change > 0) {
        changes.push({
          type: "improved",
          engine: engine as CitationEngineType,
          previousPosition: previousRecord.position,
          currentPosition: currentRecord.position,
          positionChange: change,
        });
      } else if (change < 0) {
        changes.push({
          type: "dropped",
          engine: engine as CitationEngineType,
          previousPosition: previousRecord.position,
          currentPosition: currentRecord.position,
          positionChange: change,
        });
      }
    }
  }

  for (const [engine, previousRecord] of previousMap) {
    if (!currentMap.has(engine) && previousRecord.found) {
      changes.push({
        type: "lost",
        engine: engine as CitationEngineType,
        previousPosition: previousRecord.position,
      });
    }
  }

  return changes;
}

export function getEngineDisplayName(engine: CitationEngineType): string {
  const names: Record<CitationEngineType, string> = {
    CHATGPT: "ChatGPT",
    PERPLEXITY: "Perplexity",
    CLAUDE: "Claude",
    GEMINI: "Gemini",
    COPILOT: "Copilot",
  };
  return names[engine] || engine;
}

export function getScoreColor(score: number): string {
  if (score >= 80) return "bg-green-100 text-green-800";
  if (score >= 50) return "bg-yellow-100 text-yellow-800";
  if (score >= 20) return "bg-orange-100 text-orange-800";
  return "bg-red-100 text-red-800";
}
