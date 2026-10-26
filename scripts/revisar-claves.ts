// Comprueba que todas las frases usadas en un reel existan en su transcripción.
// Uso: node scripts/revisar-claves.ts [src/reels/dia7-energia]   (sin carpeta: el reel del Día 5)
import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const carpeta = process.argv[2];
const reel = carpeta ? resolve(carpeta, 'Reel.tsx') : resolve('src/Reel.tsx');
const tiempos = carpeta ? resolve(carpeta, 'tiempos.ts') : resolve('src/tiempos.ts');
const {seg} = await import(pathToFileURL(tiempos).href);
const src = readFileSync(reel, 'utf8');
const re = /(?:en|finDe)\('([^']+)'(?:,\s*(\d+))?\)/g;
let m: RegExpExecArray | null; let malas = 0;
while ((m = re.exec(src))) {
	try { console.log(seg(m[1], m[2] ? Number(m[2]) : 1).toFixed(2).padStart(6), m[1], m[2] ?? ''); }
	catch (e) { malas++; console.log('  FALTA', m[1], m[2] ?? ''); }
}
process.exit(malas ? 1 : 0);
