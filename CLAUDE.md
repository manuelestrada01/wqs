# WQS — Windows Quality System
## Project Intelligence

### Project Overview
Premium marketing website for WQS, an Argentine aluminum window/door factory.
Multiple product systems with scroll-driven frame sequences (GSAP + canvas).
Built with **React 19 + React Router v7 + GSAP 3.12 + Firebase Firestore + Vite 5**.

### Repository
- Remote: https://github.com/manuelestrada01/wqs.git
- Main branch: main
- Deploy: Netlify (connect GitHub repo or drag dist/ folder)

### Stack
| Dep | Version | Role |
|-----|---------|------|
| react + react-dom | 19 | UI |
| react-router-dom | 7 | client-side routing |
| gsap + @gsap/react | 3.12 | animations, scroll sequences |
| firebase | 12 | Firestore (quote submissions) |
| vite + @vitejs/plugin-react | 5 | bundler |

### Routes
| Path | Component | Notes |
|------|-----------|-------|
| `/` | `HomePage` | loader → hero → sequence → products → cotizaciones |
| `/sistemas/:categoria/:slug` | `SystemPage` | per-system sequence + detail |
| `*` | `NotFoundPage` | — |

### Critical Architecture Decisions

1. **GSAP registered once in `src/main.jsx`** BEFORE router renders:
   ```js
   gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
   ```
   "Plugin not registered" errors = registration happened too late or in a component.

2. **Frame folders live in `public/`** — Vite serves them verbatim at root, no bundling.
   - `/frames/` — Synego Slide (137 frames, `ezgif-frame-NNN.jpg`)
   - `/frames-hds/` — High Design Slide (138 frames, `ezgif-frame-NNN.jpg`)
   - `/frames-euro/` — Euro Design 70 (49 frames, `euro-frame-NNN.jpg`, 0-indexed)
   All three folders are in `.gitignore` — extract locally before dev/build.
   NEVER move frames to `src/` — they'd be hashed/bundled, breaking the loader.

3. **Canvas DPR cap at 2**: `Math.min(devicePixelRatio, 2)`.
   Never remove — 3× retina + 100+ frames decoded = OOM on mobile.

4. **Scroll blocked during preload** (`overflow: hidden` on body).
   `document.body.classList.add('is-ready')` enables scroll after loader exits.

5. **`src/data/systems.js` is the single source of truth** for all product data.
   Drives: Products cards, router paths, SystemPage sequence config, overlay config, detail section.
   Adding a new system = add entry to `SYSTEMS` array. No other files need changing (except frames in public/).

6. **ScrollTrigger `scrollRestoration` set to `'manual'`** in main.jsx.
   Prevents browser restored scroll from conflicting with GSAP pin on navigation/reload.

7. **Firebase project**: `wqs-aberturas` (Firestore). Quote form writes to Firestore.
   Config in `src/firebase.js`. No auth — Firestore rules must allow unauthenticated writes to quotes collection.

### Common Tasks

#### Adding a new system
1. Add entry to `SYSTEMS` array in `src/data/systems.js` (follow existing shape).
2. Add product image to `public/images/`.
3. If sequence exists: add frames to a new `public/frames-SLUG/` folder, set `sequence` config.
4. If `sequence: null` — SystemPage renders detail-only (no canvas animation).

#### Adding a new product category
Add entry to `SYSTEMS` with a new `categoryId`. The Products component reads `SYSTEMS` directly.

#### Changing overlay text / frame ranges
Edit the `overlays` array inside the system entry in `src/data/systems.js`.

#### Changing scroll distance for a system
Edit `scrollDistance` in the system's `sequence` config in `src/data/systems.js`.
No other files needed — SystemPage/Sequence reads this value.

#### Updating frame count for a system
Edit `frameCount` in the system's `sequence` config in `src/data/systems.js`.
Scale `overlays` frame ranges proportionally.

### Dev Commands
```bash
npm run dev      # Dev server → http://localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

### File Responsibilities
| File | Purpose |
|------|---------|
| `src/main.jsx` | Entry — GSAP plugin registration, React root, RouterProvider |
| `src/router.jsx` | Route definitions (BrowserRouter) |
| `src/App.jsx` | Layout shell — Navbar + Outlet + Footer, scroll reset on nav |
| `src/data/systems.js` | Single source of truth for all product systems + helpers |
| `src/firebase.js` | Firebase init, exports `db` (Firestore) |
| `src/pages/HomePage.jsx` | Frame preload orchestration, renders home sections |
| `src/pages/SystemPage.jsx` | Per-system sequence + detail view |
| `src/pages/NotFoundPage.jsx` | 404 |
| `src/components/Loader/` | Loading screen with progress bar |
| `src/components/Hero/` | Hero entrance, SplitText, parallax |
| `src/components/About/` | About section |
| `src/components/HomeSequence/` | Home canvas sequence (Synego Slide, 137 frames) |
| `src/components/Sequence/` | Generic canvas sequence component |
| `src/components/SequenceEuro/` | Euro Design 70 sequence variant |
| `src/components/SystemSequence/` | SystemPage sequence wrapper |
| `src/components/SystemNav/` | In-page system navigation |
| `src/components/LineDetail/` | System detail section (specs + features) |
| `src/components/Products/` | Product cards grid, stat counters |
| `src/components/Cotizaciones/` | Quote form → Firebase Firestore |
| `src/components/Navbar/` | Sticky nav, scroll state, mobile menu |
| `src/components/Footer/` | Footer nav |
| `src/components/PageTransition/` | Route transition animation |
| `src/js/loader.js` | Frame preload, returns Image[] array, progress callback |
| `src/js/utils.js` | debounce, clamp, mapRange, splitChars |
| `src/hooks/useFramePreloader.js` | React hook wrapping loader.js |

### Design Tokens
| Token | Value |
|-------|-------|
| `--c-carbon` | `#1A1A1D` |
| `--c-walnut` | `#4B2A1E` |
| `--c-white` | `#FFFFFF` |
| `--c-accent` | `#C8A96E` (gold, sparingly) |
| `--font-display` | Bebas Neue |
| `--font-body` | DM Sans (300/400/500) |

### Browser Support
Chrome/Edge 100+, Firefox 100+, Safari 16+ (iOS 16+). No IE11.

### Known Constraints
- Firebase Firestore rules must allow unauthenticated writes for quote form to work.
- Frames ~8MB per set — loader shows 5–15s on slow connections (expected).
- Frame folders must be manually uploaded to Netlify or via CI artifact (gitignored).
- `public/frames/` extract command per set:
  ```bash
  unzip Downloads/synego-frames.zip -d public/frames/
  unzip Downloads/hds-frames.zip -d public/frames-hds/
  unzip Downloads/euro-frames.zip -d public/frames-euro/
  ```
