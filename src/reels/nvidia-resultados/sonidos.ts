// Efectos de sonido atados a cada animación de Reel.tsx de "nvidia-resultados" (mismas palabras, mismos fotogramas).
import type {Efecto, Evento} from '../../sonidos.ts';
import {en} from './tiempos.ts';
import {ESCENAS} from './escenas.ts';

const ev: Evento[] = [];
const add = (f: number, tipo: Efecto, vol = 1) => {
	if (f >= 0) ev.push({f, tipo, vol});
};
const etiqueta = (f: number) => add(f, 'whoosh', 0.5);
const titulo = (f: number, conIcono = false) => {
	add(f, 'whoosh', 0.6);
	if (conIcono) add(f, 'trazo', 0.45);
};
const logo = (f: number) => add(f, 'pop', 1);
const tarjeta = (f: number) => {
	add(f, 'pop', 0.6);
	add(f + 3, 'trazo', 0.35);
};
const pildora = (f: number) => add(f, 'pop', 0.75);
const franja = (f: number) => add(f, 'whoosh', 0.55);
const cifra = (f: number) => add(f, 'conteo', 0.8);
const barra = (f: number) => {
	add(f, 'trazo', 0.5);
	add(f + 14, 'tic', 0.6);
};
const cambio = (f: number) => add(f, 'whoosh', 0.35);

// Pregunta
logo(en('NVIDIA', 1));
pildora(en('presentar'));
pildora(en('le ganó'));
// Ventas
cambio(ESCENAS.ventas - 6);
etiqueta(en('Vamos con'));
titulo(en('En tres meses'), true);
franja(en('115.800'));
cifra(en('115.800'));
franja(en('Se esperaban', 1));
barra(en('Se esperaban', 1));
barra(en('109.000'));
pildora(en('más del doble'));
// Centros de datos
cambio(ESCENAS.datos - 6);
etiqueta(en('De esos'));
franja(en('107.000'));
cifra(en('107.000'));
titulo(en('salieron'), true);
tarjeta(en('los chips'));
// Por acción
cambio(ESCENAS.accion - 6);
etiqueta(en('Por acción'));
franja(en('ganó', 2));
cifra(en('2.68'));
franja(en('Se esperaban', 2));
cifra(en('2.48'));
franja(en('Y de cada'));
barra(en('100'));
barra(en('75'));
pildora(en('fabricar'));
// Proyección
cambio(ESCENAS.proyeccion - 6);
etiqueta(en('Para el próximo'));
logo(en('NVIDIA proyecta'));
titulo(en('NVIDIA proyecta'));
franja(en('130.000'));
cifra(en('130.000'));
pildora(en('margen'));
franja(en('El mercado espera'));
barra(en('El mercado espera'));
barra(en('125.000'));
// Jensen
cambio(ESCENAS.jensen - 6);
etiqueta(en('Y todo esto'));
titulo(en('primeros'));
add(en('primeros'), 'tic', 0.6);
pildora(en('sin Jensen'));
add(en('Jensen'), 'pop', 0.9);
add(en('Jensen') + 2, 'campanita', 0.45);
// Recompra
cambio(ESCENAS.recompra - 6);
etiqueta(en('Hoy también'));
titulo(en('recompra'), true);
franja(en('150.000'));
cifra(en('150.000'));
add(en('esa compra'), 'whoosh', 0.5);
add(en('no es nueva'), 'trazo', 0.9);
add(en('no es nueva'), 'no', 0.55);
pildora(en('aprobó'));
franja(en('Este trimestre'));
cifra(en('22.100'));
// Miedo
cambio(ESCENAS.miedo - 6);
etiqueta(en('Entonces'));
titulo(en('Entonces'), true);
franja(en('cerró'));
cifra(en('155'));
franja(en('35'));
cifra(en('35'));
add(en('35') + 14, 'no', 0.4);
pildora(en('y su cierre'));
pildora(en('julio'));
// Tras el cierre
cambio(ESCENAS.tras - 6);
etiqueta(en('Tras el cierre'));
titulo(en('subía'), true);
franja(en('entre un'));
add(en('2'), 'tic', 0.7);
add(en('4'), 'tic', 0.7);
add(en('4') + 8, 'campanita', 0.5);
// Apertura
cambio(ESCENAS.apertura - 6);
etiqueta(en('Esta mañana'));
franja(en('la apertura'));
cifra(en('9'));
titulo(en('dirá'));
pildora(en('justificado'));
pildora(en('exagerado'));
// Cierre
cambio(ESCENAS.cierre - 6);
titulo(en('Esto es información'));
pildora(en('Sigue'));
add(en('Invora'), 'whoosh', 0.8);
add(en('Invora') + 6, 'campanita', 0.8);
add(en('Invora') + 14, 'trazo', 0.6);
titulo(en('para entender'));

export const EVENTOS = ev.sort((a, b) => a.f - b.f);
