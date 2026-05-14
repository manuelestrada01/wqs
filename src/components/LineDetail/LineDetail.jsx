import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

/**
 * LineDetail — Full-width info section shown after a scroll sequence.
 * Props:
 *   id         string   — section id
 *   eyebrow    string
 *   title      string   — supports <br/> via array
 *   lead       string
 *   specs      [{ label, value }]
 *   features   [{ num, title, desc }]
 *   cta        string   — button label
 *   accent     'walnut' | 'carbon'  — bg variant
 */
export default function LineDetail({
  id,
  eyebrow,
  title,
  lead,
  specs = [],
  features = [],
  cta = 'Solicitar cotización',
  accent = 'walnut',
}) {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const el = sectionRef.current;

    gsap.from(el.querySelector('.line-detail__header'), {
      y: 50, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 80%', once: true },
    });

    gsap.from(el.querySelectorAll('.line-detail__spec'), {
      y: 30, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el.querySelector('.line-detail__specs'), start: 'top 82%', once: true },
    });

    gsap.from(el.querySelectorAll('.line-detail__feat'), {
      y: 40, opacity: 0, stagger: 0.12, duration: 0.75, ease: 'power3.out',
      scrollTrigger: { trigger: el.querySelector('.line-detail__features'), start: 'top 82%', once: true },
    });

    gsap.from(el.querySelector('.line-detail__cta-wrap'), {
      y: 20, opacity: 0, duration: 0.6, ease: 'power3.out',
      scrollTrigger: { trigger: el.querySelector('.line-detail__cta-wrap'), start: 'top 90%', once: true },
    });
  }, { scope: sectionRef });

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`section line-detail line-detail--${accent}`}
      aria-label={eyebrow}
    >
      <div className="line-detail__inner">

        <div className="line-detail__header">
          <span className="section__eyebrow">{eyebrow}</span>
          <h2 className="line-detail__title">{title}</h2>
          <p className="line-detail__lead">{lead}</p>
        </div>

        {specs.length > 0 && (
          <dl className="line-detail__specs">
            {specs.map(({ label, value }) => (
              <div className="line-detail__spec" key={label}>
                <dd className="line-detail__spec-value">{value}</dd>
                <dt className="line-detail__spec-label">{label}</dt>
              </div>
            ))}
          </dl>
        )}

        {features.length > 0 && (
          <div className="line-detail__features">
            {features.map(({ num, title: ftitle, desc }) => (
              <div className="line-detail__feat" key={num}>
                <span className="line-detail__feat-num">{num}</span>
                <div>
                  <h3 className="line-detail__feat-title">{ftitle}</h3>
                  <p className="line-detail__feat-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="line-detail__cta-wrap">
          <a href="/#cotizaciones" className="btn btn--primary">
            {cta}
            <svg className="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M7 17L17 7M17 7H7M17 7V17"/>
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}
