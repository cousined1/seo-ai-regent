"use client";

import { useEffect, useState } from "react";

interface BriefRecommendation {
  type: string;
  description: string;
  expectedLift: string;
  effort: "low" | "medium" | "high";
}

interface BriefData {
  brief: {
    id: string;
    targetScore: number;
    status: string;
    recommendations: BriefRecommendation[];
  };
  issues: Array<{
    type: string;
    severity: string;
    message: string;
  }>;
  impactScore: number;
  currentScores: {
    content: number;
    geo: number;
  };
}

interface RefreshBriefViewProps {
  itemId: string;
}

export function RefreshBriefView({ itemId }: RefreshBriefViewProps) {
  const [data, setData] = useState<BriefData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchBrief() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/inventory/${itemId}/brief`, {
        method: "POST",
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Failed to load brief");
        return;
      }

      setData(result);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBrief();
  }, [itemId]);

  if (loading) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading brief...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error}
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const severityColors: Record<string, string> = {
    critical: "bg-red-100 text-red-800",
    warning: "bg-amber-100 text-amber-800",
    info: "bg-blue-100 text-blue-800",
  };

  const effortColors: Record<string, string> = {
    low: "text-green-600",
    medium: "text-amber-600",
    high: "text-red-600",
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Refresh Brief</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Analysis and recommendations for improving this page.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Content Score</p>
          <p className={`text-2xl font-semibold ${data.currentScores.content >= 70 ? "text-green-600" : data.currentScores.content >= 50 ? "text-amber-600" : "text-red-600"}`}>
            {data.currentScores.content}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">GEO Score</p>
          <p className={`text-2xl font-semibold ${data.currentScores.geo >= 70 ? "text-green-600" : data.currentScores.geo >= 50 ? "text-amber-600" : "text-red-600"}`}>
            {data.currentScores.geo}
          </p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-sm text-muted-foreground">Impact Score</p>
          <p className={`text-2xl font-semibold ${data.impactScore >= 60 ? "text-red-600" : data.impactScore >= 30 ? "text-amber-600" : "text-green-600"}`}>
            {data.impactScore}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Issues Found ({data.issues.length})</h2>
        {data.issues.map((issue, i) => (
          <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${severityColors[issue.severity] ?? "bg-gray-100 text-gray-800"}`}>
              {issue.severity}
            </span>
            <div>
              <p className="font-medium">{issue.type}</p>
              <p className="text-sm text-muted-foreground">{issue.message}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Recommendations</h2>
        {data.brief.recommendations.map((rec, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium">{rec.type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</p>
                <p className="mt-1 text-sm text-muted-foreground">{rec.description}</p>
              </div>
              <span className={`text-sm font-medium ${effortColors[rec.effort]}`}>
                {rec.effort} effort
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-green-600">{rec.expectedLift}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg border p-4">
        <p className="text-sm text-muted-foreground">Target Score</p>
        <p className="text-2xl font-semibold">{data.brief.targetScore}</p>
      </div>
    </div>
  );
}
