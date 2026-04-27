export type ConsentCategory = "necessary" | "analytics" | "preferences" | "marketing";

export interface ConsentCategories {
  necessary: boolean;
  analytics: boolean;
  preferences: boolean;
  marketing: boolean;
}

export const ALL_CATEGORIES: ConsentCategory[] = [
  "necessary",
  "analytics",
  "preferences",
  "marketing",
];

export const NON_ESSENTIAL_CATEGORIES: ConsentCategory[] = [
  "analytics",
  "preferences",
  "marketing",
];

export const DEFAULT_CONSENT: ConsentCategories = {
  necessary: true,
  analytics: false,
  preferences: false,
  marketing: false,
};

export const ACCEPT_ALL_CONSENT: ConsentCategories = {
  necessary: true,
  analytics: true,
  preferences: true,
  marketing: true,
};

export const REJECT_NON_ESSENTIAL_CONSENT: ConsentCategories = {
  necessary: true,
  analytics: false,
  preferences: false,
  marketing: false,
};

export interface ConsentCookiePayload {
  v: number;
  ts: number;
  pv: string;
  c: ConsentCategories;
}

export const CONSENT_COOKIE_SCHEMA_VERSION = 1;