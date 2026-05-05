"use client";

import { useEffect, useState } from "react";

type CmsPlatform = "WORDPRESS" | "WEBFLOW" | "SHOPIFY" | "GHOST" | "NOTION" | "WEBHOOK";

interface CmsConnection {
  id: string;
  platform: CmsPlatform;
  name: string;
  siteUrl: string;
  status: string;
  connectedAt: string;
  lastTestedAt: string | null;
}

interface CmsConnectionsPageProps {
  workspaceId: string;
}

export function CmsConnectionsPage({ workspaceId }: CmsConnectionsPageProps) {
  const [connections, setConnections] = useState<CmsConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState<CmsPlatform>("WORDPRESS");
  const [name, setName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function fetchConnections() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/cms?workspaceId=${workspaceId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to load connections");
        return;
      }

      setConnections(data.connections ?? []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchConnections();
  }, [workspaceId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspaceId,
          platform,
          name: name || `${platform} Connection`,
          siteUrl,
          credentials: { apiKey },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to create connection");
        return;
      }

      setShowForm(false);
      setName("");
      setSiteUrl("");
      setApiKey("");
      fetchConnections();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading && connections.length === 0) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading connections...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">CMS Connections</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Connect your CMS to publish scored articles directly.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {showForm ? "Cancel" : "Add Connection"}
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-6">
          <h2 className="text-lg font-medium">New CMS Connection</h2>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Platform</label>
            <select
              value={platform}
              onChange={(e) => setPlatform(e.target.value as CmsPlatform)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="WORDPRESS">WordPress</option>
              <option value="WEBFLOW">Webflow</option>
              <option value="SHOPIFY">Shopify</option>
              <option value="GHOST">Ghost</option>
              <option value="NOTION">Notion</option>
              <option value="WEBHOOK">Webhook</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Connection Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My WordPress Site"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Site URL</label>
            <input
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">API Key / Token</label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your API key"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting || !siteUrl || !apiKey}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {submitting ? "Connecting..." : "Connect"}
          </button>
        </form>
      )}

      {connections.length === 0 ? (
        <div className="rounded-lg border border-dashed p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No CMS connections yet. Add a connection to start publishing articles.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {connections.map((conn) => (
            <div key={conn.id} className="rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{conn.name}</p>
                  <p className="text-sm text-muted-foreground">{conn.siteUrl}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                    {conn.platform}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Connected {new Date(conn.connectedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
