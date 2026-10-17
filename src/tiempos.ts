// Tiempos del reel del día 5 (Uber).
import palabras from './datos/palabras.json' with {type: 'json'};
import {crearTiempos} from './crearTiempos.ts';

export {FPS} from './crearTiempos.ts';
export const DURACION = 2220; // 00:01:14:00
export const {seg, segFin, f, en, finDe} = crearTiempos(palabras);
