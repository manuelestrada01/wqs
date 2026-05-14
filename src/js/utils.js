/**
 * utils.js — Shared helpers
 */

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
 * Used for cinematic character-by-character animations.
 * Each space is replaced with a non-breaking space span.
 * Parent element should have overflow:hidden for reveal effect.
 */
export function splitChars(el) {
  const text = el.textContent;
  el.textContent = '';
  el.setAttribute('aria-label', text); // preserve accessibility
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
