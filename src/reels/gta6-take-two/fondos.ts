// Video de apoyo a pantalla completa (Mixkit, licencia gratuita sin crédito obligatorio). No se sube a git.
// Las escenas en pantalla dividida (pregunta, potencial, numeros) llevan su material en FotoArriba (Reel.tsx).
import {ESCENAS as E} from './escenas.ts';
import type {TramoFondo} from '../../robots/columna';

const A = 'apoyo-gta6-take-two';
export const FONDOS: TramoFondo[] = [
	{desde: E.precios, hasta: E.recta, src: `${A}/grafica.mp4`}, // Mixkit 47016 · gráfica de bolsa
	{desde: E.recta, hasta: E.numeros, src: `${A}/grafica-cae.mp4`}, // Mixkit 47012 · gráfica que sube y baja
	// "En Invora…", "Comenta GTA" y cierre: fondo clásico (llamados a la acción)
];
