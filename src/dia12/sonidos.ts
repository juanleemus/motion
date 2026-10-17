// Efectos de sonido atados a cada animación de dia12/Reel.tsx (mismas palabras, mismos fotogramas).
import {en, finDe} from './tiempos.ts';
import {ESCENAS} from './escenas.ts';
import type {Efecto, Evento} from '../sonidos.ts';

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
const tecleo = (desde: number, hasta: number, vol = 0.45) => {
	for (let f = desde; f < hasta; f += 3) add(f, 'tecleo', vol);
};

// Portada y gancho
icono(ESCENAS.cadena + 2);
texto(en('inteligencia'));
logo(en('Meta', 1));
texto(en('es una'));
add(en('ya subió'), 'trazo', 0.7);
add(en('ya subió') + 18, 'campanita', 0.5);
icono(en('Hay otra'));
texto(en('Hay otra') + 6);
icono(en('Todo el mundo'));
texto(en('cree que'));
// Día 12
insignia(en('Día 12'));
icono(en('Día 12') + 4);
texto(en('de la Escuela'));
logoInvora(en('Invora', 1));
// Torta de 5 pisos
texto(en('La IA es'));
add(en('torta'), 'trazo', 0.8);
for (const p of ['Energía', 'chips', 'centros', 'modelos', 'aplicaciones']) add(en(p), 'pop', 0.7);
add(en('los cinco', 1), 'campanita', 0.8);
texto(en('te quedas'));
texto(en('Si alquilas'));
add(en('alquilas'), 'whoosh', 0.8);
texto(en('el dueño'));
// Chat de Invora
texto(en('Le pedí'));
add(en('Le pedí') + 4, 'pop', 0.6);
tecleo(en('que revisara'), finDe('los cinco', 2));
add(finDe('los cinco', 2), 'whoosh', 0.7);
add(finDe('los cinco', 2) + 3, 'pop', 0.5);
add(en('Salen'), 'campanita', 0.6);
// Las 4 que tienen los 5 pisos
texto(ESCENAS.cuatro + 2);
logo(en('Amazon'));
logo(en('Microsoft'));
logo(en('Meta', 2));
logo(en('Google', 1));
// La número uno
insignia(en('Y la número'));
logo(en('Meta', 3));
add(finDe('Meta', 3), 'trazo', 0.9);
add(finDe('Meta', 3), 'no', 0.6);
logo(en('Google', 2));
// Los 5 pisos de Google
for (const p of ['En energía', 'En chips', 'En nube', 'Modelo', 'En apps']) insignia(en(p));
icono(en('En energía'));
cifra(en('tres'));
texto(en('gigavatios'));
icono(en('En chips'));
texto(en('los suyos'));
logo(en('Anthropic'));
texto(en('le alquila'));
icono(en('En nube'));
cifra(en('514'));
texto(en('mil millones'));
texto(en('contratos'));
logo(en('Gemini'));
cifra(en('950'));
texto(en('millones de usuarios'));
icono(en('búsqueda'));
texto(en('búsqueda'));
logo(en('YouTube'));
logo(en('Android'));
logo(en('Gmail'));
// 17 contra 20–27
logo(en('unas 17'));
cifra(en('17'));
texto(en('utilidades'));
texto(en('contra'));
add(en('20 a 27'), 'pop', 0.6);
texto(en('de las otras'));
// Casi 20 % abajo
texto(en('Entonces'));
cifra(en('casi 20'));
icono(en('casi 20') + 6, en('abajo'));
texto(en('abajo'));
// Desde febrero
add(en('Porque desde'), 'trazo', 0.7);
add(en('febrero'), 'pop', 0.6);
texto(en('sus modelos'));
// Ojo
icono(en('Ojo'));
texto(en('esto no quiere'));
texto(en('vaya'));
add(en('volver'), 'trazo', 0.9);
add(en('volver'), 'no', 0.6);
add(finDe('volver') + 4, 'whoosh', 0.7);
// Titulares
texto(en('Pero cuando'));
add(en('titulares'), 'pop', 0.7);
logo(en('Google', 3));
tecleo(en('Google volvió'), finDe('Google volvió'), 0.5);
// La caída ya habrá pasado
texto(en('la caída'));
add(en('la caída'), 'trazo', 0.7);
add(en('caída'), 'pop', 0.5);
add(en('pasado'), 'campanita', 0.7);
texto(en('como ya vimos'));
logo(en('Meta', 4));
// Comenta
texto(en('Comenta'));
logo(en('Google', 4));
'GOOGLE'.split('').forEach((_, i) => add(en('Google', 4) + i * 4, 'tecleo', 0.9));
add(en('Google', 4) + 30, 'whoosh', 0.8);
add(en('te mando'), 'campanita', 0.9);
// Sí / no
add(en('Esto los gringos'), 'pop', 0.9);
add(en('Esto los gringos') + 2, 'campanita', 0.6);
add(en('aquí no'), 'no', 0.9);
// Cierre
texto(en('Por eso'));
logoInvora(en('Invora', 3));
texto(en('Soy Miguel'));
insignia(en('mañana'));

export const EVENTOS = ev.sort((a, b) => a.f - b.f);
