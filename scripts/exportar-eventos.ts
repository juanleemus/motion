// Escribe los efectos de sonido (fotograma y tipo) de un reel en JSON.
// Uso: node scripts/exportar-eventos.ts [src/sonidos.ts] [trabajo/eventos.json]
import {writeFileSync, mkdirSync} from 'node:fs';
import path from 'node:path';
const {EVENTOS} = await import(path.resolve(process.argv[2] ?? 'src/sonidos.ts'));
const salida = process.argv[3] ?? 'trabajo/eventos.json';
mkdirSync(path.dirname(salida), {recursive: true});
writeFileSync(salida, JSON.stringify(EVENTOS));
console.log(EVENTOS.length, 'efectos');
