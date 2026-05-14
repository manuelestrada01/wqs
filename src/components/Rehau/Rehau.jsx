import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

const STATS = [
  { label: 'Ahorro energético',   count: 40,  suffix: '%'  },
  { label: 'Reducción acústica',  count: 45,  suffix: ' dB' },
  { label: 'Años de garantía',    count: 25,  suffix: ''   },
  { label: 'Proyectos realizados',count: 500, suffix: '+'  },
];

export default function Rehau({ ready }) {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!ready) return;

    gsap.from('.rehau__text', {
      x: -60, opacity: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#rehau', start: 'top 75%', once: true },
    });

    gsap.from('.stat', {
      opacity: 0, y: 30, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.rehau__stats', start: 'top 80%', once: true },
    });

    STATS.forEach(({ count, suffix }, i) => {
      const el  = sectionRef.current.querySelectorAll('.stat__value')[i];
      const obj = { val: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter() {
          gsap.to(obj, {
            val: count, duration: 2.2, ease: 'power2.out',
            onUpdate() {
              el.textContent = Math.round(obj.val) + suffix;
            },
          });
        },
      });
    });
  }, { scope: sectionRef, dependencies: [ready] });

  return (
    <section id="rehau" ref={sectionRef} className="section section--rehau" aria-label="Por qué elegir REHAU SYNEGO">
      <div className="rehau__inner">
        <div className="rehau__text">
          <span className="section__eyebrow">Tecnología Alemana</span>
          <h2 className="rehau__title">Por qué<br/><em>REHAU<br/>SYNEGO</em></h2>
          <p className="rehau__lead">
            La plataforma de perfiles más avanzada del mercado europeo,
            ahora disponible en Argentina a través de WQS —
            distribuidor autorizado con fabricación local.
          </p>
        </div>

        <dl className="rehau__stats" aria-label="Estadísticas de rendimiento REHAU SYNEGO">
          {STATS.map(({ label, count, suffix }) => (
            <div className="stat" key={label}>
              <dt className="stat__label">{label}</dt>
              <dd className="stat__value">0{suffix}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
