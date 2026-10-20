import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';
import {LORA, POPPINS} from './tema';

// Fuentes del kit (kit-jpr/fuentes), copiadas a public/kit por scripts/preparar.mjs. Nunca de internet.
const f = (archivo: string) => staticFile(`kit/fuentes/${archivo}`);
export const fuentesListas = Promise.all([
  loadFont({family: POPPINS, url: f('Poppins-Regular.ttf'), weight: '400'}),
  loadFont({family: POPPINS, url: f('Poppins-Medium.ttf'), weight: '500'}),
  loadFont({family: POPPINS, url: f('Poppins-Bold.ttf'), weight: '700'}),
  loadFont({family: LORA, url: f('Lora-Italic-Variable.ttf'), weight: '400 700', style: 'italic'}),
]);
