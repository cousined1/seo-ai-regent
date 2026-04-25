---
type: knowledge
tags:
  - audit
  - e2e
  - auth
  - billing
confidence: high
created: 2026-04-22
source: local-build
---

# Auth Browser E2E

## What changed

- Added Playwright with a Chromium project and a local Next web-server harness.
- Added browser coverage for `/register`, `/login`, password reset on `/login?resetToken=...`, and `/account/billing`.
- Excluded `e2e/` from Vitest so the unit suite and Playwright suite stay isolated.

## What it caught

- The original CSP blocked Next client hydration in a real browser because `script-src 'self'` was too strict for the runtime.
- The billing page dropped the `"Signed out."` confirmation because the unauthenticated branch returned early without rendering `message`.

## What remains

- Provider truth is still a deployed-environment concern: live Resend delivery, live Stripe webhook delivery, real checkout redirects, and real billing portal behavior.
