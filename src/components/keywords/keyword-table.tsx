"use client";

import { useEffect, useState } from "react";

type Intent = "INFORMATIONAL" | "TRANSACTIONAL" | "NAVIGATIONAL" | "COMMERCIAL";

interface Keyword {
  id: string;
  query: string;
  intent: Intent | null;
  volume: number | null;
  difficulty: number | null;
  cluster: { name: string; intent: Intent } | null;
}

interface KeywordListResponse {
  keywords: Keyword[];
  total: number;
  page: number;
  totalPages: number;
}

const intentColors: Record<Intent, string> = {
  INFORMATIONAL: "bg-blue-100 text-blue-800",
  TRANSACTIONAL: "bg-green-100 text-green-800",
  NAVIGATIONAL: "bg-purple-100 text-purple-800",
  COMMERCIAL: "bg-amber-100 text-amber-800",
};

const intentLabels: Record<Intent, string> = {
  INFORMATIONAL: "Info",
  TRANSACTIONAL: "Transactional",
  NAVIGATIONAL: "Navigational",
  COMMERCIAL: "Commercial",
};

interface KeywordTableProps {
  workspaceId: string;
}

export function KeywordTable({ workspaceId }: KeywordTableProps) {
  const [data, setData] = useState<KeywordListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [intentFilter, setIntentFilter] = useState<Intent | "">("");
  const [page, setPage] = useState(1);

  async function fetchKeywords() {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams({
      page: String(page),
      limit: "20",
    });

    if (search) params.set("search", search);
    if (intentFilter) params.set("intent", intentFilter);

    try {
      const response = await fetch(`/api/workspaces/${workspaceId}/keywords?${params}`);
      const json = await response.json();

      if (!response.ok) {
        setError(json.error ?? "Failed to load keywords");
        return;
      }

      setData(json);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchKeywords();
  }, [workspaceId, page, intentFilter]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchKeywords();
  }

  if (loading && !data) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading keywords...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error}
      </div>
    );
  }

  if (!data || data.keywords.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No keywords found. Discover keywords from a seed topic to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} className="flex-1">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search keywords..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </form>

        <select
          value={intentFilter}
          onChange={(e) => {
            setIntentFilter(e.target.value as Intent | "");
            setPage(1);
          }}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <option value="">All intents</option>
          <option value="INFORMATIONAL">Informational</option>
          <option value="TRANSACTIONAL">Transactional</option>
          <option value="NAVIGATIONAL">Navigational</option>
          <option value="COMMERCIAL">Commercial</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Keyword</th>
              <th className="px-4 py-3 text-left font-medium">Intent</th>
              <th className="px-4 py-3 text-right font-medium">Volume</th>
              <th className="px-4 py-3 text-right font-medium">Difficulty</th>
              <th className="px-4 py-3 text-left font-medium">Cluster</th>
            </tr>
          </thead>
          <tbody>
            {data.keywords.map((kw) => (
              <tr key={kw.id} className="border-b last:border-b-0">
                <td className="px-4 py-3 font-medium">{kw.query}</td>
                <td className="px-4 py-3">
                  {kw.intent && (
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${intentColors[kw.intent]}`}>
                      {intentLabels[kw.intent]}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right">{kw.volume ?? "-"}</td>
                <td className="px-4 py-3 text-right">
                  {kw.difficulty != null && (
                    <span className={kw.difficulty > 60 ? "text-red-600" : kw.difficulty > 40 ? "text-amber-600" : "text-green-600"}>
                      {kw.difficulty}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{kw.cluster?.name ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Page {data.page} of {data.totalPages} ({data.total} keywords)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-md border px-3 py-1.5 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
              disabled={page >= data.totalPages}
              className="rounded-md border px-3 py-1.5 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
