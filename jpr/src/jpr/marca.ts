import {staticFile} from 'remotion';

export const C = {
  medianoche: '#0A1F44',
  profundo: '#050E22',
  electrico: '#2F5FFF',
  lima: '#C8F542',
  blanco: '#FFFFFF',
  gris: '#8A94A6',
  sombra: 'rgba(10,31,68,0.18)',
};

// Curvas de la marca: entran rápido y frenan suave.
export const entrada = (t: number) => 1 - Math.pow(1 - Math.min(Math.max(t, 0), 1), 4);

const cargar = (familia: string, archivo: string, peso: string) => {
  if (typeof FontFace === 'undefined') return;
  const f = new FontFace(familia, `url(${staticFile(archivo)})`, {weight: peso});
  f.load().then((x) => document.fonts.add(x));
};
cargar('Poppins', 'poppins-latin-700-normal.ttf', '700');
cargar('Poppins', 'poppins-latin-800-normal.ttf', '800');
cargar('Anton', 'anton-latin-400-normal.ttf', '400');
cargar('Open Sans', 'open-sans-latin-400-normal.ttf', '400');
cargar('Open Sans', 'open-sans-latin-600-normal.ttf', '600');
