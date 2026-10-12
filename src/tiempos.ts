// Tiempos del reel: cada animación se ata a una palabra del audio guía.
// palabras.json sale de whisper.cpp (scripts/transcribir.sh).
import palabras from './datos/palabras.json' with {type: 'json'};

export const FPS = 30;
export const DURACION = 2220; // 00:01:14:00

type Palabra = {w: string; t0: number; t1: number};
const lista = palabras as Palabra[];

const norm = (s: string) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9ñ]/g, '');

const normalizadas = lista.map((p) => norm(p.w));

// Segundo en que empieza la frase (n-ésima vez que se dice).
export const seg = (frase: string, n = 1): number => {
	const objetivo = frase.split(/\s+/).map(norm).filter(Boolean);
	let vistas = 0;
	for (let i = 0; i <= normalizadas.length - objetivo.length; i++) {
		if (objetivo.every((w, j) => normalizadas[i + j] === w)) {
			vistas++;
			if (vistas === n) return lista[i].t0;
		}
	}
	throw new Error(`No encontré "${frase}" (vez ${n}) en la transcripción`);
};

// Segundo en que termina la frase.
export const segFin = (frase: string, n = 1): number => {
	const objetivo = frase.split(/\s+/).map(norm).filter(Boolean);
	const t = seg(frase, n);
	const i = lista.findIndex((p) => p.t0 === t);
	return lista[i + objetivo.length - 1].t1;
};

export const f = (s: number) => Math.round(s * FPS);
// Fotograma en que se dice la frase.
export const en = (frase: string, n = 1) => f(seg(frase, n));
export const finDe = (frase: string, n = 1) => f(segFin(frase, n));
