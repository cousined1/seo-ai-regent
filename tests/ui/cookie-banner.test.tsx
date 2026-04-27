import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CookieBanner } from "@/components/consent/cookie-banner";

describe("CookieBanner", () => {
  it("renders with Accept All, Reject Non-Essential, and Manage Preferences buttons", () => {
    const onAcceptAll = vi.fn();
    const onRejectNonEssential = vi.fn();
    const onManagePreferences = vi.fn();
    render(
      <CookieBanner
        onAcceptAll={onAcceptAll}
        onRejectNonEssential={onRejectNonEssential}
        onManagePreferences={onManagePreferences}
      />,
    );
    expect(screen.getByRole("button", { name: /accept all/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /reject non-essential/i })).toBeTruthy();
    expect(screen.getByRole("button", { name: /manage preferences/i })).toBeTruthy();
  });

  it("calls onAcceptAll when Accept All is clicked", () => {
    const onAcceptAll = vi.fn();
    render(
      <CookieBanner
        onAcceptAll={onAcceptAll}
        onRejectNonEssential={vi.fn()}
        onManagePreferences={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /accept all/i }));
    expect(onAcceptAll).toHaveBeenCalledTimes(1);
  });

  it("calls onRejectNonEssential when Reject Non-Essential is clicked", () => {
    const onRejectNonEssential = vi.fn();
    render(
      <CookieBanner
        onAcceptAll={vi.fn()}
        onRejectNonEssential={onRejectNonEssential}
        onManagePreferences={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /reject non-essential/i }));
    expect(onRejectNonEssential).toHaveBeenCalledTimes(1);
  });

  it("calls onManagePreferences when Manage Preferences is clicked", () => {
    const onManagePreferences = vi.fn();
    render(
      <CookieBanner
        onAcceptAll={vi.fn()}
        onRejectNonEssential={vi.fn()}
        onManagePreferences={onManagePreferences}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /manage preferences/i }));
    expect(onManagePreferences).toHaveBeenCalledTimes(1);
  });

  it("has role=dialog and aria-label for accessibility", () => {
    render(
      <CookieBanner
        onAcceptAll={vi.fn()}
        onRejectNonEssential={vi.fn()}
        onManagePreferences={vi.fn()}
      />,
    );
    expect(screen.getByRole("dialog", { name: /cookie consent/i })).toBeTruthy();
  });
});