import React from "react";
import { render, screen, fireEvent, act, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { ConsentProvider, useConsent } from "@/components/consent/consent-provider";
import { CONSENT_COOKIE_NAME } from "@/lib/consent/consent-cookie";

function TestConsumer() {
  const { consent, showBanner, showPreferencesModal, updateConsent, openPreferences, closePreferences } = useConsent();
  return (
    <div>
      <span data-testid="banner-visible">{showBanner ? "yes" : "no"}</span>
      <span data-testid="modal-visible">{showPreferencesModal ? "yes" : "no"}</span>
      <span data-testid="analytics">{consent.analytics ? "granted" : "denied"}</span>
      <span data-testid="marketing">{consent.marketing ? "granted" : "denied"}</span>
      <button onClick={() => updateConsent({ necessary: true, analytics: true, preferences: true, marketing: true })}>
        Accept All
      </button>
      <button onClick={() => updateConsent({ necessary: true, analytics: false, preferences: false, marketing: false })}>
        Reject Non-Essential
      </button>
      <button onClick={openPreferences}>Open Preferences</button>
      <button onClick={closePreferences}>Close Preferences</button>
    </div>
  );
}

describe("ConsentProvider", () => {
  beforeEach(() => {
    document.cookie = `${CONSENT_COOKIE_NAME}=; Path=/; Max-Age=0`;
    delete (navigator as any).globalPrivacyControl;
  });

  it("shows banner by default when no consent cookie exists and no GPC signal", async () => {
    render(
      <ConsentProvider>
        <TestConsumer />
      </ConsentProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("banner-visible").textContent).toBe("yes");
    });
  });

  it("defaults to all non-essential denied when no prior consent", async () => {
    render(
      <ConsentProvider>
        <TestConsumer />
      </ConsentProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("analytics").textContent).toBe("denied");
      expect(screen.getByTestId("marketing").textContent).toBe("denied");
    });
  });

  it("accepts all categories and hides banner", async () => {
    render(
      <ConsentProvider>
        <TestConsumer />
      </ConsentProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("banner-visible").textContent).toBe("yes");
    });
    fireEvent.click(screen.getByText("Accept All"));
    expect(screen.getByTestId("banner-visible").textContent).toBe("no");
    expect(screen.getByTestId("analytics").textContent).toBe("granted");
    expect(screen.getByTestId("marketing").textContent).toBe("granted");
  });

  it("rejects non-essential and hides banner", async () => {
    render(
      <ConsentProvider>
        <TestConsumer />
      </ConsentProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("banner-visible").textContent).toBe("yes");
    });
    fireEvent.click(screen.getByText("Reject Non-Essential"));
    expect(screen.getByTestId("banner-visible").textContent).toBe("no");
    expect(screen.getByTestId("analytics").textContent).toBe("denied");
  });

  it("opens and closes preferences modal", async () => {
    render(
      <ConsentProvider>
        <TestConsumer />
      </ConsentProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("banner-visible").textContent).toBe("yes");
    });
    fireEvent.click(screen.getByText("Open Preferences"));
    expect(screen.getByTestId("modal-visible").textContent).toBe("yes");
    fireEvent.click(screen.getByText("Close Preferences"));
    expect(screen.getByTestId("modal-visible").textContent).toBe("no");
  });

  it("hides banner when GPC signal is active and sets all non-essential to denied", async () => {
    (navigator as any).globalPrivacyControl = true;
    render(
      <ConsentProvider>
        <TestConsumer />
      </ConsentProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId("banner-visible").textContent).toBe("no");
      expect(screen.getByTestId("analytics").textContent).toBe("denied");
    });
  });
});