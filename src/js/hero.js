/**
 * hero.js — Hero section entrance animation
 * Uses SplitText for cinematic character reveals.
 * Runs AFTER loader dismisses (called from main.js after await).
 */

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import SplitText from 'gsap/SplitText';

export function initHero() {
  const eyebrow   = document.querySelector('.hero__eyebrow');
  const lines     = document.querySelectorAll('.hero__line');
  const sub       = document.querySelector('.hero__sub');
  const cta       = document.querySelector('.hero__cta');
  const scrollHint = document.querySelector('.hero__scroll-hint');
  const badge     = document.querySelector('.hero__badge');

  if (!eyebrow || !lines.length) return;

  // Split each headline line into characters
  const splits = Array.from(lines).map(line =>
    SplitText.create(line, { type: 'chars', charsClass: 'char' })
  );
  const allChars = splits.flatMap(s => s.chars);

  // Reveal headline container (was opacity:0 in CSS to prevent FOUC)
  // chars are hidden individually — nothing shows until animation runs
  gsap.set('.hero__headline', { opacity: 1 });
  gsap.set(allChars, { yPercent: 110, rotateX: -80, opacity: 0, transformOrigin: 'bottom center' });

  // ── Entrance timeline ──────────────────────────────────────
  const tl = gsap.timeline({ delay: 0.3 });

  tl.to(eyebrow, {
      autoAlpha: 1,
      y: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
    .to(allChars, {
      yPercent: 0,
      rotateX: 0,
      opacity: 1,
      duration: 0.75,
      stagger: {
        amount: 0.7,
        from: 'start',
        ease: 'power1.inOut',
      },
      ease: 'power4.out',
    }, '-=0.3')
    .to(sub, {
      autoAlpha: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
    }, '-=0.3')
    .to(cta, {
      autoAlpha: 1,
      scale: 1,
      duration: 0.5,
      ease: 'back.out(1.3)',
    }, '-=0.4')
    .to(scrollHint, {
      autoAlpha: 1,
      duration: 1,
      ease: 'power2.out',
    }, '-=0.3')
    .to(badge, {
      autoAlpha: 1,
      duration: 1,
      ease: 'power2.out',
    }, '<');

  // ── Hero parallax: BG shifts up on scroll ──────────────────
  gsap.to('.hero__bg', {
    yPercent: 35,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });

  // ── Hero content: subtle upward parallax ──────────────────
  gsap.to('.hero__content', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true,
    },
  });
}
