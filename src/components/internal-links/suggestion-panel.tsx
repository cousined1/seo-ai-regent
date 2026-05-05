"use client";

import { useState, useEffect } from "react";

interface LinkSuggestion {
  id: string;
  sourceId: string;
  targetId: string;
  anchorText: string;
  rationale: string;
  confidence: number;
  context: string | null;
  scoreImpact: number | null;
  status: string;
}

interface SuggestionSummary {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  inserted: number;
}

export default function InternalLinkPanel({
  workspaceId,
  articleId,
  content,
}: {
  workspaceId: string;
  articleId: string;
  content: unknown;
}) {
  const [suggestions, setSuggestions] = useState<LinkSuggestion[]>([]);
  const [summary, setSummary] = useState<SuggestionSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("pending");

  const loadSuggestions = async () => {
    try {
      const res = await fetch(
        `/api/internal-links?workspaceId=${workspaceId}&sourceId=${articleId}`
      );
      if (!res.ok) throw new Error("Failed to load suggestions");
      const data = await res.json();
      setSuggestions(data.suggestions);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const generateSuggestions = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/internal-links/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          articleId,
          content,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate suggestions");
      await loadSuggestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (suggestionId: string, status: string) => {
    try {
      const res = await fetch(`/api/internal-links/${suggestionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update suggestion");
      await loadSuggestions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, [workspaceId, articleId]);

  const filteredSuggestions =
    filter === "all"
      ? suggestions
      : suggestions.filter((s) => s.status.toLowerCase() === filter);

  const confidenceColor = (confidence: number) => {
    if (confidence >= 0.7) return "bg-green-100 text-green-800";
    if (confidence >= 0.4) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="rounded-lg border p-4">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-medium">Internal Link Suggestions</h3>
        <button
          onClick={generateSuggestions}
          disabled={loading}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Suggestions"}
        </button>
      </div>

      {error && (
        <div className="mb-3 rounded-md bg-red-50 p-2 text-sm text-red-600">
          {error}
        </div>
      )}

      {summary && (
        <div className="mb-4 grid grid-cols-4 gap-2 text-center">
          <div className="rounded-md bg-gray-50 p-2">
            <div className="text-xs text-gray-500">Total</div>
            <div className="text-lg font-semibold">{summary.total}</div>
          </div>
          <div className="rounded-md bg-blue-50 p-2">
            <div className="text-xs text-blue-600">Pending</div>
            <div className="text-lg font-semibold text-blue-600">
              {summary.pending}
            </div>
          </div>
          <div className="rounded-md bg-green-50 p-2">
            <div className="text-xs text-green-600">Accepted</div>
            <div className="text-lg font-semibold text-green-600">
              {summary.accepted}
            </div>
          </div>
          <div className="rounded-md bg-gray-50 p-2">
            <div className="text-xs text-gray-500">Inserted</div>
            <div className="text-lg font-semibold">{summary.inserted}</div>
          </div>
        </div>
      )}

      <div className="mb-3 flex gap-1">
        {["all", "pending", "accepted", "rejected", "inserted"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded px-2 py-1 text-xs font-medium ${
              filter === f
                ? "bg-gray-200 text-gray-900"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredSuggestions.map((suggestion) => (
          <div key={suggestion.id} className="rounded-md border p-3">
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${confidenceColor(suggestion.confidence)}`}
              >
                {(suggestion.confidence * 100).toFixed(0)}% confidence
              </span>
              {suggestion.scoreImpact && (
                <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                  +{suggestion.scoreImpact} score
                </span>
              )}
            </div>

            <div className="mb-2">
              <span className="text-sm font-medium">Anchor:</span>{" "}
              <span className="text-sm text-blue-600">
                "{suggestion.anchorText}"
              </span>
            </div>

            <div className="mb-2 text-sm text-gray-600">
              {suggestion.rationale}
            </div>

            {suggestion.context && (
              <div className="mb-3 rounded bg-gray-50 p-2 text-xs text-gray-500">
                Context: "{suggestion.context}"
              </div>
            )}

            {suggestion.status === "PENDING" && (
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(suggestion.id, "ACCEPTED")}
                  className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(suggestion.id, "REJECTED")}
                  className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-gray-50"
                >
                  Reject
                </button>
              </div>
            )}

            {suggestion.status !== "PENDING" && (
              <div className="text-xs text-gray-500">
                Status: {suggestion.status.toLowerCase()}
              </div>
            )}
          </div>
        ))}

        {filteredSuggestions.length === 0 && (
          <div className="rounded-md border p-6 text-center text-sm text-gray-500">
            No suggestions found. Generate suggestions to see internal linking
            opportunities.
          </div>
        )}
      </div>
    </div>
  );
}
