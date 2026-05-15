/**
 * utils.js — Shared helpers
 */

/**
 * Jump to a section by ID, bypassing any GSAP ScrollTrigger pins in the way.
 *
 * On fresh page load, GSAP hasn't set up its pin spacers yet. If we scroll
 * immediately, ScrollTrigger.refresh() (called by HomeSequence a frame later)
 * will temporarily reset scroll to 0 to measure positions, interrupting the
 * smooth scroll. Fix: when no pin triggers exist yet, defer until after refresh.
 */
export function scrollToSection(targetId) {
  const { ScrollTrigger } = window.__gsapPlugins__ || {};
  const allTriggers = typeof ScrollTrigger?.getAll === 'function' ? ScrollTrigger.getAll() : [];
  const hasPins = allTriggers.some(t => t.pin);

  if (!hasPins && ScrollTrigger) {
    // GSAP not initialized yet — wait for its first refresh, then scroll
    ScrollTrigger.addEventListener('refresh', function handler() {
      ScrollTrigger.removeEventListener('refresh', handler);
      _doScrollToSection(targetId);
    });
    return;
  }

  _doScrollToSection(targetId);
}

function _doScrollToSection(targetId) {
  const { ScrollTrigger } = window.__gsapPlugins__ || {};
  const allTriggers = typeof ScrollTrigger?.getAll === 'function' ? ScrollTrigger.getAll() : [];

  const target = document.getElementById(targetId);
  if (!target) return;

  // Always use getBoundingClientRect — animation triggers (start: 'top 75%') give
  // wrong values; only pin triggers would be valid alternatives, but they're not needed.
  const destinationY = target.getBoundingClientRect().top + window.scrollY;

  const blockingPins = allTriggers.filter(t => {
    if (!t.pin || t.trigger?.id === targetId) return false;
    const goingForward = destinationY > window.scrollY;
    if (goingForward) return t.start < destinationY && window.scrollY < t.end;
    return window.scrollY > t.start && window.scrollY < t.end;
  });

  if (blockingPins.length > 0) {
    const maxEnd = Math.max(...blockingPins.map(t => t.end));
    window.scrollTo({ top: maxEnd, behavior: 'instant' });
    requestAnimationFrame(() => {
      window.scrollTo({ top: destinationY, behavior: 'smooth' });
    });
  } else {
    window.scrollTo({ top: destinationY, behavior: 'smooth' });
  }
}

/** Debounce: delay fn execution until after `delay`ms of quiet */
export function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/** Clamp value between min and max */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/** Map a value from one range to another */
export function mapRange(value, inMin, inMax, outMin, outMax) {
  return ((value - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
}

/**
 * Split element text into individual .char <span> elements.
 */
export function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  el.setAttribute('aria-label', text);
  return [...text].map(char => {
    const span = document.createElement('span');
    span.className = 'char';
    span.setAttribute('aria-hidden', 'true');
    span.textContent = char === ' ' ? '\u00A0' : char;
    el.appendChild(span);
    return span;
  });
}

/** Cached viewport dimensions, updated on resize */
let _vw = window.innerWidth;
let _vh = window.innerHeight;

window.addEventListener('resize', debounce(() => {
  _vw = window.innerWidth;
  _vh = window.innerHeight;
}, 150));

export const viewport = {
  get w() { return _vw; },
  get h() { return _vh; },
};
