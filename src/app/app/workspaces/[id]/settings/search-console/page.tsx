"use client";

import { useState, useEffect } from "react";

interface SCConnection {
  id: string;
  propertyUrl: string;
  syncStatus: string;
  lastSyncAt: string | null;
  createdAt: string;
}

interface Opportunity {
  id: string;
  type: string;
  query: string;
  page: string;
  metric: string;
  value: number;
  rationale: string;
  status: string;
  createdAt: string;
}

interface OpportunitySummary {
  total: number;
  highImpressionLowCtr: number;
  position4To10: number;
  cannibalized: number;
  declining: number;
  new: number;
}

export default function SearchConsolePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = params as unknown as { id: string };
  const [connections, setConnections] = useState<SCConnection[]>([]);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [summary, setSummary] = useState<OpportunitySummary | null>(null);
  const [propertyUrl, setPropertyUrl] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"connections" | "opportunities">(
    "connections"
  );

  const loadConnections = async () => {
    try {
      const res = await fetch(
        `/api/search-console/connect?workspaceId=${resolvedParams.id}`
      );
      if (!res.ok) throw new Error("Failed to load connections");
      const data = await res.json();
      setConnections(data.connections);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const loadOpportunities = async () => {
    try {
      const res = await fetch(
        `/api/search-console/opportunities?workspaceId=${resolvedParams.id}`
      );
      if (!res.ok) throw new Error("Failed to load opportunities");
      const data = await res.json();
      setOpportunities(data.opportunities);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const connectProperty = async () => {
    if (!propertyUrl || !accessToken) {
      setError("Property URL and access token are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/search-console/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId: resolvedParams.id,
          propertyUrl,
          accessToken,
          refreshToken: "",
        }),
      });

      if (!res.ok) throw new Error("Failed to connect property");
      await loadConnections();
      setPropertyUrl("");
      setAccessToken("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const syncData = async (connectionId: string) => {
    setLoading(true);
    setError(null);

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 28);

    try {
      const res = await fetch("/api/search-console/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          connectionId,
          startDate: startDate.toISOString().split("T")[0],
          endDate: endDate.toISOString().split("T")[0],
        }),
      });

      if (!res.ok) throw new Error("Failed to sync data");
      await loadConnections();
      await loadOpportunities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const updateOpportunityStatus = async (
    opportunityId: string,
    status: string
  ) => {
    try {
      const res = await fetch("/api/search-console/opportunities", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ opportunityId, status }),
      });

      if (!res.ok) throw new Error("Failed to update opportunity");
      await loadOpportunities();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    loadConnections();
    loadOpportunities();
  }, [resolvedParams.id]);

  const filteredOpportunities =
    filter === "all"
      ? opportunities
      : opportunities.filter((o) => o.type === filter);

  const typeLabel = (type: string) => {
    switch (type) {
      case "HIGH_IMPRESSION_LOW_CTR":
        return "High Impression, Low CTR";
      case "POSITION_4_TO_10":
        return "Position 4-10";
      case "CANNIBALIZED_QUERY":
        return "Cannibalized Query";
      case "DECLINING_PAGE":
        return "Declining Page";
      default:
        return type;
    }
  };

  const typeColor = (type: string) => {
    switch (type) {
      case "HIGH_IMPRESSION_LOW_CTR":
        return "bg-yellow-100 text-yellow-800";
      case "POSITION_4_TO_10":
        return "bg-blue-100 text-blue-800";
      case "CANNIBALIZED_QUERY":
        return "bg-red-100 text-red-800";
      case "DECLINING_PAGE":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">
        Google Search Console
      </h1>

      <div className="mb-6 flex gap-2 border-b">
        <button
          onClick={() => setActiveTab("connections")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "connections"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Connections
        </button>
        <button
          onClick={() => setActiveTab("opportunities")}
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === "opportunities"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Opportunities ({opportunities.length})
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {activeTab === "connections" && (
        <div>
          <div className="mb-6 rounded-lg border p-4">
            <h2 className="mb-2 text-lg font-medium">Connect Property</h2>
            <p className="mb-3 text-sm text-gray-500">
              Enter your Search Console property URL and access token
            </p>
            <input
              type="text"
              value={propertyUrl}
              onChange={(e) => setPropertyUrl(e.target.value)}
              placeholder="https://example.com"
              className="mb-3 w-full rounded-md border p-2 text-sm"
            />
            <input
              type="password"
              value={accessToken}
              onChange={(e) => setAccessToken(e.target.value)}
              placeholder="Access token"
              className="mb-3 w-full rounded-md border p-2 text-sm"
            />
            <button
              onClick={connectProperty}
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Connecting..." : "Connect"}
            </button>
          </div>

          <div className="space-y-3">
            {connections.map((conn) => (
              <div key={conn.id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="font-medium">{conn.propertyUrl}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${
                      conn.syncStatus === "SYNCED"
                        ? "bg-green-100 text-green-800"
                        : conn.syncStatus === "ERROR"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {conn.syncStatus}
                  </span>
                </div>
                <div className="mb-2 text-sm text-gray-500">
                  {conn.lastSyncAt
                    ? `Last synced: ${new Date(conn.lastSyncAt).toLocaleString()}`
                    : "Never synced"}
                </div>
                <button
                  onClick={() => syncData(conn.id)}
                  disabled={loading}
                  className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Syncing..." : "Sync Now"}
                </button>
              </div>
            ))}

            {connections.length === 0 && (
              <div className="rounded-lg border p-8 text-center text-gray-500">
                No Search Console connections. Connect a property to get started.
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "opportunities" && (
        <div>
          {summary && (
            <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border p-4">
                <div className="text-sm text-gray-500">Total</div>
                <div className="text-2xl font-semibold">{summary.total}</div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-gray-500">Low CTR</div>
                <div className="text-2xl font-semibold text-yellow-600">
                  {summary.highImpressionLowCtr}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-gray-500">Page 2</div>
                <div className="text-2xl font-semibold text-blue-600">
                  {summary.position4To10}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-sm text-gray-500">Cannibalized</div>
                <div className="text-2xl font-semibold text-red-600">
                  {summary.cannibalized}
                </div>
              </div>
            </div>
          )}

          <div className="mb-4 flex gap-2">
            {[
              "all",
              "HIGH_IMPRESSION_LOW_CTR",
              "POSITION_4_TO_10",
              "CANNIBALIZED_QUERY",
              "DECLINING_PAGE",
            ].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-md px-2 py-1 text-xs font-medium ${
                  filter === f
                    ? "bg-gray-200 text-gray-900"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {f === "all"
                  ? "All"
                  : f
                      .replace(/_/g, " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredOpportunities.map((opp) => (
              <div key={opp.id} className="rounded-lg border p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${typeColor(opp.type)}`}
                  >
                    {typeLabel(opp.type)}
                  </span>
                  <span className="text-sm font-medium">{opp.query}</span>
                </div>
                <div className="mb-2 text-sm text-gray-600">{opp.page}</div>
                <div className="mb-3 text-sm text-gray-500">
                  {opp.rationale}
                </div>
                {opp.status === "new" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        updateOpportunityStatus(opp.id, "actioned")
                      }
                      className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Mark Actioned
                    </button>
                    <button
                      onClick={() =>
                        updateOpportunityStatus(opp.id, "dismissed")
                      }
                      className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-gray-50"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            ))}

            {filteredOpportunities.length === 0 && (
              <div className="rounded-lg border p-8 text-center text-gray-500">
                No opportunities found. Sync Search Console data to detect
                opportunities.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
