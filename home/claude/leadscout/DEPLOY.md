# 🚀 LeadScout — Deployment Guide

## Overview
LeadScout deploys to **Vercel** (frontend) + **Supabase** (database + auth). Both have free tiers.

Total setup time: ~15 minutes.

---

## Step 1 — Create a Supabase Project

1. Go to **[supabase.com](https://supabase.com)** and sign up (free)
2. Click **New Project**
3. Choose a name (`leadscout`), a strong DB password, and a region close to you (e.g. EU West)
4. Wait ~2 minutes for provisioning

---

## Step 2 — Run the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Open `supabase/schema.sql` from this project
3. Paste the entire contents and click **Run**
4. You should see "Success. No rows returned"

---

## Step 3 — Seed the Database (optional but recommended)

1. In the **SQL Editor**, open `supabase/seed.sql`
2. Paste the entire contents and click **Run**
3. This inserts 200 Moroccan businesses across 10 sectors

---

## Step 4 — Configure Auth Settings

In your Supabase dashboard:

1. Go to **Authentication → Settings**
2. Under **Email Auth**, ensure **Enable Email Signup** is ON
3. (Optional) Turn **OFF** "Confirm email" if you want instant access without email verification
   - This makes development easier
   - For production, keep it ON for security

---

## Step 5 — Get Your API Keys

In your Supabase dashboard, go to **Settings → API**:

| Key | Where to find |
|-----|--------------|
| `NEXT_PUBLIC_SUPABASE_URL` | "Project URL" |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | "anon" / "public" key |
| `SUPABASE_SERVICE_ROLE_KEY` | "service_role" key — keep secret! |

---

## Step 6 — Deploy to Vercel

### Option A: GitHub (recommended)

1. Push this project to a GitHub repository:
   ```bash
   cd leadscout
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOURNAME/leadscout.git
   git push -u origin main
   ```

2. Go to **[vercel.com](https://vercel.com)** and sign up
3. Click **Add New → Project**
4. Import your GitHub repository
5. In the **Environment Variables** section, add:
   ```
   NEXT_PUBLIC_SUPABASE_URL     = https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1...
   SUPABASE_SERVICE_ROLE_KEY    = eyJhbGciOiJIUzI1...
   NEXT_PUBLIC_APP_URL          = https://your-app.vercel.app
   ```
6. Click **Deploy**

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# From the project directory
cd leadscout
vercel

# Follow the prompts, then set env vars:
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_APP_URL

# Deploy to production
vercel --prod
```

---

## Step 7 — Configure Supabase Auth Redirect URL

Once deployed on Vercel:

1. In Supabase → **Authentication → URL Configuration**
2. Set **Site URL** to your Vercel URL: `https://your-app.vercel.app`
3. Add to **Redirect URLs**: `https://your-app.vercel.app/**`

---

## Step 8 — Test the App

1. Open your Vercel URL
2. Click **Créer mon compte**
3. Sign up with an email + password
4. You should receive **100 free credits** automatically
5. Go to **Nouvelle recherche** and run a search

---

## Local Development

```bash
# Clone & install
git clone https://github.com/YOURNAME/leadscout.git
cd leadscout
npm install

# Set up environment
cp .env.example .env.local
# Edit .env.local with your Supabase keys

# Start dev server
npm run dev
# Open http://localhost:3000
```

---

## Architecture

```
leadscout/
├── src/
│   ├── app/
│   │   ├── (auth)/login,register     ← Auth pages
│   │   ├── (app)/dashboard,search,   ← Protected pages
│   │   │        results,wallet
│   │   └── api/
│   │       ├── search/               ← POST: deduct credits + return masked data
│   │       │   ├── estimate/         ← GET: count + cost preview (free)
│   │       │   └── results/          ← GET: re-fetch paid query (free)
│   │       ├── unlock/               ← POST: à la carte field unlock
│   │       ├── export/               ← GET: CSV download
│   │       └── me/balance/           ← GET: current credit balance
│   ├── components/Navbar.tsx
│   ├── lib/
│   │   ├── supabase/client.ts        ← Browser client
│   │   ├── supabase/server.ts        ← Server component client
│   │   ├── supabase/admin.ts         ← Service role client (API only)
│   │   ├── constants.ts              ← Field costs, sectors, cities
│   │   └── utils.ts                  ← Helpers
│   └── types/index.ts
├── supabase/
│   ├── schema.sql                    ← Tables, RLS, PostgreSQL functions
│   └── seed.sql                      ← 200 Moroccan businesses
└── middleware.ts                     ← Session refresh + route protection
```

## Key Security Notes

- **`SUPABASE_SERVICE_ROLE_KEY`** bypasses Row Level Security. Never expose to browser.
  It's only used in `src/lib/supabase/admin.ts`, which is only imported by API routes.
- **Credit deduction** is atomic via the `deduct_credits()` PostgreSQL function with `FOR UPDATE` row locking. This prevents double-spending even under concurrent requests.
- **Masking is always server-side** — unmasked data is never sent to clients for fields they haven't paid for.
- **Unlock idempotency** — the `UNIQUE(user_id, business_id, field)` constraint prevents double-charging for the same field, with automatic refund on race condition.

---

## Adding More Businesses

Run SQL INSERT statements in the Supabase SQL Editor:

```sql
INSERT INTO public.businesses (name, sector, city, region, phone, email, ...)
VALUES ('Ma Nouvelle Entreprise', 'Technologies de l''information', 'Casablanca', ...);
```

Or upload a CSV via the Supabase Table Editor.

---

## Adding Credits to a User (Admin)

In Supabase SQL Editor:

```sql
SELECT public.add_credits(
  (SELECT id FROM public.profiles WHERE email = 'user@example.com'),
  500,    -- amount
  'purchase',
  'Achat pack Growth 500 cr'
);
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Non autorisé" on search | Check your Supabase keys in `.env.local` |
| Credits not deducting | Ensure `deduct_credits` function exists in DB (re-run schema.sql) |
| No businesses in search | Run `seed.sql` in Supabase SQL Editor |
| Auth redirect loops | Check Supabase Redirect URLs include your domain |
| Build fails | Run `npm run build` locally and check errors |
