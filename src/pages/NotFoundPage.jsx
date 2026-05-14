import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <section className="section not-found" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div>
        <span className="section__eyebrow">404</span>
        <h1 className="section__title">Página no encontrada</h1>
        <p className="section__sub" style={{ marginBottom: '2rem' }}>El contenido que buscás no existe o fue movido.</p>
        <Link to="/" className="btn btn--primary">Volver al inicio</Link>
      </div>
    </section>
  );
}
