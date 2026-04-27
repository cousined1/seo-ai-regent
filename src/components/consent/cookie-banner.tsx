"use client";

import React from "react";
import { tokens } from "@/lib/design/tokens";

interface CookieBannerProps {
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
  onManagePreferences: () => void;
}

export function CookieBanner({
  onAcceptAll,
  onRejectNonEssential,
  onManagePreferences,
}: CookieBannerProps) {
  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: tokens.colors.surface,
        borderTop: `1px solid ${tokens.colors.divider}`,
        padding: "20px 24px",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "min(1360px, calc(100% - 48px))",
          margin: "0 auto",
          display: "flex",
          gap: "16px",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <p
          style={{
            margin: 0,
            color: tokens.colors.textSecondary,
            fontSize: "14px",
            lineHeight: 1.6,
            maxWidth: "680px",
          }}
        >
          We use cookies for essential site functionality and analytics. You can accept all cookies,
          reject non-essential cookies, or manage your preferences.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={onAcceptAll}
            style={{
              padding: "10px 16px",
              borderRadius: tokens.radius.control,
              backgroundColor: tokens.colors.primary,
              color: "#001418",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Accept All
          </button>
          <button
            onClick={onRejectNonEssential}
            style={{
              padding: "10px 16px",
              borderRadius: tokens.radius.control,
              backgroundColor: "transparent",
              color: tokens.colors.text,
              fontSize: "14px",
              fontWeight: 600,
              border: `1px solid ${tokens.colors.border}`,
              cursor: "pointer",
            }}
          >
            Reject Non-Essential
          </button>
          <button
            onClick={onManagePreferences}
            style={{
              padding: "10px 16px",
              borderRadius: tokens.radius.control,
              backgroundColor: "transparent",
              color: tokens.colors.primary,
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Manage Preferences
          </button>
        </div>
      </div>
    </div>
  );
}