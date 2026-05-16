/**
 * utils.js — Shared helpers for React components
 */

import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Jump to a section by ID, bypassing any GSAP ScrollTrigger pins in the way.
 *
 * On fresh page load, GSAP hasn't set up its pin spacers yet. If we scroll
 * immediately, ScrollTrigger.refresh() (called by HomeSequence a frame later)
 * will temporarily reset scroll to 0 to measure positions, interrupting the
 * smooth scroll. Fix: when no pin triggers exist yet, defer until after refresh.
 */
export function scrollToSection(targetId) {
  const allTriggers = typeof ScrollTrigger?.getAll === 'function' ? ScrollTrigger.getAll() : [];
  const hasPins = allTriggers.some(t => t.pin);

  if (!hasPins) {
    ScrollTrigger.addEventListener('refresh', function handler() {
      ScrollTrigger.removeEventListener('refresh', handler);
      _doScrollToSection(targetId);
    });
    return;
  }

  _doScrollToSection(targetId);
}

function _doScrollToSection(targetId) {
  const allTriggers = typeof ScrollTrigger?.getAll === 'function' ? ScrollTrigger.getAll() : [];
  const target = document.getElementById(targetId);
  if (!target) return;

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
