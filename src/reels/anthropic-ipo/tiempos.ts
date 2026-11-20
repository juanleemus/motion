// Tiempos de "Anthropic IPO": cada objeto y cada subtítulo se atan a una palabra de la voz editada.
// palabras.json sale de whisper.cpp (medium, -ml 1 -sow) sobre trabajo/anthropic-ipo/voz-editada.wav.
import palabras from './palabras.json' with {type: 'json'};
import {crearTiempos, type Palabra} from '../../tiemposBase.ts';

export const PALABRAS = palabras as Palabra[];
export const DURACION = 2140; // 00:01:11:10 (duración exacta de la voz editada, 71,304 s)

export const {seg, segFin, f, en, finDe} = crearTiempos(PALABRAS);
