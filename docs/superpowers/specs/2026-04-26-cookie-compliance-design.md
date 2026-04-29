# Cookie Compliance System — Design Specification

**Date:** 2026-04-26
**Status:** Approved
**Approach:** Minimal Consent Layer (Approach A)

## Overview

Implement a production-ready cookie consent and privacy preference system for the SEO AI Regent public site and app. The system must detect and categorize all cookies and trackers, block non-essential scripts until valid consent is obtained, provide accessible consent UI, and honor Global Privacy Control signals. Google Consent Mode v2 must initialize with denied defaults and update when consent is granted.

## Context

- Next.js 15 app with React 18, TypeScript, Tailwind, Prisma, Stripe
- Current cookie usage: single `seo-ai-regent-session` auth cookie (HttpOnly, SameSite=Lax)
- No analytics, marketing, or third-party tracking scripts currently present
- Footer has Privacy/Terms links only
- Privacy policy exists at `/privacy` with no cookie section
- All components use inline styles with a `tokens` design system (`src/lib/design/tokens.ts`)
- Chat widget planned for future — must be gated behind marketing consent

## Architecture

### Cookie Categories

| Category | Key | Default | Description |
|---|---|---|---|
| Strictly Necessary | `necessary` | Always on | Session auth, CSRF, security cookies. Cannot be toggled off. |
| Analytics | `analytics` | Off | Google Analytics, GTM analytics tags. |
| Preferences | `preferences` | Off | UI preferences, remembered settings, feature flags. |
| Marketing | `marketing` | Off | Chat widgets (Crisp/Intercom/Tawk), retargeting pixels, ad trackers. |

### Consent Cookie Schema

Stored as `consent_preferences` — a non-HttpOnly, SameSite=Lax cookie so both client and server can read it.

```json
{
  "v": 1,
  "ts": 1714089600000,
  "pv": "1.0",
  "c": { "necessary": true, "analytics": false, "preferences": false, "marketing": false }
}
```

- `v`: schema version for future migration
- `ts`: timestamp of last consent action (epoch ms)
- `pv`: policy version string matching the published cookie policy version
- `c`: category consent booleans

Cookie attributes: `Path=/; SameSite=Lax; Max-Age=31536000` (365 days). Secure flag added in production.

### Google Consent Mode v2 Integration

In `layout.tsx` `<head>`, before any other scripts:

```html
<script>
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
</script>
```

When consent is updated, `ConsentProvider` calls `gtag('consent', 'update', {...})` to grant the relevant storage types.

### GPC Signal Handling

On first load, check `navigator.globalPrivacyControl`. If `true`, automatically set all non-necessary categories to denied and suppress the banner — treating it as a "Reject Non-Essential" action with a GPC flag recorded in the consent cookie. If `false` or unsupported, show the banner normally.

## Components

### ConsentProvider

A `"use client"` React context provider wrapping `{children}` in `layout.tsx`.

**Responsibilities:**
- Read `consent_preferences` cookie on mount via `document.cookie`
- If no cookie: check GPC signal. If GPC active, auto-reject and suppress banner. Otherwise, show banner.
- If cookie exists: restore consent state, update Google Consent Mode signals, hide banner.
- Expose: `consent` state, `showBanner`, `showPreferencesModal`, `updateConsent(categories)`, `openPreferences()`, `closePreferences()`
- On consent change: write new `consent_preferences` cookie, call `gtag('consent', 'update', ...)` for granted categories, conditionally mount/unmount gated scripts

### CookieBanner component

- Fixed position, bottom of viewport
- Three action buttons: **Accept All** (enables all categories), **Reject Non-Essential** (only necessary), **Manage Preferences** (opens modal)
- Accessible: focus trap when visible, `role="dialog"`, `aria-label="Cookie consent"`, keyboard-navigable buttons, Escape key dismisses (treated as dismiss without saving — re-shows on next load)
- Styling uses inline `tokens` style pattern matching the existing landing page (dark surface, `tokens.colors.primary` accent, `tokens.colors.textSecondary` body text)
- Disappears permanently once a choice is made

### CookiePreferencesModal component

- Centered overlay with backdrop
- One toggle per category (necessary toggle is disabled / always-on)
- Each toggle row: category label, short description, on/off switch
- Save / Reject All buttons at bottom
- Focus-trapped, `role="dialog"`, `aria-label="Cookie preferences"`, Escape to close
- Accessible from footer link at any time (re-opens modal even after initial consent)

### Footer update

Add a "Cookie Preferences" link alongside existing Privacy/Terms links in `landing-page.tsx` footer. Clicking calls `openPreferences()` from ConsentProvider context.

### Script gating hook

`useConsentGate(category: string)` — returns `boolean`. Used by any future script loader:

```tsx
const analyticsEnabled = useConsentGate('analytics');
useEffect(() => {
  if (analyticsEnabled) { /* load GA/GTM */ }
}, [analyticsEnabled]);
```

Chat widget gating follows the same pattern under the `marketing` category.

### Component tree

```
layout.tsx
  └─ ConsentProvider
       ├─ GoogleConsentModeDefault (server component, emits <script> tag)
       └─ {children}   ← existing pages
       ├─ CookieBanner
       └─ CookiePreferencesModal
```

The provider sits as a client boundary in the root layout. Pages below it remain server components where possible, same as today.

## Data Flow & Consent Lifecycle

### First visit (no cookie)

```
User lands on any page
  → ConsentProvider mounts
  → No consent_preferences cookie found
  → Check navigator.globalPrivacyControl
     ├─ GPC true → auto-reject non-essential, write cookie with GPC flag, suppress banner
     └─ GPC false/unsupported → show CookieBanner
  → Google Consent Mode defaults deny all non-essential storage
  → No analytics/marketing scripts load
```

### User accepts all

```
Click "Accept All"
  → updateConsent({ necessary: true, analytics: true, preferences: true, marketing: true })
  → Write consent_preferences cookie (v=1, ts=now, pv="1.0", c={...all true})
  → gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted', ... })
  → Conditionally load GA/GTM scripts via useConsentGate effects
  → Hide banner
```

### User rejects non-essential

```
Click "Reject Non-Essential"
  → updateConsent({ necessary: true, analytics: false, preferences: false, marketing: false })
  → Write cookie (v=1, ts=now, pv="1.0", c={only necessary true})
  → Keep Consent Mode defaults (already denied)
  → Hide banner
```

### User opens preferences later (via footer link)

```
Click "Cookie Preferences" in footer
  → openPreferences() sets showPreferencesModal=true
  → Modal renders with current consent state pre-filled
  → User toggles categories, clicks "Save"
  → updateConsent with new categories
  → Write updated cookie
  → gtag('consent', 'update', ...) for newly granted categories
  → Scripts load/unload accordingly
  → Close modal
```

### Consent withdrawal (disabling a previously granted category)

```
User un-toggles "analytics" in preferences
  → updateConsent({ ..., analytics: false })
  → Write updated cookie
  → gtag('consent', 'update', { analytics_storage: 'denied' })
  → Unload analytics scripts (remove script elements, clear dataLayer if needed)
  → As easy to withdraw as it was to grant
```

### Server-side consent check

The `consent_preferences` cookie is non-HttpOnly, so it's sent with every request. Server-side routes can read it to decide whether to include inline tracking scripts in the HTML response, though the primary gating mechanism is client-side. Accessible via `request.headers.get('cookie')` and parsable using the existing `readSessionCookie` pattern from `src/lib/auth/cookie.ts`.

### Consent logging

Each consent action writes a `consent_preferences` cookie with a fresh `ts` (timestamp). The timestamped, versioned cookie itself is the primary audit record. No separate `ConsentLog` Prisma model is created in this scope. If future requirements demand server-side audit logging, it can be added.

## Cookie Policy Page

### `/cookies` route (new)

File: `src/app/cookies/page.tsx`

Follows the same layout pattern as `/privacy` and `/terms` pages — inline tokens, centered max-width content area, consistent header with link back to home.

**Content sections:**

1. **What cookies we use** — table listing each cookie by name, category, purpose, and duration
   - `seo-ai-regent-session` (Strictly Necessary, auth session, 7 days)
   - `consent_preferences` (Strictly Necessary, consent state, 365 days)
   - Google Analytics cookies (`_ga`, `_ga_*`) (Analytics, usage tracking, 2 years) — noted as "only set if you consent"
   - Preference cookies (Preferences, UI settings, 1 year) — noted as "only set if you consent"
   - Marketing/chat widget cookies (Marketing, support chat, varies) — noted as "only set if you consent"

2. **How to manage your preferences** — explains the banner, the footer link, and how to withdraw consent (as easy as granting it)

3. **Global Privacy Control** — explains that GPC signals are honored, and that if the browser sends GPC=1, non-essential cookies are automatically rejected

4. **Changes to this policy** — policy version (`pv` field) and last-updated date

5. **Contact** — links to `/privacy` for broader privacy questions

### SEO metadata

`/cookies` page exports `metadata` with `title`, `description`, `canonical: "/cookies"`, and `robots: { index: true, follow: true }` — matching the privacy and terms page pattern.

### Privacy Policy update

Add a brief cookies section to `/privacy`:

> **Cookies and tracking** — We use strictly necessary cookies to maintain your session and remember your consent preferences. For analytics, preference, and marketing cookies, we ask for your consent first. See our [Cookie Policy](/cookies) for the full list and your rights.

## Region Awareness

The consent system checks `navigator.language` and uses a heuristic for EU/EEA/California detection. For EU/EEA and California visitors, prior consent is required before any non-essential cookies or scripts load. For regions without explicit cookie consent laws, the banner still appears but with a less aggressive default — the key principle is that consent is always obtained before non-essential tracking begins, regardless of region.

## Accessibility

- Banner: focus trap, `role="dialog"`, `aria-label="Cookie consent"`, keyboard navigation, Escape dismisses
- Modal: focus trap, `role="dialog"`, `aria-label="Cookie preferences"`, Escape closes
- Toggle switches: proper `aria-checked`, `aria-label` per category
- All interactive elements reachable via Tab, operable via Enter/Space
- Color contrast meets WCAG 2.1 AA (verified against `tokens` palette)

## Files to Create/Modify

### New files

- `src/lib/consent/consent-types.ts` — TypeScript types for consent categories and cookie schema
- `src/lib/consent/consent-cookie.ts` — read/write/parse the `consent_preferences` cookie
- `src/lib/consent/gpc.ts` — Global Privacy Control signal detection
- `src/lib/consent/gcm.ts` — Google Consent Mode default and update helpers
- `src/components/consent/consent-provider.tsx` — React context provider
- `src/components/consent/cookie-banner.tsx` — banner UI component
- `src/components/consent/cookie-preferences-modal.tsx` — preferences modal UI
- `src/components/consent/use-consent-gate.ts` — hook for script gating
- `src/app/cookies/page.tsx` — Cookie Policy page

### Modified files

- `src/app/layout.tsx` — wrap children in `ConsentProvider`, add Google Consent Mode default script in `<head>`
- `src/components/marketing/landing-page.tsx` — add "Cookie Preferences" link to footer
- `src/app/privacy/page.tsx` — add cookies and tracking section with link to `/cookies`

## Scope Exclusions

- No `ConsentLog` database table (cookie is the audit record)
- No IP-based geolocation for region detection (language-based heuristic only)
- No GTM container snippet yet (infrastructure is ready, container ID to be added when GA/GTM account is configured)
- No chat widget implementation (infrastructure is ready, widget to be added when provider is selected)