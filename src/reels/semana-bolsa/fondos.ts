// Video de apoyo de cada sección (Mixkit, licencia gratuita sin crédito obligatorio). No se sube a git.
import {ESCENAS as E} from './escenas.ts';
import type {TramoFondo} from '../../robots/columna';

const A = 'apoyo-semana-bolsa';
export const FONDOS: TramoFondo[] = [
	{desde: -12, hasta: E.nvidia, src: `${A}/wall-street.mp4`, inicio: 30}, // Mixkit 24515 · letreros de Wall Street
	{desde: E.nvidia, hasta: E.fed, src: `${A}/chip.mp4`, velocidad: 0.55}, // Mixkit 47051 · procesador en un circuito
	{desde: E.fed, hasta: E.jueves, src: `${A}/capitolio.mp4`}, // Mixkit 11800 · rumbo al Capitolio
	{desde: E.jueves, hasta: E.iran, src: `${A}/pekin.mp4`}, // Mixkit 11433 · Pekín de noche
	{desde: E.iran, hasta: E.cierre, src: `${A}/petroleo.mp4`}, // Mixkit 48884 · bomba de petróleo
	{desde: E.cierre, hasta: E.encuesta, src: `${A}/bolsa.mp4`}, // Mixkit 47006 · precios de bolsa
	// encuesta y "sigue a Invora": llamados a la acción, van sobre el fondo clásico
];
