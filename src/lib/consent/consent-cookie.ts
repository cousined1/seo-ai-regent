import type { ConsentCategories, ConsentCookiePayload } from "./consent-types";
import {
  DEFAULT_CONSENT,
  CONSENT_COOKIE_SCHEMA_VERSION,
} from "./consent-types";

export const CONSENT_COOKIE_NAME = "consent_preferences";
export const CONSENT_POLICY_VERSION = "1.0";
export const CONSENT_COOKIE_MAX_AGE = 31536000;

function shouldMarkSecure() {
  return process.env.NODE_ENV === "production";
}

function secureAttribute() {
  return shouldMarkSecure() ? "; Secure" : "";
}

export function buildConsentCookieValue(categories: ConsentCategories): string {
  const payload: ConsentCookiePayload = {
    v: CONSENT_COOKIE_SCHEMA_VERSION,
    ts: Date.now(),
    pv: CONSENT_POLICY_VERSION,
    c: categories,
  };
  const encoded = encodeURIComponent(JSON.stringify(payload));
  return `${CONSENT_COOKIE_NAME}=${encoded}; Path=/; SameSite=Lax; Max-Age=${CONSENT_COOKIE_MAX_AGE}${secureAttribute()}`;
}

export function parseConsentCookie(raw: string | null): ConsentCategories {
  if (!raw) return { ...DEFAULT_CONSENT };
  try {
    const payload: ConsentCookiePayload = JSON.parse(raw);
    if (payload.v !== CONSENT_COOKIE_SCHEMA_VERSION) return { ...DEFAULT_CONSENT };
    if (!payload.c || typeof payload.c !== "object") return { ...DEFAULT_CONSENT };
    return {
      necessary: true,
      analytics: Boolean(payload.c.analytics),
      preferences: Boolean(payload.c.preferences),
      marketing: Boolean(payload.c.marketing),
    };
  } catch {
    return { ...DEFAULT_CONSENT };
  }
}

export function readConsentFromDocument(): ConsentCookiePayload | null {
  const cookies = document.cookie.split("; ");
  const consentCookie = cookies.find((c) => c.startsWith(`${CONSENT_COOKIE_NAME}=`));
  if (!consentCookie) return null;
  const value = consentCookie.split("=").slice(1).join("=");
  try {
    const decoded = decodeURIComponent(value);
    const payload: ConsentCookiePayload = JSON.parse(decoded);
    if (payload.v !== CONSENT_COOKIE_SCHEMA_VERSION) return null;
    return payload;
  } catch {
    return null;
  }
}

export function writeConsentToDocument(categories: ConsentCategories): void {
  const payload: ConsentCookiePayload = {
    v: CONSENT_COOKIE_SCHEMA_VERSION,
    ts: Date.now(),
    pv: CONSENT_POLICY_VERSION,
    c: categories,
  };
  const encoded = encodeURIComponent(JSON.stringify(payload));
  const secure = shouldMarkSecure() ? "; Secure" : "";
  document.cookie = `${CONSENT_COOKIE_NAME}=${encoded}; Path=/; SameSite=Lax; Max-Age=${CONSENT_COOKIE_MAX_AGE}${secure}`;
}

export function readConsentCategoriesFromDocument(): ConsentCategories {
  const payload = readConsentFromDocument();
  if (!payload) return { ...DEFAULT_CONSENT };
  return parseConsentCookie(decodeURIComponent(document.cookie.split("; ").find((c) => c.startsWith(`${CONSENT_COOKIE_NAME}=`))?.split("=").slice(1).join("=") ?? ""));
}