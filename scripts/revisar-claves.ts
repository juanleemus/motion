// Comprueba que todas las frases usadas en Reel.tsx existan en la transcripción.
import {readFileSync} from 'node:fs';
import {seg} from '../src/tiempos.ts';
const src = readFileSync(new URL('../src/Reel.tsx', import.meta.url), 'utf8');
const re = /(?:en|finDe)\('([^']+)'(?:,\s*(\d+))?\)/g;
let m: RegExpExecArray | null; let malas = 0;
while ((m = re.exec(src))) {
	try { console.log(seg(m[1], m[2] ? Number(m[2]) : 1).toFixed(2).padStart(6), m[1], m[2] ?? ''); }
	catch (e) { malas++; console.log('  FALTA', m[1], m[2] ?? ''); }
}
process.exit(malas ? 1 : 0);
