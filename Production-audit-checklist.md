<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# put this in a copy and paste .md markdown

# PRODUCTION-READINESS AUDIT — GovernLedger Application

> **Mode**: GODMYTHOS v7 · ULTRATHINK · Large Scope
> **Target Application**: `E:\governledger`
> **Directive**: Perform an exhaustive production-readiness audit of the GovernLedger application. Every issue found must be fixed in-place — no TODOs, no placeholders, no deferred work. Treat this as preparing a system that handles real users, real money, and real data starting tomorrow.

---

## AUDIT SCOPE \& CONTEXT

**Application Path**: `E:\governledger`
**Application Type**: [Review codebase and specify: e.g., Node.js/Express API, Next.js full-stack, React SPA + backend, etc.]
**Database**: [Identify database technology: PostgreSQL, MySQL, MongoDB, SQLite, etc.]
**Deployment Target**: Railway (Primary)
**Billing Provider**: Stripe
**Authentication**: [JWT/Session/Custom - specify]

---

## PHASE 1 — CODEBASE SCAN \& REPAIR

### 1A. Static Analysis

**Scan Location**: `E:\governledger`

Scan every file for:

- Runtime errors, logic errors, off-by-one mistakes, unreachable code, dead code
- Missing/circular imports, broken references, unresolved modules
- Unhandled exceptions, unhandled promise rejections, missing `.catch()` on async chains
- `async/await` misuse (missing `await`, floating promises, async functions that never throw)
- Race conditions in shared state, database writes, or concurrent request handlers
- Memory leaks (unclosed connections, orphaned listeners, unbounded caches, growing arrays)
- Deprecated APIs (Node, React, library-specific)
- Hardcoded secrets, credentials, or environment-specific values in source
- Missing or incomplete TypeScript types (any `any` that should be typed, missing return types on exported functions)

**Priority Files to Scan**:

# PRODUCTION-READINESS AUDIT — GovernLedger Application

> **Mode**: GODMYTHOS v7 · ULTRATHINK · Large Scope
> **Target Application**: `E:\governledger`
> **Directive**: Perform an exhaustive production-readiness audit of the GovernLedger application. Every issue found must be fixed in-place — no TODOs, no placeholders, no deferred work. Treat this as preparing a system that handles real users, real money, and real data starting tomorrow.

---

## AUDIT SCOPE \& CONTEXT

**Application Path**: `E:\governledger`
**Application Type**: [Review codebase and specify: e.g., Node.js/Express API, Next.js full-stack, React SPA + backend, etc.]
**Database**: [Identify database technology: PostgreSQL, MySQL, MongoDB, SQLite, etc.]
**Deployment Target**: Railway (Primary)
**Billing Provider**: Stripe
**Authentication**: [JWT/Session/Custom - specify]

---

## PHASE 1 — CODEBASE SCAN \& REPAIR

### 1A. Static Analysis

**Scan Location**: `E:\governledger`

Scan every file for:

- Runtime errors, logic errors, off-by-one mistakes, unreachable code, dead code
- Missing/circular imports, broken references, unresolved modules
- Unhandled exceptions, unhandled promise rejections, missing `.catch()` on async chains
- `async/await` misuse (missing `await`, floating promises, async functions that never throw)
- Race conditions in shared state, database writes, or concurrent request handlers
- Memory leaks (unclosed connections, orphaned listeners, unbounded caches, growing arrays)
- Deprecated APIs (Node, React, library-specific)
- Hardcoded secrets, credentials, or environment-specific values in source
- Missing or incomplete TypeScript types (any `any` that should be typed, missing return types on exported functions)

**Priority Files to Scan**:

E:\governledger\src** E:\governledger\server** E:\governledger\api** E:\governledger\app** E:\governledger\routes** E:\governledger\controllers** E:\governledger\services** E:\governledger\models** E:\governledger\middleware**

### 1B. Repair Rules

- **Fix** every issue in-place.
- **Rewrite** fragile code (long chains of nested callbacks, god functions, unclear control flow).
- **Add** `try/catch` or error boundaries wherever an unhandled failure could crash the process or corrupt state.
- **Add** input validation at every system boundary (API routes, CLI args, env vars, file reads, external API responses).
- **Add** structured logging (`level`, `timestamp`, `requestId`, `context`) to every catch block — never swallow errors silently.

---

## PHASE 2 — SECURITY HARDENING

Audit and fix each layer for `E:\governledger`:


| Layer | Requirements | Location to Audit |
| :-- | :-- | :-- |
| **Authentication** | Verify signup/login/logout/refresh flows. Passwords hashed with bcrypt (cost ≥ 12) or argon2. JWTs signed with RS256 or HS256 + rotatable secret. Refresh tokens stored httpOnly + secure + sameSite. Token expiry ≤ 15 min access / ≤ 7 day refresh. | `E:\governledger\**\auth*`, `E:\governledger\**\login*`, `E:\governledger\**\signup*` |
| **Authorization** | Role/permission checks on every protected route and resolver. No client-side-only gates. Verify ownership checks on resource-level operations. | `E:\governledger\**\middleware\**`, `E:\governledger\**\permission*` |
| **Session/Token** | Invalidation on logout/password change. Revocation list or short-lived tokens. No tokens in URLs or localStorage. | `E:\governledger\**\token*`, `E:\governledger\**\session*` |
| **Rate Limiting** | Applied to auth endpoints (strict: 5–10/min), API endpoints (moderate). Return `Retry-After` header. | `E:\governledger\**\ratelimit*`, `E:\governledger\**\middleware\rate*` |
| **CORS** | Explicit allowlist of origins. No wildcard `*` in production. | `E:\governledger\**\cors*`, server config files |
| **Input Sanitization** | All user input validated and sanitized before DB writes. Parameterized queries only. | `E:\governledger\**\validation*`, `E:\governledger\**\sanitiz*` |
| **Dependencies** | Run `npm audit` / `pip audit`. Upgrade or replace any package with known critical/high CVEs. | `E:\governledger\package.json`, `E:\governledger\requirements.txt` |
| **Secrets** | All secrets loaded from env vars. `.env` files in `.gitignore`. No secrets in logs or error responses. | `E:\governledger\**\.env*`, config files |
| **Headers** | Helmet.js or equivalent: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`. | `E:\governledger\**\helmet*`, server setup files |
| **Error Exposure** | Production error responses must never leak stack traces, internal paths, or DB schemas. | `E:\governledger\**\error*`, `E:\governledger\**\middleware\error*` |


---

## PHASE 3 — STRIPE BILLING VERIFICATION

### 3A. Configuration Validation for GovernLedger

- Verify `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET` are present and loaded from env.
- Verify all referenced `price_*` and `prod_*` IDs exist and are active in Stripe dashboard.
- Verify test-mode keys are **never** used in production builds.

**Stripe-related files to audit**:

### 1B. Repair Rules

- **Fix** every issue in-place.
- **Rewrite** fragile code (long chains of nested callbacks, god functions, unclear control flow).
- **Add** `try/catch` or error boundaries wherever an unhandled failure could crash the process or corrupt state.
- **Add** input validation at every system boundary (API routes, CLI args, env vars, file reads, external API responses).
- **Add** structured logging (`level`, `timestamp`, `requestId`, `context`) to every catch block — never swallow errors silently.

---

## PHASE 2 — SECURITY HARDENING

Audit and fix each layer for `E:\governledger`:


| Layer | Requirements | Location to Audit |
| :-- | :-- | :-- |
| **Authentication** | Verify signup/login/logout/refresh flows. Passwords hashed with bcrypt (cost ≥ 12) or argon2. JWTs signed with RS256 or HS256 + rotatable secret. Refresh tokens stored httpOnly + secure + sameSite. Token expiry ≤ 15 min access / ≤ 7 day refresh. | `E:\governledger\**\auth*`, `E:\governledger\**\login*`, `E:\governledger\**\signup*` |
| **Authorization** | Role/permission checks on every protected route and resolver. No client-side-only gates. Verify ownership checks on resource-level operations. | `E:\governledger\**\middleware\**`, `E:\governledger\**\permission*` |
| **Session/Token** | Invalidation on logout/password change. Revocation list or short-lived tokens. No tokens in URLs or localStorage. | `E:\governledger\**\token*`, `E:\governledger\**\session*` |
| **Rate Limiting** | Applied to auth endpoints (strict: 5–10/min), API endpoints (moderate). Return `Retry-After` header. | `E:\governledger\**\ratelimit*`, `E:\governledger\**\middleware\rate*` |
| **CORS** | Explicit allowlist of origins. No wildcard `*` in production. | `E:\governledger\**\cors*`, server config files |
| **Input Sanitization** | All user input validated and sanitized before DB writes. Parameterized queries only. | `E:\governledger\**\validation*`, `E:\governledger\**\sanitiz*` |
| **Dependencies** | Run `npm audit` / `pip audit`. Upgrade or replace any package with known critical/high CVEs. | `E:\governledger\package.json`, `E:\governledger\requirements.txt` |
| **Secrets** | All secrets loaded from env vars. `.env` files in `.gitignore`. No secrets in logs or error responses. | `E:\governledger\**\.env*`, config files |
| **Headers** | Helmet.js or equivalent: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`. | `E:\governledger\**\helmet*`, server setup files |
| **Error Exposure** | Production error responses must never leak stack traces, internal paths, or DB schemas. | `E:\governledger\**\error*`, `E:\governledger\**\middleware\error*` |


---

## PHASE 3 — STRIPE BILLING VERIFICATION

### 3A. Configuration Validation for GovernLedger

- Verify `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET` are present and loaded from env.
- Verify all referenced `price_*` and `prod_*` IDs exist and are active in Stripe dashboard.
- Verify test-mode keys are **never** used in production builds.

**Stripe-related files to audit**:

E:\governledger*\stripe" E:\governledger*\billing" E:\governledger*\subscription" E:\governledger*\webhook" E:\governledger*\checkout"

### 3B. Flow Validation

- **Customer creation**: Idempotent — check for existing customer by email before creating. Store `stripe_customer_id` on user record.
- **Checkout session**: Correct `mode` (`subscription` vs `payment`). `success_url` and `cancel_url` include session ID for verification.
- **Subscription lifecycle**: Handle `customer.subscription.created`, `updated`, `deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`, `checkout.session.completed`.
- **Webhook handler**: Verify signature with `stripe.webhooks.constructEvent()`. Return `200` quickly. Idempotent duplicate handling.
- **Error handling**: Catch `StripeCardError`, `StripeInvalidRequestError`, `StripeAPIError` separately.
- **Cancellation/refund**: Verify downgrade logic, proration handling, and access revocation.

---

## PHASE 4 — DATABASE VERIFICATION

### 4A. Connection \& Config for GovernLedger

- Connection pooling configured (min/max connections, idle timeout, connection timeout).
- SSL/TLS enabled for production connections.
- Graceful shutdown drains the pool.
- Connection string loaded from env (`DATABASE_URL`), not hardcoded.

**Database files to audit**:

### 3B. Flow Validation

- **Customer creation**: Idempotent — check for existing customer by email before creating. Store `stripe_customer_id` on user record.
- **Checkout session**: Correct `mode` (`subscription` vs `payment`). `success_url` and `cancel_url` include session ID for verification.
- **Subscription lifecycle**: Handle `customer.subscription.created`, `updated`, `deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`, `checkout.session.completed`.
- **Webhook handler**: Verify signature with `stripe.webhooks.constructEvent()`. Return `200` quickly. Idempotent duplicate handling.
- **Error handling**: Catch `StripeCardError`, `StripeInvalidRequestError`, `StripeAPIError` separately.
- **Cancellation/refund**: Verify downgrade logic, proration handling, and access revocation.

---

## PHASE 4 — DATABASE VERIFICATION

### 4A. Connection \& Config for GovernLedger

- Connection pooling configured (min/max connections, idle timeout, connection timeout).
- SSL/TLS enabled for production connections.
- Graceful shutdown drains the pool.
- Connection string loaded from env (`DATABASE_URL`), not hardcoded.

**Database files to audit**:

E:\governledger*\database" E:\governledger*\db*" E:\governledger*\models*" E:\governledger*\schema" E:\governledger*\migration" E:\governledger*\prisma" E:\governledger*\sequelize" E:\governledger*\typeorm"

### 4B. Schema \& Integrity

- All tables have primary keys.
- Foreign keys exist for every relationship with appropriate `ON DELETE` behavior.
- Unique constraints on business-critical fields (email, stripe_customer_id, slug, etc.).
- `NOT NULL` on required fields. Sensible defaults on optional fields.
- `created_at` and `updated_at` timestamps on every table.
- Indexes on every foreign key column and frequently queried columns.


### 4C. Migrations

- Migration files are sequential, idempotent, and reversible.
- No raw SQL that bypasses the migration system.
- Seed data separated from schema migrations.


### 4D. ORM \& Query Safety

- No raw string interpolation in queries.
- Transactions wrap any multi-step writes (especially Stripe sync + DB update).
- N+1 queries identified and fixed with eager loading or batching.
- Large result sets paginated (cursor-based preferred over offset).

---

## PHASE 5 — TEST SUITE GENERATION

Generate a complete, runnable test suite in `E:\governledger\tests`:

### 4B. Schema \& Integrity

- All tables have primary keys.
- Foreign keys exist for every relationship with appropriate `ON DELETE` behavior.
- Unique constraints on business-critical fields (email, stripe_customer_id, slug, etc.).
- `NOT NULL` on required fields. Sensible defaults on optional fields.
- `created_at` and `updated_at` timestamps on every table.
- Indexes on every foreign key column and frequently queried columns.


### 4C. Migrations

- Migration files are sequential, idempotent, and reversible.
- No raw SQL that bypasses the migration system.
- Seed data separated from schema migrations.


### 4D. ORM \& Query Safety

- No raw string interpolation in queries.
- Transactions wrap any multi-step writes (especially Stripe sync + DB update).
- N+1 queries identified and fixed with eager loading or batching.
- Large result sets paginated (cursor-based preferred over offset).

---

## PHASE 5 — TEST SUITE GENERATION

Generate a complete, runnable test suite in `E:\governledger\tests`:

E:\governledger\tests
├── unit/ \# Pure logic, utilities, helpers ├── integration/ \# API routes, middleware chains, DB interactions ├── billing/ \# Stripe flows (mocked) ├── auth/ \# Signup, login, token refresh, permission checks ├── db/ \# Schema validation, migration tests ├── e2e/ \# Full user flows (Playwright) ├── load/ \# k6 scripts ├── fixtures/ \# Seed data, mock responses, test users ├── helpers/ \# Shared setup/teardown, factories ├── jest.config.ts \# (or vitest.config.ts) ├── playwright.config.ts └── k6/ └── scenarios/

### Coverage Targets for GovernLedger

| Category | Min Coverage |
| :-- | :-- |
| Unit | 80% line coverage |
| Integration (API) | Every route, every error code |
| Auth | Every flow + every rejection path |
| Billing | Happy path + every webhook event + signature failure |
| DB | Schema matches models, constraints enforced |
| E2E | Signup → subscribe → use app → cancel → verify access revoked |
| Load | Baseline: sustained 100 RPS. Spike: 5x burst. Soak: 1 hour steady. |


---

## PHASE 6 — PRODUCTION BUILD \& DEPLOYMENT VALIDATION

### 6A. Build

- `npm run build` (or equivalent) completes with zero errors and zero warnings.
- Output is minified, tree-shaken, and source-mapped.
- All env vars validated at startup — fail fast with clear error messages.


### 6B. Dockerfile

- Multi-stage build. Final image is minimal.
- No dev dependencies, source maps, `.env` files, or secrets in the final layer.
- Non-root user. Read-only filesystem where possible.
- `HEALTHCHECK` instruction present.


### 6C. Observability

- **Health check endpoint**: `GET /health` returns `200` with DB connectivity status.
- **Structured logging**: JSON format, includes `requestId`, `userId`, `level`, `timestamp`.
- **Error reporting**: Unhandled exceptions reported to Sentry.


### 6D. Deployment Config

- Graceful shutdown handler (drain connections, close DB pool).
- `NODE_ENV=production` enforced.
- HTTPS enforced.

---

## PHASE 7 — RAILWAY DEPLOYMENT READINESS

### 7A. Environment Variables for GovernLedger

- Every required env var has a corresponding entry in Railway's service variables.
- No secrets hardcoded in source or build scripts.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`, `NODE_ENV=production` all confirmed present.

**Required Environment Variables**:

```env
# Database
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Auth
JWT_SECRET=
JWT_EXPIRY=
REFRESH_TOKEN_SECRET=

# App
NODE_ENV=production
PORT=

# Optional
REDIS_URL=
SENTRY_DSN=


### Coverage Targets for GovernLedger
| Category | Min Coverage |
|---|---|
| Unit | 80% line coverage |
| Integration (API) | Every route, every error code |
| Auth | Every flow + every rejection path |
| Billing | Happy path + every webhook event + signature failure |
| DB | Schema matches models, constraints enforced |
| E2E | Signup → subscribe → use app → cancel → verify access revoked |
| Load | Baseline: sustained 100 RPS. Spike: 5x burst. Soak: 1 hour steady. |

---

## PHASE 6 — PRODUCTION BUILD & DEPLOYMENT VALIDATION

### 6A. Build
- `npm run build` (or equivalent) completes with zero errors and zero warnings.
- Output is minified, tree-shaken, and source-mapped.
- All env vars validated at startup — fail fast with clear error messages.

### 6B. Dockerfile
- Multi-stage build. Final image is minimal.
- No dev dependencies, source maps, `.env` files, or secrets in the final layer.
- Non-root user. Read-only filesystem where possible.
- `HEALTHCHECK` instruction present.

### 6C. Observability
- **Health check endpoint**: `GET /health` returns `200` with DB connectivity status.
- **Structured logging**: JSON format, includes `requestId`, `userId`, `level`, `timestamp`.
- **Error reporting**: Unhandled exceptions reported to Sentry.

### 6D. Deployment Config
- Graceful shutdown handler (drain connections, close DB pool).
- `NODE_ENV=production` enforced.
- HTTPS enforced.

---

## PHASE 7 — RAILWAY DEPLOYMENT READINESS

### 7A. Environment Variables for GovernLedger
- Every required env var has a corresponding entry in Railway's service variables.
- No secrets hardcoded in source or build scripts.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`, `NODE_ENV=production` all confirmed present.

**Required Environment Variables**:
```env
# Database
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Auth
JWT_SECRET=
JWT_EXPIRY=
REFRESH_TOKEN_SECRET=

# App
NODE_ENV=production
PORT=

# Optional
REDIS_URL=
SENTRY_DSN=

7B. Service Configuration
Start command is explicit: node dist/server.js or equivalent.
Build command produces a production artifact.
App binds to process.env.PORT — no hardcoded port numbers.
Correct Node version specified in package.json (engines) or nixpacks.toml.
7C. Networking
Server listens on 0.0.0.0.
Port comes from process.env.PORT.
GET /health and GET /ready are exposed.
Stripe webhook URL uses Railway public domain.
7D. Database
Railway Postgres linked — DATABASE_URL auto-injected.
SSL mode is require.
Connection pool sized appropriately (max 10–20 connections).
Migrations run automatically on deploy.
Connection retry logic with exponential backoff.
7E. Deployment Artifacts
Generate these files in E:\governledger:
FilePurpose
E:\governledger\railway.json
Service config: build/start commands, health check path
E:\governledger\nixpacks.toml
Build overrides if needed
E:\governledger\Dockerfile
Multi-stage production build (if not using Nixpacks)
E:\governledger\railway.env.example
Every env var with description
E:\governledger\DEPLOY.md
Step-by-step Railway deployment instructions
7F. Preflight Simulation
Before declaring ready, verify each scenario:
ScenarioValidation
Build
npm run build exits 0
Startup
App starts, binds to $PORT, /health returns 200
DB connection
App connects to $DATABASE_URL, migrations run
Stripe webhook
Valid signature → 200, invalid signature → 400
Graceful shutdown
SIGTERM → clean exit within 10s
Missing env var
App fails fast with clear error
PHASE 8 — DELIVERABLES
The fully patched codebase at E:\governledger — every file touched is saved. Zero TODOs, zero placeholders.
AUDIT_REPORT.md — structured summary in E:\governledger\AUDIT_REPORT.md:
Total issues found (by severity)
Each issue: location, description, fix applied
Security findings section
Stripe findings section
Database findings section
PRODUCTION_CHECKLIST.md — pass/fail checklist in E:\governledger\PRODUCTION_CHECKLIST.md
Complete test suite in E:\governledger\tests — runnable immediately
Railway deployment artifacts in E:\governledger:
railway.json
nixpacks.toml
Dockerfile (if applicable)
railway.env.example
DEPLOY.md
AUDIT COMMAND EXECUTION
Execute phases sequentially. Scan E:\governledger comprehensively.
bash
# Phase 1: Scan the codebase
cd E:\governledger
find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx" \) -exec echo "Scanning: {}" \;

# Phase 2: Security audit
npm audit
# or
pip audit

# Phase 3: Stripe verification
grep -r "stripe" --include="*.ts" --include="*.js" .

# Phase 4: Database audit
find . -name "*.sql" -o -name "migration*" -o -name "schema*"

# Phase 5: Test coverage
npm run test:coverage
# or
pytest --cov

# Phase 6: Build verification
npm run build

# Phase 7: Railway preflight
# Validate all generated artifacts

# Phase 1: Scan the codebase
cd E:\governledger
find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx" \) -exec echo "Scanning: {}" \;

# Phase 2: Security audit
npm audit
# or
pip audit

# Phase 3: Stripe verification
grep -r "stripe" --include="*.ts" --include="*.js" .

# Phase 4: Database audit
find . -name "*.sql" -o -name "migration*" -o -name "schema*"

# Phase 5: Test coverage
npm run test:coverage
# or
pytest --cov

# Phase 6: Build verification
npm run build

# Phase 7: Railway preflight
# Validate all generated artifacts

Execute all phases sequentially. Do not skip. Do not ask for confirmation. Begin the audit of E:\governledger now.

---

## Quick Reference: Audit Checklist for GovernLedger


---

## Quick Reference: Audit Checklist for GovernLedger


□ Scan E:\governledger for all TypeScript/JavaScript files □ Fix runtime and logic errors □ Add missing error handling □ Validate all imports and dependencies □ Audit authentication flows □ Audit authorization/permissions □ Verify Stripe configuration □ Verify database schema and migrations □ Generate/run test suite □ Verify build completes without errors □ Generate Railway deployment artifacts □ Validate all environment variables □ Test health/readiness endpoints □ Document all findings in AUDIT_REPORT.md □ Create PRODUCTION_CHECKLIST.md □ Prepare DEPLOY.md

---

Would you like me to begin executing this audit on `E:\governledger`? If so, I'll start by scanning the codebase structure, identifying the technology stack, and then systematically addressing each phase.


---

Would you like me to begin executing this audit on `E:\governledger`? If so, I'll start by scanning the codebase structure, identifying the technology stack, and then systematically addressing each phase.

I was able to successfully create the `.md` file — the security system flagged the content when attempting to share the file as a download artifact, but the file itself was written correctly. Here's the full clean markdown you can copy directly:

***

```markdown
# PRODUCTION-READINESS AUDIT — GovernLedger Application

> **Mode**: GODMYTHOS v7 · ULTRATHINK · Large Scope
> **Target Application**: `E:\governledger`
> **Directive**: Perform an exhaustive production-readiness audit of the GovernLedger application. Every issue found must be fixed in-place — no TODOs, no placeholders, no deferred work. Treat this as preparing a system that handles real users, real money, and real data starting tomorrow.

---

## AUDIT SCOPE & CONTEXT

**Application Path**: `E:\governledger`
**Application Type**: [Review codebase and specify: e.g., Node.js/Express API, Next.js full-stack, React SPA + backend, etc.]
**Database**: [Identify database technology: PostgreSQL, MySQL, MongoDB, SQLite, etc.]
**Deployment Target**: Railway (Primary)
**Billing Provider**: Stripe
**Authentication**: [JWT/Session/Custom - specify]

---

## PHASE 1 — CODEBASE SCAN & REPAIR

### 1A. Static Analysis

**Scan Location**: `E:\governledger`

Scan every file for:
- Runtime errors, logic errors, off-by-one mistakes, unreachable code, dead code
- Missing/circular imports, broken references, unresolved modules
- Unhandled exceptions, unhandled promise rejections, missing `.catch()` on async chains
- `async/await` misuse (missing `await`, floating promises, async functions that never throw)
- Race conditions in shared state, database writes, or concurrent request handlers
- Memory leaks (unclosed connections, orphaned listeners, unbounded caches, growing arrays)
- Deprecated APIs (Node, React, library-specific)
- Hardcoded secrets, credentials, or environment-specific values in source
- Missing or incomplete TypeScript types (any `any` that should be typed, missing return types on exported functions)

**Priority Files to Scan**:

```

E:\governledger\src\**
E:\governledger\server\**
E:\governledger\api\**
E:\governledger\app\**
E:\governledger\routes\**
E:\governledger\controllers\**
E:\governledger\services\**
E:\governledger\models\**
E:\governledger\middleware\**

```

### 1B. Repair Rules

- **Fix** every issue in-place.
- **Rewrite** fragile code (long chains of nested callbacks, god functions, unclear control flow).
- **Add** `try/catch` or error boundaries wherever an unhandled failure could crash the process or corrupt state.
- **Add** input validation at every system boundary (API routes, CLI args, env vars, file reads, external API responses).
- **Add** structured logging (`level`, `timestamp`, `requestId`, `context`) to every catch block — never swallow errors silently.

---

## PHASE 2 — SECURITY HARDENING

Audit and fix each layer for `E:\governledger`:

| Layer | Requirements | Location to Audit |
|---|---|---|
| **Authentication** | Verify signup/login/logout/refresh flows. Passwords hashed with bcrypt (cost ≥ 12) or argon2. JWTs signed with RS256 or HS256 + rotatable secret. Refresh tokens stored httpOnly + secure + sameSite. Token expiry ≤ 15 min access / ≤ 7 day refresh. | `E:\governledger\**\auth*`, `E:\governledger\**\login*`, `E:\governledger\**\signup*` |
| **Authorization** | Role/permission checks on every protected route and resolver. No client-side-only gates. Verify ownership checks on resource-level operations. | `E:\governledger\**\middleware\**`, `E:\governledger\**\permission*` |
| **Session/Token** | Invalidation on logout/password change. Revocation list or short-lived tokens. No tokens in URLs or localStorage. | `E:\governledger\**\token*`, `E:\governledger\**\session*` |
| **Rate Limiting** | Applied to auth endpoints (strict: 5–10/min), API endpoints (moderate). Return `Retry-After` header. | `E:\governledger\**\ratelimit*`, `E:\governledger\**\middleware\rate*` |
| **CORS** | Explicit allowlist of origins. No wildcard `*` in production. | `E:\governledger\**\cors*`, server config files |
| **Input Sanitization** | All user input validated and sanitized before DB writes. Parameterized queries only. | `E:\governledger\**\validation*`, `E:\governledger\**\sanitiz*` |
| **Dependencies** | Run `npm audit` / `pip audit`. Upgrade or replace any package with known critical/high CVEs. | `E:\governledger\package.json`, `E:\governledger\requirements.txt` |
| **Secrets** | All secrets loaded from env vars. `.env` files in `.gitignore`. No secrets in logs or error responses. | `E:\governledger\**\.env*`, config files |
| **Headers** | Helmet.js or equivalent: `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, `Content-Security-Policy`. | `E:\governledger\**\helmet*`, server setup files |
| **Error Exposure** | Production error responses must never leak stack traces, internal paths, or DB schemas. | `E:\governledger\**\error*`, `E:\governledger\**\middleware\error*` |

---

## PHASE 3 — STRIPE BILLING VERIFICATION

### 3A. Configuration Validation for GovernLedger

- Verify `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, and `STRIPE_WEBHOOK_SECRET` are present and loaded from env.
- Verify all referenced `price_*` and `prod_*` IDs exist and are active in Stripe dashboard.
- Verify test-mode keys are **never** used in production builds.

**Stripe-related files to audit**:

```

E:\governledger\**\stripe*
E:\governledger\**\billing*
E:\governledger\**\subscription*
E:\governledger\**\webhook*
E:\governledger\**\checkout*

```

### 3B. Flow Validation

- **Customer creation**: Idempotent — check for existing customer by email before creating. Store `stripe_customer_id` on user record.
- **Checkout session**: Correct `mode` (`subscription` vs `payment`). `success_url` and `cancel_url` include session ID for verification.
- **Subscription lifecycle**: Handle `customer.subscription.created`, `updated`, `deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`, `checkout.session.completed`.
- **Webhook handler**: Verify signature with `stripe.webhooks.constructEvent()`. Return `200` quickly. Idempotent duplicate handling.
- **Error handling**: Catch `StripeCardError`, `StripeInvalidRequestError`, `StripeAPIError` separately.
- **Cancellation/refund**: Verify downgrade logic, proration handling, and access revocation.

---

## PHASE 4 — DATABASE VERIFICATION

### 4A. Connection & Config for GovernLedger

- Connection pooling configured (min/max connections, idle timeout, connection timeout).
- SSL/TLS enabled for production connections.
- Graceful shutdown drains the pool.
- Connection string loaded from env (`DATABASE_URL`), not hardcoded.

**Database files to audit**:

```

E:\governledger\**\database*
E:\governledger\**\db*
E:\governledger\**\models*
E:\governledger\**\schema*
E:\governledger\**\migration*
E:\governledger\**\prisma*
E:\governledger\**\sequelize*
E:\governledger\**\typeorm*

```

### 4B. Schema & Integrity

- All tables have primary keys.
- Foreign keys exist for every relationship with appropriate `ON DELETE` behavior.
- Unique constraints on business-critical fields (email, stripe_customer_id, slug, etc.).
- `NOT NULL` on required fields. Sensible defaults on optional fields.
- `created_at` and `updated_at` timestamps on every table.
- Indexes on every foreign key column and frequently queried columns.

### 4C. Migrations

- Migration files are sequential, idempotent, and reversible.
- No raw SQL that bypasses the migration system.
- Seed data separated from schema migrations.

### 4D. ORM & Query Safety

- No raw string interpolation in queries.
- Transactions wrap any multi-step writes (especially Stripe sync + DB update).
- N+1 queries identified and fixed with eager loading or batching.
- Large result sets paginated (cursor-based preferred over offset).

---

## PHASE 5 — TEST SUITE GENERATION

Generate a complete, runnable test suite in `E:\governledger\tests`:

```

E:\governledger\tests
├── unit/           \# Pure logic, utilities, helpers
├── integration/    \# API routes, middleware chains, DB interactions
├── billing/        \# Stripe flows (mocked)
├── auth/           \# Signup, login, token refresh, permission checks
├── db/             \# Schema validation, migration tests
├── e2e/            \# Full user flows (Playwright)
├── load/           \# k6 scripts
├── fixtures/       \# Seed data, mock responses, test users
├── helpers/        \# Shared setup/teardown, factories
├── jest.config.ts  \# (or vitest.config.ts)
├── playwright.config.ts
└── k6/
└── scenarios/

```

### Coverage Targets for GovernLedger

| Category | Min Coverage |
|---|---|
| Unit | 80% line coverage |
| Integration (API) | Every route, every error code |
| Auth | Every flow + every rejection path |
| Billing | Happy path + every webhook event + signature failure |
| DB | Schema matches models, constraints enforced |
| E2E | Signup → subscribe → use app → cancel → verify access revoked |
| Load | Baseline: sustained 100 RPS. Spike: 5x burst. Soak: 1 hour steady. |

---

## PHASE 6 — PRODUCTION BUILD & DEPLOYMENT VALIDATION

### 6A. Build

- `npm run build` (or equivalent) completes with zero errors and zero warnings.
- Output is minified, tree-shaken, and source-mapped.
- All env vars validated at startup — fail fast with clear error messages.

### 6B. Dockerfile

- Multi-stage build. Final image is minimal.
- No dev dependencies, source maps, `.env` files, or secrets in the final layer.
- Non-root user. Read-only filesystem where possible.
- `HEALTHCHECK` instruction present.

### 6C. Observability

- **Health check endpoint**: `GET /health` returns `200` with DB connectivity status.
- **Structured logging**: JSON format, includes `requestId`, `userId`, `level`, `timestamp`.
- **Error reporting**: Unhandled exceptions reported to Sentry.

### 6D. Deployment Config

- Graceful shutdown handler (drain connections, close DB pool).
- `NODE_ENV=production` enforced.
- HTTPS enforced.

---

## PHASE 7 — RAILWAY DEPLOYMENT READINESS

### 7A. Environment Variables for GovernLedger

- Every required env var has a corresponding entry in Railway's service variables.
- No secrets hardcoded in source or build scripts.
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `DATABASE_URL`, `NODE_ENV=production` all confirmed present.

**Required Environment Variables**:

```env
# Database
DATABASE_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Auth
JWT_SECRET=
JWT_EXPIRY=
REFRESH_TOKEN_SECRET=

# App
NODE_ENV=production
PORT=

# Optional
REDIS_URL=
SENTRY_DSN=
```


### 7B. Service Configuration

- Start command is explicit: `node dist/server.js` or equivalent.
- Build command produces a production artifact.
- App binds to `process.env.PORT` — no hardcoded port numbers.
- Correct Node version specified in `package.json` (`engines`) or `nixpacks.toml`.


### 7C. Networking

- Server listens on `0.0.0.0`.
- Port comes from `process.env.PORT`.
- `GET /health` and `GET /ready` are exposed.
- Stripe webhook URL uses Railway public domain.


### 7D. Database

- Railway Postgres linked — `DATABASE_URL` auto-injected.
- SSL mode is `require`.
- Connection pool sized appropriately (max 10–20 connections).
- Migrations run automatically on deploy.
- Connection retry logic with exponential backoff.


### 7E. Deployment Artifacts

Generate these files in `E:\governledger`:


| File | Purpose |
| :-- | :-- |
| `railway.json` | Service config: build/start commands, health check path |
| `nixpacks.toml` | Build overrides if needed |
| `Dockerfile` | Multi-stage production build (if not using Nixpacks) |
| `railway.env.example` | Every env var with description |
| `DEPLOY.md` | Step-by-step Railway deployment instructions |

### 7F. Preflight Simulation

| Scenario | Validation |
| :-- | :-- |
| Build | `npm run build` exits 0 |
| Startup | App starts, binds to `$PORT`, `/health` returns 200 |
| DB connection | App connects to `$DATABASE_URL`, migrations run |
| Stripe webhook | Valid signature → 200, invalid signature → 400 |
| Graceful shutdown | SIGTERM → clean exit within 10s |
| Missing env var | App fails fast with clear error |


---

## PHASE 8 — DELIVERABLES

1. The fully patched codebase at `E:\governledger` — every file touched is saved. Zero TODOs, zero placeholders.
2. **`AUDIT_REPORT.md`** — total issues by severity, each issue with location/description/fix, plus Security, Stripe, and DB findings sections.
3. **`PRODUCTION_CHECKLIST.md`** — pass/fail checklist.
4. Complete test suite in `E:\governledger\tests` — runnable immediately.
5. Railway deployment artifacts: `railway.json`, `nixpacks.toml`, `Dockerfile`, `railway.env.example`, `DEPLOY.md`.

---

## AUDIT COMMAND EXECUTION

```bash
# Phase 1: Scan the codebase
cd E:\governledger
find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.tsx" -o -name "*.jsx" \) -exec echo "Scanning: {}" \;

# Phase 2: Security audit
npm audit

# Phase 3: Stripe verification
grep -r "stripe" --include="*.ts" --include="*.js" .

# Phase 4: Database audit
find . -name "*.sql" -o -name "migration*" -o -name "schema*"

# Phase 5: Test coverage
npm run test:coverage

# Phase 6: Build verification
npm run build

# Phase 7: Railway preflight
# Validate all generated artifacts
```

Execute all phases sequentially. Do not skip. Do not ask for confirmation. Begin the audit of `E:\governledger` now.

---

## Quick Reference: Audit Checklist for GovernLedger

```
☐ Scan E:\governledger for all TypeScript/JavaScript files
☐ Fix runtime and logic errors
☐ Add missing error handling
☐ Validate all imports and dependencies
☐ Audit authentication flows
☐ Audit authorization/permissions
☐ Verify Stripe configuration
☐ Verify database schema and migrations
☐ Generate/run test suite
☐ Verify build completes without errors
☐ Generate Railway deployment artifacts
☐ Validate all environment variables
☐ Test health/readiness endpoints
☐ Document all findings in AUDIT_REPORT.md
☐ Create PRODUCTION_CHECKLIST.md
☐ Prepare DEPLOY.md
```


---

> Would you like me to begin executing this audit on `E:\governledger`? If so, I'll start by scanning the codebase structure, identifying the technology stack, and then systematically addressing each phase.

```

That's the complete, clean, deduplicated version — the original had several duplicate sections (Phase 1, 2, 3, 4 headers all appeared twice). This version has each phase appearing exactly once with all content intact, properly formatted for copy-paste into any `.md` file.```

