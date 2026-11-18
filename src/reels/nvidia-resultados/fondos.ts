// Video de apoyo de cada sección (Mixkit, licencia gratuita sin crédito obligatorio). No se sube a git.
import {ESCENAS as E} from './escenas.ts';
import type {TramoFondo} from '../../robots/columna';

const A = 'apoyo-nvidia-resultados';
export const FONDOS: TramoFondo[] = [
	{desde: -12, hasta: E.ventas, src: `${A}/chip.mp4`, velocidad: 0.55}, // Mixkit 47051 · procesador en un circuito
	{desde: E.ventas, hasta: E.datos, src: `${A}/grafica.mp4`}, // Mixkit 47016 · gráfica de bolsa
	{desde: E.datos, hasta: E.accion, src: `${A}/centro-datos.mp4`}, // Mixkit 23282 · pasillo de centro de datos
	{desde: E.accion, hasta: E.proyeccion, src: `${A}/tableta.mp4`}, // Mixkit 46990 · gráfica en una tableta
	{desde: E.proyeccion, hasta: E.jensen, src: `${A}/analisis.mp4`}, // Mixkit 5461 · tablero de análisis bursátil
	{desde: E.jensen, hasta: E.recompra, src: `${A}/chip.mp4`, velocidad: 0.55, inicio: 60}, // Mixkit 47051
	{desde: E.recompra, hasta: E.miedo, src: `${A}/periodico.mp4`, velocidad: 0.6}, // Mixkit 41192 · periódico
	{desde: E.miedo, hasta: E.apertura, src: `${A}/caida.mp4`}, // Mixkit 47012 · gráfica que cae
	{desde: E.apertura, hasta: E.cierre, src: `${A}/wall-street.mp4`, inicio: 30}, // Mixkit 24515 · Wall Street
	// cierre ("información, no recomendaciones" + "sigue a Invora"): fondo clásico
];
