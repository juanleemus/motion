// Video de apoyo de cada escena (Mixkit, licencia gratuita sin crédito obligatorio). No se sube a git.
import {ESCENAS as E} from './escenas.ts';
import type {TramoFondo} from '../../robots/columna';

const A = 'apoyo-gta6-take-two';
export const FONDOS: TramoFondo[] = [
	{desde: -12, hasta: E.objetivo, src: `${A}/control.mp4`}, // Mixkit 48097 · manos con un control de videojuego
	{desde: E.objetivo, hasta: E.recta, src: `${A}/grafica.mp4`}, // Mixkit 47016 · gráfica de bolsa
	{desde: E.recta, hasta: E.numeros, src: `${A}/grafica-cae.mp4`}, // Mixkit 47012 · gráfica que sube y baja
	{desde: E.numeros, hasta: E.invora, src: `${A}/tableta.mp4`}, // Mixkit 46990 · gráfica en una tableta
	// "En Invora…", "Comenta GTA" y cierre: fondo clásico (llamados a la acción)
];
