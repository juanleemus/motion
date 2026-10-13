// Escribe trabajo/eventos.json con los efectos de sonido (fotograma y tipo).
// REEL=acciones usa src/acciones/sonidos.ts; sin REEL, el reel del día 5.
import {writeFileSync, mkdirSync} from 'node:fs';
const {EVENTOS} = await import(process.env.REEL ? `../src/${process.env.REEL}/sonidos.ts` : '../src/sonidos.ts');
mkdirSync('trabajo', {recursive: true});
const salida = process.env.REEL ? `trabajo/eventos-${process.env.REEL.replaceAll('/', '-')}.json` : 'trabajo/eventos.json';
writeFileSync(salida, JSON.stringify(EVENTOS));
console.log(EVENTOS.length, 'efectos →', salida);
