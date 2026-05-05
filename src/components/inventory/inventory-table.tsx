"use client";

import { useEffect, useState } from "react";

interface InventoryItem {
  id: string;
  url: string;
  title: string | null;
  metaDescription: string | null;
  importedFrom: string;
  createdAt: string;
  contentScore: number | null;
  geoScore: number | null;
  hasBrief: boolean;
  briefStatus: string | null;
}

interface InventoryTableProps {
  siteId: string;
}

export function InventoryTable({ siteId }: InventoryTableProps) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scoringId, setScoringId] = useState<string | null>(null);

  async function fetchInventory() {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/inventory?siteId=${siteId}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to load inventory");
        return;
      }

      setItems(data.items ?? []);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchInventory();
  }, [siteId]);

  async function handleScore(itemId: string) {
    setScoringId(itemId);
    try {
      const response = await fetch(`/api/inventory/${itemId}/score`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to score content");
        return;
      }

      await fetchInventory();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setScoringId(null);
    }
  }

  async function handleCreateBrief(itemId: string) {
    try {
      const response = await fetch(`/api/inventory/${itemId}/brief`, {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to create brief");
        return;
      }

      await fetchInventory();
    } catch {
      setError("Network error. Please try again.");
    }
  }

  if (loading && items.length === 0) {
    return <div className="py-12 text-center text-sm text-muted-foreground">Loading inventory...</div>;
  }

  if (error) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-12 text-center">
        <p className="text-sm text-muted-foreground">
          No pages in inventory. Import URLs from your sitemap or add them manually.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="border-b bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">URL</th>
            <th className="px-4 py-3 text-left font-medium">Title</th>
            <th className="px-4 py-3 text-right font-medium">Content</th>
            <th className="px-4 py-3 text-right font-medium">GEO</th>
            <th className="px-4 py-3 text-center font-medium">Brief</th>
            <th className="px-4 py-3 text-center font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b last:border-b-0">
              <td className="px-4 py-3 max-w-[200px] truncate font-mono text-xs">
                {item.url}
              </td>
              <td className="px-4 py-3 max-w-[150px] truncate">
                {item.title ?? "-"}
              </td>
              <td className="px-4 py-3 text-right">
                {item.contentScore != null ? (
                  <span className={item.contentScore >= 70 ? "text-green-600" : item.contentScore >= 50 ? "text-amber-600" : "text-red-600"}>
                    {item.contentScore}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-4 py-3 text-right">
                {item.geoScore != null ? (
                  <span className={item.geoScore >= 70 ? "text-green-600" : item.geoScore >= 50 ? "text-amber-600" : "text-red-600"}>
                    {item.geoScore}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                {item.hasBrief ? (
                  <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                    {item.briefStatus}
                  </span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => handleScore(item.id)}
                    disabled={scoringId === item.id}
                    className="rounded-md border px-2 py-1 text-xs disabled:opacity-50"
                  >
                    {scoringId === item.id ? "Scoring..." : "Score"}
                  </button>
                  {item.contentScore != null && (
                    <button
                      onClick={() => handleCreateBrief(item.id)}
                      className="rounded-md border px-2 py-1 text-xs"
                    >
                      Brief
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
