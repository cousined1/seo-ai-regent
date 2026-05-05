# Production Checklist — SEO AI Regent

## Verified in this Audit (2026-05-04)

- [x] `npm run build` passes with zero errors and zero warnings
- [x] `npx tsc --noEmit` passes with zero errors
- [x] `npm test` passes (340 tests, 53 files, zero failures)
- [x] `npm audit --high` returns zero HIGH/CRITICAL vulnerabilities
- [x] Security headers are configured in `next.config.mjs` (HSTS, X-Frame, Permissions-Policy, Nosniff)
- [x] CSP with nonce is injected by middleware on every response
- [x] `/api/health` and `/api/ready` exist and return operational status
- [x] Debug/mutation routes require authenticated admin session with MFA verification
- [x] Public auth and billing pages exist at `/login`, `/register`, and `/account/billing`
- [x] Browser-level E2E coverage exists for `/login`, `/register`, and `/account/billing`
- [x] Public legal pages exist at `/privacy` and `/terms`
- [x] Railway deployment manifest exists at `railway.json`
- [x] Initial Prisma migration is checked in at `prisma/migrations/0001_init`
- [x] Build runs `prisma generate` before `next build`
- [x] Railway start command runs `prisma migrate deploy` before `next start` (`npm run start:prod`)
- [x] Auth rate limiting: 5 requests / 60 seconds on `/api/auth/login` and `/api/auth/register`
- [x] Rate limit returns `429` with `Retry-After` header
- [x] Stripe webhook events persist dedupe receipts before applying plan changes
- [x] Stripe webhook signature verified with `constructEvent` before processing
- [x] Password reset uses provider-backed outbound email delivery (Resend) with hashed tokens
- [x] All API routes validate request body shape before DB writes
- [x] No raw SQL string interpolation — Prisma parameterized queries only
- [x] No hardcoded secrets or credentials in source code
- [x] All secrets loaded from environment variables
- [x] `.env.example` documents every required and optional variable
- [x] Session cookies are `httpOnly`, `Secure` in production, and `SameSite=Lax`
- [x] Admin MFA enforced via TOTP; sessionVersion incremented on password reset to invalidate old sessions

---

## Required Environment Variables

- [x] `NEXT_PUBLIC_SITE_URL`
- [x] `DATABASE_URL`
- [x] `SERPER_API_KEY`
- [x] `AUTH_SESSION_SECRET`
- [x] `AUTH_RESET_TOKEN_SECRET`
- [x] `AUTH_ADMIN_EMAIL`
- [x] `AUTH_ADMIN_PASSWORD_HASH`
- [x] `STRIPE_SECRET_KEY`
- [x] `STRIPE_WEBHOOK_SECRET`
- [x] `STRIPE_EDITOR_PRICE_ID`
- [x] `STRIPE_EDITORIAL_PRICE_ID`
- [x] `STRIPE_SYNDICATE_PRICE_ID`
- [x] `RESEND_API_KEY`
- [x] `AUTH_RESET_EMAIL_FROM`
- [x] `NODE_ENV=production`

## Optional Environment Variables

- [ ] `AUTH_ADMIN_TOTP_SECRET` — **MUST be set in production** to enforce admin MFA
- [ ] `NEXT_PUBLIC_GTM_ID` — when unset, GTM script, noscript iframe, and all `track*` helpers are inert
- [ ] `SENTRY_DSN` — error reporting (not yet integrated)
- [ ] `CACHE_DEBUG_ROUTE_ENABLED` — defaults to `false`
- [ ] `CACHE_OBSERVABILITY_LOG_PATH` — defaults to `null`

---

## Must Verify in Deployed Environment

- [ ] Resend can actually deliver password reset mail from the configured sender
- [ ] Stripe webhook endpoint receives real signed deliveries from the live Stripe project
- [ ] Stripe checkout redirects correctly with live price IDs
- [ ] Stripe billing portal opens for a provisioned customer
- [ ] Shared rate limiting behaves correctly across multiple app instances against the production database
- [ ] Admin MFA login works with the real configured TOTP secret
- [ ] With `NEXT_PUBLIC_GTM_ID` set, GA4 DebugView shows `page_view` on route changes
- [ ] In GA4 → Admin → Data Streams → Web stream → Enhanced Measurement, **disable "Page changes based on browser history events"**
- [ ] In GTM, confirm tags are gated by built-in consent (analytics_storage / ad_storage)

---

## Post-Audit Recommendations (Deferred to Next Cycle)

- [ ] Upgrade `postcss` devDependency when Next.js patch is available (moderate severity: CSS stringify XSS)
- [ ] Integrate `@sentry/nextjs` with `SENTRY_DSN` for production error reporting
- [ ] Run `npm run test:e2e` against the deployed preview URL before enabling public access
- [ ] Add observability alert if 429 response rate spikes on auth endpoints
- [ ] Review legal copy, support contact path, and any required DPA/subprocessor disclosures before public launch
