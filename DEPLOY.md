# SEO AI Regent - Deployment Guide

## Quick Setup (5 minutes)

### Step 1: Create Railway Project
1. Go to https://railway.com/new
2. Click "Deploy from GitHub repo"
3. Select `cousined1/seo-ai-regent`
4. Click "Deploy"

### Step 2: Add PostgreSQL
1. In project dashboard, click "New" → "Database" → "Add PostgreSQL"
2. Railway auto-injects `DATABASE_URL`

### Step 3: Set Environment Variables
Go to service → Variables → Add:

```
# Required - Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_EDITOR_PRICE_ID=price_1TRc4KKGNA0NaemqKR9rj4QA
STRIPE_EDITORIAL_PRICE_ID=price_1TRc4KKGNA0NaemqPWpbsYWw
STRIPE_SYNDICATE_PRICE_ID=

# Required - Auth (already generated)
AUTH_SESSION_SECRET=48af774fe87e0c24e31016568b18667ba2156b39548754abe72e5a59d594ce62
AUTH_RESET_TOKEN_SECRET=0d3cc8f2de0ce986c80f1168184a6dbf2d01e836c5e8a59d735b242ef688b32f
AUTH_ADMIN_PASSWORD_HASH=$2b$12$O2ZA9mQu/B7agqUPjfW6vuF3yWLHh8rTpg0E/vSIPwaiFV/aHYSHO

# Required - App
NEXT_PUBLIC_SITE_URL=https://seoairegent.com
AUTH_RESET_EMAIL_FROM=accounts@seoairegent.com
NODE_ENV=production

# Optional
SERPER_API_KEY=          # For search features
NEXT_PUBLIC_GTM_ID=      # Google Tag Manager
```

### Step 4: Add Domain
1. Settings → Domains
2. Add `seoairegent.com`
3. Add `www.seoairegent.com`

### Step 5: Create Stripe Webhook
1. Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://seoairegent.com/api/billing/webhook`
3. Select events:
   - checkout.session.completed
   - invoice.payment_succeeded
   - invoice.payment_failed
   - customer.subscription.updated
   - customer.subscription.deleted
4. Copy webhook signing secret → set as `STRIPE_WEBHOOK_SECRET`

### Step 6: Deploy
1. Go to Deployments tab
2. Click "Redeploy"
3. Wait for health check: `https://seoairegent.com/api/health`

## Alternative: Use PowerShell Script

After creating the project:
```powershell
cd C:\Users\Eddie\.openclaw\workspace\seo-ai-regent
.\railway-setup.ps1
```

## GitHub Auto-Deploy Setup (Optional)

1. Get Railway token: `railway auth token`
2. Add to GitHub: Repo → Settings → Secrets → `RAILWAY_TOKEN`
3. Push to main branch auto-deploys

## Verification Checklist

- [ ] Project created on Railway
- [ ] PostgreSQL database added
- [ ] All env vars set
- [ ] Domain configured
- [ ] Stripe webhook created
- [ ] Health endpoint returns 200
- [ ] Login page loads
- [ ] Pricing page shows plans
