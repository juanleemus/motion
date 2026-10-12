// Imprime los fotogramas de revisión: uno ya asentado por escena (o "mov" para momentos en movimiento).
import {ESCENAS} from '../src/escenas.ts';
const v = Object.values(ESCENAS);
const modo = process.argv[2] ?? 'quieto';
const out: number[] = [];
for (let i = 0; i < v.length - 1; i++) {
	if (modo === 'quieto') out.push(i === 0 ? 0 : v[i + 1] - 9);
	else out.push(v[i] + 8, Math.round((v[i] + v[i + 1]) / 2));
}
console.log(out.join(' '));
