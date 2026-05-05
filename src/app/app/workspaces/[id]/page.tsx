"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface DashboardData {
  workspaceId: string;
  keywords: {
    total: number;
    tracking: number;
    top3: number;
    top10: number;
    top20: number;
    healthPercentage: number;
  };
  contentScores: {
    total: number;
    avgContentScore: number;
    avgGeoScore: number;
    above70: number;
    below50: number;
    passRate: number;
    blockRate: number;
  };
  citations: {
    total: number;
    avgScore: number;
    appearing: number;
    notAppearing: number;
    visibilityRate: number;
  };
  backlinks: {
    total: number;
    highPriority: number;
    mediumPriority: number;
    lowPriority: number;
    contacted: number;
    contactRate: number;
  };
  audit: {
    lastRunAt: string | null;
    totalIssues: number;
    critical: number;
    warning: number;
    info: number;
    isStale: boolean;
  };
  inventory: {
    total: number;
    needsRefresh: number;
    outdated: number;
    healthy: number;
    healthPercentage: number;
  };
  articles: {
    total: number;
    published: number;
    draft: number;
    inReview: number;
    publishRate: number;
  };
  overallHealth: number;
}

function MetricCard({
  title,
  value,
  subtitle,
  trend,
  link,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  link?: string;
}) {
  const trendColor =
    trend === "up"
      ? "text-green-600"
      : trend === "down"
        ? "text-red-600"
        : "text-gray-400";

  const content = (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="text-2xl font-semibold">{value}</span>
        {trend && (
          <span className={`text-sm ${trendColor}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"}
          </span>
        )}
      </div>
      {subtitle && (
        <div className="mt-1 text-xs text-gray-400">{subtitle}</div>
      )}
    </div>
  );

  if (link) {
    return <Link href={link}>{content}</Link>;
  }

  return content;
}

function ProgressBar({
  value,
  max = 100,
  color = "bg-blue-600",
}: {
  value: number;
  max?: number;
  color?: string;
}) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

function HealthBadge({ score }: { score: number }) {
  const color =
    score >= 70
      ? "bg-green-100 text-green-800"
      : score >= 50
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${color}`}>
      {score}/100
    </span>
  );
}

export default function WorkspaceDashboard({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = params as unknown as { id: string };
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(`/api/dashboard?workspaceId=${resolvedParams.id}`);
        if (!res.ok) throw new Error("Failed to load dashboard data");
        const json = await res.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="font-medium text-red-800">Error loading dashboard</div>
        <div className="mt-1 text-sm text-red-600">{error}</div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <HealthBadge score={data.overallHealth} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Keywords Tracked"
          value={data.keywords.tracking}
          subtitle={`${data.keywords.top3} in top 3`}
          link={`/app/workspaces/${resolvedParams.id}/keywords`}
        />
        <MetricCard
          title="Content Score"
          value={data.contentScores.avgContentScore}
          subtitle={`${data.contentScores.passRate}% passing`}
          link={`/app/workspaces/${resolvedParams.id}/articles/new`}
        />
        <MetricCard
          title="Citations"
          value={data.citations.appearing}
          subtitle={`${data.citations.visibilityRate}% visibility`}
          link={`/app/workspaces/${resolvedParams.id}/citations`}
        />
        <MetricCard
          title="Backlinks"
          value={data.backlinks.contacted}
          subtitle={`${data.backlinks.contactRate}% contacted`}
          link={`/app/workspaces/${resolvedParams.id}/backlinks`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-medium">Keyword Rankings</h2>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span>Top 3</span>
                <span className="font-medium">{data.keywords.top3}</span>
              </div>
              <ProgressBar
                value={data.keywords.top3}
                max={data.keywords.tracking || 1}
                color="bg-green-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Top 10</span>
                <span className="font-medium">{data.keywords.top10}</span>
              </div>
              <ProgressBar
                value={data.keywords.top10}
                max={data.keywords.tracking || 1}
                color="bg-blue-600"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span>Top 20</span>
                <span className="font-medium">{data.keywords.top20}</span>
              </div>
              <ProgressBar
                value={data.keywords.top20}
                max={data.keywords.tracking || 1}
                color="bg-yellow-600"
              />
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-medium">Content Health</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Average Content Score</span>
              <span className="font-medium">
                {data.contentScores.avgContentScore}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Average GEO Score</span>
              <span className="font-medium">
                {data.contentScores.avgGeoScore}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Above 70 (Pass)</span>
              <span className="font-medium text-green-600">
                {data.contentScores.above70}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Below 50 (Block)</span>
              <span className="font-medium text-red-600">
                {data.contentScores.below50}
              </span>
            </div>
            <div className="mt-2 flex gap-2 text-xs">
              <span className="rounded bg-green-100 px-2 py-1 text-green-800">
                {data.articles.published} published
              </span>
              <span className="rounded bg-yellow-100 px-2 py-1 text-yellow-800">
                {data.articles.inReview} ready
              </span>
              <span className="rounded bg-gray-100 px-2 py-1 text-gray-800">
                {data.articles.draft} draft
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-medium">Technical Audit</h2>
          {data.audit.lastRunAt ? (
            <div className="space-y-3">
              <div className="text-xs text-gray-500">
                Last run: {new Date(data.audit.lastRunAt).toLocaleDateString()}
                {data.audit.isStale && (
                  <span className="ml-2 text-yellow-600">(stale)</span>
                )}
              </div>
              <div className="flex justify-between text-sm">
                <span>Critical</span>
                <span className="font-medium text-red-600">
                  {data.audit.critical}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Warnings</span>
                <span className="font-medium text-yellow-600">
                  {data.audit.warning}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Info</span>
                <span className="font-medium text-blue-600">
                  {data.audit.info}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              No audit runs yet.{" "}
              <Link
                href={`/app/workspaces/${resolvedParams.id}/settings/audit`}
                className="text-blue-600 hover:underline"
              >
                Run your first audit
              </Link>
            </div>
          )}
        </div>

        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-medium">Content Inventory</h2>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Total Pages</span>
              <span className="font-medium">{data.inventory.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Healthy</span>
              <span className="font-medium text-green-600">
                {data.inventory.healthy}
              </span>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Health</span>
                <span>{data.inventory.healthPercentage}%</span>
              </div>
              <ProgressBar
                value={data.inventory.healthPercentage}
                color="bg-green-600"
              />
            </div>
            <Link
              href={`/app/workspaces/${resolvedParams.id}/inventory`}
              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
            >
              View inventory →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
