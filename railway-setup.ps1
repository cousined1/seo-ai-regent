# SEO AI Regent - Railway Setup Script
# Run this after creating project at https://railway.com/new

# Link to project (after manual creation)
railway link

# Set environment variables
railway variables set STRIPE_SECRET_KEY="" `
  STRIPE_WEBHOOK_SECRET="" `
  STRIPE_EDITOR_PRICE_ID="price_1TRc4KKGNA0NaemqKR9rj4QA" `
  STRIPE_EDITORIAL_PRICE_ID="price_1TRc4KKGNA0NaemqPWpbsYWw" `
  STRIPE_SYNDICATE_PRICE_ID="" `
  AUTH_SESSION_SECRET="48af774fe87e0c24e31016568b18667ba2156b39548754abe72e5a59d594ce62" `
  AUTH_RESET_TOKEN_SECRET="0d3cc8f2de0ce986c80f1168184a6dbf2d01e836c5e8a59d735b242ef688b32f" `
  AUTH_ADMIN_PASSWORD_HASH='$2b$12$O2ZA9mQu/B7agqUPjfW6vuF3yWLHh8rTpg0E/vSIPwaiFV/aHYSHO' `
  NEXT_PUBLIC_SITE_URL="https://seoairegent.com" `
  AUTH_RESET_EMAIL_FROM="accounts@seoairegent.com" `
  NODE_ENV="production"

# Add PostgreSQL
# (Manual step: Railway dashboard → New → Database → PostgreSQL)

# Deploy
railway up

# Add domain
# (Manual step: Railway dashboard → Settings → Domains → Add custom domain)
