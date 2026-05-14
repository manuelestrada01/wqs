import { useState, useEffect, useRef } from 'react';

/**
 * useFramePreloader — carga frames de una secuencia de imágenes.
 * @param {object|null} sequenceConfig  — config del sistema (de systems.js). null = no carga nada.
 * @returns {{ images: Image[]|null, progress: number, isLoaded: boolean }}
 */
export function useFramePreloader(sequenceConfig) {
  const [images,   setImages]   = useState(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    setImages(null);
    setProgress(0);
    setIsLoaded(false);

    if (!sequenceConfig) return;

    const { frameBase, frameCount, frameExt, framePad, frameStart, scrollDistance: _ } = sequenceConfig;
    const imgs     = new Array(frameCount);
    const isMobile = window.innerWidth < 768;
    const step     = isMobile ? 2 : 1;
    const total    = Math.ceil(frameCount / step);
    let loaded     = 0;

    for (let i = 0; i < frameCount; i += step) {
      const img      = new Image();
      img.decoding   = 'async';
      img.fetchPriority = i < 10 ? 'high' : 'auto';
      img.src        = `${frameBase}${String(i + frameStart).padStart(framePad, '0')}${frameExt}`;
      imgs[i]        = img;

      // Rellena el gap en mobile para que siempre exista imgs[frame]
      if (step === 2 && i > 0) imgs[i - 1] = img;

      img.onload = img.onerror = () => {
        if (!isMounted.current) return;
        loaded++;
        if (step === 2 && i + 1 < frameCount) imgs[i + 1] = img;
        setProgress(loaded / total);
        if (loaded >= total) {
          setImages(imgs);
          setIsLoaded(true);
        }
      };
    }

    if (total === 0) {
      setImages(imgs);
      setIsLoaded(true);
    }

    return () => {
      isMounted.current = false;
    };
  }, [sequenceConfig]);

  return { images, progress, isLoaded };
}
