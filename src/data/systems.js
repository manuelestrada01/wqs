/**
 * systems.js — Fuente única de verdad para categorías y sistemas de productos WQS.
 * Alimenta: Products (cards), router (rutas), SystemPage (sequence + detail).
 */

export const SYSTEMS = [
  {
    categoryId: 'corredizas',
    categoryLabel: 'Corredizas',
    systems: [
      {
        slug: 'synego-slide',
        title: 'Synego Slide',
        subtitle: 'Línea Corrediza',
        tag: 'Sistema',
        featured: false,
        desc: 'Máxima apertura de vano con movimiento suave y silencioso. Perfiles de aluminio con rotura de puente térmico.',
        img: '/images/716-d010-118230.png',
        sequence: {
          frameBase: '/frames/ezgif-frame-',
          frameCount: 137,
          frameExt: '.jpg',
          framePad: 3,
          frameStart: 1,     // primer índice: 001
          scrollDistance: 3500,
        },
        overlays: [
          {
            id: 'title',
            cssClass: 'overlay--title',
            position: 'center',
            frameIn: 0,   frameOut: 22,
            brand: 'REHAU',
            headline: 'SYNEGO',
            tagline: 'El sistema de alto rendimiento',
          },
          {
            id: 'thermal',
            cssClass: 'overlay--thermal',
            position: 'bottom-left',
            frameIn: 27,  frameOut: 49,
            num: '01',
            headline: 'Aislamiento\nTérmico\nSuperior',
            body: 'Perfil multicámara de 70 mm con junta central de estanqueidad. Uw hasta 0,8 W/(m²K). Máxima eficiencia energética.',
          },
          {
            id: 'security',
            cssClass: 'overlay--security',
            position: 'bottom-right',
            frameIn: 54,  frameOut: 76,
            num: '02',
            headline: 'Seguridad\nMulticámara',
            body: 'Refuerzo de acero galvanizado integrado. Resistencia certificada clase RC2 contra intrusión.',
          },
          {
            id: 'acoustic',
            cssClass: 'overlay--acoustic',
            position: 'bottom-left',
            frameIn: 81,  frameOut: 103,
            num: '03',
            headline: 'Aislamiento\nAcústico',
            body: 'Reducción de hasta 45 dB. Triple sellado perimetral continuo para máxima hermeticidad.',
          },
          {
            id: 'design',
            cssClass: 'overlay--design',
            position: 'bottom-right',
            frameIn: 108, frameOut: 125,
            num: '04',
            headline: 'Diseño de\nPrecisión\nAlemana',
            body: 'Ingeniería REHAU — más de 70 años liderando la industria global de sistemas de perfiles.',
          },
          {
            id: 'wqs',
            cssClass: 'overlay--wqs',
            position: 'center-left',
            frameIn: 129, frameOut: 137,
            brand: 'WQS',
            headline: 'Tu fábrica\nargentina\nde aberturas',
            cta: { label: 'Solicitar cotización', href: '/#cotizaciones' },
          },
        ],
        detail: {
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
        },
      },
    ],
  },
  {
    categoryId: 'plegadizas',
    categoryLabel: 'Plegadizas',
    systems: [
      {
        slug: 'plegadiza',
        title: 'Plegadiza',
        subtitle: null,
        tag: 'Premium',
        featured: true,
        desc: 'Integración total entre interior y exterior. Hojas múltiples, apertura completa del vano. Diseño arquitectónico.',
        img: null,
        sequence: null,
        overlays: null,
        detail: null,
      },
    ],
  },
  {
    categoryId: 'oscilobatientes',
    categoryLabel: 'Oscilobatientes',
    systems: [
      {
        slug: 'euro-design-70',
        title: 'Euro Design 70',
        subtitle: 'Línea Oscilobatiente',
        tag: 'Sistema',
        featured: false,
        desc: 'Apertura batiente o microventilación con un solo herraje. Hermeticidad superior y doble función de apertura.',
        img: '/images/Gemini_Generated_Image_c75on3c75on3c75o.png',
        sequence: {
          frameBase: '/frames-euro/euro-frame-',
          frameCount: 49,
          frameExt: '.jpg',
          framePad: 3,
          frameStart: 0,     // primer índice: 000
          scrollDistance: 3500,
        },
        overlays: [
          {
            id: 'title',
            cssClass: 'overlay-euro--title',
            position: 'center',
            frameIn: 0,  frameOut: 10,
            brand: 'REHAU',
            headline: 'Euro\nDesign 70',
            tagline: 'Diseño europeo. Fabricación argentina.',
          },
          {
            id: 'feat1',
            cssClass: 'overlay-euro--feat1',
            position: 'bottom-left',
            frameIn: 13, frameOut: 25,
            num: '01',
            headline: 'Perfil\nEuropeo\n70mm',
            body: 'Perfilería de aluminio de alta precisión. Rotura de puente térmico integrada. Diseño contemporáneo de línea fina.',
          },
          {
            id: 'feat2',
            cssClass: 'overlay-euro--feat2',
            position: 'bottom-left',
            frameIn: 28, frameOut: 38,
            num: '02',
            headline: 'Versatilidad\nTotal',
            body: 'Compatible con vidrios hasta 40mm de espesor. Apertura corrediza, batiente y proyectante en un mismo sistema.',
          },
          {
            id: 'cta',
            cssClass: 'overlay-euro--cta',
            position: 'center-left',
            frameIn: 41, frameOut: 49,
            brand: 'Euro Design 70',
            headline: 'Fabricado\nen Argentina',
            cta: { label: 'Solicitar cotización', href: '/#cotizaciones' },
          },
        ],
        detail: {
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
        },
      },
    ],
  },
  {
    categoryId: 'puertas',
    categoryLabel: 'Puertas',
    systems: [
      {
        slug: 'puertas',
        title: 'Puertas',
        subtitle: null,
        tag: 'Sistema',
        featured: false,
        desc: 'Puertas de entrada en aluminio de alta resistencia. Sellado perimetral total. Seguridad y estética de primer nivel.',
        img: null,
        sequence: null,
        overlays: null,
        detail: null,
      },
    ],
  },
];

// ── Helpers ────────────────────────────────────────────────────

export function getAllCategories() {
  return SYSTEMS.map(c => ({ id: c.categoryId, label: c.categoryLabel }));
}

export function getSystemBySlug(categoryId, slug) {
  const category = SYSTEMS.find(c => c.categoryId === categoryId);
  if (!category) return { system: null, category: null };
  const system = category.systems.find(s => s.slug === slug) ?? null;
  return { system, category };
}

export function getCategorySystems(categoryId) {
  const cat = SYSTEMS.find(c => c.categoryId === categoryId);
  return cat ? cat.systems : [];
}

export function getAdjacentSystems(categoryId, slug) {
  const systems = getCategorySystems(categoryId);
  const idx = systems.findIndex(s => s.slug === slug);
  return {
    prev: idx > 0 ? systems[idx - 1] : null,
    next: idx < systems.length - 1 ? systems[idx + 1] : null,
    categoryId,
  };
}
