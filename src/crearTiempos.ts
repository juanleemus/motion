// Tiempos de un reel: cada animación se ata a una palabra del audio guía.
// La lista de palabras sale de whisper.cpp (scripts/transcribir.sh).
export const FPS = 30;

type Palabra = {w: string; t0: number; t1: number};

const norm = (s: string) =>
	s
		.toLowerCase()
		.normalize('NFD')
		.replace(/[̀-ͯ]/g, '')
		.replace(/[^a-z0-9ñ]/g, '');

export const crearTiempos = (lista: Palabra[]) => {
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
	// Segundo en que empieza la frase (n-ésima vez que se dice).
	const seg = (frase: string, n = 1): number => lista[indice(frase, n).i].t0;
	// Segundo en que termina la frase.
	const segFin = (frase: string, n = 1): number => {
		const {i, largo} = indice(frase, n);
		return lista[i + largo - 1].t1;
	};
	const f = (s: number) => Math.round(s * FPS);
	// Fotograma en que se dice la frase.
	const en = (frase: string, n = 1) => f(seg(frase, n));
	const finDe = (frase: string, n = 1) => f(segFin(frase, n));
	return {seg, segFin, f, en, finDe};
};
