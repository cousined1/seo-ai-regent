import type { TopAction } from "@/lib/scoring/types";

export interface ActionImpactEntry {
  key: string;
  title: string;
  signal: string;
  area: "Content" | "GEO";
  contentDelta: number;
  geoDelta: number;
  totalDelta: number;
}

export interface ActionImpactInsight {
  key: string;
  title: string;
  summary: string;
}

function formatDelta(value: number) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value}`;
}

export function createActionImpactEntries(input: {
  actions: TopAction[];
  previous: {
    contentOverall: number;
    geoOverall: number;
  };
  current: {
    contentOverall: number;
    geoOverall: number;
  };
}): ActionImpactEntry[] {
  const { actions, previous, current } = input;

  if (!actions.length) {
    return [];
  }

  const contentDelta = current.contentOverall - previous.contentOverall;
  const geoDelta = current.geoOverall - previous.geoOverall;
  const allocatedContentDelta = contentDelta / actions.length;
  const allocatedGeoDelta = geoDelta / actions.length;

  return actions.map((action) => ({
    key: `${action.area}-${action.signal}`,
    title: action.title,
    signal: action.signal,
    area: action.area,
    contentDelta: Number(allocatedContentDelta.toFixed(1)),
    geoDelta: Number(allocatedGeoDelta.toFixed(1)),
    totalDelta: Number((allocatedContentDelta + allocatedGeoDelta).toFixed(1)),
  }));
}

export function mergeActionImpactEntries(
  current: ActionImpactEntry[],
  next: ActionImpactEntry[],
): ActionImpactEntry[] {
  const merged = [...current];

  for (const entry of next) {
    const existingIndex = merged.findIndex((item) => item.key === entry.key);

    if (existingIndex === -1) {
      merged.push(entry);
      continue;
    }

    const existingEntry = merged[existingIndex];
    merged[existingIndex] = {
      ...existingEntry,
      contentDelta: Number((existingEntry.contentDelta + entry.contentDelta).toFixed(1)),
      geoDelta: Number((existingEntry.geoDelta + entry.geoDelta).toFixed(1)),
      totalDelta: Number((existingEntry.totalDelta + entry.totalDelta).toFixed(1)),
    };
  }

  return merged
    .sort((left, right) => Math.abs(right.totalDelta) - Math.abs(left.totalDelta))
    .slice(0, 5);
}

export function deriveActionImpactInsights(
  entries: ActionImpactEntry[],
): ActionImpactInsight[] {
  return [...entries]
    .sort((left, right) => Math.abs(right.totalDelta) - Math.abs(left.totalDelta))
    .slice(0, 3)
    .map((entry) => ({
      key: entry.key,
      title: entry.title,
      summary: `${formatDelta(entry.contentDelta)} Content | ${formatDelta(entry.geoDelta)} GEO`,
    }));
}
