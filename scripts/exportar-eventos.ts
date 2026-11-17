// Escribe el JSON con los efectos de sonido (fotograma y tipo) de un reel.
// Uso: node scripts/exportar-eventos.ts [src/reels/dia7-energia salida.json]   (sin argumentos: el Día 5)
import {writeFileSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
const carpeta = process.argv[2];
const salida = process.argv[3] ?? 'trabajo/eventos.json';
const archivo = carpeta ? resolve(carpeta, 'sonidos.ts') : resolve('src/sonidos.ts');
const {EVENTOS} = await import(pathToFileURL(archivo).href);
mkdirSync(dirname(salida), {recursive: true});
writeFileSync(salida, JSON.stringify(EVENTOS));
console.log(EVENTOS.length, 'efectos');
