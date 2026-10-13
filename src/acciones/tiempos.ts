// Tiempos del reel "cómo ver una acción antes de las noticias".
// palabras.json sale de scripts/alinear_guion.py sobre el audio guía.
import palabras from './palabras.json' with {type: 'json'};
import {crearTiempos, type Palabra} from '../tiempos.ts';

export const DURACION = 2250; // 00:01:15:00
export const {seg, segFin, en, finDe} = crearTiempos(palabras as Palabra[]);
