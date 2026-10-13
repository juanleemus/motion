// Efectos del clip, atados a sus animaciones (fotogramas del clip: 0 = 0:34,0 del reel).
import {en, INICIO} from './tiempos.ts';
import type {Efecto, Evento} from '../sonidos.ts';

const ev: Evento[] = [];
const add = (f: number, tipo: Efecto, vol = 1) => ev.push({f: f - INICIO, tipo, vol});

// Insignia 3
add(INICIO + 1, 'pop', 0.5);
// Fondos y políticos entran de golpe
for (const p of ['Fondos', 'políticos']) {
	add(en(p), 'whoosh', 1.0);
	add(en(p) + 4, 'pop', 0.9);
	add(en(p) + 10, 'campanita', 0.45);
}
// Aparece el maletín y vuelan las tarjetas
const entrando = en('entrando');
add(entrando - 4, 'whoosh', 0.7);
add(entrando, 'trazo', 0.8);
add(entrando, 'whoosh', 0.55);
for (let i = 0; i < 8; i++) {
	add(entrando + 2 + i * 6, 'whoosh', 0.35);
	add(entrando + 16 + i * 6, 'pop', 0.55);
}
add(en('que antes'), 'whoosh', 0.55);
// Se enciende el portafolio
add(en('portafolio'), 'campanita', 1.0);
add(en('portafolio'), 'pop', 1.0);

export const EVENTOS = ev.filter((e) => e.f >= 0 && e.f < 180).sort((a, b) => a.f - b.f);
