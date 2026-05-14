# WQS — Windows Quality System
## Project Intelligence

### Project Overview
Premium marketing website for WQS, an Argentine aluminum window/door factory.
Showcases the REHAU SYNEGO system with a scroll-driven image sequence (224 frames).
Built with Vite 5 + Vanilla JS + GSAP 3.12. NO framework (no React/Vue/Angular).

### Repository
- Remote: https://github.com/manuelestrada01/wqs.git
- Main branch: main
- Deploy: Netlify (connect GitHub repo or drag dist/ folder)

### Critical Architecture Decisions

1. **Frames live in `public/frames/`** — Vite serves public/ verbatim at root.
   Frames available at `/frames/ezgif-frame-001.jpg` without bundling.
   NEVER move frames to src/ — they'd be hashed/bundled, breaking loader.js.
   `public/frames/` is in `.gitignore` — extract locally:
   ```
   unzip Downloads/ezgif-64c1cbfef6e2a347-jpg.zip -d public/frames/
   ```

2. **GSAP registered once in main.js** BEFORE any module imports it:
   ```js
   gsap.registerPlugin(ScrollTrigger, SplitText);
   ```
   "Plugin not registered" errors = this was called too late.

3. **Canvas DPR cap at 2**: `Math.min(devicePixelRatio, 2)`.
   Never remove — 3× retina + 224 frames decoded = OOM on mobile.

4. **ScrollTrigger `end: "+=5000"`** creates 5000px scroll space for sequence.
   `SCROLL_DISTANCE = 5000` in overlays.js MUST match this value.
   px_per_frame = 5000 / 224 ≈ 22.32. Changing 5000 requires recalculating all overlay offsets.

5. **Scroll is blocked** (`overflow: hidden` on body) during frame preload.
   Loader dismisses BEFORE hero animations begin. Prevents empty canvas scroll.

6. **SplitText** — available in GSAP npm package (v3.15.0). No Club license required.

### Common Tasks

#### Adding a new product category
1. Add `<article>` to `.products__grid` in index.html
2. Add nav item in header + footer nav
3. Add product image to `public/images/`
4. No JS changes — products.js uses `querySelectorAll('.product-card')`

#### Changing overlay text
Edit `.overlay` divs in index.html. Frame ranges → overlays.js `OVERLAY_CONFIG`.

#### Changing scroll distance (5000px)
1. `end: "+=XXXX"` in sequence.js
2. `SCROLL_DISTANCE = XXXX` in overlays.js
Both MUST match.

#### Updating frame count
1. `FRAME_COUNT` in loader.js
2. `frame: FRAME_COUNT - 1` in sequence.js
3. `OVERLAY_CONFIG` ranges in overlays.js (scale proportionally)

### Dev Commands
```bash
npm run dev      # Dev server → http://localhost:5173
npm run build    # Production build → dist/
npm run preview  # Preview production build
```

### File Responsibilities
| File | Purpose |
|------|---------|
| `src/main.js` | Entry, plugin registration, init orchestration |
| `src/js/loader.js` | 224 frame preload, progress callback |
| `src/js/sequence.js` | Canvas renderer, ScrollTrigger pin+scrub |
| `src/js/overlays.js` | Text overlay GSAP, frame→scroll math |
| `src/js/navbar.js` | Sticky nav, scroll state, mobile menu |
| `src/js/hero.js` | Hero entrance, SplitText, parallax |
| `src/js/products.js` | Product cards, stat counters, CTA |
| `src/js/form.js` | Quote form validation + FormSubmit |
| `src/js/utils.js` | debounce, clamp, mapRange, splitChars |
| `src/styles/base.css` | Design tokens, reset, typography |
| `src/styles/layout.css` | Section layout, grid systems |
| `src/styles/components.css` | All UI components |
| `src/styles/animations.css` | CSS hover/transition states |
| `public/frames/` | 224 JPEG frames (static, gitignored) |

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
- FormSubmit.co sends a confirmation on first use — confirm email before launch.
- Frames ~8MB — on slow connections loader shows 5–15s (expected, creates anticipation).
- `public/frames/` must be manually uploaded to Netlify or via CI artifact.
