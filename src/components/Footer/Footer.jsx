import React, { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

export default function Footer() {
  const footerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.footer__brand, .footer__nav, .footer__contact', {
      opacity: 0, y: 24, stagger: 0.12, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: '#footer', start: 'top 90%', once: true },
    });
    gsap.from('.footer__bottom', {
      opacity: 0, duration: 0.6, delay: 0.5, ease: 'power1.out',
      scrollTrigger: { trigger: '#footer', start: 'top 90%', once: true },
    });
  }, { scope: footerRef });

  return (
    <footer id="footer" ref={footerRef} className="footer" role="contentinfo">
      <div className="footer__accent-bar" aria-hidden="true" />

      <div className="footer__inner">
        <div className="footer__brand">
          <a href="/" className="footer__logo-link" aria-label="WQS — inicio">
            <img src="/wqs-logo-blanco.png" alt="WQS Windows Quality System" width="80" height="27" className="footer__logo" />
          </a>
          <p className="footer__tagline">
            Windows Quality System<br/>
            <span>Buenos Aires, Argentina</span>
          </p>
          <p className="footer__rehau">Distribuidor autorizado <strong>REHAU</strong></p>
        </div>

        <nav className="footer__nav" aria-label="Navegación de pie de página">
          <p className="footer__col-label">Líneas</p>
          <ul role="list">
            {['corrediza','plegadiza','oscilobatiente','puertas','cotizaciones'].map(id => (
              <li key={id}>
                <a href={`#${id}`}>
                  <span className="footer__nav-arrow">→</span>
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__contact">
          <p className="footer__col-label">Contacto</p>
          <ul role="list" className="footer__contact-list">
            <li>
              <a href="mailto:info@wqs.com.ar" className="footer__contact-link">
                <span className="footer__contact-icon">✉</span>
                info@wqs.com.ar
              </a>
            </li>
            <li>
              <a href="tel:+541112345678" className="footer__contact-link">
                <span className="footer__contact-icon">✆</span>
                +54 11 1234-5678
              </a>
            </li>
            <li className="footer__contact-addr">
              Buenos Aires,<br/>Argentina
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <p className="footer__copy">© 2026 WQS — Windows Quality System. Todos los derechos reservados.</p>
        <a
          href="https://m-estrada.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="footer__credit"
          aria-label="Portfolio de Manuel Estrada"
        >
          design by <span>Manuel Estrada</span>
          <svg className="footer__credit-arrow" width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M1 9L9 1M9 1H3M9 1V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </div>
    </footer>
  );
}
