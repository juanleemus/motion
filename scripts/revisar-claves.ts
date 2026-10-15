// Comprueba que todas las frases usadas con en()/finDe() existan en la transcripción.
// Uso: node scripts/revisar-claves.ts                    (reel de Escuela Invora)
//      node scripts/revisar-claves.ts jpr                (reel de Juan Pablo: src/jpr/)
import {readFileSync, readdirSync} from 'node:fs';
const jpr = process.argv[2] === 'jpr';
const {seg} = jpr ? await import('../src/jpr/tiempos.ts') : await import('../src/tiempos.ts');
const archivos = jpr
	? readdirSync(new URL('../src/jpr/', import.meta.url)).filter((a) => /\.tsx?$/.test(a)).map((a) => new URL(`../src/jpr/${a}`, import.meta.url))
	: [new URL('../src/Reel.tsx', import.meta.url)];
const re = /(?:en|finDe)\('([^']+)'(?:,\s*(\d+))?\)/g;
let m: RegExpExecArray | null; let malas = 0; let total = 0;
for (const archivo of archivos) {
	const src = readFileSync(archivo, 'utf8');
	while ((m = re.exec(src))) {
		total++;
		try { console.log(seg(m[1], m[2] ? Number(m[2]) : 1).toFixed(2).padStart(6), m[1], m[2] ?? ''); }
		catch (e) { malas++; console.log('  FALTA', m[1], m[2] ?? ''); }
	}
}
if (jpr) {
	const {ESCENAS} = await import('../src/jpr/escenas.ts');
	const {revisarBloques} = await import('../src/jpr/bloques.ts');
	for (const e of ESCENAS) for (const x of revisarBloques(e.bloques)) { malas++; console.log('  BLOQUE LARGO', e.id, x); }
	for (const e of ESCENAS) {
		const s = (e.hasta - e.desde) / 30;
		if (e.plano === 'B' && s > 5) { malas++; console.log(`  B DE MÁS DE 5 s: ${e.id} (${s.toFixed(2)} s)`); }
		console.log(`plano ${e.plano} ${e.id.padEnd(13)} ${(e.desde / 30).toFixed(2).padStart(6)} s  dura ${s.toFixed(2)} s`);
	}
	console.log(`promedio por plano: ${(ESCENAS.at(-1)!.hasta / 30 / ESCENAS.length).toFixed(2)} s`);
}
console.log(total, 'claves,', malas, 'problemas');
process.exit(malas ? 1 : 0);
