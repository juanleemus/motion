// Imprime los fotogramas de revisión: uno ya asentado por escena (o "mov" para momentos en movimiento).
// Uso: node scripts/escenas.ts [quieto|mov] [src/reels/dia7-energia]   (sin carpeta: el reel del Día 5)
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const modo = process.argv[2] ?? 'quieto';
const archivo = process.argv[3] ? resolve(process.argv[3], 'escenas.ts') : resolve('src/escenas.ts');
const {ESCENAS} = await import(pathToFileURL(archivo).href);
const v = Object.values(ESCENAS) as number[];
const out: number[] = [];
for (let i = 0; i < v.length - 1; i++) {
	if (modo === 'quieto') out.push(i === 0 ? 0 : v[i + 1] - 9);
	else out.push(v[i] + 8, Math.round((v[i] + v[i + 1]) / 2));
}
console.log(out.join(' '));
