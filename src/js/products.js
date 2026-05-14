/**
 * products.js — Product cards entrance, stat counters, CTA reveal
 */

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export function initProducts() {

  // ── Product cards: stagger up from below ──────────────────
  const cards = document.querySelectorAll('.product-card');
  if (cards.length) {
    // Cards start at opacity:0, translateY:40px (set in CSS)
    ScrollTrigger.create({
      trigger: '.products__grid',
      start: 'top 82%',
      once: true,
      onEnter() {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          duration: 0.75,
          stagger: 0.12,
          ease: 'power3.out',
        });
      },
    });
  }

  // ── Section headers: fade in from below ───────────────────
  const headers = document.querySelectorAll('.section__header');
  headers.forEach(header => {
    gsap.from(header, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        once: true,
      },
    });
  });

  // ── REHAU section: text slides in from left ───────────────
  gsap.from('.rehau__text', {
    x: -60,
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#rehau',
      start: 'top 75%',
      once: true,
    },
  });

  // ── Stat counters: count up from 0 ───────────────────────
  document.querySelectorAll('.stat__value').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    const suffixEl = el.querySelector('span');
    const suffix = suffixEl ? suffixEl.textContent : '';

    // Remove suffix temporarily (will be re-added during count)
    if (suffixEl) suffixEl.remove();

    const countObj = { val: 0 };

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter() {
        gsap.to(countObj, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate() {
            const rounded = Math.round(countObj.val);
            // Update text node (first child) only, preserve suffix span
            el.childNodes[0]
              ? (el.childNodes[0].nodeValue = rounded)
              : (el.textContent = rounded);
          },
          onComplete() {
            // Restore suffix span
            if (suffix) {
              const span = document.createElement('span');
              span.textContent = suffix;
              el.appendChild(span);
            }
          },
        });
      },
    });

    // Re-add suffix as span for initial render
    if (suffix) {
      const span = document.createElement('span');
      span.textContent = suffix;
      el.appendChild(span);
    }
  });

  // ── Stats grid: stagger in ───────────────────────────────
  gsap.from('.stat', {
    opacity: 0,
    y: 30,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.rehau__stats',
      start: 'top 80%',
      once: true,
    },
  });

  // ── CTA headline reveal ───────────────────────────────────
  gsap.from('.cta__headline', {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power4.out',
    scrollTrigger: {
      trigger: '#cotizaciones',
      start: 'top 75%',
      once: true,
    },
  });

  gsap.from(['.cta__sub', '.cta__features'], {
    opacity: 0,
    y: 25,
    stagger: 0.1,
    duration: 0.7,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.cta__left',
      start: 'top 75%',
      once: true,
    },
  });

  gsap.from('.quote-form', {
    opacity: 0,
    x: 30,
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.quote-form',
      start: 'top 80%',
      once: true,
    },
  });

  // ── Footer entrance ────────────────────────────────────────
  gsap.from('.footer__brand, .footer__nav, .footer__legal', {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '#footer',
      start: 'top 90%',
      once: true,
    },
  });
}
