import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { CookiePreferencesModal } from "@/components/consent/cookie-preferences-modal";
import type { ConsentCategories } from "@/lib/consent/consent-types";

const defaultConsent: ConsentCategories = {
  necessary: true,
  analytics: false,
  preferences: false,
  marketing: false,
};

describe("CookiePreferencesModal", () => {
  it("renders with category toggles", () => {
    render(
      <CookiePreferencesModal
        consent={defaultConsent}
        onSave={vi.fn()}
        onRejectAll={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    expect(screen.getByRole("dialog", { name: /cookie preferences/i })).toBeTruthy();
    expect(screen.getByRole("switch", { name: /strictly necessary/i })).toBeTruthy();
    expect(screen.getByRole("switch", { name: /analytics/i })).toBeTruthy();
    expect(screen.getByRole("switch", { name: /preferences/i })).toBeTruthy();
    expect(screen.getByRole("switch", { name: /marketing/i })).toBeTruthy();
  });

  it("disables the necessary category toggle", () => {
    render(
      <CookiePreferencesModal
        consent={defaultConsent}
        onSave={vi.fn()}
        onRejectAll={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    const necessaryToggle = screen.getByRole("switch", { name: /strictly necessary/i });
    expect(necessaryToggle.disabled).toBe(true);
    expect(necessaryToggle.getAttribute("aria-checked")).toBe("true");
  });

  it("calls onSave with toggled categories", () => {
    const onSave = vi.fn();
    render(
      <CookiePreferencesModal
        consent={defaultConsent}
        onSave={onSave}
        onRejectAll={vi.fn()}
        onClose={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /save preferences/i }));
    expect(onSave).toHaveBeenCalledWith(defaultConsent);
  });

  it("calls onRejectAll when Reject All is clicked", () => {
    const onRejectAll = vi.fn();
    render(
      <CookiePreferencesModal
        consent={defaultConsent}
        onSave={vi.fn()}
        onRejectAll={onRejectAll}
        onClose={vi.fn()}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /reject all/i }));
    expect(onRejectAll).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = vi.fn();
    render(
      <CookiePreferencesModal
        consent={defaultConsent}
        onSave={vi.fn()}
        onRejectAll={vi.fn()}
        onClose={onClose}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: /close/i }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});