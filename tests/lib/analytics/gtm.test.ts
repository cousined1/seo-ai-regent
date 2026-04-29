import { afterEach, beforeEach, describe, expect, it } from "vitest";

const MODULE_PATH = "@/lib/analytics/gtm";

async function loadModule() {
  return await import(MODULE_PATH);
}

function resetDataLayer() {
  const w = window as unknown as { dataLayer?: unknown[] };
  delete w.dataLayer;
}

describe("analytics/gtm", () => {
  const originalGtmId = process.env.NEXT_PUBLIC_GTM_ID;

  beforeEach(() => {
    resetDataLayer();
  });

  afterEach(() => {
    process.env.NEXT_PUBLIC_GTM_ID = originalGtmId;
    resetDataLayer();
  });

  it("returns null gtm id when env var is unset", async () => {
    delete process.env.NEXT_PUBLIC_GTM_ID;
    const { getGtmId, isAnalyticsEnabled } = await loadModule();
    expect(getGtmId()).toBeNull();
    expect(isAnalyticsEnabled()).toBe(false);
  });

  it("returns null gtm id when env var is whitespace", async () => {
    process.env.NEXT_PUBLIC_GTM_ID = "   ";
    const { getGtmId, isAnalyticsEnabled } = await loadModule();
    expect(getGtmId()).toBeNull();
    expect(isAnalyticsEnabled()).toBe(false);
  });

  it("returns trimmed gtm id when env var is set", async () => {
    process.env.NEXT_PUBLIC_GTM_ID = "  GTM-ABC123 ";
    const { getGtmId, isAnalyticsEnabled } = await loadModule();
    expect(getGtmId()).toBe("GTM-ABC123");
    expect(isAnalyticsEnabled()).toBe(true);
  });

  it("pushToDataLayer initializes window.dataLayer and appends records", async () => {
    const { pushToDataLayer } = await loadModule();
    pushToDataLayer({ event: "manual_event", value: 1 });
    pushToDataLayer({ event: "another_event" });
    const dl = (window as unknown as { dataLayer: unknown[] }).dataLayer;
    expect(Array.isArray(dl)).toBe(true);
    expect(dl).toHaveLength(2);
    expect(dl[0]).toEqual({ event: "manual_event", value: 1 });
    expect(dl[1]).toEqual({ event: "another_event" });
  });

  it("pushToDataLayer pushes regardless of NEXT_PUBLIC_GTM_ID (raw primitive)", async () => {
    delete process.env.NEXT_PUBLIC_GTM_ID;
    const { pushToDataLayer } = await loadModule();
    pushToDataLayer({ event: "raw" });
    const dl = (window as unknown as { dataLayer: unknown[] }).dataLayer;
    expect(dl).toEqual([{ event: "raw" }]);
  });

  it("trackEvent is inert when NEXT_PUBLIC_GTM_ID is unset", async () => {
    delete process.env.NEXT_PUBLIC_GTM_ID;
    const { trackEvent } = await loadModule();
    trackEvent("test_event", { foo: "bar" });
    const dl = (window as unknown as { dataLayer?: unknown[] }).dataLayer;
    expect(dl ?? []).toEqual([]);
  });

  it("trackEvent pushes when NEXT_PUBLIC_GTM_ID is set", async () => {
    process.env.NEXT_PUBLIC_GTM_ID = "GTM-XYZ";
    const { trackEvent } = await loadModule();
    trackEvent("test_event", { foo: "bar" });
    const dl = (window as unknown as { dataLayer: unknown[] }).dataLayer;
    expect(dl).toEqual([{ event: "test_event", foo: "bar" }]);
  });

  it("trackPageView is inert without gtm id and pushes when set", async () => {
    delete process.env.NEXT_PUBLIC_GTM_ID;
    const { trackPageView } = await loadModule();
    trackPageView("https://example.com/x", "Title");
    expect((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []).toEqual([]);

    process.env.NEXT_PUBLIC_GTM_ID = "GTM-PV";
    trackPageView("https://example.com/x", "Title", "https://ref.example");
    const dl = (window as unknown as { dataLayer: unknown[] }).dataLayer;
    expect(dl).toEqual([
      {
        event: "page_view",
        page_location: "https://example.com/x",
        page_title: "Title",
        page_referrer: "https://ref.example",
      },
    ]);
  });

  it("lifecycle helpers emit named events when enabled", async () => {
    process.env.NEXT_PUBLIC_GTM_ID = "GTM-LC";
    const {
      trackSignupStarted,
      trackSignupCompleted,
      trackTrialStarted,
      trackSubscriptionPurchased,
    } = await loadModule();
    trackSignupStarted();
    trackSignupCompleted({ method: "email" });
    trackTrialStarted();
    trackSubscriptionPurchased({ planId: "editor" });
    const dl = (window as unknown as { dataLayer: unknown[] }).dataLayer;
    expect(dl).toEqual([
      { event: "signup_started" },
      { event: "signup_completed", method: "email" },
      { event: "trial_started" },
      { event: "subscription_purchased", planId: "editor" },
    ]);
  });

  it("lifecycle helpers are inert when gtm id is missing", async () => {
    delete process.env.NEXT_PUBLIC_GTM_ID;
    const { trackSignupStarted, trackSubscriptionPurchased } = await loadModule();
    trackSignupStarted({ x: 1 });
    trackSubscriptionPurchased({ planId: "editorial" });
    expect((window as unknown as { dataLayer?: unknown[] }).dataLayer ?? []).toEqual([]);
  });
});
