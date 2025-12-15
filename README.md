# Bizyaab Client

A minimal Next.js frontend meant to be deployed on Vercel. It includes a button that calls the backend API defined by `NEXT_PUBLIC_API_URL` so you can quickly validate CORS between Vercel and Railway.

## Getting started

```bash
cd client
npm install
npm run dev
```

- The dev server runs at http://localhost:3000
- The sample API URL defaults to `http://localhost:4000/api/ping`
- Set `NEXT_PUBLIC_API_URL` locally (e.g. in `.env.local`) and in your Vercel project so the frontend knows which backend to call

## Deploying to Vercel
1. Push this folder to its own GitHub repository
2. Import the repo in Vercel
3. Add the environment variable `NEXT_PUBLIC_API_URL` pointing to your Railway service URL
4. Deploy! The homepage button will call your Railway endpoint from Vercel, letting you confirm CORS behaves as expected
