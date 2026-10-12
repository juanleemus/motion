// Efectos de sonido atados a cada animación de Reel.tsx (mismas palabras, mismos fotogramas).
import {en, finDe} from './tiempos.ts';

export type Efecto = 'pop' | 'whoosh' | 'tic' | 'trazo' | 'tecleo' | 'campanita' | 'conteo' | 'no';
export type Evento = {f: number; tipo: Efecto; vol?: number};

const ev: Evento[] = [];
const add = (f: number, tipo: Efecto, vol = 1) => ev.push({f, tipo, vol});

// Piezas de ui.tsx
const texto = (f: number) => add(f, 'whoosh', 0.55);
const logo = (f: number) => add(f, 'pop', 1);
const icono = (f: number) => {
	add(f, 'trazo', 0.8);
	add(f + 15, 'campanita', 0.7);
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
logo(en('Uber', 1));
// CEO / Pelosi / Ackman
insignia(en('CEO'));
logo(en('Uber', 2));
texto(en('está comprando', 1));
cifra(en('10 millones'));
texto(en('millones'));
texto(en('propia plata'));
insignia(en('Nancy'));
icono(en('Nancy'));
texto(en('también compró'));
insignia(en('Bill'));
texto(en('tiene más plata'));
logo(en('Uber', 3));
texto(en('cualquier otra'));
icono(en('Alguien'));
texto(en('equivocando'));
// Día 5
insignia(en('Día 5'));
icono(en('Día 5') + 4);
texto(en('de la Escuela'));
logoInvora(en('Invora', 1));
// Miedo, carros, Waymo, Tesla
icono(en('miedo', 1));
texto(en('A qué le'));
icono(en('carros', 1));
texto(en('A los carros'));
logo(en('Waymo', 1));
texto(en('de Google'));
logo(en('Google'));
texto(en('taxis sin'));
texto(en('varias ciudades'));
logo(en('Tesla'));
texto(en('armando'));
icono(en('red'));
texto(en('la pregunta', 1));
logo(en('Waymo', 2));
icono(en('el carro', 1));
texto(en('para qué'));
logo(en('Uber', 4));
// Chat de Invora
texto(en('una sola'));
add(en('Entonces'), 'pop', 0.6);
{
	const a = en('si los robotaxis');
	const b = finDe('están comprando', 1);
	for (let f = a; f < b; f += 3) add(f, 'tecleo', 0.45);
	add(b, 'whoosh', 0.7);
}
add(en('Y la respuesta'), 'pop', 0.5);
texto(en('cambia todo'));
add(en('cambia todo'), 'campanita', 0.6);
// Una o dos, flotas, apps
texto(en('El miedo supone'));
texto(en('una o dos'));
texto(en('empresas'));
texto(en('Pero y si'));
cifra(en('diez', 1));
cuadricula(en('flotas'), 10, 2);
cuadricula(en('diez', 2), 10, 2);
texto(en('Diez apps'));
add(en('Tú no vas'), 'no', 0.8);
add(en('Vas a abrir', 2), 'whoosh', 0.7);
add(en('Vas a abrir', 2) + 12, 'campanita', 0.6);
icono(en('el carro', 2));
texto(en('el carro', 2));
texto(en('Y esa app'));
logo(en('Uber', 6));
// Ojo
icono(en('Ojo'));
texto(en('eso no quiere'));
texto(en('los de adentro', 2));
add(en('tengan razón'), 'trazo', 0.9);
add(en('tengan razón'), 'no', 0.6);
add(finDe('tengan razón') + 4, 'whoosh', 0.7);
texto(en('Pero ahora'));
icono(en('Pero ahora'));
// Comenta
texto(en('Comenta'));
'UBER'.split('').forEach((_, i) => add(en('UBER', 7) + i * 4, 'tecleo', 0.9));
add(en('UBER', 7) + 22, 'whoosh', 0.8);
add(en('te mando'), 'campanita', 0.9);
// Sí / no
add(en('gringos'), 'pop', 0.9);
add(en('gringos') + 2, 'campanita', 0.6);
add(en('Aquí no'), 'no', 0.9);
// Cierre
texto(en('Por eso'));
logoInvora(en('Invora', 4));
texto(en('Soy Miguel'));
insignia(en('mañana'));

export const EVENTOS = ev.sort((a, b) => a.f - b.f);
