// Video de apoyo a pantalla completa (Mixkit, licencia gratuita sin crédito obligatorio). No se sube a git.
// Las escenas en pantalla dividida llevan su material en FotoArriba (Reel.tsx).
import {ESCENAS as E} from './escenas.ts';
import type {TramoFondo} from '../../robots/columna';

const A = 'apoyo-venta-tecnologicas';
export const FONDOS: TramoFondo[] = [
	{desde: E.viernes, hasta: E.racha, src: `${A}/grafica-cae.mp4`}, // Mixkit 47012 · gráfica que cae
	{desde: E.racha, hasta: E.cnbc, src: `${A}/cotizaciones.mp4`}, // Mixkit 47793 · pantalla de cotizaciones
	{desde: E.chips, hasta: E.cadena, src: `${A}/fabrica-chips.mp4`}, // Mixkit 47258 · fábrica de electrónica
	{desde: E.cadena, hasta: E.giro, src: `${A}/microchips.mp4`}, // Mixkit 1141 · microchips
	{desde: E.suben, hasta: E.ojo, src: `${A}/grafica.mp4`}, // Mixkit 47016 · gráfica de bolsa
	{desde: E.ojo, hasta: E.bloomberg, src: `${A}/tableta.mp4`}, // Mixkit 46990 · gráfica en una tableta
	{desde: E.datos, hasta: E.metodo, src: `${A}/periodico.mp4`, velocidad: 0.6}, // Mixkit 41192 · periódico
	// método, "En Invora", "Comenta CAÍDA" y cierre: fondo clásico
];
