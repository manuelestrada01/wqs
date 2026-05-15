import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Loader from '../components/Loader/Loader.jsx';
import Hero from '../components/Hero/Hero.jsx';
import About from '../components/About/About.jsx';
import HomeSequence from '../components/HomeSequence/HomeSequence.jsx';
import Products from '../components/Products/Products.jsx';
import Cotizaciones from '../components/Cotizaciones/Cotizaciones.jsx';
import { preloadFrames } from '../js/loader.js';

export default function HomePage() {
  const [images,   setImages]   = useState(null);
  const [progress, setProgress] = useState(0);
  const [ready,    setReady]    = useState(false);
  const location = useLocation();

  useEffect(() => {
    preloadFrames((p) => setProgress(p)).then(setImages);
  }, []);

  function handleLoaderDone() {
    setReady(true);
    document.body.classList.add('is-ready');
  }

  // Scroll to target section after loader finishes (when navigating from system pages)
  useEffect(() => {
    if (!ready) return;
    const target = location.state?.scrollTo;
    if (!target) return;
    const t = setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    }, 150);
    return () => clearTimeout(t);
  }, [ready]);

  return (
    <>
      <Loader progress={progress} images={images} onDone={handleLoaderDone} />
      <Hero ready={ready} />
      <About ready={ready} />
      <HomeSequence images={images} ready={ready} />
      <Products ready={ready} />
<Cotizaciones />
    </>
  );
}
