# Experiments

A small **Animation Gallery** site: React (Vite), Mantine UI, and [Rive](https://rive.app/) animations. Experiments are listed in the sidebar; each route loads a `.riv` file and optional view-model controls.

## Requirements

- Node.js 20+ (recommended)

## Setup

```bash
npm install
```

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck (`tsc`) then production build to `dist/` |
| `npm run preview` | Serve `dist/` locally |

## Environment

| Variable | Purpose |
|----------|---------|
| `VITE_GITHUB_URL` | URL for the header **GitHub** link (optional; defaults to `https://github.com`) |

Create a `.env` or `.env.local` in the project root (see `.gitignore`; do not commit secrets).

## Project layout

- `src/config/projects.ts` — experiment registry (id, title, paths under `public/`, Rive artboard / state machine / view model names).
- `src/components/RiveCanvas.tsx` — reusable Rive canvas and Point Cloud view-model controls.
- `src/components/AppShellLayout.tsx` — Mantine `AppShell` (header, nav, mobile drawer).
- `public/` — static assets; Rive files live here (e.g. `public/animation/*.riv`).

Routing uses **HashRouter** so deep links work on static hosts (e.g. GitHub Pages) without server rewrites. Vite is configured with `base: './'` for relative asset URLs.

## License

Private / personal project unless stated otherwise.
