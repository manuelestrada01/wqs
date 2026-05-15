import React, { useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { scrollToSection } from '../../js/utils.js';

export default function Navbar() {
  const navbarRef  = useRef(null);
  const menuRef    = useRef(null);
  const toggleRef  = useRef(null);
  const location   = useLocation();
  const navigate   = useNavigate();

  function handleSistemas() {
    closeMenu();
    if (location.pathname === '/') {
      scrollToSection('products');
    } else {
      navigate('/', { state: { scrollTo: 'products' } });
    }
  }

  function handleQuienesSomos() {
    closeMenu();
    if (location.pathname === '/') {
      scrollToSection('quienes-somos');
    } else {
      navigate('/', { state: { scrollTo: 'quienes-somos' } });
    }
  }

  function handleCotizaciones() {
    closeMenu();
    if (location.pathname === '/') {
      scrollToSection('cotizaciones');
    } else {
      navigate('/', { state: { scrollTo: 'cotizaciones' } });
    }
  }

  // ── Scroll state + hide-on-scroll ──────────────────────────
  useEffect(() => {
    const navbar = navbarRef.current;

    ScrollTrigger.create({
      trigger: document.documentElement,
      start: '80px top',
      onEnter:     () => navbar.classList.add('navbar--scrolled'),
      onLeaveBack: () => navbar.classList.remove('navbar--scrolled'),
    });

    let lastY   = 0;
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const currentY = window.scrollY;
        const delta    = currentY - lastY;
        if (currentY > 120) {
          if (delta > 4)       navbar.classList.add('navbar--hidden');
          else if (delta < -4) navbar.classList.remove('navbar--hidden');
        } else {
          navbar.classList.remove('navbar--hidden');
        }
        lastY   = currentY;
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // ── Entrance animation (after loader) ─────────────────────
  useGSAP(() => {
    gsap.timeline({ delay: 0.1 })
      .from('.nav__logo',  { opacity: 0, y: -12, duration: 0.6, ease: 'power3.out' })
      .from('.nav__link',  { opacity: 0, y: -8,  stagger: 0.06, duration: 0.5, ease: 'power2.out' }, '-=0.3');
  }, { dependencies: [] });

  // ── Active section tracking ────────────────────────────────
  useEffect(() => {
    const sections  = document.querySelectorAll('section[id]');
    const navLinks  = menuRef.current?.querySelectorAll('.nav__link:not(.nav__link--cta)');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            navLinks?.forEach(l => l.classList.remove('is-active'));
            const active = menuRef.current?.querySelector(`a[href="#${entry.target.id}"]`);
            active?.classList.add('is-active');
          }
        });
      },
      { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' }
    );

    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  function toggleMenu() {
    const toggle = toggleRef.current;
    const menu   = menuRef.current;
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    const next   = !isOpen;

    toggle.setAttribute('aria-expanded', String(next));
    menu.classList.toggle('is-open', next);
    document.body.style.overflow = next ? 'hidden' : '';
    if (next) {
      navbarRef.current.classList.remove('navbar--hidden');
      gsap.from('.nav__link', { y: 20, opacity: 0, stagger: 0.06, duration: 0.5, ease: 'power3.out', delay: 0.1 });
    }
  }

  function closeMenu() {
    toggleRef.current.setAttribute('aria-expanded', 'false');
    menuRef.current.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && menuRef.current?.classList.contains('is-open')) {
        closeMenu();
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header id="navbar" ref={navbarRef} role="banner">
      <nav className="nav__inner" aria-label="Navegación principal">
        <Link
          to="/"
          className="nav__logo"
          aria-label="WQS — inicio"
          onClick={() => {
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        >
          <img src="/wqs-logo.png" alt="WQS Windows Quality System" width="80" height="27" />
        </Link>

        <button
          ref={toggleRef}
          className="nav__toggle"
          aria-expanded="false"
          aria-controls="nav-menu"
          aria-label="Abrir menú de navegación"
          onClick={toggleMenu}
        >
          <span className="nav__toggle-bar"></span>
          <span className="nav__toggle-bar"></span>
          <span className="nav__toggle-bar"></span>
        </button>

        <ul id="nav-menu" ref={menuRef} className="nav__menu" role="list">
          <li>
            <button className="nav__link" onClick={handleQuienesSomos}>
              Quiénes somos
            </button>
          </li>
          <li>
            <button className="nav__link" onClick={handleSistemas}>
              Sistemas
            </button>
          </li>
          <li>
            <button className="nav__link" onClick={handleCotizaciones}>
              Cotizaciones
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
