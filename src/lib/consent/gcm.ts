import type { ConsentCategories } from "./consent-types";

export interface GCMConsentCommand {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
  functionality_storage: "granted" | "denied";
  security_storage: "granted" | "denied";
}

export const CONSENT_TO_GCM_MAP: Record<string, keyof GCMConsentCommand> = {
  analytics: "analytics_storage",
  marketing: "ad_storage",
  preferences: "functionality_storage",
};

export function getGCMUpdateCommand(categories: ConsentCategories): GCMConsentCommand {
  return {
    analytics_storage: categories.analytics ? "granted" : "denied",
    ad_storage: categories.marketing ? "granted" : "denied",
    ad_user_data: categories.marketing ? "granted" : "denied",
    ad_personalization: categories.marketing ? "granted" : "denied",
    functionality_storage: categories.preferences ? "granted" : "denied",
    security_storage: "granted",
  };
}

export function pushGCMDefault(): void {
  if (typeof window === "undefined") return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "denied",
    security_storage: "granted",
    wait_for_update: 500,
  });
  gtag("set", "url_passthrough", true);
}

export function pushGCMUpdate(categories: ConsentCategories): void {
  if (typeof window === "undefined") return;
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  const command = getGCMUpdateCommand(categories);
  gtag("consent", "update", command);
}