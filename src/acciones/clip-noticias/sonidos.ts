// Efectos del clip, atados a sus animaciones (fotogramas del clip: 0 = 0:01,0 del reel).
import {en, INICIO} from './tiempos.ts';
import type {Efecto, Evento} from '../sonidos.ts';

const ev: Evento[] = [];
const add = (f: number, tipo: Efecto, vol = 1) => ev.push({f: f - INICIO, tipo, vol});

const noticias = en('noticias');
add(en('sale'), 'whoosh', 0.55); // texto
// el periódico gira: whooshes cada vez más seguidos hasta que aterriza
[INICIO + 2, INICIO + 14, INICIO + 23, INICIO + 30, noticias - 6].forEach((f, i) => add(f, 'whoosh', 0.45 + i * 0.1));
add(noticias, 'pop', 1.0);
add(noticias, 'campanita', 0.8);
add(noticias + 4, 'tic', 0.6);

export const EVENTOS = ev.filter((e) => e.f >= 0 && e.f < 60).sort((a, b) => a.f - b.f);
