// Efectos de "gta6-take-two", atados a cada animación de Reel.tsx.
import type {Efecto, Evento} from '../../sonidos.ts';
import {en} from './tiempos.ts';
import {ESCENAS} from './escenas.ts';

const ev: Evento[] = [];
const add = (f: number, tipo: Efecto, vol = 1) => {
	if (f >= 0) ev.push({f, tipo, vol});
};
const pildora = (f: number) => add(f, 'pop', 0.75);
const cambio = (f: number) => add(f, 'whoosh', 0.35);

// 1. Pregunta
add(en('Take-Two', 1), 'pop', 1);
pildora(en('la empresa'));
add(en('Rockstar'), 'pop', 1);
// 2. Precios objetivo
cambio(ESCENAS.objetivo - 6);
add(en('Según'), 'whoosh', 0.5);
add(en('Bloomberg'), 'pop', 1);
add(en('potencial'), 'whoosh', 0.55);
add(en('30'), 'conteo', 0.8);
add(en('Los precios'), 'whoosh', 0.55);
add(en('280'), 'tic', 0.8);
add(en('300'), 'tic', 0.8);
add(en('300') + 6, 'campanita', 0.5);
pildora(en('en su mayoría'));
pildora(en('rango'));
add(en('170'), 'trazo', 0.6);
add(en('330'), 'trazo', 0.6);
// 3. No es una línea recta
cambio(ESCENAS.recta - 6);
add(en('Y ojo'), 'whoosh', 0.5);
add(en('esto no es'), 'trazo', 0.8);
add(en('caer'), 'golpe', 0.6);
add(en('caer'), 'no', 0.4);
pildora(en('confirmó'));
pildora(en('compra el rumor'));
add(en('vende'), 'golpe', 0.6);
pildora(en('vende'));
// 4. Lo que importa
cambio(ESCENAS.numeros - 6);
add(en('Un videojuego'), 'whoosh', 0.5);
add(en('no te hace'), 'trazo', 0.9);
add(en('no te hace'), 'no', 0.5);
add(en('lo que importa'), 'whoosh', 0.6);
add(en('números', 1), 'pop', 0.8);
add(en('analistas', 2), 'pop', 0.8);
add(en('directivos'), 'pop', 0.8);
// 5. Invora
cambio(ESCENAS.invora - 6);
add(en('En Invora'), 'whoosh', 0.8);
add(en('En Invora') + 14, 'trazo', 0.6);
add(en('comprar'), 'trazo', 0.9);
add(en('comprar'), 'no', 0.5);
add(en('te mostramos'), 'whoosh', 0.6);
// 6. Comenta GTA
cambio(ESCENAS.comenta - 6);
add(en('Comenta'), 'whoosh', 0.55);
[0, 1, 2].forEach((i) => add(en('GTA', 2) + i * 4, 'tecleo', 0.8));
add(en('te enviamos'), 'whoosh', 0.7);
add(en('ficha'), 'pop', 0.9);
// 7. Cierre
cambio(ESCENAS.cierre - 6);
add(en('Esto es información'), 'whoosh', 0.6);
pildora(en('Sigue'));
add(en('Invora', 2), 'whoosh', 0.8);
add(en('Invora', 2) + 6, 'campanita', 0.8);

export const EVENTOS = ev.sort((a, b) => a.f - b.f);
