# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build (also runs TypeScript checking)
- `npm run start` — serve production build

No test suite or linter is configured.

## What this is

Single-page landing site for REDLINE, a clothing brand with a black-hole theme. Next.js 16 App Router + React Three Fiber + GSAP ScrollTrigger/SplitText + Lenis smooth scroll. Tailwind v4 (CSS-config in `app/globals.css`, no tailwind.config).

## Architecture

The page is DOM sections scrolling over one **fixed full-viewport WebGL canvas** (`components/canvas/Scene.tsx`) that renders a single fullscreen-quad black hole shader (`components/canvas/BlackHole.tsx`).

**Layering gotcha:** the canvas wrapper is `fixed inset-0 z-0` and all page content sits in a `relative z-10` wrapper (`app/page.tsx`). Do NOT move the canvas to a negative z-index — Chromium paints the root (`html`) background over negative-z fixed elements, which makes the canvas invisible. Likewise, never put a background on `body` or full-viewport sections; only `html` and the canvas wrapper carry `--bg`.

`scripts/snap.mjs` (Playwright, uses system Edge) screenshots the live dev server — useful for visually verifying canvas/animation changes headlessly.

The bridge between scroll/mouse and the shader is `lib/store.ts` — a plain mutable module object (`motion`), deliberately not React state, written by event handlers and read every frame inside `useFrame`:

- `motion.phase` (0→3, continuous): which section the viewer is in (hero → collection → manifesto → signup). Written by `components/providers/PhaseTracker.tsx` (ScrollTriggers on `#collection`, `#manifesto`, `#drop`). The shader maps phase to hole position/size/ring intensity via the `PHASES` table in `BlackHole.tsx` — edit that table to re-choreograph the hole per section.
- `motion.mouse`: normalized pointer, written in `components/providers/Smooth.tsx`, used for shader parallax and Hero wordmark drift.
- `motion.ringBoost`: extra accretion-ring brightness (set by the Signup email input on focus).
- `motion.reducedMotion`: checked by all pointer-driven effects.

`Smooth.tsx` owns the Lenis instance and syncs it to GSAP's ticker/ScrollTrigger — all scroll animation must go through ScrollTrigger, never raw scroll listeners. Everything frame-synced uses lerped/damped values; raw values are only written to `motion`.

`components/ui/Preloader.tsx` dispatches `PRELOAD_DONE_EVENT` on `window`; Hero waits for it before its entrance animation.

## Design rules (hard constraints from the brand owner)

- **No CSS gradients anywhere.** Flat colors only. Shader light falloff is fine.
- Palette: bg `#050505`, panels `#0c0c0c`, text `#f2f2f2`, red `#e10600` (tokens in `globals.css`). Red is used sparingly — thin rules, indices, one word per section.
- Type: Anton (display, `.font-display`) + IBM Plex Mono (body/micro-labels via `.label` class). Fonts loaded in `app/layout.tsx`.
- Minimalist: hairline 1px borders, sharp corners, no glassmorphism/glow/rounded cards.

## Assets

Product PNGs (transparent backgrounds) live in `public/clothing/` (jersey, joggers, hoodie, red-tee). `CLOTHING/` at the repo root is the owner's source-asset drop folder — copy new garments from there into `public/clothing/` and add an entry to `GARMENTS` in `components/sections/Collection.tsx`.
