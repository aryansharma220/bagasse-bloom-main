# BioGraphX

BioGraphX is a frontend techno-economic simulation platform for evaluating the conversion of sugarcane bagasse into graphene oxide. It combines process assumptions, production estimates, operating cost modeling, market context, scenario management, and investment metrics in a single polished interface.

## Overview

The app is designed as a decision-support tool for early-stage techno-economic analysis. Users can adjust plant and market inputs, explore live recalculation, compare scenarios, and review projected output, cost, revenue, ROI, payback period, carbon savings, and viability guidance.

## Features

- Live simulation controls for plant capacity, moisture content, utility cost, labor cost, CAPEX, and graphene oxide price
- Scenario presets, quick-tune sliders, and sensitivity insight cards
- Production estimates for dry bagasse, biochar, and graphene oxide output
- Financial analysis with interactive charts, animated metrics, exportable chart panels, ROI, profit, and payback period
- Market intelligence section with demand and pricing visuals plus application insights
- Saved local scenarios with reload, delete, PDF export, and markdown summary download
- Recommendation panel with scenario-based strategic suggestions
- Responsive glassmorphic UI with subtle motion and neon-accent styling

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI components
- Recharts
- jsPDF
- html-to-image
- Vitest

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```sh
git clone <repository-url>
cd <project-directory>
npm install
```

### Development

```sh
npm run dev
```

The development server runs on port `8080` by default.

### Production Build

```sh
npm run build
```

### Preview Build

```sh
npm run preview
```

### Run Tests

```sh
npm run test
```

## Product Capabilities

### Scenario Modeling

- live recalculation as inputs change
- baseline scenario presets
- scenario comparison against reference cases
- sensitivity snapshots for throughput, power cost, and GO pricing

### Reporting and Export

- chart export to PNG
- feasibility report export to PDF
- downloadable markdown summary for each scenario
- local saved scenario vault in the browser

## Available Scripts

- `npm run dev` — start the local development server
- `npm run build` — create a production build
- `npm run build:dev` — create a development-mode build
- `npm run preview` — preview the production build locally
- `npm run lint` — run ESLint
- `npm run test` — run the test suite once
- `npm run test:watch` — run tests in watch mode

## Project Structure

```text
src/
  components/       Reusable page sections and UI building blocks
  hooks/            Shared React hooks
  lib/              Simulation logic and utilities
  pages/            Route-level pages
  test/             Test setup and specs
```

## Simulation Notes

The current model is intended for comparative scenario analysis rather than laboratory or commercial certification. Core outputs are based on fixed assumptions for drying, pyrolysis yield, oxidation yield, energy use, and chemical cost.

Before using the results for investment or engineering decisions, validate the assumptions against:

- feedstock quality data
- process design constraints
- local energy and labor costs
- current graphene oxide pricing
- compliance and environmental requirements

## Current Scope

This repository currently contains a client-side application only. There is no backend service, database, authentication layer, or live market data integration in the current implementation.

## Branding

Application name: `BioGraphX`

Positioning: a modern feasibility platform for biomass-to-graphene analysis, not a generic starter app or generated template.

## License

Add your preferred license information here.
