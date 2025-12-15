# Bizyaab Client

Minimal Next.js frontend for Vercel that proxies API calls through server-side routes before hitting the Railway backend. The browser only talks to Vercel, while Next.js calls Railway on your behalf so you can validate networking/CORS.

## Getting started

```bash
cd client
npm install
npm run dev
```

- The dev server runs at http://localhost:3000
- The UI calls two proxy routes: `/api/backend-ping` (GET) and `/api/hello` (POST)
- Create `.env.local` with `BACKEND_API_BASE_URL=http://localhost:4000` so these proxies know where to forward requests (see `.env.example`)
- If you previously set `BACKEND_API_URL`, it is still honored for the ping test, but using `BACKEND_API_BASE_URL` is preferred going forward

## Deploying to Vercel
1. Push this `client` folder to its own GitHub repository and import it into Vercel
2. In Vercel → Project Settings → Environment Variables, add `BACKEND_API_BASE_URL=https://<your-railway-domain>` (no trailing slash)
3. Redeploy. The `/api/backend-ping` and `/api/hello` routes will server-side fetch `https://<your-railway-domain>/api/ping` and `/api/hello`

The homepage now lets you:
- Ping the Railway API to confirm the service is reachable
- Send a name to `/api/hello`, which proves POST requests flow Next.js → Railway and back
