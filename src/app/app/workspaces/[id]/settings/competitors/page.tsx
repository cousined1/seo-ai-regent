"use client";

import { useState, useEffect } from "react";

interface Competitor {
  id: string;
  domain: string;
  market: string | null;
  priority: string;
  notes: string | null;
  _count: { snapshots: number };
}

interface GapResult {
  competitorId: string;
  domain: string;
  status: string;
  gap?: {
    missingKeywords: Array<{ query: string; volume: number; difficulty: number }>;
    sharedKeywords: Array<{ query: string }>;
    totalOpportunityVolume: number;
  };
  recommendations?: Array<{
    type: string;
    query: string;
    volume: number;
    priority: string;
    rationale: string;
  }>;
  contentPatterns?: {
    mostCommonType: string;
    avgWordCount: number;
  };
  snapshotDate?: string;
}

export default function CompetitorsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = params as unknown as { id: string };
  const [domain, setDomain] = useState("");
  const [market, setMarket] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [gapResults, setGapResults] = useState<GapResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"competitors" | "gaps">(
    "competitors"
  );

  const loadCompetitors = async () => {
    try {
      const res = await fetch(
        `/api/competitors?workspaceId=${resolvedParams.id}`
      );
      if (!res.ok) throw new Error("Failed to load competitors");
      const data = await res.json();
      setCompetitors(data.competitors);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const runGapAnalysis = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/competitors/gap?workspaceId=${resolvedParams.id}`
      );
      if (!res.ok) throw new Error("Failed to run gap analysis");
      const data = await res.json();
      setGapResults(data.results);
      setActiveTab("gaps");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const addCompetitor = async () => {
    if (!domain) {
      setError("Domain is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/competitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: resolvedParams.id,
          domain,
          market: market || undefined,
          priority,
        }),
      });

      if (!res.ok) throw new Error("Failed to add competitor");
      setDomain("");
      setMarket("");
      setPriority("MEDIUM");
      await loadCompetitors();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const deleteCompetitor = async (competitorId: string) => {
    try {
      const res = await fetch("/api/competitors", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ competitorId }),
      });

      if (!res.ok) throw new Error("Failed to delete competitor");
      await loadCompetitors();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    loadCompetitors();
  }, [resolvedParams.id]);

  const priorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL":
        return "bg-red-100 text-red-800";
      case "HIGH":
        return "bg-orange-100 text-orange-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const recPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">
        Competitor Intelligence
      </h1>

      <div className="mb-6 flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("competitors")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "competitors"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Competitors ({competitors.length})
        </button>
        <button
          onClick={() => setActiveTab("gaps")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "gaps"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Gap Analysis
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {activeTab === "competitors" && (
        <div>
          <div className="mb-6 rounded-lg border p-4">
            <h2 className="mb-2 text-lg font-medium">Add Competitor</h2>
            <div className="mb-3 grid gap-3 md:grid-cols-3">
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="competitor.com"
                className="rounded-md border p-2 text-sm"
              />
              <input
                type="text"
                value={market}
                onChange={(e) => setMarket(e.target.value)}
                placeholder="Market (optional)"
                className="rounded-md border p-2 text-sm"
              />
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="rounded-md border p-2 text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="CRITICAL">Critical</option>
              </select>
            </div>
            <button
              onClick={addCompetitor}
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Competitor"}
            </button>
          </div>

          <div className="mb-4">
            <button
              onClick={runGapAnalysis}
              disabled={loading || competitors.length === 0}
              className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Analyzing..." : "Run Gap Analysis"}
            </button>
          </div>

          <div className="space-y-3">
            {competitors.map((comp) => (
              <div key={comp.id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comp.domain}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-medium ${priorityColor(comp.priority)}`}
                    >
                      {comp.priority}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteCompetitor(comp.id)}
                    className="rounded-md border px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Remove
                  </button>
                </div>
                {comp.market && (
                  <div className="mb-1 text-sm text-gray-500">
                    Market: {comp.market}
                  </div>
                )}
                <div className="text-sm text-gray-500">
                  {comp._count.snapshots} snapshot(s)
                </div>
              </div>
            ))}

            {competitors.length === 0 && (
              <div className="rounded-lg border p-8 text-center text-gray-500">
                No competitors added. Add a competitor domain to get started.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "gaps" && (
        <div>
          {gapResults.length === 0 && (
            <div className="rounded-lg border p-8 text-center text-gray-500">
              No gap analysis results. Run a gap analysis to see opportunities.
            </div>
          )}

          <div className="space-y-6">
            {gapResults.map((result) => (
              <div key={result.competitorId} className="rounded-lg border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-medium">{result.domain}</h3>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      result.status === "analyzed"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {result.status}
                  </span>
                </div>

                {result.status === "no_data" && (
                  <div className="text-sm text-gray-500">
                    No snapshot data available for this competitor.
                  </div>
                )}

                {result.gap && (
                  <div>
                    <div className="mb-3 grid grid-cols-2 gap-4 md:grid-cols-3">
                      <div className="rounded-md bg-gray-50 p-3">
                        <div className="text-sm text-gray-500">
                          Missing Keywords
                        </div>
                        <div className="text-xl font-semibold">
                          {result.gap.missingKeywords.length}
                        </div>
                      </div>
                      <div className="rounded-md bg-gray-50 p-3">
                        <div className="text-sm text-gray-500">
                          Shared Keywords
                        </div>
                        <div className="text-xl font-semibold">
                          {result.gap.sharedKeywords.length}
                        </div>
                      </div>
                      <div className="rounded-md bg-gray-50 p-3">
                        <div className="text-sm text-gray-500">
                          Opportunity Volume
                        </div>
                        <div className="text-xl font-semibold">
                          {result.gap.totalOpportunityVolume.toLocaleString()}
                        </div>
                      </div>
                    </div>

                    {result.contentPatterns && (
                      <div className="mb-3 rounded-md bg-blue-50 p-3">
                        <div className="text-sm font-medium text-blue-900">
                          Content Patterns
                        </div>
                        <div className="text-sm text-blue-700">
                          Most common type:{" "}
                          {result.contentPatterns.mostCommonType} | Avg word
                          count:{" "}
                          {result.contentPatterns.avgWordCount.toLocaleString()}
                        </div>
                      </div>
                    )}

                    {result.recommendations &&
                      result.recommendations.length > 0 && (
                        <div>
                          <h4 className="mb-2 text-sm font-medium">
                            Recommendations
                          </h4>
                          <div className="space-y-2">
                            {result.recommendations.map((rec, idx) => (
                              <div
                                key={idx}
                                className="rounded-md border p-3"
                              >
                                <div className="mb-1 flex items-center gap-2">
                                  <span
                                    className={`rounded px-2 py-0.5 text-xs font-medium ${recPriorityColor(rec.priority)}`}
                                  >
                                    {rec.priority}
                                  </span>
                                  <span className="text-sm font-medium">
                                    {rec.type === "new_content"
                                      ? "New Content"
                                      : "Refresh Content"}
                                  </span>
                                  {rec.query && (
                                    <span className="text-sm text-gray-600">
                                      "{rec.query}"
                                    </span>
                                  )}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {rec.rationale}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
