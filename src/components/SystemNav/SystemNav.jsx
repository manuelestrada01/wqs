import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SystemNav({ prev, next, categoryId, categoryLabel }) {
  const navRef = useRef(null);
  const hasContent = prev || next;

  useEffect(() => {
    if (!navRef.current || !hasContent) return;
    const el = navRef.current;
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => gsap.from(el, { y: 40, opacity: 0, duration: 0.7, ease: 'power3.out' }),
    });
    return () => st.kill();
  }, [hasContent]);

  if (!hasContent) return null;

  return (
    <nav ref={navRef} className="system-nav" aria-label="Navegación entre sistemas">
      <div className="system-nav__inner">
        <span className="system-nav__category">{categoryLabel}</span>

        <div className="system-nav__links">
          {prev ? (
            <Link to={`/sistemas/${categoryId}/${prev.slug}`} className="system-nav__link system-nav__link--prev">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M19 12H5M5 12l7-7M5 12l7 7"/>
              </svg>
              <span>
                <span className="system-nav__label">Anterior</span>
                <span className="system-nav__title">{prev.title}</span>
              </span>
            </Link>
          ) : <div />}

          {next ? (
            <Link to={`/sistemas/${categoryId}/${next.slug}`} className="system-nav__link system-nav__link--next">
              <span>
                <span className="system-nav__label">Siguiente</span>
                <span className="system-nav__title">{next.title}</span>
              </span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                <path d="M5 12h14M14 5l7 7-7 7"/>
              </svg>
            </Link>
          ) : <div />}
        </div>
      </div>
    </nav>
  );
}
