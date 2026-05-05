export interface RankRecord {
  position: number;
  competitorPosition?: number;
  checkedAt: Date;
}

export interface TrendResult {
  current: number;
  previous: number;
  change: number;
  direction: "up" | "down" | "stable" | "new";
  competitorCurrent?: number;
  competitorPrevious?: number;
  competitorChange?: number;
  dataPoints: RankRecord[];
}

interface PositionChangeInput {
  currentPosition: number;
  previousPosition?: number;
}

export function calculatePositionChange(
  input: PositionChangeInput
): number {
  if (input.previousPosition === undefined) {
    return 0;
  }

  return input.previousPosition - input.currentPosition;
}

export function getTrendDirection(
  current: number,
  previous: number | undefined
): "up" | "down" | "stable" | "new" {
  if (previous === undefined) {
    return "new";
  }

  if (current < previous) {
    return "up";
  }

  if (current > previous) {
    return "down";
  }

  return "stable";
}

export function calculateTrend(
  records: RankRecord[],
  days: number,
  referenceDate: Date = new Date()
): TrendResult | null {
  if (records.length === 0) {
    return null;
  }

  const cutoffDate = new Date(referenceDate);
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const filteredRecords = records
    .filter((r) => r.checkedAt >= cutoffDate)
    .sort((a, b) => a.checkedAt.getTime() - b.checkedAt.getTime());

  if (filteredRecords.length === 0) {
    return null;
  }

  const current = filteredRecords[filteredRecords.length - 1];
  const previous = filteredRecords.length > 1 ? filteredRecords[0] : current;

  const change = calculatePositionChange({
    currentPosition: current.position,
    previousPosition: previous.position,
  });

  const direction = getTrendDirection(current.position, previous.position);

  const result: TrendResult = {
    current: current.position,
    previous: previous.position,
    change,
    direction,
    dataPoints: filteredRecords,
  };

  if (current.competitorPosition !== undefined) {
    result.competitorCurrent = current.competitorPosition;
    result.competitorPrevious = previous.competitorPosition;
    result.competitorChange = calculatePositionChange({
      currentPosition: current.competitorPosition,
      previousPosition: previous.competitorPosition,
    });
  }

  return result;
}

export function formatRankChange(change: number): string {
  if (change > 0) {
    return `+${change}`;
  }
  return `${change}`;
}

export function getRankBadgeColor(position: number): string {
  if (position <= 3) return "bg-green-100 text-green-800";
  if (position <= 10) return "bg-blue-100 text-blue-800";
  if (position <= 20) return "bg-yellow-100 text-yellow-800";
  return "bg-red-100 text-red-800";
}
