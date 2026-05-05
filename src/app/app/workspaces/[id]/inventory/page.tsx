import type { Metadata } from "next";

import { InventoryImportForm } from "@/components/inventory/import-form";
import { InventoryTable } from "@/components/inventory/inventory-table";

export const metadata: Metadata = {
  title: "Content Inventory",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function InventoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-6xl space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Content Inventory</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Import, score, and analyze your existing content for refresh opportunities.
        </p>
      </div>

      <InventoryImportForm siteId={id} onImport={() => {}} />
      <InventoryTable siteId={id} />
    </div>
  );
}
