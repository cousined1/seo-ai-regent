"use client";

import React, { useState } from "react";
import { tokens } from "@/lib/design/tokens";
import type { ConsentCategories, ConsentCategory } from "@/lib/consent/consent-types";

interface CookiePreferencesModalProps {
  consent: ConsentCategories;
  onSave: (categories: ConsentCategories) => void;
  onRejectAll: () => void;
  onClose: () => void;
}

const CATEGORY_INFO: {
  key: ConsentCategory;
  label: string;
  description: string;
  alwaysOn?: boolean;
}[] = [
  {
    key: "necessary",
    label: "Strictly Necessary",
    description:
      "Required for the site to function. Cannot be disabled. Includes session authentication and consent preferences.",
    alwaysOn: true,
  },
  {
    key: "analytics",
    label: "Analytics",
    description:
      "Help us understand how visitors interact with the site so we can improve the experience. Includes Google Analytics.",
  },
  {
    key: "preferences",
    label: "Preferences",
    description:
      "Remember your settings and choices to provide a more personalized experience.",
  },
  {
    key: "marketing",
    label: "Marketing",
    description:
      "Used for chat widgets, retargeting, and advertising. These cookies track visitors across websites.",
  },
];

export function CookiePreferencesModal({
  consent,
  onSave,
  onRejectAll,
  onClose,
}: CookiePreferencesModalProps) {
  const [localConsent, setLocalConsent] = useState<ConsentCategories>({ ...consent });

  const handleToggle = (key: ConsentCategory) => {
    if (key === "necessary") return;
    setLocalConsent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-label="Cookie preferences"
        style={{
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radius.card,
          border: `1px solid ${tokens.colors.border}`,
          padding: "28px",
          width: "min(520px, calc(100% - 48px))",
          maxHeight: "80vh",
          overflowY: "auto",
          display: "grid",
          gap: "20px",
        }}
      >
        <div style={{ display: "grid", gap: "8px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.6rem, 3vw, 2rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              fontWeight: 600,
            }}
          >
            Cookie Preferences
          </h2>
          <p
            style={{
              margin: 0,
              color: tokens.colors.textSecondary,
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            Manage your cookie preferences. Strictly necessary cookies cannot be disabled.
          </p>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          {CATEGORY_INFO.map((cat) => (
            <div
              key={cat.key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
                padding: "14px 0",
                borderBottom: `1px solid ${tokens.colors.divider}`,
              }}
            >
              <div style={{ display: "grid", gap: "4px", flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {cat.label}
                  {cat.alwaysOn && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontFamily: tokens.typography.mono,
                        color: tokens.colors.primary,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Always on
                    </span>
                  )}
                </div>
                <div
                  style={{
                    color: tokens.colors.textSecondary,
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  {cat.description}
                </div>
              </div>
              <button
                role="switch"
                aria-checked={cat.alwaysOn ? "true" : localConsent[cat.key] ? "true" : "false"}
                aria-label={cat.label}
                disabled={cat.alwaysOn}
                onClick={() => handleToggle(cat.key)}
                style={{
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: cat.alwaysOn ? "default" : "pointer",
                  backgroundColor:
                    cat.alwaysOn || localConsent[cat.key]
                      ? tokens.colors.primary
                      : tokens.colors.border,
                  position: "relative",
                  flexShrink: 0,
                  transition: "background-color 0.2s",
                  padding: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: cat.alwaysOn || localConsent[cat.key] ? "22px" : "2px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "10px",
                    backgroundColor: "#fff",
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => onSave(localConsent)}
            style={{
              padding: "12px 18px",
              borderRadius: tokens.radius.control,
              backgroundColor: tokens.colors.primary,
              color: "#001418",
              fontSize: "14px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Save Preferences
          </button>
          <button
            onClick={onRejectAll}
            style={{
              padding: "12px 18px",
              borderRadius: tokens.radius.control,
              backgroundColor: "transparent",
              color: tokens.colors.text,
              fontSize: "14px",
              fontWeight: 600,
              border: `1px solid ${tokens.colors.border}`,
              cursor: "pointer",
            }}
          >
            Reject All
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              padding: "12px 18px",
              borderRadius: tokens.radius.control,
              backgroundColor: "transparent",
              color: tokens.colors.textSecondary,
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}