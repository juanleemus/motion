// Identidad visual JPR. Ningún color ni letra fuera de aquí.
export const C = {
  medianoche: '#0A1F44',
  electrico: '#2F5FFF',
  lima: '#C8F542',
  blanco: '#FFFFFF',
  gris: '#8A94A6',
} as const;

export const POPPINS = 'Poppins';
export const LORA = 'Lora';

// Zonas (px sobre 1080×1920).
export const ANCHO = 1080;
export const ALTO = 1920;
export const AREA_X = 110; // contenido entre x = 110 y 900
export const AREA_ANCHO = 790;
export const ZONA = {
  mitad: {arriba: 300, abajo: 900},
  completa: {arriba: 300, abajo: 1520},
} as const;
export const CORTE_MITAD = 960; // de aquí para abajo solo fondo en "mitad"

// Sombra suave (azul medianoche con transparencia: no es un color nuevo).
export const SOMBRA = '0 18px 44px rgba(10,31,68,0.14), 0 3px 10px rgba(10,31,68,0.08)';
