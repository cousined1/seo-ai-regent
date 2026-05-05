"use client";

import { useState } from "react";

interface InventoryImportFormProps {
  siteId: string;
  onImport: () => void;
}

export function InventoryImportForm({ siteId, onImport }: InventoryImportFormProps) {
  const [mode, setMode] = useState<"manual" | "csv">("manual");
  const [urls, setUrls] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const urlList = urls
        .split("\n")
        .map((u) => u.trim())
        .filter(Boolean);

      if (urlList.length === 0) {
        setError("Enter at least one URL");
        return;
      }

      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteId,
          urls: urlList,
          source: mode === "csv" ? "CSV" : "MANUAL",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to import URLs");
        return;
      }

      setUrls("");
      onImport();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-6">
      <div>
        <h2 className="text-lg font-medium">Import Pages</h2>
        <p className="text-sm text-muted-foreground">
          Add URLs to your content inventory for scoring and refresh analysis.
        </p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={`rounded-md px-3 py-1.5 text-sm ${
            mode === "manual" ? "bg-primary text-primary-foreground" : "border bg-background"
          }`}
        >
          Manual
        </button>
        <button
          type="button"
          onClick={() => setMode("csv")}
          className={`rounded-md px-3 py-1.5 text-sm ${
            mode === "csv" ? "bg-primary text-primary-foreground" : "border bg-background"
          }`}
        >
          CSV
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="urls" className="block text-sm font-medium">
          {mode === "manual" ? "URLs (one per line)" : "CSV content (with url column)"}
        </label>
        <textarea
          id="urls"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
          placeholder={mode === "manual" ? "https://example.com/page-1\nhttps://example.com/page-2" : "url,title\nhttps://example.com/page-1,Page Title"}
          rows={4}
          className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
      </div>

      <button
        type="submit"
        disabled={loading || !urls.trim()}
        className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        {loading ? "Importing..." : "Import"}
      </button>
    </form>
  );
}
