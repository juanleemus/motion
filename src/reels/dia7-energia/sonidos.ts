// Efectos de sonido atados a cada animación de Reel.tsx del Día 7 (mismas palabras, mismos fotogramas).
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

// Portada
texto(en('no se resuelve'));
add(en('más chips'), 'trazo', 0.6);
add(en('chips') + 6, 'trazo', 0.9);
add(en('chips') + 6, 'no', 0.6);
// Sin luz
icono(en('Se está'));
texto(en('Se está'));
[0, 4, 8].forEach((d) => add(en('luz') + d, 'tic', 0.6));
add(en('luz'), 'no', 0.5);
// Nvidia, Amazon, Soros, Thiel
texto(en('El CEO'));
logo(en('Nvidia'));
texto(en('ya dijo'));
logo(en('Amazon', 1));
add(en('Soros', 1), 'pop', 0.8);
add(en('Peter'), 'pop', 0.8);
icono(en('metieron'), en('misma empresa'));
texto(en('metieron'));
// Día 7
insignia(en('Día 7'));
icono(en('Día 7') + 4);
texto(en('de la escuela'));
logoInvora(en('Invora', 1));
// Centro de datos = ciudad
texto(en('centro'));
icono(en('centro'));
add(en('la misma', 2), 'pop', 0.6);
texto(en('gasta'));
icono(en('ciudad'));
// La red llena
icono(en('y en muchas'), en('la red'));
texto(en('Estados', 1));
for (let f = en('la red') + 4; f < en('llena'); f += 4) add(f, 'tic', 0.35);
add(en('llena'), 'campanita', 0.8);
texto(en('llena'));
// ¿De dónde sale la energía?
icono(en('De dónde'));
texto(en('De dónde'));
// Solar y eólica, gas, nuclear
insignia(en('Tanto'));
icono(en('solar'));
icono(en('eólica'));
texto(en('no son'));
add(en('constantes') + 4, 'trazo', 0.9);
add(en('constantes') + 4, 'no', 0.6);
insignia(en('Las turbinas'));
icono(en('turbinas'));
texto(en('vendidas'));
insignia(en('Queda'));
icono(en('Queda'));
texto(en('Queda'));
// Problema brutal
icono(en('pero la de'));
texto(en('pero la de'));
// Dos plantas, $35.000 millones, ×2, 7 años
icono(en('dos', 1));
icono(en('dos', 1) + 6);
texto(en('Y las últimas'));
texto(en('costaron'));
texto(en('alrededor'));
cifra(en('35.000'));
texto(en('millones', 1));
cifra(en('doble'));
texto(en('doble'));
cifra(en('siete'));
texto(en('siete'));
// Reactores modulares, en serie
icono(en('La solución para'), en('reactores'));
texto(en('reactores'));
for (let i = 0; i < 8; i++) add(en('Fabricarlos') + i * 3, 'pop', 0.35);
texto(en('Fabricarlos'));
texto(en('armarlos'));
// Chat de Invora
texto(en('Le pregunté'));
logoInvora(en('Invora', 2));
add(en('Le pregunté'), 'pop', 0.6);
{
	const a = en('qué empresa');
	const b = finDe('junto');
	for (let f = a; f < b; f += 3) add(f, 'tecleo', 0.45);
	add(b, 'whoosh', 0.7);
}
add(finDe('junto') + 3, 'pop', 0.5);
// X-energy
logo(en('X-energy'));
add(en('X-energy'), 'campanita', 0.6);
icono(en('hace su'), en('combustible'));
texto(en('hace su'));
// Licencia, 50 años
icono(en('Tiene la primera'), en('licencia'));
texto(en('Tiene la primera'));
texto(en('que otorga'));
cifra(en('50'));
// $500 millones, Amazon, Ken Griffin
texto(en('y acaba'));
cifra(en('500'));
texto(en('millones', 2));
logo(en('Amazon', 2));
add(en('Ken'), 'pop', 0.8);
// Precio objetivo y brecha
texto(en('Y el precio'));
add(en('Y el precio'), 'trazo', 0.6);
add(en('muy por encima'), 'whoosh', 0.9);
texto(en('muy por encima'));
add(en('hoy'), 'campanita', 0.6);
// Ojo
icono(en('Ojo'));
texto(en('una brecha'));
add(en('no es'), 'trazo', 0.9);
add(en('no es'), 'no', 0.6);
add(finDe('regalo') + 4, 'whoosh', 0.7);
texto(en('Existe'));
// Comenta ENERGÍA
texto(en('Comenta'));
'ENERGÍA'.split('').forEach((_, i) => add(en('energía', 4) + i * 2, 'tecleo', 0.9));
add(en('energía', 4) + 16, 'whoosh', 0.8);
add(en('te mando'), 'campanita', 0.9);
// Contratos y tres riesgos
texto(en('Por un lado'));
icono(en('contratos'));
texto(en('por el otro'));
cifra(en('tres'));
texto(en('riesgos'));
// Sí / no
add(en('gringos'), 'pop', 0.9);
add(en('gringos') + 2, 'campanita', 0.6);
add(en('Aquí todavía'), 'no', 0.9);
// Cierre
texto(en('Por esto'));
logoInvora(en('Invora', 3));
texto(en('Soy Miguel'));
insignia(en('mañana'));

export const EVENTOS = ev.sort((a, b) => a.f - b.f);
