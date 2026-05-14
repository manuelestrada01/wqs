import './styles/index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Disable browser scroll restoration — prevents restored scroll position
// from conflicting with GSAP pin initialization on reload/navigation.
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

// Register ONCE before any component uses them
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// Expose ScrollTrigger globally so utils.js scrollToSection can access it
window.__gsapPlugins__ = { ScrollTrigger };

import { router } from './router.jsx';

createRoot(document.getElementById('root')).render(<RouterProvider router={router} />);
