# Bizyaab Client

Minimal Next.js frontend for Vercel that proxies API calls through a Next.js API route before hitting the Railway backend. This keeps browser calls same-origin (no direct CORS) while still exercising the Railway service.

## Getting started

```bash
cd client
npm install
npm run dev
```

- The dev server runs at http://localhost:3000
- The UI calls `/api/backend-ping`, which in turn fetches your Railway API using `BACKEND_API_URL`
- Create `.env.local` with `BACKEND_API_URL=http://localhost:4000/api/ping` (see `.env.example`) so the proxy knows where to point locally

## Deploying to Vercel
1. Push this `client` folder to its own GitHub repository and import it into Vercel
2. In Vercel → Project Settings → Environment Variables, add `BACKEND_API_URL=https://<your-railway-domain>/api/ping`
3. Redeploy. The UI will now invoke Virtual Next.js API route `/api/backend-ping`, which server-side fetches the Railway endpoint specified in `BACKEND_API_URL`

This setup keeps the browser talking only to Vercel while still validating your Railway service and CORS configuration.
