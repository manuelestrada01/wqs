import React, { useState, useEffect } from 'react';
import Loader from './components/Loader/Loader.jsx';
import Navbar from './components/Navbar/Navbar.jsx';
import Hero from './components/Hero/Hero.jsx';
import Sequence from './components/Sequence/Sequence.jsx';
import LineDetail from './components/LineDetail/LineDetail.jsx';
import Products from './components/Products/Products.jsx';
import Rehau from './components/Rehau/Rehau.jsx';
import Cotizaciones from './components/Cotizaciones/Cotizaciones.jsx';
import Footer from './components/Footer/Footer.jsx';
import SequenceEuro, { preloadEuroFrames } from './components/SequenceEuro/SequenceEuro.jsx';
import { preloadFrames } from './js/loader.js';

const SYNEGO_DETAIL = {
  id: 'synego-detail',
  eyebrow: 'REHAU SYNEGO',
  title: 'Alto rendimiento en cada detalle',
  lead: 'Sistema de perfilería de PVC multicámara de 70mm. Tecnología alemana con más de 70 años de experiencia, fabricado localmente por WQS.',
  accent: 'walnut',
  specs: [
    { label: 'Espesor de perfilería', value: '70mm' },
    { label: 'Aislamiento térmico Uw', value: '0.8' },
    { label: 'Reducción acústica', value: '45dB' },
    { label: 'Garantía', value: '25 años' },
  ],
  features: [
    { num: '01', title: 'Triple sellado perimetral', desc: 'Junta central de estanqueidad y triple sellado continuo para máxima hermeticidad.' },
    { num: '02', title: 'Rotura de puente térmico', desc: 'Cámara multicámara con perfil de acero galvanizado integrado. Certificación RC2 contra intrusión.' },
    { num: '03', title: 'Diseño de línea fina', desc: 'Visibilidad máxima, mínima interferencia visual. Compatible con vidrios hasta 40mm de espesor.' },
  ],
};

const EURO_DETAIL = {
  id: 'euro-detail',
  eyebrow: 'Euro Design 70',
  title: 'Diseño europeo. Fabricación argentina.',
  lead: 'Perfilería de aluminio de alta precisión con rotura de puente térmico integrada. La estética contemporánea de línea fina con el respaldo de manufactura local WQS.',
  accent: 'carbon',
  specs: [
    { label: 'Espesor de perfil', value: '70mm' },
    { label: 'Vidrios compatibles', value: '40mm' },
    { label: 'Aperturas', value: '3' },
    { label: 'Material', value: 'Al' },
  ],
  features: [
    { num: '01', title: 'Aluminio de precisión', desc: 'Perfil de alta resistencia con rotura de puente térmico integrada para máxima eficiencia energética.' },
    { num: '02', title: 'Triple apertura', desc: 'Corrediza, batiente y proyectante en un mismo sistema. Máxima versatilidad para cualquier proyecto.' },
    { num: '03', title: 'Vidrios de alto espesor', desc: 'Compatible con vidrios hasta 40mm. Acepta doble y triple vidriado hermético para aislamiento superior.' },
  ],
};

export default function App() {
  const [images, setImages]         = useState(null);
  const [imagesEuro, setImagesEuro] = useState(null);
  const [progress, setProgress]     = useState(0);
  const [ready, setReady]           = useState(false);

  useEffect(() => {
    // Load SYNEGO frames first (show loader), then Euro frames silently in background
    preloadFrames((p) => setProgress(p)).then((imgs) => {
      setImages(imgs);
      // Start Euro frames after main sequence is ready — no loader block
      preloadEuroFrames(() => {}).then(setImagesEuro);
    });
  }, []);

  function handleLoaderDone() {
    setReady(true);
    document.body.classList.add('is-ready');
  }

  return (
    <>
      <Loader progress={progress} images={images} onDone={handleLoaderDone} />
      <Navbar ready={ready} />
      <main>
        <Hero ready={ready} />
        <Products ready={ready} />
        <Sequence images={images} ready={ready} />
        <LineDetail {...SYNEGO_DETAIL} />
        <SequenceEuro images={imagesEuro} ready={ready} />
        <LineDetail {...EURO_DETAIL} />
        <Rehau ready={ready} />
        <Cotizaciones />
      </main>
      <Footer />
    </>
  );
}
