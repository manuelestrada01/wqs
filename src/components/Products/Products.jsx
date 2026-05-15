import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SYSTEMS } from '../../data/systems.js';

// SVG placeholders para sistemas sin imagen (inline JSX, no puede ir en systems.js)
const SVG_PLACEHOLDERS = {
  'plegadiza': (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="10" width="70" height="60" rx="2"/>
      <line x1="24" y1="10" x2="24" y2="70"/>
      <line x1="43" y1="10" x2="43" y2="70"/>
      <line x1="62" y1="10" x2="62" y2="70"/>
      <path d="M5 40 L24 35 L43 40 L62 35 L75 40"/>
    </svg>
  ),
  'puertas': (
    <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="15" y="5" width="50" height="72" rx="2"/>
      <rect x="20" y="12" width="40" height="28" rx="1"/>
      <rect x="20" y="46" width="40" height="24" rx="1"/>
      <circle cx="58" cy="42" r="2.5" fill="currentColor"/>
    </svg>
  ),
};

// Adaptar SYSTEMS al formato de tabs/cards
const CATEGORIES = SYSTEMS.map(cat => ({
  id: cat.categoryId,
  label: cat.categoryLabel,
  lines: cat.systems.map(s => ({
    id: s.slug,
    title: s.title,
    subtitle: s.subtitle,
    desc: s.desc,
    tag: s.tag,
    featured: s.featured,
    img: s.img,
    svg: SVG_PLACEHOLDERS[s.slug] ?? null,
    route: s.sequence ? `/sistemas/${cat.categoryId}/${s.slug}` : null,
  })),
}));

export default function Products({ ready }) {
  const sectionRef   = useRef(null);
  const gridRef      = useRef(null);
  const switchingRef = useRef(false);
  const [activeTab, setActiveTab] = useState(0);

  function switchTab(idx) {
    if (idx === activeTab || switchingRef.current) return;
    switchingRef.current = true;
    gsap.to(gridRef.current, {
      opacity: 0, y: 8, duration: 0.18, ease: 'power2.in',
      onComplete: () => setActiveTab(idx),
    });
  }

  useEffect(() => {
    if (!switchingRef.current) return;
    const cards = gridRef.current?.querySelectorAll('.product-card');
    gsap.fromTo(gridRef.current,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.35, ease: 'power3.out' }
    );
    gsap.fromTo(cards,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.08, duration: 0.4, ease: 'power3.out',
        onComplete: () => { switchingRef.current = false; } }
    );
  }, [activeTab]);

  useGSAP(() => {
    if (!ready) return;

    gsap.from('.products__header', {
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.products__header', start: 'top 85%', once: true },
    });

    gsap.from('.products__tabs', {
      y: 20, opacity: 0, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: '.products__tabs', start: 'top 88%', once: true },
    });

    const cards = gridRef.current?.querySelectorAll('.product-card');
    ScrollTrigger.create({
      trigger: gridRef.current,
      start: 'top 82%',
      once: true,
      onEnter() {
        gsap.to(cards, { opacity: 1, y: 0, duration: 0.75, stagger: 0.12, ease: 'power3.out' });
      },
    });
  }, { scope: sectionRef, dependencies: [ready] });

  const currentLines = CATEGORIES[activeTab].lines;

  return (
    <section id="products" ref={sectionRef} className="section section--products" aria-label="Líneas de productos WQS">

      <div className="products__header section__header">
        <span className="section__eyebrow">Nuestros Sistemas</span>
        <h2 className="section__title">Soluciones para<br/>cada proyecto</h2>
        <p className="section__sub">Aberturas de aluminio de alto rendimiento fabricadas con tecnología REHAU.</p>
      </div>

      <div className="products__tabs" role="tablist" aria-label="Categorías de productos">
        {CATEGORIES.map((cat, i) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeTab === i}
            className={`products__tab${activeTab === i ? ' is-active' : ''}`}
            onClick={() => switchTab(i)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="products__grid" ref={gridRef} role="tabpanel">
        {currentLines.map(p => {
          const inner = (
            <>
              <div className="product-card__visual">
                <div className="product-card__img-wrap">
                  {p.img
                    ? <img src={p.img} alt={p.title} />
                    : <div className="product-card__placeholder" aria-hidden="true">{p.svg}</div>
                  }
                </div>
                <div className="product-card__tag-wrap">
                  <span className={`product-card__tag${p.featured ? ' product-card__tag--featured' : ''}`}>
                    {p.tag}
                  </span>
                </div>
              </div>
              <div className="product-card__body">
                <h3 className="product-card__title">{p.title}</h3>
                {p.subtitle && <p className="product-card__subtitle">{p.subtitle}</p>}
                <p className="product-card__desc">{p.desc}</p>
                <span className="product-card__cta" aria-hidden="true">
                  {p.route ? 'Ver sistema →' : 'Próximamente'}
                </span>
              </div>
            </>
          );

          return p.route ? (
            <Link
              key={p.id}
              to={p.route}
              className={`product-card${p.featured ? ' product-card--featured' : ''}`}
              aria-label={`Ver sistema ${p.title}`}
            >
              {inner}
            </Link>
          ) : (
            <article
              key={p.id}
              id={p.id}
              className={`product-card product-card--soon${p.featured ? ' product-card--featured' : ''}`}
            >
              {inner}
            </article>
          );
        })}
      </div>

    </section>
  );
}
