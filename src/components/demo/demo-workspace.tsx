"use client";

import React, { useEffect, useState } from "react";

import { EditorShell } from "@/components/editor/editor-shell";
import { tokens } from "@/lib/design/tokens";
import { getDemoWorkspacePayload } from "@/lib/scoring/demo-data";

type DemoWorkspacePayload = ReturnType<typeof getDemoWorkspacePayload>;

export function DemoWorkspace() {
  const [payload, setPayload] = useState<DemoWorkspacePayload | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadDemo() {
      try {
        const response = await fetch("/api/demo/article");

        if (!response.ok) {
          return;
        }

        const nextPayload = (await response.json()) as DemoWorkspacePayload;

        if (!cancelled) {
          setPayload(nextPayload);
        }
      } catch {
        // Keep the loading surface if the demo payload cannot be fetched.
      }
    }

    void loadDemo();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!payload) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          backgroundColor: tokens.colors.background,
          color: tokens.colors.text,
        }}
      >
        <div
          style={{
            color: tokens.colors.textSecondary,
            fontFamily: tokens.typography.mono,
            fontSize: "13px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Loading demo workspace
        </div>
      </main>
    );
  }

  return (
    <EditorShell
      keyword={payload.article.keyword}
      initialContent={payload.article.content}
      contentScore={payload.contentScore}
      geoScore={payload.geoScore}
      topActions={payload.topActions}
      terms={payload.terms}
      contentBreakdown={payload.contentBreakdown}
      geoBreakdown={payload.geoBreakdown}
    />
  );
}
