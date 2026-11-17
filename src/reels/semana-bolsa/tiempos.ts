// Tiempos de "La semana de la bolsa": cada animación se ata a una palabra de la voz editada.
// palabras.json sale de whisper.cpp (medium, -ml 1 -sow) sobre trabajo/semana-bolsa/voz-editada.wav.
import palabras from './palabras.json' with {type: 'json'};
import {crearTiempos, type Palabra} from '../../tiemposBase.ts';

export const DURACION = 1579; // 00:00:52:19 (duración exacta de la voz editada, 52,621 s)

export const {seg, segFin, f, en, finDe} = crearTiempos(palabras as Palabra[]);
