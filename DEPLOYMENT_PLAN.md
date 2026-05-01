# SEO AI Regent — Railway Deployment Plan
## Generated: 2026-04-30

---

## Phase 1: Pre-Flight Checklist ✅

### Codebase Status
- [x] Repo: `cousined1/seo-ai-regent` 
- [x] Framework: Next.js 15 + Prisma + PostgreSQL
- [x] Build command: `prisma generate && next build`
- [x] Start command: `prisma migrate deploy && next start`
- [x] Health check: `/api/health`

### Stripe Configuration
- [x] Editor Plan: `price_1TRc4KKGNA0NaemqKR9rj4QA` ($49/mo)
- [x] Editorial Plan: `price_1TRc4KKGNA0NaemqPWpbsYWw` ($149/mo)
- [x] Syndicate Plan: `price_1TS6FoKGNA0NaemqhpwgcVAf` (Custom $0 placeholder — send custom invoices)
- [x] Needs: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET

### Insforge Integration
- [x] Insforge backend: `https://insforge-production-0d5a.up.railway.app`
- [x] Health: ✅ Operational
- [x] API Key: `ik_sehrni5g1w9ptlg52cx3sx32nlrvsgmz`

---

## Phase 2: Railway Infrastructure

### Step 1: Create Project
1. Go to https://railway.com/new
2. Select `cousined1/seo-ai-regent` from GitHub
3. Deploy initial build (will fail without env vars — expected)

### Step 2: Add PostgreSQL Database
1. In project dashboard → "New" → "Database" → "Add PostgreSQL"
2. Railway auto-generates `DATABASE_URL` and links to service
3. Verify connection in service Variables tab

### Step 3: Configure Environment Variables

**Required Core Variables:**
```
# Database (auto-populated by Railway PostgreSQL)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Stripe (from Edward's Stripe Dashboard)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_EDITOR_PRICE_ID=price_1TRc4KKGNA0NaemqKR9rj4QA
STRIPE_EDITORIAL_PRICE_ID=price_1TRc4KKGNA0NaemqPWpbsYWw
STRIPE_SYNDICATE_PRICE_ID=price_1TS6FoKGNA0NaemqhpwgcVAf

# Auth (generate with: openssl rand -hex 32)
AUTH_SESSION_SECRET=<generate>
AUTH_RESET_TOKEN_SECRET=<generate>

# App
NEXT_PUBLIC_SITE_URL=https://seoairegent.com
AUTH_RESET_EMAIL_FROM=hello@developer312.com

# Insforge Backend
INSFORGE_API_URL=https://insforge-production-0d5a.up.railway.app
INSFORGE_API_KEY=ik_sehrni5g1w9ptlg52cx3sx32nlrvsgmz
```

### Step 4: Domain Setup
1. Settings → Domains → Add `seoairegent.com`
2. Add `www.seoairegent.com` redirect
3. Configure Cloudflare DNS (if using Cloudflare)

---

## Phase 3: Database Initialization

### Prisma Migration
```bash
# Railway CLI (after deployment)
railway run -- npx prisma migrate deploy
```

### Verification
- Check `/api/health` returns 200
- Check database tables created via Railway PostgreSQL dashboard

---

## Phase 4: Stripe Webhook Configuration

1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://seoairegent.com/api/billing/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret
5. Set as `STRIPE_WEBHOOK_SECRET` in Railway
6. Redeploy

---

## Phase 5: Insforge Backend Integration

### Current Insforge Status
- Base URL: `https://insforge-production-0d5a.up.railway.app`
- Health: `/api/health` → `{"status":"ok","version":"2.0.0"}`
- Auth: `/api/auth/public-config` → Valid JSON config

### Integration Points
1. **Authentication**: Use Insforge's auth system for user management
2. **Database**: Connect to Insforge PostgreSQL or separate Railway PostgreSQL
3. **API Calls**: Use Insforge SDK for backend operations

### Decision Point
Option A: Use Railway-managed PostgreSQL (isolated, simple)
Option B: Connect to Insforge PostgreSQL (shared, complex)

**Recommendation: Option A** — Railway PostgreSQL is auto-managed, backed up, and simpler for SEO AI Regent's needs.

---

## Phase 6: Smoke Tests

### Critical Paths
1. `GET /api/health` → 200 OK
2. `GET /` → Landing page loads
3. `POST /api/auth/register` → User creation
4. `POST /api/billing/checkout` → Stripe checkout session
5. Database queries → Data persists

---

## Rollback Plan

If deployment fails:
1. Check Railway deployment logs
2. Verify env vars are set correctly
3. Run `prisma migrate status` to check migration state
4. Rollback to last successful deployment in Railway dashboard

---

## Success Criteria

- [ ] Site loads at `https://seoairegent.com`
- [ ] Database migrations run successfully
- [ ] Stripe checkout creates sessions
- [ ] Webhooks receive and process events
- [ ] User registration/login works
- [ ] Insforge backend integration confirmed
