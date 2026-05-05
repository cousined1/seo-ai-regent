"use client";

import { useState } from "react";

interface CmsConnection {
  id: string;
  platform: string;
  name: string;
  siteUrl: string;
}

interface PublishFlowModalProps {
  articleId: string;
  contentScore: number;
  geoScore: number;
  publishEligible: boolean;
  connections: CmsConnection[];
  onClose: () => void;
  onPublish: () => void;
}

export function PublishFlowModal({
  articleId,
  contentScore,
  geoScore,
  publishEligible,
  connections,
  onClose,
  onPublish,
}: PublishFlowModalProps) {
  const [selectedConnection, setSelectedConnection] = useState<string>("");
  const [action, setAction] = useState<"preview" | "draft">("preview");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  const isEligible = contentScore >= 70 && geoScore >= 70 && publishEligible;

  async function handlePublish() {
    if (!selectedConnection) {
      setError("Select a CMS connection");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/articles/${articleId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cmsConnectionId: selectedConnection,
          action,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403) {
          setError(`Publish blocked: ${data.reason}`);
        } else {
          setError(data.error ?? "Failed to publish");
        }
        return;
      }

      setResult(data);
      onPublish();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-lg rounded-lg bg-background p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Publish Article</h2>

        <div className="mb-4 grid grid-cols-2 gap-4">
          <div className={`rounded-md border p-3 ${contentScore >= 70 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <p className="text-xs text-muted-foreground">Content Score</p>
            <p className={`text-2xl font-semibold ${contentScore >= 70 ? "text-green-600" : "text-red-600"}`}>
              {contentScore}
            </p>
          </div>
          <div className={`rounded-md border p-3 ${geoScore >= 70 ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
            <p className="text-xs text-muted-foreground">GEO Score</p>
            <p className={`text-2xl font-semibold ${geoScore >= 70 ? "text-green-600" : "text-red-600"}`}>
              {geoScore}
            </p>
          </div>
        </div>

        {!isEligible && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <p className="font-medium">Publish Blocked</p>
            <p>Both Content Score and GEO Score must be 70+ to publish.</p>
          </div>
        )}

        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {result && (
          <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <p className="font-medium">{result.message}</p>
          </div>
        )}

        {isEligible && (
          <>
            <div className="mb-4 space-y-2">
              <label className="block text-sm font-medium">CMS Connection</label>
              <select
                value={selectedConnection}
                onChange={(e) => setSelectedConnection(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select a connection...</option>
                {connections.map((conn) => (
                  <option key={conn.id} value={conn.id}>
                    {conn.name} ({conn.platform})
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6 space-y-2">
              <label className="block text-sm font-medium">Action</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAction("preview")}
                  className={`flex-1 rounded-md px-3 py-2 text-sm ${
                    action === "preview" ? "bg-primary text-primary-foreground" : "border"
                  }`}
                >
                  Preview
                </button>
                <button
                  type="button"
                  onClick={() => setAction("draft")}
                  className={`flex-1 rounded-md px-3 py-2 text-sm ${
                    action === "draft" ? "bg-primary text-primary-foreground" : "border"
                  }`}
                >
                  Save as Draft
                </button>
              </div>
            </div>
          </>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-2 text-sm hover:bg-muted"
          >
            Close
          </button>
          {isEligible && (
            <button
              onClick={handlePublish}
              disabled={loading || !selectedConnection}
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {loading ? "Processing..." : action === "preview" ? "Preview" : "Save Draft"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
