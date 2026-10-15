// Tiempos del reel: cada animación se ata a una palabra del audio guía.
// palabras.json sale de whisper.cpp (scripts/transcribir.sh).
import palabras from './datos/palabras.json' with {type: 'json'};

export const FPS = 30;
export const DURACION = 2220; // 00:01:14:00

export type Palabra = {w: string; t0: number; t1: number};

const norm = (s: string) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9ñ]/g, '');

// Motor reutilizable: recibe la transcripción de un reel y devuelve sus funciones de tiempo.
export const crearTiempos = (lista: Palabra[], fps = FPS) => {
	const normalizadas = lista.map((p) => norm(p.w));
	// Posición (índice de palabra) de la frase (n-ésima vez que se dice).
	const indice = (frase: string, n = 1): number => {
		const objetivo = frase.split(/\s+/).map(norm).filter(Boolean);
		let vistas = 0;
		for (let i = 0; i <= normalizadas.length - objetivo.length; i++) {
			if (objetivo.every((w, j) => normalizadas[i + j] === w)) {
				vistas++;
				if (vistas === n) return i;
			}
		}
		throw new Error(`No encontré "${frase}" (vez ${n}) en la transcripción`);
	};
	// Segundo en que empieza la frase.
	const seg = (frase: string, n = 1): number => lista[indice(frase, n)].t0;
	// Segundo en que termina la frase.
	const segFin = (frase: string, n = 1): number => {
		const largo = frase.split(/\s+/).map(norm).filter(Boolean).length;
		return lista[indice(frase, n) + largo - 1].t1;
	};
	const f = (s: number) => Math.round(s * fps);
	// Fotograma en que se dice la frase.
	const en = (frase: string, n = 1) => f(seg(frase, n));
	const finDe = (frase: string, n = 1) => f(segFin(frase, n));
	return {seg, segFin, f, en, finDe};
};

export const {seg, segFin, f, en, finDe} = crearTiempos(palabras as Palabra[]);
