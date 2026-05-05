"use client";

import { useState, useEffect } from "react";

interface TrendData {
  current: number;
  previous: number;
  change: number;
  direction: "up" | "down" | "stable" | "new";
  competitorCurrent?: number;
  competitorPrevious?: number;
  competitorChange?: number;
  dataPoints: Array<{ position: number; checkedAt: string }>;
}

interface KeywordResult {
  keywordId: string;
  query: string;
  intent: string | null;
  volume: number | null;
  difficulty: number | null;
  currentPosition: number | null;
  lastChecked: string | null;
  competitorPosition: number | null;
  trends: {
    "7d": TrendData | null;
    "30d": TrendData | null;
    "90d": TrendData | null;
  };
  history: Array<{ position: number; competitorPosition: number | null; checkedAt: string }>;
}

interface Summary {
  total: number;
  tracking: number;
  improving: number;
  declining: number;
}

export default function RankTrackingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = params as unknown as { id: string };
  const [results, setResults] = useState<KeywordResult[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");
  const [filter, setFilter] = useState<"all" | "improving" | "declining">("all");

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/rank-tracking/trends?workspaceId=${resolvedParams.id}`
      );
      if (!res.ok) throw new Error("Failed to load rank data");
      const data = await res.json();
      setResults(data.results);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [resolvedParams.id]);

  const filteredResults = results.filter((r) => {
    if (filter === "all") return true;
    const trend = r.trends[period];
    if (!trend) return false;
    if (filter === "improving") return trend.direction === "up";
    if (filter === "declining") return trend.direction === "down";
    return true;
  });

  const trendDirectionIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return "↑";
      case "down":
        return "↓";
      case "stable":
        return "→";
      case "new":
        return "★";
      default:
        return "-";
    }
  };

  const trendColor = (direction: string) => {
    switch (direction) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      case "stable":
        return "text-gray-600";
      case "new":
        return "text-blue-600";
      default:
        return "text-gray-600";
    }
  };

  const rankBadgeColor = (position: number) => {
    if (position <= 3) return "bg-green-100 text-green-800";
    if (position <= 10) return "bg-blue-100 text-blue-800";
    if (position <= 20) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const renderMiniChart = (history: Array<{ position: number; checkedAt: string }>) => {
    if (history.length < 2) return null;

    const positions = history.map((h) => h.position);
    const min = Math.min(...positions);
    const max = Math.max(...positions);
    const range = max - min || 1;
    const height = 24;
    const width = 80;

    const points = positions
      .map((p, i) => {
        const x = (i / (positions.length - 1)) * width;
        const y = height - ((p - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");

    return (
      <svg width={width} height={height} className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-blue-500"
        />
      </svg>
    );
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Rank Tracking</h1>

      {summary && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Total Keywords</div>
            <div className="text-2xl font-semibold">{summary.total}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Tracking</div>
            <div className="text-2xl font-semibold">{summary.tracking}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Improving</div>
            <div className="text-2xl font-semibold text-green-600">
              {summary.improving}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Declining</div>
            <div className="text-2xl font-semibold text-red-600">
              {summary.declining}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-4 flex items-center gap-4">
        <div className="flex gap-1">
          {(["7d", "30d", "90d"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                period === p
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <div className="flex gap-1">
          {(["all", "improving", "declining"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1 text-sm font-medium ${
                filter === f
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="ml-auto rounded-md border px-3 py-1 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium">Keyword</th>
              <th className="px-4 py-3 font-medium">Position</th>
              <th className="px-4 py-3 font-medium">Change</th>
              <th className="px-4 py-3 font-medium">Trend</th>
              <th className="px-4 py-3 font-medium">Competitor</th>
              <th className="px-4 py-3 font-medium">Volume</th>
              <th className="px-4 py-3 font-medium">Last Checked</th>
            </tr>
          </thead>
          <tbody>
            {filteredResults.map((result) => {
              const trend = result.trends[period];
              return (
                <tr key={result.keywordId} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{result.query}</div>
                    {result.intent && (
                      <div className="text-xs text-gray-500">
                        {result.intent}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {result.currentPosition !== null ? (
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${rankBadgeColor(result.currentPosition)}`}
                      >
                        #{result.currentPosition}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {trend && trend.change !== 0 ? (
                      <span className={trendColor(trend.direction)}>
                        {trendDirectionIcon(trend.direction)} {trend.change > 0 ? `+${trend.change}` : trend.change}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {result.history.length > 1 && renderMiniChart(result.history)}
                  </td>
                  <td className="px-4 py-3">
                    {result.competitorPosition !== null ? (
                      <span className="text-sm">#{result.competitorPosition}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {result.volume !== null
                      ? result.volume.toLocaleString()
                      : "-"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {result.lastChecked
                      ? new Date(result.lastChecked).toLocaleDateString()
                      : "Never"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredResults.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No rank tracking data found. Add keywords to start tracking.
          </div>
        )}
      </div>
    </div>
  );
}
