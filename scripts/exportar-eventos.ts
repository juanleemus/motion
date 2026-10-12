// Escribe trabajo/eventos.json con los efectos de sonido (fotograma y tipo).
import {writeFileSync, mkdirSync} from 'node:fs';
import {EVENTOS} from '../src/sonidos.ts';
mkdirSync('trabajo', {recursive: true});
writeFileSync('trabajo/eventos.json', JSON.stringify(EVENTOS));
console.log(EVENTOS.length, 'efectos');
