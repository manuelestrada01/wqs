/**
 * navbar.js — Sticky navbar, scroll state, mobile menu, active link tracking
 */

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const toggle  = navbar.querySelector('.nav__toggle');
  const menu    = document.getElementById('nav-menu');
  const navLinks = menu.querySelectorAll('.nav__link:not(.nav__link--cta)');

  if (!navbar) return;

  // ── Scroll state: transparent → dark glass ────────────────
  ScrollTrigger.create({
    start: '80px top',
    onEnter:     () => navbar.classList.add('navbar--scrolled'),
    onLeaveBack: () => navbar.classList.remove('navbar--scrolled'),
  });

  // ── Mobile menu toggle ─────────────────────────────────────
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    const nextState = !isOpen;

    toggle.setAttribute('aria-expanded', String(nextState));
    menu.classList.toggle('is-open', nextState);
    document.body.style.overflow = nextState ? 'hidden' : '';

    // Animate menu items in/out
    if (nextState) {
      gsap.from('.nav__link', {
        y: 20,
        opacity: 0,
        stagger: 0.06,
        duration: 0.5,
        ease: 'power3.out',
        delay: 0.1,
      });
    }
  });

  // Close menu on nav link click
  menu.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
      document.body.style.overflow = '';
      toggle.focus();
    }
  });

  // ── Active section tracking via IntersectionObserver ──────
  const sections = document.querySelectorAll('section[id]');
  const sectionMap = new Map();

  sections.forEach(section => {
    sectionMap.set(section.id, section);
  });

  const navMap = {
    corrediza:     menu.querySelector('a[href="#corrediza"]'),
    plegadiza:     menu.querySelector('a[href="#plegadiza"]'),
    oscilobatiente: menu.querySelector('a[href="#oscilobatiente"]'),
    puertas:       menu.querySelector('a[href="#puertas"]'),
    cotizaciones:  menu.querySelector('a[href="#cotizaciones"]'),
  };

  function setActive(id) {
    navLinks.forEach(link => link.classList.remove('is-active'));
    const activeLink = navMap[id] || menu.querySelector(`a[href="#${id}"]`);
    if (activeLink) activeLink.classList.add('is-active');
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActive(entry.target.id);
        }
      });
    },
    { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
  );

  sections.forEach(section => observer.observe(section));

  // ── Navbar entrance animation ──────────────────────────────
  gsap.timeline({ delay: 0.1 })
    .from('.nav__logo', {
      opacity: 0,
      y: -12,
      duration: 0.6,
      ease: 'power3.out',
    })
    .from('.nav__link', {
      opacity: 0,
      y: -8,
      stagger: 0.06,
      duration: 0.5,
      ease: 'power2.out',
    }, '-=0.3');
}
