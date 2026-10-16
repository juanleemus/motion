// Efectos de sonido del Día 11, atados a cada animación de dia11/Reel.tsx (mismas palabras, mismos fotogramas).
import {en} from './tiempos.ts';
import {ESCENAS} from './escenas.ts';
import type {Efecto, Evento} from '../sonidos.ts';

const ev: Evento[] = [];
const add = (f: number, tipo: Efecto, vol = 1) => ev.push({f, tipo, vol});

const texto = (f: number) => add(f, 'whoosh', 0.55);
const logo = (f: number) => add(f, 'pop', 1);
// El ícono se dibuja en `f` y se enciende en `enc` (por defecto, al terminar de dibujarse).
const icono = (f: number, enc = f + 15) => {
	add(f, 'trazo', 0.8);
	add(enc, 'campanita', 0.7);
};
const insignia = (f: number) => {
	[0, 3, 6].forEach((d) => add(f + d, 'tic', 0.7));
	add(f + 9, 'pop', 0.7);
};
const cifra = (f: number) => {
	add(f, 'conteo', 0.8);
	add(f + 22, 'pop', 0.6);
};
const logoInvora = (f: number) => {
	add(f, 'whoosh', 0.8);
	add(f + 14, 'trazo', 0.6);
};
const renglon = (f: number) => {
	add(f, 'tic', 0.8);
	add(f, 'pop', 0.5);
};

// Portada (la música arranca sola)
// Druckenmiller y la plata
icono(en('Stanley'));
texto(en('Stanley'));
texto(en('hoy tiene'));
cifra(en('865'));
texto(en('millones', 1));
// Empresa y examen de sangre
icono(en('en una empresa'));
texto(en('casi nadie'));
icono(en('que busca'), en('sangre', 1));
texto(en('el cáncer', 1));
// Día 11
insignia(en('Día 11'));
icono(en('Día 11') + 4);
texto(en('de la Escuela'));
logoInvora(en('Invora', 1));
// Explicación
icono(en('Después'));
texto(en('todo paciente'));
add(en('Se fue'), 'pop', 1);
add(en('Se fue'), 'whoosh', 0.6);
icono(en('El problema'), en('pequeños'));
texto(en('restos'));
icono(en('pero las células'), en('ADN', 1));
texto(en('tienen cambios'));
icono(en('y pedacitos'), en('sangre', 2));
texto(en('y pedacitos'));
for (let i = 0; i < 7; i++) add(en('y pedacitos') + 8 + i * 4 + 14, 'pop', 0.3);
icono(en('Entonces'), en('huella'));
texto(en('huella'));
// Natera y el chat de Invora
texto(en('Y la empresa'));
logo(en('Natera', 1));
texto(en('Le pregunté'));
add(en('Le pregunté'), 'pop', 0.6);
{
	const a = en('Le pregunté') + 6;
	const b = en('buena empresa') + 4;
	for (let f = a; f < b; f += 3) add(f, 'tecleo', 0.45);
	add(b, 'whoosh', 0.7);
	add(b + 6, 'pop', 0.5);
}
// 300 mil pacientes
logo(en('Natera', 2));
texto(en('Como la historia'));
cifra(en('300'));
texto(en('mil'));
for (let i = 0; i < 10; i++) add(en('mil') + i * 2, 'pop', 0.3);
renglon(en('El tratamiento'));
renglon(en('si el cáncer'));
// IA y riesgos
icono(en('y con esto'), en('inteligencia'));
texto(en('inteligencia'));
icono(en('Pero Invora'), en('dos riesgos'));
logoInvora(en('Pero Invora'));
texto(en('también me mostró'));
insignia(en('Uno'));
icono(en('esa IA'));
texto(en('esa IA'));
texto(en('que mejore'));
insignia(en('Dos', 2));
icono(en('Dos', 2));
texto(en('la empresa no'));
add(en('no es rentable'), 'trazo', 0.9);
add(en('no es rentable'), 'no', 0.7);
texto(en('Perdió'));
cifra(en('67'));
texto(en('millones', 2));
texto(en('el último trimestre'));
// Comenta
texto(en('Comenta'));
logo(en('Natera', 3));
'NATERA'.split('').forEach((_, i) => add(en('Natera', 3) + i * 3, 'tecleo', 0.9));
add(en('te mando'), 'whoosh', 0.8);
add(en('te mando'), 'campanita', 0.9);
renglon(en('el portafolio'));
renglon(en('que están'));
renglon(en('la misma valoración'));
// Sí / no
add(en('gringos'), 'pop', 0.9);
add(en('gringos') + 2, 'campanita', 0.6);
add(en('Y aquí'), 'no', 0.9);
// Cierre
texto(en('Por esto'));
logoInvora(en('Invora', 4));
texto(en('Soy Miguel'));
insignia(en('mañana'));

export const EVENTOS = ev.filter((e) => e.f < ESCENAS.fin).sort((a, b) => a.f - b.f);
