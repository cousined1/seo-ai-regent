"use client";

import React, { useState } from "react";

import { tokens } from "@/lib/design/tokens";
import type { ContentScore, GeoScore, TopAction } from "@/lib/scoring/types";

interface ScoreResponse {
  contentScore: ContentScore;
  geoScore: GeoScore;
  topActions: TopAction[];
}

const initialKeyword = "content optimization strategies";
const initialContent =
  "Content optimization strategies are editorial systems that improve rankings and AI-search visibility. According to Gartner's 2025 guidance, answer-first passages with explicit data improve retrieval quality, and teams that add citations and named entities make content more extractable for systems like ChatGPT and Perplexity.";

const initialResponse: ScoreResponse = {
  contentScore: {
    overall: 82,
    termFrequency: 84,
    entityCoverage: 76,
    headingStructure: 72,
    wordCount: 79,
    readability: 88,
    internalLinks: 38,
    geoSignals: 76,
  },
  geoScore: {
    overall: 76,
    entityAuthority: 72,
    factualDensity: 78,
    answerFormat: 74,
    sourceCredibility: 73,
    freshness: 79,
  },
  topActions: [
    {
      area: "Content",
      signal: "internalLinks",
      title: "Add internal navigation paths",
      detail: "Connect the draft to relevant support pages and product surfaces.",
      lift: 6.2,
      liftLabel: "+6.2 Content pts",
    },
    {
      area: "GEO",
      signal: "entityAuthority",
      title: "Cite stronger authority entities",
      detail: "Anchor key claims to named organizations that retrieval systems already recognize.",
      lift: 5.1,
      liftLabel: "+5.1 GEO pts",
    },
    {
      area: "GEO",
      signal: "factualDensity",
      title: "Increase factual density",
      detail: "Add dates, numbers, and attributed evidence so passages are easier to cite.",
      lift: 4.4,
      liftLabel: "+4.4 GEO pts",
    },
  ],
};

function formatScore(value: number) {
  return Math.round(value).toString();
}

function scoreColor(value: number) {
  if (value >= 80) {
    return tokens.scoreRamp.excellent;
  }

  if (value >= 65) {
    return tokens.scoreRamp.good;
  }

  if (value >= 50) {
    return tokens.scoreRamp.fair;
  }

  return tokens.scoreRamp.poor;
}

export function LiveDemo() {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [content, setContent] = useState(initialContent);
  const [result, setResult] = useState<ScoreResponse>(initialResponse);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/score/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          keyword,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to score this draft right now.");
      }

      const payload = (await response.json()) as ScoreResponse;
      setResult(payload);
      setStatus("idle");
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to score this draft right now.",
      );
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "grid",
          gap: "12px",
          marginTop: "36px",
          maxWidth: "760px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            alignItems: "stretch",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radius.control,
              overflow: "hidden",
              minWidth: "min(440px, 100%)",
              flex: "1 1 440px",
              backgroundColor: "transparent",
            }}
          >
            <span
              style={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                padding: "0 14px",
                borderRight: `1px solid ${tokens.colors.divider}`,
                color: tokens.colors.textFaint,
                fontFamily: tokens.typography.mono,
                fontSize: "13px",
              }}
            >
              kw //
            </span>
            <input
              aria-label="Keyword"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder={initialKeyword}
              style={{
                flex: 1,
                border: 0,
                outline: 0,
                padding: "14px",
                backgroundColor: "transparent",
                color: tokens.colors.text,
              }}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              style={{
                border: 0,
                padding: "0 18px",
                backgroundColor:
                  status === "loading" ? tokens.colors.primaryHover : tokens.colors.primary,
                color: "#001418",
                fontSize: "14px",
                fontWeight: 700,
                opacity: status === "loading" ? 0.8 : 1,
              }}
            >
              {status === "loading" ? "Scoring..." : "Start free"}
            </button>
          </div>

          <a
            href="#demo"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 18px",
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: "8px",
              backgroundColor: "transparent",
              color: tokens.colors.text,
              fontSize: "15px",
              fontWeight: 500,
            }}
          >
            Try live demo
          </a>
        </div>

        <label
          style={{
            display: "grid",
            gap: "8px",
          }}
        >
          <span
            style={{
              color: tokens.colors.textFaint,
              fontFamily: tokens.typography.mono,
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Content Draft
          </span>
          <textarea
            aria-label="Content draft"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={6}
            style={{
              width: "100%",
              resize: "vertical",
              border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radius.card,
              backgroundColor: tokens.colors.surface,
              color: tokens.colors.text,
              padding: "18px",
              lineHeight: 1.6,
            }}
          />
        </label>

        <div
          aria-live="polite"
          style={{
            minHeight: "24px",
            color: status === "error" ? tokens.scoreRamp.poor : tokens.colors.textSecondary,
            fontSize: "14px",
          }}
        >
          {status === "error"
            ? errorMessage
            : "Run the canonical scoring model against the same passage you plan to publish."}
        </div>
      </form>

      <div
        id="demo"
        style={{
          display: "grid",
          gap: "18px",
          gridTemplateColumns: "1.4fr 1fr",
        }}
      >
        <div
          style={{
            border: `1px solid ${tokens.colors.divider}`,
            borderRadius: tokens.radius.card,
            backgroundColor: tokens.colors.surface,
            padding: "28px",
            display: "grid",
            gap: "18px",
          }}
        >
          <div>
            <div
              style={{
                color: tokens.colors.primary,
                fontFamily: tokens.typography.mono,
                fontSize: "11px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              Surface 01
            </div>
            <h2
              style={{
                margin: "14px 0 10px",
                fontSize: "30px",
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Content Score and GEO Score update as equal peers.
            </h2>
            <p style={{ margin: 0, color: tokens.colors.textSecondary }}>
              One scoring brain. No drift between the score you see, the action lift you chase,
              and the passage you actually edit.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "12px",
            }}
          >
            {result.topActions.map((action) => (
              <article
                key={`${action.area}-${action.signal}`}
                style={{
                  border: `1px solid ${tokens.colors.border}`,
                  borderRadius: tokens.radius.control,
                  padding: "16px 18px",
                  display: "grid",
                  gap: "8px",
                  background:
                    action.area === "GEO"
                      ? "linear-gradient(90deg, rgba(6, 182, 212, 0.08) 0%, rgba(6, 182, 212, 0.02) 100%)"
                      : "transparent",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "baseline",
                  }}
                >
                  <span
                    style={{
                      color: action.area === "GEO" ? tokens.colors.primary : tokens.colors.textFaint,
                      fontFamily: tokens.typography.mono,
                      fontSize: "11px",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {action.area} Action
                  </span>
                  <span
                    style={{
                      color: action.area === "GEO" ? tokens.colors.primary : tokens.scoreRamp.good,
                      fontFamily: tokens.typography.mono,
                      fontSize: "12px",
                    }}
                  >
                    {action.liftLabel}
                  </span>
                </div>
                <div style={{ fontSize: "18px", fontWeight: 600 }}>{action.title}</div>
                <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.55 }}>
                  {action.detail}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div
          style={{
            border: `1px solid ${tokens.colors.divider}`,
            borderRadius: tokens.radius.card,
            backgroundColor: tokens.colors.surface,
            padding: "28px",
            display: "grid",
            gap: "16px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
            }}
          >
            {[
              ["Content Score", result.contentScore.overall],
              ["GEO Score", result.geoScore.overall],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  border: `1px solid ${tokens.colors.border}`,
                  borderRadius: tokens.radius.control,
                  padding: "14px",
                }}
              >
                <div
                  style={{
                    fontFamily: tokens.typography.mono,
                    fontSize: "11px",
                    color: tokens.colors.textFaint,
                    textTransform: "uppercase",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    marginTop: "10px",
                    fontSize: "32px",
                    fontWeight: 700,
                    color: scoreColor(Number(value)),
                  }}
                >
                  {formatScore(Number(value))}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              borderTop: `1px dashed ${tokens.colors.border}`,
              paddingTop: "16px",
              color: tokens.colors.textSecondary,
              display: "grid",
              gap: "10px",
            }}
          >
            <div>Content Score and GEO Score update on the same scoring pass.</div>
            <div
              style={{
                display: "grid",
                gap: "8px",
              }}
            >
              {[
                ["Factual Density", result.geoScore.factualDensity],
                ["Entity Authority", result.geoScore.entityAuthority],
                ["Internal Links", result.contentScore.internalLinks],
              ].map(([label, value]) => (
                <div
                  key={label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "12px",
                    fontSize: "14px",
                  }}
                >
                  <span>{label}</span>
                  <span
                    style={{
                      color: scoreColor(Number(value)),
                      fontFamily: tokens.typography.mono,
                    }}
                  >
                    {formatScore(Number(value))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
