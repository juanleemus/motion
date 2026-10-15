// Escribe trabajo/jpr/eventos.json con los efectos de sonido del reel JPR (fotograma y tipo).
import {writeFileSync, mkdirSync} from 'node:fs';
import {EVENTOS_JPR} from '../src/jpr/sonidos.ts';
mkdirSync('trabajo/jpr', {recursive: true});
writeFileSync('trabajo/jpr/eventos.json', JSON.stringify(EVENTOS_JPR));
console.log(EVENTOS_JPR.length, 'efectos');
