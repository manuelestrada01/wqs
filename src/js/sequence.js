/**
 * sequence.js — Canvas image sequence renderer
 * Drives 224 frames via GSAP ScrollTrigger pin+scrub.
 * Canvas uses cover-fit math to fill viewport regardless of frame aspect ratio.
 * DPR capped at 2 to prevent OOM on 3x retina + 224 frame RAM cost.
 *
 * Returns the ScrollTrigger instance for overlay synchronization.
 */

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { debounce } from './utils.js';

export const SCROLL_DISTANCE = 1800; // px — MUST match overlays.js

export function initSequence(images) {
  const canvas = document.getElementById('sequence-canvas');
  const ctx = canvas.getContext('2d');
  const progressFill = document.getElementById('seq-progress');

  const state = { frame: 0 };

  // ── Canvas sizing ──────────────────────────────────────────
  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;

    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;

    ctx.scale(dpr, dpr);
    drawFrame(Math.round(state.frame));
  }

  // ── Cover-fit draw ─────────────────────────────────────────
  // Maintains aspect ratio, clips edges (like CSS object-fit: cover)
  function drawFrame(index) {
    const img = images[index];
    if (!img?.complete || img.naturalWidth === 0) return;

    const cw = parseInt(canvas.style.width)  || window.innerWidth;
    const ch = parseInt(canvas.style.height) || window.innerHeight;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;

    const scale = Math.max(cw / iw, ch / ih);
    const sw = iw * scale;
    const sh = ih * scale;
    const sx = (cw - sw) / 2;
    const sy = (ch - sh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, sx, sy, sw, sh);
  }

  // Draw frame 0 immediately (before scroll)
  resizeCanvas();

  // ── GSAP ScrollTrigger pin + scrub ─────────────────────────
  const tween = gsap.to(state, {
    frame: 136, // 0-indexed, 137 frames total
    snap: 'frame',
    ease: 'none',                       // CRITICAL — linear mapping for scrub
    scrollTrigger: {
      trigger: '#sequence-section',
      pin: true,
      scrub: 0.1,                        // 0.1s lag — very responsive
      start: 'top top',
      end: `+=${SCROLL_DISTANCE}`,
      invalidateOnRefresh: true,
      onUpdate(self) {
        // Update progress bar
        if (progressFill) {
          progressFill.style.width = `${self.progress * 100}%`;
        }
      },
    },
    onUpdate() {
      drawFrame(Math.round(state.frame));
    },
  });

  // ── Resize handler ─────────────────────────────────────────
  window.addEventListener('resize', debounce(() => {
    resizeCanvas();
    ScrollTrigger.refresh();
  }, 150));

  return tween;
}
