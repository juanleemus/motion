// Carga de las 3 letras de la marca (archivos locales de @fontsource, licencia OFL).
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

const f = (family: string, file: string, weight: string, style = 'normal') =>
  loadFont({family, url: staticFile(`fuentes/${file}`), weight, style});

export const fuentesListas = Promise.all([
  f('Poppins', 'poppins-latin-500-normal.woff2', '500'),
  f('Poppins', 'poppins-latin-600-normal.woff2', '600'),
  f('Poppins', 'poppins-latin-700-normal.woff2', '700'),
  f('Lora', 'lora-latin-600-italic.woff2', '600', 'italic'),
  f('Open Sans', 'open-sans-latin-600-normal.woff2', '600'),
]);
