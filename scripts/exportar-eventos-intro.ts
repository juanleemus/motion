// Escribe trabajo/eventos-intro.json (o eventos-intro-corta.json con el argumento "corta").
import {writeFileSync, mkdirSync} from 'node:fs';
import {EVENTOS_INTRO, EVENTOS_INTRO_CORTA} from '../src/sonidosIntro.ts';
const corta = process.argv[2] === 'corta';
mkdirSync('trabajo', {recursive: true});
const salida = corta ? 'trabajo/eventos-intro-corta.json' : 'trabajo/eventos-intro.json';
const ev = corta ? EVENTOS_INTRO_CORTA : EVENTOS_INTRO;
writeFileSync(salida, JSON.stringify(ev));
console.log(ev.length, 'efectos →', salida);
