import React, { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase.js';

export default function Cotizaciones() {
  const sectionRef = useRef(null);
  const [status, setStatus]       = useState('');
  const [submitting, setSubmitting] = useState(false);

  useGSAP(() => {
    gsap.from('.cta__headline', {
      opacity: 0, y: 50, duration: 1, ease: 'power4.out',
      scrollTrigger: { trigger: '#cotizaciones', start: 'top 75%', once: true },
    });
    gsap.from(['.cta__sub', '.cta__features'], {
      opacity: 0, y: 25, stagger: 0.1, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.cta__left', start: 'top 75%', once: true },
    });
    gsap.from('.quote-form', {
      opacity: 0, x: 30, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.quote-form', start: 'top 80%', once: true },
    });
  }, { scope: sectionRef });

  async function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const name    = form.querySelector('[name="name"]');
    const email   = form.querySelector('[name="email"]');
    let valid = true;

    [name, email].forEach(field => {
      const err = field.parentNode.querySelector('.form-field__error');
      if (!field.value.trim()) {
        err.textContent = 'Este campo es requerido';
        field.setAttribute('aria-invalid', 'true');
        valid = false;
      } else {
        err.textContent = '';
        field.removeAttribute('aria-invalid');
      }
    });
    if (!valid) { name.focus(); return; }

    setSubmitting(true);
    setStatus('');
    try {
      const data = Object.fromEntries(new FormData(form));
      await addDoc(collection(db, 'cotizaciones'), {
        ...data,
        createdAt: serverTimestamp(),
      });
      setStatus('success');
      form.reset();
    } catch {
      setStatus('error');
    } finally {
      setSubmitting(false);
    }
  }

  const CheckIcon = () => (
    <svg className="cta__feat-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
    </svg>
  );

  return (
    <section id="cotizaciones" ref={sectionRef} className="section section--cta" aria-label="Solicitar cotización">
      <div className="cta__noise" aria-hidden="true"></div>
      <div className="cta__inner">
        <div className="cta__left">
          <span className="section__eyebrow">Contacto</span>
          <h2 className="cta__headline">Hagamos<br/>tu proyecto<br/>realidad.</h2>
          <p className="cta__sub">Completá el formulario y un especialista WQS te contacta en 24 horas hábiles.</p>
          <div className="cta__features">
            {['Presupuesto sin cargo','Medición a domicilio','Instalación profesional'].map(f => (
              <div className="cta__feat" key={f}><CheckIcon /><span>{f}</span></div>
            ))}
          </div>
        </div>

        <form id="quote-form" className="quote-form" noValidate aria-label="Formulario de cotización WQS" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="field-name" className="form-field__label">
                Nombre completo <span className="form-field__req" aria-label="requerido">*</span>
              </label>
              <input type="text" id="field-name" name="name" className="form-field__input"
                autoComplete="name" required aria-required="true" placeholder="Juan García" />
              <span className="form-field__error" role="alert" aria-live="polite"></span>
            </div>
            <div className="form-field">
              <label htmlFor="field-email" className="form-field__label">
                Email <span className="form-field__req" aria-label="requerido">*</span>
              </label>
              <input type="email" id="field-email" name="email" className="form-field__input"
                autoComplete="email" required aria-required="true" placeholder="juan@empresa.com" />
              <span className="form-field__error" role="alert" aria-live="polite"></span>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="field-phone" className="form-field__label">Teléfono</label>
              <input type="tel" id="field-phone" name="phone" className="form-field__input"
                autoComplete="tel" placeholder="+54 11 1234-5678" />
            </div>
            <div className="form-field">
              <label htmlFor="field-product" className="form-field__label">Sistema de interés</label>
              <select id="field-product" name="product" className="form-field__input form-field__select">
                <option value="">Seleccionar...</option>
                <option value="corrediza">Corrediza</option>
                <option value="plegadiza">Plegadiza</option>
                <option value="oscilobatiente">Oscilobatiente</option>
                <option value="puertas">Puertas</option>
                <option value="varios">Varios / Proyecto completo</option>
              </select>
            </div>
          </div>
          <div className="form-field form-field--full">
            <label htmlFor="field-message" className="form-field__label">Descripción del proyecto</label>
            <textarea id="field-message" name="message" className="form-field__input form-field__textarea"
              rows={4} placeholder="Dimensiones aproximadas, cantidad de aberturas, tipo de obra, ubicación..."/>
          </div>

          <button type="submit" className="btn btn--primary form__submit" disabled={submitting}>
            <span className="form__submit-text">
              {submitting ? 'Enviando...' : 'Solicitar Cotización'}
            </span>
            {!submitting && (
              <svg className="btn__icon form__submit-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M7 17L17 7M17 7H7M17 7V17"/>
              </svg>
            )}
          </button>

          {status === 'success' && (
            <p className="form__status form__status--success" role="status">
              ¡Mensaje enviado! Te contactamos en 24 hs hábiles.
            </p>
          )}
          {status === 'error' && (
            <p className="form__status form__status--error" role="alert">
              Error al enviar. Intentá de nuevo o escribinos directamente.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
