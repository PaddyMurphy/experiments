# Agent notes — Experiments

Context for AI assistants and contributors working in this repository.

## Stack

- **React 19** + **TypeScript** + **Vite 7**
- **Mantine v9** (`@mantine/core`, `@mantine/hooks`): dark mode only (`forceColorScheme="dark"` in `src/main.tsx`). No Tailwind; use Mantine style props and CSS Modules (e.g. `AppShellLayout.module.css`).
- **react-router-dom** with **HashRouter** in `src/main.tsx` — routes look like `/#/e/:experimentId`.
- **Rive**: `@rive-app/react-canvas` (`useRive`, view model hooks). Canvas sizing defaults to **600×400** aspect ratio via `RiveAspectBox` in `RiveCanvas.tsx`.

## Adding an experiment

1. **Asset**: place `.riv` under `public/` (e.g. `public/animation/name.riv`).
2. **Registry**: add an entry in `src/config/projects.ts` with `id`, `title`, `rivPublicPath`, `artboard`, `stateMachine`, and `viewModelName` if applicable.
3. **UI**: if it needs custom controls beyond the generic `RiveCanvas`, add a small component and render it from `ExperimentPage` or as children of `RiveCanvas` when the VM context is required.

## Conventions

- **Single source of truth** for the sidebar and routes: `experiments` in `projects.ts`.
- **Point Cloud** defaults and density cap live in `RiveCanvas.tsx` (`POINT_CLOUD_*` constants).
- **Git**: do not commit `node_modules/`, `dist/`, or `.env` files — see `.gitignore`.
- **Deployment**: production output is `dist/` after `npm run build`; configure hosting (e.g. GitHub Pages) to serve that folder with `base: './'` as already set in `vite.config.ts`.

## Commands

```bash
npm install    # dependencies
npm run dev    # development
npm run build  # typecheck + vite build
```

## Files to touch for common tasks

| Task | Primary files |
|------|----------------|
| New Rive experiment | `public/…`, `src/config/projects.ts`, maybe `ExperimentPage.tsx` |
| Layout / chrome | `AppShellLayout.tsx`, `AppShellLayout.module.css` |
| Rive behavior / VM | `RiveCanvas.tsx` |
| Theme | `src/main.tsx` (`MantineProvider`, `createTheme`) |
| Router / default redirect | `src/App.tsx` |
