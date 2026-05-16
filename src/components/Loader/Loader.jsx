import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Loader({ progress, images, onDone }) {
  const loaderRef = useRef(null);
  const doneRef   = useRef(false);

  useEffect(() => {
    if (images && !doneRef.current) {
      doneRef.current = true;
      gsap.to(loaderRef.current, {
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power2.inOut',
        delay: 0.3,
        onComplete: () => {
          if (loaderRef.current) {
            loaderRef.current.style.display = 'none';
          }
          document.body.style.overflow = '';
          onDone();
        },
      });
    }
  }, [images]);

  const pct = Math.round(progress * 100);

  return (
    <div id="loader" ref={loaderRef} aria-hidden="true" role="status">
      <div className="loader__inner">
        <div className="loader__logo">
          <img src="/wqs-logo-blanco.png" alt="WQS" width="120" height="40" />
        </div>
        <div className="loader__track">
          <div
            className="loader__fill"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="loader__pct">{pct}%</span>
      </div>
    </div>
  );
}
