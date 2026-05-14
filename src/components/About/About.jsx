import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const MILESTONES = [
  {
    year: '2005',
    title: 'Fundación',
    desc: 'Inauguramos nuestra primera planta con el compromiso de fabricar aberturas de alto rendimiento en Argentina.',
  },
  {
    year: 'REHAU',
    title: 'Alianza tecnológica',
    desc: 'Incorporamos el sistema SYNEGO de REHAU, tecnología europea líder en perfiles de aluminio de alta prestación.',
  },
  {
    year: 'Mendoza',
    title: 'Expansión regional',
    desc: 'Radicación en Mendoza, consolidando presencia en el corredor cuyo y toda la región.',
  },
];

const STATS = [
  { value: '+20', label: 'años de experiencia' },
  { value: '+500', label: 'proyectos realizados' },
  { value: '3', label: 'provincias con presencia' },
];

export default function About({ ready }) {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!ready) return;
    const el = sectionRef.current;

    gsap.from(el.querySelector('.about__header'), {
      y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 78%', once: true },
    });

    gsap.from(el.querySelectorAll('.about__stat'), {
      y: 20, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el.querySelector('.about__stats'), start: 'top 82%', once: true },
    });

    gsap.from(el.querySelectorAll('.about__row'), {
      y: 24, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el.querySelector('.about__timeline'), start: 'top 82%', once: true },
    });
  }, { scope: sectionRef, dependencies: [ready] });

  return (
    <section
      id="quienes-somos"
      ref={sectionRef}
      className="section section--about"
      aria-label="Quiénes somos"
    >
      <div className="about__inner">

        <div className="about__header">
          <span className="section__eyebrow">Quiénes somos</span>
          <h2 className="about__title">
            Veinte años<br/>fabricando<br/><em>calidad</em>
          </h2>
          <p className="about__lead">
            WQS nació con una visión clara: llevar aberturas de aluminio de primer nivel al mercado argentino, con tecnología global y fabricación local.
          </p>
          <div className="about__stats" aria-label="Estadísticas">
            {STATS.map(({ value, label }) => (
              <div className="about__stat" key={label}>
                <span className="about__stat-value">{value}</span>
                <span className="about__stat-label">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about__timeline" aria-label="Hitos">
          {MILESTONES.map(({ year, title, desc }, i) => (
            <div className="about__row" key={i}>
              <span className="about__row-year">{year}</span>
              <span className="about__row-title">{title}</span>
              <p className="about__row-desc">{desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
