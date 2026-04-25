# 2026-04-22 Medium-Risk Audit Pass

## Scope

This pass targeted the medium-risk items left after the original auth, billing, and runtime blockers were cleared:

1. add webhook idempotency persistence
2. replace reset-token preview with real outbound email delivery code
3. add public account pages on top of the new APIs
4. move rate limiting from process memory to a shared persistence path
5. document what still requires deployed verification

## Completed

- Added durable Stripe webhook receipts through `StripeWebhookEvent` and route-level duplicate short-circuiting.
- Added provider-backed reset email delivery through the Resend HTTP API.
- Added `/login`, `/register`, and `/account/billing` pages with client forms that exercise the real API routes.
- Added a Playwright/Chromium browser harness for `/login`, `/register`, and `/account/billing`.
- Added public `/privacy` and `/terms` pages and linked them into the crawlable public surface.
- Upgraded `enforceRateLimit` to use Prisma-backed `RateLimitWindow` records when persistence is available.
- Added UI coverage for the new page surfaces and regression coverage for webhook replay handling and reset-email flow.
- Added `PRODUCTION_CHECKLIST.md` so deployment-time verification items are explicit instead of implied.
- Tightened the CSP so Next client hydration works under a browser harness, and preserved the billing sign-out confirmation in the unauthenticated state.

## Still Not Fully Verifiable Locally

- actual mailbox delivery from the configured Resend sender
- live Stripe checkout and billing portal behavior
- real webhook delivery from the live Stripe project
- multi-instance rate limiting against a production database cluster

## Verification

- `npm test` passed after the slice
- `npm run test:e2e` passed after the slice
- `npm run build` passed after the slice
