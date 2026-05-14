import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

export default function Hero({ ready }) {
  const sectionRef = useRef(null);

  useGSAP(() => {
    if (!ready) return;

    const eyebrow    = sectionRef.current.querySelector('.hero__eyebrow');
    const lines      = sectionRef.current.querySelectorAll('.hero__line');
    const sub        = sectionRef.current.querySelector('.hero__sub');
    const cta        = sectionRef.current.querySelector('.hero__cta');
    const scrollHint = sectionRef.current.querySelector('.hero__scroll-hint');
    const badge      = sectionRef.current.querySelector('.hero__badge');

    const splits  = Array.from(lines).map(line =>
      SplitText.create(line, { type: 'chars', charsClass: 'char' })
    );
    const allChars = splits.flatMap(s => s.chars);

    gsap.set('.hero__headline', { opacity: 1 });
    gsap.set(allChars, { yPercent: 110, rotateX: -80, opacity: 0, transformOrigin: 'bottom center' });

    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out' })
      .to(allChars, {
        yPercent: 0, rotateX: 0, opacity: 1,
        duration: 0.75,
        stagger: { amount: 0.7, from: 'start', ease: 'power1.inOut' },
        ease: 'power4.out',
      }, '-=0.3')
      .to(sub,        { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3')
      .to(cta,        { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(1.3)' }, '-=0.4')
      .to(scrollHint, { autoAlpha: 1, duration: 1, ease: 'power2.out' }, '-=0.3')
      .to(badge,      { autoAlpha: 1, duration: 1, ease: 'power2.out' }, '<');

    gsap.to('.hero__bg-img img', {
      yPercent: 35, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to('.hero__content', {
      yPercent: 15, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  }, { scope: sectionRef, dependencies: [ready] });

  return (
    <section id="hero" ref={sectionRef} className="section section--hero" aria-label="WQS — presentación">
      <div className="hero__bg-img" aria-hidden="true">
        <img src="/Gemini_Generated_Image_rhkk1grhkk1grhkk.png" alt="" />
      </div>
      <div className="hero__bg" aria-hidden="true"></div>
      <div className="hero__noise" aria-hidden="true"></div>

      <div className="hero__content">
        <p className="hero__eyebrow">Windows Quality System</p>
        <h1 className="hero__headline" aria-label="Precisión Alemana. Hecho en Argentina.">
          <span className="hero__line">Precisión</span>
          <span className="hero__line">Alemana.</span>
          <span className="hero__line hero__line--indent">Hecho en</span>
          <span className="hero__line">Argentina.</span>
        </h1>
        <p className="hero__sub">
          Sistemas de ventanas y puertas REHAU SYNEGO —<br />
          aislamiento térmico, acústico y seguridad multicámara<br />
          de clase mundial.
        </p>
        <a href="#cotizaciones" className="btn btn--primary hero__cta">
          Cotizar
          <svg className="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </a>
      </div>

      <div className="hero__scroll-hint" aria-hidden="true">
        <div className="scroll-hint__line"></div>
        <span className="scroll-hint__label">scroll</span>
      </div>

      <div className="hero__badge" aria-hidden="true">
        <span>REHAU</span>
        <span>SYNEGO</span>
        <span>System</span>
      </div>
    </section>
  );
}
