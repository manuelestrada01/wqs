/**
 * overlays.js — Text overlay animation choreography
 * Maps frame ranges to scroll offsets, fires GSAP animations
 * at correct thresholds using ScrollTrigger.create callbacks.
 *
 * Uses onEnter/onLeave (NOT scrub) → enables staggered SplitText reveals.
 *
 * IMPORTANT: SCROLL_DISTANCE must match sequence.js
 */

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { SCROLL_DISTANCE } from './sequence.js';

const FRAME_COUNT = 224;

// Map frame index to scroll offset within sequence section
function frameToOffset(frame) {
  return (frame / (FRAME_COUNT - 1)) * SCROLL_DISTANCE;
}

// Overlay config: which frames → which overlay
const OVERLAYS = [
  { selector: '.overlay--title',    frameIn: 0,   frameOut: 38  },
  { selector: '.overlay--thermal',  frameIn: 40,  frameOut: 78  },
  { selector: '.overlay--security', frameIn: 80,  frameOut: 118 },
  { selector: '.overlay--acoustic', frameIn: 120, frameOut: 158 },
  { selector: '.overlay--design',   frameIn: 160, frameOut: 198 },
  { selector: '.overlay--wqs',      frameIn: 200, frameOut: 224 },
];

// Transition durations (in seconds, not pixels)
const DUR_IN  = 0.7;
const DUR_OUT = 0.4; // exit faster than enter (ui-ux-pro-max rule)

export function initOverlays() {
  OVERLAYS.forEach(({ selector, frameIn, frameOut }) => {
    const el = document.querySelector(selector);
    if (!el) return;

    const headline = el.querySelector('.overlay__headline');
    const body     = el.querySelector('.overlay__body');
    const num      = el.querySelector('.overlay__num');
    const brand    = el.querySelector('.overlay__brand');
    const tagline  = el.querySelector('.overlay__tagline');
    const cta      = el.querySelector('.overlay__cta');

    // SplitText on headline for line-by-line reveal
    let splitLines = null;
    if (headline) {
      splitLines = SplitText.create(headline, {
        type: 'lines',
        linesClass: 'overlay-line',
      });
    }

    const staggerEls = [
      ...(splitLines ? splitLines.lines : [headline].filter(Boolean)),
      num,
      brand,
      tagline,
      body,
      cta,
    ].filter(Boolean);

    // Initial state — all hidden, shifted down
    gsap.set(el, { autoAlpha: 0, y: 0 });
    gsap.set(staggerEls, { y: 28, autoAlpha: 0 });

    const inOffset  = frameToOffset(frameIn);
    const outOffset = frameToOffset(frameOut);

    // ── ENTER: fade in when reaching frameIn ──────────────────
    ScrollTrigger.create({
      trigger: '#sequence-section',
      start: `top+=${inOffset} top`,
      end:   `top+=${inOffset + 50} top`,
      onEnter() {
        el.setAttribute('aria-hidden', 'false');
        el.classList.add('is-visible');

        gsap.to(el, {
          autoAlpha: 1,
          duration: DUR_IN * 0.5,
          ease: 'power2.out',
        });

        gsap.to(staggerEls, {
          y: 0,
          autoAlpha: 1,
          duration: DUR_IN,
          stagger: 0.08,
          ease: 'power3.out',
          clearProps: 'will-change',
        });
      },
      onLeaveBack() {
        // Scrolling back up — hide this overlay
        el.setAttribute('aria-hidden', 'true');
        el.classList.remove('is-visible');
        gsap.to(el, { autoAlpha: 0, duration: DUR_OUT * 0.5, ease: 'power2.in' });
        gsap.to(staggerEls, { y: 28, autoAlpha: 0, duration: DUR_OUT * 0.5 });
      },
    });

    // ── EXIT: fade out when reaching frameOut ─────────────────
    if (frameOut < FRAME_COUNT) {
      ScrollTrigger.create({
        trigger: '#sequence-section',
        start: `top+=${outOffset - 60} top`,
        end:   `top+=${outOffset} top`,
        onLeave() {
          el.setAttribute('aria-hidden', 'true');
          el.classList.remove('is-visible');
          gsap.to(el, {
            autoAlpha: 0,
            y: -16,
            duration: DUR_OUT,
            ease: 'power2.in',
          });
        },
        onEnterBack() {
          el.setAttribute('aria-hidden', 'false');
          el.classList.add('is-visible');
          gsap.to(el, {
            autoAlpha: 1,
            y: 0,
            duration: DUR_IN * 0.5,
            ease: 'power2.out',
          });
        },
      });
    }
  });
}
