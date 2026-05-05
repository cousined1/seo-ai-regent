"use client";

import { useState, useEffect } from "react";

interface BacklinkOpportunity {
  id: string;
  sourceUrl: string;
  sourceDomain: string;
  domainAuthority: number | null;
  pageAuthority: number | null;
  relevance: string | null;
  provenance: string;
  contactEmail: string | null;
  contactName: string | null;
  status: string;
  notes: string | null;
  _count: { outreachLogs: number };
}

interface Summary {
  total: number;
  identified: number;
  outreachSent: number;
  linkAcquired: number;
  avgAuthority: number;
}

export default function BacklinksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = params as unknown as { id: string };
  const [opportunities, setOpportunities] = useState<BacklinkOpportunity[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showOutreachModal, setShowOutreachModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/backlinks?workspaceId=${resolvedParams.id}`
      );
      if (!res.ok) throw new Error("Failed to load backlink data");
      const data = await res.json();
      setOpportunities(data.opportunities);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (opportunityId: string, status: string) => {
    try {
      const res = await fetch(`/api/backlinks/${opportunityId}/outreach`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Failed to update status");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    loadData();
  }, [resolvedParams.id]);

  const filteredOpportunities =
    filter === "all"
      ? opportunities
      : opportunities.filter((o) => o.status === filter);

  const statusColor = (status: string) => {
    switch (status) {
      case "IDENTIFIED":
        return "bg-blue-100 text-blue-800";
      case "OUTREACH_SENT":
        return "bg-yellow-100 text-yellow-800";
      case "LINK_ACQUIRED":
        return "bg-green-100 text-green-800";
      case "DECLINED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const daColor = (da: number | null) => {
    if (!da) return "bg-gray-100 text-gray-600";
    if (da >= 70) return "bg-green-100 text-green-800";
    if (da >= 40) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const selected = opportunities.find((o) => o.id === selectedId);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Backlink Outreach</h1>

      {summary && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Total Opportunities</div>
            <div className="text-2xl font-semibold">{summary.total}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Identified</div>
            <div className="text-2xl font-semibold text-blue-600">
              {summary.identified}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Outreach Sent</div>
            <div className="text-2xl font-semibold text-yellow-600">
              {summary.outreachSent}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Avg Authority</div>
            <div className="text-2xl font-semibold">{summary.avgAuthority}</div>
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
          {[
            "all",
            "IDENTIFIED",
            "OUTREACH_SENT",
            "LINK_ACQUIRED",
            "DECLINED",
          ].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1 text-sm font-medium ${
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
        <button
          onClick={loadData}
          disabled={loading}
          className="ml-auto rounded-md border px-3 py-1 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="space-y-3">
        {filteredOpportunities.map((opp) => (
          <div
            key={opp.id}
            className={`rounded-lg border p-4 cursor-pointer hover:bg-gray-50 ${
              selectedId === opp.id ? "border-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => setSelectedId(opp.id)}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-medium">{opp.sourceDomain}</span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${daColor(opp.domainAuthority)}`}
                >
                  DA: {opp.domainAuthority || "-"}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-xs font-medium ${statusColor(opp.status)}`}
                >
                  {opp.status.replace(/_/g, " ")}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                {opp._count.outreachLogs} outreach(s)
              </span>
            </div>

            <div className="mb-2 text-sm text-gray-600">{opp.sourceUrl}</div>
            <div className="text-sm text-gray-500">{opp.provenance}</div>

            {opp.contactEmail && (
              <div className="mt-2 text-xs text-blue-600">
                Contact: {opp.contactName || "Unknown"} ({opp.contactEmail})
              </div>
            )}

            {selectedId === opp.id && (
              <div className="mt-3 flex gap-2 border-t pt-3">
                {opp.status === "IDENTIFIED" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(opp.id, "OUTREACH_SENT");
                      }}
                      className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                    >
                      Mark Outreach Sent
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(opp.id);
                        setShowOutreachModal(true);
                      }}
                      className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-gray-50"
                    >
                      Generate Template
                    </button>
                  </>
                )}
                {opp.status === "OUTREACH_SENT" && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(opp.id, "LINK_ACQUIRED");
                      }}
                      className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                    >
                      Mark Link Acquired
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatus(opp.id, "FOLLOW_UP_SENT");
                      }}
                      className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-gray-50"
                    >
                      Follow Up
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}

        {filteredOpportunities.length === 0 && !loading && (
          <div className="rounded-lg border p-8 text-center text-gray-500">
            No backlink opportunities found. Add sources to start outreach.
          </div>
        )}
      </div>

      {showOutreachModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-lg rounded-lg bg-white p-6">
            <h3 className="mb-4 text-lg font-medium">
              Outreach Template for {selected.sourceDomain}
            </h3>
            <pre className="mb-4 whitespace-pre-wrap rounded-md bg-gray-50 p-4 text-sm">
              Subject: Quick question about your content on{" "}
              {selected.sourceDomain}
              {"\n\n"}
              Hi there,{"\n\n"}
              I recently came across your article on {selected.sourceDomain}{" "}
              and was impressed by the quality of your content.{"\n\n"}
              {selected.provenance &&
                `Specifically, your piece about "${selected.provenance}" caught my attention.`}
              {"\n\n"}
              I thought you might find our tool useful for your readers. Would
              you be open to considering adding a mention or link?{"\n\n"}
              Best regards
            </pre>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowOutreachModal(false)}
                className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  updateStatus(selected.id, "OUTREACH_SENT");
                  setShowOutreachModal(false);
                }}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Mark as Sent
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
