// Comprueba que todas las frases usadas en el reel existan en la transcripción.
// REEL=acciones revisa src/acciones/Reel.tsx; sin REEL, el reel del día 5.
import {readFileSync} from 'node:fs';
const dir = process.env.REEL ? `../src/${process.env.REEL}/` : '../src/';
const {seg} = await import(`${dir}tiempos.ts`);
let malas = 0;
for (const archivo of ['Reel.tsx', 'escenas.ts', 'sonidos.ts']) {
	let src = '';
	try { src = readFileSync(new URL(`${dir}${archivo}`, import.meta.url), 'utf8'); } catch { continue; }
	const re = /(?:en|finDe)\('([^']+)'(?:,\s*(\d+))?\)/g;
	let m: RegExpExecArray | null;
	while ((m = re.exec(src))) {
		try { console.log(seg(m[1], m[2] ? Number(m[2]) : 1).toFixed(2).padStart(6), m[1], m[2] ?? ''); }
		catch { malas++; console.log('  FALTA', m[1], m[2] ?? ''); }
	}
}
process.exit(malas ? 1 : 0);
