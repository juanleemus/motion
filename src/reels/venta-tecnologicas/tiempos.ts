// Tiempos de "Venta masiva de tecnológicas": cada objeto y subtítulo se ata a una palabra de la voz editada.
// palabras.json sale de whisper.cpp (medium, -ml 1 -sow) sobre trabajo/venta-tecnologicas/voz-editada.wav.
import palabras from './palabras.json' with {type: 'json'};
import {crearTiempos, type Palabra} from '../../tiemposBase.ts';

export const PALABRAS = palabras as Palabra[];
export const DURACION = 3610; // 00:02:00:10 (video del presentador sin silencios, 120,333 s)

export const {seg, segFin, f, en, finDe} = crearTiempos(PALABRAS);
