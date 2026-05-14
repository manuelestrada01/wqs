import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from '../../js/utils.js';

const SCROLL_DISTANCE = 3500;
const FRAME_COUNT     = 137;

// Overlays genéricos REHAU — sin mención de Synego
const HOME_OVERLAYS = [
  { selector: '.home-overlay--hero',    frameIn: 0,   frameOut: 22  },
  { selector: '.home-overlay--thermal', frameIn: 27,  frameOut: 50  },
  { selector: '.home-overlay--acoustic',frameIn: 55,  frameOut: 78  },
  { selector: '.home-overlay--security',frameIn: 83,  frameOut: 106 },
  { selector: '.home-overlay--cta',     frameIn: 112, frameOut: 137 },
];

const DUR_IN  = 0.5;
const DUR_OUT = 0.3;

export default function HomeSequence({ images, ready }) {
  const sectionRef  = useRef(null);
  const canvasRef   = useRef(null);
  const progressRef = useRef(null);
  const stateRef    = useRef({ frame: 0 });
  const gsapCtxRef  = useRef(null);

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

  // Synchronous cleanup on unmount — removes GSAP pin spacer before
  // React calls removeChild, preventing DOM hierarchy mismatch error.
  useLayoutEffect(() => {
    return () => {
      gsapCtxRef.current?.revert();
      gsapCtxRef.current = null;
    };
  }, []);

  // Async setup — runs after paint so scrollTo(0,0) has taken effect
  // before GSAP reads window.scrollY for pin position calculation.
  useEffect(() => {
    if (!ready || !images) return;

    gsapCtxRef.current?.revert();
    gsapCtxRef.current = null;
    stateRef.current.frame = 0;

    const canvas    = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    resizeCanvas(canvasCtx, canvas);

    const overlayStates = HOME_OVERLAYS.map(({ selector, frameIn, frameOut }) => {
      const el = sectionRef.current?.querySelector(selector);
      if (!el) return null;
      const headline   = el.querySelector('.overlay__headline');
      const body       = el.querySelector('.overlay__body');
      const num        = el.querySelector('.overlay__num');
      const brand      = el.querySelector('.overlay__brand');
      const tagline    = el.querySelector('.overlay__tagline');
      const cta        = el.querySelector('.overlay__cta');
      const staggerEls = [headline, num, brand, tagline, body, cta].filter(Boolean);
      gsap.set(el, { autoAlpha: 0 });
      gsap.set(staggerEls, { y: 24, autoAlpha: 0 });
      return { el, staggerEls, frameIn, frameOut, visible: false };
    }).filter(Boolean);

    function updateOverlays(currentFrame) {
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
    }

    const ctx = gsap.context(() => {
      gsap.to(stateRef.current, {
        frame: FRAME_COUNT - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: '#home-sequence',
          pin: true,
          scrub: 0.1,
          start: 'top top',
          end: `+=${SCROLL_DISTANCE}`,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate(self) {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
            updateOverlays(Math.round(self.progress * (FRAME_COUNT - 1)));
          },
          onRefresh(self) {
            updateOverlays(Math.round(self.progress * (FRAME_COUNT - 1)));
          },
        },
        onUpdate() {
          drawFrame(Math.round(stateRef.current.frame), canvasCtx, canvas);
        },
      });
    });

    gsapCtxRef.current = ctx;

    ScrollTrigger.refresh();

    const onResize = debounce(() => {
      resizeCanvas(canvasCtx, canvas);
      ScrollTrigger.refresh();
    }, 150);
    window.addEventListener('resize', onResize);

    return () => {
      ctx.revert();
      if (gsapCtxRef.current === ctx) gsapCtxRef.current = null;
      window.removeEventListener('resize', onResize);
    };
  }, [ready, images]);

  return (
    <section
      id="home-sequence"
      ref={sectionRef}
      className="section section--sequence"
      aria-label="Una ventana de posibilidades — tecnología REHAU"
    >
      <canvas
        id="home-sequence-canvas"
        ref={canvasRef}
        aria-label="Secuencia visual de sistemas de aberturas REHAU"
      />

      <div className="sequence__overlays" aria-live="polite">

        {/* Overlay 0 — Hero */}
        <div className="overlay home-overlay--hero overlay--title" data-overlay="0" aria-hidden="true">
          <div className="overlay__content">
            <p className="overlay__brand">REHAU</p>
            <h2 className="overlay__headline">Una ventana<br/>de posibilidades</h2>
            <p className="overlay__tagline">Tecnología alemana. Fabricación argentina.</p>
          </div>
        </div>

        {/* Overlay 1 — Aislamiento térmico */}
        <div className="overlay home-overlay--thermal overlay--thermal" data-overlay="1" aria-hidden="true">
          <div className="overlay__content">
            <span className="overlay__num">01</span>
            <h2 className="overlay__headline">Aislamiento<br/>Térmico<br/>Superior</h2>
            <p className="overlay__body">Perfiles multicámara que reducen hasta un 40% el consumo energético. Tu hogar más confortable en invierno y en verano.</p>
          </div>
        </div>

        {/* Overlay 2 — Acústico */}
        <div className="overlay home-overlay--acoustic overlay--acoustic" data-overlay="2" aria-hidden="true">
          <div className="overlay__content">
            <span className="overlay__num">02</span>
            <h2 className="overlay__headline">Silencio<br/>Absoluto</h2>
            <p className="overlay__body">Hasta 45 dB de reducción acústica. Triple sellado perimetral que transforma cualquier ambiente en un refugio de tranquilidad.</p>
          </div>
        </div>

        {/* Overlay 3 — Seguridad */}
        <div className="overlay home-overlay--security overlay--security" data-overlay="3" aria-hidden="true">
          <div className="overlay__content">
            <span className="overlay__num">03</span>
            <h2 className="overlay__headline">Seguridad<br/>y Durabilidad</h2>
            <p className="overlay__body">Refuerzos de acero galvanizado. Resistencia certificada contra intrusión. 25 años de garantía respaldados por tecnología REHAU.</p>
          </div>
        </div>

        {/* Overlay 4 — CTA sistemas */}
        <div className="overlay home-overlay--cta overlay--wqs" data-overlay="4" aria-hidden="true">
          <div className="overlay__content">
            <p className="overlay__brand">WQS</p>
            <h2 className="overlay__headline">Conoce<br/>nuestros<br/>sistemas</h2>
            <a href="#products" className="btn btn--primary overlay__cta">
              Ver sistemas
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
