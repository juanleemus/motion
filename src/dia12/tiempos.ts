// Tiempos del reel del día 12 (Google): palabras del audio guía (whisper medium, corregidas).
import palabras from '../datos/palabras-dia12.json' with {type: 'json'};
import {crearTiempos} from '../crearTiempos.ts';

export const DURACION = 2700; // 00:01:30:00
export const {seg, segFin, f, en, finDe} = crearTiempos(palabras);
