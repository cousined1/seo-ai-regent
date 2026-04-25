"use client";

import React from "react";

import { tokens } from "@/lib/design/tokens";

export function FocusModeToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={enabled}
      onClick={onToggle}
      style={{
        border: `1px solid ${enabled ? tokens.colors.primary : tokens.colors.border}`,
        borderRadius: tokens.radius.pill,
        backgroundColor: enabled ? "rgba(6, 182, 212, 0.12)" : "transparent",
        color: enabled ? tokens.colors.primary : tokens.colors.text,
        fontSize: "13px",
        fontWeight: 600,
        padding: "10px 14px",
      }}
    >
      Assisted Mode
    </button>
  );
}
