// Efectos de sonido atados a cada animación de acciones/Reel.tsx (mismas palabras, mismos fotogramas).
import {en} from './tiempos.ts';
import {ESCENAS} from './escenas.ts';

export type Efecto = 'pop' | 'whoosh' | 'tic' | 'trazo' | 'tecleo' | 'campanita' | 'conteo' | 'no';
export type Evento = {f: number; tipo: Efecto; vol?: number};

const ev: Evento[] = [];
const add = (f: number, tipo: Efecto, vol = 1) => ev.push({f, tipo, vol});

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
const logoInvora = (f: number) => {
	add(f, 'whoosh', 0.8);
	add(f + 14, 'trazo', 0.6);
};
const serie = (f: number, n: number, paso: number, tipo: Efecto = 'pop', vol = 0.35) => {
	for (let i = 0; i < n; i++) add(f + i * paso, tipo, vol);
};

// Portada
icono(en('noticias'), en('tarde'));
// Cuatro formas
add(en('cuatro', 1), 'conteo', 0.8);
texto(en('formas'));
serie(en('y la cuarta'), 4, 3, 'pop', 0.4);
add(en('cuarta'), 'campanita', 0.7);
texto(en('y la cuarta'));
// 1 · reportes
insignia(en('Uno'));
icono(en('Lee'), en('reportes'));
texto(en('Lee'));
texto(en('Busca'));
icono(en('frena'), en('crecimiento'));
texto(en('quién'));
texto(en('Meses'));
logo(en('Micron'));
add(en('Micron') + 4, 'trazo', 0.5);
add(en('disparara'), 'whoosh', 1.0);
add(en('disparara') + 10, 'campanita', 0.6);
logo(en('Microsoft'));
logo(en('Meta'));
logo(en('Amazon'));
texto(en('ya decían'));
icono(en('memoria') - 8, en('memoria') + 7);
// 2 · directivos
insignia(en('Dos'));
icono(en('Directivos'));
texto(en('Directivos'));
add(en('Pero con'), 'pop', 0.9);
add(en('Pero con') + 2, 'campanita', 0.5);
add(en('no acciones'), 'no', 0.9);
icono(en('Plata propia'), en('convicción'));
texto(en('Plata propia'));
// 3 · fondos y políticos
insignia(en('Tres'));
icono(en('Fondos'));
texto(en('Fondos'));
icono(en('políticos'));
texto(en('políticos'));
texto(en('entrando'));
texto(en('Si gente'));
serie(en('gente'), 3, 4, 'pop', 0.5);
add(en('llega'), 'whoosh', 0.8);
add(en('mismo'), 'pop', 0.9);
add(en('mismo') + 2, 'campanita', 0.5);
texto(en('pregúntate'));
// 4 · redes
insignia(en('Y cuatro'));
texto(en('Y cuatro') + 12);
serie(en('cada vez'), 12, 2, 'pop', 0.3);
add(en('Pero no leas'), 'no', 0.9);
add(en('lee los comentarios'), 'pop', 0.9);
add(en('lee los comentarios') + 2, 'campanita', 0.5);
// medidor
add(en('Si todo'), 'whoosh', 0.6);
texto(en('Si todo'));
add(en('eufórico'), 'whoosh', 1.0);
add(en('ya vas'), 'no', 0.7);
texto(en('ya vas'));
texto(en('Si hay'));
serie(en('pelea'), 6, 4, 'tic', 0.6);
texto(en('todavía'));
texto(en('Y ahí'));
add(en('oportunidad'), 'campanita', 0.9);
// Cierre con Invora
icono(en('No lo hagas'));
texto(en('No lo hagas'));
add(en('mano'), 'no', 0.9);
logoInvora(en('Invora'));
texto(en('hace las'));
serie(en('cuatro', 3), 4, 3, 'pop', 0.6);
add(en('cuatro', 3) + 9, 'campanita', 0.7);
texto(en('Comenta'));
'GUIA'.split('').forEach((_, i) => add(en('GUIA') + i * 4, 'tecleo', 0.9));
add(en('GUIA') + 22, 'whoosh', 0.8);
add(en('te mando'), 'campanita', 0.9);
logoInvora(ESCENAS.cierre);
texto(en('Miguel'));

export const EVENTOS = ev.sort((a, b) => a.f - b.f);
