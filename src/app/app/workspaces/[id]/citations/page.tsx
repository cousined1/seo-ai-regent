"use client";

import { useState, useEffect } from "react";

interface CitationChange {
  type: "gained" | "lost" | "improved" | "dropped";
  engine: string;
  previousPosition?: number;
  currentPosition?: number;
  positionChange?: number;
}

interface CitationResult {
  query: string;
  citationScore: number;
  totalEngines: number;
  citedEngines: number;
  avgPosition: number | null;
  changes: CitationChange[];
  latestChecks: Array<{
    engine: string;
    found: boolean;
    position: number | null;
    checkedAt: string;
  }>;
}

interface CitationSummary {
  total: number;
  avgScore: number;
  gained: number;
  lost: number;
}

export default function CitationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = params as unknown as { id: string };
  const [results, setResults] = useState<CitationResult[]>([]);
  const [summary, setSummary] = useState<CitationSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/citations/trends?workspaceId=${resolvedParams.id}`
      );
      if (!res.ok) throw new Error("Failed to load citation data");
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

  const scoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800";
    if (score >= 50) return "bg-yellow-100 text-yellow-800";
    if (score >= 20) return "bg-orange-100 text-orange-800";
    return "bg-red-100 text-red-800";
  };

  const changeIcon = (type: string) => {
    switch (type) {
      case "gained":
        return "+";
      case "lost":
        return "-";
      case "improved":
        return "↑";
      case "dropped":
        return "↓";
      default:
        return "";
    }
  };

  const changeColor = (type: string) => {
    switch (type) {
      case "gained":
      case "improved":
        return "text-green-600";
      case "lost":
      case "dropped":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const engineBadge = (engine: string, found: boolean, position: number | null) => {
    const name = engine.charAt(0).toUpperCase() + engine.slice(1).toLowerCase();
    if (found) {
      return (
        <span className="rounded bg-green-50 px-2 py-0.5 text-xs text-green-700">
          {name} #{position || "-"}
        </span>
      );
    }
    return (
      <span className="rounded bg-gray-50 px-2 py-0.5 text-xs text-gray-400">
        {name} -
      </span>
    );
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Citation Tracking</h1>

      {summary && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Queries Tracked</div>
            <div className="text-2xl font-semibold">{summary.total}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Avg Citation Score</div>
            <div className="text-2xl font-semibold">{summary.avgScore}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Gained</div>
            <div className="text-2xl font-semibold text-green-600">
              {summary.gained}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Lost</div>
            <div className="text-2xl font-semibold text-red-600">
              {summary.lost}
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={loadData}
          disabled={loading}
          className="rounded-md border px-3 py-1 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.query} className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-medium">{result.query}</h3>
              <span
                className={`rounded px-2 py-0.5 text-sm font-medium ${scoreColor(result.citationScore)}`}
              >
                Score: {result.citationScore}
              </span>
            </div>

            <div className="mb-3 flex flex-wrap gap-2">
              {result.latestChecks.map((check) =>
                engineBadge(check.engine, check.found, check.position)
              )}
            </div>

            <div className="mb-2 text-sm text-gray-500">
              {result.citedEngines}/{result.totalEngines} engines citing |{" "}
              {result.avgPosition ? `Avg position: ${result.avgPosition}` : "No citations"}
            </div>

            {result.changes.length > 0 && (
              <div className="mt-3 rounded-md bg-gray-50 p-3">
                <div className="mb-1 text-xs font-medium text-gray-600">
                  Recent Changes
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.changes.map((change, idx) => (
                    <span
                      key={idx}
                      className={`rounded px-2 py-0.5 text-xs font-medium ${changeColor(change.type)}`}
                    >
                      {changeIcon(change.type)} {change.engine}
                      {change.positionChange !== undefined &&
                        ` (${change.positionChange > 0 ? "+" : ""}${change.positionChange})`}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {results.length === 0 && !loading && (
          <div className="rounded-lg border p-8 text-center text-gray-500">
            No citation data found. Run citation checks to start tracking.
          </div>
        )}
      </div>
    </div>
  );
}
