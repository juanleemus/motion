// Tiempos del reel de Juan Pablo: cada animación se ata a una palabra del audio guía.
// datos/palabras.json sale de whisper.cpp (scripts/transcribir.sh) o de scripts/alinear_guion.py.
import palabras from './datos/palabras.json' with {type: 'json'};
import {crearTiempos, FPS, type Palabra} from '../tiempos.ts';

export {FPS};
export const DURACION = 1440; // 00:00:48:00 exactos
export const {seg, segFin, f, en, finDe} = crearTiempos(palabras as Palabra[]);
