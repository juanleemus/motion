// Pista de B-roll: un clip nuevo cada ~3 s (corte seco + zoom 105 % → 110 %), según lo que dice la voz.
// "etiqueta" es lo que conviene conseguir (lista de B-roll); "src" es el clip de muestra de Mixkit que va en la vista previa.
import {ESCENAS as E} from './escenas.ts';
import type {ClipBroll} from '../../robots/objetos';

const A = 'apoyo-venta-tecnologicas';
type Pool = [string, string][]; // [archivo, qué conseguir]
const POOLS: [keyof typeof E, Pool][] = [
	['gancho', [['wall-street.mp4', 'letreros de Wall Street / piso de la bolsa NYSE'], ['cotizaciones.mp4', 'pantalla del Nasdaq en rojo'], ['grafica.mp4', 'NVIDIA en verde en una pantalla']]],
	['viernes', [['grafica-cae.mp4', 'gráfica del Nasdaq cayendo'], ['cotizaciones.mp4', 'pantalla de cotizaciones en rojo']]],
	['racha', [['cotizaciones.mp4', 'tablero de bolsa en rojo'], ['grafica-cae.mp4', 'velas rojas en una pantalla']]],
	['cnbc', [['periodico.mp4', 'titulares de CNBC / prensa financiera']]],
	['chips', [['fabrica-chips.mp4', 'fábrica de chips (TSMC)'], ['fabrica-chips.mp4', 'máquina que fabrica chips (ASML)'], ['microchips.mp4', 'chips de Micron / AMD']]],
	['cadena', [['microchips.mp4', 'cadena de chips de IA'], ['fabrica-chips.mp4', 'línea de producción de semiconductores']]],
	['giro', [['fotos/jensen-huang.jpg', 'Jensen Huang en escenario'], ['cotizaciones.mp4', 'logo de NVIDIA / sede']]],
	['nvidia30', [['grafica.mp4', 'acción de NVIDIA subiendo en verde'], ['cotizaciones.mp4', 'ticker NVDA en pantalla']]],
	['suben', [['grafica.mp4', 'Nasdaq en verde'], ['tableta.mp4', 'Anthropic / Claude en pantalla']]],
	['ojo', [['tableta.mp4', 'operador mirando la pantalla en plena sesión'], ['cotizaciones.mp4', 'cotizaciones cambiando']]],
	['volatilidad', [['grafica-cae.mp4', 'gráfica que sube y baja (volatilidad)'], ['grafica.mp4', 'rebote en pantalla']]],
	['bloomberg', [['wall-street.mp4', 'Bloomberg / Wall Street'], ['periodico.mp4', 'titular de Bloomberg']]],
	['fed', [['capitolio.mp4', 'Reserva Federal (edificio Eccles) / Capitolio']]],
	['hacemos', [['analista.mp4', 'analista explicando datos'], ['directivos.mp4', 'directivos en reunión']]],
	['datos', [['periodico.mp4', 'titulares de prensa'], ['tableta.mp4', 'datos en una tableta']]],
];
const orden = Object.keys(E) as (keyof typeof E)[];
const PASO = 90; // 3 s
const CORTOS = ['maquina-chips.mp4', 'analista.mp4', 'periodico.mp4', 'fotos/jensen-huang.jpg']; // clips de menos de 10 s: siempre desde el inicio
export const BROLL: ClipBroll[] = [];
let n = 1;
for (const [k, pool] of POOLS) {
	const desde = k === 'gancho' ? 0 : E[k];
	const hasta = E[orden[orden.indexOf(k) + 1]];
	let i = 0;
	for (let f = desde; f < hasta - 30; f += PASO, i++) {
		const [src, que] = pool[i % pool.length];
		BROLL.push({desde: f, src: `${A}/${src}`, etiqueta: `BROLL_${String(n++).padStart(2, '0')}: ${que}`, inicio: CORTOS.includes(src) ? 0 : (i * 60) % 150});
	}
}
