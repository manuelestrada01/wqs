import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';

export default function PageTransition({ children }) {
  const wrapRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      wrapRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, ease: 'power2.out' }
    );
  }, { scope: wrapRef });

  return (
    <div ref={wrapRef} className="page-transition">
      {children}
    </div>
  );
}
