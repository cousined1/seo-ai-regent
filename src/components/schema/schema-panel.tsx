"use client";

import { useState, useEffect } from "react";

interface SchemaRecommendation {
  type: string;
  confidence: number;
  explanation: string;
}

interface ExistingRecommendation {
  id: string;
  schemaType: string;
  jsonLd: Record<string, unknown>;
  valid: boolean | null;
  errors: unknown[] | null;
  applied: boolean;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export default function SchemaPanel({
  articleId,
}: {
  articleId: string;
}) {
  const [recommendations, setRecommendations] = useState<SchemaRecommendation[]>([]);
  const [existing, setExisting] = useState<ExistingRecommendation[]>([]);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [generatedJsonLd, setGeneratedJsonLd] = useState<Record<string, unknown> | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = async () => {
    try {
      const res = await fetch(`/api/articles/${articleId}/schema`);
      if (!res.ok) throw new Error("Failed to load schema recommendations");
      const data = await res.json();
      setRecommendations(data.recommendations);
      setExisting(data.existing);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  const generateSchema = async (schemaType: string) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/articles/${articleId}/schema`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schemaType,
          content: {
            title: "Article Title",
            headings: [],
            hasFaq: false,
            hasHowTo: false,
            hasProduct: false,
            hasReview: false,
            author: "Author",
            publishedDate: new Date().toISOString(),
          },
        }),
      });

      if (!res.ok) throw new Error("Failed to generate schema");
      const data = await res.json();
      setGeneratedJsonLd(data.jsonLd);
      setValidation(data.validation);
      setSelectedType(schemaType);
      await loadRecommendations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const applySchema = async (recommendationId: string) => {
    try {
      const res = await fetch(`/api/articles/${articleId}/schema`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recommendationId, action: "apply" }),
      });

      if (!res.ok) throw new Error("Failed to apply schema");
      await loadRecommendations();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [articleId]);

  const typeLabel = (type: string) => {
    const labels: Record<string, string> = {
      ARTICLE: "Article",
      FAQ: "FAQ",
      HOW_TO: "How-To",
      PRODUCT: "Product",
      REVIEW: "Review",
      BREADCRUMB: "Breadcrumb",
      ORGANIZATION: "Organization",
      PERSON: "Person",
      EVENT: "Event",
      LOCAL_BUSINESS: "Local Business",
    };
    return labels[type] || type;
  };

  const confidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-100 text-green-800";
    if (confidence >= 0.5) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <div className="rounded-lg border p-4">
      <h3 className="mb-4 text-lg font-medium">Schema Markup</h3>

      {error && (
        <div className="mb-3 rounded-md bg-red-50 p-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="mb-4">
        <h4 className="mb-2 text-sm font-medium text-gray-600">
          Recommended Types
        </h4>
        <div className="space-y-2">
          {recommendations.map((rec) => (
            <div
              key={rec.type}
              className="flex items-center justify-between rounded-md border p-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{typeLabel(rec.type)}</span>
                  <span
                    className={`rounded px-2 py-0.5 text-xs font-medium ${confidenceColor(rec.confidence)}`}
                  >
                    {(rec.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  {rec.explanation}
                </div>
              </div>
              <button
                onClick={() => generateSchema(rec.type)}
                disabled={loading}
                className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Generate
              </button>
            </div>
          ))}

          {recommendations.length === 0 && (
            <div className="text-sm text-gray-500">
              No schema recommendations available for this article.
            </div>
          )}
        </div>
      </div>

      {generatedJsonLd && (
        <div className="mb-4">
          <h4 className="mb-2 text-sm font-medium text-gray-600">
            Generated JSON-LD
          </h4>
          <pre className="max-h-64 overflow-auto rounded-md bg-gray-50 p-3 text-xs">
            {JSON.stringify(generatedJsonLd, null, 2)}
          </pre>

          {validation && (
            <div className="mt-2">
              {validation.valid ? (
                <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                  Valid
                </span>
              ) : (
                <div>
                  <span className="rounded bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                    Invalid
                  </span>
                  <ul className="mt-1 text-xs text-red-600">
                    {validation.errors.map((err, idx) => (
                      <li key={idx}>• {err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => {
                const existingRec = existing.find(
                  (e) => e.schemaType === selectedType
                );
                if (existingRec) applySchema(existingRec.id);
              }}
              className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
            >
              Apply to Article
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  JSON.stringify(generatedJsonLd, null, 2)
                );
              }}
              className="rounded-md border px-3 py-1 text-xs font-medium hover:bg-gray-50"
            >
              Copy JSON-LD
            </button>
          </div>
        </div>
      )}

      {existing.length > 0 && (
        <div>
          <h4 className="mb-2 text-sm font-medium text-gray-600">
            Existing Schema
          </h4>
          <div className="space-y-2">
            {existing.map((rec) => (
              <div
                key={rec.id}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{typeLabel(rec.schemaType)}</span>
                  {rec.valid === true && (
                    <span className="rounded bg-green-100 px-2 py-0.5 text-xs text-green-800">
                      Valid
                    </span>
                  )}
                  {rec.valid === false && (
                    <span className="rounded bg-red-100 px-2 py-0.5 text-xs text-red-800">
                      Invalid
                    </span>
                  )}
                  {rec.applied && (
                    <span className="rounded bg-blue-100 px-2 py-0.5 text-xs text-blue-800">
                      Applied
                    </span>
                  )}
                </div>
                {!rec.applied && rec.valid && (
                  <button
                    onClick={() => applySchema(rec.id)}
                    className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                  >
                    Apply
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
