// Tiempos del reel del Día 5: cada animación se ata a una palabra del audio guía.
// palabras.json sale de whisper.cpp (scripts/transcribir.sh).
import palabras from './datos/palabras.json' with {type: 'json'};
import {crearTiempos, type Palabra} from './tiemposBase.ts';

export {FPS} from './tiemposBase.ts';
export const DURACION = 2220; // 00:01:14:00

export const {seg, segFin, f, en, finDe} = crearTiempos(palabras as Palabra[]);
