import type { Metadata } from "next";

import { ArticleGenerationForm } from "@/components/articles/generation-form";

export const metadata: Metadata = {
  title: "Generate Article",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Generate Article</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create AI-generated articles that are automatically scored through the scoring engine.
        </p>
      </div>

      <ArticleGenerationForm workspaceId={id} />
    </div>
  );
}
