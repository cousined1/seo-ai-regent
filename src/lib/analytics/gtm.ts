export function getGtmId(): string | null {
  const id = process.env.NEXT_PUBLIC_GTM_ID;
  if (!id) return null;
  const trimmed = id.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function isAnalyticsEnabled(): boolean {
  return getGtmId() !== null;
}

type DataLayerRecord = Record<string, unknown>;

function getDataLayer(): unknown[] | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { dataLayer?: unknown[] };
  if (!Array.isArray(w.dataLayer)) {
    w.dataLayer = [];
  }
  return w.dataLayer ?? null;
}

export function pushToDataLayer(record: DataLayerRecord): void {
  const dl = getDataLayer();
  if (!dl) return;
  dl.push(record);
}

export function initAnalytics(): void {
  getDataLayer();
}

export function trackPageView(url: string, title?: string, referrer?: string): void {
  if (!isAnalyticsEnabled()) return;
  pushToDataLayer({
    event: "page_view",
    page_location: url,
    page_title: title,
    page_referrer: referrer,
  });
}

export function trackEvent(name: string, params: DataLayerRecord = {}): void {
  if (!isAnalyticsEnabled()) return;
  pushToDataLayer({ event: name, ...params });
}

export function trackSignupStarted(params: DataLayerRecord = {}): void {
  trackEvent("signup_started", params);
}

export function trackSignupCompleted(params: DataLayerRecord = {}): void {
  trackEvent("signup_completed", params);
}

export function trackTrialStarted(params: DataLayerRecord = {}): void {
  trackEvent("trial_started", params);
}

export function trackSubscriptionPurchased(params: DataLayerRecord = {}): void {
  trackEvent("subscription_purchased", params);
}
