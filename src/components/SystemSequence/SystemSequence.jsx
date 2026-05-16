import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { debounce } from '../../utils.js';

const DUR_IN  = 0.5;
const DUR_OUT = 0.3;

export default function SystemSequence({ systemData, images, ready, sectionId }) {
  const sectionRef  = useRef(null);
  const canvasRef   = useRef(null);
  const progressRef = useRef(null);
  const stateRef    = useRef({ frame: 0 });
  const gsapCtxRef  = useRef(null);

  const { sequence, overlays } = systemData;
  const { frameCount, scrollDistance } = sequence;

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

  // ── Sync cleanup on unmount ────────────────────────────────────
  // Runs before React removes DOM nodes. GSAP pin spacer wraps the
  // section — revert() restores the original DOM so removeChild works.
  useLayoutEffect(() => {
    return () => {
      gsapCtxRef.current?.revert();
      gsapCtxRef.current = null;
    };
  }, []);

  // ── Async GSAP setup ───────────────────────────────────────────
  // useEffect runs after paint. At this point App.useEffect has already
  // called scrollTo(0,0). We call it again here for extra safety, then
  // init GSAP — which reads window.scrollY to calculate pin progress.
  useEffect(() => {
    if (!ready || !images) return;

    gsapCtxRef.current?.revert();
    gsapCtxRef.current = null;
    stateRef.current.frame = 0;

    // Hard scroll reset — must happen before GSAP reads scrollY
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    const canvas    = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');
    resizeCanvas(canvasCtx, canvas);

    // ── Overlay states ──────────────────────────────────────────
    const overlayStates = overlays.map(overlay => {
      const el = sectionRef.current?.querySelector(`[data-overlay-id="${overlay.id}"]`);
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
      return { el, staggerEls, frameIn: overlay.frameIn, frameOut: overlay.frameOut, visible: false };
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

    // ── GSAP context ────────────────────────────────────────────
    const ctx = gsap.context(() => {
      gsap.to(stateRef.current, {
        frame: frameCount - 1,
        snap: 'frame',
        ease: 'none',
        scrollTrigger: {
          trigger: `#${sectionId}`,
          pin: true,
          scrub: 0.1,
          start: 'top top',
          end: `+=${scrollDistance}`,
          invalidateOnRefresh: true,
          onUpdate(self) {
            if (progressRef.current) {
              progressRef.current.style.width = `${self.progress * 100}%`;
            }
            updateOverlays(Math.round(self.progress * (frameCount - 1)));
          },
          onRefresh(self) {
            updateOverlays(Math.round(self.progress * (frameCount - 1)));
          },
        },
        onUpdate() {
          drawFrame(Math.round(stateRef.current.frame), canvasCtx, canvas);
        },
      });
    });

    gsapCtxRef.current = ctx;

    // Refresh immediately — we're already post-paint in useEffect,
    // layout is settled, scroll is 0. No rAF needed.
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
  }, [ready, images, sectionId]);

  // ── Render ──────────────────────────────────────────────────────
  function renderOverlay(overlay) {
    const posClass = {
      'center':       'overlay--title',
      'bottom-left':  'overlay--thermal',
      'bottom-right': 'overlay--security',
      'center-left':  'overlay--wqs',
    }[overlay.position] ?? '';

    return (
      <div
        key={overlay.id}
        data-overlay-id={overlay.id}
        className={`overlay ${overlay.cssClass} ${posClass}`}
        aria-hidden="true"
      >
        <div className="overlay__content">
          {overlay.brand && (
            overlay.brand === 'REHAU'
              ? <img src="/rehau-logo.png" alt="REHAU" className="overlay__brand-logo" />
              : <p className="overlay__brand">{overlay.brand}</p>
          )}
          {overlay.num      && <span className="overlay__num">{overlay.num}</span>}
          <h2 className="overlay__headline">
            {overlay.headline.split('\n').map((line, i, arr) => (
              <React.Fragment key={i}>{line}{i < arr.length - 1 && <br/>}</React.Fragment>
            ))}
          </h2>
          {overlay.tagline  && <p className="overlay__tagline">{overlay.tagline}</p>}
          {overlay.body && <p className="overlay__body">{overlay.body}</p>}
          {overlay.cta  && (
            <a href={overlay.cta.href} className="btn btn--primary overlay__cta">
              {overlay.cta.label}
              <svg className="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <section
      id={sectionId}
      ref={sectionRef}
      className="section section--sequence"
      aria-label={`${systemData.title} — recorrido visual del sistema`}
    >
      <canvas
        ref={canvasRef}
        aria-label={`Animación del sistema ${systemData.title}`}
      />

      <div className="sequence__overlays" aria-live="polite">
        {overlays.map(renderOverlay)}
      </div>

      <div className="sequence__progress" aria-hidden="true">
        <div className="sequence__progress-fill" ref={progressRef} />
      </div>
    </section>
  );
}
