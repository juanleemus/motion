// Tiempos del Día 11 (Natera): cada animación se ata a una palabra del audio guía.
// palabras-dia11.json sale de whisper.cpp (modelo medium, español) con nombres corregidos.
import palabras from '../datos/palabras-dia11.json' with {type: 'json'};

export const FPS = 30;
export const DURACION = 2610; // 00:01:27:00

type Palabra = {w: string; t0: number; t1: number};
const lista = palabras as Palabra[];

const norm = (s: string) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9ñ]/g, '');

const normalizadas = lista.map((p) => norm(p.w));

const indice = (frase: string, n: number) => {
	const objetivo = frase.split(/\s+/).map(norm).filter(Boolean);
	let vistas = 0;
	for (let i = 0; i <= normalizadas.length - objetivo.length; i++) {
		if (objetivo.every((w, j) => normalizadas[i + j] === w)) {
			vistas++;
			if (vistas === n) return {i, largo: objetivo.length};
		}
	}
	throw new Error(`No encontré "${frase}" (vez ${n}) en la transcripción`);
};

// Segundo en que empieza / termina la frase (n-ésima vez que se dice).
export const seg = (frase: string, n = 1) => lista[indice(frase, n).i].t0;
export const segFin = (frase: string, n = 1) => {
	const {i, largo} = indice(frase, n);
	return lista[i + largo - 1].t1;
};

export const f = (s: number) => Math.round(s * FPS);
export const en = (frase: string, n = 1) => f(seg(frase, n));
export const finDe = (frase: string, n = 1) => f(segFin(frase, n));
