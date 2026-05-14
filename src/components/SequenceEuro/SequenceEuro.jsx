import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from '../../js/utils.js';

const SCROLL_DISTANCE = 3500;
const FRAME_COUNT     = 49;
const FRAME_BASE      = '/frames-euro/euro-frame-';

const OVERLAYS = [
  { selector: '.overlay-euro--title',   frameIn: 0,  frameOut: 10 },
  { selector: '.overlay-euro--feat1',   frameIn: 13, frameOut: 25 },
  { selector: '.overlay-euro--feat2',   frameIn: 28, frameOut: 38 },
  { selector: '.overlay-euro--cta',     frameIn: 41, frameOut: 49 },
];

const DUR_IN  = 0.5;
const DUR_OUT = 0.3;

export function preloadEuroFrames(onProgress) {
  return new Promise((resolve) => {
    const images = new Array(FRAME_COUNT);
    const isMobile = window.innerWidth < 768;
    const step = isMobile ? 2 : 1;
    const totalToLoad = Math.ceil(FRAME_COUNT / step);
    let loaded = 0;

    for (let i = 0; i < FRAME_COUNT; i += step) {
      const img = new Image();
      img.decoding = 'async';
      img.fetchPriority = i < 5 ? 'high' : 'auto';
      img.src = `${FRAME_BASE}${String(i).padStart(3, '0')}.jpg`;
      images[i] = img;
      if (step === 2 && i > 0) images[i - 1] = img;

      img.onload = img.onerror = () => {
        loaded++;
        if (step === 2 && i + 1 < FRAME_COUNT) images[i + 1] = img;
        onProgress(loaded / totalToLoad);
        if (loaded >= totalToLoad) resolve(images);
      };
    }
    if (totalToLoad === 0) resolve(images);
  });
}

export default function SequenceEuro({ images, ready }) {
  const sectionRef  = useRef(null);
  const canvasRef   = useRef(null);
  const progressRef = useRef(null);
  const stateRef    = useRef({ frame: 0 });

  function drawFrame(index, ctx, canvas) {
    const img = images?.[index];
    if (!img?.complete || img.naturalWidth === 0) return;
    const cw = parseInt(canvas.style.width)  || window.innerWidth;
    const ch = parseInt(canvas.style.height) || window.innerHeight;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const sw = img.naturalWidth  * scale;
    const sh = img.naturalHeight * scale;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, (cw - sw) / 2, (ch - sh) / 2, sw, sh);
  }

  function resizeCanvas(ctx, canvas) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width  = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width  = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);
    drawFrame(Math.round(stateRef.current.frame), ctx, canvas);
  }

  useEffect(() => {
    if (!ready || !images) return;

    const canvas    = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    resizeCanvas(canvasCtx, canvas);

    const gsapCtx = gsap.context(() => {

      gsap.to(stateRef.current, {
        frame: FRAME_COUNT - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: '#euro-design',
          pin: true,
          scrub: 0.1,
          start: 'top top',
          end: `+=${SCROLL_DISTANCE}`,
          invalidateOnRefresh: true,
          onUpdate(self) {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
          },
        },
        onUpdate() {
          drawFrame(Math.round(stateRef.current.frame), canvasCtx, canvas);
        },
      });

      const overlayStates = OVERLAYS.map(({ selector, frameIn, frameOut }) => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const headline = el.querySelector('.overlay__headline');
        const body     = el.querySelector('.overlay__body');
        const num      = el.querySelector('.overlay__num');
        const brand    = el.querySelector('.overlay__brand');
        const tagline  = el.querySelector('.overlay__tagline');
        const cta      = el.querySelector('.overlay__cta');
        const staggerEls = [headline, num, brand, tagline, body, cta].filter(Boolean);
        gsap.set(el, { autoAlpha: 0 });
        gsap.set(staggerEls, { y: 24, autoAlpha: 0 });
        return { el, staggerEls, frameIn, frameOut, visible: false };
      }).filter(Boolean);

      ScrollTrigger.create({
        trigger: '#euro-design',
        start: 'top top',
        end: `+=${SCROLL_DISTANCE}`,
        onUpdate(self) {
          const currentFrame = Math.round(self.progress * (FRAME_COUNT - 1));
          overlayStates.forEach(state => {
            const shouldShow = currentFrame >= state.frameIn && currentFrame < state.frameOut;
            if (shouldShow && !state.visible) {
              state.visible = true;
              state.el.setAttribute('aria-hidden', 'false');
              state.el.classList.add('is-visible');
              gsap.killTweensOf([state.el, ...state.staggerEls]);
              gsap.to(state.el, { autoAlpha: 1, duration: DUR_IN, ease: 'power2.out' });
              gsap.to(state.staggerEls, { y: 0, autoAlpha: 1, duration: DUR_IN, stagger: 0.07, ease: 'power3.out' });
            } else if (!shouldShow && state.visible) {
              state.visible = false;
              state.el.setAttribute('aria-hidden', 'true');
              state.el.classList.remove('is-visible');
              gsap.killTweensOf([state.el, ...state.staggerEls]);
              gsap.to(state.el, { autoAlpha: 0, y: -12, duration: DUR_OUT, ease: 'power2.in' });
              gsap.to(state.staggerEls, { y: 24, autoAlpha: 0, duration: DUR_OUT });
              gsap.set(state.staggerEls, { y: 24, delay: DUR_OUT + 0.05 });
              gsap.set(state.el, { y: 0, delay: DUR_OUT + 0.05 });
            }
          });
        },
      });

    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    const onResize = debounce(() => {
      resizeCanvas(canvasCtx, canvas);
      ScrollTrigger.refresh();
    }, 150);
    window.addEventListener('resize', onResize);

    return () => {
      gsapCtx.revert();
      window.removeEventListener('resize', onResize);
    };
  }, [ready, images]);

  return (
    <section
      id="euro-design"
      ref={sectionRef}
      className="section section--sequence"
      aria-label="Euro Design 70 — recorrido visual del sistema de ventanas"
    >
      <canvas
        id="sequence-euro-canvas"
        ref={canvasRef}
        aria-label="Animación del sistema de ventana Euro Design 70"
      />

      <div className="sequence__overlays" aria-live="polite">

        <div className="overlay overlay-euro--title" aria-hidden="true">
          <div className="overlay__content">
            <p className="overlay__brand">REHAU</p>
            <h2 className="overlay__headline">Euro<br/>Design 70</h2>
            <p className="overlay__tagline">Diseño europeo. Fabricación argentina.</p>
          </div>
        </div>

        <div className="overlay overlay-euro--feat1" aria-hidden="true">
          <div className="overlay__content">
            <span className="overlay__num">01</span>
            <h2 className="overlay__headline">Perfil<br/>Europeo<br/>70mm</h2>
            <p className="overlay__body">
              Perfilería de aluminio de alta precisión.
              Rotura de puente térmico integrada. Diseño contemporáneo de línea fina.
            </p>
          </div>
        </div>

        <div className="overlay overlay-euro--feat2" aria-hidden="true">
          <div className="overlay__content">
            <span className="overlay__num">02</span>
            <h2 className="overlay__headline">Versatilidad<br/>Total</h2>
            <p className="overlay__body">
              Compatible con vidrios hasta 40mm de espesor.
              Apertura corrediza, batiente y proyectante en un mismo sistema.
            </p>
          </div>
        </div>

        <div className="overlay overlay-euro--cta" aria-hidden="true">
          <div className="overlay__content">
            <p className="overlay__brand">Euro Design 70</p>
            <h2 className="overlay__headline">Fabricado<br/>en Argentina</h2>
            <a href="#cotizaciones" className="btn btn--primary overlay__cta">
              Solicitar cotización
              <svg className="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </a>
          </div>
        </div>

      </div>

      <div className="sequence__progress" aria-hidden="true">
        <div className="sequence__progress-fill" ref={progressRef} />
      </div>
    </section>
  );
}
