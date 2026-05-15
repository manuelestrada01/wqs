import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from '../../js/utils.js';

export const SCROLL_DISTANCE = 3500;
const FRAME_COUNT = 137;

const OVERLAYS = [
  { selector: '.overlay--title',    frameIn: 0,   frameOut: 22  },
  { selector: '.overlay--thermal',  frameIn: 27,  frameOut: 49  },
  { selector: '.overlay--security', frameIn: 54,  frameOut: 76  },
  { selector: '.overlay--acoustic', frameIn: 81,  frameOut: 103 },
  { selector: '.overlay--design',   frameIn: 108, frameOut: 125 },
  { selector: '.overlay--wqs',      frameIn: 129, frameOut: 137 },
];

const DUR_IN  = 0.5;
const DUR_OUT = 0.3;

export default function Sequence({ images, ready }) {
  const sectionRef  = useRef(null);
  const canvasRef   = useRef(null);
  const progressRef = useRef(null);
  const stateRef    = useRef({ frame: 0 });

  // ── Canvas draw ────────────────────────────────────────────
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

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    resizeCanvas(canvasCtx, canvas);

    const gsapCtx = gsap.context(() => {

      // ── Image sequence scrub ────────────────────────────
      gsap.to(stateRef.current, {
        frame: FRAME_COUNT - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: '#sequence-section',
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

      // ── Overlays ────────────────────────────────────────
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
        trigger: '#sequence-section',
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

    }); // end gsap.context

    // Refresh after paint so pin measures correct layout
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
      id="sequence-section"
      ref={sectionRef}
      className="section section--sequence"
      aria-label="REHAU SYNEGO — recorrido visual del sistema de ventanas"
    >
      <canvas
        id="sequence-canvas"
        ref={canvasRef}
        aria-label="Animación del sistema de ventana REHAU SYNEGO mostrando sus componentes y ventajas"
      />

      <div className="sequence__overlays" aria-live="polite">
        <div className="overlay overlay--title" data-overlay="0" aria-hidden="true">
          <div className="overlay__content">
            <h2 className="overlay__headline">SYNEGO</h2>
            <p className="overlay__tagline">El sistema de alto rendimiento</p>
          </div>
        </div>
        <div className="overlay overlay--thermal" data-overlay="1" aria-hidden="true">
          <div className="overlay__content">
            <span className="overlay__num">01</span>
            <h2 className="overlay__headline">Aislamiento<br/>Térmico<br/>Superior</h2>
            <p className="overlay__body">Perfil multicámara de 70 mm con junta central de estanqueidad. Uw hasta 0,8 W/(m²K). Máxima eficiencia energética.</p>
          </div>
        </div>
        <div className="overlay overlay--security" data-overlay="2" aria-hidden="true">
          <div className="overlay__content">
            <span className="overlay__num">02</span>
            <h2 className="overlay__headline">Seguridad<br/>Multicámara</h2>
            <p className="overlay__body">Refuerzo de acero galvanizado integrado. Resistencia certificada clase RC2 contra intrusión.</p>
          </div>
        </div>
        <div className="overlay overlay--acoustic" data-overlay="3" aria-hidden="true">
          <div className="overlay__content">
            <span className="overlay__num">03</span>
            <h2 className="overlay__headline">Aislamiento<br/>Acústico</h2>
            <p className="overlay__body">Reducción de hasta 45 dB. Triple sellado perimetral continuo para máxima hermeticidad.</p>
          </div>
        </div>
        <div className="overlay overlay--design" data-overlay="4" aria-hidden="true">
          <div className="overlay__content">
            <span className="overlay__num">04</span>
            <h2 className="overlay__headline">Diseño de<br/>Precisión<br/>Alemana</h2>
            <p className="overlay__body">Ingeniería REHAU — más de 70 años liderando la industria global de sistemas de perfiles.</p>
          </div>
        </div>
        <div className="overlay overlay--wqs" data-overlay="5" aria-hidden="true">
          <div className="overlay__content">
            <p className="overlay__brand">WQS</p>
            <h2 className="overlay__headline">Tu fábrica<br/>argentina<br/>de aberturas</h2>
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
        <div className="sequence__progress-fill" ref={progressRef} id="seq-progress" />
      </div>
    </section>
  );
}
