import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import AccountBillingPage, { metadata as billingMetadata } from "@/app/account/billing/page";
import LoginPage, { metadata as loginMetadata } from "@/app/login/page";
import RegisterPage, { metadata as registerMetadata } from "@/app/register/page";

describe("account pages", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the login page with reset-password handling from search params", async () => {
    const view = await LoginPage({
      searchParams: Promise.resolve({
        resetToken: "reset-token-123",
      }),
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(view);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /sign in to seo ai regent/i,
      }),
    ).toBeTruthy();
    expect(screen.getByRole("button", { name: /reset password/i })).toBeTruthy();

    fireEvent.change(screen.getByLabelText(/new password/i), {
      target: { value: "a much longer password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/auth/password/reset",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });
  });

  it("renders the register page and submits account creation", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        email: "editor@seoairegent.com",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<RegisterPage />);

    fireEvent.change(screen.getByLabelText(/^name$/i), {
      target: { value: "Editor User" },
    });
    fireEvent.change(screen.getByLabelText(/^email$/i), {
      target: { value: "editor@seoairegent.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "very-secure-password" },
    });
    fireEvent.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/auth/register",
        expect.objectContaining({
          method: "POST",
        }),
      );
    });
  });

  it("renders the billing page and loads the authenticated account state", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        authenticated: true,
        user: {
          email: "editor@seoairegent.com",
          role: "MEMBER",
          plan: "EDITOR",
        },
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<AccountBillingPage />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith("/api/auth/session");
    });

    expect(await screen.findByText(/editor@seoairegent\.com/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /open billing portal/i })).toBeTruthy();
    expect(screen.getAllByRole("button", { name: /plan/i }).length).toBeGreaterThan(0);
  });

  it("marks auth and billing pages as non-indexable in metadata", () => {
    expect(loginMetadata.robots).toEqual({
      index: false,
      follow: false,
    });
    expect(registerMetadata.robots).toEqual({
      index: false,
      follow: false,
    });
    expect(billingMetadata.robots).toEqual({
      index: false,
      follow: false,
    });
  });
});
