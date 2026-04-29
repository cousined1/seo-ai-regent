# Production Checklist

## Verified In Repo

- [x] `npm test` passes
- [x] `npm run build` passes
- [x] Security headers are configured in `next.config.mjs`
- [x] `/api/health` and `/api/ready` exist
- [x] Debug mutation routes require an authenticated admin session with MFA verification
- [x] Public compute routes are rate-limited
- [x] Stripe webhook events persist dedupe receipts before applying plan changes
- [x] Password reset uses provider-backed outbound email delivery code instead of token previews
- [x] Public auth and billing pages exist at `/login`, `/register`, and `/account/billing`
- [x] Browser-level E2E coverage exists for `/login`, `/register`, and `/account/billing`
- [x] Public legal pages exist at `/privacy` and `/terms`
- [x] Railway deployment manifest exists at `railway.json`
- [x] Initial Prisma migration is checked in at `prisma/migrations/0001_init`
- [x] Build runs `prisma generate` before `next build`
- [x] Railway start command runs `prisma migrate deploy` before `next start` (`npm run start:prod`)

## Required Environment Variables

- [x] `NEXT_PUBLIC_SITE_URL`
- [x] `DATABASE_URL`
- [x] `SERPER_API_KEY`
- [x] `AUTH_SESSION_SECRET`
- [x] `AUTH_ADMIN_EMAIL`
- [x] `AUTH_ADMIN_PASSWORD_HASH`
- [x] `AUTH_ADMIN_TOTP_SECRET`
- [x] `STRIPE_SECRET_KEY`
- [x] `STRIPE_WEBHOOK_SECRET`
- [x] `STRIPE_EDITOR_PRICE_ID`
- [x] `STRIPE_EDITORIAL_PRICE_ID`
- [x] `STRIPE_SYNDICATE_PRICE_ID`
- [x] `RESEND_API_KEY`
- [x] `AUTH_RESET_EMAIL_FROM`

## Optional Environment Variables

- [ ] `NEXT_PUBLIC_GTM_ID` — when unset, GTM script, noscript iframe, and all `track*` helpers are inert (no network, no `dataLayer` writes from helpers). When set, GTM container loads with Google Consent Mode v2 defaulted to deny non-essential storage; consent transitions are driven by `pushGCMUpdate` from the existing `ConsentProvider`.

## Analytics Wiring (in repo)

- [x] GCM v2 default-deny block injected inline in `<head>` before GTM loads (`src/app/layout.tsx`)
- [x] GTM container script gated by `NEXT_PUBLIC_GTM_ID` (`src/components/analytics/gtm-script.tsx`)
- [x] GTM `<noscript>` iframe rendered as the first child of `<body>`
- [x] SPA pageviews pushed via `RouteChangeTracker` (`src/components/analytics/route-change-tracker.tsx`)
- [x] `signup_started` / `signup_completed` events fire from `RegisterForm`
- [x] `subscription_purchased` event fires once on `/app/editor?checkout=success` and the query param is cleaned up via `router.replace`
- [x] Unit coverage for the analytics module at `tests/lib/analytics/gtm.test.ts`

## Must Verify In Deployed Environment

- [ ] Resend can actually deliver password reset mail from the configured sender
- [ ] Stripe webhook endpoint receives real signed deliveries from the live Stripe project
- [ ] Stripe checkout redirects correctly with live price IDs
- [ ] Stripe billing portal opens for a provisioned customer
- [ ] Shared rate limiting behaves correctly across multiple app instances against the production database
- [ ] Admin MFA login works with the real configured TOTP secret
- [ ] With `NEXT_PUBLIC_GTM_ID` set, GA4 DebugView shows `page_view` on route changes and `signup_started` / `signup_completed` / `subscription_purchased` on the corresponding flows
- [ ] In GA4 → Admin → Data Streams → Web stream → Enhanced Measurement, **disable "Page changes based on browser history events"** to avoid double-counting against the in-app `RouteChangeTracker`
- [ ] In GTM, confirm tags are gated by built-in consent (analytics_storage / ad_storage) so default-deny actually suppresses tag firing pre-consent

## Follow-Up Audit Targets

- [x] Add deployed smoke tests for auth, checkout, webhook, and reset-email flows (`npm run smoke -- https://<deployed-url>`)
- [ ] Review legal copy, support contact path, and any required DPA/subprocessor disclosures before launch
