// Tiempos del Día 8 · Thiel: cada animación se ata a una palabra del audio guía.
// palabras.json sale de whisper.cpp (modelo medium) con nombres propios corregidos.
import palabras from './palabras.json' with {type: 'json'};
import {crearTiempos, type Palabra} from '../../tiemposBase.ts';

export const DURACION = 2368; // 00:01:18:28 (duración exacta del audio guía)

export const {seg, segFin, f, en, finDe} = crearTiempos(palabras as Palabra[]);
