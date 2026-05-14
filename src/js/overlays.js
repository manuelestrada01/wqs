/**
 * overlays.js — Text overlay animation choreography
 *
 * Uses a single ScrollTrigger synced to the sequence pin,
 * reading progress directly to calculate current frame.
 * Avoids coordinate issues with independently positioned triggers
 * on a pinned element.
 */

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';
import { SCROLL_DISTANCE } from './sequence.js';

const FRAME_COUNT = 137;

// Frame ranges for each overlay — adjust to match video content
// Gaps between overlays give breathing room (canvas shows clean briefly)
const OVERLAYS = [
  { selector: '.overlay--title',    frameIn: 0,   frameOut: 18  },
  { selector: '.overlay--thermal',  frameIn: 25,  frameOut: 43  },
  { selector: '.overlay--security', frameIn: 50,  frameOut: 68  },
  { selector: '.overlay--acoustic', frameIn: 75,  frameOut: 93  },
  { selector: '.overlay--design',   frameIn: 100, frameOut: 118 },
  { selector: '.overlay--wqs',      frameIn: 124, frameOut: 137 },
];

const DUR_IN  = 0.5;
const DUR_OUT = 0.3;

export function initOverlays() {
  // Build overlay state objects with split text
  const overlayStates = OVERLAYS.map(({ selector, frameIn, frameOut }) => {
    const el = document.querySelector(selector);
    if (!el) return null;

    const headline = el.querySelector('.overlay__headline');
    const body     = el.querySelector('.overlay__body');
    const num      = el.querySelector('.overlay__num');
    const brand    = el.querySelector('.overlay__brand');
    const tagline  = el.querySelector('.overlay__tagline');
    const cta      = el.querySelector('.overlay__cta');

    let splitLines = null;
    if (headline) {
      splitLines = SplitText.create(headline, {
        type: 'lines',
        linesClass: 'overlay-line',
      });
    }

    const staggerEls = [
      ...(splitLines ? splitLines.lines : [headline].filter(Boolean)),
      num, brand, tagline, body, cta,
    ].filter(Boolean);

    // Set initial hidden state
    gsap.set(el, { autoAlpha: 0 });
    gsap.set(staggerEls, { y: 24, autoAlpha: 0 });

    return { el, staggerEls, frameIn, frameOut, visible: false };
  }).filter(Boolean);

  // ── Single ScrollTrigger synced to sequence pin ────────────
  // Same trigger + start + end as sequence.js → progress is 1:1
  ScrollTrigger.create({
    trigger: '#sequence-section',
    start: 'top top',
    end: `+=${SCROLL_DISTANCE}`,
    onUpdate(self) {
      const currentFrame = Math.round(self.progress * (FRAME_COUNT - 1));

      overlayStates.forEach(state => {
        const shouldShow = currentFrame >= state.frameIn && currentFrame < state.frameOut;

        if (shouldShow && !state.visible) {
          state.visible = true;
          state.el.setAttribute('aria-hidden', 'false');
          state.el.classList.add('is-visible');

          gsap.killTweensOf([state.el, ...state.staggerEls]);
          gsap.to(state.el, { autoAlpha: 1, duration: DUR_IN, ease: 'power2.out' });
          gsap.to(state.staggerEls, {
            y: 0,
            autoAlpha: 1,
            duration: DUR_IN,
            stagger: 0.07,
            ease: 'power3.out',
          });
        } else if (!shouldShow && state.visible) {
          state.visible = false;
          state.el.setAttribute('aria-hidden', 'true');
          state.el.classList.remove('is-visible');

          gsap.killTweensOf([state.el, ...state.staggerEls]);
          gsap.to(state.el, { autoAlpha: 0, y: -12, duration: DUR_OUT, ease: 'power2.in' });
          gsap.to(state.staggerEls, { y: 24, autoAlpha: 0, duration: DUR_OUT });

          // Reset y on staggerEls for next show
          gsap.set(state.staggerEls, { y: 24, delay: DUR_OUT + 0.05 });
          gsap.set(state.el, { y: 0, delay: DUR_OUT + 0.05 });
        }
      });
    },
  });
}
