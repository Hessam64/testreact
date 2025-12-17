# Bizyaab Client

Minimal Next.js frontend for Vercel that proxies API calls through server-side routes before hitting the Railway backend. Users now authenticate against Supabase directly in the UI; their session token is forwarded through Next.js → Railway so Supabase row-level security can run with the real user context.

## Getting started

```bash
cd client
npm install
npm run dev
```

- The dev server runs at http://localhost:3000
- The UI calls three proxy routes: `/api/backend-ping` (GET), `/api/hello` (POST), and `/api/businesses` (GET)
- Create `.env.local` (see `.env.example`) with:
  - `BACKEND_API_BASE_URL=http://localhost:4000`
  - `NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project>.supabase.co`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>`
- Start the dev server, log in with a Supabase user account, and use the buttons to hit the Railway backend via Next.js

## Deploying to Vercel
1. Push this `client` folder to its own GitHub repository and import it into Vercel
2. In Vercel → Project Settings → Environment Variables, add:
   - `BACKEND_API_BASE_URL=https://<your-railway-domain>` (no trailing slash)
   - `NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project>.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>`
3. Redeploy. The proxy routes will server-side fetch `https://<your-railway-domain>/api/ping`, `/api/hello`, and `/api/businesses`

The homepage now lets you:
- Log in/out of Supabase (email/password) directly in the UI
- Ping the Railway API to confirm the service is reachable
- Send a name to `/api/hello`
- Load the Supabase `Businesses` table with the logged-in user's JWT so RLS policies apply correctly
