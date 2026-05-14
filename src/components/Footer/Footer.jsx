import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

export default function Footer() {
  const footerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.footer__brand, .footer__nav, .footer__legal', {
      opacity: 0, y: 20, stagger: 0.1, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: '#footer', start: 'top 90%', once: true },
    });
  }, { scope: footerRef });

  return (
    <footer id="footer" ref={footerRef} className="footer" role="contentinfo">
      <div className="footer__inner">
        <div className="footer__brand">
          <a href="/" className="footer__logo-link" aria-label="WQS — inicio">
            <img src="/wqs-logo.png" alt="WQS Windows Quality System" width="80" height="27" className="footer__logo" />
          </a>
          <p className="footer__tagline">
            Windows Quality System<br/>
            <span>Buenos Aires, Argentina</span>
          </p>
          <p className="footer__rehau">Distribuidor autorizado <strong>REHAU</strong></p>
        </div>

        <nav className="footer__nav" aria-label="Navegación de pie de página">
          <ul role="list">
            {['corrediza','plegadiza','oscilobatiente','puertas','cotizaciones'].map(id => (
              <li key={id}><a href={`#${id}`}>{id.charAt(0).toUpperCase() + id.slice(1)}</a></li>
            ))}
          </ul>
        </nav>

        <div className="footer__legal">
          <p>© 2026 WQS — Windows Quality System.</p>
          <p>Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
