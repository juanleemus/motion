// Efectos de "trump-nvidia": whoosh en cada cambio de escena, pop en cada píldora/objeto, conteo en cifras,
// golpe en las cifras rojas.
import type {Efecto, Evento} from '../../sonidos.ts';
import {en} from './tiempos.ts';
import {ESCENAS} from './escenas.ts';

const ev: Evento[] = [];
const add = (f: number, tipo: Efecto, vol = 1) => {
	if (f >= 0) ev.push({f, tipo, vol});
};
const pop = (f: number, v = 0.75) => add(f, 'pop', v);
const rojo = (f: number) => {
	add(f, 'golpe', 0.6);
	add(f, 'tic', 0.6);
};
for (const k of Object.keys(ESCENAS) as (keyof typeof ESCENAS)[]) if (k !== 'gancho' && k !== 'fin') add(ESCENAS[k] - 6, 'whoosh', 0.4);

// Gancho
add(0, 'golpe', 0.5);
pop(en('NVIDIA', 1));
add(en('Antes de opinar'), 'trazo', 0.7);
pop(en('miremos'));
// Convenció
rojo(en('Justo después'));
pop(en('Trump dijo'));
add(en('traer de vuelta'), 'whoosh', 0.5);
pop(en('Jensen'), 0.9);
// CNBC
add(en('Según CNBC', 1), 'whoosh', 0.6);
pop(en('Según CNBC', 1) + 2, 0.7);
add(en('la acción se disparó'), 'trazo', 0.8);
add(en('uno de sus mejores'), 'campanita', 0.6);
// Transa
pop(en('Según CNBC', 2));
pop(en('segundo mandato'));
add(en('103'), 'conteo', 0.9);
add(en('97.5'), 'conteo', 0.9);
pop(en('declaraciones'));
// Legal
add(en('Comprar y vender'), 'pop', 0.8);
add(en('debate'), 'golpe', 0.4);
// Razones
pop(en('Primero'), 0.9);
pop(en('Anthropic'), 0.9);
pop(en('tercero'), 0.9);
rojo(en('Los inversionistas'));
// Semana
rojo(en('tecnología'));
rojo(en('El oro'));
rojo(en('Bitcoin'));
// Miedo
add(en('El índice'), 'trazo', 0.7);
rojo(en('cayó a 14'));
pop(en('más bajo desde'));
// VIX
add(en('40'), 'conteo', 0.8);
add(en('36'), 'tic', 0.7);
rojo(en('Por encima de 35'));
// Historia
pop(en('Según datos'));
for (let i = 0; i < 11; i++) add(en('11 veces') + i * 3, 'tic', 0.6);
add(en('9', 2), 'campanita', 0.6);
rojo(en('en 2'));
pop(en('la investigación'));
pop(en('una subida', 2));
// Abril
rojo(en('aranceles', 1));
add(en('52'), 'conteo', 0.9);
pop(en('pausó'));
add(en('9%', 3), 'conteo', 0.9);
add(en('9%', 3) + 16, 'campanita', 0.7);
// Poder
pop(en('es un dato más'));
add(en('No es una recomendación'), 'no', 0.4);
pop(en('es información pública'));
// App
add(en('En Invora'), 'whoosh', 0.7);
pop(en('compra Trump'));
pop(en('congresistas'));
pop(en('directivos'));
pop(en('fondos'));
// Comenta
for (let i = 0; i < 5; i++) add(en('Trump', 6) + i * 3, 'tecleo', 0.8);
add(en('te enviamos'), 'whoosh', 0.7);
// Cierre
add(en('Esto es información'), 'whoosh', 0.6);
pop(en('Sigue'));
add(en('Invora', 2), 'campanita', 0.8);

export const EVENTOS = ev.sort((a, b) => a.f - b.f);
