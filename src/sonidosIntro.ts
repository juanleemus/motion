// Efectos de la intro, atados a los mismos momentos de Intro.tsx.
import type {Evento} from './sonidos.ts';
import {T_INTRO, T_INTRO_CORTA} from './tiemposIntro.ts';

const eventos = (T: typeof T_INTRO): Evento[] => [
	{f: T.insignia, tipo: 'pop', vol: 0.9},
	{f: T.insignia + 1, tipo: 'tic', vol: 0.8},
	{f: T.insignia + 4, tipo: 'tic', vol: 0.8},
	{f: T.insignia + 7, tipo: 'tic', vol: 0.8},
	{f: T.insignia + 10, tipo: 'pop', vol: 0.7},
	{f: T.dibujo, tipo: 'trazo', vol: 1},
	{f: T.enciende, tipo: 'campanita', vol: 1},
	{f: T.escuela, tipo: 'whoosh', vol: 0.8},
	{f: T.escuela + 2, tipo: 'pop', vol: 0.6},
	{f: T.invora, tipo: 'whoosh', vol: 0.9},
	{f: T.invora + 14, tipo: 'pop', vol: 0.6},
];

export const EVENTOS_INTRO = eventos(T_INTRO);
export const EVENTOS_INTRO_CORTA = eventos(T_INTRO_CORTA);
