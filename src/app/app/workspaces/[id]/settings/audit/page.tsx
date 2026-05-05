"use client";

import { useState, useEffect } from "react";

interface IssueSummary {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  open: number;
  fixed: number;
  ignored: number;
}

interface TechnicalIssue {
  id: string;
  url: string;
  type: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  state: "OPEN" | "IGNORED" | "FIXED" | "REGRESSED";
  title: string;
  description: string | null;
  suggestion: string | null;
  firstSeen: string;
  lastSeen: string;
  resolvedAt: string | null;
}

interface AuditRun {
  id: string;
  siteId: string;
  status: string;
  completedAt: string | null;
}

export default function AuditDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = params as unknown as { id: string };
  const [urls, setUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const [issues, setIssues] = useState<TechnicalIssue[]>([]);
  const [summary, setSummary] = useState<IssueSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const runAudit = async () => {
    const urlList = urls
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    if (urlList.length === 0) {
      setError("Enter at least one URL to audit");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/audit/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siteId: resolvedParams.id, urls: urlList }),
      });

      if (!res.ok) {
        throw new Error("Failed to run audit");
      }

      const data = await res.json();
      await loadIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const loadIssues = async () => {
    try {
      const res = await fetch(`/api/audit/issues?siteId=${resolvedParams.id}`);
      if (!res.ok) throw new Error("Failed to load issues");
      const data = await res.json();
      setIssues(data.issues);
      setSummary(data.summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const updateIssueState = async (issueId: string, state: string) => {
    try {
      const res = await fetch("/api/audit/issues", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ issueId, state }),
      });

      if (!res.ok) throw new Error("Failed to update issue");
      await loadIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const verifyRecrawl = async (issue: TechnicalIssue) => {
    try {
      const res = await fetch("/api/audit/recrawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: issue.url, issueIds: [issue.id] }),
      });

      if (!res.ok) throw new Error("Failed to verify recrawl");
      await loadIssues();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    loadIssues();
  }, [resolvedParams.id]);

  const filteredIssues =
    filter === "all"
      ? issues
      : issues.filter((i) => i.severity.toLowerCase() === filter);

  const severityColor = (severity: string) => {
    switch (severity) {
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

  const stateColor = (state: string) => {
    switch (state) {
      case "OPEN":
        return "bg-red-50 text-red-700";
      case "FIXED":
        return "bg-green-50 text-green-700";
      case "IGNORED":
        return "bg-gray-50 text-gray-700";
      case "REGRESSED":
        return "bg-purple-50 text-purple-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="mx-auto max-w-6xl p-6">
      <h1 className="mb-6 text-2xl font-semibold">Technical SEO Audit</h1>

      {summary && (
        <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Total Issues</div>
            <div className="text-2xl font-semibold">{summary.total}</div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Critical</div>
            <div className="text-2xl font-semibold text-red-600">
              {summary.critical}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Open</div>
            <div className="text-2xl font-semibold text-orange-600">
              {summary.open}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-sm text-gray-500">Fixed</div>
            <div className="text-2xl font-semibold text-green-600">
              {summary.fixed}
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 rounded-lg border p-4">
        <h2 className="mb-2 text-lg font-medium">Run New Audit</h2>
        <p className="mb-3 text-sm text-gray-500">
          Enter URLs to crawl, one per line
        </p>
        <textarea
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder="https://example.com/page-1&#10;https://example.com/page-2"
          className="mb-3 w-full rounded-md border p-2 font-mono text-sm"
          rows={4}
        />
        {error && <div className="mb-3 text-sm text-red-600">{error}</div>}
        <button
          onClick={runAudit}
          disabled={loading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Running audit..." : "Run Audit"}
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <h2 className="text-lg font-medium">Issues</h2>
        <div className="ml-auto flex gap-1">
          {["all", "critical", "high", "medium", "low"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-2 py-1 text-xs font-medium ${
                filter === f
                  ? "bg-gray-200 text-gray-900"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filteredIssues.map((issue) => (
          <div key={issue.id} className="rounded-lg border p-4">
            <div className="mb-2 flex items-center gap-2">
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${severityColor(issue.severity)}`}
              >
                {issue.severity}
              </span>
              <span
                className={`rounded px-2 py-0.5 text-xs font-medium ${stateColor(issue.state)}`}
              >
                {issue.state}
              </span>
              <span className="text-sm font-medium">{issue.title}</span>
            </div>
            <div className="mb-2 text-sm text-gray-600">{issue.url}</div>
            {issue.description && (
              <div className="mb-2 text-sm text-gray-500">
                {issue.description}
              </div>
            )}
            {issue.suggestion && (
              <div className="mb-3 text-sm text-blue-600">
                {issue.suggestion}
              </div>
            )}
            <div className="flex gap-2">
              {issue.state === "OPEN" && (
                <>
                  <button
                    onClick={() => verifyRecrawl(issue)}
                    className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Verify Fix
                  </button>
                  <button
                    onClick={() => updateIssueState(issue.id, "IGNORED")}
                    className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-gray-50"
                  >
                    Ignore
                  </button>
                </>
              )}
              {issue.state === "IGNORED" && (
                <button
                  onClick={() => updateIssueState(issue.id, "OPEN")}
                  className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-gray-50"
                >
                  Reopen
                </button>
              )}
            </div>
          </div>
        ))}

        {filteredIssues.length === 0 && (
          <div className="rounded-lg border p-8 text-center text-gray-500">
            No issues found. Run an audit to check your site.
          </div>
        )}
      </div>
    </div>
  );
}
