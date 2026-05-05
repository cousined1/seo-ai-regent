"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type ArticleTemplate = "pillar" | "listicle" | "how-to" | "comparison" | "faq";

const templateDescriptions: Record<ArticleTemplate, string> = {
  pillar: "Comprehensive guide covering all aspects of a topic",
  listicle: "Numbered list format with ranked items",
  "how-to": "Step-by-step instructional format",
  comparison: "Side-by-side analysis of options",
  faq: "Question and answer format",
};

interface ArticleGenerationFormProps {
  workspaceId: string;
}

export function ArticleGenerationForm({ workspaceId }: ArticleGenerationFormProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [template, setTemplate] = useState<ArticleTemplate>("pillar");
  const [targetWordCount, setTargetWordCount] = useState(500);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/articles/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          keyword,
          template,
          targetWordCount,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Failed to generate article");
        return;
      }

      setResult(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenInEditor() {
    if (result?.article?.id) {
      router.push(`/app/editor?article=${result.article.id}`);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border p-6">
        <div>
          <h2 className="text-lg font-medium">Generate Article</h2>
          <p className="text-sm text-muted-foreground">
            Create a scored article from a keyword. Articles below 70/100 require review before publishing.
          </p>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="keyword" className="block text-sm font-medium">
            Target Keyword
          </label>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. seo automation"
            required
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium">Template</label>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(templateDescriptions) as ArticleTemplate[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTemplate(t)}
                className={`rounded-md border p-3 text-left text-sm transition-colors ${
                  template === t
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted"
                }`}
              >
                <p className="font-medium">{t.charAt(0).toUpperCase() + t.slice(1)}</p>
                <p className="text-xs text-muted-foreground">{templateDescriptions[t]}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="wordCount" className="block text-sm font-medium">
            Target Word Count: {targetWordCount}
          </label>
          <input
            id="wordCount"
            type="range"
            min={300}
            max={1500}
            step={100}
            value={targetWordCount}
            onChange={(e) => setTargetWordCount(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>300</span>
            <span>1500</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !keyword.trim()}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Article"}
        </button>
      </form>

      {result && (
        <div className="space-y-4 rounded-lg border p-6">
          <h2 className="text-lg font-medium">Generation Result</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <ScoreCard label="Content Score" score={result.scoring.contentScore.overall} />
            <ScoreCard label="GEO Score" score={result.scoring.geoScore.overall} />
          </div>

          {result.eligibility.eligible ? (
            <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
              <p className="font-medium">Publish Eligible</p>
              <p>This article meets the 70/100 threshold for both Content and GEO scores.</p>
            </div>
          ) : (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <p className="font-medium">Review Required</p>
              <p>{result.eligibility.blockedReason}</p>
            </div>
          )}

          <div className="space-y-2">
            <h3 className="text-sm font-medium">Top Actions to Improve Score</h3>
            {result.scoring.topActions?.slice(0, 3).map((action: any, i: number) => (
              <div key={i} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{action.title}</p>
                <p className="text-muted-foreground">{action.detail}</p>
                <p className="mt-1 text-xs font-medium text-green-600">{action.liftLabel}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleOpenInEditor}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90"
          >
            Open in Editor
          </button>
        </div>
      )}
    </div>
  );
}

function ScoreCard({ label, score }: { label: string; score: number }) {
  const color = score >= 70 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-red-600";
  const bgColor = score >= 70 ? "bg-green-50" : score >= 50 ? "bg-amber-50" : "bg-red-50";

  return (
    <div className={`rounded-lg border p-4 ${bgColor}`}>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={`text-3xl font-semibold ${color}`}>{Math.round(score)}</p>
      <p className="text-xs text-muted-foreground">/ 100</p>
    </div>
  );
}
