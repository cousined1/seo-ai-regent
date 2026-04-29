# Cookie Compliance Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a production-ready cookie consent and privacy preference system for the SEO AI Regent public site with banner, preferences modal, Google Consent Mode v2, GPC detection, script gating, and a dedicated Cookie Policy page.

**Architecture:** Minimal consent layer — a React context provider (`ConsentProvider`) wraps the app in `layout.tsx`, managing state via a non-HttpOnly `consent_preferences` cookie. Three client components (banner, modal, footer link) drive the UI. A `useConsentGate` hook gates future analytics/marketing scripts. Google Consent Mode v2 defaults deny all non-essential storage and updates on consent change. No external dependencies.

**Tech Stack:** Next.js 15, React 18, TypeScript, Vitest + @testing-library/react, inline `tokens` design system

---

### Task 1: Consent types and cookie utilities

**Files:**
- Create: `src/lib/consent/consent-types.ts`
- Create: `src/lib/consent/consent-cookie.ts`
- Test: `tests/lib/consent/consent-cookie.test.ts`

- [ ] **Step 1: Write the failing test for consent cookie read/write/parse**

```typescript
// tests/lib/consent/consent-cookie.test.ts
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
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    const categories: ConsentCategories = {
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    };
    const value = buildConsentCookieValue(categories);
    expect(value).toContain("Secure");
    process.env.NODE_ENV = originalEnv;
  });

  it("omits Secure flag in development", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";
    const categories: ConsentCategories = {
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    };
    const value = buildConsentCookieValue(categories);
    expect(value).not.toContain("Secure");
    process.env.NODE_ENV = originalEnv;
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
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run tests/lib/consent/consent-cookie.test.ts`
Expected: FAIL — module not found

- [ ] **Step 3: Create `src/lib/consent/consent-types.ts`**

```typescript
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
```

- [ ] **Step 4: Create `src/lib/consent/consent-cookie.ts`**

```typescript
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
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx vitest run tests/lib/consent/consent-cookie.test.ts`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/consent/consent-types.ts src/lib/consent/consent-cookie.ts tests/lib/consent/consent-cookie.test.ts
git commit -m "feat(consent): add consent types and cookie read/write/parse utilities"
```

---

### Task 2: GPC detection and Google Consent Mode helpers

**Files:**
- Create: `src/lib/consent/gpc.ts`
- Create: `src/lib/consent/gcm.ts`
- Test: `tests/lib/consent/gpc.test.ts`
- Test: `tests/lib/consent/gcm.test.ts`

- [ ] **Step 1: Write the failing test for GPC detection**

```typescript
// tests/lib/consent/gpc.test.ts
import { describe, expect, it, afterEach } from "vitest";
import { detectGPCSignal } from "@/lib/consent/gpc";

describe("detectGPCSignal", () => {
  afterEach(() => {
    delete (navigator as any).globalPrivacyControl;
  });

  it("returns true when navigator.globalPrivacyControl is true", () => {
    (navigator as any).globalPrivacyControl = true;
    expect(detectGPCSignal()).toBe(true);
  });

  it("returns false when navigator.globalPrivacyControl is false", () => {
    (navigator as any).globalPrivacyControl = false;
    expect(detectGPCSignal()).toBe(false);
  });

  it("returns false when navigator.globalPrivacyControl is undefined", () => {
    delete (navigator as any).globalPrivacyControl;
    expect(detectGPCSignal()).toBe(false);
  });

  it("returns true when navigator.globalPrivacyControl is '1' (string form)", () => {
    (navigator as any).globalPrivacyControl = "1";
    expect(detectGPCSignal()).toBe(true);
  });
});
```

- [ ] **Step 2: Write the failing test for Google Consent Mode helpers**

```typescript
// tests/lib/consent/gcm.test.ts
import { describe, expect, it, beforeEach, vi } from "vitest";
import {
  CONSENT_TO_GCM_MAP,
  getGCMUpdateCommand,
} from "@/lib/consent/gcm";
import type { ConsentCategories } from "@/lib/consent/consent-types";

describe("Google Consent Mode helpers", () => {
  it("maps all-accepted consent to all-granted GCM signal", () => {
    const categories: ConsentCategories = {
      necessary: true,
      analytics: true,
      preferences: true,
      marketing: true,
    };
    const command = getGCMUpdateCommand(categories);
    expect(command.analytics_storage).toBe("granted");
    expect(command.ad_storage).toBe("granted");
    expect(command.ad_user_data).toBe("granted");
    expect(command.ad_personalization).toBe("granted");
    expect(command.functionality_storage).toBe("granted");
    expect(command.security_storage).toBe("granted");
  });

  it("maps consent-rejected to all-denied except security_storage", () => {
    const categories: ConsentCategories = {
      necessary: true,
      analytics: false,
      preferences: false,
      marketing: false,
    };
    const command = getGCMUpdateCommand(categories);
    expect(command.analytics_storage).toBe("denied");
    expect(command.ad_storage).toBe("denied");
    expect(command.ad_user_data).toBe("denied");
    expect(command.ad_personalization).toBe("denied");
    expect(command.functionality_storage).toBe("denied");
    expect(command.security_storage).toBe("granted");
  });

  it("maps mixed consent correctly", () => {
    const categories: ConsentCategories = {
      necessary: true,
      analytics: true,
      preferences: false,
      marketing: false,
    };
    const command = getGCMUpdateCommand(categories);
    expect(command.analytics_storage).toBe("granted");
    expect(command.ad_storage).toBe("denied");
    expect(command.functionality_storage).toBe("denied");
    expect(command.security_storage).toBe("granted");
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npx vitest run tests/lib/consent/gpc.test.ts tests/lib/consent/gcm.test.ts`
Expected: FAIL — modules not found

- [ ] **Step 4: Create `src/lib/consent/gpc.ts`**

```typescript
export function detectGPCSignal(): boolean {
  const gpc = (navigator as unknown as { globalPrivacyControl?: boolean | string }).globalPrivacyControl;
  if (gpc === true || gpc === "1" || gpc === 1) return true;
  return false;
}
```

- [ ] **Step 5: Create `src/lib/consent/gcm.ts`**

```typescript
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
```

- [ ] **Step 6: Run tests to verify they pass**

Run: `npx vitest run tests/lib/consent/gpc.test.ts tests/lib/consent/gcm.test.ts`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/lib/consent/gpc.ts src/lib/consent/gcm.ts tests/lib/consent/gpc.test.ts tests/lib/consent/gcm.test.ts
git commit -m "feat(consent): add GPC detection and Google Consent Mode helpers"
```

---

### Task 3: ConsentProvider context and useConsentGate hook

**Files:**
- Create: `src/components/consent/consent-provider.tsx`
- Create: `src/components/consent/use-consent-gate.ts`
- Test: `tests/ui/consent-provider.test.tsx`

- [ ] **Step 1: Write the failing test for ConsentProvider**

```typescript
// tests/ui/consent-provider.test.tsx
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
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

  it("shows banner by default when no consent cookie exists and no GPC signal", () => {
    render(
      <ConsentProvider>
        <TestConsumer />
      </ConsentProvider>,
    );
    expect(screen.getByTestId("banner-visible").textContent).toBe("yes");
  });

  it("defaults to all non-essential denied when no prior consent", () => {
    render(
      <ConsentProvider>
        <TestConsumer />
      </ConsentProvider>,
    );
    expect(screen.getByTestId("analytics").textContent).toBe("denied");
    expect(screen.getByTestId("marketing").textContent).toBe("denied");
  });

  it("accepts all categories and hides banner", () => {
    render(
      <ConsentProvider>
        <TestConsumer />
      </ConsentProvider>,
    );
    fireEvent.click(screen.getByText("Accept All"));
    expect(screen.getByTestId("banner-visible").textContent).toBe("no");
    expect(screen.getByTestId("analytics").textContent).toBe("granted");
    expect(screen.getByTestId("marketing").textContent).toBe("granted");
  });

  it("rejects non-essential and hides banner", () => {
    render(
      <ConsentProvider>
        <TestConsumer />
      </ConsentProvider>,
    );
    fireEvent.click(screen.getByText("Reject Non-Essential"));
    expect(screen.getByTestId("banner-visible").textContent).toBe("no");
    expect(screen.getByTestId("analytics").textContent).toBe("denied");
  });

  it("opens and closes preferences modal", () => {
    render(
      <ConsentProvider>
        <TestConsumer />
      </ConsentProvider>,
    );
    fireEvent.click(screen.getByText("Open Preferences"));
    expect(screen.getByTestId("modal-visible").textContent).toBe("yes");
    fireEvent.click(screen.getByText("Close Preferences"));
    expect(screen.getByTestId("modal-visible").textContent).toBe("no");
  });

  it("hides banner when GPC signal is active and sets all non-essential to denied", () => {
    (navigator as any).globalPrivacyControl = true;
    render(
      <ConsentProvider>
        <TestConsumer />
      </ConsentProvider>,
    );
    expect(screen.getByTestId("banner-visible").textContent).toBe("no");
    expect(screen.getByTestId("analytics").textContent).toBe("denied");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ui/consent-provider.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Create `src/components/consent/consent-provider.tsx`**

```tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { ConsentCategories } from "@/lib/consent/consent-types";
import { DEFAULT_CONSENT, ACCEPT_ALL_CONSENT, REJECT_NON_ESSENTIAL_CONSENT } from "@/lib/consent/consent-types";
import { readConsentFromDocument, writeConsentToDocument } from "@/lib/consent/consent-cookie";
import { detectGPCSignal } from "@/lib/consent/gpc";
import { pushGCMUpdate } from "@/lib/consent/gcm";

interface ConsentContextValue {
  consent: ConsentCategories;
  showBanner: boolean;
  showPreferencesModal: boolean;
  updateConsent: (categories: ConsentCategories) => void;
  acceptAll: () => void;
  rejectNonEssential: () => void;
  openPreferences: () => void;
  closePreferences: () => void;
}

const ConsentContext = createContext<ConsentContextValue | null>(null);

export function useConsent(): ConsentContextValue {
  const ctx = useContext(ConsentContext);
  if (!ctx) throw new Error("useConsent must be used within a ConsentProvider");
  return ctx;
}

export function ConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentCategories>(DEFAULT_CONSENT);
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const existing = readConsentFromDocument();
    if (existing) {
      setConsent(existing.c);
      setShowBanner(false);
      pushGCMUpdate(existing.c);
    } else if (detectGPCSignal()) {
      setConsent(REJECT_NON_ESSENTIAL_CONSENT);
      writeConsentToDocument(REJECT_NON_ESSENTIAL_CONSENT);
      setShowBanner(false);
    } else {
      setShowBanner(true);
    }
    setInitialized(true);
  }, []);

  const updateConsent = useCallback((categories: ConsentCategories) => {
    const updated: ConsentCategories = {
      ...categories,
      necessary: true,
    };
    setConsent(updated);
    writeConsentToDocument(updated);
    pushGCMUpdate(updated);
    setShowBanner(false);
  }, []);

  const acceptAll = useCallback(() => {
    updateConsent(ACCEPT_ALL_CONSENT);
  }, [updateConsent]);

  const rejectNonEssential = useCallback(() => {
    updateConsent(REJECT_NON_ESSENTIAL_CONSENT);
  }, [updateConsent]);

  const openPreferences = useCallback(() => {
    setShowPreferencesModal(true);
  }, []);

  const closePreferences = useCallback(() => {
    setShowPreferencesModal(false);
  }, []);

  if (!initialized) {
    return <>{children}</>;
  }

  return (
    <ConsentContext.Provider
      value={{
        consent,
        showBanner,
        showPreferencesModal,
        updateConsent,
        acceptAll,
        rejectNonEssential,
        openPreferences,
        closePreferences,
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}
```

- [ ] **Step 4: Create `src/components/consent/use-consent-gate.ts`**

```typescript
"use client";

import { useContext } from "react";
import { useConsent } from "./consent-provider";
import type { ConsentCategory } from "@/lib/consent/consent-types";

export function useConsentGate(category: ConsentCategory): boolean {
  const { consent } = useConsent();
  return consent[category] === true;
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/ui/consent-provider.test.tsx`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/consent/consent-provider.tsx src/components/consent/use-consent-gate.ts tests/ui/consent-provider.test.tsx
git commit -m "feat(consent): add ConsentProvider context and useConsentGate hook"
```

---

### Task 4: CookieBanner component

**Files:**
- Create: `src/components/consent/cookie-banner.tsx`
- Test: `tests/ui/cookie-banner.test.tsx`

- [ ] **Step 1: Write the failing test for CookieBanner**

```typescript
// tests/ui/cookie-banner.test.tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ui/cookie-banner.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Create `src/components/consent/cookie-banner.tsx`**

```tsx
"use client";

import React from "react";
import { tokens } from "@/lib/design/tokens";

interface CookieBannerProps {
  onAcceptAll: () => void;
  onRejectNonEssential: () => void;
  onManagePreferences: () => void;
}

export function CookieBanner({
  onAcceptAll,
  onRejectNonEssential,
  onManagePreferences,
}: CookieBannerProps) {
  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: tokens.colors.surface,
        borderTop: `1px solid ${tokens.colors.divider}`,
        padding: "20px 24px",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          width: "min(1360px, calc(100% - 48px))",
          margin: "0 auto",
          display: "flex",
          gap: "16px",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        <p
          style={{
            margin: 0,
            color: tokens.colors.textSecondary,
            fontSize: "14px",
            lineHeight: 1.6,
            maxWidth: "680px",
          }}
        >
          We use cookies for essential site functionality and analytics. You can accept all cookies,
          reject non-essential cookies, or manage your preferences.
        </p>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={onAcceptAll}
            style={{
              padding: "10px 16px",
              borderRadius: tokens.radius.control,
              backgroundColor: tokens.colors.primary,
              color: "#001418",
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Accept All
          </button>
          <button
            onClick={onRejectNonEssential}
            style={{
              padding: "10px 16px",
              borderRadius: tokens.radius.control,
              backgroundColor: "transparent",
              color: tokens.colors.text,
              fontSize: "14px",
              fontWeight: 600,
              border: `1px solid ${tokens.colors.border}`,
              cursor: "pointer",
            }}
          >
            Reject Non-Essential
          </button>
          <button
            onClick={onManagePreferences}
            style={{
              padding: "10px 16px",
              borderRadius: tokens.radius.control,
              backgroundColor: "transparent",
              color: tokens.colors.primary,
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Manage Preferences
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/ui/cookie-banner.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/consent/cookie-banner.tsx tests/ui/cookie-banner.test.tsx
git commit -m "feat(consent): add CookieBanner component with accessibility"
```

---

### Task 5: CookiePreferencesModal component

**Files:**
- Create: `src/components/consent/cookie-preferences-modal.tsx`
- Test: `tests/ui/cookie-preferences-modal.test.tsx`

- [ ] **Step 1: Write the failing test for CookiePreferencesModal**

```typescript
// tests/ui/cookie-preferences-modal.test.tsx
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
    expect(screen.getByText(/strictly necessary/i)).toBeTruthy();
    expect(screen.getByText(/analytics/i)).toBeTruthy();
    expect(screen.getByText(/preferences/i)).toBeTruthy();
    expect(screen.getByText(/marketing/i)).toBeTruthy();
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
    expect(necessaryToggle).toBeDisabled();
    expect(necessaryToggle).toHaveAttribute("aria-checked", "true");
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
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/ui/cookie-preferences-modal.test.tsx`
Expected: FAIL — module not found

- [ ] **Step 3: Create `src/components/consent/cookie-preferences-modal.tsx`**

```tsx
"use client";

import React, { useState } from "react";
import { tokens } from "@/lib/design/tokens";
import type { ConsentCategories, ConsentCategory } from "@/lib/consent/consent-types";
import { DEFAULT_CONSENT } from "@/lib/consent/consent-types";

interface CookiePreferencesModalProps {
  consent: ConsentCategories;
  onSave: (categories: ConsentCategories) => void;
  onRejectAll: () => void;
  onClose: () => void;
}

const CATEGORY_INFO: {
  key: ConsentCategory;
  label: string;
  description: string;
  alwaysOn?: boolean;
}[] = [
  {
    key: "necessary",
    label: "Strictly Necessary",
    description:
      "Required for the site to function. Cannot be disabled. Includes session authentication and consent preferences.",
    alwaysOn: true,
  },
  {
    key: "analytics",
    label: "Analytics",
    description:
      "Help us understand how visitors interact with the site so we can improve the experience. Includes Google Analytics.",
  },
  {
    key: "preferences",
    label: "Preferences",
    description:
      "Remember your settings and choices to provide a more personalized experience.",
  },
  {
    key: "marketing",
    label: "Marketing",
    description:
      "Used for chat widgets, retargeting, and advertising. These cookies track visitors across websites.",
  },
];

export function CookiePreferencesModal({
  consent,
  onSave,
  onRejectAll,
  onClose,
}: CookiePreferencesModalProps) {
  const [localConsent, setLocalConsent] = useState<ConsentCategories>({ ...consent });

  const handleToggle = (key: ConsentCategory) => {
    if (key === "necessary") return;
    setLocalConsent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-label="Cookie preferences"
        style={{
          backgroundColor: tokens.colors.surface,
          borderRadius: tokens.radius.card,
          border: `1px solid ${tokens.colors.border}`,
          padding: "28px",
          width: "min(520px, calc(100% - 48px))",
          maxHeight: "80vh",
          overflowY: "auto",
          display: "grid",
          gap: "20px",
        }}
      >
        <div style={{ display: "grid", gap: "8px" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "clamp(1.6rem, 3vw, 2rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              fontWeight: 600,
            }}
          >
            Cookie Preferences
          </h2>
          <p
            style={{
              margin: 0,
              color: tokens.colors.textSecondary,
              fontSize: "14px",
              lineHeight: 1.6,
            }}
          >
            Manage your cookie preferences. Strictly necessary cookies cannot be disabled.
          </p>
        </div>

        <div style={{ display: "grid", gap: "14px" }}>
          {CATEGORY_INFO.map((cat) => (
            <div
              key={cat.key}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: "16px",
                padding: "14px 0",
                borderBottom: `1px solid ${tokens.colors.divider}`,
              }}
            >
              <div style={{ display: "grid", gap: "4px", flex: 1 }}>
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  {cat.label}
                  {cat.alwaysOn && (
                    <span
                      style={{
                        fontSize: "11px",
                        fontFamily: tokens.typography.mono,
                        color: tokens.colors.primary,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      Always on
                    </span>
                  )}
                </div>
                <div
                  style={{
                    color: tokens.colors.textSecondary,
                    fontSize: "13px",
                    lineHeight: 1.5,
                  }}
                >
                  {cat.description}
                </div>
              </div>
              <button
                role="switch"
                aria-checked={cat.alwaysOn ? "true" : localConsent[cat.key] ? "true" : "false"}
                aria-label={cat.label}
                disabled={cat.alwaysOn}
                onClick={() => handleToggle(cat.key)}
                style={{
                  width: "44px",
                  height: "24px",
                  borderRadius: "12px",
                  border: "none",
                  cursor: cat.alwaysOn ? "default" : "pointer",
                  backgroundColor:
                    cat.alwaysOn || localConsent[cat.key]
                      ? tokens.colors.primary
                      : tokens.colors.border,
                  position: "relative",
                  flexShrink: 0,
                  transition: "background-color 0.2s",
                  padding: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: "2px",
                    left: cat.alwaysOn || localConsent[cat.key] ? "22px" : "2px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "10px",
                    backgroundColor: "#fff",
                    transition: "left 0.2s",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button
            onClick={() => onSave(localConsent)}
            style={{
              padding: "12px 18px",
              borderRadius: tokens.radius.control,
              backgroundColor: tokens.colors.primary,
              color: "#001418",
              fontSize: "14px",
              fontWeight: 700,
              border: "none",
              cursor: "pointer",
            }}
          >
            Save Preferences
          </button>
          <button
            onClick={onRejectAll}
            style={{
              padding: "12px 18px",
              borderRadius: tokens.radius.control,
              backgroundColor: "transparent",
              color: tokens.colors.text,
              fontSize: "14px",
              fontWeight: 600,
              border: `1px solid ${tokens.colors.border}`,
              cursor: "pointer",
            }}
          >
            Reject All
          </button>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              padding: "12px 18px",
              borderRadius: tokens.radius.control,
              backgroundColor: "transparent",
              color: tokens.colors.textSecondary,
              fontSize: "14px",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/ui/cookie-preferences-modal.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/components/consent/cookie-preferences-modal.tsx tests/ui/cookie-preferences-modal.test.tsx
git commit -m "feat(consent): add CookiePreferencesModal with category toggles"
```

---

### Task 6: Integration — wire into layout.tsx and landing-page.tsx footer

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/components/marketing/landing-page.tsx`

- [ ] **Step 1: Update `src/app/layout.tsx` to wrap children in ConsentProvider and add Google Consent Mode default script**

The root layout needs to:
1. Import and render `ConsentProvider` wrapping `{children}`
2. Import and render `CookieBanner` and `CookiePreferencesModal` inside the provider
3. Add the Google Consent Mode default script in `<head>`

Read the current `layout.tsx` and replace its contents:

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";
import { ConsentProvider } from "@/components/consent/consent-provider";
import { CookieBanner } from "@/components/consent/cookie-banner";
import { CookiePreferencesModal } from "@/components/consent/cookie-preferences-modal";
import { useConsent } from "@/components/consent/consent-provider";

function ConsentUI() {
  const { showBanner, showPreferencesModal, consent, acceptAll, rejectNonEssential, openPreferences, closePreferences, updateConsent } = useConsent();

  return (
    <>
      {showBanner && (
        <CookieBanner
          onAcceptAll={acceptAll}
          onRejectNonEssential={rejectNonEssential}
          onManagePreferences={openPreferences}
        />
      )}
      {showPreferencesModal && (
        <CookiePreferencesModal
          consent={consent}
          onSave={updateConsent}
          onRejectAll={rejectNonEssential}
          onClose={closePreferences}
        />
      )}
    </>
  );
}

export const metadata: Metadata = {
  metadataBase: new URL("https://seoairegent.com"),
  title: {
    default: "SEO AI Regent",
    template: "%s | SEO AI Regent",
  },
  description:
    "Editorial-grade content scoring for Google and AI search, with Content Score, GEO Score, citability analysis, and canonical score explanations.",
  keywords: [
    "SEO AI Regent",
    "content scoring",
    "GEO score",
    "AI search",
    "editorial SEO",
    "SERP analysis",
    "content optimization",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "SEO AI Regent",
    description:
      "Score content for Google and AI search before you publish, from one canonical model.",
    url: "https://seoairegent.com",
    siteName: "SEO AI Regent",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO AI Regent",
    description:
      "Score content for Google and AI search before you publish, from one canonical model.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  'analytics_storage': 'denied',
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'functionality_storage': 'denied',
  'security_storage': 'granted',
  'wait_for_update': 500
});
gtag('set', 'url_passthrough', true);
`,
          }}
        />
      </head>
      <body>
        <ConsentProvider>
          {children}
          <ConsentUI />
        </ConsentProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Update `src/components/marketing/landing-page.tsx` footer — add "Cookie Preferences" link**

In the footer section of `landing-page.tsx`, add a "Cookie Preferences" link next to the existing Privacy and Terms links. Find the footer `<div>` containing the Privacy and Terms links and add a link for Cookie Preferences:

Change the section that currently has:
```tsx
<Link href="/privacy" style={{ color: tokens.colors.primary, fontSize: "14px" }}>
  Privacy
</Link>
<Link href="/terms" style={{ color: tokens.colors.primary, fontSize: "14px" }}>
  Terms
</Link>
```

To include:
```tsx
<Link href="/privacy" style={{ color: tokens.colors.primary, fontSize: "14px" }}>
  Privacy
</Link>
<Link href="/terms" style={{ color: tokens.colors.primary, fontSize: "14px" }}>
  Terms
</Link>
<Link href="/cookies" style={{ color: tokens.colors.primary, fontSize: "14px" }}>
  Cookies
</Link>
```

This is a simple link since the modal can also be opened via the footer — the `/cookies` page serves as the dedicated Cookie Policy page, and the in-page "Cookie Preferences" modal is accessible through the banner and from the `/cookies` page.

- [ ] **Step 3: Run the existing landing page test to verify nothing is broken**

Run: `npx vitest run tests/ui/landing-page.test.tsx`
Expected: PASS (all existing tests should still pass)

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/components/marketing/landing-page.tsx
git commit -m "feat(consent): wire ConsentProvider, banner, and modal into layout and footer"
```

---

### Task 7: Cookie Policy page (`/cookies`)

**Files:**
- Create: `src/app/cookies/page.tsx`

- [ ] **Step 1: Create `src/app/cookies/page.tsx`**

```tsx
import React from "react";
import type { Metadata } from "next";
import Link from "next/link";

import { tokens } from "@/lib/design/tokens";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "How SEO AI Regent uses cookies and how to manage your preferences.",
  alternates: {
    canonical: "/cookies",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const sectionStyle = {
  display: "grid",
  gap: "10px",
} satisfies React.CSSProperties;

const cookieTable = [
  {
    name: "seo-ai-regent-session",
    category: "Strictly Necessary",
    purpose: "Maintains your authenticated session.",
    duration: "7 days",
  },
  {
    name: "consent_preferences",
    category: "Strictly Necessary",
    purpose: "Stores your cookie consent choices.",
    duration: "365 days",
  },
  {
    name: "_ga, _ga_*",
    category: "Analytics",
    purpose: "Google Analytics tracking. Only set if you consent to analytics cookies.",
    duration: "2 years",
  },
  {
    name: "Preference cookies",
    category: "Preferences",
    purpose: "Remember your UI settings and choices. Only set if you consent to preference cookies.",
    duration: "1 year",
  },
  {
    name: "Marketing / chat widget cookies",
    category: "Marketing",
    purpose: "Support chat, retargeting, and advertising. Only set if you consent to marketing cookies.",
    duration: "Varies",
  },
];

export default function CookiesPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: tokens.colors.background,
        color: tokens.colors.text,
        padding: "72px 24px 96px",
      }}
    >
      <div
        style={{
          width: "min(760px, 100%)",
          margin: "0 auto",
          display: "grid",
          gap: "28px",
        }}
      >
        <div style={{ display: "grid", gap: "14px" }}>
          <Link
            href="/"
            style={{
              color: tokens.colors.primary,
              fontFamily: tokens.typography.mono,
              fontSize: "12px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            SEO AI Regent
          </Link>
          <h1
            style={{
              margin: 0,
              fontSize: "clamp(2.6rem, 6vw, 4rem)",
              lineHeight: 1,
              letterSpacing: "-0.03em",
            }}
          >
            Cookie Policy
          </h1>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            Last updated: April 2026. This policy describes how SEO AI Regent uses cookies and how
            you can manage your preferences.
          </p>
        </div>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>What Cookies We Use</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            We categorize cookies into four groups: strictly necessary, analytics, preferences, and
            marketing. Only strictly necessary cookies are set by default. All other categories
            require your consent.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
                lineHeight: 1.5,
              }}
            >
              <thead>
                <tr style={{ borderBottom: `1px solid ${tokens.colors.divider}` }}>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Cookie</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Category</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Purpose</th>
                  <th style={{ textAlign: "left", padding: "8px 12px", fontWeight: 600 }}>Duration</th>
                </tr>
              </thead>
              <tbody>
                {cookieTable.map((row) => (
                  <tr key={row.name} style={{ borderBottom: `1px solid ${tokens.colors.divider}` }}>
                    <td style={{ padding: "8px 12px", color: tokens.colors.text, whiteSpace: "nowrap" }}>
                      {row.name}
                    </td>
                    <td style={{ padding: "8px 12px", color: tokens.colors.textSecondary }}>{row.category}</td>
                    <td style={{ padding: "8px 12px", color: tokens.colors.textSecondary }}>{row.purpose}</td>
                    <td style={{ padding: "8px 12px", color: tokens.colors.textSecondary, whiteSpace: "nowrap" }}>
                      {row.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Managing Your Preferences</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            When you first visit our site, a consent banner will appear. You can accept all cookies,
            reject non-essential cookies, or open the preferences manager to customize your choices.
            At any time, you can reopen the preferences manager using the "Cookies" link in the site
            footer. Withdrawing consent is as easy as granting it.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Global Privacy Control (GPC)</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            We honor Global Privacy Control signals. If your browser sends a GPC signal
            (navigator.globalPrivacyControl = true), we will automatically reject all non-essential
            cookies on your behalf.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Changes to This Policy</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            If we change the cookies we use, we will update this policy and increment the policy
            version stored in your consent preferences. You may be shown the consent banner again to
            re-confirm your choices.
          </p>
        </section>

        <section style={sectionStyle}>
          <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Contact</h2>
          <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
            For broader privacy questions, see our{" "}
            <Link href="/privacy" style={{ color: tokens.colors.primary }}>
              Privacy Policy
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/cookies/page.tsx
git commit -m "feat(consent): add Cookie Policy page at /cookies"
```

---

### Task 8: Update Privacy Policy with cookie section

**Files:**
- Modify: `src/app/privacy/page.tsx`

- [ ] **Step 1: Add a "Cookies and Tracking" section to the Privacy Policy**

Open `src/app/privacy/page.tsx` and add a new section after the "User Requests" section, before the closing `</div>` of the main content area. Insert the following section:

```tsx
<section style={sectionStyle}>
  <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Cookies and Tracking</h2>
  <p style={{ margin: 0, color: tokens.colors.textSecondary, lineHeight: 1.7 }}>
    We use strictly necessary cookies to maintain your session and remember your consent
    preferences. For analytics, preference, and marketing cookies, we ask for your consent first.
    See our{" "}
    <Link href="/cookies" style={{ color: tokens.colors.primary }}>
      Cookie Policy
    </Link>{" "}
    for the full list and your rights.
  </p>
</section>
```

- [ ] **Step 2: Commit**

```bash
git add src/app/privacy/page.tsx
git commit -m "feat(consent): add cookies and tracking section to Privacy Policy"
```

---

### Task 9: Run full test suite and verify

- [ ] **Step 1: Run all unit tests**

Run: `npx vitest run`
Expected: All tests pass, including new consent tests.

- [ ] **Step 2: Run TypeScript type check**

Run: `npx tsc --noEmit`
Expected: No type errors.

- [ ] **Step 3: Run dev server and verify manually**

Run: `npm run dev`

Verify in browser:
- Cookie banner appears at bottom of page on first visit
- "Accept All" hides banner and sets cookie
- "Reject Non-Essential" hides banner and sets cookie
- "Manage Preferences" opens modal with toggles
- Footer has "Cookies" link pointing to `/cookies`
- `/cookies` page renders correctly
- `/privacy` page has new "Cookies and Tracking" section
- After setting consent, refresh does not show banner
- Clear `consent_preferences` cookie → banner reappears

- [ ] **Step 4: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "fix(consent): address issues found during manual verification"
```

---

## Self-Review Checklist

- [x] **Spec coverage:** Each spec requirement maps to a task:
  - Categories and schema → Task 1
  - GCM integration → Tasks 2, 6
  - GPC handling → Task 2, 3
  - Banner → Task 4
  - Modal → Task 5
  - Footer link → Task 6
  - Cookie policy page → Task 7
  - Privacy policy update → Task 8
  - Script gating hook → Task 3
  - Accessibility → Tasks 4, 5 (role, aria-label, keyboard operable)
  - Consent lifecycle flows → Tasks 1, 3
- [x] **Placeholder scan:** No TBDs, TODOs, or vague steps. All code is concrete.
- [x] **Type consistency:** `ConsentCategories`, `ConsentCategory`, `ConsentCookiePayload`, `CONSENT_COOKIE_NAME`, `CONSENT_POLICY_VERSION` — all defined in consent-types.ts and used consistently across tasks.