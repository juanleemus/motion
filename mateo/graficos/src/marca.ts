// Marca Mateo Folador (brand-kits.json → mateo-folador, igual que el kit de edición v2).
export const C = {
  azul: '#1F8BFF',
  azulBrillo: '#4DA8FF',
  azulSuave: '#BEDEFF',
  tinta950: '#0A0F1A',
  tinta900: '#0F1623',
  tinta800: '#182030',
  tinta700: '#232C3D',
  tinta500: '#4A566B',
  tinta300: '#8C97AD',
  tinta100: '#D9DEE8',
  blanco: '#FFFFFF',
  coral: '#FF6B57',
  verde: '#2ECC8B',
  oro: '#F5C24A',
};

export const F = {
  display: '"Inter Tight", sans-serif',
  cuerpo: '"Inter", sans-serif',
  mono: '"JetBrains Mono", monospace',
};

// Geometría fija (1920×1080). El contenido vive SIEMPRE en esta zona, centrado; el círculo de Mateo a la derecha.
export const W = 1920;
export const H = 1080;
export const ZONA = {x: 110, y: 120, w: 1290, h: 840}; // izquierda del círculo, lejos de la barra de YouTube
export const CIRCULO = {cx: 1665, cy: 540, d: 420};

export const brillo = (c: string, a = 0.55) => `0 0 28px ${c}${Math.round(a * 255).toString(16).padStart(2, '0')}`;
