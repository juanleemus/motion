// Imprime los fotogramas de revisión: uno ya asentado por escena (o "mov" para momentos en movimiento).
// Uso: node scripts/escenas.ts [quieto|mov] [src/escenas.ts]
import path from 'node:path';
const modo = process.argv[2] ?? 'quieto';
const {ESCENAS} = await import(path.resolve(process.argv[3] ?? 'src/escenas.ts'));
const v = Object.values(ESCENAS) as number[];
const out: number[] = [];
for (let i = 0; i < v.length - 1; i++) {
	if (modo === 'quieto') out.push(i === 0 ? 0 : v[i + 1] - 9);
	else out.push(v[i] + 8, Math.round((v[i] + v[i + 1]) / 2));
}
console.log(out.join(' '));
