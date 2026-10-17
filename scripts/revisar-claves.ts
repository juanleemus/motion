// Comprueba que todas las frases usadas en un reel existan en la transcripción.
// Uso: node scripts/revisar-claves.ts [src/Reel.tsx] [src/tiempos.ts]
import {readFileSync} from 'node:fs';
import path from 'node:path';
const reel = process.argv[2] ?? 'src/Reel.tsx';
const tiempos = process.argv[3] ?? 'src/tiempos.ts';
const {seg} = await import(path.resolve(tiempos));
const src = readFileSync(reel, 'utf8');
const re = /(?:en|finDe)\('([^']+)'(?:,\s*(\d+))?\)/g;
let m: RegExpExecArray | null; let malas = 0;
while ((m = re.exec(src))) {
	try { console.log(seg(m[1], m[2] ? Number(m[2]) : 1).toFixed(2).padStart(6), m[1], m[2] ?? ''); }
	catch (e) { malas++; console.log('  FALTA', m[1], m[2] ?? ''); }
}
process.exit(malas ? 1 : 0);
