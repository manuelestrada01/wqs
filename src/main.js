/**
 * main.js — WQS Website entry point
 *
 * Init order:
 * 1. Register GSAP plugins (MUST be first)
 * 2. Navbar (visible immediately)
 * 3. Preload 224 frames (async, with progress loader)
 * 4. Dismiss loader
 * 5. Init all scroll animations
 */

import './styles/index.css';

// CSS injected — remove FOUC inline overrides immediately
document.getElementById('navbar')?.style.removeProperty('opacity');
document.querySelector('main')?.style.removeProperty('visibility');
document.querySelector('footer')?.style.removeProperty('visibility');

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

// Register ONCE before any module uses them
gsap.registerPlugin(ScrollTrigger, SplitText);

import { preloadFrames } from './js/loader.js';
import { initNavbar }    from './js/navbar.js';
import { initHero }      from './js/hero.js';
import { initSequence }  from './js/sequence.js';
import { initOverlays }  from './js/overlays.js';
import { initProducts }  from './js/products.js';
import { initForm }      from './js/form.js';

// Check for reduced motion preference
const mm = gsap.matchMedia();

// Block scroll during load
document.body.style.overflow = 'hidden';

async function init() {
  // Navbar is always initialized immediately (no animation dependency)
  initNavbar();

  // Preload all 224 frames with progress feedback
  const loaderFill = document.getElementById('loader-fill');
  const loaderPct  = document.getElementById('loader-pct');

  const images = await preloadFrames((progress) => {
    const pct = Math.round(progress * 100);
    if (loaderFill) loaderFill.style.width = `${pct}%`;
    if (loaderPct)  loaderPct.textContent  = `${pct}%`;
  });

  // Dismiss loader with fade out
  await new Promise(resolve => {
    gsap.to('#loader', {
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power2.inOut',
      onComplete() {
        const loader = document.getElementById('loader');
        if (loader) {
          loader.style.display = 'none';
          loader.removeAttribute('aria-hidden');
          loader.setAttribute('aria-hidden', 'true');
        }
        // Re-enable scroll
        document.body.style.overflow = '';
        document.body.classList.add('is-ready');
        resolve();
      },
    });
  });

  // Initialize all animations
  mm.add(
    {
      motion:       '(prefers-reduced-motion: no-preference)',
      reducedMotion: '(prefers-reduced-motion: reduce)',
    },
    (context) => {
      const { motion } = context.conditions;

      if (motion) {
        // Full animation experience
        initHero();
        initSequence(images);
        initOverlays();
        initProducts();
      } else {
        // Reduced motion: show all content immediately, skip GSAP
        document.querySelectorAll('.overlay').forEach(el => {
          el.style.opacity = '1';
          el.setAttribute('aria-hidden', 'false');
        });
        document.querySelectorAll('.product-card').forEach(el => {
          el.style.opacity = '1';
          el.style.transform = 'none';
        });
        document.querySelectorAll(
          '.hero__eyebrow, .hero__sub, .hero__cta, .hero__scroll-hint, .hero__badge'
        ).forEach(el => {
          el.style.opacity = '1';
        });

        // Still initialize sequence (canvas) but no pin/scrub feels distracting
        // Just draw frame 0 and let user scroll normally
        initSequence(images);
      }

      // Form works regardless of motion preference
      initForm();
    }
  );
}

init();
