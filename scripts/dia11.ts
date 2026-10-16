// Ayudas del Día 11: node --experimental-strip-types scripts/dia11.ts [claves|eventos|quieto|mov]
import {readFileSync, writeFileSync, mkdirSync} from 'node:fs';
import {seg} from '../src/dia11/tiempos.ts';
import {ESCENAS} from '../src/dia11/escenas.ts';
import {EVENTOS} from '../src/dia11/sonidos.ts';
const modo = process.argv[2] ?? 'claves';
if (modo === 'claves') {
	// Comprueba que todas las frases usadas en el reel existan en la transcripción.
	const src = readFileSync(new URL('../src/dia11/Reel.tsx', import.meta.url), 'utf8');
	const re = /(?:en|finDe)\('([^']+)'(?:,\s*(\d+))?\)/g;
	let m: RegExpExecArray | null; let malas = 0;
	while ((m = re.exec(src))) {
		try { console.log(seg(m[1], m[2] ? Number(m[2]) : 1).toFixed(2).padStart(6), m[1], m[2] ?? ''); }
		catch { malas++; console.log('  FALTA', m[1], m[2] ?? ''); }
	}
	process.exit(malas ? 1 : 0);
} else if (modo === 'eventos') {
	mkdirSync('trabajo', {recursive: true});
	writeFileSync('trabajo/eventos-dia11.json', JSON.stringify(EVENTOS));
	console.log(EVENTOS.length, 'efectos');
} else {
	// Fotogramas de revisión: uno ya asentado por escena, o momentos en movimiento.
	const v = Object.values(ESCENAS); const out: number[] = [];
	for (let i = 0; i < v.length - 1; i++) {
		if (modo === 'quieto') out.push(i === 0 ? 0 : v[i + 1] - 9);
		else out.push(v[i] + 8, Math.round((v[i] + v[i + 1]) / 2));
	}
	console.log(out.join(' '));
}
