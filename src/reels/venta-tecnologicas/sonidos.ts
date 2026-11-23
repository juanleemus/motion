// Efectos de "venta-tecnologicas": golpe grave en cada ficha o cifra roja, conteo cuando sube NVIDIA,
// y los de siempre en cada pieza (como pide el guion audiovisual).
import type {Efecto, Evento} from '../../sonidos.ts';
import {en} from './tiempos.ts';
import {ESCENAS} from './escenas.ts';

const ev: Evento[] = [];
const add = (f: number, tipo: Efecto, vol = 1) => {
	if (f >= 0) ev.push({f, tipo, vol});
};
const rojo = (f: number) => {
	add(f, 'golpe', 0.6);
	add(f, 'tic', 0.6);
};
const pildora = (f: number) => add(f, 'pop', 0.75);
const cambio = (f: number) => add(f, 'whoosh', 0.35);
const titular = (f: number) => {
	add(f, 'whoosh', 0.6);
	add(f + 2, 'pop', 0.7);
};

// 1. Gancho
rojo(en('5%', 1));
add(en('30%', 1), 'conteo', 0.9);
add(en('30%', 1) + 16, 'campanita', 0.7);
add(en('Qué está pasando'), 'whoosh', 0.55);
// 2. Viernes
cambio(ESCENAS.viernes - 6);
add(en('Primero'), 'whoosh', 0.5);
rojo(en('5.28%'));
rojo(en('10%'));
rojo(en('3.70%'));
// 3. Racha
cambio(ESCENAS.racha - 6);
add(en('Fue su'), 'whoosh', 0.55);
for (let i = 0; i < 7; i++) add(en('séptima') + i * 4, 'tic', 0.7);
add(en('La peor racha'), 'golpe', 0.5);
pildora(en('La peor racha'));
// 4. CNBC
cambio(ESCENAS.cnbc - 6);
titular(en('Y según CNBC'));
pildora(en('borró'));
add(en('borró'), 'no', 0.4);
// 5. Chips
cambio(ESCENAS.chips - 6);
add(en('Quién cayó'), 'whoosh', 0.55);
rojo(en('Micron'));
rojo(en('AMD', 1));
rojo(en('9.48%'));
rojo(en('6.63%'));
// 6. Cadena
cambio(ESCENAS.cadena - 6);
add(en('solo una'), 'trazo', 0.9);
add(en('cayó toda'), 'golpe', 0.7);
// 7. Giro
cambio(ESCENAS.giro - 6);
add(en('Y hoy el giro'), 'whoosh', 0.8);
add(en('Y hoy el giro') + 4, 'campanita', 0.7);
titular(en('la junta'));
// 8. NVIDIA +30 %
cambio(ESCENAS.nvidia30 - 6);
pildora(en('Y después de la apertura'));
add(en('la acción llegó'), 'pop', 0.9);
add(en('30%', 2), 'conteo', 1);
add(en('30%', 2) + 16, 'campanita', 0.8);
// 9. Suben
cambio(ESCENAS.suben - 6);
add(en('Según Yahoo'), 'whoosh', 0.5);
add(en('Yahoo'), 'pop', 0.9);
add(en('Invezz'), 'pop', 0.8);
add(en('6%'), 'conteo', 0.8);
add(en('Anthropic'), 'pop', 0.9);
pildora(en('también está subiendo'));
add(en('CNBC', 3), 'pop', 0.8);
add(en('MarketWatch'), 'pop', 0.8);
// 10. Ojo
cambio(ESCENAS.ojo - 6);
add(en('Pero ojo'), 'whoosh', 0.55);
add(en('Son cifras'), 'pop', 0.7);
add(en('Que una acción'), 'pop', 0.7);
pildora(en('tampoco'));
// 11. Volatilidad
cambio(ESCENAS.volatilidad - 6);
add(en('Después de movimientos'), 'trazo', 0.7);
add(en('rebote'), 'campanita', 0.6);
add(en('caída fuerte'), 'golpe', 0.6);
// 12-13. Medios
cambio(ESCENAS.bloomberg - 6);
titular(en('Según Bloomberg'));
cambio(ESCENAS.fed - 6);
titular(en('Y según 24/7'));
// 14. Qué hacemos
cambio(ESCENAS.hacemos - 6);
add(en('Mirar los datos'), 'whoosh', 0.55);
add(en('Qué empresas'), 'pop', 0.8);
add(en('Qué proyectan'), 'pop', 0.8);
add(en('directivos'), 'pop', 0.8);
// 15. Datos
cambio(ESCENAS.datos - 6);
pildora(en('Porque cuando'));
add(en('titulares'), 'trazo', 0.9);
add(en('titulares'), 'no', 0.45);
add(en('se ve en los datos'), 'whoosh', 0.7);
add(en('se ve en los datos') + 4, 'campanita', 0.6);
// 16. Método
cambio(ESCENAS.metodo - 6);
add(en('Nadie sabe'), 'whoosh', 0.5);
add(en('método'), 'golpe', 0.5);
add(en('método'), 'campanita', 0.8);
// 17. Invora
cambio(ESCENAS.invora - 6);
add(en('En Invora'), 'whoosh', 0.8);
add(en('comprar'), 'trazo', 0.9);
add(en('comprar'), 'no', 0.5);
add(en('te mostramos'), 'whoosh', 0.6);
// 18. Comenta CAÍDA
cambio(ESCENAS.comenta - 6);
add(en('Comenta'), 'whoosh', 0.55);
for (let i = 0; i < 5; i++) add(en('caída', 4) + i * 3, 'tecleo', 0.8);
add(en('te enviamos'), 'whoosh', 0.7);
add(en('NVIDIA', 4), 'pop', 0.9);
add(en('AMD', 2), 'pop', 0.9);
add(en('Micron', 2), 'pop', 0.9);
// 19. Cierre
cambio(ESCENAS.cierre - 6);
add(en('Esto es información'), 'whoosh', 0.6);
pildora(en('Sigue'));
add(en('Invora', 2), 'whoosh', 0.8);
add(en('Invora', 2) + 6, 'campanita', 0.8);

export const EVENTOS = ev.sort((a, b) => a.f - b.f);
