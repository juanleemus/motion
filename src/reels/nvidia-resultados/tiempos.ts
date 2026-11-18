// Tiempos de "NVIDIA resultados": cada animación se ata a una palabra de la voz editada.
// palabras.json sale de whisper.cpp (medium, -ml 1 -sow) sobre trabajo/nvidia-resultados/voz-editada.wav.
import palabras from './palabras.json' with {type: 'json'};
import {crearTiempos, type Palabra} from '../../tiemposBase.ts';

export const DURACION = 2580; // 00:01:26:00 (duración exacta de la voz editada, 85,990 s)

export const {seg, segFin, f, en, finDe} = crearTiempos(palabras as Palabra[]);
