// Efectos de sonido atados a cada animación de Reel.tsx del Día 8 (mismas palabras, mismos fotogramas).
import type {Efecto, Evento} from '../../sonidos.ts';
import {en, finDe} from './tiempos.ts';

const ev: Evento[] = [];
const add = (f: number, tipo: Efecto, vol = 1) => ev.push({f, tipo, vol});

// Piezas de ui.tsx
const texto = (f: number) => add(f, 'whoosh', 0.55);
const logo = (f: number) => add(f, 'pop', 1);
const icono = (f: number, enciende = f + 15) => {
	add(f, 'trazo', 0.8);
	add(enciende, 'campanita', 0.7);
};
const insignia = (f: number) => {
	[0, 3, 6].forEach((d) => add(f + d, 'tic', 0.7));
	add(f + 9, 'pop', 0.7);
};
const cifra = (f: number) => add(f, 'conteo', 0.8);
const logoInvora = (f: number) => {
	add(f, 'whoosh', 0.8);
	add(f + 14, 'trazo', 0.6);
};
const cuadricula = (f: number, n: number, paso: number) => {
	for (let i = 0; i < n; i++) add(f + i * paso, 'pop', 0.35);
};

// Portada
add(en('Thiel', 1), 'pop', 0.8);
texto(en('una sola'));
add(en('nada'), 'trazo', 0.9);
add(en('nada'), 'no', 0.6);
add(finDe('nada') + 2, 'whoosh', 0.6);
// $419 millones en 8 empresas
texto(en('Y de repente'));
cifra(en('419'));
texto(en('millones', 1));
cuadricula(en('ocho'), 8, 2);
texto(en('ocho'));
// PayPal y Palantir
texto(en('Cuando'));
logo(en('PayPal'));
logo(en('Palantir'));
texto(en('se despierta'));
icono(en('Hay que mirar'));
texto(en('Hay que mirar'));
// Día 8
insignia(en('día 8'));
icono(en('día 8') + 4);
texto(en('de la Escuela'));
logoInvora(en('Invora', 1));
// Chat de Invora
texto(en('Le pedí'));
logoInvora(en('Invora', 2));
{
	const a = en('que me desarmara');
	const b = finDe('portafolio');
	for (let f = a; f < b; f += 3) add(f, 'tecleo', 0.45);
	add(b, 'whoosh', 0.7);
}
add(finDe('portafolio') + 3, 'pop', 0.5);
add(en('es una sola'), 'campanita', 0.7);
// La electricidad de la IA
icono(en('La electricidad'));
texto(en('La electricidad'));
// Producir, mover, gastar
insignia(en('Producir'));
texto(en('Producir'));
logo(en('Vistra'));
logo(en('Vista Energy'));
logo(en('X-energy'));
insignia(en('Moverla'));
cifra(en('cuatro'));
texto(en('empresas', 2));
logo(en('American'));
logo(en('DTE'));
logo(en('FirstEnergy'));
logo(en('CMS'));
insignia(en('gastarla'));
texto(en('su posición'));
logo(en('Amazon'));
icono(en('centros'), en('absurdas'));
texto(en('consumen'));
// Chips vs electricidad
add(en('todo el mundo'), 'trazo', 0.7);
texto(en('todo el mundo'));
icono(en('Thiel', 2), en('electricidad', 2));
texto(en('Thiel', 2));
// Ojo
icono(en('Ojo'));
texto(en('que Thiel compre'));
texto(en('que tú'));
add(en('comprar', 2) + 4, 'trazo', 0.9);
add(en('comprar', 2) + 4, 'no', 0.6);
add(finDe('comprar', 2) + 4, 'whoosh', 0.7);
texto(en('Él tiene'));
// Dinero grande, trimestre
icono(en('Pero sí'), en('mirando'));
texto(en('Pero sí'));
icono(en('Los movimientos'), en('trimestre'));
texto(en('Los movimientos'));
// Comenta THIEL
texto(en('Comenta'));
'THIEL'.split('').forEach((_, i) => add(en('Thiel', 5) + i * 3, 'tecleo', 0.9));
add(en('Thiel', 5) + 20, 'whoosh', 0.8);
add(en('acceso'), 'campanita', 0.9);
// Thiel, Buffett, Gates, todos
add(en('Thiel', 6), 'pop', 0.8);
add(en('Buffett'), 'pop', 0.8);
add(en('Gates'), 'pop', 0.8);
cuadricula(en('absolutamente', 2), 15, 1);
texto(en('absolutamente', 2));
// Sí / no
add(en('gringos'), 'pop', 0.9);
add(en('gringos') + 2, 'campanita', 0.6);
add(en('Aquí todavía'), 'no', 0.9);
// Cierre
texto(en('Por eso'));
logoInvora(en('Invora', 3));
texto(en('Soy Miguel'));
insignia(en('mañana'));

export const EVENTOS = ev.sort((a, b) => a.f - b.f);
