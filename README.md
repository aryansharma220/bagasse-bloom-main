# BioGraphX

BioGraphX is a techno-economic decision platform for evaluating sugarcane bagasse to graphene oxide (GO) ventures in India.

It combines:

- process and financial simulation,
- regional viability context,
- market intelligence aggregation,
- AI-assisted strategic recommendation,
- and export/report utilities.

The product is built for comparative scenario planning in early-stage venture analysis.

## Table of Contents

- [What It Solves](#what-it-solves)
- [Core Capabilities](#core-capabilities)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Repository Structure](#repository-structure)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [Simulation Model](#simulation-model)
- [Deployment on Vercel](#deployment-on-vercel)
- [Testing and Quality](#testing-and-quality)
- [Troubleshooting](#troubleshooting)
- [Product Notes and Limits](#product-notes-and-limits)
- [Contributing](#contributing)

## What It Solves

For founders, analysts, and incubation teams, BioGraphX helps answer:

- Is a bagasse-to-GO plant financially viable under specific assumptions?
- How sensitive is ROI to GO pricing, capacity, and power cost?
- Which Indian region is better based on power, labor, and incentives?
- What happens if market feeds or AI providers are temporarily unavailable?

## Core Capabilities

- Interactive simulation controls for:
  - bagasse throughput,
  - input moisture,
  - electricity and labor costs,
  - CAPEX,
  - GO market price,
  - region-specific defaults.
- Multi-scenario workflow with local saved scenarios.
- Financial and production dashboards with charted outputs.
- Regional heatmap for viability comparison.
- Market intelligence panel sourced via backend aggregation.
- AI endpoints for:
  - market analysis,
  - investor report generation,
  - investment recommendation.
- Resilient fallback behavior when upstream AI provider returns specific service errors.

## System Architecture

Single repository, two runtime surfaces:

1. Frontend: React + Vite SPA.
2. Backend: Express API (local server) and Vercel serverless handler for production.

High-level flow:

1. User adjusts assumptions in frontend input controls.
2. Simulation engine computes production + economics instantly in-browser.
3. Frontend fetches market intelligence and AI responses from backend `/api/*` endpoints.
4. Backend uses OpenRouter-backed services for market intelligence and narrative generation.
5. If provider fails with selected status codes, backend returns structured fallback payloads.

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, Recharts, Radix UI
- Backend: Express, Axios, CORS, dotenv
- AI Integration: OpenRouter (chat completions)
- Testing: Vitest + Testing Library + jsdom
- Tooling: ESLint, TypeScript, npm-run-all
- Deployment: Vercel (SPA + API rewrite model)

## Repository Structure

```text
src/
  components/         UI modules, dashboards, and section blocks
  lib/                simulation engine, API client, storage and export helpers
  pages/              routed pages (Index, NotFound)
server/
  api/routes/         Express route handlers (/api/ai, /api/data)
  services/           OpenRouter and market intelligence service layer
  data/               regional defaults and structured data
api/
  index.js            serverless adapter for Vercel
```

Important entry points:

- `src/pages/Index.tsx`: page orchestration and lazy section loading.
- `src/lib/simulation.ts`: core techno-economic model.
- `src/lib/api-client.js`: frontend API service wrapper.
- `server/app.js`: Express app setup (CORS, middleware, routes, error handler).
- `server/index.js`: local API bootstrap (`PORT` default `3001`).
- `api/index.js`: exports Express app for Vercel runtime.
- `vercel.json`: rewrites `/api/*` and SPA fallback.

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
git clone <your-repo-url>
cd bagasse-bloom-main
npm install
```

### Configure Environment

Create a `.env` file in the repository root and add values from [Environment Variables](#environment-variables).

### Start Development

```bash
npm run dev
```

This runs both:

- Vite frontend on `http://localhost:8080`
- Express API on `http://localhost:3001`

## Environment Variables

Set these in local `.env` and in Vercel project settings.

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `OPENROUTER_API_KEY` | Yes (for live AI/data) | None | Auth for OpenRouter requests |
| `OPENROUTER_MODEL` | No | `meta-llama/llama-3.1-8b-instruct:free` | Model for report/analysis/recommendation endpoints |
| `OPENROUTER_MARKET_MODEL` | No | `meta-llama/llama-3.1-8b-instruct:free` | Model for market intelligence synthesis |
| `MARKET_CACHE_TTL_MINUTES` | No | `20` | TTL for in-memory market intelligence cache |
| `INR_PER_USD` | No | `83` | Exchange assumption used in backend prompt formatting |
| `VITE_API_URL` | No | `/api` | Frontend API base path |
| `CORS_ORIGIN` | Recommended | Empty | Primary allowed origin |
| `CORS_ORIGINS` | Recommended | Empty | CSV list of additional allowed origins |
| `PORT` | No | `3001` | Local API server port |
| `NODE_ENV` | No | Runtime-dependent | Environment mode |

Example `.env`:

```dotenv
OPENROUTER_API_KEY=sk-or-v1-your-key
OPENROUTER_MODEL=meta-llama/llama-3.1-8b-instruct:free
OPENROUTER_MARKET_MODEL=meta-llama/llama-3.1-8b-instruct:free
MARKET_CACHE_TTL_MINUTES=20
INR_PER_USD=83
VITE_API_URL=/api
CORS_ORIGIN=http://localhost:8080
CORS_ORIGINS=http://localhost:8080,http://127.0.0.1:8080
PORT=3001
NODE_ENV=development
```

Notes:

- Do not include trailing slash in `CORS_ORIGIN` or entries in `CORS_ORIGINS`.
- Dev localhost origins are also explicitly allowed by backend defaults.

## Running the App

### Development

```bash
npm run dev
```

### API only

```bash
npm run server
```

### Production build

```bash
npm run build
```

### Build in development mode

```bash
npm run build:dev
```

### Preview production build locally

```bash
npm run preview
```

## API Reference

Base path: `/api`

### Health

- `GET /health`
  - Returns service status and timestamp.

### AI Routes

- `POST /api/ai/analyze-market`
  - Body: `{ inputs, regionalData? }`
  - Output: market analysis narrative.

- `POST /api/ai/generate-report`
  - Body: `{ inputs, results, regionalData? }`
  - Output: feasibility report text.

- `POST /api/ai/investment-recommendation`
  - Body: `{ inputs, results, regionalData?, scraperData? }`
  - Output: recommendation narrative + model metadata.

### Data Routes

- `GET /api/data/market-prices`
- `GET /api/data/regional-electricity`
- `GET /api/data/incentives`
- `GET /api/data/carbon-rates`
- `GET /api/data/bagasse-market`
- `GET /api/data/market-news`
- `GET /api/data/market-series`
- `GET /api/data/all`

### Fallback Behavior

If OpenRouter returns `402`, `404`, or `429`:

- AI routes return fallback narrative outputs.
- Market data service returns benchmark fallback data.

This keeps the app usable during provider or quota disruptions.

## Simulation Model

The in-browser simulation pipeline uses these stage assumptions:

1. Drying: `dryBagasse = bagasseTons * (1 - moisturePercent / 100)`
2. Pyrolysis: `biocharProduced = dryBagasse * 0.30`
3. Oxidation: `goProducedTons = biocharProduced * 0.15`
4. GO output: `goProduced (kg/day) = goProducedTons * 1000`

Economic model highlights:

- Energy intensity: `500 kWh` per ton bagasse.
- Chemical baseline: `20` (internal model currency) per kg GO.
- Carbon credits included in yearly revenue.
- Outputs include ROI, payback, break-even GO price, and sensitivity bands.

Important interpretation note:

- UI labels are INR-oriented for India market analysis, while internal model values apply fixed conversion logic (`INR_PER_USD` assumptions in code paths).
- Use for comparative and directional decisions; validate with detailed engineering and market diligence before investment.

## Deployment on Vercel

### Why this setup works

- Frontend builds to `dist` with Vite.
- `vercel.json` rewrites `/api/*` to serverless `api/index`.
- Non-API routes rewrite to `index.html` for SPA routing.

### Steps

1. Import repository into Vercel.
2. Select framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add all required environment variables.
6. Redeploy after env changes.

## Testing and Quality

Run checks locally:

```bash
npm run lint
npm run test
```

Watch mode for tests:

```bash
npm run test:watch
```

## Troubleshooting

### `OPENROUTER_API_KEY is required`

- Add `OPENROUTER_API_KEY` in `.env` and restart dev server.

### API port already in use (`EADDRINUSE`)

- Stop the process on `PORT` or change `PORT` in `.env`.
- Local server startup includes a health-check reuse path for already-running BioGraphX API instances.

### CORS blocked

- Ensure request origin is included in `CORS_ORIGIN` or `CORS_ORIGINS`.
- Remove trailing slashes from configured origins.

### AI responses missing but app still loads

- Expected if provider returns fallback-triggering status (`402`, `404`, `429`).
- Verify model IDs and account quota.

### Frontend cannot reach API in custom environments

- Ensure `VITE_API_URL` points to the deployed API base, usually `/api` for same-origin deployments.

## Product Notes and Limits

- Intended for scenario analysis, not final process design certification.
- Market and policy conditions can shift rapidly; validate assumptions before capital allocation.
- Saved scenarios are browser-local and tied to localStorage (`biographx:saved-scenarios`).

## Contributing

1. Create a feature branch.
2. Keep changes scoped and documented.
3. Run lint and tests before opening PR.
4. Update this README when behavior, API contracts, or setup requirements change.
