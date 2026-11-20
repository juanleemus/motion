// Efectos de "anthropic-ipo": "tic" suave en cada cifra, golpe grave en la apertura de 110 $,
// latido en el bloque "Día 1" (como pide el guion audiovisual) y los de siempre en cada pieza.
import type {Efecto, Evento} from '../../sonidos.ts';
import {en} from './tiempos.ts';
import {ESCENAS} from './escenas.ts';

const ev: Evento[] = [];
const add = (f: number, tipo: Efecto, vol = 1) => {
	if (f >= 0) ev.push({f, tipo, vol});
};
const etiqueta = (f: number) => add(f, 'whoosh', 0.5);
const logo = (f: number) => add(f, 'pop', 1);
const pildora = (f: number) => add(f, 'pop', 0.75);
const cifra = (f: number) => {
	add(f, 'tic', 0.6);
	add(f, 'conteo', 0.6);
};
const cambio = (f: number) => add(f, 'whoosh', 0.35);

// 1. Torre
logo(en('Anthropic'));
logo(en('Claude'));
add(en('debutó'), 'whoosh', 0.8);
add(en('ticker'), 'whoosh', 0.5);
add(en('ANT'), 'golpe', 0.5);
add(en('ANT') + 2, 'campanita', 0.6);
// 2. Calendario
cambio(ESCENAS.calendario - 6);
etiqueta(en('antes'));
add(en('antes'), 'pop', 0.7);
pildora(en('mira'));
// 3. Precio
cambio(ESCENAS.precio - 6);
etiqueta(en('Según', 1));
logo(en('CNBC'));
logo(en('Yahoo', 1));
add(en('fijó'), 'whoosh', 0.7);
add(en('83', 1), 'golpe', 0.45);
add(en('83', 1), 'tic', 0.8);
add(en('rango'), 'tic', 0.5);
add(en('78'), 'trazo', 0.9);
add(en('78'), 'no', 0.45);
pildora(en('por encima', 1));
// 4. Oferta
cambio(ESCENAS.billetes - 6);
etiqueta(en('Vendió'));
cifra(en('980'));
add(en('levantó'), 'whoosh', 0.7);
cifra(en('81'));
add(en('es la salida'), 'pop', 0.6);
add(en('historia'), 'campanita', 0.7);
// 5. Gráfica
cambio(ESCENAS.grafica - 6);
etiqueta(en('pero ojo'));
add(en('110'), 'golpe', 1);
add(en('110'), 'tic', 0.7);
pildora(en('33'));
logo(en('Yahoo', 2));
add(en('pagó'), 'trazo', 0.5);
add(en('oferta'), 'trazo', 0.5);
add(en('97'), 'tic', 0.7);
add(en('97'), 'no', 0.35);
// 6. Bloomberg
cambio(ESCENAS.bloomberg - 6);
etiqueta(en('Por eso'));
logo(en('Bloomberg'));
add(en('trampa'), 'whoosh', 0.7);
pildora(en('debut'));
// 7. Día 1 (latido)
cambio(ESCENAS.latido - 6);
for (let f = en('El primer día'); f < ESCENAS.hoy - 4; f += 36) add(f, 'latido', 1);
add(en('manda'), 'whoosh', 0.55);
add(en('números', 1), 'trazo', 0.9);
add(en('números', 1), 'no', 0.5);
// 8. Hoy
cambio(ESCENAS.hoy - 6);
pildora(en('Nadie'));
etiqueta(en('pero esto'));
add(en('El precio'), 'whoosh', 0.5);
cifra(en('83', 2));
add(en('el que ves'), 'whoosh', 0.5);
add(en('otro'), 'pop', 0.8);
// 9. Invora
cambio(ESCENAS.invora - 6);
add(en('En Invora'), 'whoosh', 0.8);
add(en('En Invora') + 14, 'trazo', 0.6);
add(en('comprar'), 'trazo', 0.9);
add(en('comprar'), 'no', 0.5);
add(en('te mostramos'), 'whoosh', 0.6);
// 10. Comenta IPO
cambio(ESCENAS.comenta - 6);
add(en('Comenta'), 'whoosh', 0.55);
['I', 'P', 'O'].forEach((_, i) => add(en('IPO') + i * 4, 'tecleo', 0.8));
add(en('te mandamos'), 'whoosh', 0.7);
add(en('NVIDIA'), 'pop', 0.9);
add(en('AMD'), 'pop', 0.9);
add(en('Micron'), 'pop', 0.9);
pildora(en('Tres acciones'));
// 11. Cierre
cambio(ESCENAS.cierre - 6);
add(en('Esto es información'), 'whoosh', 0.6);
pildora(en('Sigue'));
add(en('Invora', 2), 'whoosh', 0.8);
add(en('Invora', 2) + 6, 'campanita', 0.8);

export const EVENTOS = ev.sort((a, b) => a.f - b.f);
