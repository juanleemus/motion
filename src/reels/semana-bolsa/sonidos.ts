// Efectos de sonido atados a cada animación de Reel.tsx de "semana-bolsa" (mismas palabras, mismos fotogramas).
import type {Efecto, Evento} from '../../sonidos.ts';
import {en} from './tiempos.ts';
import {ESCENAS} from './escenas.ts';

const ev: Evento[] = [];
const add = (f: number, tipo: Efecto, vol = 1) => {
	if (f >= 0) ev.push({f, tipo, vol});
};

// Piezas de columna.tsx
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
const vacia = (f: number) => add(f, 'tic', 0.6);
const llena = (f: number) => {
	add(f, 'pop', 0.9);
	add(f + 2, 'campanita', 0.45);
};
const dia = (f: number) => add(f, 'pop', 0.7);
const cambio = (f: number) => add(f, 'whoosh', 0.35); // salida de la columna / cambio de fondo

// Apertura (la portada ya está en pantalla en el fotograma 0)
dia(en('martes', 1));
dia(en('miércoles', 1));
dia(en('jueves', 1));
pildora(en('Te cuento'));
// NVIDIA
cambio(ESCENAS.nvidia - 6);
etiqueta(en('Hoy martes'));
logo(en('NVIDIA'));
titulo(en('NVIDIA'));
tarjeta(en('Es la empresa'));
vacia(en('primera vez'));
pildora(en('primera vez'));
pildora(en('sin Jensen'));
llena(en('Jensen'));
// Opciones
cambio(ESCENAS.opciones - 6);
etiqueta(en('Según las opciones'));
titulo(en('mercado', 1));
franja(en('entre el 7'));
cifra(en('7'));
cifra(en('10'));
pildora(en('arriba'));
pildora(en('abajo'));
add(en('abajo'), 'no', 0.35);
// La Fed
cambio(ESCENAS.fed - 6);
etiqueta(en('Mañana'));
logo(en('la Reserva'));
titulo(en('la Reserva'));
tarjeta(en('el acta'));
franja(en('a las dos'));
cifra(en('dos'));
// CME FedWatch
cambio(ESCENAS.fedwatch - 6);
etiqueta(en('Según CME'));
logo(en('CME'));
etiqueta(en('FedWatch'));
titulo(en('el mercado', 1));
franja(en('casi'));
add(en('subida') - 12, 'trazo', 0.6);
add(en('subida') + 8, 'campanita', 0.55);
pildora(en('el 9'));
pildora(en('Cualquier'));
// Jueves
cambio(ESCENAS.jueves - 6);
etiqueta(en('Y el jueves'));
titulo(en('según la Casa'), true);
[0, 3, 6].forEach((d) => vacia(en('Casa Blanca') + d));
llena(en('Trump'));
llena(en('Xi'));
llena(en('Putin'));
pildora(en('se reúnen'));
// Irán y petróleo
cambio(ESCENAS.iran - 6);
etiqueta(en('Se espera'));
titulo(en('Irán'), true);
tarjeta(en('Y eso puede'));
pildora(en('petróleo'));
pildora(en('petróleo') + 3);
// Cierre
cambio(ESCENAS.cierre - 6);
etiqueta(en('Nadie'));
titulo(en('Nadie'), true);
dia(en('qué día'));
dia(en('pasa', 1));
dia(en('cada cosa'));
pildora(en('evita'));
// Encuesta
cambio(ESCENAS.encuesta - 6);
etiqueta(en('Y tú'));
titulo(en('Y tú'));
titulo(en('La bolsa', 2));
llena(en('sube'));
llena(en('cae'));
{
	const a = en('Escríbelo');
	const b = en('comentarios') + 6;
	for (let f = a + 4; f < b; f += 3) add(f, 'tecleo', 0.4);
	add(b, 'whoosh', 0.7);
	add(a, 'whoosh', 0.5); // logo INVORA
}
// Sigue a Invora
cambio(ESCENAS.sigue - 6);
pildora(en('y sigue'));
add(en('Invora'), 'whoosh', 0.8);
add(en('Invora') + 6, 'campanita', 0.8);
add(en('Invora') + 14, 'trazo', 0.6);
titulo(en('para entender'));

export const EVENTOS = ev.sort((a, b) => a.f - b.f);
