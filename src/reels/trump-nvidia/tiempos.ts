// Tiempos de "Trump y NVIDIA": cada pieza se ata a una palabra de la voz (audio ya cortado; se quitó una repetición).
import palabras from './palabras.json' with {type: 'json'};
import {crearTiempos, type Palabra} from '../../tiemposBase.ts';

export const PALABRAS = palabras as Palabra[];
export const DURACION = 4432; // 00:02:27:22 (147,708 s)

export const {seg, segFin, f, en, finDe} = crearTiempos(PALABRAS);
