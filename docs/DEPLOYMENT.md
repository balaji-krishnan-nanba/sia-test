# Deployment Guide - SIA Exam Prep

> **Last Updated:** December 7, 2025

---

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Environment Setup](#environment-setup)
3. [Supabase Setup](#supabase-setup)
4. [Stripe Setup](#stripe-setup)
5. [Vercel Deployment](#vercel-deployment)
6. [Domain Configuration](#domain-configuration)
7. [Post-Deployment Checklist](#post-deployment-checklist)

---

## Deployment Overview

**Stack:**
- **Frontend Hosting:** Vercel
- **Backend/Database:** Supabase
- **Payments:** Stripe
- **Domain:** siaexamprep.co.uk

**Deployment Flow:**
```
Git Push → GitHub → Vercel (auto-deploy) → Live
```

---

## Environment Setup

### Environment Variables

Create `.env.local` in project root:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... # or pk_test_... for testing
STRIPE_SECRET_KEY=sk_live_... # or sk_test_... for testing
STRIPE_WEBHOOK_SECRET=whsec_...

# App Config
NEXT_PUBLIC_BASE_URL=https://siaexamprep.co.uk # or http://localhost:3000 for local

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-...
```

**Security Notes:**
- Never commit `.env.local` to Git
- Use `.env.example` as template (without actual secrets)
- Rotate keys if exposed

---

## Supabase Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Choose region (closest to users, e.g., London for UK)
4. Set database password (save securely)

### 2. Get API Keys

- Dashboard → Settings → API
- Copy `Project URL` and `anon public` key

### 3. Enable Google OAuth

- Dashboard → Authentication → Providers → Google
- Add Google OAuth credentials (see API.md)
- Enable provider

### 4. Set Up Database Schema

Run migrations:

```sql
-- See DATABASE.md for complete schema
-- Run via Supabase SQL Editor

CREATE TABLE questions (...);
CREATE TABLE subscriptions (...);
CREATE TABLE user_progress (...);
CREATE TABLE mock_exam_results (...);
CREATE TABLE user_answers (...);

-- Enable Row-Level Security
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
-- ... (see DATABASE.md)
```

### 5. Import Question Data

Use Supabase Dashboard or CLI to import 2,430 questions from `/Questions` directory.

---

## Stripe Setup

### 1. Create Stripe Account

1. Go to [stripe.com](https://stripe.com)
2. Create account
3. Complete business verification

### 2. Get API Keys

- Dashboard → Developers → API Keys
- Copy Publishable Key and Secret Key
- **Use Test Keys for testing!**

### 3. Create Products (Optional)

- Dashboard → Products → Add Product
- Single Exam: £9.99
- All Access: £24.99

**Or:** Use dynamic prices in Checkout Session (recommended - see API.md)

### 4. Set Up Webhook

1. Dashboard → Developers → Webhooks → Add Endpoint
2. URL: `https://siaexamprep.co.uk/api/stripe/webhook`
3. Events: Select `checkout.session.completed`
4. Copy Webhook Signing Secret

### 5. Test Mode

- Use Stripe test cards for testing
- Test Card: `4242 4242 4242 4242` (any future expiry, any CVC)

---

## Vercel Deployment

### 1. Connect GitHub Repository

1. Go to [vercel.com](https://vercel.com)
2. Import Git Repository
3. Connect to GitHub account
4. Select `sia-door-supervisor` repository

### 2. Configure Project

- **Framework Preset:** Next.js
- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Install Command:** `npm install`

### 3. Add Environment Variables

- Settings → Environment Variables
- Add all variables from `.env.local`
- Separate environments: Production, Preview, Development

### 4. Deploy

- Click "Deploy"
- Vercel builds and deploys automatically
- Get deployment URL: `https://sia-door-supervisor.vercel.app`

### 5. Set Up Automatic Deployments

- Every push to `main` branch = production deployment
- Pull requests = preview deployment
- Branches = preview deployment

---

## Domain Configuration

### 1. Purchase Domain

- Purchase `siaexamprep.co.uk` from registrar (e.g., Namecheap, GoDaddy)

### 2. Add Domain to Vercel

1. Vercel Dashboard → Project → Settings → Domains
2. Add `siaexamprep.co.uk`
3. Add `www.siaexamprep.co.uk` (optional)

### 3. Configure DNS

Add these DNS records at your registrar:

```
Type: A
Name: @
Value: 76.76.21.21

Type: CCTV
Name: www
Value: cname.vercel-dns.com
```

### 4. Wait for Propagation

- DNS propagation takes 24-48 hours
- Vercel auto-issues SSL certificate (Let's Encrypt)

### 5. Redirect www to root (optional)

- Vercel Settings → Domains → www.siaexamprep.co.uk → Redirect to siaexamprep.co.uk

---

## Post-Deployment Checklist

### Functionality Tests

- [ ] Landing page loads
- [ ] Sign in with Google works
- [ ] Dashboard loads after sign in
- [ ] Practice mode loads questions
- [ ] Can submit answers
- [ ] Mock exam generates correctly
- [ ] Payment flow works (test mode)
- [ ] Stripe webhook receives events
- [ ] Progress tracking updates
- [ ] Sign out works

### Performance Tests

- [ ] Lighthouse score > 90
- [ ] Core Web Vitals pass
- [ ] Page load < 3s on 3G

### Security Tests

- [ ] HTTPS enforced
- [ ] Environment variables not exposed
- [ ] Stripe webhook signature verified
- [ ] RLS policies working (can't access other users' data)

### SEO Checks

- [ ] Meta tags present (title, description)
- [ ] Open Graph tags for social sharing
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured
- [ ] Google Analytics installed (if using)

### Monitoring Setup

- [ ] Vercel Analytics enabled
- [ ] Supabase logging reviewed
- [ ] Stripe webhook events logging
- [ ] Error tracking (optional: Sentry)

---

## CI/CD Pipeline

**Automatic Workflow:**

```
1. Developer pushes code to GitHub
   ↓
2. GitHub triggers Vercel webhook
   ↓
3. Vercel builds Next.js app
   ↓
4. Vercel runs checks (TypeScript, ESLint)
   ↓
5. If checks pass → Deploy
   ↓
6. Vercel invalidates CDN cache
   ↓
7. New version live
```

**Preview Deployments:**
- Every PR gets unique preview URL
- Test changes before merging
- Share with team for review

---

## Rollback Procedure

If deployment breaks production:

1. Vercel Dashboard → Deployments
2. Find last working deployment
3. Click "..." → Promote to Production
4. Previous version restored immediately

---

## Maintenance

### Regular Updates

- **Dependencies:** Update monthly (`npm outdated`, `npm update`)
- **Next.js:** Update quarterly (follow migration guides)
- **Supabase:** Auto-updated by Supabase
- **Stripe:** API version auto-updated (test webhooks)

### Database Backups

- Supabase: Daily automatic backups (free tier: 7 days retention)
- Pro tier: Point-in-time recovery

### Monitoring

- Check Vercel Analytics weekly
- Review Supabase logs for errors
- Monitor Stripe webhook delivery

---

## Troubleshooting

### Build Fails

- Check Vercel build logs
- Verify environment variables
- Test build locally: `npm run build`

### Webhook Not Receiving Events

- Verify webhook URL is correct
- Check Stripe Dashboard → Webhooks → Logs
- Verify signature verification logic
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/stripe/webhook`

### Database Connection Issues

- Check Supabase project status
- Verify API keys
- Review Supabase logs
- Check RLS policies (may block queries)

### Domain Not Resolving

- Verify DNS records
- Wait 24-48 hours for propagation
- Check with `nslookup siaexamprep.co.uk`

---

## Related Documentation

- [ARCHITECTURE.md](./ARCHITECTURE.md) - System architecture
- [API.md](./API.md) - API endpoints
- [DATABASE.md](./DATABASE.md) - Database schema

---

*Last Updated: December 7, 2025*
