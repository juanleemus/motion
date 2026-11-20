// Video de apoyo de cada escena (Mixkit, licencia gratuita sin crédito obligatorio). No se sube a git.
import {ESCENAS as E} from './escenas.ts';
import type {TramoFondo} from '../../robots/columna';

const A = 'apoyo-anthropic-ipo';
export const FONDOS: TramoFondo[] = [
	{desde: -12, hasta: E.precio, src: `${A}/ciudad-noche.mp4`}, // Mixkit 42354 · avenida de noche desde el aire
	{desde: E.precio, hasta: E.billetes, src: `${A}/ticker.mp4`}, // Mixkit 4128 · pantalla de cotizaciones
	// billetes: fondo clásico con foco de luz
	{desde: E.grafica, hasta: E.bloomberg, src: `${A}/grafica-cae.mp4`}, // Mixkit 47012 · gráfica de bolsa
	{desde: E.bloomberg, hasta: E.hoy, src: `${A}/periodico.mp4`, velocidad: 0.6}, // Mixkit 41192 · periódico
	{desde: E.hoy, hasta: E.invora, src: `${A}/grafica.mp4`}, // Mixkit 47016 · gráfica de bolsa
	// "En Invora…", "Comenta IPO" y cierre: fondo clásico (llamados a la acción)
];
