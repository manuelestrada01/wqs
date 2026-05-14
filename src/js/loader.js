/**
 * loader.js — Frame preloader
 * Loads all 224 JPEG frames, calls onProgress(0→1) as they load.
 * Returns a Promise<Image[]> resolving when all frames are ready.
 *
 * Mobile optimization: loads every 2nd frame to halve RAM usage.
 * Missing frames fall back to nearest loaded neighbor in sequence.js.
 */

const FRAME_COUNT = 224;
const FRAME_BASE = '/frames/ezgif-frame-';

export function preloadFrames(onProgress) {
  return new Promise((resolve) => {
    const images = new Array(FRAME_COUNT);

    // On mobile (<768px): load every other frame → 112 images, ~4MB instead of 8MB
    const isMobile = window.innerWidth < 768;
    const step = isMobile ? 2 : 1;
    const totalToLoad = Math.ceil(FRAME_COUNT / step);
    let loaded = 0;

    for (let i = 0; i < FRAME_COUNT; i += step) {
      const img = new Image();
      img.decoding = 'async'; // don't block main thread
      img.fetchPriority = i < 20 ? 'high' : 'auto'; // boost first 20 frames
      img.src = `${FRAME_BASE}${String(i + 1).padStart(3, '0')}.jpg`;

      // Store at index i
      images[i] = img;

      // On mobile: fill the gap between this and next loaded frame
      // so sequence.js can always find images[frame] without null check
      if (step === 2 && i > 0) {
        images[i - 1] = images[i]; // frame i-1 uses same img as frame i
      }

      img.onload = img.onerror = () => {
        loaded++;

        // Fill the trailing neighbor on mobile
        if (step === 2 && i + 1 < FRAME_COUNT) {
          images[i + 1] = img;
        }

        onProgress(loaded / totalToLoad);

        if (loaded >= totalToLoad) {
          resolve(images);
        }
      };
    }

    // Edge case: if step=1 and all images somehow already loaded
    if (totalToLoad === 0) resolve(images);
  });
}
