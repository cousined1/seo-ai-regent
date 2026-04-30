# SEO AI Regent — Railway Deployment Guide

## Step 1: Create Railway Project (Manual)

1. Go to https://railway.com/new
2. Click "Deploy from GitHub repo"
3. Select `cousined1/seo-ai-regent`
4. Click "Deploy"
5. Wait for initial build (it will fail — no env vars yet)

## Step 2: Add PostgreSQL

1. In project dashboard, click "New" → "Database" → "Add PostgreSQL"
2. Railway auto-links DATABASE_URL to your service

## Step 3: Add Environment Variables

Go to your service → Variables → Add:

```
# Stripe (required)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_EDITOR_PRICE_ID=price_1TRc4KKGNA0NaemqKR9rj4QA
STRIPE_EDITORIAL_PRICE_ID=price_1TRc4KKGNA0NaemqPWpbsYWw
STRIPE_SYNDICATE_PRICE_ID=

# Auth (generated)
AUTH_SESSION_SECRET=48af774fe87e0c24e31016568b18667ba2156b39548754abe72e5a59d594ce62
AUTH_RESET_TOKEN_SECRET=0d3cc8f2de0ce986c80f1168184a6dbf2d01e836c5e8a59d735b242ef688b32f
AUTH_ADMIN_PASSWORD_HASH=$2b$12$O2ZA9mQu/B7agqUPjfW6vuF3yWLHh8rTpg0E/vSIPwaiFV/aHYSHO

# App
NEXT_PUBLIC_SITE_URL=https://seoairegent.com
AUTH_RESET_EMAIL_FROM=accounts@seoairegent.com

# Optional
NEXT_PUBLIC_GTM_ID=
```

## Step 4: Add Domain

1. Settings → Domains
2. Add `seoairegent.com`
3. Add `www.seoairegent.com`

## Step 5: Create Stripe Webhook

1. Stripe Dashboard → Webhooks
2. Add endpoint: `https://seoairegent.com/api/billing/webhook`
3. Select events:
   - checkout.session.completed
   - invoice.payment_succeeded
   - invoice.payment_failed
   - customer.subscription.updated
   - customer.subscription.deleted
4. Copy webhook signing secret → set as STRIPE_WEBHOOK_SECRET

## Step 6: Redeploy

1. Go to Deployments
2. Click "Redeploy"
3. Verify health: `https://seoairegent.com/api/health`
