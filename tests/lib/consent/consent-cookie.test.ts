import { describe, expect, it, beforeEach } from "vitest";
import {
  CONSENT_COOKIE_NAME,
  CONSENT_POLICY_VERSION,
  parseConsentCookie,
  buildConsentCookieValue,
  readConsentFromDocument,
} from "@/lib/consent/consent-cookie";
import type { ConsentCategories, ConsentCookiePayload } from "@/lib/consent/consent-types";

function setDocumentCookie(cookieString: string) {
  document.cookie = cookieString;
}

function clearDocumentCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0`;
}

describe("consent cookie utilities", () => {
  beforeEach(() => {
    clearDocumentCookie(CONSENT_COOKIE_NAME);
  });

  it("builds a valid consent cookie value with all categories", () => {
    const categories: ConsentCategories = {
      necessary: true,
      analytics: true,
      preferences: false,
      marketing: false,
    };
    const value = buildConsentCookieValue(categories);
    expect(value).toContain(`${CONSENT_COOKIE_NAME}=`);
    expect(value).toContain("Path=/");
    expect(value).toContain("SameSite=Lax");
    expect(value).toContain("Max-Age=31536000");
  });

  it("includes Secure flag in production", () => {
    const categories: ConsentCategories = {
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    };
    (process.env as Record<string, string>).NODE_ENV = "production";
    const value = buildConsentCookieValue(categories);
    expect(value).toContain("Secure");
    (process.env as Record<string, string>).NODE_ENV = "test";
  });

  it("omits Secure flag in development", () => {
    const categories: ConsentCategories = {
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    };
    (process.env as Record<string, string>).NODE_ENV = "development";
    const value = buildConsentCookieValue(categories);
    expect(value).not.toContain("Secure");
    (process.env as Record<string, string>).NODE_ENV = "test";
  });

  it("parses a valid consent cookie payload", () => {
    const payload: ConsentCookiePayload = {
      v: 1,
      ts: 1714089600000,
      pv: CONSENT_POLICY_VERSION,
      c: { necessary: true, analytics: false, preferences: false, marketing: false },
    };
    const encoded = encodeURIComponent(JSON.stringify(payload));
    setDocumentCookie(`${CONSENT_COOKIE_NAME}=${encoded}; Path=/`);

    const parsed = readConsentFromDocument();
    expect(parsed).not.toBeNull();
    expect(parsed!.c.analytics).toBe(false);
    expect(parsed!.c.necessary).toBe(true);
    expect(parsed!.pv).toBe(CONSENT_POLICY_VERSION);
  });

  it("returns null when consent cookie is missing", () => {
    const parsed = readConsentFromDocument();
    expect(parsed).toBeNull();
  });

  it("returns null for malformed cookie value", () => {
    setDocumentCookie(`${CONSENT_COOKIE_NAME}=not-valid-json; Path=/`);
    const parsed = readConsentFromDocument();
    expect(parsed).toBeNull();
  });

  it("returns default categories when parsing fails", () => {
    const defaultCategories = parseConsentCookie(null);
    expect(defaultCategories.necessary).toBe(true);
    expect(defaultCategories.analytics).toBe(false);
    expect(defaultCategories.preferences).toBe(false);
    expect(defaultCategories.marketing).toBe(false);
  });
});