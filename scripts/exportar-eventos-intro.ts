// Escribe trabajo/eventos-intro.json con los efectos de la intro.
import {writeFileSync, mkdirSync} from 'node:fs';
import {EVENTOS_INTRO} from '../src/sonidosIntro.ts';
mkdirSync('trabajo', {recursive: true});
writeFileSync('trabajo/eventos-intro.json', JSON.stringify(EVENTOS_INTRO));
console.log(EVENTOS_INTRO.length, 'efectos');
