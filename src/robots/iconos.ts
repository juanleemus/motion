// Íconos de línea (caja 100×100). relleno: 'a' azul tech, 'b' azul oscuro.
import type {Trazo} from './ui';

const circulo = (cx: number, cy: number, r: number) =>
	`M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0Z`;


// Polígono girado alrededor de (cx, cy): sirve para aspas y piezas repetidas.
const girar = (pts: [number, number][], ang: number, cx = 50, cy = 50) =>
	'M' +
	pts
		.map(([x, y]) => {
			const a = (ang * Math.PI) / 180;
			const dx = x - cx;
			const dy = y - cy;
			return `${(cx + dx * Math.cos(a) - dy * Math.sin(a)).toFixed(2)} ${(cy + dx * Math.sin(a) + dy * Math.cos(a)).toFixed(2)}`;
		})
		.join(' L') +
	'Z';
// Elipse girada centrada en (50, 50).
const orbita = (rx: number, ry: number, ang: number) => {
	const a = (ang * Math.PI) / 180;
	const dx = rx * Math.cos(a);
	const dy = rx * Math.sin(a);
	return `M${(50 - dx).toFixed(2)} ${(50 - dy).toFixed(2)}a${rx} ${ry} ${ang} 1 0 ${(2 * dx).toFixed(2)} ${(2 * dy).toFixed(2)}a${rx} ${ry} ${ang} 1 0 ${(-2 * dx).toFixed(2)} ${(-2 * dy).toFixed(2)}`;
};
const aspa: [number, number][] = [[50, 42], [45, 24], [50, 6], [55, 24]];

export const ICONOS: Record<string, Trazo[]> = {
	persona: [
		{d: 'M16 90c0-20 15-33 34-33s34 13 34 33Z', relleno: 'a'},
		{d: circulo(50, 30, 18), relleno: 'b'},
	],
	alerta: [
		{d: 'M50 10 L93 86 H7 Z', relleno: 'a'},
		{d: 'M50 38 V62'},
		{d: 'M50 74 V75'},
	],
	fantasma: [
		{d: 'M22 90 V46 a28 28 0 0 1 56 0 V90 l-9.33 -8 -9.33 8 -9.33 -8 -9.33 8 -9.33 -8 -9.33 8Z', relleno: 'a'},
		{d: circulo(39, 46, 5), relleno: 'b'},
		{d: circulo(61, 46, 5), relleno: 'b'},
	],
	robotaxi: [
		{d: 'M10 70 V54 l11 -20 c2 -4 5 -6 10 -6 h38 c5 0 8 2 10 6 l11 20 v16 c0 3 -2 5 -5 5 H15 c-3 0 -5 -2 -5 -5Z', relleno: 'a'},
		{d: 'M25 50 l7 -13 h36 l7 13Z', relleno: 'b'},
		{d: circulo(28, 75, 9), relleno: 'b'},
		{d: circulo(72, 75, 9), relleno: 'b'},
		{d: 'M43 28 V19 h14 v9', relleno: 'b'},
		{d: 'M34 11 q16 -10 32 0'},
	],
	ojo: [
		{d: 'M6 50 Q50 8 94 50 Q50 92 6 50Z', relleno: 'a'},
		{d: circulo(50, 50, 14), relleno: 'b'},
	],
	ficha: [
		{d: circulo(50, 50, 40), relleno: 'a'},
		{d: circulo(50, 50, 22), relleno: 'b'},
		{d: 'M50 10 V24 M50 76 V90 M10 50 H24 M76 50 H90'},
	],
	telefono: [
		{d: 'M32 6 h36 a8 8 0 0 1 8 8 v72 a8 8 0 0 1 -8 8 h-36 a8 8 0 0 1 -8 -8 v-72 a8 8 0 0 1 8 -8Z', relleno: 'a'},
		{d: 'M50 26 a13 13 0 0 1 13 13 c0 10 -13 22 -13 22 s-13 -12 -13 -22 a13 13 0 0 1 13 -13Z', relleno: 'b'},
		{d: 'M43 82 h14'},
	],
	red: [
		{d: 'M50 50 L18 20 M50 50 L82 20 M50 50 L18 80 M50 50 L82 80'},
		{d: circulo(50, 50, 14), relleno: 'a'},
		{d: circulo(18, 20, 10), relleno: 'b'},
		{d: circulo(82, 20, 10), relleno: 'b'},
		{d: circulo(18, 80, 10), relleno: 'b'},
		{d: circulo(82, 80, 10), relleno: 'b'},
	],
	calendario: [
		{d: 'M14 20 h72 a8 8 0 0 1 8 8 v58 a8 8 0 0 1 -8 8 h-72 a8 8 0 0 1 -8 -8 v-58 a8 8 0 0 1 8 -8Z', relleno: 'a'},
		{d: 'M6 42 H94'},
		{d: 'M32 8 V28 M68 8 V28'},
	],
	chip: [
		{d: 'M28 28 h44 v44 h-44Z', relleno: 'a'},
		{d: 'M40 40 h20 v20 h-20Z', relleno: 'b'},
		{d: 'M38 28 V14 M50 28 V14 M62 28 V14 M38 72 V86 M50 72 V86 M62 72 V86'},
		{d: 'M28 38 H14 M28 50 H14 M28 62 H14 M72 38 H86 M72 50 H86 M72 62 H86'},
	],
	rayo: [{d: 'M58 6 L22 56 H46 L40 94 L78 40 H54 Z', relleno: 'a'}],
	servidor: [
		{d: 'M16 10 h68 v22 h-68Z', relleno: 'a'},
		{d: 'M16 39 h68 v22 h-68Z', relleno: 'a'},
		{d: 'M16 68 h68 v22 h-68Z', relleno: 'a'},
		{d: 'M28 21 v1 M28 50 v1 M28 79 v1'},
		{d: 'M44 21 H72 M44 50 H72 M44 79 H72'},
	],
	ciudad: [
		{d: 'M8 92 V50 h22 v42', relleno: 'b'},
		{d: 'M30 92 V16 h26 v76', relleno: 'a'},
		{d: 'M56 92 V36 h18 v56', relleno: 'b'},
		{d: 'M74 92 V60 h18 v32', relleno: 'a'},
		{d: 'M4 92 H96'},
		{d: 'M38 30 v1 M48 30 v1 M38 46 v1 M48 46 v1 M38 62 v1 M48 62 v1'},
	],
	torre: [
		{d: 'M50 6 L72 94 H28 Z', relleno: 'b'},
		{d: 'M14 26 H86 M22 46 H78'},
		{d: 'M14 26 v9 M86 26 v9 M22 46 v9 M78 46 v9'},
		{d: 'M39 52 L66 94 M61 52 L34 94'},
	],
	enchufe: [
		{d: 'M28 38 h44 v20 a22 22 0 0 1 -44 0Z', relleno: 'a'},
		{d: 'M40 38 V14 M60 38 V14'},
		{d: 'M50 80 V96'},
	],
	sol: [
		{d: circulo(50, 50, 20), relleno: 'a'},
		{d: 'M50 6 V18 M50 82 V94 M6 50 H18 M82 50 H94 M19 19 L27 27 M73 73 L81 81 M81 19 L73 27 M27 73 L19 81'},
	],
	molino: [
		{d: 'M47 48 L43 94 H57 L53 48Z', relleno: 'b'},
		{d: girar(aspa, 0, 50, 44), relleno: 'a'},
		{d: girar(aspa, 120, 50, 44), relleno: 'a'},
		{d: girar(aspa, 240, 50, 44), relleno: 'a'},
		{d: circulo(50, 44, 5), relleno: 'b'},
	],
	llama: [
		{
			d: 'M50 6 C62 26 78 38 78 62 a28 28 0 0 1 -56 0 C22 46 32 38 36 26 C42 34 44 40 48 42 C52 30 52 18 50 6Z',
			relleno: 'a',
		},
		{d: 'M50 90 a12 12 0 0 1 -12 -12 c0 -10 8 -14 12 -24 c4 10 12 14 12 24 a12 12 0 0 1 -12 12Z', relleno: 'b'},
	],
	atomo: [
		{d: orbita(44, 15, 0)},
		{d: orbita(44, 15, 60)},
		{d: orbita(44, 15, 120)},
		{d: circulo(50, 50, 10), relleno: 'a'},
	],
	planta: [
		{d: 'M14 92 C22 72 22 44 18 24 H54 C50 44 50 72 58 92 Z', relleno: 'a'},
		{d: 'M60 92 V72 a15 15 0 0 1 30 0 V92Z', relleno: 'b'},
		{d: 'M24 14 c4 -7 10 -7 13 0 c3 -7 10 -7 13 0'},
		{d: 'M4 92 H96'},
	],
	modulo: [
		{d: 'M50 8 L88 27 L50 46 L12 27Z', relleno: 'b'},
		{d: 'M12 27 V71 L50 92 V46Z', relleno: 'a'},
		{d: 'M88 27 V71 L50 92 V46Z', relleno: 'a'},
		{d: circulo(31, 62, 7), relleno: 'b'},
		{d: 'M60 58 L78 49 M60 70 L78 61'},
	],
	pastilla: [
		{d: circulo(50, 50, 40), relleno: 'a'},
		{d: circulo(50, 50, 24), relleno: 'b'},
		{d: circulo(50, 50, 9)},
	],
	licencia: [
		{d: 'M20 6 h42 l18 18 v70 h-60Z', relleno: 'a'},
		{d: 'M62 6 v18 h18'},
		{d: 'M30 40 H68 M30 52 H68 M30 64 H52'},
		{d: circulo(66, 78, 10), relleno: 'b'},
	],
	contrato: [
		{d: 'M20 6 h42 l18 18 v70 h-60Z', relleno: 'a'},
		{d: 'M62 6 v18 h18'},
		{d: 'M30 38 H68 M30 50 H68 M30 62 H60'},
		{d: 'M30 80 q5 -10 10 0 t10 0 t10 0'},
	],
	empresa: [
		{d: 'M18 92 V18 h46 v74', relleno: 'a'},
		{d: 'M64 92 V44 h20 v48', relleno: 'b'},
		{d: 'M10 92 H92'},
		{d: 'M30 32 v1 M42 32 v1 M52 32 v1 M30 48 v1 M42 48 v1 M52 48 v1 M30 64 v1 M52 64 v1'},
		{d: 'M36 92 V76 h10 v16'},
	],
	chat: [
		{d: 'M14 16 h72 a8 8 0 0 1 8 8 v42 a8 8 0 0 1 -8 8 h-40 l-18 16 v-16 h-14 a8 8 0 0 1 -8 -8 v-42 a8 8 0 0 1 8 -8Z', relleno: 'a'},
		{d: 'M30 45 v1 M50 45 v1 M70 45 v1'},
	],
};
