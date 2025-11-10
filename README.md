# Spotlyt Admin Dashboard

A lightweight Vite + React web dashboard that allows Spotlyt super admins to monitor platform activity (users, talent & influencers, gigs, wallet transactions) and publish Spotlyt News announcements that surface in the mobile app.

## Getting Started

```bash
cd admin-dashboard
npm install
npm run dev
```

The dev server defaults to [http://localhost:5174](http://localhost:5174).

## Environment Variables

Copy the example file and provide the Supabase credentials that power the production app (anon key is sufficient for read/write to public tables).

```bash
cp .env.example .env.local
```

| Variable | Description |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon/service key with access to admin views |

## Features

- Realtime snapshot of user, creator, job, and transaction metrics
- Drill-down tables for newest creators, active jobs, and wallet activity
- Spotlyt News publishing workflow (create / edit / delete / pin announcements)
- Responsive layout ready for desktop and tablet

## Project Structure

```
admin-dashboard/
├── src/
│   ├── App.tsx              # Dashboard orchestration
│   ├── components/          # Reusable UI blocks (layout, tables, forms)
│   ├── lib/supabaseClient.ts# Supabase client instance
│   └── types/               # Shared TypeScript types
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Production Build

```
npm run build
npm run preview
```

You can deploy the `dist/` output to any static hosting provider (Netlify, Vercel, Cloudflare Pages, etc.).
