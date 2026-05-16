import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAdjacentSystemsGlobal } from '../../data/systems.js';

export default function QuickNav({ categoryId, slug }) {
  const navigate = useNavigate();
  const { prev, next } = getAdjacentSystemsGlobal(categoryId, slug);

  const go = (system) => {
    navigate(`/sistemas/${system.categoryId}/${system.slug}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="quick-nav" aria-label="Navegación rápida entre sistemas">
      <button
        className={`quick-nav__btn quick-nav__btn--prev${!prev ? ' quick-nav__btn--hidden' : ''}`}
        onClick={() => prev && go(prev)}
        aria-label={prev ? `Anterior: ${prev.title}` : 'Sin sistema anterior'}
        disabled={!prev}
      >
        <span className="quick-nav__arrow">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
        </span>
        {prev && <span className="quick-nav__label">{prev.title}</span>}
      </button>

      <button
        className={`quick-nav__btn quick-nav__btn--next${!next ? ' quick-nav__btn--hidden' : ''}`}
        onClick={() => next && go(next)}
        aria-label={next ? `Siguiente: ${next.title}` : 'Sin sistema siguiente'}
        disabled={!next}
      >
        {next && <span className="quick-nav__label">{next.title}</span>}
        <span className="quick-nav__arrow">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </span>
      </button>
    </div>
  );
}
