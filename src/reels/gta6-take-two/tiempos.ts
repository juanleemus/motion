// Tiempos de "GTA 6 y Take-Two": cada objeto y cada subtítulo se atan a una palabra de la voz editada.
// palabras.json sale de whisper.cpp (medium, -ml 1 -sow) sobre trabajo/gta6-take-two/voz-editada.wav.
import palabras from './palabras.json' with {type: 'json'};
import {crearTiempos, type Palabra} from '../../tiemposBase.ts';

export const PALABRAS = palabras as Palabra[];
export const DURACION = 1465; // 00:00:48:25 (duración exacta de la voz editada, 48,826 s)

export const {seg, segFin, f, en, finDe} = crearTiempos(PALABRAS);
