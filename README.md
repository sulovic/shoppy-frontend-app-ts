# Shoppy — Frontend (TypeScript + React + Vite)

This repository contains the frontend for Shoppy — a collection of administrative single-page applications used by the Shoppy platform. It's built with React, TypeScript, Vite and simple tooling to keep developer onboarding fast.

## What this repo is

- A monolithic frontend app containing multiple admin pages (Users, Reklamacije, Nabavke, Odsustva, Otpad, Racuni, and more).
- Focused on internal administrative UIs, forms, and data tables that talk to backend HTTP APIs.
- it's intended to be run locally or deployed as static assets behind the Shoppy backend.

## Tech stack

- React 18+ with functional components and hooks
- TypeScript
- Vite for fast development and production builds
- ESLint + TypeScript rules
- PostCSS for styles

## Quickstart (local development)

1. Install dependencies

```bash
npm ci
```

2. Start the dev server with HMR

```bash
npm run dev
```

3. Build for production

```bash
npm run build
```

4. Preview production build locally

```bash
npm run preview
```

## Environment and configuration

- Configuration values are stored in `src/config/Config.ts`.
- Auth and protected routes are implemented using context and custom hooks in `src/Context` and `src/hooks`.
- Axios instances (including private/authenticated clients) live in `src/hooks`.

If the app needs environment-specific API URLs, set them in an `.env` file at the project root.

## Project structure (important files)

- `src/main.tsx` — app entry
- `src/App.tsx` — main app component and route mounting
- `src/components` — reusable UI components (Navbar, Modal, Spinner, etc.)
- `src/Context/AuthContext.tsx` — authentication context
- `src/hooks/useAxiosPrivate.ts` — authenticated axios instance hook
- `src/pages` — feature pages grouped by domain (Users, Nabavke, Odsustva, Otpad, Reklamacije, Racuni, ...)
- `public/` — static assets
- `vite.config.ts`, `tsconfig.*`, `eslint.config.js` — toolchain config

## License

This repo contains internal Shoppy code. Check with the project owners for licensing and distribution.
