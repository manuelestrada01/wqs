import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

const STATS = [
  { value: '+20', label: 'Años de experiencia' },
  { value: '+500', label: 'Proyectos realizados' },
  { value: '3', label: 'Provincias con presencia' },
];


export default function About({ ready }) {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!ready) return;
    const el = sectionRef.current;

    gsap.from(el.querySelector('.about__headline'), {
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 75%', once: true },
    });

    gsap.from(el.querySelectorAll('.about__stat'), {
      y: 20, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: el.querySelector('.about__stats'), start: 'top 85%', once: true },
    });


  }, { scope: sectionRef, dependencies: [ready] });

  return (
    <section
      id="quienes-somos"
      ref={sectionRef}
      className="section section--about"
      aria-label="Quiénes somos"
    >
      <div className="about__container">

        <div className="about__headline">
          <span className="section__eyebrow">Quiénes somos</span>
          <h2 className="about__title">
            Veinte años<br />fabricando<br /><em>calidad</em>
          </h2>
          <p className="about__lead">
            WQS nació con una visión clara: llevar aberturas de aluminio de primer nivel al mercado argentino, con tecnología global y fabricación local. Hoy somos referentes en el corredor cuyo, combinando más de veinte años de experiencia con los sistemas de perfiles REHAU —líderes en Europa— para ofrecer soluciones de alto rendimiento térmico, acústico y estructural en cada proyecto.
          </p>
        </div>

        <div className="about__stats" aria-label="Estadísticas">
          {STATS.map(({ value, label }) => (
            <div className="about__stat" key={label}>
              <span className="about__stat-value">{value}</span>
              <span className="about__stat-label">{label}</span>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}
