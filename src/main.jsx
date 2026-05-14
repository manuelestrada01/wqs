import './styles/index.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Register ONCE before any component uses them
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

import App from './App.jsx';

createRoot(document.getElementById('root')).render(<App />);
