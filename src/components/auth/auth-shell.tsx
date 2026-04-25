"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import type { ReactNode } from "react";

import { tokens } from "@/lib/design/tokens";

export function AuthShell(props: {
  eyebrow: string;
  title: string;
  description: string;
  alternateHref?: string;
  alternateLabel?: string;
  children: ReactNode;
}) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <main
      data-e2e-ready={hydrated ? "true" : "false"}
      style={{
        minHeight: "100vh",
        backgroundColor: tokens.colors.background,
        color: tokens.colors.text,
        display: "grid",
        placeItems: "center",
        padding: "32px 20px",
      }}
    >
      <div
        style={{
          width: "min(520px, 100%)",
          display: "grid",
          gap: "24px",
        }}
      >
        <div style={{ display: "grid", gap: "10px" }}>
          <div
            style={{
              color: tokens.colors.primary,
              fontFamily: tokens.typography.mono,
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {props.eyebrow}
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            {props.title}
          </h1>
          <p
            style={{
              margin: 0,
              color: tokens.colors.textSecondary,
              fontSize: "16px",
              lineHeight: 1.6,
            }}
          >
            {props.description}
          </p>
        </div>

        <section
          style={{
            border: `1px solid ${tokens.colors.divider}`,
            borderRadius: tokens.radius.card,
            backgroundColor: tokens.colors.surface,
            padding: "24px",
            display: "grid",
            gap: "18px",
          }}
        >
          {props.children}
        </section>

        {props.alternateHref && props.alternateLabel ? (
          <div
            style={{
              color: tokens.colors.textSecondary,
              fontSize: "14px",
            }}
          >
            <Link
              href={props.alternateHref}
              style={{
                color: tokens.colors.primary,
              }}
            >
              {props.alternateLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
