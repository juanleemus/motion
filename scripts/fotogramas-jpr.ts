// Lista de fotogramas a revisar del reel JPR: uno por bloque de subtítulo y otro a mitad de cada animación.
import {readFileSync} from 'node:fs';
import {ESCENAS} from '../src/jpr/escenas.ts';
import {en, finDe} from '../src/jpr/tiempos.ts';
const fr = new Set<number>([0]);
for (const e of ESCENAS) for (const b of e.bloques) { fr.add(b.f + 4); if (b.cursiva) fr.add(Math.max(b.f + 4, b.cursiva.f) + 6); }
// mitad de animación: cada pieza de Reel.tsx con desde={en(...)} → +5 fotogramas
const src = readFileSync(new URL('../src/jpr/Reel.tsx', import.meta.url), 'utf8');
for (const m of src.matchAll(/desde=\{(en|finDe)\('([^']+)'(?:,\s*(\d+))?\)\}/g)) fr.add((m[1] === 'en' ? en : finDe)(m[2], m[3] ? +m[3] : 1) + 5);
for (const e of ESCENAS) fr.add(e.desde + 5);
console.log([...fr].filter((f) => f < 1440).sort((a, b) => a - b).join(' '));
