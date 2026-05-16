import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { getSystemBySlug, getAdjacentSystems } from '../data/systems.js';
import { useFramePreloader } from '../hooks/useFramePreloader.js';
import SystemSequence from '../components/SystemSequence/SystemSequence.jsx';
import LineDetail from '../components/LineDetail/LineDetail.jsx';
import SystemNav from '../components/SystemNav/SystemNav.jsx';
import QuickNav from '../components/QuickNav/QuickNav.jsx';
import PageTransition from '../components/PageTransition/PageTransition.jsx';

// Mini progress bar inline para páginas de sistema (no full-screen loader)
function SystemLoader({ progress, isLoaded }) {
  const barRef = useRef(null);

  useEffect(() => {
    if (isLoaded && barRef.current) {
      gsap.to(barRef.current, { autoAlpha: 0, duration: 0.4, delay: 0.3 });
    }
  }, [isLoaded]);

  return (
    <div ref={barRef} className="system-loader" aria-hidden="true">
      <div className="system-loader__track">
        <div className="system-loader__fill" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
    </div>
  );
}

export default function SystemPage() {
  const { categoria, slug } = useParams();
  const { system, category } = getSystemBySlug(categoria, slug);
  const { images, progress, isLoaded } = useFramePreloader(system?.sequence ?? null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isLoaded) setReady(true);
  }, [isLoaded]);

  // 404
  if (!system || !category) {
    return (
      <div className="not-found">
        <h1>Sistema no encontrado</h1>
        <Link to="/" className="btn btn--primary">Volver al inicio</Link>
      </div>
    );
  }

  // Sin sequence → placeholder "Próximamente"
  if (!system.sequence) {
    return (
      <PageTransition>
        <section className="section section--coming-soon">
          <div className="container">
            <span className="section__eyebrow">{system.tag}</span>
            <h1 className="section__title">{system.title}</h1>
            <p className="section__sub">Próximamente. Estamos preparando la experiencia completa para este sistema.</p>
            <Link to="/#products" className="btn btn--primary" style={{ marginTop: '2rem' }}>
              Ver todos los sistemas
            </Link>
          </div>
        </section>
      </PageTransition>
    );
  }

  const { prev, next } = getAdjacentSystems(categoria, slug);
  const sectionId = `system-${slug}`;

  return (
    <PageTransition>
      <QuickNav categoryId={categoria} slug={slug} />
      <SystemLoader progress={progress} isLoaded={isLoaded} />
      <SystemSequence
        systemData={system}
        images={images}
        ready={ready}
        sectionId={sectionId}
      />
      {system.detail && (
        <LineDetail {...system.detail} />
      )}
      <SystemNav
        prev={prev}
        next={next}
        categoryId={categoria}
        categoryLabel={category.categoryLabel}
      />
    </PageTransition>
  );
}
